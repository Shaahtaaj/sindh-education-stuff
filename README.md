# Sindh Education Stuff

A production-oriented educational support platform for AIOU students, built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB/Mongoose and secure JWT admin authentication.

> Sindh Education Stuff is an independent educational support platform. It is not officially affiliated with Allama Iqbal Open University or any government institution.

## Features

- Responsive public website with resources, course pages, blog, search, assignment dates, FAQs and policy pages
- Responsible paid-support order flow with validation, rate limiting and WhatsApp continuation
- Protected admin dashboard for programs, courses, materials, posts, dates, orders, payments, FAQs, testimonials, site settings, SEO and AdSense settings
- Mongoose models, initial seed script and authenticated API routes
- Per-page metadata, canonical URLs, Open Graph defaults, JSON-LD articles, sitemap and robots rules
- AdSense-safe page structure; no ad code is rendered until explicitly configured
- Security headers, HTTP-only JWT cookie, bcrypt password hashing, Zod validation and input sanitization

## Local installation

1. Install Node.js 20.9 or newer and MongoDB Atlas access.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, and a strong initial admin email/password.
5. Run `npm run seed`.
6. Start development with `npm run dev`.
7. Open `http://localhost:3000`; admin login is at `/admin/login`.

Generate a JWT secret with a password manager or a cryptographically secure command such as `openssl rand -base64 48`. Never commit `.env.local`.

## MongoDB Atlas

1. Create a project and M0-or-better cluster in MongoDB Atlas.
2. Create a database user with a unique strong password.
3. Add only the deployment IPs that require access. For Vercel, Atlas may require broader network access; compensate with a strong least-privilege database user and rotate credentials.
4. Copy the Node.js connection string, replace its credentials, and set it as `MONGODB_URI`.
5. Run the seed command once against the intended database.

## Uploads

The UI validates PDF, DOC, DOCX, JPG, JPEG and PNG files up to 5 MB. Development includes a local `uploads` directory, but serverless deployments must use persistent object storage. Add a signed Cloudinary upload endpoint using the provided Cloudinary environment variables before enabling production file persistence. Never trust the browser alone: validate MIME type, extension, file signature and size on the server.

## Vercel deployment

1. Push the project to a private or public Git repository and import it in Vercel.
2. Add all variables from `.env.example` in Project Settings → Environment Variables.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin without a trailing slash.
4. Deploy, then run `npm run seed` locally with the production `MONGODB_URI` or through a controlled one-time job.
5. Verify `/sitemap.xml`, `/robots.txt`, admin login/logout, form rate limits and the full order workflow.
6. Configure a custom domain, enable Cloudinary persistence, and set actual contact/WhatsApp details before launch.

## Production checklist

- Replace every example contact, social and payment value.
- Use a 32+ character JWT secret and a 12+ character admin password.
- Configure Cloudinary and an email/provider-backed contact delivery path.
- Add distributed rate limiting (for example, managed Redis) because the included memory limiter is per server instance.
- Add consented testimonials only; do not publish invented reviews.
- Review all dates against official AIOU sources and retain the independent-site disclaimer.
- Add AdSense code only after approval. Keep ads away from downloads and excluded from admin, login, order, thank-you and error pages.
- Run `npm run build` before each deployment.

## Data behavior

Admin modules, materials, orders and payments use records created through the application. Development without MongoDB falls back to ignored JSON files under `storage/`; production requires MongoDB so data persists across deployments and server instances. No demonstration rows are inserted into admin screens.
