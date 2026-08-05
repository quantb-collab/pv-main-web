import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { MediaFrame } from "@/components/motion/media-frame";
import {
  BeforeAfter,
  Card,
  CardGrid,
  StatementList,
} from "@/components/pv/blocks";
import { CtaBand } from "@/components/pv/cta-band";
import { Gap } from "@/components/pv/gap";
import { Section, SectionHeader } from "@/components/pv/section";
import type { PageEntry } from "@/content/registry";

/**
 * ============================================================================
 * TEMPLATE TRANG
 * ----------------------------------------------------------------------------
 * §10 và §11 blueprint quy định thứ tự khối cố định cho Solution page và
 * Use case page. Template ở đây hiện thực đúng thứ tự đó.
 *
 * Khối nào chưa có copy trong messages sẽ tự hiện ô chờ thay vì bị bỏ trống —
 * nhờ vậy trang luôn đủ cấu trúc, và người viết content biết chính xác còn
 * thiếu ô nào. Điền content = thêm khoá vào messages/vi.json, không sửa code.
 * ============================================================================
 */

/** Một khối nội dung có nhãn. Không có dữ liệu thì hiện ô chờ. */
function Block({
  label,
  items,
  text,
  need,
}: {
  label: string;
  items?: string[];
  text?: string;
  need: string;
}) {
  const hasContent = (items && items.length > 0) || Boolean(text);

  return (
    <div className="border-t py-8 first:border-t-0 first:pt-0">
      <h3 className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
        {label}
      </h3>
      <div className="mt-4 max-w-[68ch]">
        {hasContent ? (
          items ? (
            <StatementList items={items} />
          ) : (
            <p className="text-body text-muted-foreground">{text}</p>
          )
        ) : (
          <Gap kind="confirm">{need}</Gap>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Solution page — §10                                                         */
/* -------------------------------------------------------------------------- */

export async function SolutionTemplate({ page }: { page: PageEntry }) {
  const slug = page.key.split(".")[1];
  const t = await getTranslations("solutions");
  const tpl = await getTranslations("solutions.tpl");

  const get = (k: string) => (t.has(`${slug}.${k}`) ? t(`${slug}.${k}`) : undefined);
  const getList = (k: string) =>
    t.has(`${slug}.${k}`) ? (t.raw(`${slug}.${k}`) as string[]) : undefined;

  return (
    <>
      <Section tone="dark" className="pt-32 lg:pt-40">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <SectionHeader
            as="h1"
            eyebrow={t("hero.eyebrow")}
            title={get("promise") ?? t(`${slug}.title`)}
            lead={get("body")}
          />
          <Reveal direction="left">
            <MediaFrame
              ratio="wide"
              need={`Ảnh minh hoạ cho giải pháp "${t(`${slug}.title`)}". Ưu tiên ảnh chụp màn hình sản phẩm thật hoặc ảnh người dùng đang làm việc.`}
            />
          </Reveal>
        </div>
      </Section>

      <Section>
        <Block
          label={tpl("outcome")}
          text={get("outcome")}
          need={`Kết quả doanh nghiệp muốn đạt được với "${t(`${slug}.title`)}", viết theo góc nhìn người mua.`}
        />
        <Block
          label={tpl("signals")}
          items={getList("signals")}
          need="Ba đến năm dấu hiệu cho thấy doanh nghiệp đang gặp vấn đề này."
        />
        <Block
          label={tpl("audience")}
          text={get("audience")}
          need="Loại doanh nghiệp và vai trò phù hợp với giải pháp này."
        />
      </Section>

      <Section tone="surface">
        <SectionHeader
          eyebrow={tpl("before")}
          title={tpl("after")}
          className="sr-only"
        />
        {getList("before") && getList("after") ? (
          <BeforeAfter
            beforeTitle={tpl("before")}
            afterTitle={tpl("after")}
            before={getList("before")!}
            after={getList("after")!}
          />
        ) : (
          <Gap kind="confirm">
            Mô tả quy trình hiện tại và quy trình sau khi ứng dụng AI, mỗi bên
            bốn đến sáu bước, dùng đúng ngôn ngữ của người làm việc đó.
          </Gap>
        )}
      </Section>

      <Section>
        <div className="grid gap-x-16 md:grid-cols-2">
          <Block
            label={tpl("aiRole")}
            items={getList("aiRole")}
            need="Những bước AI thực hiện. Nói bằng động từ công việc, không nói tên công nghệ."
          />
          <Block
            label={tpl("humanRole")}
            items={getList("humanRole")}
            need="Những bước con người kiểm tra, phê duyệt và xử lý ngoại lệ."
          />
          <Block
            label={tpl("data")}
            items={getList("data")}
            need="Nguồn dữ liệu được sử dụng."
          />
          <Block
            label={tpl("systems")}
            items={getList("systems")}
            need="Hệ thống cần tích hợp."
          />
        </div>
      </Section>

      <Section tone="surface">
        <Block
          label={tpl("metrics")}
          items={getList("metrics")}
          need="Chỉ số dùng để nghiệm thu. Chỉ nêu tên chỉ số, không nêu con số khi chưa có case study."
        />
        <Block
          label={tpl("delivery")}
          text={get("delivery")}
          need="Cách Pebble triển khai giải pháp này, gắn với quy trình tám bước."
        />
        <Block
          label={tpl("proof")}
          items={getList("proof")}
          need={page.proofNeeded.join(". ")}
        />
      </Section>

      <CtaBand cta={page.cta} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Use case page — §11                                                         */
/* -------------------------------------------------------------------------- */

export async function UseCaseTemplate({ page }: { page: PageEntry }) {
  const slug = page.key.split(".")[1];
  const t = await getTranslations("useCases");
  const tpl = await getTranslations("useCases.tpl");

  const get = (k: string) => (t.has(`${slug}.${k}`) ? t(`${slug}.${k}`) : undefined);
  const getList = (k: string) =>
    t.has(`${slug}.${k}`) ? (t.raw(`${slug}.${k}`) as string[]) : undefined;

  const blocks: { key: string; label: string; list?: boolean; need: string }[] = [
    { key: "user", label: tpl("user"), need: "Ai đang thực hiện công việc này." },
    { key: "current", label: tpl("current"), need: "Công việc hiện đang diễn ra thế nào." },
    { key: "bottleneck", label: tpl("bottleneck"), list: true, need: "Thời gian, thao tác, lỗi hoặc rủi ro đang nằm ở đâu." },
    { key: "aiRole", label: tpl("aiRole"), list: true, need: "AI hỗ trợ hoặc thực hiện bước nào." },
    { key: "humanRole", label: tpl("humanRole"), list: true, need: "Con người kiểm tra, phê duyệt và xử lý ngoại lệ ở đâu." },
    { key: "data", label: tpl("data"), list: true, need: "Nguồn dữ liệu được sử dụng." },
    { key: "systems", label: tpl("systems"), list: true, need: "Hệ thống cần tích hợp." },
    { key: "metrics", label: tpl("metrics"), list: true, need: "Đo hiệu quả bằng chỉ số nào." },
    { key: "startScope", label: tpl("startScope"), need: "PoC có thể bắt đầu nhỏ đến mức nào." },
    { key: "expansion", label: tpl("expansion"), need: "Sau khi thành công có thể mở rộng ra sao." },
  ];

  return (
    <>
      <Section tone="dark" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow={t("hero.eyebrow")}
          title={t(`${slug}.title`)}
          lead={get("lead")}
        />
      </Section>

      <Section>
        {blocks.map((b) => (
          <Block
            key={b.key}
            label={b.label}
            items={b.list ? getList(b.key) : undefined}
            text={b.list ? undefined : get(b.key)}
            need={b.need}
          />
        ))}
      </Section>

      <CtaBand cta={page.cta} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Trang khung tạm — dùng cho các trang thuộc V2                               */
/* -------------------------------------------------------------------------- */

export async function StubPage({
  page,
  title,
}: {
  page: PageEntry;
  title?: string;
}) {
  const t = await getTranslations("stub");

  return (
    <>
      <Section tone="dark" className="pt-32 lg:pt-40">
        <SectionHeader
          as="h1"
          eyebrow={t("eyebrow")}
          title={title ?? page.key}
          lead={t("lead")}
        />
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
              Nhiệm vụ của trang
            </h2>
            <p className="mt-4 text-body text-muted-foreground">
              {page.objective}
            </p>

            <h2 className="mt-10 font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
              Câu hỏi trang phải trả lời
            </h2>
            <StatementList className="mt-4" items={page.questions} />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
              Còn thiếu
            </h2>
            {page.gaps.map((gap) => (
              <Gap key={gap} kind="confirm">
                {gap}
              </Gap>
            ))}
            {page.proofNeeded.map((proof) => (
              <Gap key={proof} kind="proof">
                {proof}
              </Gap>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand cta={page.cta} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Lưới danh mục — dùng cho trang tổng quan Solutions và Use Cases             */
/* -------------------------------------------------------------------------- */

export function IndexGrid({
  items,
}: {
  items: { href: string; title: string; promise?: string; body?: string }[];
}) {
  return (
    <div className="mt-14 overflow-hidden rounded-xl border">
      <CardGrid cols={3}>
        {items.map((item, i) => (
          <Card key={item.href} index={i + 1} title={
            <a href={item.href} className="after:absolute after:inset-0">
              {item.promise ?? item.title}
            </a>
          }>
            {item.body}
          </Card>
        ))}
      </CardGrid>
    </div>
  );
}
