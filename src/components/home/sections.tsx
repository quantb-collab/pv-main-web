import { getTranslations } from "next-intl/server";
import {
  ProductShelf,
  type ShelfPartner,
} from "@/components/home/product-shelf";
import { Reveal } from "@/components/motion/reveal";
import {
  BentoGrid,
  BentoTile,
  Card,
  CardGrid,
  DefinitionList,
  StageMatrix,
  StatTile,
} from "@/components/pv/blocks";
import { CtaButton } from "@/components/pv/cta-button";
import { Gap } from "@/components/pv/gap";
import { Highlight } from "@/components/pv/highlight";
import { Section, SectionHeader } from "@/components/pv/section";

/**
 * Các section của trang chủ, đúng thứ tự §9 blueprint.
 * Mỗi section chỉ ghép từ block dùng chung — không tự dựng lưới riêng.
 */

/**
 * Section 2 — Hành trình & định vị Pebble Vina (chèn theo quyết định chủ dự
 * án 2026-08-06, ngoài danh sách §9 gốc). Header GỘP MỘT DÒNG duy nhất —
 * không eyebrow, không câu tuyên bố, không gạch chân — theo yêu cầu chủ dự
 * án 2026-08-06 (các concept statement/underline trước đó đã bị loại).
 *
 * Thân section là DefinitionList theo ĐÚNG thứ tự diễn dịch chủ dự án đưa
 * (không đảo, không diễn lại):
 *   2026 — Hà Nội   ra đời, xác định ngay mục tiêu (giá trị năng lực sản
 *                   xuất và vận hành cho doanh nghiệp)
 *   Trọng tâm       BA MẢNG KINH DOANH: phần cứng · phần mềm · đào tạo AI
 *                   (đào tạo AI là một mảng dịch vụ, KHÔNG phải "nhân sự
 *                   nội bộ được đào tạo AI" — đã từng hiểu sai)
 *   Cách làm        rõ ràng mà không cứng nhắc, linh hoạt theo từng bài toán
 *
 * Hàng "Cách làm" gánh THÊM một vế từ 2026-08-07: phân quyền, nhật ký và điểm
 * phê duyệt là MẶC ĐỊNH. Đó là phần đền cho section Enterprise vừa chuyển sang
 * /how-we-deliver/governance — blueprint bắt Enterprise phải là mặc định chứ
 * không phải một menu riêng, nên trang chủ vẫn phải nói câu đó một lần. Một
 * dòng, không phải một section: đủ trả lời "có đáng tin để giao dự án
 * Enterprise không" mà không tốn thêm khối nào.
 *
 * KHÔNG claim quy mô/vị thế — công ty mới, chưa có bằng chứng, registry cấm
 * số liệu chưa xác minh. Chi tiết dịch vụ từng mảng thuộc section offer sẽ
 * dựng sau, không liệt kê ở đây.
 */
export async function Identity() {
  const t = await getTranslations("home.who");

  return (
    <Section id="pebble-vina" sky="night">
      <SectionHeader title={t("title")} />
      <DefinitionList
        className="mt-14 w-full max-w-3xl"
        items={[1, 2, 3].map((n) => ({
          label: t(`r${n}Label`),
          text: t(`r${n}Text`),
        }))}
      />
    </Section>
  );
}

