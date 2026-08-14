---
name: pv-handoff
description: Giữ mạch công việc dài hạn của website Pebble Vina qua nhiều phiên làm việc khác nhau — ghi lại vị trí hiện tại, quyết định đã chốt kèm lý do, và bước tiếp theo, để phiên sau bắt tiếp mà không phải dò lại. Dùng skill này ở ĐẦU mỗi phiên (chế độ khôi phục), ở CUỐI mỗi phiên có thay đổi đáng kể, khi context sắp đầy, và khi người dùng nói "handoff", "bàn giao", "tiếp tục từ đâu", "phiên trước làm tới đâu", "tóm tắt để làm tiếp", "lưu trạng thái", "session mới".
---

# Bàn giao giữa các phiên

Dự án này chạy qua nhiều phiên, nhiều người và nhiều agent. Thứ đắt nhất bị mất
giữa hai phiên không phải code — code còn nguyên trên đĩa — mà là **lý do**:
vì sao chọn cách này, đã thử gì và bỏ, đang dở ở đâu, và tại sao một thứ trông
như lỗi lại là cố ý.

## Hai file, hai nhiệm vụ khác nhau

| File | Trả lời | Cách ghi |
|---|---|---|
| `docs/HANDOFF.md` | "Giờ đang ở đâu, làm gì tiếp?" | **Ghi đè** mỗi lần. Luôn dưới một màn hình. |
| `docs/DECISIONS.md` | "Vì sao nó lại như thế này?" | **Chỉ thêm vào cuối.** Không sửa, không xoá mục cũ. |

Tách hai file vì chúng hỏng theo hai cách khác nhau. Trộn chung thì HANDOFF
phình lên tới lúc không ai đọc, và lý do cũ bị đè mất khi cập nhật trạng thái.

---

## Chế độ 1 — KHÔI PHỤC (đầu phiên)

Chạy trước khi động vào bất cứ thứ gì. Đọc theo đúng thứ tự:

1. `docs/HANDOFF.md` — vị trí hiện tại và bước tiếp theo
2. `git log --oneline -10` và `git status --short` — thực tế trên đĩa có khớp
   với HANDOFF không
3. `/track` hoặc `src/content/registry.ts` — trạng thái từng trang và khoảng
   trống nội dung
4. `docs/DECISIONS.md` — chỉ đọc phần liên quan tới việc sắp làm

**Nếu HANDOFF và git lệch nhau, tin git.** File có thể được ghi trước khi phiên
trước bị ngắt giữa chừng. Nói rõ chỗ lệch cho người dùng, đừng tự sửa cho khớp.

Sau khi đọc, **nói ra vị trí hiện tại trước khi làm gì**, gọn trong 5 dòng:

```
Đang ở: <việc đang dở, hoặc "không có việc dở">
Vừa xong: <mốc gần nhất>
Tiếp theo: <hành động cụ thể đầu tiên>
Đang chờ: <quyết định cần người dùng, hoặc "không">
Lệch: <chỗ HANDOFF không khớp git, hoặc "không">
```

Không hỏi lại người dùng những gì HANDOFF đã trả lời. Đó là lý do file tồn tại.

---

## Chế độ 2 — GHI BÀN GIAO (cuối phiên)

Chạy khi: người dùng nói kết thúc/bàn giao · context sắp đầy · vừa xong một mốc
đáng kể · sắp chuyển sang mảng việc khác.

### Bước 1 — Chốt trạng thái trên đĩa

```bash
pnpm verify
git status --short
```

Việc chưa commit thì handoff không có mốc để tham chiếu. Hỏi người dùng có chốt
commit không, và ghi kết quả vào HANDOFF (đã commit hay còn dở).

### Bước 2 — Ghi đè `docs/HANDOFF.md`

Đúng bảy mục, không thêm. **Trần cứng: mỗi mục tối đa 5 gạch đầu dòng, cả file
dưới 60 dòng.** Vượt trần là dấu hiệu đang chép lại thứ `/track`, git hoặc code
đã nói. Mục "Bẫy đã gặp" chỉ giữ bẫy còn có thể vấp lại; bẫy của việc đã xong
hẳn thì bỏ.

