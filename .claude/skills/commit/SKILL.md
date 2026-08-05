---
name: commit
description: Chốt commit và push cho repo website Pebble Vina — chạy preflight đầy đủ trước, rồi viết message theo Conventional Commits bằng tiếng Anh chuẩn, gọn và dễ đọc. Dùng khi người dùng nói "commit", "lưu lại", "chốt lại", "push", "đẩy code", "tạo commit", hoặc khi kết thúc một mốc công việc. Skill này thay thế skill commit toàn cục trong phạm vi repo pv-web.
---

# Commit — Pebble Vina web

Repo này chưa có lịch sử để suy ra quy ước (mới một commit khởi tạo), nên quy
ước được **đặt ra ở đây**, không phải dò từ `git log`.

---

## §1 — Preflight (bắt buộc, trước mọi commit)

Không có bước nào được bỏ qua. Fail ở đâu thì dừng ở đó và sửa, không commit đè
lên lỗi.

### 1.1 Kiểm tra tự động

```bash
pnpm verify
```

Gồm bốn lớp:

| Lớp | Bắt lỗi gì |
|---|---|
| `next build` | Lỗi TypeScript, lỗi render trang |
| `check-messages` | Khoá messages thiếu — next-intl không làm build fail, nó in nguyên `home.enterprise.e6` lên mặt trang |
| `check-tokens` | Màu, easing, thời lượng viết thẳng vào component thay vì dùng token |
| `eslint` | Lỗi lint |

### 1.2 Kiểm tra bằng mắt

Chỉ khi thay đổi chạm tới giao diện:

- Mở trang bị ảnh hưởng ở 375px, 768px, 1440px
- Bật `prefers-reduced-motion` — trang vẫn đọc được
- Console không có lỗi đỏ

Sửa `messages/*.json` xong **phải khởi động lại dev server**, nếu không sẽ thấy
đường dẫn khoá thay vì nội dung và tưởng nhầm là thiếu khoá.

### 1.3 Kỷ luật nội dung

- `messages/en.json` và `messages/ko.json` **không được đổi**, trừ khi đang ở
  bước preflight i18n có chủ đích. Chúng đổi ngoài ý muốn là dấu hiệu ai đó viết
  nội dung sai chỗ.
- Trang mới hoặc đổi trạng thái trang thì `src/content/registry.ts` phải cập
  nhật theo. Registry lệch với thực tế làm hỏng cả `/track` lẫn `sitemap.xml`.
- Không commit số liệu, tên khách hàng, đối tác hay chứng chỉ chưa kiểm chứng.
  Nghi ngờ thì chạy skill `pv-proof` trước.

### 1.4 Soát nội dung staged

```bash
git status --short
git diff --staged
```

Không bao giờ commit: `.env*`, khoá API, `.next/`, `node_modules/`,
ảnh chụp màn hình tạm, file trong scratchpad.

Không dùng `git add -A` khi trong cây còn file không liên quan. Stage theo
đường dẫn cụ thể.

---

## §2 — Nhánh

```bash
git rev-parse --abbrev-ref HEAD
```

Đang ở `main` mà sắp commit việc mới thì tạo nhánh trước:

```
<type>/<mô-tả-ngắn-kebab>
```

Ví dụ: `feat/solution-page-content` · `fix/nav-from-registry` ·
`chore/commit-skill`

---

## §3 — Message: Conventional Commits, tiếng Anh

```
<type>(<scope>): <subject>

<body>
```

### Type

`feat` `fix` `refactor` `perf` `style` `docs` `test` `chore` `build` `ci`

### Scope — dùng đúng danh sách này

| Scope | Vùng |
|---|---|
| `content` | `messages/*.json` — chữ hiển thị |
| `i18n` | `src/i18n/`, cấu hình locale, bản dịch en/ko |
| `ui` | component, layout, trang |
| `motion` | `src/components/motion/`, `src/lib/motion.ts` |
| `tokens` | `src/app/globals.css` |
| `registry` | `src/content/registry.ts` |
| `track` | trang `/track` |
| `seo` | metadata, sitemap, robots |
| `skills` | `.claude/skills/`, `.claude/agents/` |
| `docs` | `docs/`, `CLAUDE.md` |
| `deps` | `package.json`, lockfile |

