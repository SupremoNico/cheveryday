import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AuthScreen from "@/components/auth/auth-screen";
import LoginLoadingSkeleton from "@/components/auth/login-loading-skeleton";
import { getAuth } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <LoginLoadingSkeleton />
      }
    >
      <RedirectAuthenticatedUser />
    </Suspense>
  );
}

async function RedirectAuthenticatedUser() {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  if (session) {
    redirect("/calendar");
  }

  return <AuthScreen />;
}
