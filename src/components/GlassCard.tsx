import clsx from "clsx";
import type { PropsWithChildren } from "react";

interface GlassCardProps extends PropsWithChildren {
  className?: string;
}

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-blush/25 bg-white/5 p-6 shadow-glow backdrop-blur-xl",
        "animate-rise",
        className,
      )}
    >
      {children}
    </div>
  );
}
