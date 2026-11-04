"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Icon from "@/components/ui/icon";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  async function signOut() {
    setIsPending(true);
    setError(undefined);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError("Could not sign out. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <DropdownMenuItem asChild onSelect={(event) => event.preventDefault()}>
        <button
          className="profile-menu-signout"
          type="button"
          disabled={isPending}
          onClick={signOut}
        >
          <Icon name={isPending ? "loader" : "logout"} size={18} />
          <span>{isPending ? "Signing out..." : "Sign out"}</span>
        </button>
      </DropdownMenuItem>
      {error && (
        <span className="sign-out-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
