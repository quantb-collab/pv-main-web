# Pebble Vina — Website

Website doanh nghiệp của Pebble Vina, công ty Full-stack AI cho doanh nghiệp.

Next 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · next-intl (vi/en/ko)
· motion + Lenis · pnpm.

> **Trạng thái: đang xây dựng.** Chưa phát hành. `robots.ts` đang chặn toàn bộ
> và metadata đặt `index: false`. Màu brand, logo và phần lớn bằng chứng còn là
> ô chờ.

---

## Chạy

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Kiểm tra trước khi commit:

```bash
pnpm verify         # build + check:i18n + check:tokens + lint
```

Hai check riêng tồn tại vì `next build` không bắt được chúng: next-intl chỉ log
khoá messages thiếu ra console rồi in nguyên đường dẫn khoá lên mặt trang, còn
màu và thời lượng hardcode thì hoàn toàn hợp lệ với TypeScript.

## Đường dẫn đáng biết

| URL | Nội dung |
|---|---|
| `/` | Tiếng Việt (mặc định) |
| `/en`, `/ko` | Tiếng Anh, tiếng Hàn — chưa dịch, tự rơi về tiếng Việt |
| `/track` | Bảng theo dõi nội bộ: trạng thái từng trang và khoảng trống nội dung |

## Tài liệu

| File | Nội dung |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Luật của repo, bản đồ thư mục, quy trình |
| [docs/HANDOFF.md](docs/HANDOFF.md) | Đang ở đâu, làm gì tiếp, đang chờ quyết định nào |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Vì sao mọi thứ như hiện tại, kèm phương án đã bỏ |
| [docs/BLUEPRINT-RULES.md](docs/BLUEPRINT-RULES.md) | Luật rút từ blueprint chiến lược |
| [docs/DESIGN-TOKENS.md](docs/DESIGN-TOKENS.md) | Hệ token màu, nhịp, chuyển động |
| [docs/I18N.md](docs/I18N.md) | Quy trình đa ngôn ngữ vi-first |

**Bắt đầu một phiên làm việc: đọc `docs/HANDOFF.md` trước.**

## Bốn luật

1. **Registry trước, route sau.** `src/content/registry.ts` là nguồn sự thật về
   cấu trúc site — nó sinh ra footer, sitemap và `/track`.
2. **Chỉ dùng token.** Không hardcode màu, easing, thời lượng trong component.
3. **Ghép từ block có sẵn.** Cần biến thể thì thêm prop, đừng dựng lưới riêng.
4. **Thiếu dữ liệu thì để ô chờ.** Không bịa số liệu, case study, đối tác.

## Skill và agent

`.claude/skills/` có 8 skill và `.claude/agents/` có 5 agent riêng cho dự án:
viết content, dựng UI, đa ngôn ngữ, dựng trang, soát bằng chứng, nghiệm thu,
bàn giao giữa các phiên, và commit. Chúng chỉ nạp khi làm việc trong repo này.
# pv-main-web
# pv-main-web
