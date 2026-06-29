import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "ADMIN_EMAIL or ADMIN_PASSWORD missing" },
        { status: 500 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Admin already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name: "Admin",
      email,
      passwordHash,
      role: "super_admin",
      status: "active",
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Admin creation failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}