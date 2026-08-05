---
name: pv-i18n
description: Quản lý đa ngôn ngữ vi/en/ko cho website Pebble Vina theo quy tắc vi-first — trong lúc dựng chỉ sửa tiếng Việt, và chỉ ở bước preflight mới dịch sang en/ko từ bản vi. Dùng skill này khi thêm khoá dịch, sửa messages, kiểm tra khoá thiếu, hoặc khi người dùng nói "dịch i18n", "điền ngôn ngữ", "sync locale", "preflight i18n", "chuẩn bị release", "thêm tiếng Hàn", "chuỗi này chưa dịch".
---

# i18n vi-first cho Pebble Vina

Đọc `docs/I18N.md` để hiểu cơ chế. Skill này là quy trình thao tác.

## Chế độ 1 — đang dựng tính năng (mặc định)

**Chỉ sửa `messages/vi.json`. Không đụng `en.json` và `ko.json`.**

Khoá nào en/ko chưa có sẽ tự rơi về vi (gộp sâu trong `src/i18n/request.ts`),
nên trang không vỡ. Dịch sớm là dịch đi dịch lại.

Đặt khoá theo vai trò trong trang, không theo nội dung:
`home.hero.title` ✅ · `home.bienAiThanh` ❌

Không nhét HTML vào chuỗi. Không ghép chuỗi từ nhiều khoá — thứ tự từ khác nhau
giữa các ngôn ngữ. Tránh `{` `}` trong văn bản (next-intl hiểu là ICU).
Danh sách thì dùng mảng, đọc bằng `t.raw()`.

## Chế độ 2 — preflight (chuẩn bị phát hành)

Chạy khi người dùng nói "preflight", "chuẩn bị release", "điền ngôn ngữ".

**Bước 1 — liệt kê khoá thiếu.**
So `vi.json` với `en.json` và `ko.json`, lấy mọi đường dẫn khoá có ở vi mà thiếu
hoặc rỗng ở locale kia. Báo số lượng trước khi dịch.

**Bước 2 — dịch từ vi.**
Dịch nghĩa, không dịch từng chữ. Giữ nguyên:
- cấu trúc khoá và lồng nhau
- placeholder ICU và dạng số nhiều
- tên riêng: Pebble Vina, Pebble Square, MINT, PAPAYA, ESPRESSO
- tên hệ thống và thuật ngữ đã là tiếng Anh trong bản gốc: ERP, CRM, MES, PoC,
  RAG, on-premise, agent, guardrail

**Bước 3 — chỉnh giọng theo từng thị trường.**
- **en**: giọng doanh nghiệp Mỹ, câu ngắn, chủ động. Không dịch nguyên văn cấu
  trúc tiếng Việt. Tránh mọi từ đã bị cấm ở bản vi (cutting-edge, revolutionary,
  seamless, robust, leverage, empower, transform your business).
- **ko**: giọng 기업용 B2B, dùng 하십시오체 hoặc 해요체 nhất quán — chọn một và
  giữ suốt. Chức danh và thuật ngữ doanh nghiệp theo cách gọi phổ biến ở Hàn.

**Bước 4 — kiểm tra độ dài.**
Tiếng Anh thường ngắn hơn vi khoảng 15%, tiếng Hàn dài hơn ở tiêu đề. Xem lại
mọi heading và nhãn nút: chỗ nào xuống dòng xấu thì rút gọn bản dịch, không sửa
layout.

**Bước 5 — xác minh.**
```bash
pnpm build
```
Rồi mở `/en` và `/ko`, quét bằng mắt tìm chỗ còn sót tiếng Việt. Điểm hay sót:
nhãn aria, meta title/description, nội dung trong `<Gap>`, nhãn ở
`src/content/registry.ts` (trường `objective`, `questions`, `gaps` hiện là tiếng
Việt và **không đi qua i18n** — nếu cần đa ngữ thì phải chuyển sang messages).

## Không dịch những thứ này

- `src/content/registry.ts` — dữ liệu nội bộ, phục vụ bảng `/track`.
- Ô chờ `<Gap>` ở giai đoạn chưa phát hành — chúng là ghi chú nội bộ.
- Slug URL. Ba ngôn ngữ dùng chung đường dẫn, chỉ khác tiền tố locale.

## Kiểm lại

- [ ] vi vẫn là bản đầy đủ nhất?
- [ ] Không khoá nào chỉ có ở en/ko mà không có ở vi?
- [ ] Placeholder và số nhiều giữ nguyên?
- [ ] Tên riêng không bị dịch?
- [ ] Heading không bị vỡ dòng ở ko?
- [ ] `pnpm build` sạch và ba locale đều mở được?
