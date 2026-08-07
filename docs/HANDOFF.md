# Bàn giao — 2026-08-07

## Đang ở đâu

Trang chủ đã dựng xong khung 7 khối và là mảng việc duy nhất đang mở. Cả phiên
làm ba việc: **rút hai section thừa** khỏi trang chủ về trang riêng, **thêm hai
section giải pháp** (phần cứng trước, phần mềm sau), và **đổi CTA cuối trang
thành drawer** trượt từ phải. Section phần cứng nay là một **kệ sản phẩm** có
tab đối tác, hồ sơ Pebble Square và ba dòng chip kèm thông số thật.

Toàn bộ phiên **chưa commit** — 13 file sửa, 2 file mới.

## Vừa hoàn thành

- Trang chủ còn 7 khối, mạch: là ai → tôi ở nấc nào → đáng bao nhiêu → các anh
  đi sâu tới đâu → tôi bắt đầu từ việc nào → bước đầu tiên.
  Nấc trời `void → night → night → deep → deep → rise → dawn`.
- `Enterprise` → `/how-we-deliver/governance` · `FullStack` → `/about` (KHÔNG
  phải `/technology`: trang đó đã có LayerStack 8 tầng, và 4 lợi ích kia là lập
  luận cho CEO chứ không cho CTO). Trang chủ đền bằng một vế ở `home.who.r3Text`.
- Kệ sản phẩm `src/components/home/product-shelf.tsx` — tab đối tác, hồ sơ
  Pebble Square, 3 tầng chip.
- **Card gộp ảnh + tên thiết bị**, thay ô vuông 112px kèm một dòng nhãn riêng.
  Ảnh 16:9 rộng 198px (gấp 1,75 lần diện tích) vì nhãn nằm trong cùng khung
  viền nên không tốn dòng nào của tầng.
- **Băng carousel tự trôi theo bước** thay `animate-marquee`: khung cuộn ngang
  có `snap`, tự đi một card mỗi 4,2s, ba tầng lệch pha 1,3s; vuốt/trackpad/bàn
  phím/hai nút vẫn ăn ngay. Dừng khi rê chuột, khi focus bàn phím, khi ra khỏi
  khung nhìn, và khi bật `prefers-reduced-motion`. Nhịp nằm ở `SHELF` trong
  `src/lib/motion.ts`. Token `--animate-marquee` + keyframes đã gỡ.
- **Card sản phẩm không viền, nổi lên bằng ánh sáng** — nền dốc dọc
  `from-surface to-surface-2`, vệt sáng mảnh mờ dần ở chân thẻ, rê chuột thì
  nhấc 4px và vệt sáng ngả màu brand. Không dùng `box-shadow`.
- **Cột trái còn một hồ sơ CEO** + link web đối tác (chưa có URL) + 200+ SCI và
  800+ bằng sáng chế. Bỏ ba hồ sơ CTO/kiến trúc/thiết kế.
- **Ba dòng chip có màu riêng lấy từ tên** — bạc hà · đu đủ · cà phê. Ba token
  mới ở LỚP 1 `globals.css`, chroma đều thấp hơn `--pv-brand-400`. Màu chỉ hiện
  ở tên chip và mép sáng chân tầng kệ.
- **Thông số chip thật** (chủ dự án cấp, từ tài liệu Pebble Square):
  MINT `17 TOPS/W · mạng nơ-ron 4 triệu · 5×5 mm²` ·
  PAPAYA `30 TOPS/W · mạng nơ-ron 8 triệu · 5×5 mm²` ·
  ESPRESSO `Digital PIM · TSMC N6 · ~160 TOPS · ~10W`.
- Drawer khảo sát dùng chung `src/components/pv/assessment-drawer.tsx` —
  provider ở layout, mọi nút `cta="assessment"` mở chung một bản.
  `/ai-assessment` giữ nguyên form nhúng trong trang.
- `Contrast` nén 201 → 113 từ, giữ nguyên 4 hàng (bento của `Stats` nối 1:1).
- Prop mới cho block sẵn có: `Card href` (cả thẻ thành link),
  `MediaFrame compact` (ô chờ câm cho khung thấp dưới ~120px và cho chỗ có
  nhiều ô chờ đứng cạnh nhau), `AssessmentForm bare`.

## Đang làm dở

