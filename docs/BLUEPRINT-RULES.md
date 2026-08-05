# Luật rút từ blueprint

Bản đầy đủ của chiến lược nằm ở `docs/BLUEPRINT.md` (chưa đưa vào repo — hãy
lưu tài liệu "Website, Marketing Funnel & Sales Enablement Blueprint V1" vào
đó). File này là bản rút gọn dùng để tra nhanh khi làm việc.

---

## Định vị

Pebble Vina = công ty **Full-stack AI cho doanh nghiệp**, xuyên suốt từ bài toán
vận hành → quy trình → dữ liệu → mô hình → phần mềm → nền tảng → hạ tầng →
thiết bị → bán dẫn.

Thông điệp trung tâm: **"Biến AI thành năng lực vận hành của doanh nghiệp."**

**Không** định vị là: công ty bán chip, nhà phân phối phần cứng, công ty
chatbot, công ty gia công phần mềm, đơn vị chỉ tư vấn chiến lược, nhà cung cấp
một công cụ AI đơn lẻ.

Enterprise là **mặc định**, không phải một gói cao cấp hay một menu riêng.

## Trình tự thuyết phục — áp cho MỌI trang

1. Khách muốn đạt kết quả gì?
2. Điều gì đang cản trở?
3. Pebble giải quyết thế nào?
4. Vì sao cách này phù hợp?
5. Bằng chứng đâu?
6. Bước tiếp theo là gì?

Không mở đầu bằng: danh sách công nghệ, lịch sử công ty, danh sách tính năng,
danh sách chip, khái niệm AI chung chung.

## Tỷ trọng nội dung

Trang kinh doanh: ~80% vấn đề / lợi ích / kết quả / use case / quy trình / độ
tin cậy / cách bắt đầu; ~20% công nghệ.
Trang Technology được đi sâu, nhưng mỗi khẳng định phải gắn mục đích triển khai
và có tài liệu đi kèm.

## Sáu vai trò người mua

| Vai trò | Quan tâm | CTA |
|---|---|---|
| CEO | hiệu quả kinh doanh, khi nào thấy kết quả, mở rộng được không | Đánh giá cơ hội ứng dụng AI |
| COO | quy trình nào cải thiện, nhân viên làm khác đi ra sao, đo bằng gì | Trao đổi một quy trình cụ thể |
| CIO/CTO | kiến trúc, tích hợp, model, hạ tầng, vận hành | Trao đổi về kiến trúc AI |
| CISO | dữ liệu ở đâu, ai truy cập, audit log, on-premise | (dẫn tới Private AI, Governance) |
| Trưởng phòng | việc nào được giảm, dễ dùng không, sai thì sao, có đào tạo không | Trao đổi bài toán này |
| Procurement | phạm vi, chi phí, trách nhiệm, nghiệm thu, rủi ro | Xem cách triển khai |

## Ba lớp thị trường

- **A — mở cửa:** kho tri thức, trợ lý nội bộ, xử lý chứng từ, báo cáo tự động,
  đối chiếu tài liệu, tự động hoá một quy trình nhiều bước. Đây là nội dung
  thu hút chính.
- **B — mở rộng phòng ban:** agent liên hệ thống, workflow automation, tích hợp
  ERP/CRM/MES, nền tảng dùng chung.
- **C — chiều sâu:** Private AI, on-premise, Edge AI, AI server, hạ tầng, thiết
  bị, MINT/PAPAYA/ESPRESSO, bán dẫn.

Lớp C dùng để chứng minh chiều sâu. **Không được để lớp C kéo sự chú ý khỏi lợi
ích kinh doanh.**

## Ba offer

1. **AI Opportunity Discussion** — chưa rõ use case.
2. **AI Readiness Assessment** — có ý định nhưng chưa rõ phạm vi.
3. **PoC Scoping Workshop** — đã có bài toán rõ.

## CTA

Mỗi trang có **một** CTA chính. Không dùng "Liên hệ ngay" làm CTA duy nhất.
Không đặt nhiều CTA ngang hàng. Không kết thúc trang mà không có bước tiếp theo.
Không dùng form dài ngay lần đầu. Không hỏi dữ liệu nhạy cảm qua form.

## Cấm tuyệt đối

**Định vị:** lấy chip làm trung tâm; mô tả như nhà phân phối; coi Enterprise là
option; biến full-stack thành danh sách dịch vụ rời rạc; gọi là công ty chatbot.

**Nội dung:** mở đầu bằng lịch sử công ty; buzzword thay cho giá trị; lặp "AI
toàn diện" ở mọi trang; viết feature trước benefit; số liệu chưa xác minh; case
study giả; testimonial giả; hứa ROI trước assessment; tuyên bố bảo mật tuyệt
đối; nói AI thay thế hoàn toàn con người.

**Kỹ thuật:** rải thuật ngữ ở mọi trang; benchmark thiếu điều kiện đo; datasheet
làm thông điệp chính; nói on-premise mà không mô tả mô hình vận hành; lấy tên
công nghệ làm lợi ích khách hàng.

**Hình ảnh:** robot hình người, bộ não phát sáng, bàn tay chạm màn hình,
cyberpunk, neon mạnh, dashboard giả, ảnh bắt tay, chip ở mọi section, animation
cản trở việc đọc, số chạy động vô nghĩa.

## Ô chờ

Thiếu dữ liệu thì để ô chờ, không tự bịa:

- `[CẦN PEBBLE VINA XÁC NHẬN]` → `<Gap kind="confirm">`
- `[CẦN BỔ SUNG BẰNG CHỨNG]` → `<Gap kind="proof">`
- `[CHƯA ĐƯỢC PHÉP CÔNG KHAI]` → `<Gap kind="restricted">`
- cần pháp chế → `<Gap kind="legal">`

## Nghiệm thu (§27)

- **30 giây:** hiểu Pebble làm gì, cho ai, giá trị gì, không chỉ là chip hay
  chatbot.
- **2 phút:** nhận diện được vấn đề, thấy một use case, hiểu cách bắt đầu, thấy
  Pebble có quy trình.
- **10 phút:** tin năng lực, hiểu dữ liệu được kiểm soát ra sao, biết bước tiếp
  theo, biết ai trong doanh nghiệp nên tham gia, sẵn sàng để lại thông tin.
