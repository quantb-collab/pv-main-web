# Tài liệu sinh ảnh — Pebble Vina

Toàn site cần **20 ảnh**; đã có 13 — xong toàn bộ nhóm A — còn thiếu 7. Tài
liệu này nói: mỗi ảnh cỡ bao nhiêu, nền trong suốt hay không, màu gì, vẽ ra sao, và làm thế nào để 13 tấm
sinh bằng AI trông như chụp cùng một buổi chứ không như gom từ 13 nơi.

Mọi con số ở đây suy ra từ code thật (`product-shelf.tsx`, `templates.tsx`,
`about/page.tsx`) và từ token màu ở `globals.css`. Sửa layout thì phải sửa lại
tài liệu này.

---

## 0. Ba nhóm, ba luật

| Nhóm | Chỗ dùng | Số ảnh | Khổ giao | Nền | Sinh bằng AI? |
|---|---|---|---|---|---|
| **A — Card thiết bị** | Kệ phần cứng, trang chủ | 13 ✅ | 1200×675 (16:9) | **Trong suốt** | ✅ Có |
| **B — Ảnh giải pháp** | 6 trang `/solutions/*` | 6 | 1920×1080 (16:9) | Đục | ⚠️ Được, có điều kiện |
| **C — Ảnh About** | `/about`, khối sứ mệnh | 1 | 2000×1500 (4:3) | Đục | ❌ **Không** — phải chụp thật |

Tổng dung lượng cả bộ nên nằm dưới **6 MB**: nhóm A ≤ 250 KB/tấm (PNG-24 có
alpha), nhóm B ≤ 400 KB/tấm (JPEG q80), nhóm C ≤ 600 KB.

Vì sao khác nhau: nhóm A là vật thể, đặt trên một ô màu do trang quyết định —
nền trong suốt là cách duy nhất để cả bộ không có mỗi tấm một sắc đen.
Nhóm B là cảnh, nền là một phần của ảnh. Nhóm C là bằng chứng Pebble Vina có
thật; một tấm ảnh sinh ra sẽ biến nó thành thứ ngược lại với điều nó phải nói.

---

## 1. Luật chung cho mọi ảnh

### 1.1 Bảng màu

Site chỉ có một chế độ: **đêm trước bình minh trên mặt titan sần**. Ánh ló rạng
màu xanh da trời — không phải nắng vàng, cũng không phải xanh đèn LED.

| Vai trò | HEX | Dùng để làm gì khi vẽ |
|---|---|---|
| Nền ô ảnh card thiết bị | `#121920` | Màu ô mà ảnh nhóm A sẽ nằm lên. **Duyệt ảnh trên đúng màu này.** |
| Nền trang, nấc `void` | `#040407` | Nền sau ảnh nhóm B |
| Nền trang, nấc `night` | `#07090E` | Nền sau ảnh nhóm C |
| Nền trang, nấc `deep` | `#0C1016` | Nền section phần cứng |
| **Ánh sáng chủ đạo** | `#68B6E6` | Màu đèn key và viền sáng trên MỌI vật thể |
| Ánh sáng nhạt | `#B8E2FA` | Điểm sáng gắt nhất, dùng rất tiết kiệm |
| Thân vật thể — titan tối | `#293137` | Màu vỏ máy phần tối (token `ink-800`) |
| Thân vật thể — titan trung | `#A5ACB1` | Màu vỏ máy phần giữa (token `ink-400`) |
| Thân vật thể — titan sáng | `#CCD0D5` | Màu vỏ máy phần bắt sáng (token `ink-300`) |

Ba màu dòng chip, **chỉ dùng cho đèn báo trạng thái nhỏ trên thiết bị**, xem §2.4:

| Dòng | HEX |
|---|---|
| MINT | `#A4D8C3` |
| PAPAYA | `#EAAF8B` |
| ESPRESSO | `#C0A58B` |

**Cấm tuyệt đối trên vật thể:** xanh lá `#00A260`, đỏ `#E7000B`, vàng cam
`#F2A029`. Ba màu đó trên site này là màu TRẠNG THÁI (ok / lỗi / cảnh báo) và
được giữ riêng cho việc đó. Một cái đèn xanh lá trên ảnh sản phẩm sẽ đọc ra là
"hệ thống đang chạy tốt", không phải "cái đèn cho đẹp".

### 1.2 Ánh sáng — một nguồn, một hướng, cho cả 20 tấm

