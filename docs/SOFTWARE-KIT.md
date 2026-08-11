# Bộ dựng phần trưng phần mềm — PV One trên site

Cách đưa giao diện thật của **PV One** lên website, ở trang chủ và mọi trang
khác, mà không phá hệ màu của site và không biến ảnh demo thành lời hứa.

Đọc kèm: `docs/DESIGN-TOKENS.md` (hệ token của site) · `docs/IMAGE-BRIEF.md`
(ảnh phần cứng, nhóm A–D) · `docs/BLUEPRINT-RULES.md` §17 §22 §24.

---

## 0. Nguồn và thứ tự ưu tiên

Bộ bàn giao POC "Đơn hàng Sao Đỏ", đóng băng **10 Aug 2026 · 07:58**:

| # | File trong bộ bàn giao | Là gì |
|---|---|---|
| 1 | `screens/*.dc.html` | 5 màn desktop 1440×900, **spec pixel** — đọc inline style ra số |
| 2 | `theme/globals.css` | Token layer Aurora v2 (dark-only, Tailwind v4) |
| 3 | `theme-kit/Pebble Aurora - Theme Kit.dc.html` | Foundations → Atoms → Molecules → Organisms → Templates |
| 4 | `AGENTS.md` | 15 luật cứng + dữ liệu demo đóng băng + luật đặt tên |
| 5 | `screens-png/*.png` | Ảnh 1:1 để so mắt |

Năm màn: `01 Home / Morning brief` · `02 Approvals inbox` · `03 Global search` ·
`04 AI assistant` · `05 Notifications & channels`.

> ⚠️ **Bộ nguồn đang nằm ở `~/Downloads/handoff`, ngoài repo.** Mọi con số
> trong tài liệu này đo từ đó. Một lần dọn thư mục Downloads là mất spec.
> Việc phải làm trước khi cắt tấm ảnh đầu tiên: chép bộ đó vào `docs/one/` và
> commit. Chép **phần dựng lại được**, không chép ảnh: 5 file `.dc.html` +
> `support.js` + `assets/` + `AGENTS.md` + `theme/globals.css` ≈ **1,2 MB**
> (riêng `wordmark-light.png` đã 304 KB — nén lại trước khi commit). Năm ảnh
> PNG 1440×900 nặng **5,3 MB** và render lại được từ chính năm file HTML kia,
> nên chúng không vào git.

---

## 1. Phần trưng phần mềm là gì

Trước bộ bàn giao này, site **không có** giao diện sản phẩm để trưng, nên
`IMAGE-BRIEF` §3.3 đặt luật "màn hình phải câm" và ba mức leo thang:

1. ảnh chụp sản phẩm THẬT ← **giờ đã có**
2. màn hình chỉ có ánh sáng ← mức site đang dùng
3. màn tắt hẳn

Tài liệu này là mức 1. Nó **thay thế** §3.3 cho ba tấm nhóm D, và chỉ cho ba
tấm đó — luật "không dashboard giả" không đổi một chữ, chỉ là từ nay không phải
bịa nữa vì đã có bản thật.

Hệ quả: nhóm D không còn là ảnh thiết bị nền trong suốt. Nó là **ảnh chụp màn
hình**, và mọi con số trong `IMAGE-BRIEF` §3.1–§3.5 (dải sáng 30–58, diện tích
40%, cụm ba thiết bị) **không áp cho phần trưng phần mềm nữa**. Bảng dưới đây
thay chỗ đó.

### 1.1 Sản phẩm ở giữa: PV One

Không phải một bộ ứng dụng. **Một sản phẩm, đứng trên bốn engine**, và năm màn
là năm góc nhìn vào cùng bốn engine đó chứ không phải năm module:

`E1 · Object graph` · `E2 · Permissions & audit` · `E3 · Approval engine` ·
`E4 · Multi-channel notifications`.

Hai tầng license, và một năng lực chỉ nằm ở đúng một tầng:

- **One Core** — Home · Global search · Approvals · Notifications · Directory ·
  Admin · Integrations. Bán cho Giám đốc điều hành, và ở màn 03 là bán cho cả
  công ty.
- **One Plus** — People · Documents & processes · Work · Reports · AI
  assistant. **Tính theo chỗ ngồi.**

Bốn nhánh sở hữu dữ liệu: **Sales · Supply · Factory · Finance**.

Xương sống là **một câu chuyện, tám object, bốn nhánh**:
`LD-0334 → BG-0512 → HĐ-2607 → SO-0891 → WO-1180 → PR-0231 → PO-0455 →
L-2608-042`. `ContextRail` bắt buộc có mặt trên mọi màn chính là E1 hiện ra
thành vật nhìn được — đó là lý do luật 14 của bộ bàn giao coi nó là bắt buộc.

Mỗi màn bán một thứ khác nhau, và mỗi màn có sẵn một câu chốt. **Đây là tư liệu
gốc cho `caption` của `AppShot`** — đừng viết lại từ đầu:

| Màn | Bán cho | Engine | Câu chốt |
|---|---|---|---|
| 01 Home / Morning brief | One Core · Giám đốc | — | *"Anh không cần ai báo cáo cho anh nữa."* |
| 02 Approvals inbox | One Core · Giám đốc | E3 (+E2) | *"Anh duyệt tại chỗ, không phải gọi cho ai."* |
| 03 Global search | One Core · **cả công ty** | E1 + E2 | *"Mỗi người tìm được đúng bằng thứ họ được phép thấy."* |
| 04 AI assistant | **One Plus · theo chỗ ngồi** | đọc qua E1, chặn bởi E2, xin phép qua E3 | *"Nó biết mọi thứ, và không tự làm gì cả."* |
| 05 Notifications & channels | One Core · Giám đốc | E4 | *"Tin tới đúng người phải hành động, không phải một nhóm bốn mươi người."* |

