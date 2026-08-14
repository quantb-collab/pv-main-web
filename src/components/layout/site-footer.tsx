import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { footerPages } from "@/content/registry";

/**
 * Footer — mặt đất dưới đường chân trời.
 *
 * Đứng ngay sau `CtaBand` (nấc `dawn`, chỗ sáng nhất trang) nên nó lùi xuống
 * một nấc: dải CTA phải là điểm sáng cuối cùng mắt dừng lại, không phải danh
 * sách link. Vạch chân trời ở mép trên là thứ tách hai khối đó ra.
 *
 * Danh sách link lấy từ registry, không viết tay, để không lệch khi thêm trang.
 */

/**
 * Thứ tự cột "Công ty". Footer là điểm dừng cuối của người quét trang, nên hai
 * link chuyển đổi đứng trước phần giới thiệu — không xếp theo thứ tự sitemap.
 * Trang mới chưa có tên ở đây thì rơi xuống cuối cột.
 */
const COMPANY_ORDER = ["contact", "ai-assessment", "about", "case-studies"];
const rank = (key: string) => {
  const i = COMPANY_ORDER.indexOf(key);
  return i === -1 ? COMPANY_ORDER.length : i;
};

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const ts = await getTranslations("solutions");
  const tu = await getTranslations("useCases");

  const solutions = footerPages("solutions");
  const useCases = footerPages("usecases");
  const company = footerPages("company").sort(
    (a, b) => rank(a.key) - rank(b.key),
  );
  const legal = footerPages("legal");

  return (
    /* data-snap="end": đáy footer khớp đáy màn hình = đúng cuối trang. Thiếu
       điểm dừng này thì đứng ở footer sẽ bị snap hút ngược lên CtaBand. */
    <footer data-snap="end" className="sky-deep relative isolate">
      <span aria-hidden className="pv-grain -z-10" />

      <div className="pv-container py-16 lg:py-20">
        {/* Không mở footer bằng một câu tuyên ngôn: CtaBand ngay phía trên đã
            nói xong bước tiếp theo. Footer làm việc khác — danh tính pháp nhân,
            đường đi, và điều kiện pháp lý. */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {/* Cùng cụm dấu hiệu + chữ với header — hai đầu trang phải khai
                danh tính giống hệt nhau. Ảnh để trang trí, tên đứng cạnh. */}
            <span className="flex items-center gap-2.5 font-display text-ui font-semibold tracking-brand uppercase">
              <Image
                src="/brand/logo-mark.png"
                alt=""
                aria-hidden
                width={512}
                height={512}
                sizes="32px"
                className="size-7 shrink-0"
              />
              Pebble Vina
            </span>

            <h2 className="mt-6 font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
              {t("office.label")}
            </h2>
            <address className="mt-4 max-w-xs text-body-sm text-muted-foreground not-italic">
              <span className="block text-foreground">{t("office.entity")}</span>
              <span className="mt-1 block whitespace-pre-line">
                {t("office.address")}
              </span>

              <span className="mt-4 flex flex-col gap-1.5">
                <a
                  href={t("office.phoneHref")}
                  className="text-foreground transition-colors hover:text-brand"
                >
                  <span className="sr-only">{t("phone")}: </span>
                  {t("office.phoneLabel")}
                </a>
                <a
                  href={`mailto:${t("office.emailLabel")}`}
                  className="text-foreground transition-colors hover:text-brand"
                >
                  <span className="sr-only">{t("email")}: </span>
                  {t("office.emailLabel")}
                </a>
              </span>

              <span className="mt-4 block font-mono text-micro text-subtle-foreground">
                {t("office.taxId")}
              </span>
            </address>
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
            {company.map((p) => (
              <FooterLink key={p.key} href={p.path}>
                {t(`links.${p.key}`)}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-6 text-meta text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
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
      <h2 className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
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
        className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