Không có việc dở trong code. Chờ mắt chủ dự án ở một chỗ chưa ai đo bằng trình
duyệt: **section phần cứng ở 1440×900**. Phép tính cho ~722px so với ngân sách
628px, tức **tràn ~94px** (khoảng 1,1 màn hình); từ 1000px chiều cao trở lên
thì vừa. Phần tràn là giá của card ảnh đọc được cộng khoảng thở quanh vật thể,
cả hai đều do chủ dự án chốt. Muốn về đúng một màn hình thì cắt theo thứ tự ghi
ở hằng `CARD` trong `product-shelf.tsx` — phải cắt cả ba nấc, và lúc đó ảnh còn
150×84. Dưới `lg` thì băng card tự xuống dòng riêng và rộng hết tầng.

## Bước tiếp theo

1. **Chốt hero A hay C** — thứ duy nhất treo suốt phiên, chặn việc đóng trang chủ.
   Cả hai giữ nguyên hai nút CTA hiện tại; chỉ khác H1 + lead.
   - **A** (hook mạnh nhất, cần sửa code): H1 = `Phần mềm thì đã có. Việc vẫn
     dừng lại chờ người.` · lead = `Pebble Vina làm phần mềm, phần cứng và đào
     tạo AI để doanh nghiệp số tự vận hành — người giữ quyền duyệt.`
     Kèm theo: tên thương hiệu rời khỏi H1 nên quầng `<Led>` và gạch chân
     `<Horizon>` phải chuyển từ `h1` xuống `p` trong `hero.tsx:101-123`, sửa
     `BRAND_TERMS`/`IS_PROMISE` ở `highlight.tsx:38-40`. H1 48 ký tự nên lên
     được `text-display`.
   - **C** (rủi ro bằng không, 0 dòng code): giữ nguyên H1 hiện tại, chỉ thay
     lead thành `Phần mềm, phần cứng và đào tạo AI cho doanh nghiệp đã có hệ
     thống nhưng việc vẫn dừng chờ người.` (96 ký tự = đúng độ dài dòng cũ).
2. Mở `/` ở 375 / 768 / 1440 và soi hai chỗ ở mục "Đang làm dở".
3. Sửa hydration `src/components/motion/parallax.tsx` (reduced-motion: server
   thiếu div bọc transform — chính là "1 Issue" trên overlay dev).
4. Đọc NAV từ `inNav` trong `registry.ts` thay mảng cứng `site-header.tsx:32`;
   đặt `inNav: false` cho `insights` (`registry.ts:566`).
5. Push + mở PR `feat/controls-hero-highlight` → `main`.

## Đang chờ quyết định

- **Hero A hay C** — chủ dự án — chặn bước 1.
- **Pebble Square: 4 việc trong một văn bản** — Pebble Vina — **chặn phát hành
  trang chủ**. (1) phạm vi được công bố quan hệ + cơ sở chữ "độc quyền";
  (2) **sự đồng ý của ông ChoongHyun Lee** cho việc nêu họ tên/chức danh/nơi
  từng làm trên trang công khai — đây là đồng ý của chính ông ấy, không phải
  của công ty (trước là 4 người, đã rút còn 1); (3) chốt thuật ngữ: tài liệu
  gốc ghi `Digital CIM Processor`, trang đang dùng `PIM`; (4) **địa chỉ web
  chính thức của Pebble Square** — chỗ link đang bỏ trống, có URL thì thêm
  `site: { href, label: t("p1SiteLabel") }` vào `intro` trong `Hardware`.
- **Danh sách ứng dụng MINT và PAPAYA** — Pebble Square — bản đang hiển thị là
  **nháp tôi suy từ hướng sản phẩm**. Của ESPRESSO thì lấy nguyên tài liệu. Ngoại
  lệ: `c2a1` aptomat chống hồ quang là ứng dụng THẬT do chủ dự án cấp 2026-08-07.
- **Aptomat chống hồ quang nằm ở PAPAYA nhưng không phải ứng dụng thị giác** —
  chủ dự án — lợi điểm dòng PAPAYA đang là "Nhìn và phán đoán ngay trên dây
  chuyền", mà aptomat đọc dạng sóng dòng điện. Chọn: nới câu lợi điểm PAPAYA,
  hoặc chuyển thiết bị sang MINT ("Nghe và cảm nhận ngay tại thiết bị").
- **7 / 20 ảnh còn thiếu** — 6 ảnh trang giải pháp · 1 ảnh About. Yêu cầu đầy đủ kèm bảng màu, prompt mẫu và quy trình giữ ổn định:
  **`docs/IMAGE-BRIEF.md`**. Tóm tắt: card thiết bị là PNG 1200×675 **nền trong
  suốt**, một nguồn sáng lạnh trên–trái, cùng góc máy cho cả bộ; ảnh About
  **không được sinh bằng AI**. Điền ảnh = thêm một dòng vào `PRODUCT_SRC` đầu
  hàm `Hardware` (`sections.tsx`), không phải sửa gì khác.
