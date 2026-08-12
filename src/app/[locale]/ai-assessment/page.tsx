import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AssessmentForm } from "@/components/forms/assessment-form";
import { Reveal } from "@/components/motion/reveal";
import { StatementList } from "@/components/pv/blocks";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";

/**
 * ============================================================================
 * TRANG CHUYỂN ĐỔI DUY NHẤT CỦA SITE
 * ----------------------------------------------------------------------------
 * Mọi CTA "Đánh giá cơ hội ứng dụng AI" trên site đều đổ về đây. Vì vậy trang
 * này chỉ có một việc: LÀM NGƯỜI TA ĐIỀN FORM. Chữ trên trang không phải để
 * thuyết phục lại từ đầu — người bấm vào đây đã đọc chỗ khác rồi; nó chỉ để gỡ
 * bốn câu hỏi cuối cùng mà registry ghi ở entry `ai-assessment`: nhận được gì ·
 * mất bao lâu · có tốn phí không · phải cung cấp những gì.
 *
 * MỘT SECTION, KHÔNG PHẢI HAI. Bản trước có một section hero riêng chỉ chứa
 * tiêu đề, nên form bị đẩy xuống dưới nếp gấp: section cao trọn một màn hình
 * (xem `section.tsx`), tức muốn thấy ô nhập đầu tiên thì phải cuộn qua trọn một
 * viewport chỉ có ba dòng chữ. Trang bán hàng thì được, trang chuyển đổi thì
 * không. Nay tiêu đề và form đứng cùng một màn hình, hai cột.
 *
 * CỘT PHẢI RỘNG HƠN (0.85 · 1.15). Cột trái là chữ để ĐỌC MỘT LẦN rồi thôi;
 * cột phải là thứ người ta phải THAO TÁC, và nó chứa một textarea cùng một lưới
 * hai ô mỗi hàng. Chia đều thì ô nhập hẹp lại mà chữ bên trái thì thừa chỗ.
 *
 * FORM LÀ MỘT KHỐI CÓ KHUNG, tiêu đề nằm TRONG khung — đúng cấu trúc của
 * `assessment-drawer.tsx` (khung · vạch ngăn · form). Cùng một form xuất hiện ở
 * hai chỗ trên site thì hai chỗ phải đọc ra là một vật, không phải hai. Vì tiêu
 * đề đã vào trong khung nên form nhận `bare`: giữ viền của chính nó nữa là hai
 * lớp hộp lồng nhau.
 *
 * NGÂN SÁCH CHỮ. Trang cũ có 5 mục "bạn nhận được" + 4 mục "cần chuẩn bị" +
 * 4 ô chờ, tức hai danh sách và một hàng rào cảnh báo dựng chắn trước form.
 * Nay còn 3 mục và một câu, tổng ~100 từ chữ đọc. Luật ở CLAUDE.md: một section
 * tối đa một danh sách, một danh sách tối đa 4 mục.
 *
 * BA Ô CHỜ CŨ GỘP CÒN MỘT. `feeGap` + `slaGap` là ba câu hỏi cùng một loại —
 * điều kiện của buổi làm việc — nên chúng là MỘT ô chờ (`termsGap`), đặt ngay
 * dưới phần trả lời vì đó là chỗ người đọc hỏi. `ownerGap` (ai nhận lead) là
 * câu hỏi nội bộ, người mua không quan tâm: nó sống trong `registry.ts` để
 * `/track` đếm, không nằm trên mặt trang. `crmGap` bị XOÁ HẲN — nó viết "biểu
 * mẫu chưa gửi đi đâu", nay không còn đúng: form POST sang `/api/lead` và route
 * chuyển tiếp tới `LEAD_WEBHOOK_URL`. Thứ còn thiếu là một biến môi trường,
 * không phải một quyết định nội dung.
 * ============================================================================
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assessment.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AiAssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("assessment");

  return (
    <Section sky="void" className="pt-32 lg:pt-40">
      {/* `items-start`: cột trái ngắn hơn khung form và nó phải bám mép trên,
          không giãn cho bằng. */}
      <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="flex flex-col gap-10">
          {/* `size="headline"` mà vẫn là `h1`: cấp thẻ là dàn bài, cỡ chữ là
              chỗ trống. Cỡ `display` mặc định lên tới 72px, trong một cột chưa
              đầy nửa trang thì tiêu đề này rớt xuống ba dòng và đẩy luôn ô nhập
              đầu tiên xuống dưới nếp gấp. */}
          <SectionHeader
            as="h1"
            size="headline"
            eyebrow={t("hero.eyebrow")}
            title={t("hero.title")}
            lead={t("hero.lead")}
          />

          <div>
            {/* Tiêu đề và danh sách là MỘT CÂU bị cắt làm hai phần: "Xong buổi
                đó, bạn có" → ba gạch đầu dòng. Đừng viết lại tiêu đề thành một
                câu tự đủ nghĩa, ba mục kia sẽ thành thừa. */}
            <SectionHeader as="h2" size="title" title={t("receive.title")} />
            <StatementList
              className="mt-4"
              items={[1, 2, 3].map((n) => t(`receive.r${n}`))}
            />
          </div>

          <Reveal className="flex flex-col gap-6">
            <p className="max-w-[68ch] text-body-sm text-muted-foreground">
              {t("prepare")}
            </p>
            <Gap kind="confirm">{t("termsGap")}</Gap>
          </Reveal>
        </div>

        <Reveal
          direction="left"
          className="overflow-hidden rounded-xl border bg-surface"
        >
          <div className="border-b p-6 lg:p-8">
            <h2 className="font-display text-subhead font-semibold">
              {t("form.title")}
            </h2>
            <p className="mt-3 text-body-sm text-muted-foreground">
              {t("form.lead")}
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <AssessmentForm bare />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
