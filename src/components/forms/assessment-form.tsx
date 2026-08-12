"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DUR, EASE } from "@/lib/motion";

/**
 * Biểu mẫu đăng ký đánh giá — hai bước.
 *
 * §23 blueprint cấm form dài ngay lần đầu, nhưng §19 cần đủ thông tin để chấm
 * điểm lead. Cách dung hoà: bước 1 chỉ hỏi thứ tối thiểu để liên hệ được;
 * bước 2 là phần giúp Pebble cử đúng người, và người dùng có thể bỏ qua.
 *
 * ============================================================================
 * VÌ SAO CÁC Ô LÀ CONTROLLED — ĐỪNG TRẢ VỀ `defaultValue`
 * ----------------------------------------------------------------------------
 * Hai bước nằm trong `AnimatePresence mode="wait"` với `key={step}`, nên sang
 * bước 2 là toàn bộ ô của bước 1 bị GỠ KHỎI DOM. `FormData(form)` chỉ đọc được
 * ô đang mounted, nên bản trước gửi đi một phiếu chỉ có năm trường của bước 2
 * và cả năm đều rỗng — tên, email, doanh nghiệp, mô tả bài toán mất sạch.
 * Đo trên trình duyệt thật 2026-08-12: điền đủ bước 1, bấm Tiếp tục, rồi đọc
 * `[...new FormData(f).keys()]` chỉ còn `industry · size · department ·
 * timeline · phone`.
 *
 * Vì vậy nguồn sự thật là `values` trong state, không phải cái DOM. Ô nào cũng
 * đọc và ghi vào đó, và việc dựng lại ô sau khi chuyển bước không mất gì.
 * ============================================================================
 *
 * TRẠNG THÁI GỬI. Bản trước `setSent(true)` ngay tại chỗ, không gọi mạng: người
 * dùng đọc "Đã nhận thông tin" trong khi không có gì rời khỏi trình duyệt. Nay
 * chỉ báo thành công khi `/api/lead` trả 2xx; mọi trường hợp khác hiện lỗi kèm
 * đường lui bằng email và GIỮ NGUYÊN dữ liệu đã điền để bấm gửi lại được.
 */

/* Giá trị rỗng của MỌI trường, và cũng là nơi khai danh sách trường: kiểu suy
   ra từ chính nó nên không có cách nào thêm một ô mà quên khai giá trị đầu. */
const EMPTY = {
  name: "",
  email: "",
  company: "",
  role: "",
  problem: "",
  industry: "",
  size: "",
  department: "",
  timeline: "",
  phone: "",
};

type FieldName = keyof typeof EMPTY;

/* Bước 2 toàn ô chữ một dòng, không ô nào bắt buộc, nên dựng bằng vòng lặp.
   Bước 1 thì mỗi ô một kiểu và một mức bắt buộc khác nhau — viết thẳng ra rõ
   hơn là nhồi ba bảng tra vào một vòng lặp. */
const STEP_2 = [
  "industry",
  "size",
  "department",
  "timeline",
  "phone",
] as const satisfies readonly FieldName[];

type Status = "idle" | "sending" | "sent" | "error";

export function AssessmentForm({
  /**
   * Bỏ viền và padding của chính form. Dùng khi form đã nằm trong một khung có
   * sẵn — cụ thể là drawer khảo sát, nơi `SheetContent` đã là cái khung: giữ
   * viền ở đây thì thành hai lớp hộp lồng nhau.
   */
  bare = false,
}: { bare?: boolean } = {}) {
  const t = useTranslations("assessment.form");
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  /* Ô bẫy bot. Nằm trong state như mọi ô khác để không phải đọc DOM ở chỗ gửi. */
  const [website, setWebsite] = useState("");

  const set = (field: FieldName) => (value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  async function submit() {
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      /* Mất mạng giữa chừng cũng là không gửi được — không có nhánh nào ở đây
         được phép kết thúc bằng "sent". */
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
        className="rounded-xl border bg-surface p-8"
      >
        <h3 className="font-display text-title font-semibold">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-body-sm text-muted-foreground">
          {t("successBody")}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        /* Bước 1 chỉ chuyển bước; trình duyệt đã chặn sẵn nếu ô `required` còn
           trống, vì lúc này chúng vẫn đang mounted. */
        if (step === 1) {
          setStep(2);
          return;
        }
        void submit();
      }}
      className={bare ? undefined : "rounded-xl border p-6 lg:p-8"}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-eyebrow font-medium text-subtle-foreground uppercase">
          {step} / 2
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: DUR.base, ease: EASE.out }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {step === 1 ? (
            <>
              <Field
                id="name"
                label={t("name")}
                required
                value={values.name}
                onValue={set("name")}
              />
              <Field
                id="email"
                label={t("email")}
                type="email"
                required
                value={values.email}
                onValue={set("email")}
              />
              <Field
                id="company"
                label={t("company")}
                required
                value={values.company}
                onValue={set("company")}
              />
              <Field
                id="role"
                label={t("role")}
                value={values.role}
                onValue={set("role")}
              />
              <div className="sm:col-span-2">
                <Label htmlFor="problem" className="mb-2">
                  {t("problem")}
                </Label>
                <Textarea
                  id="problem"
                  name="problem"
                  rows={4}
                  required
                  value={values.problem}
                  onChange={(e) => set("problem")(e.target.value)}
                />
                <p className="mt-2 text-meta text-subtle-foreground">
                  {t("problemHint")}
                </p>
              </div>
            </>
          ) : (
            <>
              {STEP_2.map((field) => (
                <Field
                  key={field}
                  id={field}
                  label={t(field)}
                  type={field === "phone" ? "tel" : "text"}
                  value={values[field]}
                  onValue={set(field)}
                />
              ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bẫy bot. `hidden` chứ không phải đẩy ra ngoài màn hình bằng toạ độ âm:
          ô ẩn bằng `display:none` thì trình đọc màn hình cũng bỏ qua, còn ô nằm
          ngoài khung vẫn bị đọc lên và người dùng bàn phím vẫn tab vào được.
          `tabIndex={-1}` và `autoComplete="off"` là hai lớp chặn phòng khi có
          ai đó gỡ `hidden` đi. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        hidden
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <p className="mt-6 text-meta text-subtle-foreground">
        {t("sensitiveNote")} {t("privacy")}
      </p>

      {/* `role="alert"` để trình đọc màn hình xướng lỗi ngay khi nó xuất hiện —
          người không nhìn thấy màn hình thì không có cách nào khác biết là cú
          bấm vừa rồi hỏng. */}
      {status === "error" ? (
        <p role="alert" className="mt-4 text-body-sm text-warning">
          {t("errorBody", { email: t("errorEmail") })}
        </p>
      ) : null}

      <div className="mt-6 flex gap-3">
        {step === 2 ? (
          <Button
            type="button"
            variant="ghost"
            disabled={status === "sending"}
            onClick={() => setStep(1)}
          >
            {t("back")}
          </Button>
        ) : null}
        <Button type="submit" disabled={status === "sending"}>
          {step === 1
            ? t("next")
            : status === "sending"
              ? t("sending")
              : status === "error"
                ? t("retry")
                : t("submit")}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = false,
  value,
  onValue,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onValue: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onValue(e.target.value)}
      />
    </div>
  );
}