- ✅ **XONG toàn bộ 13 card thiết bị** (MINT 5 · PAPAYA 5 · ESPRESSO 3) trong `public/hardware/` (792 KB cả bộ). Hậu
  kỳ ảnh đã gói thành `scripts/prep-product-image.py`: gỡ bóng bake, chuẩn hoá
  cỡ vật thể, đệm 16:9, nén, và in ra dung lượng + pixel bóng + màu đèn báo.
- **Cỡ vật thể cân theo DIỆN TÍCH (34% khung), không theo chiều cao.** Cân theo
  chiều cao làm kệ PAPAYA nặng hơn kệ MINT thấy rõ — đo được 445 000 px² so với
  351 000, vì PAPAYA toàn thiết bị nằm ngang. Chuẩn diện tích qua hai vòng chủ
  dự án chỉnh: 42% → 34%, và trần chiều cao hạ 88% → 80% để vật dựng đứng nhỏ
  theo. Cả 10 ảnh đã chạy lại; sửa `SUBJECT_AREA` trong
  `scripts/prep-product-image.py` rồi chạy lại là đổi được cả bộ. Chủ dự án
  cấp bản vuông 1024×1024 — đã đệm trong suốt về 1200×675 và nén. **Ảnh vuông
  giao thẳng sẽ bị cắt mất 44% chiều cao**, công thức đệm ở `IMAGE-BRIEF.md`
  §2.6. Hai tấm (đồng hồ, gateway) có bóng đổ bake sẵn — đã gỡ bằng script ở
  §2.6, không gỡ thì bóng thành vệt xám bẩn trên nền thẻ.
- ⚠️ Bốn việc còn treo ở bộ ảnh đã có, chưa chặn gì nhưng nên xử trước khi làm
  ESPRESSO. (1) **"Robot trong kho" ra một hộp dẹt không bánh xe**, nhìn như
  set-top box và trùng silhouette với gateway IoT của MINT — đây là tấm sai
  nhiều nhất. (2) **Đèn báo bốn thiết bị PAPAYA ra hổ phách** (`#D9B145`,
  `#E7974A`, `#A7A370`, `#EDC24E`) — gần màu cảnh báo `#F2A029` hơn là màu
  accent `#EAAF8B`, mà đèn hổ phách trên thiết bị an toàn đọc ra là "đang có sự
  cố". (3) **Cảm biến nhà máy trông y hệt loa** ở dòng MINT. (4) **Panel nhà
  thông minh chụp gần chính diện** trong khi các tấm khác đều 3/4. (5) **"Tay
  robot" lệch khỏi hệ hình**: nhựa trắng bóng và bàn tay năm ngón kiểu người,
  trong khi 12 tấm kia đều titan nhám — và luật hình ảnh của repo cấm robot
  hình người. Nó cũng là vật sáng nhất bộ (51,9 so với nền thẻ 21). (6) **"AI
  PC" tối 23,8**, gần chạm nền thẻ, là tấm chìm nhất.
- **ESPRESSO rút từ 5 xuống 3 ứng dụng** (chủ dự án 2026-08-07): `AI PC` ·
  `Tay robot` · `Máy chủ AI`. Trang giờ KHÁC tài liệu Pebble Square (bản gốc
  ghi AI PC · Physical AI · Robotics · On-Premise Server · Enterprise AI) —
  nhớ khi đối chiếu datasheet.
- **Điều kiện đo thông số** — Pebble Square — `~160 TOPS` là peak hay
  sustained, ở tần số và nhiệt độ nào. Blueprint cấm benchmark thiếu điều kiện đo.
- Số đo thật cho 4 chỉ số bento · phân khúc ưu tiên · assessment phí/miễn phí ·
  CRM nhận lead · brand kit — như cũ.

## Bẫy đã gặp

- **`--subtle-foreground` cũ trượt AA trên TOÀN SITE**, không riêng một trang:
  `ink-400` chỉ cho 3.7:1 ở mọi nấc trời, mà nó là màu của eyebrow, nhãn mono,
  dòng thông số và 12 chỗ khác trong `blocks.tsx`/`section.tsx`. Sửa ở token
  (`ink-350`, 5.4–5.5:1) chữa hết một lượt; sửa từng component thì vừa sót vừa
  làm các trang lệch nhau.
