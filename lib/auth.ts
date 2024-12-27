import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function checkAuth(
  redirectTo: "dashboard" | "login" = "dashboard"
) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (redirectTo === "dashboard" && session) {
    redirect("/dashboard");
  }

  if (redirectTo === "login" && !session) {
    redirect("/login");
  }

  return session;
}
