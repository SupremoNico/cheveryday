import Image from "next/image";

export default function UserAvatar({
  user,
  className,
}: {
  user: { name: string; email: string; image?: string | null };
  className: string;
}) {
  const displayName = user.name.trim() || user.email.split("@")[0];
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className={className} aria-hidden="true">
      {user.image ? (
        <Image
          src={user.image}
          alt=""
          width={36}
          height={36}
          unoptimized
        />
      ) : (
        initials
      )}
    </span>
  );
}
