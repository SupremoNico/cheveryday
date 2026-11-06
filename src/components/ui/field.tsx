import type { ReactNode } from "react";

export default function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <span>{label}</span>
      {children}
    </div>
  );
}
