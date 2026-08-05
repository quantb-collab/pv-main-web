import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * ============================================================================
 * SOÁT KHOÁ MESSAGES BỊ THIẾU
 * ----------------------------------------------------------------------------
 * Vì sao cần: next-intl KHÔNG làm build fail khi thiếu khoá. Nó chỉ log ra
 * console rồi in nguyên đường dẫn khoá lên trang — ví dụ "home.enterprise.e6"
 * hiện ra giữa một section, trông như lỗi kỹ thuật trước mặt khách hàng.
 *
 * Toàn bộ nội dung site nằm trong JSON, nên một khoá gõ sai là đủ để phát hành
 * một trang hỏng. Script này chạy sau `next build`, quét HTML đã sinh và tìm
 * chuỗi trông giống đường dẫn khoá lọt vào phần chữ hiển thị.
 *
 * Chạy: pnpm check:i18n   (đã gắn vào `pnpm verify`)
 * ============================================================================
 */

const BUILD_DIR = ".next/server/app";

// Namespace cấp cao trong messages/vi.json
const NAMESPACES = [
  "site", "nav", "cta", "footer", "home", "solutions", "useCases",
  "deliver", "technology", "about", "assessment", "contact", "insights",
  "caseStudies", "legal", "stub", "notFound", "track",
];

const KEY_RE = new RegExp(
  `\\b(${NAMESPACES.join("|")})(\\.[a-zA-Z0-9_-]+){1,4}\\b`,
  "g",
);

async function htmlFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Bỏ script, style và mọi thẻ — chỉ giữ chữ người dùng nhìn thấy. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

const files = await htmlFiles(BUILD_DIR);

if (files.length === 0) {
  console.error(
    `Không tìm thấy HTML trong ${BUILD_DIR}. Chạy "pnpm build" trước.`,
  );
  process.exit(1);
}

const problems = [];

for (const file of files) {
  const text = visibleText(await readFile(file, "utf8"));
  const hits = new Set(text.match(KEY_RE) ?? []);
  for (const hit of hits) {
    problems.push({ file: file.replace(`${BUILD_DIR}/`, ""), key: hit });
  }
}

if (problems.length > 0) {
  console.error(`\n✗ Có ${problems.length} khoá messages lọt ra mặt trang:\n`);
  for (const p of problems) {
    console.error(`  ${p.file}\n    → ${p.key}`);
  }
  console.error(
    "\nKhoá này không tồn tại trong messages/vi.json, hoặc bị gõ sai trong component.\n",
  );
  process.exit(1);
}

console.log(`✓ Đã soát ${files.length} trang, không có khoá messages nào bị thiếu.`);
