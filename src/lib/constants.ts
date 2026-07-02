export const SITE_NAME = "Sindh Education Stuff";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const WHATSAPP_NUMBER = "923173949424";
export const CONTACT_PHONE = `+${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "hello@sindheducationstuff.com";
export const DISCLAIMER = "Sindh Education Stuff is an independent educational support platform. We are not officially affiliated with Allama Iqbal Open University or any government institution. All materials are provided for learning, reference, guidance, formatting, and academic support only. Students should prepare and submit their own original work according to university rules.";

export const categoryRoutes = [
  { title: "Assignments", href: "/assignments", icon: "FileText", description: "Writing formats, question breakdowns and submission guidance." },
  { title: "Research 8613", href: "/research-8613", icon: "Search", description: "Topic selection, proposal structure and research support." },
  { title: "Lesson Plans", href: "/lesson-plans", icon: "BookOpen", description: "Practical formats for teaching practice and classroom work." },
  { title: "Field Notes", href: "/field-notes", icon: "NotebookPen", description: "Observation samples and structured field-note guidance." },
  { title: "Guess Papers", href: "/guess-papers", icon: "Lightbulb", description: "Focused preparation material built around course outcomes." },
  { title: "Assignment Dates", href: "/assignment-dates", icon: "CalendarDays", description: "Keep track of important submission schedules." },
  { title: "Tutor Guide", href: "/tutor-guide", icon: "Users", description: "Find, verify and communicate with your assigned tutor." },
  { title: "Blog", href: "/blog", icon: "Newspaper", description: "Clear, practical articles for distance-learning students." }
] as const;

export const programs = ["Matric", "FA", "BA", "B.Ed", "BS", "M.Ed"];
