import type { ReactNode } from "react";

export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-5 pb-24 pt-10 md:px-8 md:pb-16 md:pt-14 ${className}`}>
      {children}
    </div>
  );
}
