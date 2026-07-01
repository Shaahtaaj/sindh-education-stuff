import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const COOKIE_NAME = "admin_token";
const ADMIN_ROLES = new Set(["super_admin","editor","order_manager"]);

type AdminSession = {
  id: string;
  email: string;
  role: string;
};

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AdminSession;

    return ADMIN_ROLES.has(decoded.role) ? decoded : null;
  } catch {
    return null;
  }
}
