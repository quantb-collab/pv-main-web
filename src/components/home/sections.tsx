import { getTranslations } from "next-intl/server";
import {
  ProductShelf,
  type ShelfPartner,
} from "@/components/home/product-shelf";
import { SoftwareBento } from "@/components/home/software-bento";
import { TrainingProgram } from "@/components/home/training-program";
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
            trên trang chủ — tầng chữ đứng chung lưới với tầng số.

            `order-first` cho tới `lg`: thứ tự DOM ở đây là thứ tự của LƯỚI BỐN
            CỘT, nơi ô tuyên ngôn nằm cạnh ô chỉ số đầu tiên trên cùng một hàng.
            Xuống một cột thì thứ tự đó đọc ra là "Tra cứu −72% → tuyên ngôn →
            Chứng từ −58%", tức một câu khẩu hiệu chen vào GIỮA bộ bốn con số và
            cắt bộ đó làm đôi. Đưa lên đầu thì mạch đọc thành: luận điểm trước,
            bốn số đo sau, cách đo cuối — đúng thứ tự mà mắt vốn đọc trên lưới
            rộng, chỉ khác là theo chiều dọc. */}
        <BentoTile span="2x1" className="order-first lg:order-none">
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
 * ── DỰNG LẠI 2026-08-10, HAI VÒNG ──────────────────────────────────────────
 * Bản đầu phiên là lưới 4 thẻ giải pháp. Nó không sai, nhưng nó không nói được
 * ba điều chủ dự án cần section này nói:
 *   · sản phẩm chạy ĐA NỀN TẢNG — điện thoại, máy bàn, web;
 *   · tự hành thì cần AI đứng ĐÚNG GIỮA điều phối;
 *   · doanh nghiệp bắt đầu được từ đúng chỗ mình đang đứng.
 * Bốn thẻ ngang hàng nhau thì không có "giữa", không có "chỗ đang đứng", và
 * không có chỗ nào nhét được ba nền tảng vào.
 *
 * VÒNG 1 là một trục điều phối chia theo trạng thái dữ liệu (vào → xử lý → ra),
 * sáu chip nguồn bấm được, lõi sáng ở giữa. Chủ dự án BỎ trong cùng phiên: nó
 * là một sơ đồ, mà section này phải trưng được SẢN PHẨM — có ảnh, có tên, có
 * lời dẫn, có các cỡ màn hình. Bản đó nằm trong git nếu cần đọc lại.
 *
 * VÒNG 2 — bản đang chạy — là KỆ PHẦN MỀM (`SoftwareShelf`): một hàng card,
 * mỗi card một sản phẩm, mỗi card bốn ô chữ theo đúng thứ tự mắt cần (nhãn vai
 * → tên → lời dẫn → dải size) trên một ảnh 16:9. Hình thức và ngân sách chiều
 * cao nằm ở `software-shelf.tsx`; chỗ này chỉ nạp dữ liệu.
 *
 * BA SẢN PHẨM, và con số đó KHÔNG cố định: `productIndexes` dò bằng `t.has`
 * nên thêm sản phẩm thứ tư chỉ là thêm một bộ khoá `p4*` trong `vi.json`, y
 * như cách `Hardware` dò danh sách ứng dụng. Lưới tự xuống 2 cột ở `sm` và 3
 * cột từ `lg`, nên số lẻ không làm hỏng bố cục.
 *
 * "AI ĐỨNG GIỮA" SỐNG SÓT SAU KHI SƠ ĐỒ BỊ BỎ: card `Context Provider` khai
 * `core`, tức nó là thứ SÁNG NHẤT trên kệ và nó đứng GIỮA. Đó là toàn bộ cách
 * nói còn lại, và nó đủ — không cần vẽ mũi tên. Nếu sau này thêm sản phẩm thứ
 * tư thì phải xem lại: "giữa" chỉ đọc được khi số card lẻ.
 *
 * BỐN GIẢI PHÁP CŨ ĐI ĐÂU. Ba card trỏ TẠM sang trang giải pháp gần nghĩa nhất
 * (`workflow-automation` · `industrial-edge-ai` · `enterprise-knowledge`) vì ba
 * sản phẩm này chưa có trang riêng. Nút "Xem tất cả giải pháp" vẫn dẫn về
 * /solutions nên toàn bộ danh mục không bị mất khỏi trang chủ. Ba đường trỏ tạm
 * đã ghi vào `scopeGap` — có trang sản phẩm thật thì sửa `href`, không sửa gì
 * khác.
 *
 * ⚠️ HAI Ô CHỜ, cả hai vô hình như hai ô của `Hardware` và đều đang đếm trong
 * /track:
 *   `lineupGap` (proof) — danh sách sản phẩm, tên gọi, ba cỡ màn hình và lời
 *      dẫn từng sản phẩm đều CHƯA có tài liệu. Mục "MES" là suy đoán: chủ dự án
 *      viết "ERP" hai lần.
 *   `scopeGap` (restricted) — ô CHẶN PHÁT HÀNH. Section trưng ERP và MES như
 *      SẢN PHẨM của Pebble Vina, trong khi blueprint lớp B mới chỉ ghi "tích
 *      hợp ERP/CRM/MES". Chốt phạm vi rồi sửa blueprint hoặc sửa trang.
 */
