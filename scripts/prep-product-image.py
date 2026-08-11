#!/usr/bin/env python3
"""
============================================================================
CHUẨN BỊ ẢNH CARD THIẾT BỊ CHO KỆ PHẦN CỨNG
----------------------------------------------------------------------------
Công cụ sinh ảnh xuất ra ảnh VUÔNG có nền trong suốt. Kệ phần cứng cần ảnh
16:9. Ba việc phải làm giữa hai đầu đó, và cả ba đều là thứ mắt không bắt được:

  1. GỠ BÓNG ĐỔ BAKE SẴN. Công cụ gần như luôn kèm một vùng bóng mờ dưới vật
     thể kể cả khi prompt đã cấm. Bóng vừa thành vệt xám bẩn trên nền thẻ, vừa
     ăn vào khung alpha nên bước 2 lấy cả bóng làm chủ thể và vật thể bị thu
     nhỏ lệch tâm. Bóng có chữ ký riêng — bán trong suốt VÀ rất tối — nên thân
     máy màu đen (alpha 255) không bị đụng.
  2. ĐỆM VỀ 16:9. Khung ảnh dùng `object-cover`: ảnh sai tỷ lệ bị CẮT chứ
     không co lại, ảnh 1:1 mất 44% chiều cao.
  3. NÉN. Ảnh nguồn nặng không ảnh hưởng người xem (`next/image` mã hoá lại
     sang webp/avif) nhưng nó nằm trong repo mãi mãi.

Script còn ĐO và in ra ba thứ để soát: dung lượng, số pixel bóng đã gỡ, và màu
đèn báo — màu đèn phải thuộc họ màu của dòng chip, không được rơi vào ba màu
trạng thái (#00A260 ok · #E7000B lỗi · #F2A029 cảnh báo). Xem docs/IMAGE-BRIEF.md.

Cần: pip install pillow numpy   (không phải phụ thuộc của app, chỉ của script này)

Dùng:
  python3 scripts/prep-product-image.py <ảnh-nguồn> <tên-file-đích> [<nguồn> <đích> …]
Ví dụ:
  python3 scripts/prep-product-image.py ~/Downloads/cam.png papaya-vision-camera
============================================================================
"""

import os
import sys

import numpy as np
from PIL import Image

# Khổ giao — khớp docs/IMAGE-BRIEF.md §2.1
WIDTH, HEIGHT = 1200, 675

# CÂN THEO DIỆN TÍCH, KHÔNG THEO CHIỀU CAO.
# Cân theo chiều cao thì một cái camera nằm ngang và một cái đồng hồ dựng đứng
# cùng cao 594px — nhưng camera rộng gấp đôi nên nó nặng gấp đôi trên mặt kệ.
# Đo thật ở bộ MINT/PAPAYA: cách cũ cho PAPAYA trung bình 445 000 px² so với
# MINT 351 000, riêng hai tấm nằm ngang chạm trần bề ngang thì hơn 60–77%.
# Mắt đọc "to nhỏ" bằng diện tích, nên chuẩn hoá theo diện tích rồi mới kẹp
# hai chiều. 0.34 là mức chủ dự án chốt sau hai vòng chỉnh (0.42 → 0.34): vật
# thể cần khoảng thở quanh nó, thẻ không phải cái khung ảnh chật.
#
# BỐN HẰNG DƯỚI ĐÂY ĐÈ ĐƯỢC BẰNG BIẾN MÔI TRƯỜNG, và đó là cách chạy cho ảnh
# NHÓM D (card sản phẩm phần mềm, `docs/IMAGE-BRIEF.md` §3). Nhóm D khác nhóm A
# ở hai chỗ: chủ thể là một CỤM ba thiết bị chứ không phải một vật, và khung
# hiển thị to gấp đôi (400px so với 198px) — nên cụm được phép chiếm nhiều diện
# tích hơn, còn hai trần phải nới theo nếu không cụm nằm ngang chạm trần bề
# ngang trước khi đạt chuẩn diện tích. Xem §3.6.
#   PV_SUBJECT_AREA=0.40 PV_MAX_WIDTH=0.86 PV_MAX_HEIGHT=0.82 \
#   PV_OUT_DIR=public/software python3 scripts/prep-product-image.py <nguồn> erp
SUBJECT_AREA = float(os.environ.get("PV_SUBJECT_AREA", "0.34"))
# Hai trần: vật dựng đứng bị chiều cao chặn, vật nằm ngang bị bề ngang chặn.
# Vật chạm trần thì nhỏ hơn chuẩn — đó là giới hạn của khung 16:9, không phải lỗi.
# Hạ trần chiều cao cùng lúc với SUBJECT_AREA, nếu không thì vật dựng đứng
# (aptomat, đồng hồ) đứng yên trong khi cả bộ còn lại nhỏ đi.
SUBJECT_MAX_HEIGHT = float(os.environ.get("PV_MAX_HEIGHT", "0.80"))
SUBJECT_MAX_WIDTH = float(os.environ.get("PV_MAX_WIDTH", "0.78"))
OUT_DIR = os.environ.get("PV_OUT_DIR", "public/hardware")
# Chữ ký của bóng bake: bán trong suốt VÀ rất tối
SHADOW_ALPHA, SHADOW_LUMA = 170, 38


