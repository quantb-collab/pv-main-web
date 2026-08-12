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

## 2026-08-05 — Footer mở bằng danh tính pháp nhân, không bằng câu tuyên ngôn
**Bối cảnh:** Footer đang mở bằng một câu closing cỡ lớn, phần liên hệ để `<Gap>`
chờ dữ liệu.
**Chọn:** Bỏ câu closing. Điền địa chỉ, điện thoại, email và mã số thuế thật.
Cột "Công ty" xếp theo giá trị chuyển đổi (contact → ai-assessment → about →
case-studies), không theo thứ tự sitemap.
**Vì:** `CtaBand` ngay phía trên đã nói xong bước tiếp theo; footer nhắc lại một
lần nữa thành hai lời mời ngang hàng, trái §23. Footer là điểm dừng cuối của
người quét trang — việc của nó là danh tính, đường đi và điều kiện pháp lý.
**Dữ liệu đã được xác nhận:** Landmark 72 (O1912, tầng 19, Cầu Giấy, Hà Nội),
`0345 913 369`, `contact@pebblevina.com`, MST `0111545175`. Người dùng xác nhận
là dữ liệu chính thức của pháp nhân ngày 2026-08-05. Đây là lần đầu site công bố
dữ liệu pháp nhân thật thay cho ô chờ — mọi thay đổi sau này phải hỏi lại nguồn.
**Đã cân nhắc và bỏ:** giữ `<Gap>` tới khi có brand kit — dữ liệu pháp nhân
không phụ thuộc brand kit, giữ thêm chỉ làm trang trông dở dang lâu hơn.
**Đổi lại thì phải sửa:** khối `footer.office` trong `messages/vi.json` và
`src/components/layout/site-footer.tsx`.

## 2026-08-05 — Chủ đề "đêm trước bình minh", ánh ló rạng màu LED xanh
**Bối cảnh:** Site đang chạy nhịp sáng/tối cổ điển — thân bài nền sáng, hero và
dải CTA nền tối. Người dùng chốt hướng thị giác mới: cả site là ban đêm, cụ thể
là khoảng trời tối ngay trước bình minh, và thứ ló rạng không phải nắng vàng mà
là ánh LED xanh của thiết bị đang chạy.
**Chọn:** Bỏ hẳn chế độ sáng. LỚP 2 còn một bảng màu duy nhất; `.tone-dark` bị
xoá; `<html>` mang cố định class `dark` để biến thể `dark:` của shadcn khớp với
nền thật. Thang `sky` năm nấc (`void` → `night` → `deep` → `rise` → `dawn`) thay
cho ba `tone` cũ, mỗi nấc remap cả nền lẫn chữ.
**Vì:** Nhịp sáng/tối là hai trạng thái lặp lại; nó không kể được một mạch. Năm
nấc đi một chiều thì bản thân việc cuộn trang trở thành một lần trời sáng, và
mỗi trang có một mở đầu và một kết thúc thị giác thay vì một chuỗi khối xen kẽ.
**Đã cân nhắc và bỏ:** giữ cả hai bảng màu và chỉ đổi giá trị bảng tối (còn một
chế độ sáng chết mà không trang nào dùng, chắc chắn sẽ trôi); đánh số nấc
(`sky={3}`) thay vì đặt tên (con số không nói được vì sao nấc đó đúng).
**Ràng buộc kéo theo:** nấc chỉ được đi lên trong một trang. `CtaBand` tự đặt
`dawn` nên mọi trang đều kết thúc ở cùng một chỗ sáng nhất; footer lùi về
`sky-deep` để dải CTA vẫn là điểm sáng cuối mắt dừng lại.
**Đổi lại thì phải sửa:** LỚP 1 (`--pv-brand-*`, `--pv-night-*`) và khối
`.sky-*` ở LỚP 2. Component không phải đụng.

## 2026-08-05 — Ranh giới giữa hai section là ánh sáng, không phải màu nền
**Bối cảnh:** Yêu cầu kèm theo là nền phải giúp phân biệt rõ các section liên
tiếp. Cách hiển nhiên — mỗi section một màu nền khác nhau — không dùng được:
mười một section trên trang chủ mà chỉ có năm nấc trời, và hai nền đêm cách
nhau 3% độ sáng thì mắt đọc ra là lỗi render chứ không phải ranh giới.
**Chọn:** Tách làm hai kênh. Nấc trời lo mạch dài của trang (thô, đi một
chiều). Ranh giới do `<Section>` tự vẽ: `pv-horizon` — vạch 1px ở mép trên,
sáng nhất ở giữa — cộng `pv-skyglow` — quầng LED dâng từ mép dưới. Cả hai đọc
một biến cường độ duy nhất `--sky-light` do `.sky-*` đặt.
**Vì:** Nhịp *mép trên tối → mép dưới có quầng → vạch sáng* đọc ra ranh giới
kể cả khi hai section cùng một nấc. Nhờ vậy nấc trời được tự do đi chậm theo
mạch nội dung thay vì phải nhảy chỉ để hai khối trông khác nhau.
**Giới hạn đã biết:** quầng có sàn 0.07 nên không nấc nào tắt hẳn — cố ý; đêm
không còn ánh sáng nào là đêm chết chứ không phải trước bình minh.
**Đổi lại thì phải sửa:** hai `@utility` ở LỚP 5 và cột `--sky-light` trong
khối `.sky-*`.

## 2026-08-05 — Section cao trọn một màn hình theo mặc định
**Bối cảnh:** Người dùng yêu cầu không còn khối nào nhỏ và chật.
**Chọn:** `<Section full>` mặc định bật — `min-h-dvh`, nội dung căn giữa hai
trục. `full={false}` chỉ dành cho trang công cụ nội bộ; hiện chỉ `/track` dùng.
**Vì:** `min-h` chứ không phải `h`: nội dung dài hơn thì section cao lên, không
cắt. Căn giữa xoá hết dải trống không ai kiểm soát ở hai mép — chính vấn đề đã
xử lý riêng cho hero ngày 2026-08-05, giờ thành luật chung.
**Đánh đổi đã chấp nhận:** trang dài hơn hẳn. Ngân sách "trang chủ trong khoảng
10 màn hình cuộn" trong skill `pv-ui` giờ là ràng buộc chặt chứ không còn dư
địa, và luật mật độ (một section, một ý) trở thành thứ giữ cho trang không phình.
**Đổi lại thì phải sửa:** mặc định của prop `full` trong
`src/components/pv/section.tsx`.

## 2026-08-05 — Ánh bình minh đổi từ LED xanh sang ngọc bích, nền thành titan sần
**Bối cảnh:** Bản LED xanh (hue 205→260, chroma tới 0.152) bị người dùng đánh
giá là "quê mùa". Yêu cầu thay bằng xanh ngọc bích đậm, và chất liệu màu của
dự án phải như titan sần.
**Chọn:** Brand ramp chuyển sang hue 167–176 với đỉnh chroma 0.128 nằm ở khúc
giữa thang (400–500) rồi tụt về hai đầu. Thang trời `--pv-night-*` hạ chroma
xuống 0.008–0.022 và trôi hue 240 → 174. Thêm `@utility pv-grain` — nhiễu
fractal SVG, hoà `overlay` — phủ lên mọi section, footer và hero.
**Vì:** Ba chỗ tạo ra cảm giác "quê" của bản cũ, sửa cả ba:
1. Chroma kịch trần ở đầu sáng — đó là màu của đèn báo nguồn. Đá quý sẫm nhất
   ở thân và nhạt dần ở chỗ ánh sáng xuyên qua, nên đỉnh chroma phải nằm giữa.
2. Nền đêm tự nó đã xanh (chroma 0.062) nên quầng bình minh chìm vào một nền
   cùng màu, không còn là ánh sáng chạm vào vật gì. Titan là kim loại xám —
   màu chỉ hiện ra ở chỗ ánh sáng chạm tới.
3. Bề mặt phẳng tuyệt đối đọc ra là màu tô, không phải vật liệu.
**Ràng buộc kéo theo:** chroma nền thấp và lớp hạt là MỘT quyết định, không
tách được. Gỡ `pv-grain` thì bộ số mới tụt xuống thành nền xám phẳng, tệ hơn
cả bản LED.
**Núm chỉnh duy nhất:** `opacity` của `pv-grain`. Không đổi `baseFrequency` —
nó quyết định cỡ hạt, và cỡ hạt phân biệt "kim loại nhám" với "ảnh nhiễu".
**Thay thế mục:** 2026-08-05 "Chủ đề đêm trước bình minh…" về phần màu; phần
cấu trúc thang `sky` của mục đó giữ nguyên.

## 2026-08-05 — Hero đổi sang định vị đối tác, bỏ eyebrow, CTA còn một
**Bối cảnh:** Người dùng viết lại toàn bộ chữ của first view.
**Chọn:** Bỏ eyebrow "Từ quy trình đến hạ tầng". Tiêu đề thành "Đối tác đồng
hành cùng chiến lược doanh nghiệp chuyển đổi số và ứng dụng công nghệ mới và
mạnh mẽ". Câu dẫn thành slogan "Công cụ không thay thế được con người, nhưng
những con người tốt nhất luôn biết lựa chọn và sở hữu những công cụ ổn định và
hiệu năng cao nhất." Nhãn `cta.assessment` đổi thành "Liên hệ" và đích đổi từ
`/ai-assessment` sang `/contact`.
**Vì:** Nút ghi "Liên hệ" mà mở ra trang đánh giá là nói dối chính nhãn của nó,
và để hai khoá cùng nhãn "Liên hệ" trỏ hai nơi thì sớm muộn cũng lệch.
**Hệ quả chưa xử lý:** tiêu đề mới không còn chữ "AI" nên `<Highlight>` không
bắt được gì — first view giờ không có từ khoá phát sáng nào, đúng màn hình mà
cả hệ quầng sáng được dựng ra để phục vụ. Cần chốt: chọn từ khác để tô (nới
`TERMS` trong `highlight.tsx`) hay chấp nhận hero chữ trắng trên nền tối.
**Đảo mục:** 2026-08-05 "Hero chỉ nhắc AI đúng một lần" — tiêu đề đó đã bị thay.
**Đổi lại thì phải sửa:** khối `home.hero` và `cta` trong `messages/vi.json`,
`HREF.assessment` trong `cta-band.tsx`, ba href ở hero + header.

