---
name: pv-page
description: Dựng một trang mới cho website Pebble Vina từ đầu đến cuối theo đúng quy trình — khai báo registry, xác định 14 trường bắt buộc, viết messages, tạo route, rồi tự nghiệm thu. Dùng skill này khi người dùng nói "làm trang X", "thêm trang", "dựng màn hình mới", "tạo solution page", "thêm use case", "thêm trang vào sitemap", hoặc khi cần nâng một trang từ khung tạm lên trạng thái có nội dung.
---

# Dựng một trang mới

Trang chỉ được coi là bắt đầu khi đã trả lời xong 14 câu ở bước 1. Nhảy thẳng
vào viết JSX là cách nhanh nhất để có một trang không ai đọc.

## Bước 1 — Khai báo trước khi code

Thêm entry vào `src/content/registry.ts`. Điền đủ:

| Trường | Câu hỏi phải trả lời |
|---|---|
| `key`, `path` | Tên khoá ổn định và đường dẫn (không kèm locale) |
| `phase` | V1 (bắt buộc trước phát hành) hay V2 |
| `status` | Bắt đầu ở `spec`, nâng dần |
| `objective` | Trang này tồn tại để làm gì — một câu |
| `audiencePrimary` | Một vai trò. Không phải "mọi người" |
| `audienceSecondary` | Ai đọc ké |
| `funnel` | awareness / consideration / validation / decision |
| `cta` | Đúng MỘT CTA chính |
| `questions` | Khách mang câu hỏi gì tới trang này |
| `proofNeeded` | Bằng chứng trang cần để đáng tin |
| `gaps` | Thứ chưa có, sẽ để ô chờ |
| `forbidden` | Nội dung không được đưa vào trang này |
| `inNav` / `footerGroup` | Xuất hiện ở menu nào |
| `children` | Trang con nếu có |

Nếu không trả lời được `objective` và `audiencePrimary` thì dừng lại và hỏi
người dùng — đừng đoán.

## Bước 2 — Chọn cấu trúc

| Loại trang | Cấu trúc |
|---|---|
| Solution | Template §10 — dùng `<SolutionTemplate>`, chỉ cần điền messages |
| Use case | Template §11 — dùng `<UseCaseTemplate>` |
| V2 chưa tới lượt | `<StubPage>` — hiện nhiệm vụ, câu hỏi và ô chờ |
| Trang riêng | Tự ghép từ block, theo trình tự thuyết phục 6 bước |

Trình tự thuyết phục: kết quả khách muốn → điều gì cản trở → Pebble giải thế nào
→ vì sao phù hợp → bằng chứng → bước tiếp theo.

## Bước 3 — Viết nội dung

Dùng skill `pv-content`. Chữ vào `messages/vi.json` theo namespace = `key` của
trang. Không đụng en/ko.

Với Solution và Use case: template tự hiện ô chờ cho khối nào chưa có khoá
messages. Điền content = thêm khoá, **không sửa code**.

## Bước 4 — Tạo route

Dùng skill `pv-ui`. Khung tối thiểu:

```tsx
export async function generateMetadata({ params }) { /* title + description từ messages */ }

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);          // bắt buộc, nếu không sẽ mất static render
  // Hero sky="void" → nội dung sáng dần → <CtaBand cta={page.cta} />
}
```

Trang con động thì thêm `generateStaticParams` lấy slug từ registry.

## Bước 5 — Nâng trạng thái

Sửa `status` trong registry:

- `stub` — route chạy, nội dung là ô chờ
- `wireframe` — đủ section, heading, CTA; copy còn nháp
- `content` — copy tiếng Việt hoàn chỉnh, đã qua `pv-content`
- `ready` — đã gắn proof thật và qua `pv-qa`

Chỉ trạng thái `content` và `ready` mới vào `sitemap.xml`.

## Bước 6 — Nghiệm thu

Chạy skill `pv-qa`. Chưa qua thì đừng nâng lên `ready`.

## Kiểm lại

- [ ] Có entry trong registry, khai đủ 14 trường?
- [ ] Đúng một CTA chính, khớp `cta` trong registry?
- [ ] Trang trả lời được mọi câu trong `questions`?
- [ ] Mỗi khẳng định có proof hoặc có `<Gap>`?
- [ ] Không lặp nội dung của trang khác?
- [ ] Có link nội bộ dẫn tới và dẫn đi?
- [ ] `/track` hiển thị đúng trạng thái mới?
- [ ] `pnpm build` sạch?