def strip_shadow(im):
    a = np.array(im)
    alpha, rgb = a[..., 3].astype(int), a[..., :3].astype(int)
    # `alpha > 0` là điều kiện BẮT BUỘC: thiếu nó thì mask ôm luôn cả vùng nền
    # vốn đã trong suốt, và con số báo ra thành 700 000 px thay vì 30 000.
    mask = (alpha > 0) & (alpha < SHADOW_ALPHA) & (rgb.max(-1) < SHADOW_LUMA)
    a[..., 3] = np.where(mask, 0, alpha)
    return Image.fromarray(a.astype(np.uint8)), int(mask.sum())


def indicator_colour(im):
    """
    Màu đèn báo. Lấy TOP 5% pixel có chroma cao nhất trong số pixel đục và
    sáng — không lấy trung bình mọi pixel lệch xám, vì mặt kính ống kính và
    vỏ máy ám màu chiếm diện tích lớn hơn đèn hàng chục lần và sẽ kéo kết quả
    về xám, che mất đúng thứ cần soát.
    """
    a = np.array(im)
    rgb, opaque = a[..., :3].astype(int), a[..., 3] > 200
    chroma = rgb.max(-1) - rgb.min(-1)
    cand = opaque & (rgb.max(-1) > 120) & (chroma > 20)
    if not cand.any():
        return None, 0
    cut = np.percentile(chroma[cand], 95)
    led = cand & (chroma >= cut)
    c = rgb[led].mean(0).round().astype(int)
    return "#%02X%02X%02X" % tuple(c), int(led.sum())


def prepare(src, name):
    im = Image.open(src).convert("RGBA")
    im, shadow_px = strip_shadow(im)

    # Khung chủ thể tính SAU khi gỡ bóng, nếu không thì bóng kéo khung rộng ra.
    box = im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()
    if box is None:
        raise SystemExit(f"{src}: ảnh rỗng sau khi gỡ bóng — kiểm tra lại nền trong suốt")
    sub = im.crop(box)

    scale = ((WIDTH * HEIGHT * SUBJECT_AREA) / (sub.width * sub.height)) ** 0.5
    scale = min(
        scale,
        HEIGHT * SUBJECT_MAX_HEIGHT / sub.height,
        WIDTH * SUBJECT_MAX_WIDTH / sub.width,
    )
    w, h = round(sub.width * scale), round(sub.height * scale)
    sub = sub.resize((w, h), Image.LANCZOS)

    canvas = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    canvas.paste(sub, ((WIDTH - w) // 2, (HEIGHT - h) // 2), sub)

    out = os.path.join(OUT_DIR, f"{name}.png")
    canvas.quantize(colors=200, method=Image.FASTOCTREE).save(out, optimize=True)

    led, led_px = indicator_colour(canvas)
    kb = round(os.path.getsize(out) / 1024)
    area = 100 * w * h / (WIDTH * HEIGHT)
    print(
        f"{name:26} {w:>4}×{h:<4} · {area:4.1f}% khung · {kb:>3} KB"
        f" · bóng gỡ {shadow_px:>5} px · đèn {led or '—'}"
    )
    if kb > 250:
        print(f"{'':26} ⚠️  vượt trần 250 KB")


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or len(args) % 2:
        raise SystemExit(__doc__)
    os.makedirs(OUT_DIR, exist_ok=True)
    for src, name in zip(args[::2], args[1::2]):
        prepare(src, name)
