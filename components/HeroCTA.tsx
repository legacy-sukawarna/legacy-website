"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MapPin } from "lucide-react";
import { usePublicAuth } from "@/providers/public-auth-provider";

interface HeroCTAProps {
  mapsUrl: string;
}

export default function HeroCTA({ mapsUrl }: HeroCTAProps) {
  const { isAuthenticated } = usePublicAuth();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {isAuthenticated ? (
        <Link href="/dashboard">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
          >
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
          >
            Join Us
          </Button>
        </Link>
      )}
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
        <Button
          size="lg"
          variant="outline"
          className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 transition-all hover:scale-105"
        >
          <MapPin className="w-5 h-5 mr-2" />
          Get Directions
        </Button>
      </a>
    </div>
  );
}
