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
];

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

for (const file of files) {
  const lines = (await readFile(file, "utf8")).split("\n");
  lines.forEach((line, i) => {
    // bỏ qua dòng chú thích
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
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
  });
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

console.log(`✓ Đã soát ${files.length} file, không có giá trị hardcode.`);
