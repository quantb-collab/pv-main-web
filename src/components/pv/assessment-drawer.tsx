"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { AssessmentForm } from "@/components/forms/assessment-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * ============================================================================
 * DRAWER KHẢO SÁT — MỘT bản duy nhất cho cả site
 * ----------------------------------------------------------------------------
 * Mọi nút "Đặt lịch khảo sát" / "Điền form khảo sát" ở bất kỳ đâu (CtaBand,
 * hero, header, trang con) đều mở CHÍNH cái drawer này, không phải mỗi chỗ một
 * bản sao. Lý do: form là điểm chuyển đổi duy nhất của site — có hai bản thì
 * sớm muộn chúng lệch nhau, và khi nối CRM sẽ phải nối hai lần.
 *
 * Cách dùng:
 *   1. `<AssessmentDrawerProvider>` bọc một lần ở layout.
 *   2. Chỗ nào cần nút: `<AssessmentDrawerButton>Nhãn</AssessmentDrawerButton>`.
 *   3. Cần mở từ chỗ khác (ví dụ sau một bước wizard): `useAssessmentDrawer()`.
 *
 * ⚠️ Form bên trong VẪN CHƯA gửi đi đâu — xem `assessment-form.tsx`. Drawer chỉ
 * đổi chỗ đặt form, không nối được CRM thay nó.
 *
 * Trang `/ai-assessment` GIỮ NGUYÊN form nhúng thẳng trong trang. Drawer là lối
 * tắt cho người đang đọc dở một trang khác; trang kia vẫn là đích của các link
 * chia sẻ và của kết quả tìm kiếm, nên không được biến thành trang rỗng.
 * ============================================================================
 */

type DrawerApi = { open: () => void; close: () => void };

const AssessmentDrawerContext = createContext<DrawerApi | null>(null);

export function useAssessmentDrawer(): DrawerApi {
  const ctx = useContext(AssessmentDrawerContext);
  if (!ctx) {
    throw new Error(
      "useAssessmentDrawer phải nằm trong <AssessmentDrawerProvider> (đặt ở layout).",
    );
  }
  return ctx;
}

export function AssessmentDrawerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("assessment.form");

  // useMemo giữ identity của api ổn định: nếu không, mọi component dùng hook
  // này sẽ render lại mỗi lần provider render.
  const api = useMemo<DrawerApi>(
    () => ({ open: () => setIsOpen(true), close: () => setIsOpen(false) }),
    [],
  );

  return (
    <AssessmentDrawerContext.Provider value={api}>
      {children}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/*
          Ghi đè bề ngang: bản gốc của shadcn là `sm:max-w-sm` (384px) — đủ cho
          một menu, chật cho form hai bước có textarea. `sm:max-w-lg` cho cặp
          nhãn + ô nhập thở được mà vẫn chừa thấy nền phía sau, để drawer đọc ra
          là một lớp phủ chứ không phải một trang mới.

          `overflow-y-auto`: form bước 2 cao hơn màn hình ở khổ 375px.
        */}
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto sm:max-w-lg"
        >
          <SheetHeader className="gap-3 border-b p-6 lg:p-8">
            <SheetTitle className="font-display text-subhead font-semibold">
              {t("title")}
            </SheetTitle>
            <SheetDescription className="text-body-sm text-muted-foreground">
              {t("lead")}
            </SheetDescription>
          </SheetHeader>

          <div className="p-6 lg:p-8">
            <AssessmentForm bare />
          </div>
        </SheetContent>
      </Sheet>
    </AssessmentDrawerContext.Provider>
  );
}

/**
 * Nút mở drawer. Cùng hình dạng với `CtaButton` (`Button` + mũi tên) nhưng là
 * `<button>` chứ không phải `<a>`: nó không điều hướng đi đâu, và cho nó thành
 * link thì trình duyệt hứa một trang mới mà không có trang nào mở ra.
 */
export function AssessmentDrawerButton({
  children,
  ...props
}: { children: ReactNode } & Omit<
  ComponentProps<typeof Button>,
  "asChild" | "onClick"
>) {
  const { open } = useAssessmentDrawer();
  const handleClick = useCallback(() => open(), [open]);

  return (
    <Button type="button" onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
