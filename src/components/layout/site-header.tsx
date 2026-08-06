"use client";

import { Menu } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { CtaButton } from "@/components/pv/cta-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Thanh điều hướng.
 * Trong suốt khi ở đỉnh trang (đè lên hero), chuyển sang nền mờ đục khi bắt
 * đầu cuộn. Một CTA duy nhất — §23 cấm nhiều CTA ngang hàng.
 *
 * Không còn khai nấc trời: cả site là một bảng màu đêm, nên header lấy màu
 * chữ từ trang. Nền lúc cuộn dùng `--background` mặc định (nấc `night`) —
 * cố ý không đổi theo section đang trôi qua, vì một thanh nav đổi màu liên
 * tục theo nền bên dưới thì đọc ra là lỗi chứ không phải hiệu ứng.
 */

const NAV = [
  { href: "/solutions", key: "solutions" },
  { href: "/use-cases", key: "useCases" },
  { href: "/how-we-deliver", key: "howWeDeliver" },
  { href: "/technology", key: "technology" },
  { href: "/insights", key: "insights" },
  { href: "/about", key: "about" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const tc = useTranslations("cta");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="pv-container flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link
          href="/"
          className="font-display text-ui font-semibold tracking-brand uppercase"
        >
          {/* Chờ file logo chính thức — hiện dùng chữ. */}
          Pebble Vina
        </Link>

        {/* Nav weight 500 chứ không 400: ở 14px trên nền mờ, chữ 400 tụt hẳn
            xuống hàng phụ. Bù lại phải siết px-3 → px-2.5, vì sáu mục tiếng
            Việt cộng wordmark, chuyển ngữ và CTA đã sát mép ở đúng 1024px. */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-md px-2.5 py-2 text-ui font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />

          <CtaButton
            href="/ai-assessment"
            size="sm"
            arrow={false}
            className="hidden md:inline-flex"
          >
            {tc("assessment")}
          </CtaButton>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                aria-label={t("openMenu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-left font-display text-ui font-semibold tracking-brand uppercase">
                  Pebble Vina
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b py-3 text-body font-medium"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 px-4">
                <CtaButton
                  href="/ai-assessment"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  {tc("assessment")}
                </CtaButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
