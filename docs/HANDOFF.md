# Bàn giao — 2026-08-12

## Đang ở đâu

Trang chủ đã đủ **ba mảng kinh doanh**, và ba section ấy nay ĐẾM ĐƯỢC: mỗi cái
mang một dấu I · II · III kèm một hình ở góc dưới phải. Section đào tạo AI dựng
theo một bản thiết kế do chủ dự án đưa, đặt giữa `Software` và `CtaBand`, nấc
trời `rise`. Đo bằng trình duyệt thật ở 1440 · 1024 · 768 · 375: không tràn
ngang, tương phản thấp nhất trong section là 8,5:1, section cao 903px ở 1440
(vừa một màn hình 900px), và không dòng chữ nội dung nào chồng lên dấu.

Việc này nằm trên **nhánh riêng `worktree-training-section`**, chưa nhập vào
`develop` — xem *Đang làm dở*.

## Vừa hoàn thành

- Section đào tạo AI: `src/components/home/training-program.tsx` (hình thức),
  `Training` trong `sections.tsx` (nạp dữ liệu), 40 khoá `home.training.*`.
  Toàn bộ lý do bố cục nằm trong docstring của chính hai file đó.
- Hai lỗi bố cục tự tìm ra khi đo, đã sửa: ba bảng thông số lệch nhau ~45px vì
  cột `auto` co theo từng thẻ; và ở dưới `lg` thì `grid-cols-2` ném "90" sang
  mép phải, cách "12" hơn 600px.
- Dấu section: `SectionMark` trong `decor.tsx`, utility `.pv-mark` trong
  `globals.css`, prop `mark` của `<Section>`. Lý do hình học và lý do chỗ đặt
  nằm trong docstring hai file đó; lý do được phép phá luật "một hoạ tiết" nằm
  ở `DECISIONS.md` mục 2026-08-12.
- **Biểu mẫu khảo sát nay gửi được thật.** Trước đó nó đánh rơi mọi lead: sang
  bước 2 là các ô bước 1 bị gỡ khỏi DOM, `FormData` chỉ còn năm trường rỗng của
  bước 2, mà form vẫn báo "Đã nhận thông tin". Nay giữ toàn bộ trường trong
  state, POST sang `/api/lead`, và route chuyển tiếp tới `LEAD_WEBHOOK_URL`.
  Chưa khai biến thì trả 503 và form hiện lỗi kèm email — CỐ Ý, xem `.env.example`.

## Đang làm dở

- **Nhánh chưa nhập.** `worktree-training-section` tách từ `develop` `4886998`. Nhập bằng cách nào là quyết định của chủ dự án.
- **Cây làm việc chính đang có một bản nháp CŨ của cùng section này**, chưa
  commit: `src/components/home/training-tracks.tsx` (ba panel lộ trình, mỗi
  panel một dãy module `01–04`) cộng một dòng `import` thừa trong
  `sections.tsx`. Bản mới KHÔNG dùng lại nó và cũng không xoá nó — nó không có
  trong nhánh này. **Phải bỏ bản nháp đó trước khi nhập nhánh**, nếu không dòng
  `import` sẽ đụng nhau và cây sẽ có hai component đào tạo, một cái không ai gọi.

## Bước tiếp theo

1. **Chốt lead đổ về đâu rồi đặt `LEAD_WEBHOOK_URL`** — chủ dự án. Đây là thứ
   duy nhất còn đứng giữa biểu mẫu và một lead thật; code đã xong và đã thử
   thông với một webhook nội bộ. Zapier/Make, Google Apps Script, HubSpot Forms
   API, hay Slack đều cắm thẳng được; Salesforce Web-to-Lead cần một lớp trung
   gian vì nó nhận form-encoded. Không phải sửa `route.ts`.
2. **Xoá bản nháp cũ trong cây chính**: `rm src/components/home/training-tracks.tsx`
   và `git checkout -- src/components/home/sections.tsx`, rồi mới nhập nhánh
   `worktree-training-section`.
