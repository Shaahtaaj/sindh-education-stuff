import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/db";
import { User } from "../src/models/User";

async function seed() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  if (process.env.ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  await connectDB();
  await User.findOneAndUpdate({ email: process.env.ADMIN_EMAIL.toLowerCase() }, {
    name: "Super Administrator", email: process.env.ADMIN_EMAIL.toLowerCase(),
    passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: "super_admin", status: "active"
  }, { upsert: true, new: true });
  console.log("Administrator account created. Content collections were left empty.");
  process.exit(0);
}
seed().catch(error => { console.error(error); process.exit(1); });
