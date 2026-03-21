import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  mounted: boolean;
  visible: boolean;
  message: string;
  type: "success" | "error";
}

export default function Toast({ mounted, visible, message, type }: ToastProps) {
  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-50 flex w-full max-w-xl -translate-x-1/2 justify-center px-4">
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-xl px-5 py-3 text-white shadow-xl transition-all duration-500",
          type === "success" ? "bg-maroon-800" : "bg-red-600",
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"
        )}
      >
        {type === "success" ? (
          <CheckCircle2 className="h-4 w-4 shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0" />
        )}
        <p className="text-sm font-medium text-left w-full">
          {message}
        </p>
      </div>
    </div>
  );
}