- **Đèn chính:** trên–trái, chếch 45°, lạnh (~6500K, ngả về `#68B6E6`).
- **Đèn phụ:** dưới–phải, rất yếu (1/8 đèn chính), chỉ để phần tối không bết.
- **Viền sáng:** một vệt mảnh dọc mép trên–phải của vật thể, cùng màu đèn chính.
- **Không** đèn thứ ba, **không** flare, **không** hắt sáng nhiều màu.

Đây là điểm dễ trượt nhất khi sinh từng tấm rời rạc. Đèn đổi hướng giữa hai tấm
thì mắt đọc ra ngay là hai buổi chụp khác nhau, kể cả khi không nói ra được tại sao.

### 1.3 Máy ảnh

- Góc 3/4, cao hơn tầm mắt vật thể ~15°, **giống hệt nhau ở cả bộ**.
- Tiêu cự tương đương 50mm. Không góc rộng, không méo phối cảnh.
- Vật thể đặt giữa, chừa lề đều. Cỡ thì KHÔNG cần canh khi sinh — script hậu
  kỳ chuẩn hoá lại theo diện tích (xem §2.1), nên cứ để vật thể lớn và rõ.
- Không đổ bóng nền (nền trong suốt thì bóng đổ vào hư không).

### 1.4 Cấm — theo luật hình ảnh của repo

Không robot hình người · không bộ não phát sáng · không bàn tay chạm màn hình ·
không cyberpunk · không neon mạnh · không dashboard giả · không ảnh bắt tay ·
không con chip xuất hiện ở mọi section.

Thêm ba điều riêng cho ảnh sinh bằng AI:

- **Không chữ, không logo, không số hiệu trên thiết bị.** Công cụ sinh ảnh viết
  chữ sai gần như chắc chắn, và một dòng chữ méo trên ảnh sản phẩm phá sạch độ
  tin cậy mà cả section đang cố xây.
- **Không người, không tay.**
- **Không hạt sáng bay, không sương, không bokeh.** Chất liệu của site là titan
  nhám; lớp hạt do trang tự phủ (`pv-grain`), ảnh không cần tự thêm.

---

## 2. Nhóm A — 13 card thiết bị (đã xong)

### 2.1 Kích thước và nền

- **Giao:** PNG-24, **1200×675**, tỷ lệ 16:9 chính xác, **nền trong suốt (alpha)**.
- **Hiển thị:** 198×111 trên desktop 1440px. Giao 1200 là để dư cho màn mật độ
  cao và cho trang `/technology/edge-hardware` sau này dùng khung to hơn.
- Ảnh được đặt bằng `object-cover` — **sai tỷ lệ là bị cắt**, không phải bị
  co. Đúng 16:9 hoặc không giao.
- **Cỡ vật thể cân theo DIỆN TÍCH, không theo chiều cao** — 34% diện tích
  khung, có trần 80% chiều cao và 78% bề ngang. Script hậu kỳ tự làm việc này.

  Vì sao không cân theo chiều cao: một camera nằm ngang và một đồng hồ dựng
  đứng cùng cao 594px thì camera rộng gấp đôi, tức nặng gấp đôi trên mặt kệ.
  Đo thật khi làm hai dòng đầu: cách cũ cho PAPAYA trung bình 445 000 px² so
  với MINT 351 000 — riêng hai tấm nằm ngang hơn 60–77%, và mắt nhìn ra ngay là
  "kệ PAPAYA to hơn kệ MINT". Mắt đọc to nhỏ bằng diện tích.

  Vật dựng đứng (aptomat, đồng hồ) chạm trần chiều cao trước khi đạt 34% nên nó
  nhỏ hơn chuẩn. Đó là giới hạn của khung 16:9, không phải lỗi cần chữa.

**Vì sao trong suốt:** ô ảnh nằm trên nền `#121920` của card, mà card lại nằm
trên tầng kệ nền `#0C1016`. Nếu mỗi tấm tự mang nền đen của riêng nó thì chúng
lệch nhau, và cả kệ đọc ra là ảnh dán chồng. Alpha để trang quyết định nền, và
ngày nào đổi nấc `sky` thì cả bộ tự đúng theo.

Hệ quả bắt buộc: **không bake bóng đổ vào ảnh.** Bóng tối trên nền trong suốt
sẽ thành một mảng xám bẩn khi đặt lên `#121920`. Vật thể đứng bằng viền sáng,
không bằng bóng.

