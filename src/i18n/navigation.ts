import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Dùng Link/redirect/useRouter TỪ FILE NÀY, không import từ "next/link".
 * Chúng tự gắn tiền tố locale đúng cách.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
