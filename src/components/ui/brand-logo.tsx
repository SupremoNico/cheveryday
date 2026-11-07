import Image from "next/image";

export default function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      aria-hidden="true"
      width={36}
      height={36}
      className={className}
      priority
    />
  );
}
