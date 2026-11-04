"use client";

export default function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <button
      className="nav-scrim"
      aria-label="Close menu"
      onClick={onClose}
    />
  );
}
