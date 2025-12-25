import { getBibleVerse } from "@/lib/getBibleVerse";

export async function YearlyVerse({
  verseKey,
  name,
}: {
  verseKey: number;
  name: string;
}) {
  const verse = await getBibleVerse();

  if (!verse) {
    return (
      <p className="text-red-500">
        Failed to load the verse. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <p className="text-orange-400 font-medium">Dear {name},</p>
      <p className="text-xl text-white leading-relaxed italic">
        &ldquo;{verse.text}&rdquo;
      </p>
      <p className="text-sm text-slate-400 font-medium">— {verse.reference}</p>
    </div>
  );
}
