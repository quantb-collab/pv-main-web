import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { footerPages } from "@/content/registry";

/**
 * ============================================================================
 * FOOTER — MẶT ĐẤT DƯỚI ĐƯỜNG CHÂN TRỜI
 * ----------------------------------------------------------------------------
 * Đứng ngay sau `CtaBand` (nấc `dawn`, chỗ sáng nhất trang) nên nó lùi xuống
 * một nấc: dải CTA phải là điểm sáng cuối cùng mắt dừng lại, không phải danh
 * sách link. Vạch chân trời ở mép trên là thứ tách hai khối đó ra.
 *
 * Danh sách link lấy từ registry, không viết tay, để không lệch khi thêm trang.
 *
 * HAI TẦNG, VÀ RANH GIỚI GIỮA CHÚNG LÀ "AI CẦN CÁI NÀY":
 *   · TẦNG TRÊN — thứ người ta ĐỊNH DÙNG: tên hãng, điện thoại, email, và ba
 *     cột link. Bốn cột đều nhau.
 *   · DẢI DƯỚI — thứ người ta chỉ TRA khi cần: pháp nhân, địa chỉ bưu chính,
 *     mã số thuế, bản quyền, link pháp lý. Toàn bộ ở `text-meta` mờ.
 *
 * Trước đây cả hai tầng dồn vào cột đầu: nhãn "Trụ sở" + pháp nhân + địa chỉ
 * ba dòng + điện thoại + email + mã số thuế. Đo ở 1440 thì riêng khối
 * `<address>` cao 225px / 9 dòng, kéo cả hàng cột lên 310px, mà cột đó rộng
 * 2/5 lưới trong khi chữ bị chặn ở `max-w-xs` — tức chừa một khoảng chết
 * ~280px ngay giữa footer. Ở 375 thì footer cao 1407px, gần gấp đôi màn hình.
 *
 * ĐỊA CHỈ VIẾT MỘT DÒNG, KHÔNG PHẢI `whitespace-pre-line`. Xuống dòng cứng
 * bằng `\n` trong messages chỉ đúng với đúng một bề ngang; ở cột 320px nó đẻ
 * ra dòng mồ côi ("Landmark 72 / Tower"), còn ở dải rộng thì phí chỗ. Để chuỗi
 * liền và cho trình duyệt tự ngắt: ở 1440 nó nằm gọn một dòng, ở 375 nó tự
 * xuống dòng theo chỗ có thật.
 *
 * `<address>` CHỈ CÓ MỘT, và nó ở dải dưới — nơi có danh tính bưu chính đầy
 * đủ. Điện thoại và email ở tầng trên là hai LINK hành động, mang nhãn
 * `sr-only` để trình đọc màn hình biết đâu là số đâu là hòm thư.
 * ============================================================================
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
      <span aria-hidden className="pv-horizon -z-10" />

      <div className="pv-container py-16 lg:py-20">
        {/* Không mở footer bằng một câu tuyên ngôn: CtaBand ngay phía trên đã
            nói xong bước tiếp theo. Footer làm việc khác — danh tính pháp nhân,
            đường đi, và điều kiện pháp lý. */}
        {/* Bốn cột ĐỀU NHAU, không còn cột đầu rộng gấp đôi: cột đầu nay chỉ
            giữ tên hãng và hai đường liên hệ, mà cột rộng chứa ít chữ chính là
            cái đẻ ra khoảng chết. Đều nhau cũng cho ba cột link thêm chỗ —
            "Kho tri thức doanh nghiệp" hết phải xuống dòng. */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-ui font-semibold tracking-brand uppercase">
              Pebble Vina
            </span>

            {/* `mt-4` bằng đúng khoảng cách nhãn → link ở ba cột kia, để hai
                đường liên hệ này bắt đầu ngang hàng với dòng link đầu tiên. */}
            <ul className="mt-4 flex flex-col gap-2.5 text-body-sm">
              <li>
                <a
                  href={t("office.phoneHref")}
                  className="text-foreground transition-colors hover:text-brand"
                >
                  <span className="sr-only">{t("phone")}: </span>
                  {t("office.phoneLabel")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${t("office.emailLabel")}`}
                  className="text-foreground transition-colors hover:text-brand"
                >
                  <span className="sr-only">{t("email")}: </span>
                  {t("office.emailLabel")}
                </a>
              </li>
            </ul>
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

        <div className="mt-12 flex flex-col gap-4 border-t pt-6 text-meta text-subtle-foreground">
          {/* Ba mẩu danh tính: dưới `sm` xếp chồng thành ba dòng ngắn, từ `sm`
              nối thành một dòng ngăn bằng dấu chấm giữa. Dấu ngăn `aria-hidden`
              và chỉ hiện khi đã nối dòng — xếp chồng mà còn dấu thì mỗi dòng
              lủng lẳng một chấm.

              `sm:block` chứ KHÔNG phải `sm:flex-row flex-wrap`: là flex thì mỗi
              mẩu là một item nguyên khối, nên mẩu địa chỉ không đủ chỗ sẽ nhảy
              nguyên cụm xuống dòng dưới rồi mới tự ngắt bên trong — đo ở 768
              ra 4 dòng và chừa trống nửa dòng đầu. `block` trả ba mẩu về dạng
              chữ chảy: chúng đổ đầy từng dòng, 768 còn 2 dòng.

              `{" "}` quanh dấu ngăn là khoảng trắng THẬT để dòng có chỗ ngắt.
              Ở chế độ flex (dưới `sm`) các nút chỉ chứa khoảng trắng bị bỏ qua,
              nên chúng không đẻ ra dòng rỗng. */}
          <address className="flex flex-col gap-1 not-italic sm:block">
            <span className="text-muted-foreground">
              {t("office.entity")}
            </span>{" "}
            <Dot />{" "}
            <span>
              <span className="sr-only">{t("address")}: </span>
              {t("office.address")}
            </span>{" "}
            <Dot />{" "}
            <span className="font-mono">{t("office.taxId")}</span>
          </address>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
      </div>
    </footer>
  );
}

/** Dấu ngăn giữa hai mẩu danh tính. Chỉ có mặt khi cả dải đã nối thành dòng. */
function Dot() {
  return (
    <span aria-hidden className="hidden sm:inline">
      ·
    </span>
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
