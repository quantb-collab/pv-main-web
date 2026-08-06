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
