# Bàn giao — 2026-08-11

## Đang ở đâu

Trang chủ vẫn là mảng việc duy nhất đang mở, và section **phần mềm** vừa được
dựng lại lần thứ ba. Nó nay là một **bento bốn ô** — ô lớn nhất là PV One và
chính ô đó là stepper năm bước lướt qua năm màn sản phẩm; bấm vào ảnh thì mở
bản phóng to đọc được. Đây là lần đầu site có **giao diện sản phẩm thật** thay
vì ô chờ, nên phiên này đẻ thêm một luật riêng cho nó: `docs/SOFTWARE-KIT.md`.

Việc tiếp theo đã chốt hướng: **section đào tạo ứng dụng AI trong doanh
nghiệp** — mảng kinh doanh thứ ba, đứng cạnh phần cứng và phần mềm.

## Vừa hoàn thành

- `docs/SOFTWARE-KIT.md` — luật trưng giao diện PV One trên toàn site: ba luật
  biên giới giữa hai hệ màu, thang tỷ lệ, đặc tả `AppShot`, bản đồ 12 trang lấy
  màn nào, danh sách ảnh phải cắt, checklist nghiệm thu.
- **Năm ảnh màn PV One thật** ở `public/software/` — render 2× từ chính bộ bàn
  giao, cắt 2880×1800, tổng 6,4 MB. Avatar ảnh người đã thay bằng chữ viết tắt
  trước khi chụp.
- `src/components/pv/app-shot.tsx` — khung ảnh giao diện: poster 21:9 trên
  trang, bấm mở dialog ảnh một bên / chữ một bên, điều hướng `‹ 02/05 ›` sticky,
  phím ← →, nhãn "dữ liệu mẫu" không tắt được.
- `src/components/home/software-bento.tsx` — thay `software-shelf.tsx`.
- Prop mới cho block sẵn có: `BentoTile span` thêm `1x2` / `2x3`; `MediaFrame`
  thêm tỷ lệ `screen` (16:10), `focus="top"`, `quality`.
- `next.config.ts` khai `images.qualities: [75, 90]`.

## Đang làm dở

Không có việc dở trong code. Nhưng **chưa ai mở trình duyệt xem** — phiên này
không có tool trình duyệt, mới xác nhận được tới mức HTML, ảnh phục vụ 200 và
`q=90` trả đúng. Hai chỗ cần mắt:

1. **Bản phóng to** (`app-shot.tsx`) — dialog của Radix chỉ mount khi mở nên
   `curl` không soi được. Chưa ai thấy nó mở ra trông thế nào.
2. **Section ở 375 / 768 / 1440.** Phép tính cho 588px so với ngân sách 628px
   nên không tràn, khác kệ phần cứng vốn tràn 94px.

## Bước tiếp theo

1. Mở `localhost:3000`, bấm vào ảnh PV One, soi hai chỗ ở mục trên.
2. **Dựng section đào tạo ứng dụng AI** — mảng kinh doanh thứ ba. Trước khi
   viết JSX: đọc `home.who.r2Text` (`messages/vi.json`) vì nó đã khai ba mảng
   là "phần cứng, phần mềm và đào tạo AI", và section mới phải khớp cách gọi
   đó. Đặt sau `Software`, nấc trời `rise` (cùng nấc là hợp lệ) hoặc `dawn` nếu
   nó đứng ngay trước `CtaBand`. Chưa có khoá messages nào cho mảng này.
3. Chép bộ bàn giao POC vào `docs/one/` — hiện đang nằm ở `~/Downloads/handoff`,
   NGOÀI repo, và mọi con số trong `SOFTWARE-KIT.md` đo từ đó. Chép phần dựng
   lại được (5 `.dc.html` + `support.js` + `assets/` + `AGENTS.md` +
   `theme/globals.css` ≈ 1,2 MB), không chép 5 PNG 1× (5,3 MB, render lại được).
4. Xoá `src/components/home/software-shelf.tsx` — không ai gọi nữa, giữ lại chỉ
   vì nó chưa từng vào git. Xác nhận rồi xoá.
5. Sửa hydration `src/components/motion/parallax.tsx` (reduced-motion: server
   thiếu div bọc transform — chính là "1 Issue" trên overlay dev).
6. Đọc NAV từ `inNav` trong `registry.ts` thay mảng cứng `site-header.tsx:32`;
   đặt `inNav: false` cho `insights` (`registry.ts:566`).

## Đang chờ quyết định

