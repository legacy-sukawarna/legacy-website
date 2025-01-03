import { getBibleVerse } from "@/lib/getBibleVerse";

export async function YearlyVerse({ verseKey }: { verseKey: number }) {
  const verse = await getBibleVerse();

  if (!verse) {
    return (
      <p className="text-red-500">
        Failed to load the verse. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">{verse.text}</p>
      <p className="text-sm text-gray-500">{verse.reference}</p>
    </div>
  );
}
