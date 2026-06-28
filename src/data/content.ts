export type Material = {
  title: string; slug: string; courseCode: string; courseName: string; program: string;
  category: string; type: string; excerpt: string; isFree: boolean; price?: number;
  updatedAt: string; downloads: number; tags: string[];
};

export const materials: Material[] = [
  { title: "8601 Assignment Writing Guide", slug: "8601-assignment-writing-guide", courseCode: "8601", courseName: "General Methods of Teaching", program: "B.Ed", category: "Assignments", type: "assignment", excerpt: "A clear structure for introductions, headings, references and original answers.", isFree: true, updatedAt: "2026-06-24", downloads: 1284, tags: ["8601", "assignment", "B.Ed"] },
  { title: "Research 8613 Proposal Roadmap", slug: "research-8613-proposal-roadmap", courseCode: "8613", courseName: "Research Project", program: "B.Ed", category: "Research 8613", type: "research", excerpt: "Move from topic selection to tools, methodology and a defensible proposal.", isFree: true, updatedAt: "2026-06-22", downloads: 946, tags: ["8613", "research", "proposal"] },
  { title: "8602 Lesson Plan Format", slug: "8602-lesson-plan-format", courseCode: "8602", courseName: "Educational Assessment", program: "B.Ed", category: "Lesson Plans", type: "lesson_plan", excerpt: "A practical lesson-plan template with objectives, activity and assessment.", isFree: true, updatedAt: "2026-06-19", downloads: 714, tags: ["8602", "lesson plan"] },
  { title: "Teaching Practice Field Notes Pack", slug: "teaching-practice-field-notes-pack", courseCode: "8604", courseName: "Teaching Practice", program: "B.Ed", category: "Field Notes", type: "field_note", excerpt: "Observation prompts and formatting support for school visits.", isFree: false, price: 850, updatedAt: "2026-06-17", downloads: 382, tags: ["8604", "field notes"] },
  { title: "8605 Exam Preparation Guide", slug: "8605-exam-preparation-guide", courseCode: "8605", courseName: "Educational Leadership", program: "M.Ed", category: "Guess Papers", type: "guess_paper", excerpt: "Topic-focused revision prompts for structured exam preparation.", isFree: true, updatedAt: "2026-06-14", downloads: 603, tags: ["8605", "exam"] },
  { title: "Assignment Formatting Checklist", slug: "assignment-formatting-checklist", courseCode: "General", courseName: "All Programs", program: "All", category: "Tutor Guide", type: "guide", excerpt: "A final review checklist for clean, readable and original submissions.", isFree: true, updatedAt: "2026-06-10", downloads: 1540, tags: ["formatting", "checklist"] }
];

export const posts = [
  { title: "How to Write Better AIOU Assignment Answers", slug: "how-to-write-better-aiou-assignment-answers", category: "Assignments", excerpt: "A practical process for understanding questions, organizing evidence and writing in your own words.", date: "2026-06-25", readTime: "7 min read", author: "Editorial Team" },
  { title: "Choosing a Manageable Topic for Research 8613", slug: "choosing-topic-research-8613", category: "Research", excerpt: "Use access, scope and evidence—not novelty alone—to select a workable classroom research topic.", date: "2026-06-20", readTime: "8 min read", author: "Academic Support Team" },
  { title: "Teaching Practice: From Observation to Reflection", slug: "teaching-practice-observation-reflection", category: "Teaching Practice", excerpt: "Turn daily classroom observations into concise, useful reflective notes.", date: "2026-06-15", readTime: "6 min read", author: "Editorial Team" }
];

export const faqs = [
  { question: "Is Sindh Education Stuff an official AIOU website?", answer: "No. We are an independent educational support platform and are not affiliated with AIOU or any government institution." },
  { question: "Are the learning resources free?", answer: "Many guides and templates are free. Paid services are clearly marked and provide formatting or academic-support assistance." },
  { question: "Can you write and submit my assignment for me?", answer: "No. Our material supports learning, planning and formatting. Students must prepare and submit their own original work under university rules." },
  { question: "How do I order formatting help?", answer: "Complete the Order Help form with your course and deadline. You will receive an order reference and can continue the conversation on WhatsApp." },
  { question: "How are uploaded files handled?", answer: "Files are used only to respond to the requested service. Uploads are validated by file type and size and should not contain unnecessary sensitive information." }
];

export const assignmentDates = [
  { program: "B.Ed", semester: "Spring 2026", assignment: "Assignment 1", dueDate: "2026-08-18", status: "Upcoming" },
  { program: "B.Ed", semester: "Spring 2026", assignment: "Assignment 2", dueDate: "2026-10-02", status: "Upcoming" },
  { program: "BA", semester: "Spring 2026", assignment: "Assignment 1", dueDate: "2026-08-10", status: "Upcoming" },
  { program: "FA", semester: "Spring 2026", assignment: "Assignment 1", dueDate: "2026-08-06", status: "Upcoming" }
];
