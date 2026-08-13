# Bàn giao — 2026-08-14

## Đang ở đâu

Nhánh `worktree-training-section` giờ mang ba việc: section đào tạo AI trên
trang chủ (mảng kinh doanh thứ ba, có dấu I · II · III cùng hai section anh em),
**trang chuyển đổi `/ai-assessment` dựng lại quanh biểu mẫu**, và **dải CTA đóng
trang thành thuần chữ** — cả hai đều đi theo cùng một hướng: chỗ nào MỜI thì chỉ
mời, chỗ nào TRẢ LỜI mới trả lời, và không lặp lại nhau.

Nhánh vẫn CHƯA nhập vào `develop` — xem *Đang làm dở*.

## Vừa hoàn thành

- **Rà responsive TOÀN BỘ tám section trang chủ** ở 375 · 414 · 600 · 768 · 900
  · 1024 · 1280 · 1440 bằng Chrome thật (hình học từng khối, vùng chạm, số ký tự
  một dòng, ảnh chụp từng section). Sáu section đọc tốt ở mọi khổ; hai chỗ hỏng
  thật và cả hai hỏng dưới `lg`. Lý do đầy đủ ở `DECISIONS.md` mục 2026-08-14.
  · **Kệ phần mềm** — ô sản phẩm xuống một hàng ngang dưới `lg`. `BENTO_SPAN`
    chỉ khai span từ `lg`, nên dưới đó "ô đứng" chỉ còn là khung ảnh dọc 326px:
    ở 375 ba khung chờ RỖNG ăn 919px trong khi PV One có 378px. Section
    1657 → 1235px ở 375, 1510 → 1377 ở 900; **từ `lg` không đổi một pixel**.
  · **Kệ phần cứng** — bỏ hai control nói dối: nút dừng băng ảnh (băng nó điều
    khiển là `hidden … lg:flex`, cao 0px ở mọi khổ dưới `lg`) và tablist một
    tab (bấm không đi đâu, vùng chạm 126×25). Section 1010 → 950px ở 1024.
  · **Vùng chạm** — "Xem ảnh lớn" 17 → 41px, năm nút bước 28 → 44px (nới bằng
    `after`, không bằng padding: ô lớn chỉ dư 15px ngân sách chiều cao).
  · **Dải CTA** — nút kéo hết bề ngang dưới `sm` (166 → 335px ở 375), bằng cỡ
    nút hero cho cùng một hành động. Ảnh hưởng cả 14 trang mang `CtaBand`.
  · **KHÔNG sửa, đã đo và thấy đúng:** `ket-qua` (1542px ở 375 — 12 ô đọc rõ
    theo thang, dài vì có nội dung thật), `con-so` (bốn số xuống dần thành một
    cái thang), `dao-tao`, `pebble-vina`. Không khổ nào tràn ngang.
- **Hết tràn ngang ở khổ hẹp.** Quét 10 trang ở 375 và 768: `scrollWidth` bằng
  đúng khung nhìn ở mọi trang. Thủ phạm KHÔNG phải `svg.pv-rings` của hero như
  bàn giao trước ghi — xem *Bẫy đã gặp*.
- Footer (`src/components/layout/site-footer.tsx`): tách hai tầng — tên hãng,
  điện thoại, email và ba cột link ở trên (bốn cột đều nhau); pháp nhân, địa
  chỉ, mã số thuế xuống dải pháp lý. Lý do và số đo ở `DECISIONS.md` mục
  2026-08-13. Footer ở 375 giảm 1407 → 1321px, khối địa chỉ 225px/9 dòng còn
  20px/1 dòng ở 1440.
- `CtaBand` (`src/components/pv/cta-band.tsx`, đứng ở cuối 14 trang): bỏ cột
  danh sách bốn mục và prop `items`, căn giữa, tiêu đề rút còn "Bắt đầu ngay" ở
  cỡ `display`. Lý do và ngoại lệ cỡ chữ nằm ở `DECISIONS.md` mục 2026-08-13.
  Đo trên `/solutions` và `/technology` ở 1440 · 768 · 375: căn giữa lệch 0px,
  không tràn ngang, nút mở drawer mà không rời trang, tương phản chữ trên nút
  9,19:1 và trên nền dải 15,04–18,58:1.
- `/ai-assessment` dựng lại: `src/app/[locale]/ai-assessment/page.tsx`, khối
  `assessment` trong `messages/vi.json`. Lý do bố cục nằm trong docstring của
  chính trang; quyết định và phương án đã bỏ nằm ở `DECISIONS.md` mục 2026-08-12.
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
4. Chép bộ bàn giao POC vào `docs/one/` — đang ở `~/Downloads/handoff`, NGOÀI
   repo, và mọi con số trong `SOFTWARE-KIT.md` đo từ đó. Chép phần dựng lại được
   (5 `.dc.html` + `support.js` + `assets/` + `AGENTS.md` + `theme/globals.css`
   ≈ 1,2 MB), không chép 5 PNG 1×.
5. Xoá `src/components/home/software-shelf.tsx` — không ai gọi nữa.
6. Sửa hydration `src/components/motion/parallax.tsx` (reduced-motion: server
   thiếu div bọc transform). Kèm nó là `useScroll` "Target ref is defined but
   not hydrated" — cùng một gốc, cùng là "2 Issues" trên overlay dev.
7. Đọc NAV từ `inNav` trong `registry.ts` thay mảng cứng `site-header.tsx:32`;
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