```markdown
# Bàn giao — <ngày>

## Đang ở đâu
<2–4 câu. Mảng việc nào đang mở, đã đi tới đâu.>

## Vừa hoàn thành
- <việc + đường dẫn file>

## Đang làm dở
- <việc + file:dòng + đã xong phần nào, còn thiếu phần nào>
(không có thì ghi "Không có việc dở.")

## Bước tiếp theo
1. <hành động cụ thể, bắt đầu bằng động từ, làm được ngay>
2. …

## Đang chờ quyết định
- <câu hỏi + ai trả lời + việc gì bị chặn vì nó>

## Bẫy đã gặp
- <thứ trông như lỗi nhưng là cố ý, hoặc lỗi đã mất công tìm ra>

## Trạng thái kỹ thuật
- Lệnh kiểm tra cuối: `pnpm verify` — <kết quả>
- Commit cuối: <hash + mô tả ngắn>
- Việc chưa commit: <có/không>
```

### Bước 3 — `docs/DECISIONS.md` (thường là KHÔNG cần)

Ghi một mục chỉ khi có **một trong hai** thứ sau, còn lại thì bỏ qua bước này:

- một phương án đã thử rồi bỏ (người sau sẽ thử lại nếu không biết), hoặc
- một con số ĐO ĐƯỢC mà code không nói ra (tỉ lệ tương phản, ngưỡng, ngân sách).

Làm đúng bản thiết kế, đổi chữ, thêm asset, sửa lỗi — **không cần mục nào**.
Mục viết ra mà không có hai thứ trên chỉ là kể lại việc đã làm, mà việc đã làm
thì `git log` nói rồi.

Mỗi mục:

```markdown
## <ngày> — <quyết định, một dòng>
**Bối cảnh:** <vì sao phải quyết>
**Chọn:** <chọn gì>
**Vì:** <lý do thật, gồm cả đánh đổi đã chấp nhận>
**Đã cân nhắc và bỏ:** <phương án khác + vì sao bỏ>
**Đổi lại thì phải sửa:** <file hoặc vùng bị ảnh hưởng>
```

Không sửa mục cũ. Quyết định bị đảo thì thêm mục mới ghi rõ nó thay thế mục nào.

---

## Không ghi những thứ này

Handoff hỏng vì thừa, không vì thiếu. Bỏ ra ngoài:

- **Thứ code đã nói:** cấu trúc thư mục, danh sách file, tên component. Người
  đọc mở repo ra là thấy.
- **Thứ registry đã nói:** trạng thái trang, khoảng trống nội dung, đối tượng,
  CTA. Chỉ dẫn tới `/track`, đừng chép lại — chép là chắc chắn lệch.
- **Thứ git đã nói:** đã sửa file nào. Dùng `git log`.
- **Kể lại quá trình:** "tôi đã thử A rồi B rồi C". Chỉ giữ kết luận và lý do.
- **Nhận xét chung chung:** "cần cải thiện", "nên tối ưu thêm". Không hành động
  được thì không phải bước tiếp theo.

## Luật viết

- Bước tiếp theo phải là **hành động làm được ngay**, không phải chủ đề.
  ❌ "Xử lý phần navigation" · ✅ "Đọc nav từ `inNav` trong registry thay cho
  mảng `NAV` viết cứng ở `site-header.tsx:24`"
- Mọi tham chiếu tới code ghi dạng `file:dòng`.
- Câu hỏi đang chờ phải nêu **ai trả lời** và **việc gì bị chặn**.
- HANDOFF dài quá một màn hình là dấu hiệu đang chép lại thứ nơi khác đã có.
- Viết cho người chưa từng đọc phiên trước, không viết cho chính mình.

## Kiểm lại

- [ ] Người mới đọc HANDOFF có bắt tay làm được ngay không?
- [ ] Mọi bước tiếp theo đều là hành động, không phải chủ đề?
- [ ] Có chép lại thứ `/track`, git hay code đã nói không?
- [ ] Quyết định mới đã vào DECISIONS kèm lý do và phương án bị bỏ chưa?
- [ ] Trạng thái commit ghi đúng thực tế chưa?
