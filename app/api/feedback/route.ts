import { NextRequest, NextResponse } from "next/server";
import { list, put, head } from "@vercel/blob";

export type FeedbackEntry = {
  rating: number;
  comment?: string;
  timestamp: string;
  userAgent?: string;
  name?: string;
  age?: number;
  dailySavings?: number;
};

const BLOB_NAME = "feedback.json";

async function readFeedback(): Promise<FeedbackEntry[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return (await res.json()) as FeedbackEntry[];
  } catch {
    return [];
  }
}

async function writeFeedback(entries: FeedbackEntry[]): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(entries, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rating, comment, name, age, dailySavings } = body;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const entry: FeedbackEntry = {
      rating,
      comment: typeof comment === "string" ? comment.trim() || undefined : undefined,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || undefined,
      name: typeof name === "string" && name.trim() ? name.trim() : undefined,
      age: typeof age === "number" && age > 0 ? age : undefined,
      dailySavings: typeof dailySavings === "number" && dailySavings > 0 ? dailySavings : undefined,
    };

    const existing = await readFeedback();
    existing.push(entry);
    await writeFeedback(existing);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("key");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await readFeedback();
  return NextResponse.json(entries);
}
