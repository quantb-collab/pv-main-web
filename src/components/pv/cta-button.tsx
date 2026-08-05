import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

// Navigational button: Button + Link + trailing arrow, collapsed into one
// component so the six call sites cannot drift apart.
export function CtaButton({
  href,
  children,
  arrow = true,
  ...props
}: {
  href: string;
  children: ReactNode;
  /** Off for secondary CTAs, which must not read as the primary invitation. */
  arrow?: boolean;
} & Omit<ComponentProps<typeof Button>, "asChild" | "children">) {
  return (
    <Button asChild {...props}>
      <Link href={href}>
        {children}
        {arrow ? (
          <ArrowRight
            data-icon="inline-end"
            className="transition-transform duration-(--dur-fast) group-hover/button:translate-x-0.5"
          />
        ) : null}
      </Link>
    </Button>
  );
}