### 2.2 Mười ba chủ thể

Nhãn tiếng Việt là chữ đã hiện trên trang, không sửa. Cột "chủ thể" là thứ để
đưa vào công cụ sinh ảnh.

**MINT** — nghe và cảm nhận ngay tại thiết bị

| # | Nhãn trên trang | Chủ thể để sinh ảnh |
|---|---|---|
| 1 | Trợ lý giọng nói | ✅ đã có — small matte cylindrical smart speaker, fine fabric grille, thin light ring on top |
| 2 | Thiết bị đeo | ✅ đã có — minimal smartwatch, brushed metal case, plain dark strap, screen off |
| 3 | Cảm biến nhà máy | ✅ đã có — compact industrial vibration sensor puck, threaded metal base, short cable gland |
| 4 | Thiết bị IoT | ✅ đã có — small sealed IoT gateway box, one stubby antenna, two tiny indicator lights |
| 5 | Nhà thông minh | ✅ đã có — flush wall-mounted smart home panel, plain dark glass front |

**PAPAYA** — nhìn và phán đoán ngay trên dây chuyền

| # | Nhãn trên trang | Chủ thể để sinh ảnh |
|---|---|---|
| 1 | An toàn điện | ✅ đã có — DIN-rail arc-fault circuit breaker, toggle lever, vented top |
| 2 | Kiểm tra chất lượng | ✅ đã có — industrial machine-vision camera, C-mount lens, ribbed aluminium body |
| 3 | Camera an ninh | ✅ đã có — bullet-style security camera with sunshade and wall bracket |
| 4 | Đếm và phân loại | ✅ đã có — compact overhead vision sensor on a slim mounting arm |
| 5 | Robot trong kho | ✅ đã có — low-profile warehouse transport robot, flat top deck, no branding |

⚠️ **"An toàn điện" không phải ứng dụng thị giác.** Nó là ứng dụng THẬT
duy nhất trong danh sách PAPAYA (chủ dự án cấp 2026-08-07) nên nó đứng đầu băng
— nhưng lợi điểm của dòng PAPAYA đang viết là *"Nhìn và phán đoán ngay trên dây
chuyền"*, mà aptomat thì đọc dạng sóng dòng điện chứ không nhìn gì cả. Phải
chốt một trong hai: nới câu lợi điểm của PAPAYA, hoặc chuyển thiết bị này sang
dòng MINT (*"Nghe và cảm nhận ngay tại thiết bị"* — khớp hơn hẳn).

**ESPRESSO** — chạy mô hình lớn trong hạ tầng của bạn

Chỉ BA mục. Tài liệu Pebble Square ghi năm (AI PC · Physical AI · Robotics ·
On-Premise Server · Enterprise AI); chủ dự án 2026-08-07 rút còn ba và đổi tên
hai mục. Trang giờ khác tài liệu gốc — nhớ khi đối chiếu datasheet.

| # | Nhãn trên trang | Chủ thể để sinh ảnh |
|---|---|---|
| 1 | AI PC | ✅ đã có — compact desktop mini PC tower, perforated front panel |
| 2 | Tay robot | ✅ đã có — articulated robotic arm on a round base |
| 3 | Máy chủ AI | ✅ đã có — 1U rack server, front drive bays, no logos |

### 2.3 Prompt — một khối phong cách, một khe chủ thể

Đây là phần trả lời câu "làm sao cho ổn định". Nguyên tắc: **khối phong cách
không được đổi một ký tự nào giữa các lần sinh**. Chỉ thay đúng cụm trong `{ }`.

```
{CHỦ THỂ}, isolated product shot on a pure transparent background,
photorealistic industrial product photography, matte titanium and dark
graphite surfaces, no branding, no text, no logos, no numbers,
single cold key light from upper left at 45 degrees, colour temperature 6500K
with a faint sky-blue cast, very weak fill from lower right, thin cold rim
light along the upper right edge, no cast shadow, no ground plane,
three-quarter view from 15 degrees above, 50mm lens, no perspective
distortion, subject centred and occupying 80 percent of frame width,
16:9 frame, clean and restrained, no neon, no glow particles, no fog,
no bokeh, no people, no hands
```

Negative prompt (công cụ nào có ô riêng thì điền vào đó):

```
text, letters, numbers, logo, watermark, brand name, human, hands,
neon, cyberpunk, glowing brain, humanoid robot, lens flare, fog, smoke,
particles, bokeh, warm orange light, green LED, red LED, cluttered
background, drop shadow, reflection on floor
```