- **`PV One` hay `Pebble One`** — chủ dự án — chặn việc viết chữ cho mọi trang
  có giao diện sản phẩm. Bộ bàn giao dùng `PV One` 16 lần (cả 5 màn và luật §5
  của `AGENTS.md`) và `Pebble One` 1 lần (mockup sidebar trong theme kit). Site
  đang dùng `PV One` vì đó là chữ in trong chính ảnh chụp. Sửa = một khoá
  `home.software.oneName`.
- **Phạm vi được công bố của PV One** — Pebble Vina — **chặn phát hành trang
  chủ**. Cần cho phép công bố: tên sản phẩm, bốn nhánh Sales · Supply · Factory
  · Finance, hai tầng One Core / One Plus, bốn engine E1–E4. Kèm theo: 9 cái tên
  người và công ty trong dữ liệu demo — nếu là tên thật thì phải có đồng ý, nếu
  bịa cho POC thì xác nhận là bịa.
- **Ảnh đang là tiếng Anh trên trang tiếng Việt** — chủ dự án — *Good morning,
  Mr. Thắng* · *Approvals inbox*. Dựng trang thì được, phát hành thì không. Sửa
  = thay chuỗi trong bản chép của `screens/` rồi chạy lại quy trình
  `SOFTWARE-KIT.md` §8. Tiếng Việt dài hơn EN 15–20% nên phải kiểm bố cục.
- **Ba sản phẩm hay một sản phẩm** — chủ dự án — kệ đang hiện bốn ô: PV One
  (có tư liệu) và ERP · Context Provider · MES (chưa có tài liệu, MES là suy
  đoán). Xem `home.software.lineupGap` và `scopeGap`.
- **Hero A hay C** · **Pebble Square: 4 việc trong một văn bản** · **danh sách
  ứng dụng MINT/PAPAYA** · **điều kiện đo `~160 TOPS`** · số đo thật cho 4 chỉ
  số bento · phân khúc ưu tiên · CRM nhận lead · brand kit — như phiên trước,
  chưa ai trả lời.
- **7 / 20 ảnh còn thiếu** — 3 ô nhỏ của kệ phần mềm nay cần ảnh MỘT thiết bị
  (không phải cụm ba như bản cũ), yêu cầu đã ghi trong `pXNeed`.

## Bẫy đã gặp

- **`DialogContent` của shadcn là `grid`.** Ô ảnh dùng `aspect-ratio` bị hàng
  lưới kéo giãn theo `align-items: stretch` — khung cao theo hàng còn ảnh bên
  trong vẫn `absolute inset-0`, nên nó **trùm xuống ô chữ**. Đổi sang
  `flex flex-col` là hết.
- **Đừng đặt `key` lên component có `Dialog` bên trong.** Đổi `key` là unmount
  rồi mount lại, và bản phóng to tự đóng đúng lúc người dùng bấm sang màn kế.
- **`next/image` mặc định `q=75`, và Next 16 chặn mọi mức không khai trong
  `images.qualities` bằng HTTP 400** — tức ảnh mất trắng chứ không xấu đi.
- **`t.has` trả false thì danh sách rỗng, và `steps[0].src` làm sập CẢ TRANG.**
  Danh sách dò bằng `t.has` phải luôn viết như có thể rỗng.
- **Chuỗi hiển thị chứa `one-home.png` làm `check:i18n` báo lỗi giả** — regex
  của nó bắt `home.png` như một khoá messages. Bỏ đuôi file khỏi chữ hiện trên
  trang.
- **Dò khung màn trong ảnh render phải dò bằng BỀ RỘNG dải sáng**, không dò
  bằng một cột — cột đơn sẽ bắt nhầm dòng tiêu đề của trang. Kiểm bằng cách
  khẳng định dải rộng đúng 2880.
- **Ô chờ vô hình là cố ý.** Trang chủ có 6 `data-gap` không vẽ ra pixel nào.
  Đừng xoá vì tưởng thừa.
- **Sửa `messages/*.json` xong PHẢI restart dev server.** Gặp lại lần nữa phiên
  này: server giữ bản cũ và báo `MISSING_MESSAGE` cho khoá đang có thật trong
  file, kèm `SoftwareShelf is not defined` từ module graph cũ.
- Cũ nhưng còn đúng: thêm vai trò chữ mới ở LỚP 3 thì phải thêm vào `TEXT_ROLES`
  trong `src/lib/utils.ts`, không thì `cn()` vứt cỡ chữ im lặng.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch, exit 0 (107 trang, 48 file).
- Commit cuối: xem `git log -1`. Toàn bộ phiên này **đã commit**.
- Dev server: chạy được, `/` `/en` `/ko` `/solutions` đều 200, log sạch.
