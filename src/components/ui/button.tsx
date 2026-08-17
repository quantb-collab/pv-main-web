import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Hand-edited; `shadcn add button` overwrites this file. Reapply on regen:
//   1. rounded-control (6px) replaces rounded-lg and the per-size overrides —
//      one radius at every size, so large buttons are not rounder than small.
//   2. shadow-control on surface-bearing variants only; the token flips under
//      every sky level. ghost/link stay flat because they are not surfaces.
//   3. h-10/h-11 scale instead of the h-8/h-9 app-UI default.
//   4. Heights come from --h-control-* rather than fixed h-* steps, so every
//      size grows on touch devices (@media (pointer: coarse) in globals.css).
//      Do not put the h-* steps back — that silently drops the tap targets
//      below the 44px HIG threshold on phones.
// See docs/DESIGN-TOKENS.md § Control.

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-control border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-(--dur-fast) outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-control hover:bg-primary/90 hover:shadow-control-hover active:shadow-control",
        outline:
          "border-border bg-background shadow-control hover:bg-muted hover:text-foreground hover:shadow-control-hover active:shadow-control aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-control hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] hover:shadow-control-hover active:shadow-control aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive shadow-control hover:bg-destructive/20 hover:shadow-control-hover active:shadow-control focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-(--h-control-md) gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-(--h-control-xs) gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-(--h-control-sm) gap-1.5 px-3.5 text-[0.8125rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-(--h-control-lg) gap-2 px-5 text-[0.9375rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-(--h-control-md)",
        "icon-xs": "size-(--h-control-xs) [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-(--h-control-sm) [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-(--h-control-lg)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
