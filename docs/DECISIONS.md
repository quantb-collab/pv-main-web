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

## 2026-08-05 — Tách "control" thành một tầng token riêng
**Bối cảnh:** Nút dùng `rounded-lg` (10px) trên chiều cao 32px — tỷ lệ đó trông
tròn và mềm. Sửa `--radius` để nút vuông hơn thì kéo theo cả thẻ, ảnh và
`BeforeAfter`.
**Chọn:** Thêm `--radius-control` (6px), `--shadow-control`,
`--shadow-control-hover` ở LỚP 2, remap trong `.tone-dark`. Nút, input và
select trigger dùng bộ token này; thẻ và ảnh vẫn theo `--radius`.
**Vì:** Bo góc của control và bo góc của khối nội dung là hai quyết định khác
nhau. Buộc chúng vào một biến nghĩa là mỗi lần chỉnh nút phải chấp nhận thẻ
đổi theo.
**Đã cân nhắc và bỏ:** hạ thẳng `--radius` (kéo theo thẻ/ảnh); viết
`rounded-[6px]` tại chỗ (vi phạm luật 2, `check:tokens` không bắt được px).
**Đổi lại thì phải sửa:** khối control trong LỚP 2 + `.tone-dark`, đăng ký ở
LỚP 4.

## 2026-08-05 — Đổ bóng chỉ dành cho control
**Bối cảnh:** Hệ này dùng viền tóc thay đổ bóng (`CardGrid` cách nhau bằng
`gap-px bg-border`). Nhưng nút phẳng hoàn toàn thì không đọc ra là bấm được.
**Chọn:** Bóng chỉ gắn vào variant có bề mặt — `default`, `outline`,
`secondary`, `destructive`. `ghost` và `link` không có bóng. Trên nền tối,
bóng đen vô hình nên token đổi sang vạch sáng inset ở cạnh trên.
**Vì:** Ngoại lệ có ranh giới rõ thì vẫn là hệ nhất quán; đổ bóng ở mọi nơi mới
là phá hệ.
**Đổi lại thì phải sửa:** `--shadow-control*` trong `globals.css`. Component
không phải đụng.

## 2026-08-05 — `CtaButton` gom nút dẫn trang
**Bối cảnh:** Sáu chỗ chép lại cùng một khối `Button asChild` + `Link` +
`ArrowRight` kèm class hover giống hệt nhau.
**Chọn:** `src/components/pv/cta-button.tsx`. Prop `arrow` tắt mũi tên cho nút
phụ.
**Vì:** Mũi tên là động từ của nút. Gom một chỗ thì nhãn bỏ được "Xem" mà người
đọc vẫn hiểu là đi tới trang khác — nhãn ngắn lại trung bình 6 ký tự.
**Đổi lại thì phải sửa:** `cta-button.tsx` và các call site.

## 2026-08-05 — Thang cao control 36/40/44px
**Bối cảnh:** shadcn bản mới mặc định h-8/h-9 — thang của app UI dày đặc, không
phải của trang bán hàng. Nhãn `cta.assessment` 27 ký tự nằm trong nút cao 32px
với padding ngang 10px.
**Chọn:** `sm` h-9, `default` h-10, `lg` h-11, padding ngang px-3.5/4/5. Input
và SelectTrigger kéo theo cho khớp hàng trong header.
**Vì:** Nút CTA chính của hero là phần tử được bấm nhiều nhất trên site. 32px
là dưới ngưỡng 44px khuyến nghị cho vùng chạm trên di động.
**Đổi lại thì phải sửa:** `size` trong `button.tsx`, `input.tsx`, `select.tsx` —
cả ba đều bị `shadcn add` ghi đè, đã ghi chú ngay trong file.

## 2026-08-05 — Hero khoá đúng một viewport, căn giữa, ảnh làm nền
**Bối cảnh:** Hero cũ dùng `min-h-[92svh]` + `justify-center` — sàn tối thiểu
chứ không phải chiều cao cố định, nên khối nội dung ngắn hơn để lại hai dải
trống không ai kiểm soát. Thêm `mt-16` của scroll hint đẩy tiếp xuống. Tiêu đề
`max-w-[15ch]` ở `text-7xl` vỡ thành 4 dòng, sinh dòng cụt "hành của".
**Chọn:** `min-h-dvh`, nội dung căn giữa cả hai trục, ảnh chủ đạo chuyển từ thẻ
`MediaFrame` dọc bên phải thành lớp nền toàn khung có scrim. Tiêu đề nới lên
`max-w-[25ch]` để nằm 2 dòng ở desktop.
**Vì:** First view là thứ quyết định người đọc có cuộn tiếp hay không. Ô trống
không giải thích được là mất niềm tin ngay giây đầu.
**Đã cân nhắc và bỏ:** split hai cột với ảnh tràn mép phải; bỏ ảnh, cột phải
thành chỉ mục 5 tầng năng lực.
**Ràng buộc kéo theo:** first view giờ phụ thuộc vào một tấm ảnh nền thật.
Chưa có thì `GapChip` ở góc dưới phải giữ nợ đó. Yêu cầu ảnh nằm ở khoá
`home.hero.mediaNeed`.

