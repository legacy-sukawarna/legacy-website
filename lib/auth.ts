import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function checkAuth(
  redirectTo: "dashboard" | "login" = "dashboard"
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (redirectTo === "dashboard" && user) {
    redirect("/dashboard");
  }

  if (redirectTo === "login" && !user) {
    redirect("/login");
  }

  return user;
}