## 2026-08-05 — Link phụ của hero thành gợi ý cuộn, không còn là link trang
**Bối cảnh:** Yêu cầu chuyển "Cách triển khai" xuống giữa gần đáy hero, kèm
mũi kép chỉ xuống, nhãn "Khám phá thêm".
**Chọn:** `ExploreCue` — anchor `#van-de` neo ở đáy hero, hai chevron chồng
lệch, animation `--animate-nudge`. Không còn trỏ sang `/how-we-deliver`.
**Vì:** Mũi kép chỉ xuống nằm ở mép dưới màn hình là một cử chỉ ai cũng đọc
được: "còn nữa ở phía dưới". Cho nó dẫn sang trang khác là nói dối cử chỉ đó.
`/how-we-deliver` vẫn có mặt ở menu chính.
**Đổi lại thì phải sửa:** `ExploreCue` trong `src/components/home/hero.tsx`.

## 2026-08-05 — Ánh bình minh chốt ở xanh da trời
**Bối cảnh:** Người dùng bác cả hai bản trước — xanh LED ("quê mùa") và ngọc
bích ("không ổn") — và chốt xanh da trời.
**Chọn:** Brand ramp hue 234–255, đỉnh chroma 0.122 ở nấc 500–600. Thang trời
`--pv-night-*` trôi 265 (than ngả chàm) → 238 (xanh da trời), chroma giữ
0.008–0.023 như cũ.
**Vì:** Ba thứ được rút ra từ hai lần hỏng trước và giữ nguyên ở bản này:
1. **Đỉnh chroma nằm giữa thang, không ở đầu sáng.** Bản LED gắt nhất đúng ở
   chỗ sáng nhất nên đọc ra là bóng đèn.
2. **Trần chroma 0.122, không 0.152.** Lam kịch chroma trên nền tối là màu của
   link chưa ghé thăm.
3. **Hue chỉ trôi 21 độ trên cả thang.** Bản LED trôi 55 độ nên đầu sáng ra
   cyan còn đầu tối ra chàm — không đọc ra là một màu.
Cộng với chroma nền cực thấp và lớp hạt titan (giữ nguyên từ mục trước), kết
quả là lam trầm trên kim loại nhám, không phải lam điện tử trên nền lam.
**Thay thế mục:** hai mục màu trước đó (LED xanh, và ngọc bích).
**Đổi lại thì phải sửa:** `--pv-brand-*` và `--pv-night-*` ở LỚP 1.

## 2026-08-05 — Tiêu đề dài trên ~60 ký tự dùng `text-headline`, vẫn là h1
**Bối cảnh:** Tiêu đề hero 97 ký tự ở vai trò `display` (72px tại 1440px) ra
bốn dòng cao hơn 300px — người dùng đánh giá là quá to và tốn diện tích.
**Chọn:** h1 của hero dùng `text-headline` (32→52px). Thẻ vẫn là `<h1>`.
**Vì:** Thang chữ chọn theo vai trò, nhưng `display` được cân cho tiêu đề dưới
50–60 ký tự; quá ngưỡng đó thì cùng một vai trò cho ra một khối chữ khác hẳn về
diện tích. Đây là ngoại lệ về ĐỘ DÀI, không phải về cấp tiêu đề — nên đổi cỡ
chứ không đổi thẻ, và cấu trúc heading của trang không suy suyển.
**Đã cân nhắc và bỏ:** thêm vai trò thứ mười hai `display-long` (một trường hợp
không đáng một vai trò mới, và `headline` đã đúng cỡ cần dùng); rút ngắn tiêu đề
(chữ là quyết định của người dùng, không phải của hệ thị giác).
**Đổi lại thì phải sửa:** class của `<motion.h1>` trong `hero.tsx`.

## 2026-08-05 — Câu dẫn hero rút thành slogan hai vế
**Bối cảnh:** Bản người dùng đưa dài 143 ký tự, đọc như một đoạn văn.
**Chọn:** "Công cụ không thay thế con người. Nhưng người giỏi nhất luôn chọn
công cụ mạnh và ổn định nhất." — 95 ký tự.
**Vì:** Giữ nguyên phép đối "công cụ ↔ con người" và giữ cả hai tính chất
(mạnh, ổn định), nhưng cắt hai mệnh đề lồng để câu nhớ được. Slogan phải đọc
xong trong một hơi.
**Đổi lại thì phải sửa:** `home.hero.lead` trong `messages/vi.json`.

## 2026-08-05 — Nhãn CTA chính là "Đặt lịch khảo sát", đích về `/ai-assessment`
**Chọn:** `cta.assessment` = "Đặt lịch khảo sát", `HREF.assessment` =
`/ai-assessment`, ba href ở hero + header theo cùng.
**Vì:** Đích phải khớp nhãn. Vòng trước nhãn là "Liên hệ" nên đích đã tạm chuyển
sang `/contact`; nhãn quay lại nói về khảo sát thì đích quay lại trang có form.
**Đảo mục:** phần đích của mục "Hero đổi sang định vị đối tác…" cùng ngày.

## 2026-08-05 — Hero chốt ở định vị "doanh nghiệp số tự vận hành"
**Chọn:** Tiêu đề "Pebble Vina — đồng hành cùng bạn xây dựng doanh nghiệp số tự
vận hành" (69 ký tự, vẫn ở `text-headline` theo luật trên 60 ký tự). Slogan hạ
từ `text-lead` xuống `text-body`. Thêm nút phụ "Xem hồ sơ năng lực" →
`/about`, variant `secondary`, không mũi tên.
**Vì nút phụ dùng `secondary` chứ không `outline`:** §23 cấm hai lời mời ngang
hàng. Nút viền đứng cạnh nút đặc vẫn đọc ra là hai lựa chọn cùng cấp; nút nền
đặc mờ thì đọc ra là hàng hai. Mũi tên là động từ của nút chính, nút phụ không
được mượn.
**Vì slogan hạ một nấc:** ở `text-lead` (21px) nó chỉ nhỏ hơn tiêu đề 2,5 lần
nên hai khối tranh nhau. Ở 17,5px khoảng cách thành 3 lần, mắt đọc ra thứ tự
ngay mà chữ vẫn trên ngưỡng thân bài.
**Nhịp dọc:** `gap-5` giữa tiêu đề và slogan (một ý, phải dính nhau), `mt-8`
trước hàng nút (≈1,6×). Ba khoảng bằng nhau thì ba khối đọc ra là một danh
sách, không phải một lời chào rồi một lời mời.
**Nợ đã biết:** "Hồ sơ năng lực" trong B2B Việt Nam thường là một file PDF.
`/about` là chỗ gần nhất hiện có. Khi Pebble Vina có hồ sơ thật thì nút này nên
trỏ vào file, không phải vào trang giới thiệu.
**Đổi lại thì phải sửa:** khối `home.hero` + `cta.profile` trong
`messages/vi.json`, và khối nút trong `hero.tsx`.

## 2026-08-05 — `tự vận hành` vào bộ từ khoá phát sáng
**Bối cảnh:** Từ khi tiêu đề hero bỏ chữ "AI", first view không còn từ nào
phát sáng — đúng màn hình mà cả hệ quầng sáng được dựng ra để phục vụ. Người
dùng yêu cầu tô các nội dung chính.
**Chọn:** `TERMS` trong `highlight.tsx` thành `/(\bAI\b|tự vận hành)/g`.
**Vì:** Đếm trước khi thêm. `tự vận hành` xuất hiện ĐÚNG MỘT LẦN trên toàn bộ
`messages` — nên thêm nó tô đúng một chỗ, chính là định vị ở tiêu đề hero. Đối
chiếu đã loại: `vận hành` 15 chỗ, `Pebble Vina` 19 chỗ — tô những từ đó thì cả
site phát sáng và không chỗ nào còn là điểm nhấn.
**Ràng buộc kéo theo:** `<Led>` là `inline-block` nên cụm từ khoá KHÔNG xuống
dòng được. Ba từ là trần; cụm dài hơn nằm trong tiêu đề ở khổ 375px sẽ tràn
ngang. Đã ghi thành luật ngay trong `highlight.tsx`.
**Đổi lại thì phải sửa:** `TERMS` và `IS_TERM` trong `highlight.tsx` — hai
biểu thức phải khớp nhau (`/g/` mang `lastIndex` nên không dùng chung được).

## 2026-08-05 — Trang trí là một hình biến tấu, không phải một bộ hoạ tiết
**Bối cảnh:** Người dùng yêu cầu thêm decorator ở từng section và một vector
đẹp cho trang chính.
**Chọn:** Đúng MỘT ý hình học, dùng ở hai cấp độ — `HorizonArc` (cung chân
trời ở đáy mọi section, độ đậm đọc `--sky-light`) và `DawnRings` (các vòng
đồng tâm toả lên từ đúng điểm `pv-skyglow` đặt nguồn sáng, chỉ ở hero trang
chủ). Cả hai ở `src/components/pv/decor.tsx`.
**Vì:** Mỗi section một hoạ tiết khác là mười thứ tiếng nói — đúng thứ luật 3
của repo cấm ở tầng layout, không có lý do gì cho phép ở tầng đồ hoạ. Một hình
biến tấu theo nấc trời thì trang có nhịp mà người đọc vẫn nhận ra mình đang
xem cùng một bầu trời từ đầu tới cuối.
**Vòng đồng tâm giải quyết một vấn đề có thật:** quầng `pv-skyglow` trước đó là
một vệt sáng không rõ từ đâu ra. Đặt các vòng đúng tâm quầng thì ánh sáng có
nguồn gốc nhìn thấy được.
**Ràng buộc kéo theo:** cung phải nhạt hơn quầng. Nó là đường viền của ánh
sáng; rõ hơn chính ánh sáng thì thành hình vẽ dán lên nền.
**Đổi lại thì phải sửa:** `decor.tsx` cho hình, `pv-arc` / `pv-rings` ở LỚP 5
cho khung và độ đậm.

## 2026-08-05 — Nút phụ hero dùng viền sáng, không dùng `secondary`
**Bối cảnh:** Bản `secondary` bị đánh giá là mờ nhạt, trùng nền.
**Nguyên nhân thật:** nền của `secondary` là `--surface-2`, mà thang sky định
nghĩa bề mặt = nấc trời kế tiếp. Ở hero (`sky-void`) hai màu đó gần trùng nhau.
Đây là ĐẶC TÍNH của thang sky, không phải lỗi variant — `secondary` vẫn đúng ở
các nấc sáng hơn.
**Chọn:** `variant="outline"` + nền trong suốt + viền `foreground/35`, icon
`FileText` ở đầu nhãn. Hover chỉ nhấc viền, không đổ nền: nút phụ được thấy,
không được mời.
**Bẫy đã gặp:** `<html>` mang class `dark` cố định nên `dark:border-input` và
`dark:bg-input/30` của variant vẫn sống. tailwind-merge chỉ gộp class cùng
biến thể, nên override không có `dark:` bị biến thể `dark:` sinh sau đè lại —
im lặng, `pnpm verify` vẫn sạch. Phải khai đủ cặp `dark:` cho từng override.
**Đổi lại thì phải sửa:** khối nút phụ trong `hero.tsx`.

