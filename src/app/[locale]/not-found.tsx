import { useTranslations } from "next-intl";
import { Section, SectionHeader } from "@/components/pv/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Section className="pt-32 lg:pt-40">
      <SectionHeader as="h1" title={t("title")} lead={t("lead")}>
        <div className="mt-4">
          <Button asChild>
            <Link href="/">{t("back")}</Link>
          </Button>
        </div>
      </SectionHeader>
    </Section>
  );
}
