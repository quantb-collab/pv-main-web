# Bàn giao — 2026-08-12

## Đang ở đâu

Nhánh `worktree-training-section` giờ mang hai việc: section đào tạo AI trên
trang chủ (mảng kinh doanh thứ ba, có dấu I · II · III cùng hai section anh em),
và **trang chuyển đổi `/ai-assessment` dựng lại quanh biểu mẫu**. Trang đó trước
đây dựng như một trang bán hàng — hero riêng một màn hình, rồi hai danh sách và
bốn ô chờ chắn trước form; nay còn một section, 119 từ ngoài form, và ở 1440×900
trọn biểu mẫu kể cả nút gửi nằm trong màn hình đầu.

Nhánh vẫn CHƯA nhập vào `develop` — xem *Đang làm dở*.

## Vừa hoàn thành

- `/ai-assessment` dựng lại: `src/app/[locale]/ai-assessment/page.tsx`, khối
  `assessment` trong `messages/vi.json`. Lý do bố cục nằm trong docstring của
  chính trang; quyết định và phương án đã bỏ nằm ở `DECISIONS.md` mục hôm nay.
- Đo bằng Chrome thật ở 1440 · 1024 · 768 · 375: không tràn ngang, tương phản
  thấp nhất trên MẶT THẺ form 10,65:1, và chạy thật một lượt gửi — giá trị bước
  1 vẫn đi theo POST dù DOM bước 2 chỉ còn năm ô, `/api/lead` trả 503 đúng như
  thiết kế, nhánh lỗi hiện trong thẻ và giữ nguyên dữ liệu đã điền.
- Ba ô chờ cũ gộp còn một (`termsGap`). `crmGap` xoá hẳn: nó viết "biểu mẫu
  chưa gửi đi đâu", sai từ commit `e49d686`.
- Trước đó cùng nhánh: section đào tạo AI (`training-program.tsx`), dấu section
  (`SectionMark` trong `decor.tsx`), và biểu mẫu thôi đánh rơi lead.

## Đang làm dở

- **Nhánh chưa nhập.** `worktree-training-section` tách từ `develop` `4886998`.
  Nhập bằng cách nào là quyết định của chủ dự án.
- **Cây làm việc CHÍNH đang có một bản nháp CŨ của section đào tạo**, chưa
  commit: `src/components/home/training-tracks.tsx` cộng một dòng `import` thừa
  trong `sections.tsx`. Bản mới không dùng lại nó và cũng không xoá nó — nó
  không có trong nhánh này. **Phải bỏ bản nháp đó trước khi nhập nhánh**, nếu
  không dòng `import` sẽ đụng nhau.

## Bước tiếp theo

1. **Chốt lead đổ về đâu rồi đặt `LEAD_WEBHOOK_URL`** — chủ dự án. Đây là thứ
   duy nhất còn đứng giữa biểu mẫu và một lead thật; code đã xong và đã thử
   thông. Zapier/Make, Google Apps Script, HubSpot Forms API hay Slack đều cắm
   thẳng được; Salesforce Web-to-Lead cần một lớp trung gian vì nó nhận
   form-encoded. Không phải sửa `route.ts`.
2. **Xoá bản nháp cũ trong cây chính**: `rm src/components/home/training-tracks.tsx`
   và `git checkout -- src/components/home/sections.tsx`, rồi mới nhập nhánh.
3. **Trả nút "Xem chương trình" về hàng tiêu đề** của section đào tạo khi có
   trang đào tạo. Hiện nó là section sản phẩm DUY NHẤT không có nút phụ, vì
   registry chưa có entry nào cho mảng đào tạo (`home.training.pageGap`). Thêm
   entry trước, route sau.
4. **Sửa tràn ngang ở 768 trên TRANG CHỦ.** `document.documentElement.scrollWidth`
   = 1120 trên khung 753 — thủ phạm là `svg.pv-rings` của hero (rộng 1199px),
   có sẵn từ trước. `/ai-assessment` không dính lỗi này.
5. Chép bộ bàn giao POC vào `docs/one/` — đang ở `~/Downloads/handoff`, NGOÀI
   repo, và mọi con số trong `SOFTWARE-KIT.md` đo từ đó. Chép phần dựng lại được
   (5 `.dc.html` + `support.js` + `assets/` + `AGENTS.md` + `theme/globals.css`
   ≈ 1,2 MB), không chép 5 PNG 1×.
6. Xoá `src/components/home/software-shelf.tsx` — không ai gọi nữa.
7. Sửa hydration `src/components/motion/parallax.tsx` (reduced-motion: server
   thiếu div bọc transform). Kèm nó là `useScroll` "Target ref is defined but
   not hydrated" — cùng một gốc, cùng là "2 Issues" trên overlay dev.
8. Đọc NAV từ `inNav` trong `registry.ts` thay mảng cứng `site-header.tsx:32`;
   đặt `inNav: false` cho `insights` (`registry.ts:566`).

## Đang chờ quyết định

- **Điều kiện buổi đánh giá** — Pebble Vina — `assessment.termsGap`, hiện ngay
  trên `/ai-assessment`: miễn phí hay có phí, kéo dài bao lâu, cam kết bao lâu
  phản hồi. Chặn việc gỡ ô chờ cuối cùng của trang chuyển đổi.
- **Tham số chương trình đào tạo** — Pebble Vina — `home.training.paramsGap`.
  12 tuần, 90 ngày theo dõi, 2 tuần khảo sát, mốc 30·60·90 là thiết kế chương
  trình chưa ai duyệt, không phải số đo.
- **Trang chương trình đào tạo** — chủ dự án — `home.training.pageGap`. Chặn
  bước 3.
