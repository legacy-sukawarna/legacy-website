import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo";
import YearlyVerseContent from "./YearlyVerseContent";

export const metadata = buildPageMetadata({
  title: "Yearly Bible Verse",
  description: "Get your personal Bible verse for the year from Sukawarna Legacy.",
  path: "/yearly-verse",
});

export default function YearlyVersePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <YearlyVerseContent />
      <Footer />
    </div>
  );
}
