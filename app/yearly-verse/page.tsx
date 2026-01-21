import Header from "@/components/Header";
import Footer from "@/components/Footer";
import YearlyVerseContent from "./YearlyVerseContent";

export const metadata = {
  title: "Yearly Bible Verse | Legacy",
  description: "Get your personalized yearly Bible verse",
};

export default function YearlyVersePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <YearlyVerseContent />
      <Footer />
    </div>
  );
}