## 2026-08-05 — Khối hero nới lên `max-w-5xl`, slogan bỏ giới hạn đo
**Chọn:** `max-w-4xl` (896px) → `max-w-5xl` (1024px). Slogan bỏ `max-w-[58ch]`.
**Vì:** Ở 4xl tiêu đề 69 ký tự rơi xuống ba dòng và slogan 95 ký tự thành hai.
Nới 128px là đủ để tiêu đề nằm hai dòng và slogan nằm trọn một dòng từ khổ
laptop trở lên.
**Ngoại lệ đã cân nhắc:** 95 ký tự một dòng vượt đo đọc chuẩn (`58ch` cho câu
dẫn). Chấp nhận vì slogan không phải văn bản chạy — nó là một câu đọc trong một
hơi, cắt đôi thì mất phép đối "công cụ ↔ con người". Ngoại lệ CHỈ cho hero;
mọi câu dẫn khác giữ `58ch`. `text-balance` lo khổ hẹp.
**Còn để ngỏ:** `--container-max` vẫn 1280px. Muốn cả site rộng ra thì đó là
núm riêng, sửa ở LỚP 3.

## 2026-08-06 — Trang chủ: gộp Problem + Outcomes thành ma trận ba nấc
**Bối cảnh:** Chủ dự án muốn section 3 "đưa ra giá trị khách muốn thấy ngay".
Đi qua bốn vòng: card đối ứng từng hàng → hai panel trước/sau → ba nấc tăng
tiến → chốt bản premium. Trang chủ đồng thời đang vượt ngân sách ~10 màn cuộn.
**Chọn:** MỘT section `Contrast` (`#ket-qua`) thay cả §9 S2 lẫn S3, dựng bằng
block `StageMatrix`: 4 hàng × 3 nấc (cổ điển → đã số hoá → tự hành cùng AI).
Hàng = 4 pain Layer A: Tra cứu · Chứng từ · Báo cáo · Phê duyệt. Nấc giữa cố ý
viết "được một nửa" — đa số khách Enterprise đứng ở đó, nhận ra mình thì nấc 3
mới có lý do. Tiêu đề một câu hỏi căn giữa "Doanh nghiệp bạn đang ở nấc nào?";
vế "option của chúng ta" để panel 3 tự nói bằng thị giác.
**Vì:** trình tự thuyết phục của blueprint mở đầu bằng "khách muốn đạt kết quả
gì"; gộp tiết kiệm một màn cuộn; ba nấc kể được cả vấn đề lẫn đích đến trong
một khung nhìn.
**Đã cân nhắc và bỏ:** bảng ghép đối ứng từng hàng (pairs — bị chê giống nhau);
hai panel trước/sau; GapChip "chờ đo" từng hàng và Gap proof dưới bảng (gỡ —
section không còn trưng khẳng định cần bằng chứng; muốn thêm số % thì phải có
case study kèm điều kiện đo); hàng "Tri thức" (trùng trục với Tra cứu — thay
bằng Phê duyệt, mục "quy trình nhiều bước" của Layer A); tiêu đề dài hai vế
(gãy 3 dòng text-headline, lệch layout).
**Đổi lại thì phải sửa:** `StageMatrix` trong `blocks.tsx`, `Contrast` trong
`home/sections.tsx`, khoá `home.contrast` trong `vi.json`, thứ tự `page.tsx`.

## 2026-08-06 — Viền gradient dùng `pv-edge`; premium panel = scale-110
**Bối cảnh:** viền gradient làm bằng trick `p-px` bị vỡ ở bốn góc bo; chủ dự
án yêu cầu panel 3 thành "extreme premium": hào quang tím, to hơn 10%, bo góc
nghệ thuật hơn.
**Chọn:** utility `pv-edge` (globals LỚP 5) — overlay absolute vẽ vòng viền
bằng mask ring, không chiếm slot subgrid. "Tím" = `brand-soft` (đáy ramp brand,
oklch hue 255) — không thêm hue mới ngoài ramp. Panel 3: quầng gradient
đậm-đáy-nhạt-đỉnh blur rộng thở theo `dawn-pulse` sẵn có, `lg:scale-110` +
`z-10`, `rounded-2xl` + góc trên-phải `2.25rem`. Nấc 1 bỏ nền cho `pv-grain`
xuyên qua — kéo giãn khoảng cách nấc 1↔3.
**Vì:** nguyên nhân viền vỡ đo được ở zoom 18×: ô con góc vuông đè lên chính
vòng viền trong vùng bo của hộp `overflow-hidden` — không phải lỗi subgrid.
Scale 1.06 đã thử và đọc thành "lệch" chứ không phải "to hơn" nên chốt 1.10.
Quầng nở dọc nhiều hơn ngang vì bản `-inset-4` đều làm tràn `scrollWidth`
1–3 px ở 1152/1280.
**Đã cân nhắc và bỏ:** box-shadow thường (hệ dùng viền tóc + ánh sáng, không
bóng đen); tím hue ~300 (quyết định cấp brand kit, chưa chốt); cột rộng
`1.15fr` thay scale (giữ làm đường lui nếu chê lệch hàng ~30 px của scale).
**Đổi lại thì phải sửa:** `pv-edge` ở `globals.css` LỚP 5 + mục tương ứng
trong `DESIGN-TOKENS.md`, khối panel trong `StageMatrix`.

## 2026-08-06 — Section 4: bento bốn nấc, số minh hoạ thay ô chờ vàng
**Bối cảnh:** Chủ dự án muốn "stat cards chứng minh section 3 không nói
suông" theo phong cách bento đa tầng (số + ảnh + chữ), nhưng công ty chưa có
case study xác minh. Các bản đầu đầy GapChip vàng và khung chờ ảnh — bị chê
("xoá hết warning đi"), và section tràn quá một màn hình vì ô ảnh 16:9.
**Chọn:** Bento 4 nấc qua MỘT prop `tier` (span + số lớp + bậc chữ đi cùng
nhau, không tách); trên mặt khách là SỐ MINH HOẠ sạch cảnh báo. Ba chốt an
toàn: `data-gap="proof"` vô hình trên từng số (QA và /track vẫn đếm — release
gate còn răng), ô note "Cách đo" ghi thẳng "số minh hoạ" trên trang, comment
cảnh báo trong `sections.tsx`. Ô ảnh MediaFrame rút khỏi lưới tới khi có ảnh
sản phẩm thật. Kèm fix `cn()`: `extendTailwindMerge` dạy thang chữ vai trò —
trước đó `text-display` bị coi là class màu và bị `text-brand/70` đè mất cỡ.
**Vì:** Chủ dự án sở hữu quyết định "mặt khách xem phải trông hoàn thiện";
luật "không bịa số" được giữ bằng tracking vô hình + công bố minh hoạ công
khai thay vì chrome cảnh báo.
**Đã cân nhắc và bỏ:** GapChip vàng từng ô và Gap block dưới lưới (chê xấu);
khung chờ ảnh need-box (bản chất là một cảnh báo nữa); vẽ chart/sparkline
trang trí (dashboard giả — cấm tuyệt đối); số thật (chưa tồn tại).
**Đổi lại thì phải sửa:** `StatTile`/`BentoGrid`/`BentoTile` trong
`blocks.tsx`, `Stats` trong `home/sections.tsx`, khoá `home.stats` trong
`vi.json`, `TEXT_ROLES` trong `src/lib/utils.ts`.

## 2026-08-07 — Rút Enterprise và FullStack khỏi trang chủ về trang riêng
**Bối cảnh:** Chủ dự án thấy hai section này thuộc về trang riêng, trang chủ
chỉ nên giữ nội dung cô đọng và móc khách.
**Chọn:** `Enterprise` → `/how-we-deliver/governance` (10 nhãn thành khối
"phạm vi kiểm soát" đặt TRÊN 4 card đi sâu sẵn có). `FullStack` → `/about`,
KHÔNG phải `/technology`; sơ đồ 5 tầng bỏ hẳn. Trang chủ đền bằng MỘT vế thêm
vào `home.who.r3Text`: "Phân quyền, nhật ký và điểm phê duyệt của con người là
mặc định, không phải gói thêm."
**Vì:** Bằng chứng cả hai là bản tóm tắt của trang khác nằm ngay trong code cũ
— chúng tự kết bằng nút "xem chi tiết" dẫn đúng sang trang đó. `/technology` đã
có LayerStack 8 tầng (bản 5 tầng là tập con) và trang đó tự khai dành cho
CTO/CIO/CISO, trong khi 4 lợi ích full-stack là lập luận cho CEO và mua hàng —
chúng chứng minh đúng h1 của `/about` vốn đang nói suông. Vế đền ở Identity là
để giữ luật blueprint "Enterprise là mặc định, không phải một menu riêng" và
trả câu hỏi số 4 của registry mà không tốn thêm khối nào.
**Đã cân nhắc và bỏ:** giữ bản rút gọn trên trang chủ (vẫn là mục lục);
`FullStack` → `/technology` (sai vai người đọc + trùng LayerStack).
**Đổi lại thì phải sửa:** `home/sections.tsx`, `app/[locale]/page.tsx`,
`about/page.tsx`, `how-we-deliver/governance/page.tsx`, khoá `deliver
.governance.scope*`/`e1..e10` và `about.fullstack` trong `vi.json`.

## 2026-08-07 — Phần cứng đứng TRƯỚC phần mềm, dựng thành kệ sản phẩm
**Bối cảnh:** Chủ dự án chốt phần cứng là mũi nhọn công nghệ cao và phải đứng
trên phần mềm, trình bày như một kệ hàng có tab đối tác.
**Chọn:** Hai section tách rời (`Hardware` `deep` → `Software` `rise`). Kệ:
tab đối tác (Pebble Square, mặc định) → hồ sơ đối tác cột trái → 3 tầng chip
cột phải, mỗi tầng 5 ứng dụng hiện 3 và trôi vòng.
**Vì:** Vị trí này đi ngược BA chỗ trong blueprint (cấm lấy chip làm trung
tâm; registry `home.forbidden` cấm danh sách chip ở đầu trang; lớp C không
được kéo chú ý khỏi lợi ích kinh doanh). Chủ dự án đã cân nhắc và quyết vì đây
là tài sản khác biệt nhất. Mâu thuẫn xử bằng KHUNG chứ không bằng vị trí:
eyebrow là "Phần cứng" chứ không phải tên sản phẩm, lead khai vai của section
là "lý do phần mềm phía trên chạy được", và khối ngay TRƯỚC CTA vẫn là bốn
việc bắt đầu được — không phải bốn con chip. Không thông số so sánh, không
datasheet, không bảng GPU/MCU/Cloud (thuộc `/technology/edge-hardware`).
**Đã cân nhắc và bỏ:** một lưới 6 thẻ gộp cả hai (lớp C ngang hàng lớp A);
`private-ai` + `industrial-edge-ai` trên trang chủ (là mô hình triển khai,
không phải chip — section quay về làm danh mục).
**Đổi lại thì phải sửa:** `Hardware`/`Software` trong `home/sections.tsx`,
`product-shelf.tsx`, khoá `home.hardware`/`home.software` trong `vi.json`.