export async function Software() {
  const t = await getTranslations("home.software");
  const tc = await getTranslations("cta");

  /* Ảnh sản phẩm. Khoá là số thứ tự card. Thiếu ảnh thì để `undefined` —
     `MediaFrame` tự hiện ô chờ kèm `need`, không phải sửa gì thêm.

     Ảnh phải là 16:9 nền trong suốt, KHÔNG phải ảnh vuông: khung dùng
     `object-cover` nên ảnh 1:1 bị cắt mất 44% chiều cao. Yêu cầu đầy đủ và
     cách đệm ảnh vuông về 16:9: `docs/IMAGE-BRIEF.md` nhóm D. */
  const PRODUCT_SRC: Record<number, string | undefined> = {
    1: undefined,
    2: undefined,
    3: undefined,
  };

  /* Số sản phẩm KHÔNG cố định — dò bằng `t.has` nên thêm một sản phẩm chỉ là
     thêm một bộ khoá trong vi.json. Trần 8 là lưới an toàn cho vòng lặp, không
     phải giới hạn thiết kế. */
  const productIndexes: number[] = [];
  for (let i = 1; i <= 8 && t.has(`p${i}Name`); i++) productIndexes.push(i);

  /* Năm bước của stepper = năm màn của PV One trong bộ bàn giao POC. Dò bằng
     `t.has` như mọi danh sách khác trên trang này, nên thêm màn thứ sáu chỉ là
     thêm một bộ khoá `s6*`.

     Ảnh render lại từ chính năm file `.dc.html` của bộ bàn giao ở
     deviceScaleFactor 2, cắt đúng khung màn 2880×1800 (bản 1× có sẵn trong bộ
     bàn giao sẽ nhoè ở bản phóng to trên màn retina). Cách chụp và cắt:
     `docs/SOFTWARE-KIT.md` §8. */
  const STEP_SRC: Record<number, string | undefined> = {
    1: "/software/one-home.png",
    2: "/software/one-approvals.png",
    3: "/software/one-search.png",
    4: "/software/one-assistant.png",
    5: "/software/one-rules.png",
  };
  const stepIndexes: number[] = [];
  for (let i = 1; i <= 8 && t.has(`s${i}Title`); i++) stepIndexes.push(i);

  /* Trang đi sâu, TẠM trỏ sang giải pháp gần nghĩa nhất — xem chú thích đầu
     hàm. Thứ tự khớp p1/p2/p3. */
  const HREF = [
    "/solutions/workflow-automation",
    "/solutions/enterprise-knowledge",
    "/solutions/industrial-edge-ai",
  ];

  /* HÌNH HỘP CỦA Ô = CỠ MÀN HÌNH mà sản phẩm chạy trên đó. Đây là chỗ khai,
     không phải trong messages: nó là quyết định bố cục, và nó chưa được xác
     nhận (ghi trong `lineupGap`). ERP và MES đều có bản cầm tay — duyệt trên
     điện thoại, và máy tính bảng ngoài xưởng; Context Provider là lõi hạ tầng
     nên đứng ở ô nằm.
     ⚠️ THỨ TỰ TRONG MẢNG QUYẾT ĐỊNH CHỖ TRONG LƯỚI. Ô lớn chiếm cột 1–2 cả ba
     hàng, nên ô `web` phải đi NGAY SAU nó để rơi vào cột 3–4 hàng 1; hai ô
     `phone` mới xuống được hai cột của hai hàng còn lại. Đảo thứ tự là lưới
     thủng một góc. */
  const SHAPE = { 1: "phone", 2: "web", 3: "phone" } as const;
  const TILE_ORDER = [2, 1, 3];

  return (
    <Section id="phan-mem" sky="rise" mark={{ numeral: "II", glyph: "layers" }}>
      <SoftwareBento
        /* Header GIỐNG HỆT công thức của section phần cứng (chủ dự án
           2026-08-10): nhãn hạng mục kèm dấu hai chấm, gộp cùng dòng tiêu đề,
           cỡ `subhead`, thẻ vẫn `h2`. Hai section sản phẩm đứng liền nhau nên
           chúng phải đọc ra là MỘT CẶP; năm section còn lại của trang chủ vẫn
           giữ eyebrow riêng dòng và cỡ `headline`.
           ⟹ Chú thích "section DUY NHẤT có tiêu đề nhỏ hơn một nấc" ở
             `Hardware` bên dưới đã sửa lại thành "hai section".

           KHÔNG truyền `lead` — `docs/SOFTWARE-KIT.md` §3: câu dẫn và ảnh sản
           phẩm nói cùng một việc, giữ cả hai là trả 52px của ngân sách chiều
           cao để nói hai lần. Khoá `home.software.lead` vẫn còn trong messages
           cho bố cục sau này. */
        header={
          <SectionHeader
            eyebrow={t("eyebrow")}
            eyebrowInline
            size="subhead"
            title={t("title")}
          />
        }
        action={
          <CtaButton href="/solutions" variant="outline">
            {tc("solutions")}
          </CtaButton>
        }
        stepsLabel={t("stepsLabel")}
        labels={{
          sample: t("sampleLabel"),
          zoom: t("zoomLabel"),
          pan: t("panLabel"),
          view: t("viewLabel"),
          fit: t("fitLabel"),
          read: t("readLabel"),
          close: tc("closeDrawer"),
          prev: t("prevLabel"),
          next: t("nextLabel"),
          pause: t("pauseLabel"),
          resume: t("resumeLabel"),
        }}
        hero={{
          label: t("oneLabel"),
          name: t("oneName"),
          steps: stepIndexes.map((n) => ({
            label: t(`s${n}Label`),
            title: t(`s${n}Title`),
            body: t(`s${n}Body`),
            story: t(`s${n}Story`),
            quote: t(`s${n}Quote`),
            need: t(`s${n}Need`),
            src: STEP_SRC[n],
            /* Công thức `alt` của kit §11: nêu VIỆC đang diễn ra, không mô tả
               bố cục ("bên trái là sidebar"). Ghép từ tên màn và câu mô tả
               chứ không viết riêng năm chuỗi — hai thứ đó phải luôn khớp nhau. */
            alt: t("shotAlt", { screen: t(`s${n}Title`), what: t(`s${n}Body`) }),
          })),
        }}
        products={TILE_ORDER.filter((n) => productIndexes.includes(n)).map(
          (n) => ({
            label: t(`p${n}Label`),
            name: t(`p${n}Name`),
            lead: t(`p${n}Lead`),
            need: t(`p${n}Need`),
            src: PRODUCT_SRC[n],
            href: HREF[n - 1] ?? "/solutions",
            shape: SHAPE[n as keyof typeof SHAPE] ?? "web",
          }),
        )}
      />

      {/* Ô chờ vô hình — cùng cơ chế và cùng lý do với hai ô của `Hardware`:
          cảnh báo dành cho NGƯỜI LÀM thì nằm ở `data-gap`, không nằm trên mặt
          khách xem. Không vẽ ra pixel nào nhưng `/track` và QA vẫn đếm.
          ĐỪNG XOÁ — xem cảnh báo ở đầu hàm.

          Ba ô chờ ẢNH thì KHÔNG nằm ở đây: chúng do `MediaFrame` tự vẽ trên
          mặt card, có badge vàng "Cần bổ sung ảnh" và một dòng `need`. Đó là
          ba chỗ thiếu ảnh, không phải ba chỗ thiếu quyết định. */}
      <span hidden data-gap="proof">
        {t("lineupGap")}
      </span>
      <span hidden data-gap="restricted">
        {t("scopeGap")}
      </span>
    </Section>
  );
}