/**
 * §9 Section 2 + 3 — Problem Recognition GỘP với Business Outcomes.
 * Bố cục theo ý tưởng chủ dự án 2026-08-06 (lần chỉnh 3): BA NẤC tăng tiến
 * "vận hành cổ điển → đã số hoá → số hoá tự hành cùng AI" — KHÔNG eyebrow,
 * KHÔNG lead. Cột tăng độ nhấn theo đúng thang sáng của site (StageMatrix
 * tự lo); mỗi HÀNG là cùng một việc tiến hoá qua ba nấc, tag hàng lặp ở cả
 * ba cột để dõi được. Nấc giữa cố ý là tấm gương của đa số khách Enterprise:
 * đã có phần mềm nhưng con người vẫn là keo dán giữa các hệ thống — nhận ra
 * mình ở nấc 2 thì nấc 3 mới có lý do. Giải pháp ở nấc 3 giữ MỨC TỔNG QUÁT,
 * chi tiết thuộc /use-cases và các section phía dưới.
 *
 * Tiêu đề là MỘT câu hỏi ngắn, căn giữa: bản dài hai vế trước đó gãy 3 dòng
 * text-headline và lệch hẳn so với bảng full-width (chủ dự án chê
 * 2026-08-06). Câu hỏi chỉ lo vế điểm đau — người đọc tự định vị vào nấc
 * 1–2; vế "option của chúng ta" KHÔNG nói bằng chữ mà để panel 3 phát sáng
 * tự trả lời. KHÔNG có Gap proof ở đây (chủ dự án gỡ 2026-08-06): section
 * không trưng con số hay khẳng định cần bằng chứng — nếu sau này thêm số %,
 * quay lại luật cũ: chỉ điền khi có case study kèm điều kiện đo.
 */
export async function Contrast() {
  const t = await getTranslations("home.contrast");

  return (
    <Section id="ket-qua" sky="night">
      <SectionHeader title={t("title")} align="center" />
      <StageMatrix
        className="mt-14"
        rows={[1, 2, 3, 4].map((n) => t(`r${n}Tag`))}
        stages={[1, 2, 3].map((s) => ({
          label: t(`s${s}`),
          items: [1, 2, 3, 4].map((n) => t(`r${n}s${s}`)),
        }))}
      />
    </Section>
  );
}

/**
 * Section 4 — Bento chỉ số (chèn theo yêu cầu chủ dự án 2026-08-06, ngoài
 * danh sách §9 gốc): "section 3 không nói suông" — bốn con số nối 1:1 với
 * bốn hàng của ma trận (tag lấy THẲNG từ home.contrast để không lệch chữ).
 * Bốn nấc bento xuống dần theo đúng thứ tự bốn hàng của ma trận, nên đọc
 * trái→phải, trên→dưới là ra 1-2-3-4 mà không cần đánh số: Tra cứu (pain số
 * một) ở nấc `hero`, Chứng từ ở nấc `wide`, hai hàng còn lại ở nấc `stat`.
 * Tag mono lấy THẲNG từ home.contrast — cùng chữ thì mắt tự nối được ô số với
 * hàng của nó. "Cách đo" đứng ở nấc `note`, một vạch trần dưới cùng: nó là
 * chú thích cho cả bốn ô chứ không phải chỉ số thứ năm.
 *
 * SỐ TRÊN LƯỚI LÀ SỐ MINH HOẠ (quyết định chủ dự án 2026-08-06: mặt khách
 * xem sạch cảnh báo — không GapChip, không ô chờ vàng). Ba chốt an toàn để
 * không bao giờ phát hành nhầm số bịa: (1) mỗi con số mang data-gap="proof"
 * vô hình qua prop `placeholder` — QA và /track vẫn đếm; (2) ô note "Cách
 * đo" nói thẳng trên trang: số minh hoạ, sẽ thay bằng số đo từng dự án;
 * (3) ô ảnh MediaFrame đã RÚT khỏi lưới vì khung chờ ảnh cũng là một cảnh
 * báo — có ảnh sản phẩm thật thì trả lại (sơ đồ cũ trong git). Có số xác
 * minh kèm điều kiện đo: thay value, bỏ `placeholder`, xong.
 */