### 2.4 Đèn báo trạng thái — chỗ duy nhất được có màu

Mỗi thiết bị được phép có **một** đèn báo nhỏ. Màu đèn theo dòng chip của nó:

- Mọi thiết bị dòng MINT: `#A4D8C3`
- Mọi thiết bị dòng PAPAYA: `#EAAF8B`
- Mọi thiết bị dòng ESPRESSO: `#C0A58B`

Thêm vào cuối khe chủ thể: `a single small indicator light in soft mint green
(#A4D8C3), very dim` — đổi màu và tên theo dòng.

Mục đích: xem lướt cả kệ thì ba dòng chip đọc ra là ba họ sản phẩm, đúng như
màu tên chip và mép sáng chân tầng kệ đang làm. Đèn phải **rất mờ** — nó là
một chấm, không phải một nguồn sáng. Đèn sáng bằng đèn key là hỏng cả luật
"một nguồn sáng".

### 2.5 Quy trình sinh — sáu bước, đừng bỏ bước 2

1. Sinh MỘT tấm mở màn của dòng chip đó trước, 4 biến thể, chọn 1.
2. **Duyệt tấm số 1 trên nền `#121920` ở đúng cỡ 198×111 trước khi sinh tiếp.**
   Đây là bước hay bị bỏ, và bỏ nó thì 14 tấm sau đều phải làm lại: thứ trông
   đẹp ở 1200px có thể thành một cục xám ở 198px.
3. Dùng chính tấm đã duyệt làm **ảnh tham chiếu phong cách** (style reference /
   image prompt) cho những tấm còn lại. Đây là thứ giữ ổn định mạnh hơn mọi câu
   chữ trong prompt.
4. Cố định seed nếu công cụ cho phép. Đổi seed chỉ khi đổi chủ thể, không đổi
   khi chỉnh chữ trong prompt.
5. Mỗi chủ thể sinh 4 biến thể rồi chọn 1. Đừng sinh 1 tấm rồi sửa prompt cho
   vừa ý — sửa prompt là phá phong cách chung.
6. **Duyệt theo BỘ, không theo TẤM.** Xếp cả bộ cạnh nhau trên nền
   `#121920`. Tấm nào lệch cỡ, lệch góc máy hoặc lệch hướng đèn thì làm lại
   tấm đó, không chỉnh những tấm kia cho vừa nó.

   Ba lỗi bộ MINT thực sự vấp phải, cả ba chỉ lộ ra khi xếp cạnh nhau:
   - **Hai thẻ trông như một sản phẩm hai cỡ.** Cảm biến nhà máy ra cùng vân
     vải và cùng vòng sáng với loa. Ảnh tham chiếu phong cách (bước 3) kéo
     nhất quán, nhưng kéo hơi quá — chủ thể nào dễ lẫn thì phải nói rõ trong
     prompt cái gì KHÁC: `brushed metal housing, no fabric`.
   - **Đèn báo rơi vào màu trạng thái.** Gọi màu bằng CHỮ là hỏng: "mint green"
     ra xanh lá bão hoà `#41A072`, "papaya" ra hổ phách `#E89747` — cái đầu
     đụng màu OK, cái sau đụng màu cảnh báo. Phải ghi thẳng mã (`#A4D8C3` /
     `#EAAF8B` / `#C0A58B`) và đo lại sau khi sinh; script hậu kỳ in sẵn màu
     đèn cho việc này. Đèn chỉ vài chục pixel, nhưng một cái đèn hổ phách trên
     ảnh thiết bị AN TOÀN đọc ra là "đang có sự cố".
   - **Một tấm chụp gần chính diện** trong khi bốn tấm kia 3/4. Góc máy là thứ
     lệch mà mắt khó gọi tên nhất — cứ đo bằng cách xếp cạnh nhau.
   - **Chủ thể ra sai loại thiết bị.** "warehouse transport robot" ra một cái
     hộp dẹt không bánh xe, nhìn như set-top box — và trùng silhouette với
     gateway IoT ở dòng MINT. Chủ thể nào định nghĩa bằng CÔNG VIỆC chứ không
     bằng hình dáng thì phải tả hình dáng ra: bánh xe, thân thấp, mặt sàn chở
     hàng.

### 2.6 Hậu kỳ

