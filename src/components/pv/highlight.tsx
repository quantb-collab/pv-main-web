import { Fragment, cloneElement, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Highlights key terms inside running text with the brand gradient plus a
 * blurred duplicate behind them, so the term reads as emitting light.
 *
 * "AI" is case-sensitive and word-bounded on purpose: it must hit "AI" but
 * never the Vietnamese pronoun "ai", nor the tail of HAI / MAI / OpenAI.
 * (`\b` is ASCII-only in JS, so it is useless around Vietnamese phrases —
 * those rely on being distinctive enough not to appear inside other words.)
 *
 * ============================================================================
 * HAI LUẬT KHI THÊM TỪ KHOÁ
 * ----------------------------------------------------------------------------
 * 1. THÊM TỪ HIẾM, KHÔNG THÊM TỪ HAY DÙNG. Đếm trước bằng tay: một từ xuất
 *    hiện 15 chỗ thì 15 chỗ đó cùng phát sáng, và chữ phát sáng ở mọi nơi là
 *    nhiễu chứ không phải điểm nhấn. Đối chiếu khi cân nhắc: `vận hành` 15
 *    chỗ, `Pebble Vina` 19 chỗ — đều không được vào TERMS toàn cục.
 * 2. GIỮ TỪ KHOÁ NGẮN. `<Led>` là `inline-block` (cần thế để hai lớp quầng
 *    định vị được), nên cụm bên trong KHÔNG xuống dòng được. Cụm dài nằm
 *    trong tiêu đề ở khổ mobile sẽ tràn ngang. Ba từ là trần nên dừng.
 * ============================================================================
 */
const TERMS = /(\bAI\b)/g;
/** Separate from TERMS: a /g/ regex carries lastIndex, so .test() is stateful. */
const IS_TERM = /^AI$/;

/* Đã bỏ chế độ `brand` (2026-08-14) — tiêu đề hero mới không còn cụm nào cần
   nó. Cần lại thì xem git, bản trước ngày đó. */

/**
 * Descends through arrays and elements alike. Callers wrap a whole heading or
 * paragraph without knowing whether the text arrived as a bare string or came
 * nested inside a link — IndexGrid, for one, passes its card titles as <a>.
 */
function highlight(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    const parts = node.split(TERMS);
    if (parts.length === 1) return node;
    return parts.map((part, i) => {
      if (IS_TERM.test(part)) return <Led key={i}>{part}</Led>;
      return <Fragment key={i}>{part}</Fragment>;
    });
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={i}>{highlight(child)}</Fragment>
    ));
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    // Guard on children: cloneElement's third argument overrides, so passing
    // undefined would strip the contents of void elements such as <br />.
    const kids = node.props.children;
    if (kids == null) return node;
    return cloneElement(node, undefined, highlight(kids));
  }
  return node;
}

export function Highlight({ children }: { children: ReactNode }) {
  return <>{highlight(children)}</>;
}

function Led({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("relative isolate inline-block", className)}>
      {/* Wide flat bleed — the light the term throws onto its surroundings. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-(--highlight-glow) select-none blur-(--highlight-halo-blur) opacity-(--highlight-halo-opacity)"
      >
        {children}
      </span>
      {/* Tight gradient rim — keeps the glyph edges reading as lit, not fuzzy. */}
      <span
        aria-hidden
        className="pv-highlight pointer-events-none absolute inset-0 select-none blur-(--highlight-rim-blur) opacity-(--highlight-rim-opacity)"
      >
        {children}
      </span>
      <span className="pv-highlight relative">{children}</span>
    </span>
  );
}