export async function Stats() {
  const t = await getTranslations("home.stats");
  const tc = await getTranslations("home.contrast");

  return (
    <Section id="con-so" sky="deep">
      <SectionHeader title={t("title")} align="center" />
      <BentoGrid className="mt-14">
        <StatTile
          tier="hero"
          placeholder
          tag={tc("r1Tag")}
          value={t("s1Value")}
          label={t("s1Label")}
        />
        {/* Ô tuyên ngôn: thông điệp trung tâm của blueprint, lần duy nhất
            trên trang chủ — tầng chữ đứng chung lưới với tầng số. */}
        <BentoTile span="2x1">
          <p className="max-w-[24ch] font-display text-title font-semibold text-balance">
            <Highlight>{t("statement")}</Highlight>
          </p>
        </BentoTile>
        <StatTile
          tier="wide"
          placeholder
          tag={tc("r2Tag")}
          value={t("s2Value")}
          label={t("s2Label")}
        />
        <StatTile
          placeholder
          tag={tc("r3Tag")}
          value={t("s3Value")}
          label={t("s3Label")}
        />
        <StatTile
          placeholder
          tag={tc("r4Tag")}
          value={t("s4Value")}
          label={t("s4Label")}
        />
        <StatTile tier="note" tag={t("mTag")} label={t("mBody")} />
      </BentoGrid>
    </Section>
  );
}

/**
 * Section 5 — GIẢI PHÁP, tách làm HAI section (chủ dự án 2026-08-07). Đây cũng
 * là bộ khung cho /solutions về sau: trang đó sẽ chia đúng hai nhóm này.
 *
 * Vì sao phải tách chứ không gộp một lưới 6 thẻ: phần mềm và phần cứng bán cho
 * hai câu hỏi khác nhau. Phần mềm trả lời "bắt đầu từ đâu"; phần cứng trả lời
 * "còn dữ liệu của tôi thì sao". Gộp lại thì lớp C (blueprint: Private AI,
 * Edge, thiết bị, bán dẫn) nằm ngang hàng với lớp A và kéo sự chú ý khỏi lợi
 * ích kinh doanh — đúng thứ blueprint cấm.
 *
 * KHÔNG viết chữ mới cho thẻ: title/promise lấy thẳng từ namespace `solutions`
 * nên trang chủ và trang giải pháp không bao giờ lệch chữ.
 *
 * Bốn danh từ ở đây (Kho tri thức · Xử lý chứng từ · Tự động hoá · AI agent)
 * CỐ Ý khác bốn danh từ của Contrast (Tra cứu · Chứng từ · Báo cáo · Phê
 * duyệt): Contrast gọi tên NỖI ĐAU, section này gọi tên THỨ ĐƯỢC XÂY. Lặp lại
 * cùng bộ từ là lý do StartHere bị cắt 2026-08-07 — đừng lặp lại.
 */
export async function Software() {
  const t = await getTranslations("home.software");
  const ts = await getTranslations("solutions");
  const tc = await getTranslations("cta");

  const items = [
    "enterprise-knowledge",
    "document-intelligence",
    "workflow-automation",
    "ai-agents",
  ] as const;

  return (
    <Section id="phan-mem" sky="rise">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-12 overflow-hidden rounded-xl border">
        <CardGrid cols={2}>
          {items.map((key, i) => (
            <Card
              key={key}
              index={i + 1}
              href={`/solutions/${key}`}
              title={ts(`${key}.title`)}
            >
              {ts(`${key}.promise`)}
            </Card>
          ))}
        </CardGrid>
      </div>
      <Reveal className="mt-10">
        <CtaButton href="/solutions" variant="outline">
          {tc("solutions")}
        </CtaButton>
      </Reveal>
    </Section>
  );
}

