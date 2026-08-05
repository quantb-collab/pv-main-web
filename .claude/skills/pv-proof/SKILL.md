---
name: pv-proof
description: Soát mọi khẳng định trên website Pebble Vina xem có bằng chứng không, và quản lý danh sách khoảng trống nội dung cần Pebble Vina cung cấp. Dùng skill này khi thêm số liệu, tên khách hàng, đối tác, chứng chỉ, benchmark, case study, testimonial; khi người dùng nói "kiểm tra proof", "cái này có thật không", "rà claim", "còn thiếu gì", "chuẩn bị họp với khách hàng để lấy tư liệu"; và bắt buộc chạy trước mỗi lần phát hành.
---

# Soát bằng chứng

Rủi ro lớn nhất của website này không phải xấu, mà là **nói một điều không
chứng minh được với một khách hàng Enterprise đang thẩm định**.

## Luật gốc

Mỗi khẳng định thuộc đúng một trong ba nhóm:

1. **Có bằng chứng** → viết, kèm điều kiện đo nếu là số.
2. **Chưa có bằng chứng** → để `<Gap kind="proof">`, mô tả rõ cần lấy gì.
3. **Có nhưng chưa được phép công bố** → `<Gap kind="restricted">`.

Không có nhóm thứ tư. Không "viết mềm đi cho an toàn".

## Cấm tuyệt đối

Không được tạo ra: sản phẩm, khách hàng, đối tác, số liệu, chứng chỉ, benchmark,
lời chứng thực, tính năng, case study. Kể cả khi ghi chú là ví dụ minh hoạ —
văn bản trên website sẽ được đọc như tuyên bố thật.

Không: hứa ROI trước assessment · "bảo mật tuyệt đối" · benchmark không nêu điều
kiện kiểm thử · trộn thông số prototype với sản phẩm thương mại · nói on-premise
mà không mô tả mô hình vận hành.

## Bảng đối chiếu thông điệp ↔ bằng chứng

| Thông điệp | Bằng chứng bắt buộc |
|---|---|
| Full-stack AI | Sơ đồ kiến trúc và sản phẩm thật ở từng tầng |
| Enterprise-grade | Tài liệu security, governance, quy trình delivery |
| Đo bằng kết quả | Bộ KPI và tiêu chí nghiệm thu mẫu |
| Có thể on-premise | Sơ đồ deployment + mô hình vận hành |
| Có thể tích hợp | Ví dụ tích hợp thật, nêu được hệ thống |
| Chiều sâu phần cứng | Datasheet, ảnh sản phẩm, ảnh lab |
| Đội ngũ Việt Nam – Hàn Quốc | Hồ sơ người thật, phân định trách nhiệm |
| Triển khai được thực tế | Case study hoặc PoC có số |
| Mở rộng được | Reference architecture |

Trang nào mang thông điệp ở cột trái mà thiếu cột phải thì **chưa được lên
`ready`**.

## Quy trình soát

**1. Quét văn bản.** Đọc `messages/vi.json`, đánh dấu mọi câu chứa: con số, tỷ
lệ phần trăm, tên tổ chức, tên sản phẩm, mốc thời gian, từ tuyệt đối ("luôn",
"mọi", "toàn bộ", "không bao giờ", "duy nhất", "đầu tiên").

**2. Truy nguồn.** Mỗi mục đánh dấu: nguồn ở đâu, ai xác nhận, có được phép công
bố không. Không truy được thì chuyển thành `<Gap>`.

**3. Đếm ô chờ.** Mở `/track` xem tổng khoảng trống, hoặc trên trang bất kỳ:
```js
document.querySelectorAll("[data-gap]").length
```
Điều kiện phát hành: bằng 0 trên các trang trạng thái `ready`.

**4. Cập nhật registry.** Thứ còn thiếu phải nằm trong `gaps` của trang tương
ứng để `/track` phản ánh đúng.

## Viết ô chờ cho ra việc

Ô chờ là một phiếu giao việc, không phải lời than.

> ❌ Cần bổ sung thông tin về khách hàng.
> ✅ Một case study: tên ngành (được phép ẩn tên công ty), bài toán, phạm vi
> PoC, chỉ số trước và sau, thời gian triển khai, kèm email hoặc văn bản khách
> hàng đồng ý công bố.

## Bàn giao cho Pebble Vina

Khi cần đi lấy tư liệu, xuất danh sách theo thứ tự ưu tiên của blueprint §17:

1. Một case study có kết quả rõ
2. Một demo hoàn chỉnh
3. Một reference architecture
4. Một mẫu PoC framework
5. Hồ sơ đội ngũ
6. Tài liệu security
7. Tài liệu deployment
8. Tài liệu phần cứng

Lấy dữ liệu nguồn từ `allGaps()` trong `src/content/registry.ts`, nhóm theo
trang, ghi rõ ai cần cung cấp và vì sao trang bị chặn nếu thiếu.
