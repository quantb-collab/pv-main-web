---
name: pv-content
description: Viết và biên tập content tiếng Việt cho website Pebble Vina — đúng định vị full-stack AI, bán kết quả chứ không bán thuật ngữ, và không bị giọng AI. Dùng skill này MỖI KHI thêm hoặc sửa bất kỳ chữ nào hiển thị trên site (messages/vi.json, heading, lead, mô tả card, nhãn CTA, meta title/description, nội dung ô chờ), khi người dùng nói "viết content", "viết copy", "sửa chữ", "viết lại cho tự nhiên", "nội dung nghe bị AI", "viết trang X", hoặc khi review một trang xem chữ đã ổn chưa.
---

# Viết content cho Pebble Vina

## Trước khi viết

1. Đọc `docs/BLUEPRINT-RULES.md` — định vị, trình tự thuyết phục, danh sách cấm.
2. Mở `src/content/registry.ts`, tìm entry của trang. Nó cho biết: nhiệm vụ
   trang, đối tượng chính, giai đoạn phễu, CTA, câu hỏi khách mang tới, bằng
   chứng cần có, nội dung không được phép đưa vào.
3. Chữ chỉ nằm ở `messages/vi.json`. Không viết chữ cứng trong component.
   Không đụng `en.json` / `ko.json` — đó là việc của bước preflight.

## Trình tự nội dung của mọi trang

Kết quả khách muốn → điều gì đang cản trở → Pebble giải thế nào → vì sao cách
này phù hợp → bằng chứng → bước tiếp theo.

Nếu đoạn mở đầu đang nói về công nghệ, lịch sử công ty hay tính năng: viết lại.

---

## Ngân sách chữ — luật cứng

Người đọc là lãnh đạo doanh nghiệp. Họ **quét**, không đọc. Nhiệm vụ của bạn là
tiết kiệm thời gian của họ, không phải chứng minh mình biết nhiều.

| Đơn vị | Trần |
|---|---|
| Toàn trang chủ | 900 từ chữ đọc |
| Một trang con | 700 từ |
| Một section | 120 từ |
| Một danh sách trong section | **tối đa 4 mục** |
| Mô tả một thẻ | 1 câu, dưới 20 chữ |
| Lead của section | 1 câu |

Ngoại lệ duy nhất cho luật 4 mục: danh sách chỉ gồm **nhãn ngắn không kèm mô
tả** (như 10 mục Enterprise-grade, 8 bước triển khai). Nhãn trần quét nhanh,
chi phí đọc gần bằng không.

**Chỉ viết mô tả khi tiêu đề không tự nói được.** Mô tả nhắc lại tiêu đề là chữ
thừa — xoá.

Đo thực tế:
```bash
node -e "
const m=require('./messages/vi.json').home;
function w(o){let n=0;for(const v of Object.values(o)){if(typeof v==='string')n+=v.trim().split(/\s+/).length;else if(v&&typeof v==='object')n+=w(v)}return n}
console.log(w(m)+' từ');
"
```

Đủ ý ≠ đủ mục. Liệt kê 8 lợi ích không thuyết phục hơn 4 lợi ích đúng — nó chỉ
làm người đọc bỏ qua cả 8.

## Chống giọng AI

Giọng AI trong tiếng Việt không nằm ở từ khó, mà ở **câu không mang thông tin**.
Kiểm tra từng câu: xoá nó đi thì người đọc có mất gì không? Không mất gì thì xoá.

### Bốn dấu hiệu phải sửa

**1. Câu mở đầu rỗng.**
Bắt đầu bằng bối cảnh chung mà ai cũng biết.

> ❌ Trong bối cảnh chuyển đổi số diễn ra mạnh mẽ, AI đang trở thành xu hướng
> tất yếu của mọi doanh nghiệp.
> ✅ Nhân viên đã dùng ChatGPT được một năm, nhưng quy trình duyệt hồ sơ vẫn
> chạy y như trước.

**2. Tính từ thay cho sự việc.**
"Mạnh mẽ", "vượt trội", "tối ưu", "toàn diện", "đột phá", "hiện đại", "chuyên
nghiệp", "uy tín", "hàng đầu" — không nói được gì.

> ❌ Giải pháp AI toàn diện, tối ưu vượt trội cho doanh nghiệp.
> ✅ Nhân viên hỏi bằng tiếng Việt và nhận câu trả lời kèm trích dẫn nguồn từ
> tài liệu nội bộ.

**3. Câu ba vế đối xứng.**
Nhịp "vừa A, vừa B, vừa C" hoặc "không chỉ… mà còn…" lặp lại là dấu vân tay của
máy. Một đoạn chỉ nên có tối đa một câu kiểu này.