## 2026-08-07 — Hồ sơ đối tác đặt CỘT TRÁI, không xếp dọc trên kệ
**Bối cảnh:** Chủ dự án muốn dưới tên tab là giới thiệu đối tác (đến từ đâu,
đội mạnh cỡ nào, sản phẩm tốt ra sao), rồi mới tới danh sách sản phẩm — nhưng
cũng vừa yêu cầu ô ảnh phải to hơn vì "nhỏ quá không show case tốt được".
**Chọn:** Hồ sơ nằm cột trái (20rem), ba tầng kệ cột phải. Thứ tự DOM vẫn là
giới thiệu → sản phẩm. Sau đó dời cả tab lên hàng tiêu đề để lấy thêm 44px.
**Vì:** Hai yêu cầu xung khắc trong ngân sách ~628px. Cột phải cao ~468px
trong khi cột trái trước đó chỉ dùng ~220px — đặt hồ sơ vào chỗ đang để không
thì KHÔNG cộng một pixel chiều cao nào. Xếp dọc thì ảnh phải tụt từ 120px
xuống ~88px. Khi thêm nhãn ứng dụng (18px/tầng), ảnh chốt ở 112px nhờ 44px lấy
từ hàng tab.
**Đã cân nhắc và bỏ:** xếp hồ sơ trên kệ theo chiều dọc (mất kích thước ảnh);
đưa nguyên 4 hồ sơ kèm ảnh như slide gốc (biến section thành trang About của
công ty khác).
**Đổi lại thì phải sửa:** `PartnerIntro`, hằng `ITEM`/`WINDOW` và prop
`header`/`action` trong `product-shelf.tsx`.

## 2026-08-07 — Nêu họ tên thật 4 lãnh đạo Pebble Square trên trang chủ
**Bối cảnh:** Chủ dự án yêu cầu ghi rõ tiến sĩ nào, đang làm gì ở đâu, học như
nào — sau khi bản nén đầu tiên cố ý bỏ tên riêng.
**Chọn:** Đưa đủ 4 hồ sơ, mỗi người ba dòng (tên · chức danh đang giữ · học ở
đâu và từng làm ở đâu). Kèm ô chờ `restricted` yêu cầu **sự đồng ý của chính
bốn cá nhân**, tách khỏi sự đồng ý của Pebble Square.
**Vì:** Tài liệu là thật và chủ dự án sở hữu quyết định. Nhưng tên thật kèm
lịch sử việc làm trên trang marketing công khai là dữ liệu cá nhân — Pebble
Square đưa slide nội bộ KHÔNG đồng nghĩa bốn người kia đã đồng ý lên web. Đánh
đổi đã chấp nhận: section phồng lên 311 từ (trần 120), 126 từ trong đó là hồ sơ.
**Đã cân nhắc và bỏ:** chỉ nêu tên bốn nơi họ từng làm (bản nén đầu, chủ dự án
bác); nêu tên nhưng bỏ nơi từng làm (mất phần thuyết phục nhất).
**Đổi lại thì phải sửa:** khoá `home.hardware.p1m*` trong `vi.json`,
`PartnerIntro` trong `product-shelf.tsx`.

## 2026-08-07 — CTA cuối trang mở drawer thay vì điều hướng
**Bối cảnh:** Chủ dự án muốn nút cuối trang mở drawer trượt từ phải, dùng
chung cho mọi nút khảo sát trên site.
**Chọn:** `AssessmentDrawerProvider` bọc ở layout — MỘT bản duy nhất cho cả
site, `useAssessmentDrawer()` để mở từ bất kỳ đâu. Chỉ `cta="assessment"` mở
drawer; `architecture`/`poc`/`contact`… vẫn là link. `/ai-assessment` GIỮ
NGUYÊN form nhúng trong trang.
**Vì:** Người vừa bị thuyết phục xong không nên phải rời trang để điền form —
rời trang là chỗ rơi rụng lớn nhất của phễu. Một bản duy nhất vì form là điểm
chuyển đổi duy nhất của site: hai bản thì sớm muộn lệch nhau và khi nối CRM
phải nối hai lần. Trang `/ai-assessment` vẫn là đích của link chia sẻ và kết
quả tìm kiếm nên không được biến thành trang rỗng.
**Đã cân nhắc và bỏ:** mỗi nút một instance Sheet riêng (không phải "dùng
chung", nhân đôi chỗ nối CRM); mọi cta đều mở drawer (các cta khác dẫn tới một
cuộc trao đổi cần đọc thêm, không phải một form).
**Đổi lại thì phải sửa:** `assessment-drawer.tsx`, `cta-band.tsx`,
`app/[locale]/layout.tsx`, prop `bare` trong `assessment-form.tsx`.

## 2026-08-07 — Card gộp ảnh + tên thiết bị, băng carousel người dùng cầm lái
**Bối cảnh:** Chủ dự án soi kệ phần cứng: "ô hiện tại không đủ to để cả ảnh và
content". Đúng — bố cục cũ cần ~670px trong ngân sách ~628px, ô ảnh bị ép còn
112px vuông, và tên thiết bị là một dòng chữ RIÊNG bên dưới ăn thêm 18px của
mọi tầng. Bản sửa đầu tiên (một ảnh 16:9 cho cả dòng chip, ứng dụng thành nhãn
trần) bị bác: chủ dự án muốn giữ mỗi thiết bị một ảnh.
**Chọn:** Một card = ảnh 16:9 + tên thiết bị ngay dưới, trong cùng khung viền.
Năm card mỗi dòng chip nằm trong một băng cuộn ngang có `snap`, hai nút trôi
hiện khi rê vào tầng. Bỏ `animate-marquee`.
**Vì:** Nhãn nằm TRONG card thì nó không còn tốn dòng nào của tầng, và phần
chiều cao đòi lại được đổ hết vào ảnh — 198×111 thay cho 112×112, gấp 1,75 lần
diện tích. Băng tự trôi bị bỏ vì nó bắt người đọc chờ đúng lúc thứ họ cần đi
ngang qua, mà dừng-khi-hover thì lại dừng đúng lúc chuột vô tình đi qua. Khung
cuộn ngang thật cho lại vuốt tay, trackpad và bàn phím miễn phí từ trình duyệt.
**Đã cân nhắc và bỏ:** tách đôi thành hai section (ảnh được 280×210 nhưng trang
chủ quay lại 8 khối, đảo quyết định vừa chốt); một ảnh lớn duy nhất cho cả
section; bỏ hẳn ảnh khỏi trang chủ.
**Đánh đổi đã chấp nhận:** ~668px so với ngân sách 628px — ở ĐÚNG 1440×900
section tràn ~40px, màn cao hơn thì vừa. Giữ một màn hình thì card phải tụt
xuống 176px và ảnh chỉ còn hơn ô cũ 1,2 lần, tức đổi mà như không đổi.
**Đổi lại thì phải sửa:** `CARD`/`ProductCarousel` trong `product-shelf.tsx`,
`lines` trong `Hardware` (`home/sections.tsx`).

## 2026-08-07 — Cột trái còn một hồ sơ CEO, bỏ ba hồ sơ còn lại
**Bối cảnh:** Đảo quyết định "Nêu họ tên thật 4 lãnh đạo Pebble Square" chốt
sáng cùng ngày. Chủ dự án: "đội ngũ kỹ thuật thì thôi, để info CEO và link web
là đủ" — hai con số bằng sáng chế và bài báo thì giữ.
**Chọn:** Cột trái còn: đến từ đâu · làm gì · người sáng lập (tên, chức danh,
học vấn và nơi từng làm) · link web đối tác · 200+ SCI và 800+ bằng sáng chế.
**Vì:** Bốn hồ sơ ba dòng trên trang chủ là trang About của một công ty khác —
126 từ cho một section trần 120 từ. Người đọc chỉ đang hỏi "ai đứng sau chỗ
này", một cái tên trả lời xong câu đó và link web là chỗ cho ai muốn đi sâu.
Được thêm: mỗi cái tên thật kéo theo một sự đồng ý phải đi xin, nay còn một.
**Đã cân nhắc và bỏ:** giữ bốn hồ sơ nhưng rút còn một dòng mỗi người (vẫn là
một danh sách người trên trang bán hàng, và mất phần thuyết phục nhất là nơi
từng làm).
**Đang thiếu:** địa chỉ web chính thức của Pebble Square. `PartnerIntro` không
vẽ gì khi thiếu `href` — link chết còn tệ hơn không có link — nên chỗ đó đang
trống và nằm trong `partnerGap`.
**Đổi lại thì phải sửa:** khoá `home.hardware.p1Ceo*` / `p1LeadLabel` /
`p1SiteLabel` trong `vi.json`, `PartnerIntro` trong `product-shelf.tsx`.

## 2026-08-07 — Ba dòng chip mang màu lấy từ chính cái tên
**Bối cảnh:** Chủ dự án: "3 card chip thì để màu liên quan tới tên, ví dụ MINT
thì màu bạc hà tinh tế".
**Chọn:** Ba token mới ở LỚP 1 `globals.css` — `--pv-chip-mint` (bạc hà),
`--pv-chip-papaya` (đu đủ), `--pv-chip-espresso` (cà phê). Màu chỉ xuất hiện ở
HAI chỗ: tên chip và mép sáng dưới chân tầng kệ.
**Vì:** Đây là ngoại lệ DUY NHẤT cho luật "mọi ánh sáng trên trang dẫn xuất từ
--brand", và nó được phép vì ở đây màu không đóng vai ánh sáng — nó là nhãn
phân biệt ba dòng sản phẩm, thứ mà một bảng chỉ có xanh da trời không nói được.
Chroma cả ba đặt THẤP HƠN `--pv-brand-400` (0.104) để dòng chip được nhận ra mà
không sáng hơn bình minh; hai nguồn sáng trên một trang là mất chủ đề.
**Đã cân nhắc và bỏ:** tô nền cả tầng kệ theo màu chip (ba mảng màu chiếm 500px
mặt trang, không còn là "tinh tế"); viết màu thẳng trong component (vi phạm
luật token, và lần đổi brand kit sau sẽ bỏ sót).
**Đổi lại thì phải sửa:** ba giá trị ở LỚP 1 `globals.css` và bảng `ACCENT`
trong `product-shelf.tsx`.

