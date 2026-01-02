"use client";

import { useState } from "react";
import { Suspense } from "react";
import { YearlyVerse } from "@/components/YearlyVerse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, BookOpen, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function YearlyVersePage() {
  const [verseKey, setVerseKey] = useState(0);
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const regenerateVerse = () => {
    setVerseKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {isGenerating ? (
          <Card className="max-w-2xl w-full mx-auto bg-slate-900/80 border-slate-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-orange-400" />
              </div>
              <CardTitle className="text-2xl text-white">
                Your Verse for {new Date().getFullYear()}
              </CardTitle>
              <CardDescription className="text-slate-400">
                A special word from God just for you, {name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense key={verseKey} fallback={<VerseSkeletonLoader />}>
                <YearlyVerse verseKey={verseKey} name={name} />
              </Suspense>
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={regenerateVerse}
                  variant="outline"
                  className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Get Another Verse
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-md w-full mx-auto text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mb-8">
              <Sparkles className="w-10 h-10 text-orange-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Yearly Bible Verse
            </h1>
            <p className="text-slate-400 mb-8">
              Enter your name and receive a personalized verse to guide you
              through the year
            </p>

            <div className="space-y-4">
              <Input
                placeholder="Enter your name"
                value={name}
                className="w-full bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500 h-12 text-center text-lg"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) {
                    setIsGenerating(true);
                  }
                }}
                required
              />
              <Button
                onClick={() => setIsGenerating(true)}
                disabled={!name.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg disabled:opacity-50"
              >
                Generate Verse
              </Button>
            </div>

            <Link
              href="/"
              className="inline-block mt-8 text-slate-500 hover:text-slate-300 transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function VerseSkeletonLoader() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-full bg-slate-700" />
      <Skeleton className="h-4 w-full bg-slate-700" />
      <Skeleton className="h-4 w-3/4 bg-slate-700" />
      <Skeleton className="h-4 w-1/2 bg-slate-700 mt-4" />
    </div>
  );
}