Cả năm màn viết theo cùng một khuôn **Before Pebble / After Pebble** — và site
đã có sẵn block cho đúng khuôn đó (`BeforeAfter` trong `blocks.tsx`). Trưng một
màn kèm cặp trước/sau của chính nó là cách rẻ nhất để ảnh có luận điểm mà không
phải viết thêm chữ.

Điều quan trọng nhất cho định vị của site: **PV One không bán AI, nó bán việc
bỏ được khâu người chạy tin.** Và luật 13 của sản phẩm — *AI không bao giờ tự
làm* — là bản thi hành của đúng câu dẫn hero đang chạy: *Công cụ không thay thế
con người*. Màn 04 nói thẳng câu đó: *"It knows everything, and does nothing on
its own."* Đây là cặp mạnh nhất mà phần trưng phần mềm có thể dùng.

### 1.2 ⚠️ Tên sản phẩm: `PV One` hay `Pebble One`

Trong chính bộ bàn giao, hai tên cùng tồn tại:

- **`PV One` — 16 lần**, ở cả 5 màn (logo sidebar, *"Open in PV One"*) và ở
  `AGENTS.md` §5, nơi nó là luật: *"Sản phẩm trung tâm luôn gọi PV One."*
- **`Pebble One` — 1 lần**, trong mockup sidebar `O-01` của theme kit.

`AGENTS.md` §0 đã có sẵn cách xử: *file thắng tài liệu*, và 5 màn là spec pixel
đứng trên theme kit. Theo đó tên đúng là **PV One**, còn `Pebble One` là nhãn
sót lại của bản dựng cũ.

Nhưng đây là **tên thương hiệu sẽ in lên trang công khai**, không phải một
chuỗi trong code — nên chốt là việc của chủ dự án, không phải suy ra từ thứ tự
ưu tiên file. Hỏi luôn thể ba tên còn lại đã xuất hiện trên giao diện: trợ lý
tên **`Pebble assistant`**, tài khoản Zalo tên **`Pebble Vina OA`**, và tên
công ty demo là `Thắng Lợi Engineering`.

---

## 2. Hai hệ màu gặp nhau — số đo trước, luật sau

Aurora và site là hai hệ khác nhau. Đo bằng oklch:

| Vai | Aurora | pv-web |
|---|---|---|
| nền màn / nền section `rise` | `#0B1220` · **L .183** C .031 H 263 | `night-3` `#121920` · **L .210** C .017 H 248 |
| xanh làm nền | `#2E63E6` · L .545 **C .207** H 264 | `brand-400` `#68B6E6` · L .744 **C .104** H 238 |
| xanh làm chữ | `#7FA3FF` · L .728 C .140 H 267 | `brand-300` `#90CEF4` · L .822 C .083 H 236 |
| chữ chính | `#E5E7EB` · L .928 | `ink-50` `#F6F7F9` · L .976 |
| chữ phụ | `#93A1B8` · L .706 C .037 | `ink-350` `#B9BEC4` · L .800 C .009 |

**Số đo 1 — màn sản phẩm không có mép.** Tương phản giữa nền Aurora và nền
section, theo từng nấc trời:

| Nấc | Nền section | Tương phản với `#0B1220` | Màn đọc ra là |
|---|---|---|---|
| `void` | `#040407` | 1.09 | cửa sổ **sáng hơn** trang |
| `night` | `#07090E` | 1.06 | cửa sổ sáng hơn, rất mảnh |
| `deep` | `#0C1016` | **1.02** | không thấy mép, hai mặt phẳng dính nhau |
| `rise` | `#121920` | 1.06 | hõm **tối hơn** trang |
| `dawn` | `#1A232B` | 1.18 | hõm, mép rõ nhất trong năm nấc |

Cao nhất cả bảng là 1.18. Không nấc trời nào cho màn sản phẩm một đường mép
nhìn thấy được. ⟹ **Mép phải do KHUNG vẽ ra, không nấc nào tự lo.**

Nấc trời chỉ quyết định màn đọc ra là **cửa sổ** (`void`/`night` — màn sáng hơn
trang) hay **hõm** (`rise`/`dawn` — màn tối hơn trang). Cả hai đều dùng được;
chọn theo mạch của trang, không theo cái ảnh.

Ghi chú cho thang bề mặt: bất biến của site là *một bề mặt nổi lên = một nấc
trời sáng hơn*. Màn sản phẩm ở `rise`/`dawn` là **thứ duy nhất trên site đi
ngược thang** — nó lún xuống. Đó là lý do nó không bao giờ được dùng chung vật
liệu với `Card`: một cái nổi lên, một cái lún xuống, cùng bo góc thì mắt đọc ra
lỗi render.

**Số đo 2 — azure của Aurora mạnh gấp đôi trần của site.** Chroma .207 so với
trần .122 của cả thang brand (`brand-600`) là **1,99 lần**, và hue lệch **26°**
về phía chàm. Đúng thứ mà chú thích LỚP 1 của `globals.css` ghi là đã loại bỏ
("xanh đèn LED"). Một ảnh chụp PV One đặt trên trang là **nguồn sáng thứ hai**,
và nó mạnh hơn bình minh.

Không sửa được bằng cách chỉnh màu ảnh — chỉnh màu ảnh sản phẩm là nói dối về
sản phẩm. Chỉ sửa được bằng **diện tích** và **vị trí**.

### Ba luật

**Luật 1 — Aurora không bao giờ chạm chrome của trang.**
Không một giá trị nào của Aurora được vào LỚP 1–2 của `globals.css`. Không nút,
không nav, không heading, không quầng sáng nào của site ăn màu Aurora. Site vẫn
một nguồn sáng: bình minh ở chân trời.

**Luật 2 — mọi pixel Aurora nằm trong một khung do site sở hữu.**
Khung là `AppShot` (§4). Ngoài khung là token của site; trong khung là ảnh, và
không có gì của site được vẽ đè lên ảnh — kể cả nhãn, kể cả gradient làm mờ
mép. Đè chữ của site lên ảnh Aurora là lấy tương phản của hệ này áp lên nền của
hệ kia; không bảng nào bảo đảm được con số đó.

