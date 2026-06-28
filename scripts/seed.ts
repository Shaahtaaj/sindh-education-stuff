import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/db";
import { User } from "../src/models/User";
import { Program } from "../src/models/Program";
import { Course } from "../src/models/Course";
import { FAQ } from "../src/models/FAQ";
import { BlogPost } from "../src/models/BlogPost";
import { faqs, posts } from "../src/data/content";

async function seed() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  if (process.env.ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  await connectDB();
  await User.findOneAndUpdate({ email: process.env.ADMIN_EMAIL.toLowerCase() }, {
    name: "Super Administrator", email: process.env.ADMIN_EMAIL.toLowerCase(),
    passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: "super_admin", status: "active"
  }, { upsert: true, new: true });
  const programNames = ["Matric", "FA", "BA", "B.Ed", "BS", "M.Ed"];
  for (const title of programNames) await Program.findOneAndUpdate({ slug: title.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-") }, { title, description: `${title} study resources`, status: "published" }, { upsert: true });
  const bed = await Program.findOne({ title: "B.Ed" });
  for (const [courseCode, courseName] of [["8601","General Methods of Teaching"],["8602","Educational Assessment"],["8604","Teaching Practice"],["8605","Educational Leadership"],["8613","Research Project"]]) {
    await Course.findOneAndUpdate({ programId: bed._id, courseCode }, { courseName, semester: "Spring 2026", creditHours: 3, language: "English", status: "published" }, { upsert: true });
  }
  for (const [order, item] of faqs.entries()) await FAQ.findOneAndUpdate({ question: item.question }, { answer: item.answer, order, status: "published" }, { upsert: true });
  for (const post of posts) await BlogPost.findOneAndUpdate({ slug: post.slug }, { ...post, content: post.excerpt, status: "published" }, { upsert: true });
  console.log("Seed complete.");
  process.exit(0);
}
seed().catch(error => { console.error(error); process.exit(1); });
