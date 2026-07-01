import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  FileText,
  GraduationCap,
  UserRoundCheck,
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { getPublicMaterials } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const materials = await getPublicMaterials();
  const latest = materials.slice(0, 4);

  return (
    <>
      <Hero />

      <section className="home-resources reveal">
        <div className="container-site">
          <div className="home-section-heading">
            <div>
              <p>Recently published</p>
              <h2>Latest resources</h2>
              <span>Study material clearly organised by course and category.</span>
            </div>
            <Link href="/resources">
              View all resources <ArrowRight size={17} />
            </Link>
          </div>

          <div className="home-resource-list">
            {latest.length ? (
              latest.map((item) => (
                <article key={item.slug}>
                  <span className="home-resource-icon">
                    <FileText size={21} />
                  </span>
                  <div>
                    <p>
                      {item.courseCode} · {item.category}
                    </p>
                    <h3>
                      <Link href={`/materials/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <span>{item.description}</span>
                  </div>
                  <Link
                    href={`/materials/${item.slug}`}
                    className="home-resource-link"
                    aria-label={`View ${item.title}`}
                  >
                    View resource <ArrowRight size={16} />
                  </Link>
                </article>
              ))
            ) : (
              <p className="py-12 text-sm text-[#667589]">
                No published resources yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="home-support">
        <div className="container-site home-support-grid">
          <article>
            <span>
              <BookOpenCheck size={26} />
            </span>
            <div>
              <h2>Research 8613 guidance</h2>
              <p>
                Understand topic selection, proposal structure, research tools
                and responsible academic practice.
              </p>
              <Link href="/research-8613">
                Explore guidance <ArrowRight size={16} />
              </Link>
            </div>
          </article>
          <article>
            <span>
              <GraduationCap size={27} />
            </span>
            <div>
              <h2>Practical study help</h2>
              <p>
                Get support with formatting, teaching practice, review and
                presenting your work clearly.
              </p>
              <Link href="/order-help">
                Get study help <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="home-portal-cta">
        <div className="container-site">
          <div>
            <span className="home-portal-cta-icon">
              <UserRoundCheck size={27} />
            </span>
            <div>
              <h2>Need personalised support?</h2>
              <p>
                Create a request, receive updates and access delivered files
                from your private customer portal.
              </p>
            </div>
          </div>
          <Link href="/portal">
            Open customer portal <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