**Luật 3 — không đụng vào pixel, chỉ đụng vào diện tích.**
Cấm desaturate, cấm phủ tint, cấm `mix-blend`, cấm hạ opacity ảnh sản phẩm.
Ngân sách thay cho việc chỉnh màu:

- **≤ 45% diện tích thấy được của một section** là bề mặt Aurora, ở desktop.
- **Chừa trống 96px cuối section.** `pv-skyglow` dâng từ mép dưới; một khối
  sáng nằm đè lên đó thì section mất chân trời, và mạch trời của cả trang gãy
  đúng ở chỗ nó phải rõ nhất.
- **Một trang, một màn.** Hai ảnh chụp khác nhau trên cùng một trang thì trang
  thành catalogue giao diện. Trần là một `shot` **hoặc** hai `tile`, không cộng.

---

## 3. Thang tỷ lệ — con số quyết định mọi thứ còn lại

Màn nguồn rộng **1440**, và chữ trong đó đã được cân cho đúng cỡ đó:
heading 28 / 22 / 15 · body 13 · phụ 12,5 · chú 11,5 · mono 12,5.

Thu nhỏ ảnh là thu nhỏ chữ. **Sàn là 0,85×** — dưới mức đó, cỡ nhỏ nhất (11,5)
tụt xuống dưới 9,8px và ảnh thôi là bằng chứng, chỉ còn là hoa văn.

Từ sàn đó suy ra bề rộng vùng cắt được phép, theo chỗ đặt:

| Chỗ đặt | Bề rộng hiển thị | Vùng cắt tối đa | Cắt được cái gì |
|---|---|---|---|
| trọn cột nội dung | 1216 | **1430** | cả vùng nội dung, kèm sidebar |
| hai cột (7/12) | 686 | **807** | một panel — cột detail, hoặc rail phải |
| ba card (`SoftwareShelf`) | 400 | **470** | **một** molecule: một ô KPI, một chain, một bong bóng Zalo |
| bốn cột | 288 | **338** | một dãy chip, một cặp nút |

Một chỗ hay nhầm: vùng nội dung của màn (bỏ sidebar 232) rộng **1208**, gần
đúng bằng cột nội dung của site (1280 − 2×32 = **1216**). Nghĩa là **cắt bỏ
sidebar thì ảnh chạy ở tỷ lệ 1,007× — chữ về đúng cỡ thiết kế.** Đây là lý do
`shot` mặc định không có sidebar. Cần sidebar để nói "một app, bốn nhánh" thì
cắt riêng nó thành một `detail` dọc.

### Ngân sách chiều cao

`--section-y` là 8,5rem mỗi đầu ở desktop, nên trong màn 900px một section còn
**628px**. Một section có `shot` trọn cột:

```
tiêu đề (eyebrow gộp dòng + title subhead, KHÔNG lead)   ~58px
khe                                                       32px
khung 21:9 ở bề rộng 1120                                480px
khe + dòng chú                                            34px
                                                    ────────────
                                                        604px  ✓
```

Hai chỗ phải cắt để vừa, và đã cắt sẵn ở bảng trên:

- **Bỏ `lead`** của section (−52px). Câu dẫn và ảnh nói cùng một việc; giữ cả
  hai thì mất 52px để nói hai lần.
- **Khung 1120 chứ không 1216** (−41px). 1120/1208 = 0,927× — vẫn trên sàn.

Giữ `lead` và để khung 1216 thì cộng ra 697px, tràn **69px** ở 1440×900 (vừa
từ chiều cao khung nhìn 969px trở lên). Tràn được, nhưng phải cố ý — kệ phần
cứng đang tràn 94px và đó là chỗ duy nhất khác của site chấp nhận tràn.

---

## 4. `AppShot` — khung

Một file: `src/components/pv/app-shot.tsx`. Một file chứ không một thư mục, để
luật biên giới của §6 soát được bằng một lệnh grep.

```jsx
<AppShot
  src="/software/one-approvals.png"      // bắt buộc; không có ô chờ ở đây
  alt="Màn Phê duyệt của PV One: một đơn mua thép đang chờ chữ ký"
  ratio="wide"                           // ultra | wide | screen
  product="PV One"
  detail={{ label, title, body, story, quote }}
  heading={<h4 className="…">Hộp chờ duyệt</h4>}   // tuỳ chọn, xem dưới
  labels={{ sample, zoom, close }}
  sizes="(max-width: 1024px) 50vw, 600px"
/>
```

Cấu tạo, từ ngoài vào:

1. `<figure>` `relative overflow-hidden rounded-xl` — bán kính `--radius`
   (10px) của thẻ và ảnh, **không** phải `--radius-control`.
2. `pv-edge` với `bg-linear-to-t from-brand/35 to-border` — đây là thứ vẽ ra
   cái mép mà §2 đo được là không có. Gradient dựng đứng, sáng ở chân, cùng
   hướng chân trời của trang. **Cả poster lẫn ảnh trong dialog đều phải có.**
   Bản đầu chỉ vẽ cho poster, mà chỗ dễ mất mép nhất lại là dialog — ở đó ảnh
   to nhất và nằm trên `bg-popover` cũng tối như nó.
3. Nền `one-well` (§6) — đúng `--one-bg`. Ảnh có alpha hay chậm tải thì phần
   lộ ra vẫn là nền của chính màn đó, không phải một mảng xám lạ.
