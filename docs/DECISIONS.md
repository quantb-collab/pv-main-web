# Nhật ký quyết định

Chỉ thêm vào cuối. Không sửa, không xoá mục cũ. Quyết định bị đảo thì thêm mục
mới ghi rõ nó thay thế mục nào.

Ghi ở đây những gì **không suy ra được từ code**. Thứ code đã nói thì đọc code.

---

## 2026-08-05 — Dựng repo mới `pv-web` thay vì sửa `pv-main-web`
**Bối cảnh:** Đã có `pv-main-web` (Next 15, Tailwind v4, brand kit khoá
2026-07-07, `DESIGN-SYSTEM.md` + `SPEC-v1.md`).
**Chọn:** Repo mới, giữ nguyên bản cũ làm tham chiếu.
**Vì:** Nguyên tắc thị giác của bản cũ là "chuyển động tiết chế, không đổ bóng",
ngược với yêu cầu lần này là animation và tranh ảnh nhiều. Sửa tại chỗ sẽ phá
một hệ đang nhất quán để lắp một hệ khác.
**Đã cân nhắc và bỏ:** Ghi đè `pv-main-web` (mất bản tham chiếu); đặt trong
`pebble-vina/projects` (lồng repo trong repo).
**Đổi lại thì phải sửa:** toàn bộ repo.

## 2026-08-05 — Font Be Vietnam Pro thay cho Poppins
**Bối cảnh:** Yêu cầu ban đầu là Poppins làm font tạm.
**Chọn:** Be Vietnam Pro.
**Vì:** Poppins không có bộ ký tự tiếng Việt — Google Fonts chỉ cấp `latin` và
`latin-ext`, còn phần lớn chữ Việt có dấu nằm ở dải U+1EA0–U+1EF1 thuộc subset
`vietnamese`. Dùng Poppins thì ế, ộ, ữ rơi sang font hệ thống, chữ trong cùng
một dòng lệch nét. Be Vietnam Pro cùng họ geometric sans, hỗ trợ đủ.
**Đã cân nhắc và bỏ:** giữ Poppins và chấp nhận fallback (vỡ chữ trên site
vi-first); ghép Poppins + font phụ cho dấu (lệch nét trong cùng một từ).
**Đổi lại thì phải sửa:** khối font trong `src/app/[locale]/layout.tsx`. Biến
`--font-brand` giữ nguyên nên `globals.css` và component không phải đụng.

## 2026-08-05 — Màu brand để dạng placeholder trung tính
**Bối cảnh:** Người dùng muốn để sẵn biến và theme, chốt màu sau khi design chi tiết.
**Chọn:** Dựng đủ 5 lớp token, giá trị LỚP 1 là thang slate-blue trung tính có
ghi chú rõ là chưa chốt.
**Vì:** Dùng thang xám thuần thì không đánh giá được bố cục khi review; dùng màu
brand cũ thì dễ bị hiểu nhầm là đã chốt.
**Đổi lại thì phải sửa:** chỉ khối LỚP 1 trong `src/app/globals.css`.

## 2026-08-05 — Registry là nguồn sự thật về cấu trúc site
**Bối cảnh:** Cần track list rõ ràng theo kế hoạch, làm từ khung tới chi tiết.
**Chọn:** `src/content/registry.ts` khai báo 33 trang với 14 trường theo §25
blueprint; từ đó sinh footer, sitemap và bảng `/track`.
**Vì:** Bản chép tay thứ hai chắc chắn sẽ lệch. Một nguồn thì bảng theo dõi
không bao giờ sai so với thực tế khai báo.
**Đổi lại thì phải sửa:** `site-footer.tsx`, `sitemap.ts`, `track/page.tsx`.
**Nợ đã biết:** menu chính trong `site-header.tsx:24` vẫn viết cứng, chưa đọc
`inNav` từ registry — trái với chính quyết định này.

## 2026-08-05 — en/ko rơi về vi thay vì báo lỗi khoá thiếu
**Chọn:** Gộp sâu vi vào locale đang dùng trong `src/i18n/request.ts`.
**Vì:** Nội dung còn thay đổi liên tục; dịch sớm là dịch lại nhiều lần. Cho phép
en/ko để rỗng mà trang không vỡ, điền dần cũng được.
**Đánh đổi đã chấp nhận:** trang chưa dịch xong sẽ lẫn hai ngôn ngữ. Chấp nhận
lúc dựng, KHÔNG chấp nhận khi phát hành — preflight phải quét hết.

## 2026-08-05 — Tắt tự đoán ngôn ngữ theo Accept-Language
**Vì:** Khách Việt Nam hay dùng trình duyệt cài tiếng Anh; bật lên thì họ vào
`/` bị đẩy sang `/en`. Mặc định luôn tiếng Việt, người dùng tự đổi.
**Đổi lại thì phải sửa:** `localeDetection` trong `src/i18n/routing.ts`.

## 2026-08-05 — Thêm `<noscript>` ép hiện nội dung
**Bối cảnh:** Motion xuất `opacity:0` ngay trong HTML server-side (96 phần tử)
để tránh nháy khi hydrate. JS hỏng là phần lớn trang vô hình.
**Chọn:** Khối `<noscript>` trong `<head>` của layout gốc ép mọi phần tử đang
chờ animation hiện lại.
**Vì:** Rẻ, và chặn được kịch bản hỏng nặng nhất.
**Giới hạn đã biết:** không cứu được trường hợp JS lỗi *sau* khi tải xong.

## 2026-08-05 — `/track` chứ không phải `/_track`
**Vì:** Next coi thư mục bắt đầu bằng `_` là private folder, không tạo route.
Trang được che bằng `robots.ts` chặn toàn site và `robots: index false`.

## 2026-08-05 — Ngân sách chữ cho trang chủ
**Bối cảnh:** Bản đầu 1611 từ, ~8 phút đọc, quá dài với người mua Enterprise.
**Chọn:** Giữ nguyên 11 section của §9, siết bên trong: một danh sách tối đa 4
mục có mô tả, hoặc nhiều hơn nhưng chỉ là nhãn trần. Kết quả 1001 từ.
**Vì:** 11 section là mạch thuyết phục, bỏ section là gãy mạch. Chữ thừa nằm ở
chỗ liệt kê đến kiệt bên trong từng section.
**Đã cân nhắc và bỏ:** gộp/bỏ section (gãy mạch §9); giảm khoảng trắng
`--section-y` (mất cảm giác cao cấp — vẫn để ngỏ).
**Đổi lại thì phải sửa:** khối `home` trong `messages/vi.json` và
`src/components/home/sections.tsx`.

## 2026-08-05 — Thêm `pnpm verify` và script soát khoá messages
**Bối cảnh:** next-intl không làm build fail khi thiếu khoá; nó chỉ log console
rồi in nguyên `home.enterprise.e6` lên mặt trang.
**Chọn:** `scripts/check-messages.mjs` quét HTML đã build tìm chuỗi giống đường
dẫn khoá lọt vào phần chữ hiển thị. Gộp vào `pnpm verify`.
**Vì:** Toàn bộ nội dung site nằm trong JSON — một khoá gõ sai đủ để phát hành
một trang hỏng trước mặt khách hàng.
**Giới hạn đã biết:** chỉ soát trang đã build tĩnh, không soát nhánh chỉ hiện
khi tương tác.
