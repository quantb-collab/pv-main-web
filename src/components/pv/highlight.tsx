import { Fragment, cloneElement, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Highlights key terms inside running text with the brand gradient plus a
 * blurred duplicate behind them, so the term reads as emitting light.
 *
 * Case-sensitive and word-bounded on purpose: it must hit "AI" but never the
 * Vietnamese pronoun "ai", nor the tail of HAI / MAI / OpenAI.
 */
const TERMS = /(\bAI\b)/g;
/** Separate from TERMS: a /g/ regex carries lastIndex, so .test() is stateful. */
const IS_TERM = /^AI$/;

/**
 * Descends through arrays and elements alike. Callers wrap a whole heading or
 * paragraph without knowing whether the text arrived as a bare string or came
 * nested inside a link — IndexGrid, for one, passes its card titles as <a>.
 */
function highlight(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    const parts = node.split(TERMS);
    if (parts.length === 1) return node;
    return parts.map((part, i) =>
      IS_TERM.test(part) ? (
        <Led key={i}>{part}</Led>
      ) : (
        <Fragment key={i}>{part}</Fragment>
      ),
    );
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
