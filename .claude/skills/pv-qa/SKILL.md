---
name: pv-qa
description: Nghiệm thu một trang hoặc toàn bộ website Pebble Vina trước khi nâng trạng thái hoặc phát hành — kiểm tra nội dung, chuyển đổi, kỹ thuật, khả năng tiếp cận và đa ngôn ngữ. Dùng skill này khi người dùng nói "kiểm tra trang", "QA", "review trước khi release", "trang này xong chưa", "nghiệm thu", "chuẩn bị go-live", hoặc trước khi đổi status của một trang lên content hoặc ready.
---

# Nghiệm thu

Chạy đủ năm nhóm. Mỗi mục chỉ có đạt hoặc không đạt — không có "tạm được".

## 1. Bài kiểm tra người đọc (§27 blueprint)

Đọc trang như một người chưa biết gì về Pebble Vina.

**30 giây** — hiểu được: Pebble làm gì, cho ai, tạo ra giá trị gì, và **không**
bị hiểu nhầm là công ty bán chip hoặc công ty chatbot.

**2 phút** — nhận diện được vấn đề của mình, thấy ít nhất một use case, hiểu
cách bắt đầu, thấy Pebble có quy trình.

**10 phút** — tin năng lực, hiểu dữ liệu được kiểm soát ra sao, biết bước tiếp
theo, biết ai trong doanh nghiệp nên tham gia, sẵn sàng để lại thông tin hoặc
gửi link cho đồng nghiệp.

Không đạt mốc nào thì ghi rõ câu nào gây hiểu nhầm, đừng ghi "cần cải thiện".

## 2. Nội dung

- [ ] Lợi ích đứng trước tính năng
- [ ] Trang trả lời đủ `questions` khai trong registry
- [ ] Đúng `audiencePrimary`, không lẫn giọng của trang khác
- [ ] Không trùng nội dung với trang khác
- [ ] Không có từ bị cấm (xem `pv-content`)
- [ ] Không mở đầu bằng công nghệ hay lịch sử công ty
- [ ] Mọi khẳng định có proof hoặc `<Gap>` — chạy skill `pv-proof`

## 3. Chuyển đổi

- [ ] Đúng **một** CTA chính, khớp `cta` trong registry
- [ ] Trang không kết thúc mà thiếu bước tiếp theo
- [ ] Nhãn CTA nói rõ khách nhận được gì, không phải "Liên hệ ngay"
- [ ] Form (nếu có) không hỏi dữ liệu nhạy cảm, không dài ở bước đầu
- [ ] Có link nội bộ dẫn tới trang này và dẫn đi trang liên quan

## 4. Kỹ thuật

```bash
pnpm verify     # build + soát khoá messages thiếu + lint
```

`pnpm build` một mình **không** bắt được khoá messages bị thiếu — next-intl chỉ
log ra console rồi in nguyên `home.enterprise.e6` lên mặt trang. Luôn chạy
`pnpm verify`.

- [ ] Đúng một `<h1>`, thứ bậc heading không nhảy cóc
- [ ] Metadata: `title` và `description` lấy từ messages, không rỗng
- [ ] Ảnh qua `<MediaFrame>`, có `alt` hoặc `need`
- [ ] Không chuỗi tiếng Việt nằm trong JSX
- [ ] Không màu / easing / thời lượng hardcode
- [ ] Thử ở 375px, 768px, 1440px
- [ ] Không tràn ngang ở mobile

Đếm ô chờ trên trang:
```js
document.querySelectorAll("[data-gap]").length
```
Trạng thái `ready` yêu cầu bằng 0.

## 5. Khả năng tiếp cận và chuyển động

- [ ] Bật `prefers-reduced-motion` → trang vẫn đọc được, không còn parallax
- [ ] Tab được qua toàn bộ link và nút, có viền focus nhìn thấy
- [ ] Tương phản chữ đạt WCAG AA ở cả vùng sáng và vùng `.tone-dark`
- [ ] Tắt JavaScript → nội dung vẫn hiện (nhờ khối `<noscript>` ở layout)
- [ ] Không dùng animation làm phương tiện truyền đạt duy nhất một thông tin

## 6. Đa ngôn ngữ

- [ ] `/`, `/en`, `/ko` đều mở được
- [ ] Chuyển ngôn ngữ giữ nguyên đường dẫn đang xem
- [ ] Trước phát hành: không còn tiếng Việt sót ở `/en` và `/ko` — chạy `pv-i18n`

## Báo cáo

Ghi kết quả dạng: mục nào đạt, mục nào không, và với mục không đạt thì nêu
**vị trí cụ thể** (file, khoá messages hoặc section id) cùng cách sửa. Không
tổng kết chung chung.

Chỉ khi cả sáu nhóm đạt mới đổi `status` trong `src/content/registry.ts`.