3. **Trả nút "Xem chương trình" về hàng tiêu đề** khi có trang đào tạo. Hiện
   section là section sản phẩm DUY NHẤT không có nút phụ, vì registry chưa có
   entry nào cho mảng đào tạo (`training.pageGap`). Thêm entry trước, route sau.
4. **Sửa tràn ngang ở 768.** `document.documentElement.scrollWidth` = 1120 trên
   khung 753 — thủ phạm là `svg.pv-rings` của hero (rộng 1199px), có sẵn từ
   trước, không phải của section mới. Cả trang cuộn ngang được ở khổ tablet.
5. Chép bộ bàn giao POC vào `docs/one/` — đang ở `~/Downloads/handoff`, NGOÀI
   repo, và mọi con số trong `SOFTWARE-KIT.md` đo từ đó. Chép phần dựng lại
   được (5 `.dc.html` + `support.js` + `assets/` + `AGENTS.md` +
   `theme/globals.css` ≈ 1,2 MB), không chép 5 PNG 1×.
6. Xoá `src/components/home/software-shelf.tsx` — không ai gọi nữa.
7. Sửa hydration `src/components/motion/parallax.tsx` (reduced-motion: server
   thiếu div bọc transform). Kèm nó là `useScroll` "Target ref is defined but
   not hydrated" — cùng một gốc, cùng là "2 Issues" trên overlay dev.
8. Đọc NAV từ `inNav` trong `registry.ts` thay mảng cứng `site-header.tsx:32`;
   đặt `inNav: false` cho `insights` (`registry.ts:566`).

## Đang chờ quyết định

Ba mục MỚI, đều thuộc section đào tạo và đều đã cắm ô chờ trên trang:

- **Tham số chương trình** — Pebble Vina — `home.training.paramsGap`. 12 tuần,
  90 ngày theo dõi, 2 tuần khảo sát, 4 buổi làm việc, 2–3 quy trình, mốc
  30·60·90. Đây là thiết kế chương trình chưa ai duyệt, không phải số đo.
- **Trang chương trình đào tạo** — chủ dự án — `home.training.pageGap`. Chặn
  việc trả nút phụ về hàng tiêu đề (bước 2).
- **Phạm vi được nói** — Pebble Vina — `home.training.scopeGap`. Được phép nói
  "đội phát triển PV One trực tiếp đứng lớp tại nhà máy" và hứa bàn giao cho
  nhân sự nội bộ tự mở rộng tiếp hay không.

Danh sách cũ còn nguyên, chưa ai trả lời: `PV One` hay `Pebble One` · phạm vi
công bố của PV One (**chặn phát hành trang chủ**) · ảnh đang là tiếng Anh trên
trang tiếng Việt · ba sản phẩm hay một · 7/20 ảnh còn thiếu · Hero A hay C ·
Pebble Square · MINT/PAPAYA · điều kiện đo `~160 TOPS` · 4 chỉ số bento · phân
khúc ưu tiên · brand kit.

**`CRM nhận lead` rời khỏi danh sách này** — nó nay là bước 1 ở trên, và câu
hỏi đã hẹp lại từ "dùng CRM nào" xuống "URL nào nhận POST JSON".

## Bẫy đã gặp

- **`EnterWorktree` tách từ `origin/main`, không phải nhánh đang đứng.** `main`
  chậm 29 commit so với `develop`: `section.tsx` ở đó vẫn dùng `tone` thay cho
  `sky` và `highlight.tsx` chưa tồn tại. Vào worktree xong phải kiểm
  `git log --oneline -2` trước khi đọc bất cứ file nào, rồi `git reset --hard develop`.
- **Worktree mới không có `node_modules`** — `pnpm verify` chết ở
  `next: command not found`. `pnpm install` mất ~4 giây vì có store chung.
- **Nửa PHẢI của cả ba section mảng kinh doanh đều đã bị thẻ nền ĐỤC lấp kín.**
  Đặt trang trí ở `-z-10` bên đó là đặt vào chỗ không ai thấy — bản đầu của
  `SectionMark` mất hai vòng sửa vì thế. Dải trống thật là padding DƯỚI
  (136 · 145 · 136px). Đo bằng cách quét `getBoundingClientRect` tìm phần tử
  đục đầu tiên ở nửa phải, đừng nhìn ảnh chụp mà đoán.
