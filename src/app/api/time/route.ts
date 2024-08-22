import {NextResponse} from "next/server";

export async function GET() {
  const now = new Date();
  return NextResponse.json({
    utc: now.toISOString(),
    jtc: now.toLocaleString("ja-JP", {timeZone: "Asia/Tokyo"}),
  });
}