/**
 * Section 5c — ĐÀO TẠO AI, mảng kinh doanh thứ ba.
 *
 * `home.who.r2Text` khai ba mảng ngay ở section định vị: "phần cứng, phần mềm
 * và đào tạo AI". Hai mảng đầu đã có section riêng, nên mảng thứ ba thiếu
 * section là trang chủ tự mâu thuẫn với chính nó — nó hứa ba, trưng hai.
 *
 * VỊ TRÍ. Ngay sau `Software` và ngay trước `CtaBand`: khối phần mềm vừa đặt
 * ra câu "mua về rồi ai dùng?", và đây là chỗ trả lời. Đặt trước `Software`
 * thì nó trả lời một câu chưa ai hỏi.
 *
 * NẤC TRỜI `rise`, BẰNG `Software` chứ không cao hơn. `dawn` là của `CtaBand`
 * và nấc chỉ được đi lên — tiêu `dawn` ở đây thì dải CTA hết chỗ để sáng hơn.
 * Hai section cùng nấc đứng liền nhau là hợp lệ: ranh giới nằm ở vạch chân
 * trời và quầng sáng do `<Section>` tự vẽ, không nằm ở màu nền.
 *
 * BA Ô CHỜ, không ô nào vẽ ra pixel trên mặt khách xem — cùng cơ chế và cùng
 * lý do với hai ô của `Hardware` và `Software`: cảnh báo dành cho NGƯỜI LÀM
 * nằm ở `data-gap`, và `/track` cùng QA vẫn đếm. ĐỪNG XOÁ.
 *   `paramsGap`  — toàn bộ con số trên section là THIẾT KẾ CHƯƠNG TRÌNH chưa
 *                  ai duyệt, không phải số đo từ dự án đã chạy.
 *   `pageGap`    — chưa có trang đào tạo nên hàng tiêu đề khuyết nút phụ.
 *   `scopeGap`   — hai lời hứa trong lead và ở cột trái cần Pebble Vina gật.
 */
