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
 *    (Luật này chỉ trói `<Led>`; `<Horizon>` là inline thường, tự xuống dòng.)
 * ============================================================================
 */
const TERMS = /(\bAI\b)/g;
/** Separate from TERMS: a /g/ regex carries lastIndex, so .test() is stateful. */
const IS_TERM = /^AI$/;

/* Chế độ `brand` — CHỈ dành cho h1 hero, nơi thương hiệu tự giới thiệu.
   Tiêu đề hero có đúng hai điểm nhấn, mỗi cái một trị khác nhau:
     `Pebble Vina`                    → <Led>      chủ thể PHÁT SÁNG
     `doanh nghiệp số tự vận hành`    → <Horizon>  lời hứa GẠCH CHÂN mảnh
   Một nguồn sáng, một đường chân trời — hai thứ cùng câu chuyện nhưng không
   tranh nhau; hai quầng sáng trong một câu là tranh nhau. Cả hai cụm đều bị
   loại khỏi TERMS toàn cục (`Pebble Vina` 19 chỗ; cụm kia là lời hứa chỉ nói
   một lần). Thêm call site mới bật `brand` là phải đếm lại như luật 1. */
const BRAND_TERMS = /(\bAI\b|Pebble Vina|doanh nghiệp số tự vận hành)/g;
const IS_BRAND_TERM = /^(?:AI|Pebble Vina)$/;
const IS_PROMISE = /^doanh nghiệp số tự vận hành$/;

/**
 * Descends through arrays and elements alike. Callers wrap a whole heading or
 * paragraph without knowing whether the text arrived as a bare string or came
 * nested inside a link — IndexGrid, for one, passes its card titles as <a>.
 */
function highlight(node: ReactNode, brand: boolean): ReactNode {
  if (typeof node === "string") {
    const parts = node.split(brand ? BRAND_TERMS : TERMS);
    if (parts.length === 1) return node;
    const isTerm = brand ? IS_BRAND_TERM : IS_TERM;
    return parts.map((part, i) => {
      if (isTerm.test(part)) return <Led key={i}>{part}</Led>;
      if (brand && IS_PROMISE.test(part))
        return <Horizon key={i}>{part}</Horizon>;
      return <Fragment key={i}>{part}</Fragment>;
    });
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={i}>{highlight(child, brand)}</Fragment>
    ));
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    // Guard on children: cloneElement's third argument overrides, so passing
    // undefined would strip the contents of void elements such as <br />.
    const kids = node.props.children;
    if (kids == null) return node;
    return cloneElement(node, undefined, highlight(kids, brand));
  }
  return node;
}

export function Highlight({
  children,
  brand = false,
}: {
  children: ReactNode;
  /** Tô thêm tên thương hiệu. Chỉ dành cho nơi thương hiệu tự giới thiệu. */
  brand?: boolean;
}) {
  return <>{highlight(children, brand)}</>;
}

/**
 * Gạch chân chân trời cho cụm lời hứa. Một nét 1px màu brand mờ, hạ thấp
 * khỏi chân chữ — cùng ngôn ngữ với `pv-horizon` (đường sáng mảnh) chứ không
 * phải một quầng LED thứ hai. Là inline thường nên cụm dài tự xuống dòng và
 * nét gạch chạy tiếp theo dòng; `skip-ink` mặc định tự né dấu ậ/ệ của tiếng
 * Việt nên không cắt ngang con chữ.
 */
function Horizon({ children }: { children: ReactNode }) {
  return (
    <span className="underline decoration-brand/45 decoration-1 underline-offset-8">
      {children}
    </span>
  );
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