## 2026-08-07 — Băng sản phẩm tự trôi trở lại, nhưng theo BƯỚC chứ không liên tục
**Bối cảnh:** Đảo một phần quyết định "carousel người dùng cầm lái" chốt cùng
ngày. Chủ dự án: "slides products nên tự động slide".
**Chọn:** Băng tự đi MỘT card mỗi `SHELF.auto` (4,2s), hết băng thì về đầu.
Vẫn là khung cuộn ngang thật nên vuốt tay, trackpad, bàn phím và hai nút đều
ăn ngay. Bốn điều kiện dừng: con trỏ trong băng · bàn phím focus trong băng ·
băng chưa vào khung nhìn · `prefers-reduced-motion`. Ba tầng lệch pha
`SHELF.stagger` (1,3s).
**Vì:** Lời phản đối cũ với `animate-marquee` không phải là "tự trôi thì sai"
mà là "tự trôi thì người đọc mất quyền lái" — trôi liên tục không sống chung
được với `snap` và hai nút, và dừng-khi-hover của CSS lại dừng nhầm lúc chuột
vô tình đi qua. Trôi theo bước giữ nguyên mọi đường vào của người dùng: chạm
vào là dừng, buông ra là đi tiếp, và cú trôi dùng đúng hàm mà hai nút đang gọi.
Lệch pha ba tầng vì ba băng trôi cùng nhịp đọc ra là một cái bảng điện tử.
**Đã cân nhắc và bỏ:** quay lại `animate-marquee` trôi liên tục (mất `snap`,
mất hai nút, mất cả vuốt tay); tự trôi mà không dừng khi rê chuột (người đọc
không bao giờ đọc kịp một nhãn).
**Đổi lại thì phải sửa:** `SHELF` trong `src/lib/motion.ts`, `ProductCarousel`
trong `product-shelf.tsx`.

## 2026-08-07 — Card sản phẩm nổi lên bằng ánh sáng, không bằng đổ bóng
**Bối cảnh:** Chủ dự án bỏ viền card, rồi muốn "card nổi lên cho giống một tấm thẻ".
**Chọn:** Ba thứ, không thứ nào là `box-shadow`. (1) Nền dốc dọc
`from-surface to-surface-2` — mặt trên tối hơn mặt dưới. (2) Một vệt sáng mảnh
ở CHÂN thẻ, mờ dần về hai đầu. (3) Rê chuột thì thẻ nhấc 4px và vệt sáng ngả
sang màu brand.
**Vì:** Luật của repo là dùng viền và ánh sáng thay đổ bóng, mà đổ bóng trên
nền `#0C1016` cũng gần như vô hình. Trong thế giới của site này ánh sáng dâng
từ chân trời, nên vật nổi lên là vật **sáng ở mặt dưới** — cùng logic với mép
sáng chân tầng kệ và với quầng `pv-skyglow` của section. Vệt sáng mờ dần hai
đầu nên nó đọc ra là ánh sáng lọt xuống đáy thẻ, không đọc ra là cạnh viền vừa
bị gỡ. Nhấc bằng `transform` nên không đụng bố cục.
**Bẫy đi kèm:** `overflow-x-auto` ở track khiến trục dọc cũng thành `auto`, nên
cú nhấc 4px bị cắt cụt. Track phải có `py-1`, và tầng kệ hạ `py-3` xuống `py-2`
để bù — tổng chiều cao không đổi một pixel. Ngoài ra `MediaFrame` phải khai
`bg-transparent`, nếu không nền mặc định `bg-surface` của nó phủ một mảng phẳng
lên giữa gradient và thẻ lại thành phẳng.
**Đã cân nhắc và bỏ:** `box-shadow` (trái luật, và vô hình trên nền tối); trả
lại viền quanh thẻ (chính thứ vừa bị bỏ).
**Đổi lại thì phải sửa:** `<article>` trong `ProductCarousel`.

## 2026-08-07 — Chữ phụ toàn site nâng lên đạt AA, brand tách làm hai vai
**Bối cảnh:** Soát tương phản section phần cứng bằng phép tính WCAG trên token
thật: 4 loại chữ trượt AA — chức danh CEO 3,19:1 · thông số chip 3,72:1 ở 11px
· eyebrow và nhãn mono 3,72:1. Tên chip ESPRESSO 3,76:1, qua ngưỡng chữ lớn
nhưng mờ hơn MINT gấp đôi.
**Chọn:** Sửa ở TẦNG TOKEN chứ không ở component. (1) `--subtle-foreground`
đổi `ink-400` → `ink-350` mới (`oklch(0.8 0.0095 247)`), 3,7 → 5,4–5,5:1.
(2) Thêm `--brand-ink` = `pv-brand-300` cho chữ màu brand, 7,1:1 ở mọi nấc
trời; `--brand` giữ nguyên vai trò ánh sáng và đồ hoạ. (3) `--pv-chip-espresso`
nâng L 0,74 → 0,82, 3,8 → 6,3:1.
**Vì:** `--subtle-foreground` sống ở 12+ chỗ trong `blocks.tsx` và
`section.tsx` — sửa từng component thì vừa sót vừa làm các trang lệch nhau.
Giá trị chọn theo nấc trời SÁNG NHẤT còn dùng nó (`rise`), nên mọi nấc đều
đạt. `ink-350` cố ý không nhảy thẳng lên `ink-300`: bằng nhau thì
`--subtle-foreground` và `--muted-foreground` thành một và thang chữ mất một nấc.
**Đã cân nhắc và bỏ:** để `--brand` viết chữ (4,5:1 — vừa đúng ngưỡng, không
còn biên); đổi `text-brand/80` thành `text-brand` tại chỗ (chữa một chỗ, để
nguyên nguyên nhân).
**Đổi lại thì phải sửa:** LỚP 1 và LỚP 2 trong `globals.css`. Kiểm lại bằng
cách tính tương phản trên nền `--pv-night-3` (nấc `rise`).

## 2026-08-07 — Băng sản phẩm có nút dừng, một nút cho cả section
**Bối cảnh:** Băng tự trôi vi phạm WCAG 2.2.2 mức A — nội dung tự chuyển động
quá 5 giây, nằm cạnh chữ cần đọc, mà chỉ dừng được bằng cách rê chuột.
**Chọn:** MỘT nút play/pause đứng cạnh tab, điều khiển cả ba băng. Nhãn đổi
theo trạng thái (`motionPause` / `motionPlay`) thay vì dùng `aria-pressed`.
Không vẽ nút khi `prefers-reduced-motion` bật.
**Vì:** Dừng-khi-rê-chuột không phải là "cách dừng": người dùng bàn phím đang
đọc cột chữ bên trái và người dùng cảm ứng đều không rê được. Một nút chứ không
ba vì ba nút làm cùng một việc là ba lần hỏi cùng một câu, và chúng chen vào
đúng chỗ chật nhất của tầng kệ. Không vẽ nút khi reduced-motion vì lúc đó băng
vốn đứng yên — một nút "chạy lại" không làm gì là nói dối người dùng.
**Đổi lại thì phải sửa:** `ProductShelf` / `MotionToggle` trong
`product-shelf.tsx`, khoá `home.hardware.motion*` trong `vi.json`.

## 2026-08-10 — Section phần mềm là TRỤC ĐIỀU PHỐI theo trạng thái dữ liệu
**⛔ ĐÃ BỊ THAY THẾ trong cùng phiên** bởi mục *Kệ phần mềm — card sản phẩm có
ảnh* ở cuối tài liệu này. Giữ lại để biết vì sao lưới 4 thẻ bị bỏ; phần lập
luận về hình học và về việc không dựng lại bảng ba nấc vẫn còn đúng.
**Bối cảnh:** Bản cũ là lưới 4 thẻ giải pháp. Chủ dự án cần section này nói ba
điều mà bốn thẻ ngang hàng không nói được: sản phẩm chạy đa nền tảng (điện
thoại · máy bàn · web), tự hành thì cần AI đứng ĐÚNG GIỮA điều phối, và doanh
nghiệp bắt đầu được từ đúng chỗ mình đang đứng.
**Chọn:** Ba vùng xếp dọc theo TRẠNG THÁI CỦA DỮ LIỆU — vào → xử lý → ra — nối
nhau bằng sợi sáng; vùng giữa là lõi (`Context Provider`) và là thứ sáng duy
nhất. Mỗi vùng mang hai sản phẩm ăn sẵn lấy thẳng từ namespace `solutions`.
**Vì:** Ba lý do, theo thứ tự quan trọng.
(1) *Hình học tách hai section sản phẩm.* Kệ phần cứng ngay trên là ba hàng
NGANG rời nhau, mỗi hàng một món đồ độc lập. Trục phần mềm là ba vùng DỌC nối
nhau. Cùng vật liệu (viền tóc, `pv-edge`, không đổ bóng), khác hình học — nếu
cùng hình thì trang chủ đọc ra là một catalogue hai tầng.
(2) *Lõi nằm giữa là lập luận, không phải trang trí.* Vùng xử lý là chỗ duy
nhất trong section có ánh sáng và nó nằm đúng giữa, nên hình VẼ RA câu "tự hành
cần AI đứng giữa điều phối" mà không phải viết câu đó bằng chữ.
(3) *"Bắt đầu từ nấc mình đang đứng" không được dựng lại bảng ba nấc.* Contrast
phía trên đã có một bảng ba nấc; lặp lại chính là lỗi đã giết section StartHere
hôm 2026-08-07. Chia theo trạng thái DỮ LIỆU nói được cùng một điều bằng một
trục khác.
**Đã cân nhắc và bỏ:** ba tấm sản phẩm kèm dải chip nền tảng (an toàn, dựng
nhanh, nhưng vẫn là catalogue và không có "giữa"); ba tab theo nấc doanh nghiệp
(phục vụ vế "theo state" mạnh nhất nhưng là bảng ba nấc lần thứ hai, và tab thì
phần cứng vừa dùng xong).
**Đổi lại thì phải sửa:** `orchestration-flow.tsx`, hàm `Software` trong
`sections.tsx`, khoá `home.software.*` trong `vi.json`.

