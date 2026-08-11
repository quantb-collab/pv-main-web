# Bàn giao — 2026-08-11 (phiên 2)

## Đang ở đâu

Section **phần mềm** của trang chủ vừa được soi bằng trình duyệt thật lần đầu
(headless Chrome qua CDP, đo ở 1440×900 · 768 · 375 và cả bản phóng to) và sửa
theo những gì đo được. Bố cục, cấp bậc chữ và bản phóng to đã xong; phần còn
thiếu của section giờ chỉ là **ảnh cho ba ô nhỏ** — không sửa được bằng code.

Việc tiếp theo vẫn như phiên trước: **section đào tạo ứng dụng AI trong doanh
nghiệp**, mảng kinh doanh thứ ba.

## Vừa hoàn thành

Tám thứ, tất cả trong `software-bento.tsx` + `app-shot.tsx` (chi tiết và con số
nằm trong docstring của chính hai file đó):

- Lấp **lỗ rỗng 91px** giữa ô lớn — trả chỗ đó cho ảnh, khung poster `ultra`
  (21:9) → `wide` (16:9), hàng lưới 10rem → 10,5rem.
- `PV One` lên `text-subhead`; trước đó bốn vai trò khác nhau cùng 21px.
- Tên màn chuyển vào slot `heading` mới của `AppShot` để nằm **giữa ảnh và dòng
  chú**, thay vì dưới cả hai.
- Bản phóng to: gộp tiêu đề + nguồn + chữ vào **một cột** (trước đó tiêu đề
  cách đoạn nói về nó 1200px), thêm `pv-edge`, bỏ dòng mono lặp.
- `sizes` của ảnh trong dialog xuống ≤1024px → trình duyệt lấy bản **2048**
  thay vì 3840 (ảnh nguồn chỉ rộng 2880), 110KB → 85KB.
- `priority` cho ảnh trong dialog — xem *Bẫy* bên dưới.
- Nút **tạm dừng** cho nhịp lướt 1,5s (WCAG 2.2.2). `taken` một chiều thành
  `paused` hai chiều; hai khoá `home.software.pauseLabel` / `resumeLabel`.
- Ba ô nhỏ: bỏ căn giữa, ô `web` xuống chồng dưới `sm` (ở 375 cột chữ của nó
  chỉ còn 129px).

`docs/SOFTWARE-KIT.md` §4 và checklist §13 đã sửa cho khớp code.

## Đang làm dở

Không có việc dở.

## Bước tiếp theo

1. **Mở `localhost:3000` trên trình duyệt thật**, xem lại section phần mềm và
   bản phóng to. Mọi thứ ở trên đo bằng headless — xem *Bẫy*.
2. **Dựng section đào tạo ứng dụng AI.** Trước khi viết JSX: đọc
   `home.who.r2Text` (`messages/vi.json`) vì nó đã khai ba mảng là "phần cứng,
   phần mềm và đào tạo AI", section mới phải khớp cách gọi đó. Đặt sau
   `Software`, nấc trời `rise`, hoặc `dawn` nếu nó đứng ngay trước `CtaBand`.
3. Chép bộ bàn giao POC vào `docs/one/` — đang ở `~/Downloads/handoff`, NGOÀI
   repo, và mọi con số trong `SOFTWARE-KIT.md` đo từ đó. Chép phần dựng lại
   được (5 `.dc.html` + `support.js` + `assets/` + `AGENTS.md` +
   `theme/globals.css` ≈ 1,2 MB), không chép 5 PNG 1×.
4. Xoá `src/components/home/software-shelf.tsx` — không ai gọi nữa.
5. Sửa hydration `src/components/motion/parallax.tsx` (reduced-motion: server
   thiếu div bọc transform). Kèm nó là `useScroll` "Target ref is defined but
   not hydrated" — cùng một gốc, cùng là "2 Issues" trên overlay dev.
6. Đọc NAV từ `inNav` trong `registry.ts` thay mảng cứng `site-header.tsx:32`;
   đặt `inNav: false` cho `insights` (`registry.ts:566`).

## Đang chờ quyết định

Không có mục mới. Toàn bộ danh sách phiên trước còn nguyên, chưa ai trả lời:

- **`PV One` hay `Pebble One`** — chủ dự án — chặn việc viết chữ cho mọi trang
  có giao diện sản phẩm. Sửa = một khoá `home.software.oneName`.