- **Phạm vi được nói** — Pebble Vina — `home.training.scopeGap`. Được phép nói
  "đội phát triển PV One trực tiếp đứng lớp tại nhà máy" hay không.
- Ai nhận lead từ website và chuyển tiếp cho Account Manager: câu hỏi nội bộ,
  nay chỉ nằm ở `registry.ts` (`/track`), không còn hiện trên mặt trang.

Danh sách cũ còn nguyên: `PV One` hay `Pebble One` · phạm vi công bố của PV One
(**chặn phát hành trang chủ**) · ảnh đang là tiếng Anh trên trang tiếng Việt ·
ba sản phẩm hay một · 7/20 ảnh còn thiếu · Hero A hay C · Pebble Square ·
MINT/PAPAYA · điều kiện đo `~160 TOPS` · 4 chỉ số bento · phân khúc ưu tiên ·
brand kit.

## Bẫy đã gặp

- **Dev server phục vụ messages CŨ, và nó im lặng.** Sửa `messages/vi.json`
  xong, trang vẫn hiện chữ cũ và in nguyên đường dẫn khoá mới (`assessment.prepare`)
  lên mặt trang — trông y hệt lỗi thiếu khoá trong khi `check:i18n` sạch.
  Không muốn đụng dev server của phiên khác thì `pnpm start -p <cổng khác>` trên
  bản build có sẵn, đo trên đó.
- **Có phiên KHÔNG có browser MCP.** Vẫn đo được: Chrome ở
  `/Applications/Google Chrome.app/...` chạy `--headless=new --remote-debugging-port`,
  node 22 có `WebSocket` sẵn nên nói CDP thẳng, không cần cài gì. Mẫu script đo
  hình học, tương phản và chạy form nằm ở `$CLAUDE_JOB_DIR/tmp` của phiên này.
- **Ô nhập của form là controlled** — gán `el.value` không báo cho React. Phải
  gọi setter gốc trên prototype rồi bắn `new Event("input", {bubbles:true})`,
  nếu không state vẫn rỗng và cú gửi thử không chứng minh được gì.
- **`bg-surface` trên nấc `void` gần như đen** (7,9,14 so với nền 4,4,7) — thẻ
  tách khỏi nền bằng VIỀN, không bằng độ sáng. Trên `rise` cùng token đó là
  (26,35,43). Đừng bù bằng cách bôi màu tại chỗ.
- **`EnterWorktree` tách từ `origin/main`, không phải nhánh đang đứng.** `main`
  chậm 29 commit so với `develop`. Vào worktree xong kiểm `git log --oneline -2`
  trước khi đọc file, rồi `git reset --hard develop`. Worktree mới cũng không có
  `node_modules` (`pnpm install` ~4 giây vì có store chung).
- **Nửa PHẢI của cả ba section mảng kinh doanh đã bị thẻ nền ĐỤC lấp kín.** Đặt
  trang trí ở `-z-10` bên đó là đặt vào chỗ không ai thấy. Dải trống thật là
  padding DƯỚI (136 · 145 · 136px).
- **Tương phản phải đo trên MẶT THẺ.** Mặt thẻ là một `<span>` định vị tuyệt
  đối, nên hàm dò nền đi ngược cây DOM sẽ lấy nhầm nền section. Bắn tia bằng
  `elementsFromPoint` thay vì đi lên `parentElement`.
- **`AnimatePresence` gỡ bước cũ khỏi DOM, và `FormData` chỉ đọc ô đang mounted.**
  Form nhiều bước phải giữ giá trị trong state; kiểm bằng
  `[...new FormData(f).keys()]` sau khi chuyển bước, đừng nhìn code mà đoán.
- **`check:tokens` soi cả CHÚ THÍCH**, và ba màu chip là ngoại lệ CHỈ cấp cho
  kệ phần cứng (`product-shelf.tsx`).
- Cũ nhưng còn đúng: headless Chrome không kích hoạt `loading="lazy"` ở khổ hẹp
  · `Page.captureScreenshot` + `clip` dùng toạ độ TÀI LIỆU nên phải cộng
  `window.scrollY` · `getComputedStyle().color` trả `lab(...)` nên phải đổi màu
  qua canvas 1×1 · `pkill` không kịp nhả cổng, kiểm bằng `lsof -ti:<cổng>` ·
  ngân sách chiều cao phải ĐO chứ đừng cộng nhẩm · `DialogContent` của shadcn là
  `grid` · đừng đặt `key` lên component có `Dialog` bên trong · Next 16 trả HTTP
  400 cho quality không khai trong `images.qualities` · danh sách dò bằng `t.has`
  phải viết như có thể rỗng · chuỗi hiển thị chứa `*.png` làm `check:i18n` báo
  lỗi giả · ô chờ vô hình là cố ý.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch, exit 0 (104 trang, 50 file).
- Commit cuối: `399a661` — dựng lại `/ai-assessment` quanh biểu mẫu. Trước nó
  là `e49d686` (form thôi đánh rơi lead) và `9d8664f` (dấu I · II · III).
- Việc chưa commit: không (trong worktree). Cây làm việc CHÍNH thì còn bản nháp
  cũ chưa commit — xem *Đang làm dở*.
- Nhánh: `worktree-training-section`, tách từ `develop` `4886998`. `develop`
  khớp `origin/develop` (`github.com/quantb-collab/pv-main-web`).
- ⚠️ `refs/remotes/origin/HEAD` chưa được set, nên lệnh dò nhánh mặc định trả
  rỗng và dễ bị đọc nhầm thành "repo chưa có remote". Dùng `git remote -v`.