4. `next/image` phủ kín, `object-cover`, `object-top`. Cắt thì cắt ở chân ảnh —
   phần trên của mọi màn là chỗ đặt tiêu đề và số.
   ⚠️ **`ratio` phải khớp tỷ lệ hộp cắt.** Hộp cắt là một quyết định đã cân
   (§8: cắt theo khối, chừa 12px thở); nhét nó vào một khung tỷ lệ khác là để
   `object-cover` cắt lần thứ hai, mù, ngay lúc render — và lần cắt đó sẽ ăn
   mất đúng cái khối vừa chừa lề.
   Với `shot` (ảnh cả màn 16:10) thì lần cắt thứ hai là CỐ Ý, và giá của nó đo
   được: `ultra` để lộ **68,6%** chiều cao màn, `wide` để lộ **90%**, `screen`
   để lộ 100%. Ở kệ trang chủ, `ultra` xén ngang giữa một hàng bảng — đọc ra là
   ảnh lỗi, không ra cửa sổ. Chọn tỷ lệ theo chỗ xén rơi vào đâu, đừng chọn
   theo hình khối đẹp.
5. `heading` — tiêu đề của ảnh, đặt **giữa khung và dòng chú**. Chỗ dùng tự
   chọn thẻ (ở kệ phần mềm là `h4` nằm trong `tabpanel`). Thứ tự này là bắt
   buộc: để dòng chú lên trước thì nhãn engine chen vào giữa ảnh và tên của
   chính ảnh đó, và nó đọc ra như chrome của khung chứ không như eyebrow.
6. Dòng chú **dưới cùng**: trái là `{label} · DỮ LIỆU MẪU`, phải là nút mở bản
   phóng to (cả hai `font-mono text-eyebrow uppercase`).

Trong dialog, dòng nguồn là `{product} · {label} · DỮ LIỆU MẪU` — **không** có
tên màn, vì tên màn đã là tiêu đề đứng ngay dưới nó.

⚠️ **Ảnh trong dialog khai `priority` và `sizes` không quá 1024px.** Hai thứ,
hai lý do:
- Ảnh nguồn rộng 2880, mà nấc thiết bị của Next nhảy 2048 → 3840. Khai
  `1100px` thì màn DPR 2 lấy bản **3840** — phóng to quá cả bản gốc, thêm 30%
  dung lượng và không thêm một chi tiết nào. `1000px` đưa mọi màn về nấc 2048,
  đúng nhu cầu thật của khung 994–1148px.
- `loading="lazy"` mặc định đo được là **không nổ** cho ảnh sinh ra trong portal
  của dialog (sau 6 giây `currentSrc` vẫn rỗng, trong khi poster cùng trang đã
  tải xong). Dù nguyên nhân là gì, ảnh mà người dùng vừa chủ động bấm để xem thì
  không có lý do gì xếp hàng sau. Nó cũng không tốn gì ở lần tải trang: dialog
  chưa render thì thẻ ảnh chưa tồn tại.

Ba thứ `AppShot` **không** có, và mỗi cái là một luật:

- **Không ô chờ.** `MediaFrame` có ô chờ vì ảnh thật chưa tồn tại. Ảnh ở đây
  tồn tại rồi — cắt là ra. Một `AppShot` không có `src` là một lỗi build, không
  phải một ô chờ.
- **Không nhấc khi rê chuột.** Nhấc là ngôn ngữ của thẻ bấm được. Đây là cửa
  sổ nhìn vào sản phẩm, bấm vào không đi đâu cả.
- **Không chrome trình duyệt, không khung máy.** Màn nguồn là app desktop
  1440×900, không phải một trang web; vẽ thanh địa chỉ quanh nó là bịa một sự
  thật nhỏ, và người mua Enterprise đọc ra ngay.

---

## 5. Bốn cách trưng

> **Poster ≠ bằng chứng.** Từ khi có `AppShot` (§4) thì mọi `shot` trên trang
> là POSTER: ở khổ thẻ, màn 1440px thu về ~600px là **0,42×**, chữ 13px thành
> 5,5px. Poster chỉ nói "đây là một phần mềm thật, hình thù thế này"; chỗ ĐỌC
> được là bản phóng to. **Sàn 0,85× ở §3 vì vậy áp cho DIALOG, không áp cho
> poster.** Nó vẫn áp nguyên cho `tile` và `detail` — hai loại đó không có bản
> phóng to, chúng phải đọc được ngay tại chỗ.
>
> Và dialog cũng chưa chạm được sàn đó, phải nói thẳng: từ khi cột giải thích
> đứng CẠNH ảnh (chủ dự án 2026-08-11) thay vì nằm dưới, ảnh đạt **0,80×** trên
> màn ≥1600px nhưng chỉ **0,69×** trên màn 1440px. Đó là giá của việc không
> phải cuộn để nối ảnh với đoạn nói về chính nó. Muốn lấy lại 0,85× ở 1440 thì
> phải bỏ cột chữ — không có cách thứ ba.

| Cách | Nguồn cắt | Tỷ lệ | Dùng khi |
|---|---|---|---|
| `shot` | cả màn; khung trên trang cắt `focus="top"` lúc render | file `screen` 16:10 · poster `ultra` 21:9 | section mà **sản phẩm chính là luận điểm** |
| `tile` | một organism (panel, bảng, rail) | `auto` — tỷ lệ thật của khối | trong lưới thẻ, cạnh một đoạn chữ |
| `detail` | một molecule (khối AI, chain, một dòng) | `auto` | dẫn chứng cho **một** câu, cỡ nhỏ |
| `live` | dựng lại bằng React | — | **chưa dùng.** Xem cảnh báo dưới |

`live` — dựng lại giao diện bằng React trên site — nghe hấp dẫn và là bẫy đắt
nhất trong tài liệu này. Nó kéo theo: nhập token Aurora vào runtime, bốn họ chữ
mới (Archivo, IBM Plex Sans, IBM Plex Mono, Space Grotesk ≈ 180 KB font), Lucide,
và một bản sao của giao diện sẽ lệch khỏi sản phẩm ngay lần cập nhật đầu tiên.
Chỉ mở khi có **một** khoảnh khắc bắt buộc phải tương tác (ví dụ người đọc tự
bấm "Xem căn cứ"), và khi đó vẫn chỉ dựng lại đúng **một** molecule, không dựng
lại màn.

