import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * ============================================================================
 * cn — gộp class, có dạy thêm thang chữ của repo
 * ----------------------------------------------------------------------------
 * tailwind-merge chỉ biết thang cỡ chữ MẶC ĐỊNH của Tailwind (`text-xs` …
 * `text-9xl`). Thang của repo gọi theo VAI TRÒ (`text-display`, `text-body`,
 * `text-eyebrow`…), nên với nó `text-display` trông y hệt một class MÀU chữ và
 * nó xếp chung nhóm với `text-brand`. Hậu quả:
 *
 *     cn("text-display", "text-brand/70")  →  "text-brand/70"
 *
 * cỡ chữ bị vứt im lặng, chữ rơi về cỡ mặc định của trang, và `pnpm verify`
 * vẫn sạch vì cả hai class đều hợp lệ. Phát hiện 2026-08-06: `StatTile` và bốn
 * chỗ trong `StageMatrix` đang mất cỡ đúng theo cách này.
 *
 * Khai thang vai trò vào nhóm `font-size` để merge phân biệt được CỠ với MÀU.
 * Thêm vai trò mới ở LỚP 3 `globals.css` thì thêm luôn vào đây, nếu không
 * vai trò đó sẽ dính đúng cái bẫy trên.
 * ============================================================================
 */
const TEXT_ROLES = [
  "display",
  "headline",
  "subhead",
  "title",
  "lead",
  "body",
  "body-sm",
  "ui",
  "meta",
  "micro",
  "eyebrow",
];

const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: TEXT_ROLES }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
