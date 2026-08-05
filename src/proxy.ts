import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next 16: `middleware.ts` đã đổi tên thành `proxy.ts`.
 * Nhiệm vụ duy nhất ở đây: phát hiện locale và gắn tiền tố URL.
 * Không thêm logic khác vào file này.
 */
const handle = createMiddleware(routing);

export default handle;
export const proxy = handle;

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