---

## 6. Token — hòn đảo `.pv-one`

File mới `src/app/one.css`, nhập ngay dưới ba dòng `@import` đầu
`src/app/globals.css`:

```css
@import "./one.css";
```

Nội dung — chín biến, không hơn:

```css
/* ==========================================================================
   HÒN ĐẢO PV ONE — token của Aurora v2, KHÔNG phải của site.
   Nguồn: handoff/theme/globals.css. Chỉ được đọc bên trong `.pv-one`.
   Đây là chỗ DUY NHẤT ngoài globals.css được viết hex trong repo.
   ========================================================================== */
.pv-one {
  --one-bg: #0b1220;         /* nền màn — cũng là nền của cái hõm */
  --one-fg: #e5e7eb;         /* chữ chính */
  --one-muted: #93a1b8;      /* chữ phụ */
  --one-azure: #2e63e6;      /* nền: AI, nút chính, item active */
  --one-azure-ink: #7fa3ff;  /* MỌI chữ màu azure */
  --one-glass-a: rgb(255 255 255 / 0.085);  /* thẻ, KPI */
  --one-glass-b: rgb(15 23 42 / 0.84);      /* bảng, list dài */
  --one-sheen: rgb(255 255 255 / 0.15);     /* vệt sáng mép kính */
  --one-field: linear-gradient(160deg, #0b1220, #0f172a 45%, #16233f);
}

@utility one-well {
  background: var(--one-bg);
}
```

Luật biên giới, và cách soát:

- `--one-*` chỉ được xuất hiện ở `src/app/one.css` và `src/components/pv/app-shot.tsx`.
  ```bash
  rg -n 'one-(bg|fg|muted|azure|glass|sheen|field|well)' src \
    | rg -v 'src/app/one.css|src/components/pv/app-shot.tsx'
  ```
  Ra dòng nào là vi phạm Luật 1.
- `pnpm check:tokens` **không** bắt được chuyện này: nó chỉ đọc `.ts/.tsx`, nên
  file `.css` mới lọt qua, và biến `var(--one-*)` không khớp luật nào của nó.
  Muốn có lưới an toàn thì thêm vào `RULES` trong `scripts/check-tokens.mjs`
  một luật `re: /--one-|\bone-well\b/` với `SKIP` thêm đường dẫn `app-shot.tsx`
  — sáu dòng.
- Chỉ chép thêm token Aurora khi có thứ thật sự cần nó. Chép cả
  `theme/globals.css` vào đây là mời hệ thứ hai vào runtime của site.

---

## 7. Bản đồ đặt — trang nào lấy màn nào

Nguyên tắc: **mỗi trang một dẫn chứng khác nhau.** Dùng lại cùng một ảnh ở tám
trang thì sản phẩm đọc ra là chỉ có một màn.

### Trang chủ

Trang chủ được đúng **một** bề mặt sản phẩm, và nó nằm ở section `Phần mềm`
(`sky="rise"`). Hero không có ảnh giao diện: hero trả lời "công ty này là ai,
có phải bán chip không" — một dashboard ở đó biến Pebble Vina thành một hãng
SaaS.

Hai bản, và chọn bản nào là **quyết định của chủ dự án**, vì nó dính vào
`lineupGap` / `scopeGap` (§10):

**Bản A — giữ ba card `SoftwareShelf`.** Mỗi card đổi ô chờ ảnh thành một
`detail` (vùng cắt ≤ 470 rộng, §3). Đổi ba dòng trong `PRODUCT_SRC`, không đụng
gì khác.

| Card | Ảnh | Cắt từ |
|---|---|---|
| ERP | ô KPI `₫4.2bn` + sparkline + nhãn nguồn | 01 Home |
| Context Provider | `OBJECT CHAIN · E1` — bảy chip nối nhau | 03 Global search |
| MES | thẻ `WO-1180 68%` + dòng thiếu thép | 01 Home |

**Bản B — một sản phẩm, một `shot`.** Đây là bản khớp với luật đặt tên của
chính sản phẩm (§10): sản phẩm trung tâm tên là **PV One**, ERP/MES không phải
tên sản phẩm. Bố cục: header không lead + `shot` 1120 của màn 01, ba câu ngắn
bên dưới thay ba card. Số học đã cân ở §3.

> Khuyến nghị **bản B**. Bản A giữ được bố cục đang chạy nhưng vẫn trưng ERP và
> MES như hai sản phẩm — đúng thứ `scopeGap` đang chặn phát hành.

### Các trang khác

Phần lớn còn ở `stub`/`wireframe`. Bảng này là kế hoạch: **đặt ảnh vào lúc dựng
trang**, không dựng trang chỉ để chứa ảnh.

| Trang | Màn | Cách | Nó chứng minh điều gì |
|---|---|---|---|
| `/how-we-deliver/governance` | 03 + 02 | `tile` ×2 | Dòng "Hidden by your permissions" + cột audit log. **Dẫn chứng mạnh nhất cả bộ** — quyền và vết ghi là thứ Enterprise hỏi trước |
| `/solutions/workflow-automation` | 02 | `shot` | Một yêu cầu đi hết chuỗi ký, có người, có giờ |
| `/solutions/enterprise-knowledge` | 03 | `shot` | Một câu hỏi → bốn nguồn → một danh sách, 0,3s |
| `/solutions/ai-agents` | 04 | `tile` | Khối "Two proposed actions" kèm dòng *Nothing has been created yet* |
| `/technology/architecture` | 03 | `detail` | `OBJECT CHAIN · E1`: bảy object, bốn nhánh, một câu chuyện |
| `/technology/data-integration` | 05 | `tile` | Bảng luật: sự kiện → ngưỡng → kênh → vai trò |
| `/use-cases/procurement` | 02 | `shot` | Ba báo giá, chênh lệch giá và lead time, một khuyến nghị |
| `/use-cases/manufacturing` | 01 | `tile` | `WO-1180 68%` chậm 2 ngày · `CNC-03` dừng lần 3 |
| `/use-cases/executive-reporting` | 01 | `shot` | Bốn nhánh gộp thành một bản brief buổi sáng |
| `/use-cases/finance-accounting` | 02 | `detail` | Hai khoản quá hạn, thư nhắc nợ đã soạn sẵn |
| `/use-cases/human-resources` | 02 | `detail` | Nghỉ phép · đổi ca · tăng ca nằm chung một hộp duyệt |
| `/use-cases/legal-compliance` | 02 | `tile` | Audit log năm dòng, có giờ, có người |

