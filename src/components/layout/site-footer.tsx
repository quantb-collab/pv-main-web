import { getTranslations } from "next-intl/server";
import { Gap } from "@/components/pv/gap";
import { Link } from "@/i18n/navigation";
import { footerPages } from "@/content/registry";

/**
 * Footer nền tối — cùng cặp với hero, khép nhịp sáng/tối của trang.
 * Danh sách link lấy từ registry, không viết tay, để không lệch khi thêm trang.
 */
export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const ts = await getTranslations("solutions");
  const tu = await getTranslations("useCases");

  const solutions = footerPages("solutions");
  const useCases = footerPages("usecases");
  const company = footerPages("company");
  const legal = footerPages("legal");

  return (
    <footer className="tone-dark border-t">
      <div className="pv-container py-16 lg:py-20">
        <p className="max-w-xl font-display text-2xl leading-snug font-medium text-balance lg:text-3xl">
          {t("closing")}
        </p>

        <div className="mt-14 grid gap-10 border-t pt-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="font-display text-sm font-semibold tracking-[0.16em] uppercase">
              Pebble Vina
            </span>
            <div className="mt-4 max-w-xs">
              <Gap kind="confirm">{t("gapContact")}</Gap>
            </div>
          </div>

          <FooterColumn title={t("solutions")}>
            {solutions.map((p) => (
              <FooterLink key={p.key} href={p.path}>
                {ts(`${p.key.split(".")[1]}.title`)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("useCases")}>
            {useCases.map((p) => (
              <FooterLink key={p.key} href={p.path}>
                {tu(`${p.key.split(".")[1]}.title`)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("company")}>
            <FooterLink href="/about">{tn("about")}</FooterLink>
            {company
              .filter((p) => p.key !== "about")
              .map((p) => (
                <FooterLink key={p.key} href={p.path}>
                  {t(`links.${p.key}`)}
                </FooterLink>
              ))}
            <FooterLink href="/insights">{tn("insights")}</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-6 text-xs text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {t("rights")}
          </span>
          <div className="flex gap-4">
            {legal.map((p) => (
              <Link key={p.key} href={p.path} className="hover:text-foreground">
                {t(`links.${p.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-mono text-[11px] tracking-[0.18em] text-subtle-foreground uppercase">
        {title}
      </h2>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