## 2026-08-10 — Sáu chip nguồn BẤM ĐƯỢC, mặc định trung tính
**Bối cảnh:** Cần cho người đọc thấy "thứ đang chạy thì nối vào, chỗ còn trống
thì dựng mới" mà không được khẳng định hộ họ đang có hay chưa có gì.
**Chọn:** Sáu chip nguồn (ERP · MES · CRM · WMS · chứng từ giấy · thiết bị
biên) là nút `aria-pressed`. Nghỉ = nét ĐỨT, chữ mờ. Bấm = nét LIỀN, chữ
`brand-ink`. Sợi nối xuống lõi sáng dần theo số nguồn được khai, bốn bậc rời
(`FLOW_LIT`).
**Vì:** Người đọc TỰ khai trạng thái của mình, nên trang không khẳng định gì cả
— đúng luật cấm bịa dữ liệu, mà vẫn nói được vế "build theo nấc anh đang đứng".
Nét đứt / nét liền là quy ước sơ đồ kỹ thuật và nói được điều màu không nói
được: đứt nghĩa là đường này chưa tồn tại. Bốn bậc rời chứ không nội suy liên
tục vì đổi màu mượt theo tỷ lệ thì mắt không đọc ra là có gì vừa thay đổi.
**Đã cân nhắc và bỏ:** mặc định "chưa có gì" rồi để người đọc bấm thêm — người
mua Enterprise mở trang ra mà thấy sơ đồ khai mình trắng tay là một câu chào
tệ; đánh dấu sẵn cái nào đã có cái nào chưa (là khẳng định hộ khách).
**Đổi lại thì phải sửa:** `OrchestrationFlow` và `FLOW_LIT` trong
`orchestration-flow.tsx`.

## 2026-08-10 — Hai section sản phẩm dùng CHUNG một công thức header
**Bối cảnh:** `Hardware` gộp eyebrow vào cùng dòng tiêu đề và hạ cỡ xuống
`subhead`; chú thích cũ ghi đó là "section DUY NHẤT" của trang chủ làm vậy.
**Chọn:** `Software` dùng đúng công thức đó — nhãn hạng mục kèm dấu hai chấm,
`eyebrowInline`, `size="subhead"`, thẻ vẫn `h2`. Chú thích ở `Hardware` sửa
thành "hai section".
**Vì:** Hai section sản phẩm đứng liền nhau thì phải đọc ra là MỘT CẶP; năm
section còn lại giữ eyebrow riêng dòng và cỡ `headline` nên cặp này vẫn tách ra
được. Nó cũng trả lại ~60px cho trục — `Software` nhờ đó vừa một màn hình
(~580px so với ngân sách ~628px), khác `Hardware` vốn tràn ~94px ở 1440×900.
**Đổi lại thì phải sửa:** prop `header` ở cả hai section trong `sections.tsx`.

## 2026-08-10 — `private-ai` và `industrial-edge-ai` quay lại trang chủ
**Bối cảnh:** Hai giải pháp này bị rút khỏi trang chủ 2026-08-07 vì đứng lẫn
giữa các dòng chip ở section PHẦN CỨNG thì chúng là mô hình triển khai nằm nhầm
chỗ, và giữ lại thì section quay về làm danh mục.
**Chọn:** Đưa lại, nhưng vào đúng vùng của trục phần mềm — `industrial-edge-ai`
ở vùng VÀO, `private-ai` ở vùng XỬ LÝ. Trang chủ nay hiện đủ cả 6 giải pháp,
mỗi vùng hai cái, và chỉ hiện `title`, không hiện `promise`.
**Vì:** Edge AI là chỗ dữ liệu SINH RA, Private AI là chỗ dữ liệu ĐƯỢC XỬ LÝ —
đứng ở trục này thì chúng đúng vai chứ không phải phụ lục. Không hiện `promise`
vì sáu dòng mô tả nữa thì trục thành một danh mục; luật mật độ cho phép quá 4
mục khi chúng là nhãn trần.
**Đổi lại thì phải sửa:** ba mảng `products` trong hàm `Software`.

## 2026-08-10 — Kệ phần mềm: card sản phẩm có ẢNH, thay cho trục điều phối
**Thay thế** mục *Section phần mềm là TRỤC ĐIỀU PHỐI theo trạng thái dữ liệu*
ở trên (cùng ngày, cùng phiên).
**Bối cảnh:** Trục điều phối dựng xong thì chủ dự án xem và bỏ: *"tôi cần vẽ
những ảnh để show off mà, vẽ rõ từng sản phẩm, mỗi sản phẩm có tên, lời dẫn và
các size sản phẩm"*.
**Chọn:** Một HÀNG card, mỗi card một sản phẩm, mỗi card bốn ô chữ theo đúng
thứ tự mắt cần — nhãn vai → tên → lời dẫn → dải size — đặt dưới một ảnh 16:9.
Ba sản phẩm: ERP · Context Provider · MES.
**Vì:** Một sơ đồ nói được QUAN HỆ giữa các thứ nhưng không trưng được THỨ ĐỒ.
Section này đứng cạnh kệ phần cứng vốn có 13 tấm ảnh thiết bị thật; một sơ đồ
đường kẻ bên cạnh đó đọc ra là phần mềm không có gì để cho xem. Bốn ô chữ là
đúng bộ thông tin chủ dự án yêu cầu, không thêm không bớt.
**Ba hệ quả kéo theo, đều có chủ ý:**
(1) *`Context Provider` xếp làm sản phẩm GIỮA*, chen giữa ERP và MES thay vì
đứng cuối theo lối "hai ứng dụng rồi mới tới nền tảng". Nó khai `core` nên là
card sáng nhất kệ — đó là toàn bộ phần còn lại của "AI đứng giữa điều phối" sau
khi sơ đồ bị bỏ, và nó đủ. Với số card CHẴN thì không có ô giữa và cách nói này
hỏng: thêm sản phẩm thứ tư phải nghĩ lại cách đánh dấu lõi.
(2) *Sáu link giải pháp rút xuống ba*, và ba link còn lại là trỏ TẠM sang trang
gần nghĩa nhất vì ba sản phẩm chưa có trang riêng. Nút "Xem tất cả giải pháp"
giữ nguyên nên danh mục không mất khỏi trang chủ.
(3) *Sáu chip nguồn bấm được bị gỡ.* ERP và MES nay là SẢN PHẨM, nên để chúng
đồng thời trong danh sách "hệ thống anh đã có" là tự mâu thuẫn. Vế "nối vào /
dựng mới" chuyển hẳn vào câu dẫn của section.
**Đã cân nhắc và bỏ:** giữ cả sơ đồ lẫn hàng card (một section chỉ có ~628px,
không chứa nổi hai); ba tấm ảnh thiết bị riêng cho mỗi cỡ màn hình (9 ảnh cho
một section, và cỡ màn hình không phải sản phẩm).
**Đổi lại thì phải sửa:** `software-shelf.tsx`, hàm `Software` trong
`sections.tsx`, khoá `home.software.*`, và `docs/IMAGE-BRIEF.md` §3.

## 2026-08-10 — Ảnh nhóm D: màn hình trong ảnh PHẢI CÂM
**Bối cảnh:** Ba card sản phẩm phần mềm cần ảnh. Cách hiển nhiên là render
thiết bị có giao diện trên màn — và công cụ sinh ảnh mặc định luôn vẽ một cái
dashboard vào đó.
**Chọn:** Cấm cứng. Màn hình chỉ được có ÁNH SÁNG (một vệt `#68B6E6` rất mờ),
không giao diện, không biểu đồ, không chữ, không logo — kể cả mờ, kể cả nhỏ.
Ba mức được phép, theo thứ tự ưu tiên: ảnh chụp sản phẩm THẬT → màn chỉ có ánh
sáng → màn tắt hẳn. Không có mức "vài mảng chữ nhật mờ gợi ý bố cục".
**Vì:** Blueprint cấm *"dashboard làm thông điệp chính"* và *"case study giả"*;
§4 của IMAGE-BRIEF đã ghi *"một giao diện bịa trên trang bán phần mềm là thứ
người mua Enterprise nhận ra nhanh nhất"*. Ảnh hiển thị ở 400×225 — gấp đôi
card thiết bị — nên một biểu đồ bịa ở đây đọc được, và nó đứng ngay cạnh câu
"chỗ còn trống thì dựng mới", tức thành lời hứa về tính năng chưa tồn tại.
**Kèm theo — nền thẻ nhóm D SÁNG HƠN nhóm A:** kệ phần mềm ở nấc `rise` nên
thẻ dốc `#1A232B → #232F37` (độ sáng 25→30), so với `#121920` (21) của card
thiết bị. Dải sáng an toàn của vật thể dịch từ 19–52 lên **30–58**. Một tấm
chuẩn nhóm A đem sang sẽ chìm.
**Đổi lại thì phải sửa:** `docs/IMAGE-BRIEF.md` §3 và mục nghiệm thu §6.

## 2026-08-11 — Giao diện PV One lên site: quy ước ảnh và khung riêng
**Bối cảnh:** Bộ bàn giao POC "Đơn hàng Sao Đỏ" (10/08/2026) cấp 5 màn desktop
thật của PV One. Trước đó site không có giao diện sản phẩm nào, nên
`IMAGE-BRIEF` §3.3 phải đặt luật "màn hình trong ảnh phải câm".
**Chọn:** Lập `docs/SOFTWARE-KIT.md` làm luật riêng cho mọi chỗ trưng giao diện
sản phẩm, và dựng `AppShot` (`src/components/pv/app-shot.tsx`) làm khung bắt
buộc. Ba luật cứng: (1) không giá trị nào của Aurora vào LỚP 1–2 của
`globals.css`; (2) mọi pixel Aurora nằm trong khung do site vẽ; (3) không chỉnh
màu ảnh — điều tiết bằng DIỆN TÍCH (≤45% section, chừa 96px cuối section cho
`pv-skyglow`).
**Vì:** Đo bằng oklch, nền màn Aurora `#0B1220` (L .183) so với nền section chỉ
cho **1.02–1.18:1** ở cả năm nấc trời — ảnh KHÔNG có mép, dán thẳng lên trang
là nó tan vào nền. Và azure `#2E63E6` có chroma .207, gấp **1,99 lần** trần
.122 của cả thang brand, hue lệch 26° về chàm: đúng thứ chú thích LỚP 1 ghi là
đã loại. Tức ảnh sản phẩm là một nguồn sáng thứ hai mạnh hơn bình minh, và chỉ
trị được bằng diện tích chứ không bằng chỉnh pixel.
**Đã cân nhắc và bỏ:** desaturate/tint ảnh cho hợp tông (chỉnh màu ảnh sản phẩm
là nói dối về sản phẩm); dựng lại giao diện bằng React (kéo theo 4 họ chữ mới
~180 KB, Lucide, và một bản sao sẽ lệch khỏi sản phẩm ngay lần cập nhật đầu).
**Đổi lại thì phải sửa:** `docs/SOFTWARE-KIT.md`, `app-shot.tsx`, và §3 của
`docs/IMAGE-BRIEF.md` (mục đó nay đã trỏ sang kit).