**4. Giọng dịch máy.**
"Cho phép doanh nghiệp có thể", "giúp tối ưu hóa việc", "mang đến trải nghiệm",
"đáp ứng nhu cầu ngày càng cao". Viết như người Việt nói trong cuộc họp.

> ❌ Giải pháp cho phép doanh nghiệp có thể tối ưu hóa việc quản lý tài liệu.
> ✅ Tài liệu nằm rải rác ở năm nơi được gom về một chỗ hỏi được.

### Từ cấm

đột phá · vượt trội · toàn diện · tối ưu hóa · mạnh mẽ · tiên phong · hàng đầu ·
cách mạng · thay đổi cuộc chơi · giải pháp thông minh · nền tảng thế hệ mới ·
sức mạnh của AI · trải nghiệm đột phá · kỷ nguyên số · bứt phá · nâng tầm

Ngoại lệ: dùng được khi có định lượng đi kèm và định lượng đó đã kiểm chứng.

### Chuẩn câu

- Câu dài tối đa khoảng 25 chữ. Câu dài hơn thì tách.
- Một đoạn một ý.
- Chủ ngữ là **người làm việc** hoặc **doanh nghiệp**, không phải "giải pháp".
- Động từ cụ thể: bóc tách, đối chiếu, phê duyệt, nhập liệu, tra cứu — không
  dùng "hỗ trợ", "cải thiện", "nâng cao" khi có động từ chính xác hơn.
- Số liệu: chỉ viết khi có nguồn. Không có thì để `<Gap kind="proof">`.

---

## Ràng buộc riêng của Pebble Vina

- Không mở đầu bằng lịch sử công ty.
- Không lặp "Full-stack AI" ở mọi trang — nói một lần, chỗ đúng.
- Không viết feature trước benefit.
- Không hứa ROI, không nói "bảo mật tuyệt đối", không nói AI thay thế con người.
- Nói về "doanh nghiệp tự hành" thì phải kèm: con người giữ quyết định, phê
  duyệt và xử lý ngoại lệ.
- Không phán xét khách hàng. Không viết họ "chậm chuyển đổi", "tụt hậu".
- Không nhắc tên đối thủ trên trang chính.
- Tiêu đề nói kết quả, không nói công nghệ:
  ✅ "Giúp nhân viên tìm đúng thông tin nội bộ trong vài giây"
  ❌ "Nền tảng RAG tiên tiến"

## Viết cho đúng vai trò

Một trang có một đối tượng chính. Xem `audiencePrimary` trong registry.

| Vai trò | Ngôn ngữ dùng | Tránh |
|---|---|---|
| CEO | kết quả kinh doanh, thời gian thấy kết quả, rủi ro | chi tiết kỹ thuật |
| COO | bước công việc, ai làm gì, đo bằng gì | kiến trúc |
| CIO/CTO | kiến trúc, tích hợp, vận hành | khẩu hiệu marketing |
| CISO | dữ liệu ở đâu, ai truy cập, nhật ký, phương án on-premise | hứa hẹn |
| Trưởng phòng | việc hằng ngày thay đổi ra sao, sai thì xử lý thế nào | thuật ngữ |
| Procurement | phạm vi, trách nhiệm, nghiệm thu, điều kiện | mơ hồ |

## Ô chờ

Không đủ dữ liệu thì **không viết cho đầy**. Viết ô chờ như một yêu cầu giao
việc: người đọc phải biết chính xác cần đi lấy cái gì, ở đâu, dạng gì.

> ❌ `<Gap>Cần bổ sung thông tin</Gap>`
> ✅ `<Gap kind="proof">Một case study nêu bài toán, phạm vi, chỉ số trước và
> sau, kèm văn bản khách hàng đồng ý công bố.</Gap>`

## Kiểm lại trước khi xong

- [ ] Người đọc nhận ra vấn đề của họ trong ba câu đầu?
- [ ] Lợi ích đứng trước tính năng?
- [ ] Có nói cách bắt đầu không?
- [ ] Có giảm rủi ro mua hàng không?
- [ ] Mỗi khẳng định có bằng chứng, hoặc có ô chờ?
- [ ] Đúng vai trò của trang, không lẫn giọng của trang khác?
- [ ] Không trùng nội dung với trang khác?
- [ ] Trang kết thúc bằng một bước tiếp theo rõ ràng, đúng một CTA chính?
- [ ] Đọc to lên nghe như người nói, không như bản dịch?

Sửa xong chạy `pnpm build` để chắc không có khoá messages nào bị thiếu.