Không có màn cho: `/solutions/document-intelligence`, `/solutions/private-ai`,
`/solutions/industrial-edge-ai`, `/use-cases/customer-service`. Bốn trang đó
giữ nguyên ô chờ — **không mượn tạm màn khác cho đủ ảnh.**

---

## 8. Bộ ảnh phải cắt — 14 tấm

### ⚠️ Trước khi chụp: thay avatar ảnh người

Năm màn nguồn nhúng `<img src="https://i.pravatar.cc/120?img=60">` ở topbar —
mặt một người thật lấy từ dịch vụ ảnh mẫu. Không đưa lên trang công khai được,
và nó cũng **trái atom A-05 của chính theme kit**: *avatar là chữ viết tắt tên,
không phải ảnh*.

Sửa ở gốc, không sửa bằng cách bôi lên ảnh: thẻ `<img>` nằm trong một div đã có
sẵn `border-radius:4px` và gradient `#1E3F7A → #133A8A`, nên chỉ cần thay ruột
bằng chữ viết tắt, màu `--on-tint-primary` `#D4DEF2`.

```
img=60 → NT (Nguyễn Văn Thắng)   ·   img=45 → TH (Trần Thu Hà)
```

Làm trên **bản chép** của thư mục `screens/` (kèm `support.js` và `assets/`),
đừng sửa bộ gốc. Màn 03 có hai avatar vì nó có hai `viewer`.

### Chụp

Màn nguồn là HTML nên chụp lại được ở độ phân giải bất kỳ. Chụp ở
**deviceScaleFactor 2**; bản 1× có sẵn trong `screens-png/` sẽ nhoè ở bản phóng
to trên màn retina.

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --virtual-time-budget=12000 \
  --force-device-scale-factor=2 --window-size=1700,1500 \
  --screenshot=raw.png "file:///…/One 01 - Home (Desktop) EN.dc.html"
