import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  FileCheck2,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function Hero() {
  return (
    <section className="premium-hero">
      <div className="premium-hero-glow" aria-hidden="true" />
      <div className="container-site premium-hero-grid">
        <div className="premium-hero-copy reveal">
          <h1>
            Study with clarity.
            <br />
            <span>Move forward with confidence.</span>
          </h1>
          <p>
            Find organised AIOU resources, practical research guidance and
            personalised study support—all in one dependable place.
          </p>

          <form action="/search" className="premium-search">
            <label>
              <Search size={20} />
              <span className="sr-only">Search resources</span>
              <input
                name="q"
                placeholder="Search by course, assignment or topic…"
              />
            </label>
            <button>
              Search resources <ArrowRight size={17} />
            </button>
          </form>

          <div className="premium-hero-actions">
            <Link href="/assignments">
              Browse assignments <ArrowRight size={15} />
            </Link>
            <Link href="/portal">Open customer portal</Link>
          </div>

          <div className="premium-trust">
            <span>
              <ShieldCheck size={15} /> Responsible academic support
            </span>
            <span>
              <Check size={15} /> Clearly organised by course
            </span>
          </div>
        </div>

        <div className="premium-hero-visual reveal reveal-delay">
          <div className="premium-visual-orbit orbit-one" aria-hidden="true" />
          <div className="premium-visual-orbit orbit-two" aria-hidden="true" />

          <div className="premium-workspace">
            <div className="premium-workspace-head">
              <div>
                <span>
                  <Sparkles size={14} /> Your study workspace
                </span>
                <h2>Simple, focused, organised.</h2>
              </div>
              <span className="premium-live-dot">Secure</span>
            </div>

            <div className="premium-resource-row">
              <span>
                <BookOpenCheck size={20} />
              </span>
              <div>
                <p>Research guidance</p>
                <strong>Course 8613</strong>
              </div>
              <Link href="/research-8613">
                Open <ArrowRight size={15} />
              </Link>
            </div>

            <div className="premium-resource-row">
              <span>
                <FileText size={20} />
              </span>
              <div>
                <p>Latest materials</p>
                <strong>Assignments &amp; notes</strong>
              </div>
              <Link href="/resources">
                Browse <ArrowRight size={15} />
              </Link>
            </div>

            <div className="premium-request-card">
              <div>
                <span>
                  <FileCheck2 size={18} />
                </span>
                <div>
                  <p>Customer request</p>
                  <strong>Progress stays visible</strong>
                </div>
              </div>
              <div className="premium-request-track">
                <span className="is-done"><Check size={12} /></span>
                <i />
                <span className="is-done">2</span>
                <i />
                <span>3</span>
                <i />
                <span>4</span>
              </div>
              <div className="premium-request-labels">
                <span>Received</span>
                <span>In progress</span>
                <span>Payment</span>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          <div className="premium-float-card">
            <span><Check size={15} /></span>
            <div>
              <strong>Private delivery</strong>
              <p>Your files stay in your account</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