## 2026-08-11 — Ảnh màn PV One: render lại 2×, và thay avatar ảnh người
**Bối cảnh:** Bộ bàn giao có sẵn 5 PNG 1440×900, nhưng bản phóng to phải đọc
được chữ 13px nằm trong ảnh.
**Chọn:** Render lại từ chính 5 file `.dc.html` ở `deviceScaleFactor 2`, cắt
đúng khung màn **2880×1800**, giao PNG-24 (6,4 MB cả bộ) vào `public/software/`.
Trước khi chụp, thay `<img src="i.pravatar.cc">` ở topbar bằng khối CHỮ VIẾT
TẮT (NT · TH) trên bản chép của `screens/`.
**Vì:** Bản 1× nhoè ở bản phóng to trên màn retina. Avatar pravatar là mặt một
người thật trên trang công khai, và trái luôn atom A-05 của chính theme kit
(*"viết tắt tên, không ảnh"*). Sửa ở gốc rồi mới chụp, không bôi lên ảnh.
**Kèm theo:** khung màn nằm ở vị trí KHÔNG cố định giữa năm file (mép trên
645→776 ở 2×) vì tiêu đề trang dài ngắn khác nhau — phải DÒ bằng bề rộng dải
sáng, dò bằng một cột đơn sẽ bắt nhầm dòng tiêu đề. Kiểm: dải phải rộng đúng
2880. Và `next/image` mặc định `q=75`; bản phóng to dùng `q=90`, mức này phải
khai ở `images.qualities` trong `next.config.ts` — Next 16 trả HTTP 400 cho mọi
mức không khai, tức ảnh mất trắng chứ không xấu đi.
**Đã cân nhắc và bỏ:** WebP q92 (xuống ~250 KB/tấm, PSNR 41–46 dB) — tiết kiệm
5 MB nhưng chồng thêm một lần nén lên lần `next/image` sẽ nén; chỉ đổi khi bộ
ảnh vượt 10 MB.
**Đổi lại thì phải sửa:** `docs/SOFTWARE-KIT.md` §8, `public/software/`,
`STEP_SRC` trong `sections.tsx`.

## 2026-08-11 — Kệ phần mềm: bento + stepper lướt 1,5s, chữ dồn vào bản phóng to
**Bối cảnh:** Chủ dự án muốn vào section là thấy cả bộ sản phẩm dạng bento
(ô lớn nhất là PV One), stepper tự đổi **1,5 giây một bước**, và phần giải
thích thì DÀI hơn.
**Chọn:** Hai yêu cầu đó chỉ đứng chung được khi tách chỗ: **thẻ chỉ còn TÊN
MÀN**, còn toàn bộ đoạn giải thích (80–87 chữ mỗi màn) chuyển vào bản phóng to,
nơi người đọc tự bấm tới lui. Bản phóng to xếp **ảnh một bên, cột chữ cố định
20rem một bên**, kèm cụm điều hướng `‹ 02/05 ›` sticky ở đáy và phím ← →.
**Vì:** Ở tốc độ đọc 200 chữ/phút, 1,5 giây chỉ đủ **5 chữ**. Để một đoạn văn
chạy dưới nhịp đó không phải là "nhanh" mà là bày chữ ra cho người ta cố đọc
rồi hụt. Cột chữ CỐ ĐỊNH chứ không chia tỷ lệ, để mọi pixel thừa chảy vào ảnh —
chia 50/50 thì ở màn 1440 ảnh còn ~650px (0,45×) và bản phóng to hết lý do tồn
tại. Đánh đổi đã chấp nhận: ảnh đạt 0,80× trên màn ≥1600px nhưng chỉ **0,69×**
ở 1440px; giá của việc đặt lời giải thích cạnh ảnh thay vì bên dưới.
**Kèm theo — ba khoá dừng bắt buộc của nhịp nhanh:** rê chuột/focus; người dùng
tự bấm một bước (chốt MỘT CHIỀU — không có nó thì 1,5s sau lựa chọn của họ bị
giật mất); và bản phóng to đang mở (nên `open` do thẻ giữ, không để `Dialog` tự
giữ). Và **bỏ hết ngoặc kép quanh câu chốt**: một câu bán hàng đóng trong ngoặc
kép trên trang bán hàng đọc ra là lời khách hàng, tức testimonial bịa (§17).
**Đã cân nhắc và bỏ:** `Tabs` của shadcn cho stepper (`TabsTrigger` mang sẵn
`text-sm`, `flex-1`, gạch chân `after:` và sáu luật `dark:` — ghi đè hết, kèm
cặp `dark:` cho từng cái, dài và dễ hỏng hơn 25 dòng vai trò ARIA viết tay);
`Math.random()` cho thứ tự ô bento (server và client ra hai lưới khác nhau →
hydration mismatch, và bố cục đổi hình mỗi lần tải thì không còn là bố cục);
hai mũi tên đè hai mép ảnh kiểu lightbox cổ điển (che đúng sidebar và cột rail
phải — hai chỗ mang lập luận của màn).
**Đổi lại thì phải sửa:** `software-bento.tsx`, `app-shot.tsx`, `STEPPER` trong
`src/lib/motion.ts`, khoá `home.software.*`.

## 2026-08-11 — Ngân sách chiều cao của ô bento đo trên trình duyệt, và phần dư trả cho ảnh
**Bối cảnh:** Section phần mềm dựng xong nhưng chưa ai mở trình duyệt xem. Soi
lần đầu bằng headless Chrome qua CDP thì ô lớn có một **khoảng trống 91px** —
18% chiều cao ô — nằm đúng giữa, dưới tên màn. Docstring ghi "dư ~77px" và con
số đó không sai; cái sai là giả định rằng phần dư sẽ rải đều.
**Chọn:** Trả phần dư cho ẢNH. Khung poster `ultra` (21:9) → `wide` (16:9),
hàng lưới 10rem → 10,5rem, `PV One` lên `text-subhead`. Và từ nay ngân sách ô
bento phải **đo trên trình duyệt** trước khi ghi vào docstring.
**Vì:** Dãy bước bám đáy bằng `mt-auto`, nên mọi pixel dư dồn vào một chỗ thay
vì rải ra — cộng nhẩm từ token không nhìn thấy điều đó. Và chỗ dư ấy đứng ngay
dưới thứ quan trọng nhất section. Đo tiếp thì thấy 21:9 chỉ để lộ **68,6%**
chiều cao màn nguồn 16:10, tức `object-cover` xén 31% ở chân ảnh — và nó xén
ngang giữa một hàng bảng, đọc ra là ảnh lỗi chứ không ra một cửa sổ. 16:9 để lộ
90%, phần xén rơi vào dải dưới cùng.
**Đánh đổi:** `screen` (16:10, không xén một pixel nào) cần hàng 10,92rem và
section vượt 900px đúng 1px — nằm ngoài ngân sách, chỉ mở được nếu trả lại chỗ
ở một dòng khác.
**Đã cân nhắc và bỏ:** giữ 21:9 rồi kéo ngắn hàng lưới cho hết lỗ (ảnh là thứ
DUY NHẤT trong section mang bằng chứng, thu nó lại để lấy khoảng trắng là đổi
sai chiều); xếp nhãn vai trên tên `PV One` cho giống ba ô nhỏ (tốn thêm 21px mà
ngân sách chỉ dư 15 — cấp bậc đã đọc được bằng chênh lệch cỡ chữ).
**Đổi lại thì phải sửa:** `software-bento.tsx` (docstring mang toàn bộ phép
tính), `SOFTWARE-KIT.md` §4.

## 2026-08-11 — Nhịp lướt 1,5s phải có nút dừng thấy được, và chốt một chiều bị bỏ
**Bối cảnh:** Quyết định cùng ngày ở trên chốt ba khoá dừng cho nhịp 1,5s: rê
chuột/focus, bấm một bước (một chiều), và dialog đang mở. Soi lại thì cả ba đều
không phải một **control**: hai cái đầu không tồn tại trên màn cảm ứng, cái thứ
ba đòi người dùng mở dialog ra mới dừng được.
**Chọn:** Thêm một nút bấm được ở cuối dãy bước, và đổi `taken` (một chiều)
thành `paused` (hai chiều). Bấm một bước vẫn dừng như cũ, nhưng nay bật lại
được.
**Vì:** WCAG 2.2.2 (mức A) đòi một cách dừng cho nội dung tự đổi quá 5 giây;
vòng năm màn chạy 7,5 giây và lặp vô hạn. Chốt một chiều sinh ra để bảo vệ lựa
chọn của người dùng, nhưng nó cũng khoá luôn đường quay lại — mà cái giá đó
không cần trả khi đã có một nút riêng.
**Đã cân nhắc và bỏ:** đặt nút vào trong `tablist` (một nút không phải
`role=tab` nằm trong tablist là phá đúng cái mẫu ARIA dãy này đang khai); nhãn
chữ thay vì biểu tượng (hai chữ tiếng Việt cạnh dãy năm số mono là thêm một
tầng chữ vào chỗ đã chật — nhãn nằm ở `sr-only`, hình hai vạch thì không cần
dịch).
**Đổi lại thì phải sửa:** `software-bento.tsx`, `STEPPER.auto` trong
`src/lib/motion.ts`, khoá `home.software.pauseLabel` / `resumeLabel`.

## 2026-08-12 — Section đào tạo AI giữ bố cục của bản thiết kế nhưng bỏ ba màu tiêu đề
**Bối cảnh:** Chủ dự án đưa một bản thiết kế cho section đào tạo AI: hai cột,
cột phải là ba thẻ, mỗi thẻ có tiêu đề mono viết hoa được tô một màu riêng —
bạc hà, cam, xanh da trời.
**Chọn:** Dựng đúng bố cục, đúng chữ, đúng dãy thông số của bản thiết kế; riêng
ba tiêu đề thẻ thì cả ba cùng dùng `brand-ink`.
**Vì:** `globals.css` LỚP 1 ghi ba màu chip (mint · papaya · espresso) là
NGOẠI LỆ DUY NHẤT cho luật "mọi ánh sáng trên trang dẫn xuất từ `--brand`", và
ngoại lệ đó chỉ cấp cho kệ phần cứng, nơi màu đóng vai nhãn phân biệt ba dòng
sản phẩm CÓ THẬT. Ba thẻ ở đây là ba nguyên tắc song hàng của cùng một chương
trình — không có ba thực thể nào để phân biệt, nên màu ở đây chỉ còn là trang
trí, và ba nguồn sáng trong một section thì section mất chân trời. Nhịp thị
giác của bản gốc (tiêu đề mono viết hoa CÓ màu) vẫn giữ nguyên, chỉ là một hệ
màu thay vì ba. `brand-ink` chứ không phải `brand`: đo trên mặt thẻ được 9,3:1,
còn `brand` sinh ra cho quầng sáng và đem viết chữ 12px chỉ vừa đúng ngưỡng.
**Đánh đổi:** Ba thẻ nay giống hệt nhau về cường độ, nên thứ phân biệt chúng
chỉ còn là chữ. Chấp nhận được vì chúng vốn ngang hàng — cùng lý do đã ghi cho
ba panel của `TrackPanel`.
**Đã cân nhắc và bỏ:** dùng thang sáng ba bậc `STEP_LIT` (mờ → brand) cho ba
tiêu đề (nó nói "tiến trình", mà ba nguyên tắc này không phải ba bước nối tiếp;
và thẻ đầu sẽ đọc ra là kém quan trọng nhất); xin thêm hai màu vào LỚP 1 (đó
đúng là thứ luật kia sinh ra để chặn).
**Đổi lại thì phải sửa:** `training-program.tsx`, và trước hết là chú thích
ngoại lệ ở `globals.css` LỚP 1.

