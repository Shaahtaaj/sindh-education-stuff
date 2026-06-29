import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type AdminSession = {
  id: string;
  email: string;
  role: string;
};

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AdminSession;

    return decoded;
  } catch {
    return null;
  }
}