```

Khung 1700×1500 chứ không 1440×900: mỗi file là **cả một trang trình bày** —
có tiêu đề, đoạn dẫn và panel *"What this screen sells"* — chứ không phải chỉ
cái màn. Cần chừa chỗ cho hết trang rồi mới cắt lấy màn. `--virtual-time-budget`
đủ dài cho Google Fonts và Lucide tải xong; thiếu nó thì chữ về font hệ thống
và icon biến mất.

### Cắt

Khung màn nằm ở vị trí **không cố định** giữa năm file: mép trái luôn là 260 (ở
2×) nhưng mép trên chạy từ 645 tới 776 vì tiêu đề trang dài ngắn khác nhau. Nên
**dò, đừng gõ số**:

1. Lấy nền trang làm mốc (`median` độ sáng ở góc trên-trái).
2. Mép trên = dòng ĐẦU TIÊN có >70% pixel sáng hơn nền trong khoảng x 300–3100.
   Dò bằng một cột đơn sẽ bắt nhầm dòng tiêu đề của trang — nó cũng sáng.
3. Mép trái = pixel sáng đầu tiên trên dòng đó.
4. Cắt đúng **2880×1800**. Kiểm: dải sáng ở bước 2 phải rộng đúng 2880 — sai số
   là dò trượt, đừng cắt.

**Tấm `shot` là CẢ MÀN 16:10, không cắt 21:9.** Bản đầu của tài liệu này ghi
cắt 21:9 bỏ sidebar, vì lúc đó ảnh chỉ được xem tại chỗ. Từ khi có bản phóng to
(`AppShot`) thì khác hẳn: chỗ đọc là dialog, nên tấm giao phải là cả màn — kể
cả sidebar, vì sidebar chính là chỗ nói "một app, bốn nhánh, hai tầng license".
Khung 21:9 trên trang chỉ là **poster**, và nó cắt bằng `object-cover` +
`focus="top"` ngay lúc render, không cắt trong file.

`tile` và `detail` thì vẫn cắt theo khối, chừa 12px thở, không cắt ngang giữa
một thẻ hay một hàng bảng.

| File (`public/software/`) | Màn | Hộp | Cách |
|---|---|---|---|
| `one-home.png` | 01 | cả màn 2880×1800 @ (260, 645) | `shot` ✅ đã có |
| `one-approvals.png` | 02 | cả màn 2880×1800 @ (260, 689) | `shot` ✅ đã có |
| `one-search.png` | 03 | cả màn 2880×1800 @ (260, 776) | `shot` ✅ đã có |
| `one-assistant.png` | 04 | cả màn 2880×1800 @ (260, 689) | `shot` ✅ đã có |
| `one-rules.png` | 05 | cả màn 2880×1800 @ (260, 732) | `shot` ✅ đã có |
| `t-ai-strip.png` | 01 | 262,776 → 1322,884 | `tile` — khối AI kèm dòng *Basis* |
| `t-quotes.png` | 02 | 585,478 → 1105,642 | `tile` — ba báo giá + verdict |
| `t-audit.png` | 02 | 1150,545 → 1412,792 | `tile` dọc — audit log E2 |
| `t-hidden.png` | 03 | 260,650 → 1076,714 | `tile` — dòng bị ẩn theo quyền |
| `t-rules.png` | 05 | 260,150 → 1060,492 | `tile` — bảng luật thông báo |
| `t-blocked.png` | 05 | 260,512 → 1060,872 | `tile` — nhật ký gửi, có dòng *Blocked* |
| `d-chain.png` | 03 | 1104,350 → 1400,502 | `detail` — object chain E1 |
| `d-actions.png` | 04 | 1040,440 → 1420,760 | `detail` — hai hành động đề xuất |
| `d-sidebar.png` | 01 | 0,16 → 232,600 | `detail` dọc — Core / Branches / One Plus |

### Giao

- **PNG-24**, không nén mất dữ liệu ở khâu này. `next.config.ts` đã bật
  `formats: ["image/avif", "image/webp"]` nên `next/image` tự phục vụ bản nhẹ;
  chữ nhỏ trong UI là thứ hỏng đầu tiên khi nén hai lần.
- Trần file nguồn: `shot` (cả màn 2×) ≤ **1,6 MB** · `tile` ≤ 300 KB ·
  `detail` ≤ 150 KB. Năm tấm đang có: 895 KB – 1 586 KB, **tổng 6,4 MB**.
  Nền tối nén tốt hơn dự tính, nên không phải đổi sang WebP: đo được WebP q92
  xuống ~250 KB/tấm ở PSNR 41–46 dB, tiết kiệm 5 MB nhưng đánh đổi bằng một
  lần nén nữa chồng lên lần `next/image` sẽ nén. Chỉ đổi khi bộ ảnh vượt 10 MB.
- **`sizes` là bắt buộc** ở mọi chỗ dùng. Để mặc định thì trình duyệt tải bản
  640w cho một ô 288px, hoặc bản 1080w cho một `detail`.

---

## 9. Chữ trong ảnh — chỗ vướng thật

Bộ bàn giao là bản **EN**. Dữ liệu thì đã Việt (Thắng Lợi Engineering, Sao Đỏ,
Nguyễn Văn Thắng) nhưng nhãn giao diện thì không: *Good morning, Mr. Thắng* ·
*Approvals inbox* · *Hidden by your permissions*.

Luật của repo là **vi là nguồn sự thật**, và người đọc trang này là nhà máy
Việt Nam. Một ảnh sản phẩm tiếng Anh trên trang tiếng Việt nói ra đúng một điều:
sản phẩm này chưa làm cho các anh.

Cách xử, theo thứ tự nên chọn:

1. **Render lại 5 màn bằng tiếng Việt.** Đúng nhất, và rẻ hơn nó nghe — màn
   nguồn là HTML, sửa chuỗi là xong. Kèm một việc phải kiểm: tiếng Việt dài
   hơn tiếng Anh khoảng 15–20%, mà bố cục Aurora đang khít; *Notifications &
   channels* → *Thông báo và kênh gửi* phải không làm vỡ hàng.
2. **Giao cả hai bản** — `public/software/vi/` và `/en/`, chọn theo `locale`.
   Nhân đôi số tấm, nhưng chỉ với những tấm **có câu**. Tấm chỉ có mã và số
   (`d-chain`, phần lớn `t-quotes`) dùng chung cho mọi ngôn ngữ.
3. **Giữ EN và ghi rõ trong dòng chú.** Mức tạm chấp nhận được để dựng trang,
   **không** phải mức phát hành.

`/ko` dùng bản EN cho tới khi có bản KO — ghi vào ô chờ, đừng lặng lẽ.

---

## 10. Luật nội dung — bốn cái, đều cứng

**1. Dữ liệu trong ảnh là dữ liệu DEMO, và không bao giờ được rời khỏi ảnh.**
`₫4,2bn` · `86%` · `91,4%` · `₫890M` là bộ số đóng băng của kịch bản Sao Đỏ,
không phải kết quả của khách hàng nào. Chúng **không** được xuất hiện trong
chữ của trang, trong heading, trong bento số, trong meta description. Một con
số trong ảnh mà lặp lại thành câu trên trang thì nó đã thành case study bịa —
đúng thứ blueprint §17 cấm và `pv-proof` soát.
Đây là lý do dòng chú của `AppShot` **luôn** mang nhãn `DỮ LIỆU MẪU`, không có
prop nào tắt được nó.

**2. Tên gọi lấy theo luật của chính sản phẩm** (bộ bàn giao §5):

- Sản phẩm trung tâm luôn là **PV One**.
- Bốn nhánh giữ tên tiếng Anh vì đó là tên sản phẩm: **Sales · Supply ·
  Factory · Finance**.
- Năng lực **viết đủ chữ**: People · Documents & processes · Work · Reports.
  Không viết tắt HR, DMS, BI, OEE.
- Hai tầng license: **One Core** (Home · Global search · Approvals ·
  Notifications · Directory · Admin · Integrations) và **One Plus** (People ·
  Documents & processes · Work · Reports · AI assistant).
- Engine chỉ là nhãn phụ: `E1 · Object graph` · `E2 · Permissions & audit` ·
  `E3 · Approval engine` · `E4 · Multi-channel notifications`.

⚠️ **Chỗ này site đang mâu thuẫn với sản phẩm.** `home.software` đang trưng ba
sản phẩm ERP · Context Provider · MES; luật trên nói sản phẩm là PV One và
ERP/MES không phải tên sản phẩm. `lineupGap` đã ghi sẵn rằng danh sách này chưa
có tài liệu và "MES là suy đoán" — bộ bàn giao trả lời câu đó, và câu trả lời
khác với trang. Xem §12.

**3. AI không bao giờ tự làm** (luật 13 của bộ bàn giao). Mọi khối AI trong
sản phẩm đều có dòng `Basis: …` và chờ một cú bấm; màn 04 còn có sẵn câu
*"Nothing has been created yet"*. Chữ đặt cạnh những ảnh này **không** được
viết "AI tự động duyệt", "AI tự chạy quy trình". Viết vậy là mô tả sai chính
cái ảnh đang nằm bên cạnh — và nó đá thẳng vào câu dẫn của hero: *Công cụ không
thay thế con người.* Sản phẩm đang thi hành đúng câu đó; chữ trên trang không
được nói ngược lại nó.

**4. Ảnh không mang một mình một luận điểm.** Chữ nhỏ nhất trong `shot` là
9,8px sau khi thu; người dùng trình đọc màn hình thì không thấy gì cả. Luận
điểm nằm ở `caption` và ở chữ của section. Ảnh là bằng chứng cho câu đó, không
phải là câu đó.

---

## 11. Chuyển động và tiếp cận

- **Xuất hiện**: `Reveal` chuẩn của site — `EASE.outSoft`, `DUR.slow`. Không
  viết nhịp riêng cho ảnh sản phẩm.
- **Parallax**: chỉ `subtle` (6%), và chỉ khi `shot` đứng một mình trong
  section. Một ảnh giao diện trôi lệch khỏi khung đọc ra là lỗi render, không
  đọc ra chiều sâu.
- **Cấm**: video tự chạy, con trỏ chuột giả bay qua màn hình, "gõ chữ" mô
  phỏng, chuyển cảnh giữa nhiều ảnh. Bộ bàn giao đã tự đặt luật *không AI slop*
  cho chính sản phẩm; trang bán sản phẩm đó không được lỏng hơn.
- **`alt` theo công thức**: `Màn <tên màn> của PV One: <việc đang diễn ra>`.
  Không mô tả bố cục ("bên trái là sidebar"), mô tả **việc**.
- **Giảm chuyển động**: `MediaFrame`/`Reveal` đã tôn trọng
  `prefers-reduced-motion`; `AppShot` dùng lại chúng nên không phải làm gì thêm.
- Ảnh chụp UI trong hõm tối trên nền tối là chỗ dễ mất mép với người thị lực
  thấp — `pv-edge` ở §4 chính là thứ giữ mép đó, đừng bỏ nó cho "gọn".

---

## 12. Ô chờ và câu hỏi phải hỏi

**Chặn phát hành**

1. **PV One được công bố tới đâu?** Bộ bàn giao là POC nội bộ. Đưa năm màn lên
   trang công khai cần Pebble Vina đồng ý cho công bố: tên sản phẩm, tên bốn
   nhánh, hai tầng license, và bốn engine.
2. **Tên khách hàng và người thật trong ảnh demo.** Thắng Lợi Engineering ·
   Sao Đỏ Engineering · Nam Việt Steel · Nguyễn Văn Thắng · Lê Minh Đức · Trần
   Thu Hà · Phạm Thị Mai · Vũ Văn Nam · Nguyễn Văn Tú. Nếu là tên thật thì
   phải có đồng ý; nếu là tên bịa cho POC thì nhãn `DỮ LIỆU MẪU` là đủ, **và
   phải xác nhận là bịa** — không đoán.
3. **Ba sản phẩm hay một sản phẩm** (§10 luật 2). Đây là câu trả lời cho
   `lineupGap` và một nửa `scopeGap`. Cho tới khi chốt, ba card trang chủ vẫn
   là bản chưa có tài liệu.
4. **Tên gọi: `PV One` hay `Pebble One`** (§1.2). Bộ bàn giao dùng cả hai (16
   lần / 1 lần). Tên này sẽ in lên trang công khai, ở trang chủ và trong mọi
   `caption` — chốt trước khi viết chữ, không phải sửa sau.

**Chưa chặn, nhưng phải xử trước khi cắt ảnh**

4. Chép bộ bàn giao vào repo (§0).
5. ⚠️ **Chốt ngôn ngữ ảnh (§9) — nay đã thành nợ đang chạy trên trang.** Năm
   tấm ở `public/software/` là bản **EN**, và chúng đang hiển thị trên trang
   chủ tiếng Việt: *Good morning, Mr. Thắng* · *Approvals inbox* · *Hidden by
   your permissions*. Dựng trang thì chấp nhận được, phát hành thì không. Sửa
   là render lại năm màn với chuỗi tiếng Việt (§9 mức 1) — quy trình chụp và
   cắt đã có sẵn ở §8, chỉ thay chuỗi trong bản chép của `screens/`.
6. Bốn trang không có màn (§7) — giữ ô chờ hay bỏ hẳn phần ảnh.

---

## 13. Checklist nghiệm thu — một trang có ảnh sản phẩm

- [ ] Ảnh nằm trong `AppShot`, không phải `<Image>` hay `MediaFrame` trần.
- [ ] Không có gì của site vẽ đè lên ảnh.
- [ ] `--one-*` không rò ra ngoài `one.css` + `app-shot.tsx` (lệnh grep ở §6).
- [ ] Bề rộng hiển thị ÷ bề rộng vùng cắt ≥ **0,85**.
- [ ] Bề mặt Aurora ≤ 45% diện tích section, và chừa trống 96px cuối section.
- [ ] Trang này chỉ có **một** `shot` hoặc **hai** `tile`, không cộng.
- [ ] Ảnh của trang này khác ảnh của mọi trang khác (§7).
- [ ] Dòng chú có nhãn `DỮ LIỆU MẪU`, và `caption` mang luận điểm.
- [ ] Chỗ ảnh bị `object-cover` xén KHÔNG rơi vào giữa một thẻ hay một hàng.
- [ ] Khối chứa ảnh không để lại khoảng trống nào trên 40px — đo trên trình
      duyệt, đừng cộng nhẩm từ token.
- [ ] Không con số nào trong ảnh xuất hiện lại trong chữ của trang.
- [ ] `alt` theo công thức §11, không mô tả bố cục.
- [ ] Tên gọi trong chữ của trang theo §10 luật 2 (PV One · bốn nhánh · viết
      đủ chữ).
- [ ] Chữ cạnh ảnh AI không nói "AI tự động làm" (§10 luật 3).
- [ ] `sizes` khai đúng bề rộng thật; file nguồn dưới trần §8.
- [ ] Ngôn ngữ trong ảnh khớp locale, hoặc đã ghi ô chờ (§9).
- [ ] `pnpm verify` sạch.
