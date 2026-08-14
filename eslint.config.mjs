import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    /* Worktree phụ của Claude Code nằm ở `.claude/worktrees/<tên>/`, và mỗi
       cái mang theo một `.next/` riêng. Mẫu `.next/**` ở trên chỉ khớp thư mục
       `.next` Ở GỐC repo, nên bundle của worktree con lọt vào lint: một lần
       `pnpm verify` ăn hơn 13.000 lỗi từ mã đã build, và người chạy tưởng mình
       vừa làm hỏng repo. Không có gì trong `.claude/` cần lint. */
    ".claude/**",
  ]),
]);

export default eslintConfig;
