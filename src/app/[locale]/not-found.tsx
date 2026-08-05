import { useTranslations } from "next-intl";
import { CtaButton } from "@/components/pv/cta-button";
import { Section, SectionHeader } from "@/components/pv/section";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Section className="pt-32 lg:pt-40">
      <SectionHeader as="h1" title={t("title")} lead={t("lead")}>
        <div className="mt-4">
          <CtaButton href="/" arrow={false}>
            {t("back")}
          </CtaButton>
        </div>
      </SectionHeader>
    </Section>
  );
}