Thay đổi trải nhiều vùng thì bỏ scope, đừng liệt kê nhiều scope.

### Subject — luật tiếng Anh

- **Thể mệnh lệnh, thì hiện tại**: `add`, `fix`, `move` — không dùng `added`,
  `adds`, `adding`
- Chữ thường toàn bộ, trừ danh từ riêng
- Không dấu chấm cuối
- Tối đa 72 ký tự
- Nói **hiệu quả**, không nói tên file — `git` đã hiển thị file rồi
- Không dùng từ rỗng: `update`, `improve`, `enhance`, `various`, `misc`,
  `stuff`, `some changes`

```
✅ fix(motion): stop remounting reveal wrappers on every render
✅ feat(content): cut homepage copy from 1611 to 1001 words
✅ chore(build): fail the build when a message key is missing

❌ update files
❌ fix(ui): fixed some issues with the header component
❌ feat: improvements to homepage
❌ refactor(motion): changed reveal.tsx
```

### Body — gọn, dễ đọc

- Một dòng trống sau subject
- **1–4 gạch đầu dòng.** Nhiều hơn nghĩa là commit này nên tách làm hai
- Mỗi gạch đầu dòng một thay đổi, kèm **lý do** khi lý do không hiển nhiên
- Xuống dòng ở 72 ký tự
- Không có gạch đầu dòng nào chỉ nhắc lại subject
- Không liệt kê file — chỉ nêu vùng ảnh hưởng khi thật cần
- Quyết định có ghi trong `docs/DECISIONS.md` thì trỏ tới đó thay vì viết cả
  đoạn giải thích

```
fix(motion): stop remounting reveal wrappers on every render

motion.create() ran inside the component body, producing a new component
type each render. React unmounted and remounted the subtree, so scroll
reveals stayed stuck at opacity 0.

Replace it with a module-level tag lookup table.
```

```
feat(content): cut homepage copy from 1611 to 1001 words

Enterprise buyers scan rather than read; the page took eight minutes.

- Cap each card list at four items with a body, or use bare labels
- Drop per-item descriptions in the enterprise-grade section
- Add a word budget to the pv-content skill so this does not regress
```

Thay đổi phá vỡ tương thích thì thêm dòng `BREAKING CHANGE: <mô tả>` ở cuối body.

### Trailer

Repo này **không** dùng trailer tác giả AI. Không tự thêm.

---

## §4 — Commit

Hiện **toàn bộ bản nháp message** cho người dùng xác nhận trước khi chạy.

```bash
git commit -m "$(cat <<'EOF'
<subject>

<body>
EOF
)"
```

Không bao giờ dùng `--no-verify`. Không amend commit đã push. Không commit thẳng
vào nhánh mặc định.

---

## §5 — Push

Chỉ push khi người dùng yêu cầu rõ ràng. Trước khi push:

1. `pnpm verify` phải sạch ở đúng trạng thái sắp push, không phải ở lần chạy
   trước đó
2. `git log --oneline origin/<branch>..HEAD` — xem đúng những commit định đẩy
3. Repo hiện **chưa có remote**. Chưa cấu hình remote thì dừng lại và hỏi, đừng
   tự tạo.

Push xong thì cập nhật `docs/HANDOFF.md` bằng skill `pv-handoff` — mục "Trạng
thái kỹ thuật" phải ghi đúng commit cuối.

---

## Kiểm lại

- [ ] `pnpm verify` sạch?
- [ ] Thay đổi giao diện đã xem thật ở ba khổ màn hình?
- [ ] `en.json` / `ko.json` không bị đổi ngoài ý muốn?
- [ ] Registry khớp với trang thực tế?
- [ ] Không có secret, file build, file tạm trong staged?
- [ ] Subject tiếng Anh, mệnh lệnh, dưới 72 ký tự, không từ rỗng?
- [ ] Body tối đa 4 gạch đầu dòng, mỗi cái nói được lý do?
- [ ] Đang ở nhánh làm việc, không phải nhánh mặc định?