- **Phạm vi được công bố của PV One** — Pebble Vina — **chặn phát hành trang
  chủ**. Tên sản phẩm, bốn nhánh, hai tầng license, bốn engine, và 9 cái tên
  người/công ty trong dữ liệu demo.
- **Ảnh đang là tiếng Anh trên trang tiếng Việt** — chủ dự án. Dựng trang thì
  được, phát hành thì không.
- **Ba sản phẩm hay một sản phẩm** — chủ dự án. Xem `home.software.lineupGap`
  và `scopeGap`.
- **7/20 ảnh còn thiếu.** Ba ô nhỏ của kệ phần mềm chiếm gần nửa diện tích
  section mà cả ba đều là ô chờ — đây là thứ duy nhất còn kéo section xuống, và
  nó cần ảnh chứ không cần code. Yêu cầu đã ghi trong `pXNeed`.
- Hero A hay C · Pebble Square · MINT/PAPAYA · điều kiện đo `~160 TOPS` · 4 chỉ
  số bento · phân khúc ưu tiên · CRM nhận lead · brand kit.

## Bẫy đã gặp

- **Headless Chrome không kích hoạt `loading="lazy"` ở khổ hẹp.** Ở 375, KHÔNG
  một ảnh lazy nào trên toàn trang tải (cả ảnh phần cứng không liên quan), dù
  URL trả 200 và ép `eager` thì tải ngay. Ở 1440 thì bình thường. Ảnh trắng
  trong ảnh chụp headless ở khổ mobile **không phải lỗi của site** — đừng đi
  sửa nó. Ảnh trong dialog cũng không tải kể cả ở 1440; đó là lý do có
  `priority`, nhưng nguyên nhân gốc chưa khẳng định được.
- **Đo bằng `Page.captureScreenshot` + `clip` thì toạ độ là của TÀI LIỆU, không
  phải khung nhìn.** Quên cộng `window.scrollY` là lấy nhầm pixel ở đầu trang,
  và mọi con số tương phản sai theo.
- **`getComputedStyle().color` trả `lab(...)` chứ không trả `rgb(...)`.** Bổ
  thẳng bằng regex ra ba số rồi tính tương phản là ra kết quả vô nghĩa (mọi tỷ
  lệ ≈ 1,3). Đổi màu qua canvas 1×1 rồi mới tính.
- **`pkill` không kịp nhả cổng.** `pnpm start` sau đó bind lỗi, server cũ vẫn
  trả 200, và ta ngồi nghiệm thu bản build cũ mà tưởng bản mới. Kiểm bằng
  `lsof -ti:<cổng>` chứ đừng tin `curl` trả 200.
- **Ngân sách chiều cao của ô bento phải ĐO, không cộng nhẩm.** Docstring cũ
  ghi "dư ~77px" và con số đó đúng — nhưng vì dãy bước bám đáy bằng `mt-auto`,
  toàn bộ phần dư dồn thành một lỗ 91px giữa ô chứ không rải ra.
- Cũ nhưng còn đúng: `DialogContent` của shadcn là `grid` · đừng đặt `key` lên
  component có `Dialog` bên trong · Next 16 trả HTTP 400 cho quality không khai
  trong `images.qualities` · danh sách dò bằng `t.has` phải luôn viết như có
  thể rỗng · chuỗi hiển thị chứa `*.png` làm `check:i18n` báo lỗi giả · ô chờ
  vô hình là cố ý (6 `data-gap` không vẽ ra pixel nào) · **sửa `messages/*.json`
  xong PHẢI restart dev server** (gặp lại lần nữa phiên này).

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch, exit 0 (104 trang, 48 file).
- Commit cuối: `5ee1055` — chặn tiện ích trình duyệt làm sai phép so hydrate ở
  `<body>`. Trước nó là `198123f` (sửa section phần mềm) và `c3f4cca` (tài liệu).
- Việc chưa commit: không.
- Đã push: `develop` khớp `origin/develop`
  (`github.com/quantb-collab/pv-main-web`). Nhánh `main` chưa được nhập gì từ
  đợt này.
- ⚠️ `refs/remotes/origin/HEAD` chưa được set, nên lệnh dò nhánh mặc định
  (`git symbolic-ref refs/remotes/origin/HEAD`) trả rỗng và dễ bị đọc nhầm
  thành "repo chưa có remote". Dùng `git remote -v`.