/**
 * Section 5a — PHẦN CỨNG, đứng TRƯỚC phần mềm (chủ dự án 2026-08-07).
 *
 * ⚠️ Vị trí này đi ngược ba chỗ trong blueprint: "cấm lấy chip làm trung tâm",
 * registry `home.forbidden` cấm "danh sách chip ở phần đầu trang", và lớp C
 * không được kéo chú ý khỏi lợi ích kinh doanh. Chủ dự án đã cân nhắc và quyết
 * đưa lên vì đây là tài sản khác biệt nhất — không công ty phần mềm nào có.
 *
 * Mâu thuẫn được xử bằng KHUNG, không bằng vị trí: eyebrow là "phần cứng và
 * bán dẫn" chứ không phải tên một sản phẩm; lead nói thẳng vai của section là
 * "lý do phần mềm phía trên chạy được", tức nó phục vụ khối sau chứ không mời
 * mua. Không thông số, không datasheet, không tên đối tác đúc — những thứ đó
 * là cái biến section này thành catalogue bán chip.
 *
 * KỆ SẢN PHẨM theo đối tác (`ProductShelf`): tab chọn đối tác — mặc định và
 * hiện duy nhất là Pebble Square — rồi ba tầng kệ, mỗi tầng một dòng chip kèm
 * tên, ô chờ thông số, lợi điểm và ba ô ảnh sản phẩm ứng dụng cùng cỡ. Hình
 * thức nằm ở `product-shelf.tsx`; chỗ này chỉ nạp dữ liệu.
 *
 * ⚠️ HAI THỨ CHƯA ĐƯỢC PHÉP LÊN BẢN THẬT, cả hai đều có ô chờ trên trang và
 * đang đếm trong /track:
 *   `partnerGap` (restricted) — `about.squareGap` ghi phạm vi công bố quan hệ
 *      với Pebble Square CHƯA được chốt. Cái tên trên tab và chữ "độc quyền"
 *      trong lead đều nằm trong diện đó. Đây là ô CHẶN PHÁT HÀNH.
 *   `specGap` (proof) — datasheet chưa duyệt, và lợi điểm từng dòng là SUY RA
 *      từ hướng sản phẩm trong `technology.hardware`, chưa ai xác nhận.
 *
 * `private-ai` và `industrial-edge-ai` đã RÚT khỏi trang chủ cùng lần này:
 * chúng là mô hình triển khai, không phải chip, và giữ lại thì section quay
 * về làm danh mục. Cả hai vẫn sống ở /solutions.
 */