1. Tách nền về alpha thật. **Soi kỹ viền**: công cụ tách nền hay để lại quầng
   trắng mảnh — trên nền `#121920` quầng đó hiện rõ như một đường kẻ.

   **Gỡ bóng đổ bake sẵn.** Công cụ sinh ảnh gần như luôn kèm một vùng bóng mờ
   dưới vật thể, kể cả khi prompt đã cấm. Nó vừa thành vệt xám bẩn trên nền
   thẻ, vừa làm hỏng bước đệm ở dưới: bóng ăn vào khung alpha nên `getbbox()`
   trả về cả bóng, và vật thể bị thu nhỏ lệch tâm. Bóng có chữ ký riêng — bán
   trong suốt VÀ rất tối — nên thân máy màu đen (alpha 255) không bị đụng:

   ```python
   import numpy as np
   a = np.array(im)                                   # im là RGBA
   alpha, rgb = a[..., 3].astype(int), a[..., :3].astype(int)
   a[..., 3] = np.where((alpha < 170) & (rgb.max(-1) < 38), 0, alpha)
   im = Image.fromarray(a.astype(np.uint8))
   ```

   Đo trước khi tin: đếm `(15 < alpha < 200) & (max(rgb) < 45)`. Bộ MINT có tấm
   sạch 15 px, có tấm 32 000 px — chênh nhau hai bậc, mắt không thấy được.
2. Đưa về đúng 1200×675. **Công cụ sinh ảnh thường xuất khổ vuông 1024×1024** —
   đừng giao thẳng: khung dùng `object-cover` nên ảnh 1:1 bị **cắt mất 44%
   chiều cao**, đầu và chân thiết bị đi mất. Đệm trong suốt cho đủ 16:9:

   Cả ba bước hậu kỳ đã gói trong `scripts/prep-product-image.py` (cần
   `pip install pillow numpy`), chạy một lệnh cho nhiều ảnh:

   ```bash
   python3 scripts/prep-product-image.py \
     ~/Downloads/cam.png papaya-vision-camera \
     ~/Downloads/bot.png papaya-warehouse-robot
   ```

   Nó in ra ba số để soát ngay: dung lượng, số pixel bóng đã gỡ, và màu đèn báo.

   Vật thể gần vuông sau khi đệm chỉ chiếm ~50% bề ngang khung, phần còn lại là
   trong suốt. **Đó là đúng, không phải lỗi** — trong khung cao 111px thì vật
   thể chỉ cao được ngần ấy dù khung vuông hay 16:9; khổ ngang chỉ thêm khoảng
   thở hai bên. Chỉ thiết bị nằm ngang thật (máy chủ rack, robot kho) mới lấp
   được 80% bề ngang.
3. Nén xuống dưới 250 KB, **giữ alpha**. Máy này chưa cài `pngquant`, dùng PIL:

   ```python
   Image.open("thiet-bi.png").quantize(colors=200, method=Image.FASTOCTREE) \
        .save("thiet-bi.png", optimize=True)
   ```

   Đã đối chứng ở 2× cỡ hiển thị: 862 KB và 196 KB không phân biệt được bằng
   mắt. Dung lượng nguồn không ảnh hưởng người xem (`next/image` mã hoá lại
   sang webp/avif) — nó ảnh hưởng dung lượng repo, 13 tấm chưa nén là ~11 MB.
4. Đặt tên không dấu, không khoảng trắng, theo mẫu `<dòng-chip>-<thiết-bị>.png`:
   `mint-voice-assistant.png` · `papaya-security-camera.png` ·
   `espresso-rack-server.png`.
5. Bỏ vào `public/hardware/`.

### 2.7 Nối vào code — đã có sẵn chỗ, chỉ điền một dòng

Bảng `PRODUCT_SRC` nằm đầu hàm `Hardware` (`src/components/home/sections.tsx`).
Khoá là số dòng chip, thứ tự trong mảng khớp `c{n}a{1..5}`:

```ts
const PRODUCT_SRC: Record<number, (string | undefined)[]> = {
  1: ["/hardware/mint-voice-assistant.png"],   // MINT
  2: [],                                        // PAPAYA
  3: [],                                        // ESPRESSO
};
```

Bỏ file vào `public/hardware/`, thêm đường dẫn vào đúng vị trí trong mảng. Chỗ
chưa có ảnh để `undefined` hoặc bỏ trống cuối mảng — `MediaFrame` tự hiện ô chờ
câm. Không phải sửa gì khác.

