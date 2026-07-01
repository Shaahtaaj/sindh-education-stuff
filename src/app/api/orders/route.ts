import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/utils";
import { orderSchema } from "@/lib/validations";
import { Order } from "@/models/Order";
import { z } from "zod";

type LocalOrder = Record<string, unknown> & {
  _id: string;
  paymentStatus: "unpaid" | "pending" | "paid" | "refunded";
  orderStatus: "new" | "waiting_for_payment" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const localOrderFile = path.join(process.cwd(), "storage", "orders.json");

async function readLocalOrders(): Promise<LocalOrder[]> {
  try {
    return JSON.parse(await readFile(localOrderFile, "utf8")) as LocalOrder[];
  } catch {
    return [];
  }
}

async function saveLocalOrder(data: Record<string, unknown>) {
  await mkdir(path.dirname(localOrderFile), { recursive: true });
  const orders = await readLocalOrders();
  const now = new Date().toISOString();
  const order: LocalOrder = {
    ...data,
    _id: randomUUID(),
    paymentStatus: "unpaid",
    orderStatus: "new",
    createdAt: now,
    updatedAt: now
  };
  orders.unshift(order);
  await writeFile(localOrderFile, JSON.stringify(orders, null, 2), "utf8");
  return order;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`order:${ip}`, 4, 10 * 60_000).allowed) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check all required fields." }, { status: 400 });
  const clean = Object.fromEntries(Object.entries(parsed.data).map(([key, value]) => [key, typeof value === "string" ? sanitizeText(value) : value]));
  try {
    await connectDB();
    const order = await Order.create(clean);
    return NextResponse.json({ orderId: String(order._id).slice(-8).toUpperCase() }, { status: 201 });
  } catch {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Order service is temporarily unavailable." }, { status: 503 });
    const order = await saveLocalOrder(clean);
    return NextResponse.json({ orderId: order._id.slice(0, 8).toUpperCase(), storage: "local-development" }, { status: 201 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    return NextResponse.json(await Order.find().sort({ createdAt: -1 }).limit(100).lean());
  } catch {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Order service is temporarily unavailable." }, { status: 503 });
    return NextResponse.json((await readLocalOrders()).slice(0, 100));
  }
}

const updateSchema = z.object({
  id: z.string().min(1),
  paymentStatus: z.enum(["unpaid", "pending", "paid", "refunded"]).optional(),
  orderStatus: z.enum(["new", "waiting_for_payment", "in_progress", "completed", "cancelled"]).optional(),
  adminNotes: z.string().max(3000).optional(),
  price: z.number().min(0).optional(),
  deliveryFiles: z.array(z.object({
    name:z.string().min(1).max(200),url:z.string().url().max(1000).optional(),
    publicId:z.string().min(1).max(500).optional(),format:z.string().max(20).optional(),
    resourceType:z.string().max(20).optional(),deliveryType:z.string().max(20).optional()
  }).refine(file=>Boolean(file.publicId||file.url),"Delivery file identifier is required.")).max(20).optional()
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid order update." }, { status: 400 });
  const { id, ...changes } = parsed.data;
  const normalizedChanges = changes.paymentStatus === "paid" && !changes.orderStatus
    ? { ...changes, orderStatus: "in_progress" as const }
    : changes;
  try {
    await connectDB();
    const current=await Order.findById(id).select("price paymentStatus").lean();
    if(!current)return NextResponse.json({error:"Order not found."},{status:404});
    const effectivePrice=normalizedChanges.price??(Number(current.price)||0);
    const effectivePayment=normalizedChanges.paymentStatus??String(current.paymentStatus);
    if((normalizedChanges.orderStatus==="in_progress"||normalizedChanges.orderStatus==="completed")&&effectivePrice>0&&effectivePayment!=="paid"){
      return NextResponse.json({error:"Confirm payment before starting or delivering paid work."},{status:409});
    }
    const update:Record<string,unknown>={$set:normalizedChanges};
    if(normalizedChanges.orderStatus){
      const statusLabels:Record<string,string>={
        new:"Request submitted",waiting_for_payment:"Quote sent — awaiting payment",
        in_progress:"Work started",completed:"Work delivered",cancelled:"Request cancelled"
      };
      update.$push={statusHistory:{status:normalizedChanges.orderStatus,label:statusLabels[normalizedChanges.orderStatus],at:new Date()}};
    }
    const updated = await Order.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!updated) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Order service is temporarily unavailable." }, { status: 503 });
    const orders = await readLocalOrders();
    const index = orders.findIndex(order => order._id === id);
    if (index < 0) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    orders[index] = { ...orders[index], ...normalizedChanges, updatedAt: new Date().toISOString() };
    await writeFile(localOrderFile, JSON.stringify(orders, null, 2), "utf8");
    return NextResponse.json(orders[index]);
  }
}