- **`--brand` là ánh sáng, không phải mực.** Đem nó viết chữ nhỏ chỉ được
  4.5:1 (và `brand/80` thì 3.2:1). Chữ màu brand dùng `--brand-ink`
  (`pv-brand-300`, 7.1:1 ở mọi nấc trời).
- **Chú thích token cũng phải kiểm.** Chú thích ở `.sky-dawn` ghi "hai nấc cuối"
  nhưng chỉ `dawn` có override, `rise` thì không — và `rise` chính là nấc tệ
  nhất của bảng màu chữ. Chú thích sai dẫn người sửa sau đi nhầm chỗ.

- **Ngân sách chiều cao là con số, không phải cảm giác.** `--section-y` là
  8.5rem mỗi đầu ở desktop, nên trong màn 900px một section chỉ còn **~628px**.
  Mọi kích thước trong `product-shelf.tsx` tính ngược từ đó và có ghi phép tính
  tại chỗ. Nới một con số phải trừ vào con số khác.
- **Nhãn nằm ngoài ảnh là nhãn ăn cắp chiều cao của ảnh.** Ô 112px cũ nhỏ chính
  vì dòng tên thiết bị đứng riêng bên dưới, ăn 18px của MỌI tầng. Gộp nhãn vào
  trong khung card thì phần đó trả lại hết cho ảnh — không đổi bố cục, không
  đổi ngân sách, ảnh vẫn to lên 1,75 lần.
- **`scrollBy({behavior:"auto"})` KHÔNG phải là "không hoạt ảnh".** `auto` nghĩa
  là "theo CSS", mà track đang có `scroll-smooth` — nên reduced-motion vẫn trôi
  mượt. Phải viết thẳng `"instant"`.
- **`overflow-x-auto` khoá luôn trục dọc.** Một trục khác `visible` thì trục kia
  tự thành `auto`, nên mọi hiệu ứng nhấc/phóng của con bên trong đều bị cắt cụt
  hoặc đẻ ra thanh cuộn dọc. Phải chừa padding đúng bằng biên độ nhấc.
- **Chú thích JSX không đứng được ngay trước phần tử trong `.map()`.** Arrow
  function khi đó trả về hai node và Turbopack báo `Expected '</', got 'ident'`
  ở dòng ngay sau chú thích. Đặt chú thích ra ngoài `.map()`.
- **Sửa `messages/*.json` xong PHẢI restart dev server.** Gặp 5 lần trong phiên:
  dev giữ bản cũ và in thẳng đường dẫn khoá lên mặt trang, trong khi `pnpm
  verify` vẫn sạch. Khi nghi ngờ, tin `verify` chứ đừng tin màn hình.
- **Ô chờ vô hình là cố ý.** Trang chủ có 6 `data-gap` không vẽ ra pixel nào
  (4 số bento + 2 span ẩn cuối `Hardware`). Đừng xoá vì tưởng thừa — đó là thứ
  duy nhất còn chặn phát hành.
- `MediaFrame` bản thường cần ~110px chiều cao cho badge + một dòng `need`;
  khung thấp hơn thế, hoặc chỗ có nhiều ô chờ đứng cạnh nhau, thì dùng
  `compact`.
- Grep HTML tìm `R&D` sẽ trượt: trong DOM nó là `R&amp;D`.
- Cũ nhưng còn đúng: thêm vai trò chữ mới ở LỚP 3 thì phải thêm vào `TEXT_ROLES`
  trong `src/lib/utils.ts`, không thì `cn()` vứt cỡ chữ im lặng.

## Trạng thái kỹ thuật

- Lệnh kiểm tra cuối: `pnpm verify` — sạch, exit 0 (104 trang, 45 file), chạy
  sau khi dựng lại kệ phần cứng theo card + carousel.
- Trang chủ **~707 / 900 từ** (bỏ ba hồ sơ đội ngũ, −66 từ). Chỉ `Hardware` vẫn
  vượt trần section: **209 / 120 từ** hiện trên mặt trang, xuống từ 311 — phần
  vượt còn lại chủ yếu là hồ sơ CEO và 15 nhãn thiết bị.
- Commit cuối: `e2e3a44`. **Toàn bộ phiên chưa commit** — 13 file sửa, 2 file
  mới (`product-shelf.tsx`, `assessment-drawer.tsx`).
- Nhánh `feat/controls-hero-highlight`, chưa push, chưa PR.
