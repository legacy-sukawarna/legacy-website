"use server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?message=${error.message}`);
  }

  return redirect("/protected");
};

export const signUp = async (formData: FormData) => {
  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log("SIGN UP ERROR");
    console.log(error);
    return redirect(`/login?message=${error.message}`);
  }
  console.log("SIGN UP DATA");
  console.log(data, error);
  return redirect("/login?message=Check email to continue sign in process");
};

export const signInWithGoogleOAuth = async () => {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || headers().get("origin");
  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithOAuth({
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        prompt: "select_account",
      },
    },
    provider: "google",
  });

  if (error) {
    return redirect(`/login?message=${error.message}`);
  }
  return redirect(data.url);
};

export const handleResetPassword = async () => {
  const supabase = createClient();
  const email = prompt("For which email");
  if (!email) {
    console.error("No valid Email");
    return;
  }
  email.trim();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/password-reset`,
  });
  if (data) alert("Recovery Link sent to " + email);
  if (error) alert("Error while sending password reset link to " + email);
};
