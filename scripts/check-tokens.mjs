import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * ============================================================================
 * SOÁT GIÁ TRỊ HARDCODE
 * ----------------------------------------------------------------------------
 * Luật số 2 của repo: component chỉ dùng token. Luật không có công cụ kiểm tra
 * là luật sẽ bị quên. Script này bắt màu, cỡ chữ, easing và thời lượng viết
 * thẳng vào component thay vì lấy từ globals.css hoặc src/lib/motion.ts.
 *
 * Bỏ qua:
 *   - src/components/ui/**  — shadcn sinh ra, sẽ bị ghi đè khi chạy `add`
 *   - globals.css           — chính là nơi định nghĩa token
 *
 * Chạy: pnpm check:tokens   (đã gắn vào `pnpm verify`)
 * ============================================================================
 */

const ROOTS = ["src/components", "src/app", "src/lib"];
const SKIP = ["src/components/ui", "src/lib/motion.ts"];

const RULES = [
  {
    name: "màu viết thẳng",
    re: /#[0-9a-fA-F]{6}\b|\boklch\(|\brgba?\(/,
    fix: "dùng semantic token: bg-surface, text-muted-foreground, text-brand…",
  },
  {
    name: "thời lượng viết thẳng",
    re: /duration: *[0-9]|duration-\[/,
    fix: "dùng DUR trong src/lib/motion.ts",
  },
  {
    name: "easing viết thẳng",
    re: /cubic-bezier|ease-\[/,
    fix: "dùng EASE trong src/lib/motion.ts",
  },
  {
    // Thang Tailwind mặc định chỉ còn dành cho src/components/ui/ (đã SKIP).
    // Ngoài đó, chữ phải gọi theo vai trò để mọi trang cùng một hệ.
    name: "cỡ chữ viết thẳng",
    re: /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b|\btext-\[[0-9.]/,
    fix: "dùng vai trò trong thang chữ: text-body, text-title, text-eyebrow… (docs/DESIGN-TOKENS.md § Thang chữ)",
  },
  {
    // tracking-brand được phép — nó là token của repo, không phải giá trị Tailwind.
    name: "line-height / tracking viết thẳng",
    re: /\bleading-|\btracking-(tighter|tight|normal|wide|wider|widest|\[)/,
    fix: "vai trò trong thang chữ đã mang sẵn line-height và tracking, không viết thêm",
  },
  {
    // Cỡ chữ đã clamp mượt 375→1440 nên không còn bậc nào để khai.
    name: "bậc breakpoint cho cỡ chữ",
    re: /\b(sm|md|lg|xl):text-(display|headline|subhead|title|lead|body|body-sm|ui|meta|micro|eyebrow)\b/,
    fix: "thang chữ tự co giãn; bỏ tiền tố breakpoint đi",
  },
  {
    // Mốc thứ năm đã gỡ khỏi @theme (0 chỗ dùng). Còn sm/md/lg/xl.
    name: "breakpoint 2xl đã gỡ khỏi từ vựng",
    re: /\b2xl:/,
    fix: "hệ chỉ còn sm · md · lg · xl (docs/DESIGN-TOKENS.md § Thang màn hình)",
  },
];

/**
 * ----------------------------------------------------------------------------
 * BÁNH CÓC
 * ----------------------------------------------------------------------------
 * Hai luật dưới đây có HÀNG TRĂM chỗ vi phạm từ trước khi thang vai trò ra đời
 * (2026-08-17). Bắt fail ngay thì cả repo đứng, mà bỏ qua thì luật chết.
 *
 * Nên chúng chạy theo bánh cóc: đếm, và chỉ fail khi số ĐI LÊN. Mỗi lần đụng
 * vào một file thì chuyển chỗ đó sang tên vai trò rồi HẠ `max` xuống đúng số
 * mới. Số chỉ được đi xuống, không bao giờ đi lên.
 * ----------------------------------------------------------------------------
 */
const RATCHET = [
  {
    name: "khoảng cách viết bằng số",
    re: /-?\b(?:(?:sm|md|lg|xl):)?(?:m[trblxy]?|p[trblxy]?|gap(?:-[xy])?|space-[xy])-(?:px|\d+(?:\.\d+)?)\b/g,
    max: 386,
    fix: "dùng vai trò: mt-stack · gap-column · gap-group · gap-item · gap-tight · py-section",
  },
  {
    name: "bề ngang / chiều cao viết bằng giá trị tuỳ ý",
    re: /\b(?:max-w|min-w|w|max-h|min-h|h|basis|size)-\[[^\]]+\]/g,
    max: 21,
    fix: "dùng vai trò: max-w-lead · max-w-body · max-w-header · max-w-rail",
  },
];

/**
 * ----------------------------------------------------------------------------
 * TÊN TOKEN ĐỤNG CLASS LÕI CỦA TAILWIND
 * ----------------------------------------------------------------------------
 * Tailwind v4 sinh utility theo công thức `<tiền tố>-<khoá>`. Đặt một khoá
 * trùng phần đuôi của một class LÕI thì rule mới đè lên class lõi, và nó đè im
 * lặng: build sạch, lint sạch, TypeScript sạch.
 *
 * Đã trả giá một lần (2026-08-17): `--spacing-block` sinh ra
 * `.inline-block{inline-size:var(--pv-space-block)}`, đè lên chính
 * `.inline-block{display:inline-block}` của Tailwind. Hậu quả: MỌI phần tử
 * `inline-block` trên site bị ép rộng đúng 56px — từ khoá phát sáng trong tiêu
 * đề hero mất luôn dấu cách phía sau. Không công cụ nào trong repo bắt được;
 * chỉ đo pixel mới thấy. Nay có bảng này.
 * ----------------------------------------------------------------------------
 */
const RESERVED = new Set([
  // display: inline-*
  "block", "flex", "grid", "table",
  // giá trị lõi của w-* / h-* / size-* / basis-* / inset-* / translate-*
  "full", "auto", "fit", "min", "max", "screen", "px", "none",
  "dvw", "svw", "lvw", "dvh", "svh", "lvh", "lh",
  // space-x-reverse
  "reverse",
]);

/* Chỉ quét TRONG khối `@theme` — đó là nơi duy nhất Tailwind đăng ký token
   thành utility. `--container-max` ở `:root` chỉ là biến CSS thường,
   `pv-container` đọc nó, và nó KHÔNG sinh ra `max-w-max` nào. */
const cssSrc = await readFile("src/app/globals.css", "utf8");
const themeStart = cssSrc.indexOf("@theme");
let themeSrc = "";
if (themeStart !== -1) {
  let depth = 0;
  for (let i = cssSrc.indexOf("{", themeStart); i < cssSrc.length; i++) {
    if (cssSrc[i] === "{") depth++;
    else if (cssSrc[i] === "}" && --depth === 0) {
      themeSrc = cssSrc.slice(themeStart, i);
      break;
    }
  }
}
const keyed = [...themeSrc.matchAll(/^\s*--(spacing|container)-([a-z0-9-]+)\s*:/gm)];
const clashes = keyed
  .map(([, ns, key]) => ({ ns, key }))
  .filter(({ key }) => RESERVED.has(key));

if (clashes.length) {
  console.error(`\n✗ ${clashes.length} tên token đụng class lõi của Tailwind:\n`);
  for (const c of clashes) {
    console.error(`  --${c.ns}-${c.key}  → sinh ra utility trùng tên một class lõi`);
    console.error(`    Đổi tên khoá. Xem bảng RESERVED trong scripts/check-tokens.mjs.\n`);
  }
  process.exit(1);
}

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (SKIP.some((s) => p.startsWith(s))) continue;
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = (await Promise.all(ROOTS.map(walk))).flat();
const problems = [];
const counts = new Map(RATCHET.map((r) => [r.name, 0]));

for (const file of files) {
  const lines = (await readFile(file, "utf8")).split("\n");
  let prevCode = "";
  lines.forEach((line, i) => {
    // bỏ qua dòng chú thích — kể cả chú thích JSX `{/* … */}`
    if (/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line)) {
      if (line.trim()) prevCode = line;
      return;
    }
    /* CỬA THOÁT. Dòng ngay TRÊN mang `pv-allow:` kèm lý do thì dòng này được
       miễn các luật cứng. Có cửa này vì tồn tại ngoại lệ thật — ví dụ một
       nhãn ĐỔI VAI TRÒ theo khổ màn (nhãn vạch ở mobile → điều hướng chính ở
       desktop), khác hẳn việc đổi cỡ chữ theo khổ mà luật sinh ra để cấm.
       Cửa hẹp có chủ ý: phải viết lý do, và lý do nằm ngay cạnh chỗ vi phạm.
       Bánh cóc thì KHÔNG có cửa này — nó đã là hạn mức rồi. */
    const exempt = /pv-allow:/.test(prevCode);
    if (line.trim()) prevCode = line;
    if (!exempt) {
      for (const rule of RULES) {
        if (rule.re.test(line)) {
          problems.push({
            file,
            line: i + 1,
            rule: rule.name,
            fix: rule.fix,
            text: line.trim().slice(0, 90),
          });
        }
      }
    }
    for (const rule of RATCHET) {
      const hits = line.match(rule.re);
      if (hits) counts.set(rule.name, counts.get(rule.name) + hits.length);
    }
  });
}

let ratchetFailed = false;
for (const rule of RATCHET) {
  const n = counts.get(rule.name);
  if (n > rule.max) {
    ratchetFailed = true;
    console.error(
      `\n✗ [${rule.name}] ${n} chỗ, trần đang là ${rule.max}.\n` +
        `    Bánh cóc chỉ quay một chiều — chỗ mới phải viết bằng tên vai trò.\n` +
        `    → ${rule.fix}`,
    );
  } else if (n < rule.max) {
    console.log(
      `↓ [${rule.name}] còn ${n} chỗ (trần ${rule.max}) — hạ \`max\` xuống ${n} trong scripts/check-tokens.mjs.`,
    );
  }
}

if (problems.length > 0) {
  console.error(`\n✗ Có ${problems.length} chỗ hardcode thay vì dùng token:\n`);
  for (const p of problems) {
    console.error(`  ${p.file}:${p.line}  [${p.rule}]`);
    console.error(`    ${p.text}`);
    console.error(`    → ${p.fix}\n`);
  }
  process.exit(1);
}

if (ratchetFailed) process.exit(1);

console.log(
  `✓ Đã soát ${files.length} file, không có giá trị hardcode.\n` +
    `  Bánh cóc: ` +
    RATCHET.map((r) => `${r.name} ${counts.get(r.name)}/${r.max}`).join(" · "),
);