export async function Hardware() {
  const t = await getTranslations("home.hardware");
  const tc = await getTranslations("cta");

  /* Ảnh thiết bị. Khoá là số dòng chip (1=MINT, 2=PAPAYA, 3=ESPRESSO), thứ tự
     trong mảng khớp `c{n}a{1..5}`. Thiếu ảnh thì để `undefined` — `MediaFrame`
     tự hiện ô chờ câm, không phải sửa gì thêm.

     Ảnh phải là 16:9 nền trong suốt, KHÔNG phải ảnh vuông: khung dùng
     `object-cover` nên ảnh 1:1 bị cắt mất 44% chiều cao. Yêu cầu đầy đủ và
     cách đệm ảnh vuông về 16:9: `docs/IMAGE-BRIEF.md`. */
  const PRODUCT_SRC: Record<number, (string | undefined)[]> = {
    1: [
      "/hardware/mint-voice-assistant.png",
      "/hardware/mint-wearable.png",
      "/hardware/mint-factory-sensor.png",
      "/hardware/mint-iot-gateway.png",
      "/hardware/mint-smart-home-panel.png",
    ],
    2: [
      "/hardware/papaya-afci-breaker.png",
      "/hardware/papaya-vision-camera.png",
      "/hardware/papaya-security-camera.png",
      "/hardware/papaya-overhead-sensor.png",
      "/hardware/papaya-warehouse-robot.png",
    ],
    3: [
      "/hardware/espresso-ai-pc.png",
      "/hardware/espresso-robot-arm.png",
      "/hardware/espresso-ai-server.png",
    ],
  };

  /* Số ứng dụng mỗi dòng chip KHÔNG cố định — PAPAYA có 6, hai dòng kia có 5.
     Dò bằng `t.has` nên thêm một ứng dụng chỉ là thêm một khoá trong vi.json,
     không phải sửa file này. Trần 12 là lưới an toàn cho vòng lặp, không phải
     giới hạn thiết kế; băng card cuộn được nên không có trần hiển thị. */
  const appIndexes = (n: number) => {
    const out: number[] = [];
    for (let i = 1; i <= 12 && t.has(`c${n}a${i}`); i++) out.push(i);
    return out;
  };

  /* Thêm đối tác = thêm một phần tử vào mảng này. `ProductShelf` không cần
     sửa, và tab đầu tiên luôn là tab mặc định. */
  const partners: ShelfPartner[] = [
    {
      id: "pebble-square",
      name: t("p1Name"),
      /* Hồ sơ đối tác nén từ bộ tài liệu Pebble Square chủ dự án cấp
         2026-08-07 (slide "Team & Execution Capability" và "Problem Statement
         — Existing AI Hardware Bottlenecks"): đến từ đâu · làm cụ thể cái gì ·
         ai đang làm · mạnh cỡ nào.

         `p1Does` gọi THẲNG TÊN CƠ CHẾ theo yêu cầu chủ dự án — "chip Edge AI
         chạy PIM" — rồi mới giải thích PIM là gì bằng tiếng người ("phép tính
         chạy ngay trong ô nhớ"). Đây là ngoại lệ có chủ ý với luật "không lấy
         tên công nghệ làm lợi ích": PIM là điểm khác biệt kiến trúc thật, và
         câu ngay sau đã quy nó về lợi ích (điện và độ trễ).

         ⚠️ Tài liệu gốc ghi "Digital CIM Processor", trang đang dùng "PIM".
         Hai chữ gần nghĩa nhưng KHÔNG được để site và datasheet lệch nhau —
         đã đưa vào `partnerGap` để chốt trước khi phát hành.

         MỘT hồ sơ có họ tên thật (chủ dự án chốt 2026-08-07, rút từ bốn xuống
         một). Tên người thật trên trang công khai cần sự đồng ý của chính họ,
         không phải của Pebble Square — vẫn nằm trong `partnerGap`, chỉ là giờ
         phải đi xin một người thay vì bốn.

         `site` bỏ trống cho tới khi có địa chỉ web chính thức của Pebble
         Square: `PartnerIntro` không vẽ gì khi thiếu `href`, vì một đường link
         chết trên trang chủ còn tệ hơn không có link. Điền vào đây là xong. */
      intro: {
        origin: t("p1Origin"),
        does: t("p1Does"),
        leadLabel: t("p1LeadLabel"),
        lead: {
          name: t("p1CeoName"),
          role: t("p1CeoRole"),
          bio: t("p1CeoBio"),
        },
        stats: [1, 2].map((s) => ({
          value: t(`p1Stat${s}Value`),
          label: t(`p1Stat${s}Label`),
        })),
      },
      lines: [1, 2, 3].map((n) => ({
        name: t(`c${n}Name`),
        edge: t(`c${n}Edge`),
        /* Thông số THẬT, chủ dự án cấp 2026-08-07 từ tài liệu Pebble Square.
           Nhãn "mạng nơ-ron" giữ đúng chữ của tài liệu gốc ("Neural Network:
           4 million") — không dịch thành "tham số", vì đơn vị chưa rõ và đoán
           sai một thông số kỹ thuật còn tệ hơn không ghi. Điều kiện đo (peak
           hay sustained, ở tần số nào) vẫn thiếu — nằm trong `specGap`. */
        spec: t(`c${n}Spec`),
        /* Màu lấy từ chính tên chip. Thứ tự khớp c1/c2/c3 — đổi thứ tự dòng
           chip thì phải đổi cả mảng này, nếu không PAPAYA ra màu bạc hà. */
        accent: (["mint", "papaya", "espresso"] as const)[n - 1],
        /* Mỗi thiết bị một card ảnh + tên trong cùng khung (đổi 2026-08-07,
           xem quyết định 2 trong `ProductShelf`). Nhãn LUÔN hiện; có ảnh thì
           chỉ cần điền `src`, không phải sửa gì khác.

           Ba dòng chip không cùng số ứng dụng: MINT 5 · PAPAYA 5 · ESPRESSO 3.
           Cố ý — mỗi dòng chỉ giữ những ứng dụng chủ dự án chốt, không độn cho
           đều. Băng cuộn được nên số lẻ không làm hỏng bố cục.

           Nguồn của từng danh sách, vì ba nguồn khác nhau về độ tin cậy:
           · ESPRESSO — tài liệu Pebble Square ghi 5 mục (AI PC · Physical AI ·
             Robotics · On-Premise Server · Enterprise AI); chủ dự án 2026-08-07
             rút còn 3 và đổi tên (`Tay robot`, `Máy chủ AI`). Trang giờ KHÁC
             tài liệu gốc — nếu đối chiếu datasheet thì đây là chỗ lệch.
           · PAPAYA `c2a1` "An toàn điện" — chủ dự án cấp, ứng dụng THẬT, nên nó
             đứng đầu băng. Bốn mục còn lại là bản nháp.
           · MINT và phần còn lại của PAPAYA — BẢN NHÁP tôi suy từ hướng sản
             phẩm, chưa được chốt. Nằm trong `specGap`. */
        products: appIndexes(n).map((i) => {
          const app = t(`c${n}a${i}`);
          return {
            name: app,
            need: t(`c${n}Need`, { app }),
            src: PRODUCT_SRC[n]?.[i - 1],
          };
        }),
        nav: {
          prev: t("navPrev", { name: t(`c${n}Name`) }),
          next: t("navNext", { name: t(`c${n}Name`) }),
        },
      })),
    },
  ];

  return (
    <Section id="phan-cung" sky="deep">
      {/* Tiêu đề và nút đi VÀO trong ProductShelf để tab đứng cùng hàng với
          chúng: một hàng tab riêng tốn 44px, đúng phần chiều cao ô ảnh cần. */}
      <ProductShelf
        partners={partners}
        header={
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            lead={t("lead")}
          />
        }
        action={
          <CtaButton href="/technology/edge-hardware" variant="outline">
            {tc("more")}
          </CtaButton>
        }
        motionLabels={{ pause: t("motionPause"), play: t("motionPlay") }}
      />

      {/*
        Ô CHỜ VÔ HÌNH — chủ dự án gỡ hai khối cảnh báo khỏi mặt khách
        2026-08-07, cùng lý do và cùng cách làm với bốn số minh hoạ ở bento:
        cảnh báo dành cho NGƯỜI LÀM thì nằm ở `data-gap`, không nằm trên mặt
        khách xem. Hai span này không vẽ ra pixel nào nhưng
        `document.querySelectorAll("[data-gap]")` vẫn đếm, nên QA và /track
        vẫn chặn phát hành.

        ĐỪNG XOÁ. `partnerGap` là ô CHẶN PHÁT HÀNH thật: `about.squareGap` ghi
        phạm vi được phép công bố quan hệ với Pebble Square chưa được chốt —
        nghĩa là cái tên trên tab và chữ "độc quyền" trong lead đều chưa được
        phép lên bản thật.
      */}
      <span hidden data-gap="restricted">
        {t("partnerGap")}
      </span>
      <span hidden data-gap="proof">
        {t("specGap")}
      </span>
    </Section>
  );
}

/* §9 Section 6 — Why Pebble Vina */
export async function Why() {
  const t = await getTranslations("home.why");

  return (
    <Section id="vi-sao" sky="deep">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-14 overflow-hidden rounded-xl border">
        <CardGrid cols={4}>
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} index={n} title={t(`p${n}Title`)}>
              {t(`p${n}Body`)}
            </Card>
          ))}
        </CardGrid>
      </div>
    </Section>
  );
}

/* §9 Section 10 — Proof */
export async function Proof() {
  const t = await getTranslations("home.proof");

  return (
    <Section id="bang-chung" sky="rise">
      <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <Gap kind="proof">{t("caseGap")}</Gap>
        </Reveal>
        <Reveal delay={0.05}>
          <Gap kind="restricted">{t("partnerGap")}</Gap>
        </Reveal>
        <Reveal delay={0.1}>
          <Gap kind="proof">{t("teamGap")}</Gap>
        </Reveal>
        <Reveal delay={0.15}>
          <Gap kind="proof">{t("demoGap")}</Gap>
        </Reveal>
      </div>
    </Section>
  );
}
