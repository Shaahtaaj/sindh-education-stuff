import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const allowed = new Map([
  ["application/pdf", ".pdf"], ["application/msword", ".doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"],
  ["image/jpeg", ".jpg"], ["image/png", ".png"]
]);

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`upload:${ip}`, 6, 10 * 60_000).allowed) return NextResponse.json({ error: "Too many uploads." }, { status: 429 });
  const data = await req.formData().catch(() => null);
  const file = data?.get("file");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File must be 5 MB or smaller." }, { status: 413 });
  const extension = allowed.get(file.type);
  if (!extension) return NextResponse.json({ error: "Unsupported file type." }, { status: 415 });
  if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Persistent upload storage is not configured." }, { status: 503 });
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