export async function Training() {
  const t = await getTranslations("home.training");

  return (
    <Section id="dao-tao" sky="rise" mark={{ numeral: "III", glyph: "raise" }}>
      <TrainingProgram
        /* Header GIỐNG HỆT công thức của hai section sản phẩm: nhãn hạng mục
           kèm dấu hai chấm, gộp cùng dòng tiêu đề, cỡ `subhead`, thẻ vẫn `h2`.
           Ba mảng kinh doanh phải đọc ra là một BỘ BA; năm section còn lại của
           trang chủ vẫn giữ eyebrow riêng dòng và cỡ `headline`.

           CÓ `lead` ở đây, khác `Software`. Kit phần mềm bỏ lead vì câu dẫn và
           ảnh sản phẩm nói cùng một việc; section này không có ảnh nào, và câu
           dẫn là chỗ DUY NHẤT nói ai đứng lớp — thứ khác biệt nhất của mảng
           này so với mọi trung tâm đào tạo. */
        header={
          <SectionHeader
            eyebrow={t("eyebrow")}
            eyebrowInline
            size="subhead"
            title={t("title")}
            lead={t("lead")}
          />
        }
        claim={t("claim")}
        notes={[
          { label: t("audienceLabel"), text: t("audienceText") },
          { label: t("endLabel"), text: t("endText") },
        ]}
        metrics={[1, 2].map((n) => ({
          value: t(`m${n}Value`),
          label: t(`m${n}Label`),
        }))}
        pillarsLabel={t("pillarsLabel")}
        pillars={[1, 2, 3].map((n) => ({
          title: t(`p${n}Title`),
          text: t(`p${n}Text`),
          rows: [1, 2, 3].map((r) => ({
            value: t(`p${n}r${r}Value`),
            label: t(`p${n}r${r}Label`),
          })),
        }))}
      />

      <span hidden data-gap="confirm">
        {t("paramsGap")}
      </span>
      <span hidden data-gap="confirm">
        {t("pageGap")}
      </span>
      <span hidden data-gap="restricted">
        {t("scopeGap")}
      </span>
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

         `origin` lấy ĐÚNG cách Pebble Square tự định nghĩa trên web của chính
         họ (pebble-square.com, kiểm 2026-08-07): "a fabless company" chuyên
         "AI chip design", trụ sở ở Pangyo — Seongnam. Bản cũ ghi "công ty R&D
         bán dẫn" là mô tả của chúng ta chứ không phải của họ, và R&D thì rộng
         hơn hẳn cái họ thật sự làm.

         `tech` thay cho `p1Does` cũ (đổi 2026-08-07). Bản cũ mở bằng tên cơ
         chế rồi mới tới lợi ích; nay đảo lại đúng luật "benefit trước
         feature": tiêu đề là ba thứ người mua quan tâm (điện, chi phí, sức
         tính), thân mới nói vì sao — PIM. Nó cũng chuyển chỗ: đây là lời giải
         thích cho CẢ BA dòng chip bên phải, nên đứng ở cột trái nơi nó phủ
         được cả ba, không đứng lẫn trong một tầng kệ.

         ⚠️ Câu "ít điện, chi phí thấp" suy ra từ cơ chế PIM, CHƯA có phép đo
         đối chứng — đã ghi vào `specGap`. Không nâng lên thành con số.

         Chữ "PIM" nay có chỗ dựa công khai: web Pebble Square viết thẳng
         "PIM (Processing-In-Memory)". Tài liệu nội bộ ghi "Digital CIM
         Processor" nhưng dòng thông số mang chữ đó đã rút khỏi trang chủ, nên
         site và datasheet không còn chỗ nào lệch nhau.

         MỘT hồ sơ có họ tên thật (chủ dự án chốt 2026-08-07, rút từ bốn xuống
         một). Tên người thật trên trang công khai cần sự đồng ý của chính họ,
         không phải của Pebble Square — vẫn nằm trong `partnerGap`, chỉ là giờ
         phải đi xin một người thay vì bốn.

         Học vấn tách thành BA DÒNG rời thay cho một dòng ngăn bằng dấu chấm
         giữa: đây là hồ sơ một con người, và ba mốc nghề nghiệp dồn vào một
         dòng chạy dài thì đọc ra là chú thích kỹ thuật. Mỗi mốc một dòng thì
         mắt dừng được ở từng cái. */
      intro: {
        origin: t("p1Origin"),
        site: { href: "https://pebble-square.com", label: t("p1SiteLabel") },
        tech: {
          label: t("p1TechLabel"),
          title: t("p1TechTitle"),
          body: t("p1TechBody"),
        },
        leadLabel: t("p1LeadLabel"),
        lead: {
          name: t("p1CeoName"),
          role: t("p1CeoRole"),
          creds: [1, 2, 3].map((c) => t(`p1CeoCred${c}`)),
        },
        stats: [1, 2].map((s) => ({
          value: t(`p1Stat${s}Value`),
          label: t(`p1Stat${s}Label`),
        })),
      },
      lines: [1, 2, 3].map((n) => ({
        name: t(`c${n}Name`),
        /* Địa hạt ứng dụng, thay cho câu lợi điểm cũ ("Nghe và cảm nhận ngay
           tại thiết bị") mà chủ dự án gỡ 2026-08-07 vì nó nói lại đúng thứ
           dòng này đã nói. */
        fit: t(`c${n}Fit`),
        /* Thông số lấy NGUYÊN từ trang Pebble Square tự công bố —
           pebble-square.com/en/page/21, "Pebble Square's AI Chip Family",
           kiểm 2026-08-07. Nhãn dịch từ chính nhãn của họ:
             Power Efficiency · Neural Network · Chip Size
             Advanced Process · Peak Performance · Typical Power
           Hai điều KHÔNG được tự ý sửa:
           · "4 triệu" giữ đúng "Neural Network: 4 million" — bản gốc không nêu
             đơn vị, nên đoán thành "tham số" hay "khớp thần kinh" là bịa.
           · "~160 TOPS" phải đi kèm nhãn "Hiệu năng đỉnh": bản gốc ghi rõ
             "Peak Performance", và blueprint cấm benchmark thiếu điều kiện đo.
           Số nằm ở `Value`, nhãn ở `Label` — tách đôi để cột số canh thẳng
           hàng được, xem `ShelfTier`. */
        specs: [1, 2, 3].map((s) => ({
          value: t(`c${n}s${s}Value`),
          label: t(`c${n}s${s}Label`),
        })),
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
    <Section id="phan-cung" sky="deep" mark={{ numeral: "I", glyph: "base" }}>
      {/* Tiêu đề và nút đi VÀO trong ProductShelf để tab đứng cùng hàng với
          chúng: một hàng tab riêng tốn 44px, đúng phần chiều cao ô ảnh cần. */}
      <ProductShelf
        partners={partners}
        /* Eyebrow NẰM CÙNG DÒNG tiêu đề (chủ dự án chốt 2026-08-07): hàng
           tiêu đề phải gọn đúng MỘT dòng, mà section này đang tràn ~94px ở
           1440×900 nên không cõng nổi một dòng eyebrow riêng ở trên. Gộp vào
           trả lại ~30px và vẫn giữ được chữ "Phần cứng".

           `size="subhead"` là cái giá của việc nhãn và tiêu đề CÙNG một cỡ
           (chủ dự án chốt 2026-08-07). Ở cỡ `headline` cả cụm đo ~920px, quá
           khoang tiêu đề rộng nhất (~870px) lẫn trần `max-w-3xl` (768px) của
           SectionHeader — tức là xuống hai dòng. Ở `subhead` còn ~600px nên
           gọn một dòng. Thẻ vẫn là `h2`: hạ cỡ chữ chứ không hạ cấp thẻ, dàn
           bài của trang không được khuyết cấp chỉ vì thiếu chỗ.
           ⚠️ Đây và `Software` là HAI section duy nhất của trang chủ có tiêu đề
           nhỏ hơn một nấc so với năm section còn lại. Có chủ ý: chúng là cặp
           section sản phẩm và phải đọc ra là một cặp (chủ dự án 2026-08-10). */
        header={
          <SectionHeader
            eyebrow={t("eyebrow")}
            eyebrowInline
            size="subhead"
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
