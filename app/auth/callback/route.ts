import { createClient } from "@/utils/supabase/server";
import { AuthTokenResponse } from "@supabase/supabase-js";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    try {
      const supabase = createClient();
      const session: AuthTokenResponse =
        await supabase.auth.exchangeCodeForSession(code);
      // Call backend auth callback to create/update user
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
          params: {
            access_token: session?.data.session?.access_token,
            refresh_token: session?.data.session?.refresh_token,
            expires_in: session?.data.session?.expires_in,
            token_type: session?.data.session?.token_type,
          },
        });
      } catch (error: any) {
        // Log error but don't block the auth flow
        // The user can still proceed even if backend callback fails
        console.error(
          "Backend auth callback error:",
          error?.response?.data || error?.message
        );
      }

      // URL to redirect to after sign up process completes
      return NextResponse.redirect(`${origin}/dashboard`);
    } catch (error) {
      console.error(error);
    }
  }
}