`MediaFrame` đã nhận prop `sizes` và card thiết bị đang khai `200px`, nên
`next/image` phục vụ bản 256w/384w thay vì 640w. Thêm ảnh không cần đụng vào đó.

---

## 3. Nhóm B — 6 ảnh trang giải pháp

Sáu trang: `enterprise-knowledge` · `document-intelligence` ·
`workflow-automation` · `ai-agents` · `private-ai` · `industrial-edge-ai`.

- **Giao:** JPEG, **1920×1080** (16:9), nền **đục**.
- **Hiển thị:** ~511×287, cột phải của hero, trên nấc `void` (`#040407`).
- Ưu tiên theo thứ tự: **ảnh chụp màn hình sản phẩm thật** → ảnh người dùng
  đang làm việc thật → ảnh sinh bằng AI. Ảnh sinh là lựa chọn cuối.
- Nếu sinh bằng AI: giữ nguyên §1.2 (ánh sáng) và §1.4 (cấm). Nền ảnh phải là
  một sắc tối trong khoảng `#07090E`–`#1A232B` để nó liền với nấc trời quanh nó.
- **Không dùng dashboard giả.** Một giao diện bịa trên trang bán phần mềm là
  thứ người mua Enterprise nhận ra nhanh nhất.

Sáu tấm này không chặn phát hành trang chủ, nhưng chặn việc nâng trạng thái sáu
trang giải pháp trong `/track`.

---

## 4. Nhóm C — ảnh About

- **Giao:** JPEG, **2000×1500** (4:3), nền đục.
- **Hiển thị:** ~568×426, cột phải khối sứ mệnh `/about`, nấc `night` (`#07090E`).
- **Không sinh bằng AI. Không mua ảnh stock.**

Yêu cầu đang ghi trong code: *"Ảnh không gian làm việc hoặc phòng lab thật của
Pebble Vina. Có người, chụp tự nhiên, không dàn dựng kiểu ảnh stock."*

Đây là ảnh duy nhất trên site có nhiệm vụ chứng minh công ty này có thật, có
chỗ làm việc thật và có người thật. Một tấm ảnh sinh ra làm đúng việc ngược
lại. Chụp bằng điện thoại đời mới, ánh sáng sẵn có, còn hơn một tấm render hoàn hảo.

Kèm: người có mặt trong khung phải đồng ý cho dùng ảnh trên trang công khai.

---

## 5. Nghiệm thu — chạy trước khi giao

- [ ] Đúng tỷ lệ khung? (A và B là 16:9 chính xác, C là 4:3)
- [ ] Nhóm A có alpha thật, không có quầng trắng ở viền?
- [ ] Đặt cả bộ nhóm A cạnh nhau trên `#121920`: cùng cỡ vật thể, cùng góc
      máy, cùng hướng đèn?
- [ ] Xem ở đúng cỡ hiển thị (198×111) — còn nhận ra đó là cái gì không?
- [ ] Không có chữ, số, logo nào trên vật thể?
- [ ] Không có đèn xanh lá / đỏ / vàng cam?
- [ ] Không có người, tay, robot hình người?
- [ ] **Độ sáng vật thể nằm trong dải 19–52** (thang 0–100, nền thẻ là 21)?
      Đo bằng luminance trung bình của pixel đục. Dưới 19 thì vật thể chìm vào
      nền thẻ; trên 52 thì nó nhảy ra khỏi kệ và kéo hết mắt về một thẻ.
- [ ] Dung lượng dưới ngưỡng ở §0?
- [ ] Tên file không dấu, không khoảng trắng?

---

## 6. Những ô chờ KHÔNG phải ảnh

Đừng nhầm. Trang chủ còn 6 `data-gap` không vẽ ra pixel nào, và các trang
use-case còn nhiều ô chờ nội dung — đó là **chữ và số liệu cần Pebble Vina
cung cấp**, không phải ảnh. Danh sách đầy đủ ở `/track`.

Một khoá đang mồ côi: `home.hero.mediaNeed` trong `messages/vi.json` mô tả một
ảnh nền hero khổ ≥2560px, nhưng hero hiện **không có khung ảnh nào** đọc khoá
đó. Hoặc dựng lại khung ảnh hero, hoặc xoá khoá — đừng đi đặt tấm ảnh 2560px đó
trước khi chốt, vì hiện không có chỗ nào nhận nó.
