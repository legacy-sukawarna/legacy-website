import { NextResponse } from "next/server";
import { getChannelVideos } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "5", 10), 12);

  const videos = await getChannelVideos(limit);
  return NextResponse.json(videos);
}
