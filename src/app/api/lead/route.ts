import { NextResponse } from "next/server";

/**
 * ============================================================================
 * NHẬN LEAD TỪ BIỂU MẪU KHẢO SÁT
 * ----------------------------------------------------------------------------
 * Đây là chỗ DUY NHẤT dữ liệu biểu mẫu rời khỏi trình duyệt. Trước khi có file
 * này, `assessment-form.tsx` chỉ `setSent(true)` — người dùng đọc "Đã nhận
 * thông tin" trong khi không có gì được gửi đi đâu cả.
 *
 * KHÔNG NHÚNG THẲNG MỘT CRM CỤ THỂ. Route chỉ chuyển tiếp nguyên văn tới URL
 * khai ở `LEAD_WEBHOOK_URL`, vì tới lúc viết thì chưa ai chốt lead đổ về đâu
 * (danh sách chờ quyết định trong `CLAUDE.md`). Một webhook nhận JSON là mẫu số
 * chung của mọi lựa chọn đang cân nhắc: HubSpot, Salesforce Web-to-Lead qua một
 * lớp trung gian, Zapier/Make, Google Apps Script, hay một kênh Slack. Chốt CRM
 * rồi thì chỉ đặt biến môi trường, KHÔNG phải sửa file này.
 *
 * CHƯA KHAI BIẾN THÌ TRẢ LỖI, KHÔNG TRẢ THÀNH CÔNG. Đây là điểm cốt lõi: thà
 * người dùng thấy "không gửi được, email thẳng cho chúng tôi" còn hơn tưởng đã
 * gửi rồi ngồi đợi một cuộc gọi không bao giờ tới. Cùng lý do đó, route KHÔNG
 * tự nuốt lỗi của webhook.
 *
 * DỮ LIỆU KHÔNG ĐƯỢC GHI LOG. Biểu mẫu này chứa tên, email công việc và mô tả
 * quy trình nội bộ của khách. Log lỗi chỉ ghi mã lỗi và trạng thái HTTP, không
 * ghi payload — xem `console.error` bên dưới.
 * ============================================================================
 */

export const runtime = "nodejs";
/* Không cache: mỗi lần gửi là một lần ghi, không phải một lần đọc. */
export const dynamic = "force-dynamic";

/** Thứ tự ở đây là thứ tự trường trong biểu mẫu, giữ cho khớp để dễ đối chiếu. */
const FIELDS = [
  "name",
  "email",
  "company",
  "role",
  "problem",
  "industry",
  "size",
  "department",
  "timeline",
  "phone",
] as const;

/** Bốn trường mà thiếu thì lead vô dụng — đúng bốn trường bắt buộc ở bước 1. */
const REQUIRED = ["name", "email", "company", "problem"] as const;

/** Trần độ dài mỗi trường. Chặn người dán nguyên một tài liệu vào ô mô tả. */
const MAX_LEN = 4000;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ code: "bad_request" }, { status: 400 });
  }

  /* Bẫy bot: một ô ẩn mà người thật không bao giờ nhìn thấy nên không bao giờ
     điền. Trả 200 chứ không trả lỗi — báo cho bot biết nó bị chặn thì lần sau
     nó lách. Không chuyển tiếp đi đâu. */
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const lead: Record<string, string> = {};
  for (const field of FIELDS) {
    const raw = body[field];
    if (typeof raw !== "string") continue;
    const value = raw.trim().slice(0, MAX_LEN);
    if (value) lead[field] = value;
  }

  const missing = REQUIRED.filter((field) => !lead[field]);
  /* `includes` trên một mảng hằng: `.some` sẽ phải ép kiểu, còn ở đây bốn tên
     trường là hằng nên kiểm tra chỉ là "có mặt hay không". */
  if (missing.length > 0) {
    return NextResponse.json({ code: "missing_fields", missing }, { status: 400 });
  }
  /* Kiểm email ở mức thấp nhất có ý nghĩa: có đúng một `@`, hai bên đều có ký
     tự, và phần sau có dấu chấm. Regex "đúng chuẩn RFC" dài vài trăm ký tự mà
     vẫn không nói được địa chỉ đó có thật hay không — thứ đó chỉ thư xác nhận
     mới trả lời được. */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ code: "bad_email" }, { status: 400 });
  }

  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint) {
    console.error("[lead] LEAD_WEBHOOK_URL chưa khai — không có chỗ nhận lead.");
    return NextResponse.json({ code: "not_configured" }, { status: 503 });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEAD_WEBHOOK_TOKEN
          ? { authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        source: "pebblevina.com/ai-assessment",
        receivedAt: new Date().toISOString(),
        lead,
      }),
      /* Đích là hệ thống của bên thứ ba. Không đặt hạn thì một webhook treo sẽ
         giữ request của người dùng cho tới khi chính nền tảng cắt. */
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      console.error(`[lead] webhook trả ${upstream.status}`);
      return NextResponse.json({ code: "upstream_failed" }, { status: 502 });
    }
  } catch (error) {
    console.error(
      `[lead] không gọi được webhook: ${error instanceof Error ? error.name : "unknown"}`,
    );
    return NextResponse.json({ code: "upstream_unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
