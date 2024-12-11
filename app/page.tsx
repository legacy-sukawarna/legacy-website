import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header />

      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold mb-6">Welcome to Legacy</h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Join our community and stay connected with events, services, and more.
        </p>
        <Link href="/login">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
