import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /* 75 là mặc định của Next và đủ cho ảnh sản phẩm. 90 dành riêng cho ảnh
       chụp GIAO DIỆN ở bản phóng to (`AppShot` → dialog): ở đó người đọc phải
       đọc được chữ 13px trong ảnh, mà chữ nhỏ là thứ hỏng đầu tiên khi nén.
       Next 16 chặn mọi mức không khai ở đây bằng HTTP 400, nên thêm mức mới
       phải sửa cả chỗ này lẫn chỗ dùng. */
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
