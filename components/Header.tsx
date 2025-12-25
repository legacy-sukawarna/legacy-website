"use client";
import Link from "next/link";
import LegacyLogo from "../public/assets/legacy-logo-white.png";
import { Button } from "./ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function Header() {
  const supabase = createClient();

  return (
    <header className="shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              <Image
                src={LegacyLogo}
                alt="Legacy Logo"
                width={80}
                height={40}
                className="rounded-lg h-10 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="#about"
              className="text-base font-medium hover:text-gray-500"
            >
              About
            </Link>
            <Link
              href="#services"
              className="text-base font-medium hover:text-gray-500"
            >
              Services
            </Link>
            <Link
              href="#events"
              className="text-base font-medium hover:text-gray-500"
            >
              Events
            </Link>
            <Link
              href="/yearly-verse"
              className="text-base font-medium hover:text-gray-500"
            >
              Yearly Verse
            </Link>
          </nav>
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link href="/login">
              <Button variant="outline" className="ml-8">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