## 2026-08-05 — Hero chỉ nhắc "AI" đúng một lần
**Bối cảnh:** Bản cũ có "AI" ba lần trong ba dòng (eyebrow, tiêu đề, lead) cùng
với "full-stack", "năng lực vận hành", "hệ thống AI kiểm soát được".
**Chọn:** "AI" chỉ xuất hiện trong tiêu đề. Eyebrow nói phạm vi bằng chữ thường
("Từ quy trình đến hạ tầng"), lead nói cách bắt đầu, không nhắc công nghệ.
Tiêu đề mới: "AI làm phần việc lặp lại, người giữ quyết định".
**Vì:** Nhắc lại một từ khoá ba lần biến khẳng định thành khẩu hiệu. Tiêu đề
mới đồng thời trả lời nỗi lo lớn nhất của người mua Enterprise — mất quyền
kiểm soát — đúng ràng buộc blueprint về "doanh nghiệp tự hành".
**Đã cân nhắc và bỏ:** dải ba bằng chứng ghim đáy hero (proof1–3) — người dùng
đánh giá là không rõ ràng, đã xoá khỏi `messages/vi.json`.
**Đổi lại thì phải sửa:** khối `home.hero` trong `messages/vi.json`.

## 2026-08-05 — Gradient highlight cho từ khoá, dẫn xuất từ brand ramp
**Bối cảnh:** Cần "AI" nổi lên như một hook thị giác trong câu chữ thường.
**Chọn:** Ba token gradient + hai lớp quầng (`--highlight-*`) khai ở LỚP 2,
`.tone-dark` remap. Utility `pv-highlight` dùng `background-clip: text`.
Component `<Highlight>` gắn sẵn vào `SectionHeader`, `Card`, `StatementList`
và hero.
**Vì:** Gắn vào block dùng chung thay vì sửa từng trang — trang mới ghép từ
block là tự có. Gradient dẫn xuất từ `--pv-brand-*` nên khi chốt brand kit chỉ
sửa LỚP 1.
**Đã cân nhắc và bỏ:** đánh dấu thủ công bằng rich text `<ai>` trong
`messages/vi.json` (phải sửa 45 chuỗi và mọi call site sang `t.rich`); tô cả
chữ nhỏ và chip (chữ phát sáng ở 11px là nhiễu).
**Giới hạn đã biết:** `background-clip: text` cần `color: transparent`, nên
chế độ forced-colors phải có nhánh trả chữ về `currentColor` — đã có trong
utility.
**Bẫy đã gặp:** `<Highlight>` bản đầu chỉ xử lý chuỗi trần nên bỏ sót tiêu đề
thẻ của `IndexGrid` — chỗ đó truyền `title` là element `<a>`. Đã cho đệ quy
vào cả element, có chốt chặn `children == null` để `cloneElement` không xoá
ruột thẻ rỗng như `<br />`.
**Đổi lại thì phải sửa:** khối `--highlight-*` trong `globals.css`, biểu thức
nhận diện từ khoá trong `highlight.tsx`.

## 2026-08-05 — Thang chữ theo vai trò, thay cho thang Tailwind mặc định
**Bối cảnh:** Thân bài đang chạy `text-sm` 14px ở thẻ, bước quy trình và footer,
nhỏ hơn chuẩn đọc của trang B2B. Cỡ chữ nằm rải rác trong 102 chỗ dưới dạng
`text-lg`, `text-[11px]`, `text-[2.75rem]` — không token nào cai quản, nên hai
component cùng vai trò lại ra hai cỡ khác nhau. Weight cũng phẳng: tiêu đề 600,
tiêu đề thẻ 500, eyebrow 400 nhìn mảnh và chìm.
**Chọn:** Mười một vai trò khai ở LỚP 3 (`--pv-text-*` + `--pv-leading-*` +
`--pv-tracking-*`), đăng ký ở LỚP 4 nên mỗi utility mang sẵn cả ba thuộc tính:
`text-display` `text-headline` `text-subhead` `text-title` `text-lead`
`text-body` `text-body-sm` `text-ui` `text-meta` `text-micro` `text-eyebrow`.
Cỡ dùng `clamp()` co giãn giữa 375px và 1440px. Weight rút còn ba nấc 600/500/400.
`body` nhận `text-body` làm mặc định.
**Vì:** Vai trò thì gọi tên được ở chỗ dùng và sửa được ở một chỗ; cỡ thì không.
`clamp` bỏ hẳn các bậc `sm:` `lg:` `xl:` vốn phải nhớ đồng bộ ở từng component.
Ba con số cụ thể đã cân trong token: thân bài 16→17.5px; line-height không dưới
1.35 cho chữ chạy vì tiếng Việt chồng hai tầng dấu (ữ, ế, ộ) nên dấu chạm nhau
trước khi chữ chạm nhau; tracking đi ngược cỡ chữ nên `globals.css` bỏ luôn
`tracking-tight` áp chung cho h1–h3 — nó ép h3 24px nhận cùng độ siết với h1 72px.
**Đã cân nhắc và bỏ:** chỉnh lại giá trị của chính thang Tailwind (`--text-sm`,
`--text-base`…) — làm vậy thì `src/components/ui/` do shadcn sinh ra cũng đổi
theo, và lần `shadcn add` sau sẽ lệch; đặt `--text-*--font-weight` để utility
mang luôn weight — cùng lớp `utilities` nên `font-normal` viết sau không chắc
đè được, weight vì thế vẫn khai tay ở component.
**Ràng buộc kéo theo:** phần ưu tiên của `clamp` phải luôn có thành phần `rem`
(`1.8rem + 3vw`), không được dùng `vw` trần — `vw` trần thì phóng to chữ của
trình duyệt không ăn, vi phạm WCAG 1.4.4. Nav header phải siết `px-3` → `px-2.5`
để bù phần weight 500 làm chữ rộng ra: sáu mục tiếng Việt cộng wordmark, chuyển
ngữ và CTA đã sát mép ở đúng 1024px. Bỏ weight 300 khỏi `next/font` vì không chỗ
nào dùng — font này không phải variable font nên mỗi nấc là một file tải riêng.
**Đổi lại thì phải sửa:** khối thang chữ trong LỚP 3 và phần đăng ký ở LỚP 4 của
`globals.css`. Component không phải đụng.
