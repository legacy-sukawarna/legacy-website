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
import { RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function YearlyVersePage() {
  const [verseKey, setVerseKey] = useState(0);

  const regenerateVerse = () => {
    setVerseKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex-1 w-full flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col w-full px-8 gap-2">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Yearly Bible Verse
        </h1>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Verse of the Year</CardTitle>
            <CardDescription>
              Inspiring words to guide us through the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense key={verseKey} fallback={<VerseSkeletonLoader />}>
              <YearlyVerse verseKey={verseKey} />
            </Suspense>
            <div className="mt-6 flex justify-center">
              <Button onClick={regenerateVerse}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Verse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

function VerseSkeletonLoader() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
