import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-7", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M7 20.5c3.2-6 7.2-9 9-9s5.8 3 9 9"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 13h5.2L16 8.8 18.8 13H24"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Brand({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-heading text-lg tracking-tight",
          inverted ? "text-sidebar-foreground" : "text-foreground",
        )}
      >
        FlipBridge
      </span>
    </span>
  );
}
