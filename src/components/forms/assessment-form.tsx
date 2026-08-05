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
 * ⚠️ Form hiện CHƯA gửi đi đâu. Cần chốt CRM và endpoint nhận dữ liệu.
 */
export function AssessmentForm() {
  const t = useTranslations("assessment.form");
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.slow, ease: EASE.out }}
        className="rounded-xl border bg-surface p-8"
      >
        <h3 className="font-display text-xl font-medium">{t("successTitle")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("successBody")}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1) {
          setStep(2);
          return;
        }
        // TODO: nối vào CRM khi đã chốt endpoint.
        setSent(true);
      }}
      className="rounded-xl border p-6 lg:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.16em] text-subtle-foreground uppercase">
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
              <Field id="name" label={t("name")} required />
              <Field id="email" label={t("email")} type="email" required />
              <Field id="company" label={t("company")} required />
              <Field id="role" label={t("role")} />
              <div className="sm:col-span-2">
                <Label htmlFor="problem" className="mb-2">
                  {t("problem")}
                </Label>
                <Textarea id="problem" name="problem" rows={4} required />
                <p className="mt-2 text-xs text-subtle-foreground">
                  {t("problemHint")}
                </p>
              </div>
            </>
          ) : (
            <>
              <Field id="industry" label={t("industry")} />
              <Field id="size" label={t("size")} />
              <Field id="department" label={t("department")} />
              <Field id="timeline" label={t("timeline")} />
              <Field id="phone" label={t("phone")} type="tel" />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-xs leading-relaxed text-subtle-foreground">
        {t("sensitiveNote")} {t("privacy")}
      </p>

      <div className="mt-6 flex gap-3">
        {step === 2 ? (
          <Button type="button" variant="ghost" onClick={() => setStep(1)}>
            Quay lại
          </Button>
        ) : null}
        <Button type="submit">
          {step === 1 ? "Tiếp tục" : t("submit")}
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
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <Input id={id} name={id} type={type} required={required} />
    </div>
  );
}
