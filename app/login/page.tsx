"use client";
import { signInWithGoogleOAuth } from "./actions";
import Header from "@/components/Header";

export default async function Login() {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Header />
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        <div className="flex flex-col gap-9 ">
          <button
            onClick={() => signInWithGoogleOAuth()}
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
}