## 2026-08-12 — Section đào tạo không có nút phụ ở hàng tiêu đề
**Bối cảnh:** Bản thiết kế có nút "Xem chương trình →" ở góc phải hàng tiêu đề,
giống hai section sản phẩm đứng ngay trên. Registry chưa có entry nào cho mảng
đào tạo, tức chưa có trang để dẫn tới.
**Chọn:** Bỏ nút, cắm ô chờ `home.training.pageGap` mô tả chính xác thứ còn
thiếu. Có trang thì trả nút về đúng chỗ đó.
**Vì:** Đích duy nhất còn lại là `/ai-assessment`, mà `CtaBand` đứng cách đó
đúng một màn hình đã mời chính việc ấy với gần y nguyên nhãn — hai lời mời
giống hệt nhau nằm liền nhau làm yếu cả hai. Luật ô chờ của blueprint §24 nói
thiếu dữ liệu thì để ô chờ chứ không lấp tạm, và một nút dẫn sai chỗ đúng là
một cách lấp tạm. Đây cũng là kết luận mà bản nháp `training-tracks.tsx` của
phiên trước đã đi tới độc lập.
**Đánh đổi:** Section đào tạo là section sản phẩm duy nhất không có nút phụ,
nên hàng tiêu đề của nó trông trống hơn hai section anh em.
**Đổi lại thì phải sửa:** `registry.ts` (thêm entry trước), `sections.tsx`
(`Training`), `training-program.tsx` (thêm slot `action` vào hàng tiêu đề).

## 2026-08-12 — Ba section mảng kinh doanh mang số La Mã và một hình riêng
**Bối cảnh:** Chủ dự án yêu cầu ba section chính (phần cứng · phần mềm · đào
tạo) mỗi cái có một số La Mã lớn ở nền và một hình vẽ liên quan. `decor.tsx`
lại mở đầu bằng đúng câu cấm việc đó: "mỗi section một hoạ tiết khác" thì
"mười hoạ tiết là mười thứ tiếng nói".
**Chọn:** Làm, nhưng ba hình phải là ba TRẠNG THÁI của cùng một mặt phẳng dẹt
đã có trong `DawnRings`, không phải ba hình mới: một mặt lồng ba lớp (phần
cứng) · ba mặt chồng có cột nối (phần mềm) · một mặt với ba nấc dâng lên (đào
tạo). Cùng độ dẹt 1/φ², cùng nét 1px `non-scaling-stroke`, cùng node, cùng
thang mờ theo φ.
**Vì:** Thứ luật kia cấm là THÊM TIẾNG NÓI, không phải thêm hình. Ba biến thể
của một mặt phẳng vẫn là một tiếng nói — cái thay đổi giữa ba section là động
từ, không phải từ vựng. Đánh số I·II·III cũng trả lại cho trang chủ một thứ nó
đang thiếu: `home.who.r2Text` khai ba mảng nhưng người đọc không đếm được ba
mảng ấy ở đâu trên trang.
**Chỗ đặt là kết quả ĐO, không phải chọn theo mắt.** Hai phương án đầu hỏng:
mép phải cao trọn section thì dấu bị thẻ nền đục che gần hết (cả ba section đều
lấp kín nửa phải); dải padding TRÊN thì không đủ chỗ — nav dính cao 81px, mà
phần tử đục đầu tiên ở nửa phải của section phần mềm bắt đầu ở y=147, còn lại
66px. Dải padding DƯỚI trống đều 136·145·136px ở cả ba, nên dấu về đó và cao
đúng `--section-y`.
**Đánh đổi:** Dấu ẩn hoàn toàn dưới `lg` — dưới đó lưới xuống một cột và dải
đáy bị nội dung ăn hết. Ba section này ở khổ điện thoại không có số.
**Đã cân nhắc và bỏ:** đặt dấu đè LÊN nội dung ở độ mờ rất thấp (nét 1px ở 7%
thì không còn thấy gì, tức mất luôn lý do tồn tại); dùng số Ả Rập 01·02·03 (đã
là ngôn ngữ của dãy bước trong `StepRail` và dãy màn của bento — dùng lại ở
cấp section thì hai cấp nói cùng một kiểu ký hiệu).
**Đổi lại thì phải sửa:** `SectionMark` trong `decor.tsx`, `.pv-mark` trong
`globals.css`, prop `mark` của `<Section>`, và ba chỗ gọi trong `sections.tsx`.

## 2026-08-12 — Trang chủ giữ form trong drawer, và `/api/lead` chuyển tiếp qua webhook
**Bối cảnh:** Câu hỏi đặt ra là trang chủ có nên kết bằng một section form lead
hiện sẵn không. Soi lại thì trang chủ ĐÃ kết bằng form: `CtaBand` mở drawer
khảo sát ngay tại trang (quyết định 2026-08-07). Nhưng soi tiếp thì form đó
đang đánh rơi mọi lead.
**Chọn:** Giữ nguyên chỗ đặt form. Sửa cái hỏng bên trong, và cho nó một
endpoint `/api/lead` chuyển tiếp tới một URL khai ở `LEAD_WEBHOOK_URL`.
**Vì:** Thêm một section form nữa thì trang chủ có hai lời mời giống hệt nhau
nằm liền nhau — đúng thứ blueprint §23 cấm, và cũng là lý do section đào tạo
hiện không có nút phụ. Còn chỗ đặt form chưa bao giờ là thứ đang chặn: thứ chặn
là form không gửi đi đâu, và tệ hơn, nó báo "Đã nhận thông tin" nên khách tưởng
đã gửi. Không nhúng thẳng một CRM vì chưa ai chốt CRM nào; một webhook nhận
JSON là mẫu số chung của mọi lựa chọn đang cân nhắc, nên chốt xong chỉ phải đặt
biến môi trường.
**Chưa khai biến thì trả 503 chứ không trả thành công.** Thà khách thấy "không
gửi được, email thẳng cho chúng tôi" còn hơn tưởng đã gửi rồi ngồi đợi một cuộc
gọi không bao giờ tới.
**Đánh đổi:** Nếu phát hành trước khi khai biến, mọi lượt gửi đều hiện lỗi. Chấp
nhận được vì `robots.ts` đang chặn toàn bộ site, và một lỗi thấy được sẽ ép việc
này lên trước thay vì để nó chìm.
**Đã cân nhắc và bỏ:** đưa form hiện sẵn vào cột phải của `CtaBand` thay cho 4
gạch đầu dòng (làm được, không phá §23, nhưng `CtaBand` dùng chung cho MỌI trang
nên phải thêm prop — để dành tới khi form đã nối thông); thêm section form thứ
tám (hai CTA trùng việc); gửi form bằng `mailto:` (không chấm điểm lead được,
và trên máy không cấu hình mail client thì không mở được gì).
**Đổi lại thì phải sửa:** `src/app/api/lead/route.ts`, `assessment-form.tsx`,
`.env.example`.

## 2026-08-12 — `/ai-assessment` co về một section, chữ nhường chỗ cho form
**Bối cảnh:** Đây là trang chuyển đổi duy nhất của site — mọi CTA "Đánh giá cơ
hội ứng dụng AI" đều đổ về đây. Nhưng nó dựng như một trang bán hàng: một
section hero riêng chỉ chứa tiêu đề, rồi một section nữa chứa 5 mục "bạn nhận
được gì" + 4 mục "cần chuẩn bị gì" + 4 ô chờ, form nằm ở cột phải. Section cao
trọn một màn hình, nên muốn thấy ô nhập đầu tiên phải cuộn qua trọn một viewport
chỉ có ba dòng chữ.
**Chọn:** Một section duy nhất, hai cột, cột phải rộng hơn (0.85 · 1.15). Chữ
ngoài form còn 119 từ: tiêu đề, một câu dẫn, ba mục "xong buổi đó bạn có", một
câu "cần chuẩn bị gì". Tiêu đề form dời vào TRONG khung thẻ.
**Vì:** Người bấm CTA để tới đây đã đọc thuyết phục ở chỗ khác rồi; trang này
chỉ còn việc gỡ bốn câu hỏi cuối mà registry ghi ở entry `ai-assessment` rồi
đưa form ra. Đo ở 1440×900: trọn form kể cả nút gửi nằm trong màn hình đầu
(đáy nút y=824). Tiêu đề vào trong khung để khối form ở trang và ở drawer là
CÙNG một cấu trúc (khung · vạch ngăn · form `bare`) — cùng một form xuất hiện
hai chỗ thì phải đọc ra là một vật.
**Đánh đổi:** Dưới `lg` lưới xuống một cột nên form bắt đầu ở y≈785 (768px) và
y≈923 (375px), tức vẫn dưới nếp gấp ở khổ hẹp. Không kéo hai cột xuống `md` vì
ở 768 mỗi cột chỉ còn ~350px, mà lưới trong form đã tự chia hai ô mỗi hàng từ
`sm` — ô nhập sẽ còn ~160px.
**Ô chờ:** ba ô gộp còn một. `feeGap` + `slaGap` là cùng một loại câu hỏi —
điều kiện của buổi làm việc — nên là một ô `termsGap`. `ownerGap` (ai nhận
lead) là câu hỏi nội bộ, người mua không quan tâm: nó sống trong `registry.ts`
để `/track` đếm, không nằm trên mặt trang. `crmGap` **xoá hẳn** — nó viết "biểu
mẫu chưa gửi đi đâu", không còn đúng từ commit `e49d686`.
**Đã cân nhắc và bỏ:** giữ hai section và chỉ cắt chữ (form vẫn dưới nếp gấp,
vì section cao trọn màn hình là luật của `<Section>`, không phải của trang này);
nâng nấc trời cho thẻ form nổi hơn (nấc đầu trang phải là `void`, và mặt thẻ
`bg-surface` trên `void` chỉ hơn nền 3 nấc RGB — cái tách nó ra là viền, và
tương phản chữ thấp nhất trên mặt thẻ vẫn 10,65:1).
**Đổi lại thì phải sửa:** `src/app/[locale]/ai-assessment/page.tsx`, khối
`assessment` trong `messages/vi.json`, và docstring khung thẻ trong
`assessment-drawer.tsx`.