- **`getBoundingClientRect` KHÔNG thấy vùng chạm nới bằng pseudo-element.** Sau
  khi nới `after` cho năm nút bước, phép đo vẫn báo 45×28 y như cũ và trông hệt
  như bản sửa không ăn. Kiểm đúng cách là bắn `elementFromPoint` xuống dưới mép
  nút từng nấc: +15px vẫn trúng nút, +20px thì ra ngoài — tức vùng chạm thật là
  28+16=44px.
- **Chiều cao section ở khổ hẹp phải đo từ `:scope > .pv-container`.** Lấy
  `:scope > div` thì trúng một trong bốn lớp trang trí `absolute` mà `<Section>`
  tự gắn, và ra những con số vô lý (nội dung 6263px trong section 1966px).
- **Ảnh trong section chưa cuộn tới thì `complete: false` mãi mãi** trong
  headless — `loading="lazy"` không kích hoạt, nên khung PV One chụp ra trống
  trơn và trông y như lỗi ảnh hỏng. `srcset` vẫn đúng (384w…), chỉ là chưa tải.
  Đừng đuổi theo con số `w=3840` trong `src`: đó là bản dự phòng Next luôn đặt.
- **Chrome headless dùng `--user-data-dir` trùng nhau thì phiên sau bám vào
  phiên trước** và phép đo treo giữa chừng (`unsettled top-level await`).
  `pkill -f <tên profile>` trước mỗi lượt đo.
- **Cây làm việc này đã có sẵn một dev server ở cổng 3212** (`next dev` từ
  chối chạy cái thứ hai và in ra PID của cái đang chạy). Đừng cố mở cổng mới.
- **Thủ phạm tràn ngang KHÔNG phải thứ trông rộng nhất.** Bàn giao trước đổ cho
  `svg.pv-rings` của hero vì nó rộng 1199px — nhưng SVG có `overflow-x: hidden`
  nên nó tự cắt và không đẩy tài liệu; `getBoundingClientRect` của `<g>`/
  `<ellipse>` bên trong trả về HỘP HÌNH HỌC, không phải phần được vẽ. Thủ phạm
  thật là một băng cuộn ngang: nó cuộn được, nhưng bề rộng MIN-CONTENT của nó
  vẫn là tổng các thẻ (1048px), và nó nằm trong một grid item không có
  `min-w-0` nên số đó nở cột lưới ra. Cách dò đúng: đo `min-content` thật bằng
  cách gán tạm `width: min-content` cho từng tầng rồi đọc lại bề ngang — quét
  `getBoundingClientRect` chỉ ra một đống NẠN NHÂN bị kéo giãn, không ra nguồn.
- **`overflow-x: auto` không miễn cho cha khỏi min-content.** Nó chỉ đưa
  `min-width: auto` của CHÍNH nó về 0. Cha là grid item thì vẫn phải tự khai
  `min-w-0`, nếu không `min-width: auto` của grid item bằng min-content và cột
  nở theo. Trên `lg` lỗi này ẩn vì `grid-cols-[minmax(0,...)]` đã chặn sẵn.
- **Ảnh chụp bằng `scrollIntoView` ra trắng** khi trang có Lenis + scroll-snap:
  hai thứ đó kéo vị trí về chỗ khác ngay sau khi cuộn. Chụp bằng
  `Page.captureScreenshot` với `clip` theo TOẠ ĐỘ TÀI LIỆU và
  `captureBeyondViewport: true` thì không phải cuộn.
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
- **Đo tương phản ở cuối trang thì HEADER CỐ ĐỊNH chen vào phép đo.**
  `elementsFromPoint` tại tâm nút CTA trả về link trong nav rồi mới tới nút, nên
  hàm dò nền lấy nhầm nền header trong suốt và ra 1,02:1 — trông y như một lỗi
  tương phản nghiêm trọng. Số thật 9,19:1. Nút nằm dưới header là chuyện bình
  thường ở vị trí cuộn đó; đọc thẳng `backgroundColor` của chính nút để đối chiếu.
- **Ảnh chụp có thể trúng lúc `Reveal` chưa chạy xong** — cả khối chữ mờ như bị
  hỏng màu. Chờ ~5 giây sau `scrollIntoView` rồi mới chụp, và kiểm `opacity`
  bằng số trước khi kết luận từ ảnh.
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

- Lệnh kiểm tra cuối: `pnpm verify` — sạch, exit 0 (104 trang, 50 file), chạy ở
  đúng trạng thái đã commit.
- Commit cuối: `6008306` (docs). Trước nó là bốn commit của lượt rà responsive
  trang chủ: `6139adb` (nút dải CTA hết bề ngang), `57210b1` (kệ phần cứng bỏ
  control chết), `309c784` (vùng chạm stepper và nút phóng to), `b29af64` (ô
  sản phẩm xuống hàng ngang dưới `lg`).
- **CHƯA PUSH.** Skill `commit` của repo chỉ cho push khi chủ dự án yêu cầu rõ.
- Việc chưa commit: không (trong worktree). Cây làm việc CHÍNH thì còn bản nháp
  cũ chưa commit — xem *Đang làm dở*.
- Nhánh: `worktree-training-section`, tách từ `develop` `4886998`. `develop`
  khớp `origin/develop` (`github.com/quantb-collab/pv-main-web`).
- ⚠️ `refs/remotes/origin/HEAD` chưa được set, nên lệnh dò nhánh mặc định trả
  rỗng và dễ bị đọc nhầm thành "repo chưa có remote". Dùng `git remote -v`.
