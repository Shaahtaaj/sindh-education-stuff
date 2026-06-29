import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createCloudinaryUploadSignature,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (!await getSession()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`upload-signature:${ip}`, 12, 10 * 60_000).allowed) {
    return NextResponse.json({ error: "Too many upload requests." }, { status: 429 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary credentials are not configured." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null) as { kind?: unknown } | null;
  if (body?.kind !== "document" && body?.kind !== "image") {
    return NextResponse.json({ error: "Invalid upload type." }, { status: 400 });
  }

  const folder = body.kind === "image"
    ? "sindh-education-stuff/thumbnails"
    : "sindh-education-stuff/resources";

  return NextResponse.json({
    ...createCloudinaryUploadSignature(folder),
    resourceType: body.kind === "image" ? "image" : "raw",
  });
}