- **`check:tokens` soi cả CHÚ THÍCH.** Viết một cỡ chữ tuỳ ý làm ví dụ trong
  comment để giải thích "vì sao KHÔNG dùng nó" cũng đủ làm `pnpm verify` fail.
  Cùng loại dương tính giả với chuỗi chứa `*.png` ở `check:i18n`.
- **Ba màu chip là ngoại lệ CHỈ cấp cho kệ phần cứng.** Bản thiết kế của section
  này tô ba tiêu đề thẻ ba màu (bạc hà · cam · xanh); `globals.css` LỚP 1 ghi rõ
  đó là ngoại lệ duy nhất cho luật "mọi ánh sáng dẫn xuất từ `--brand`" và nó
  chỉ dùng ở `product-shelf.tsx`. Cả ba tiêu đề dùng `brand-ink`.
- **`AnimatePresence` gỡ bước cũ khỏi DOM, và `FormData` chỉ đọc ô đang mounted.**
  Form nhiều bước dựng bằng `key={step}` sẽ đánh rơi mọi thứ người dùng điền ở
  bước trước, im lặng, không lỗi nào. Form nhiều bước phải giữ giá trị trong
  state; đừng tin `defaultValue`. Kiểm bằng `[...new FormData(f).keys()]` sau
  khi chuyển bước, đừng nhìn code mà đoán.
- **Tương phản phải đo trên MẶT THẺ, không phải nền section.** Mặt thẻ là một
  `<span>` định vị tuyệt đối, không phải nền của thẻ cha, nên hàm dò nền đi
  ngược cây DOM sẽ lấy nhầm nền section (tối hơn) và mọi tỷ lệ đẹp hơn thực tế.
  Đo đúng: nền section `rgb(18,25,32)`, mặt thẻ `rgb(26,35,43)`.
- Cũ nhưng còn đúng: headless Chrome không kích hoạt `loading="lazy"` ở khổ hẹp
  · `Page.captureScreenshot` + `clip` dùng toạ độ TÀI LIỆU nên phải cộng
  `window.scrollY` · `getComputedStyle().color` trả `lab(...)` nên phải đổi màu
  qua canvas 1×1 rồi mới tính tương phản · `pkill` không kịp nhả cổng, kiểm
  bằng `lsof -ti:<cổng>` chứ đừng tin `curl` trả 200 · ngân sách chiều cao phải
  ĐO chứ đừng cộng nhẩm · `DialogContent` của shadcn là `grid` · đừng đặt `key`
  lên component có `Dialog` bên trong · Next 16 trả HTTP 400 cho quality không
  khai trong `images.qualities` · danh sách dò bằng `t.has` phải luôn viết như
  có thể rỗng · chuỗi hiển thị chứa `*.png` làm `check:i18n` báo lỗi giả · ô chờ
  vô hình là cố ý · **sửa `messages/*.json` xong PHẢI restart dev server**.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch, exit 0 (104 trang, 50 file).
- Commit cuối: `e49d686` — biểu mẫu khảo sát thôi đánh rơi lead. Trước nó là
  `9d8664f` (dấu I · II · III) và `009b80b` (section đào tạo AI).
- Việc chưa commit: không (trong worktree). Cây làm việc CHÍNH thì còn bản nháp
  cũ chưa commit — xem *Đang làm dở*.
- Nhánh: `worktree-training-section`, tách từ `develop` `4886998`. `develop`
  khớp `origin/develop` (`github.com/quantb-collab/pv-main-web`).
- ⚠️ `refs/remotes/origin/HEAD` chưa được set, nên lệnh dò nhánh mặc định
  (`git symbolic-ref refs/remotes/origin/HEAD`) trả rỗng và dễ bị đọc nhầm
  thành "repo chưa có remote". Dùng `git remote -v`.
