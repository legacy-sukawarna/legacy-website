import AuthButton from "@/components/AuthButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountSettings from "@/components/AccountSettings";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: session } = await supabase.auth.getSession();

  console.log(session, "session");

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="w-full">
        <div className="py-6 font-bold bg-purple-950 text-center">
          This is a protected page that you can only see as an authenticated
          user
        </div>
        <nav className="w-full flex justify-end  border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-end p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="animate-in flex-1 flex flex-col max-w-4xl px-3 py-5">
        <main className="flex-1 flex flex-col gap-6">
          <AccountSettings />
        </main>
      </div>
    </div>
  );
}
