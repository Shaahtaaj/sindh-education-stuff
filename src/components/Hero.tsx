import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";

export function Hero() {
  return (
    <section className="home-hero">
      <div className="container-site home-hero-grid">
        <div className="home-hero-copy reveal">
          <h1>
            Clear study resources.
            <br />
            <span>Better learning.</span>
          </h1>
          <p>
            Practical assignments, research guidance and teaching resources for
            distance-learning students.
          </p>
          <form action="/search" className="home-search">
            <label>
              <Search size={20} />
              <span className="sr-only">Search resources</span>
              <input
                name="q"
                placeholder="Search assignments, guides and resources…"
              />
            </label>
            <button>
              Find resources <ArrowRight size={17} />
            </button>
          </form>
          <div className="home-trust-row">
            <span>
              <Check size={15} /> Clearly organised
            </span>
            <span>
              <ShieldCheck size={15} /> Responsible support
            </span>
          </div>
        </div>

        <div className="home-workspace-preview reveal reveal-delay" aria-label="Customer portal preview">
          <div className="home-preview-top">
            <div>
              <p>Customer workspace</p>
              <strong>Everything in one place</strong>
            </div>
            <span>Secure</span>
          </div>
          <div className="home-preview-request">
            <div className="home-preview-request-title">
              <span>
                <FileText size={19} />
              </span>
              <div>
                <strong>Assignment guidance</strong>
                <p>Course 8613 · Request SES-0001</p>
              </div>
              <em>In progress</em>
            </div>
            <div className="home-preview-progress">
              {[1, 2, 3, 4].map((step) => (
                <span key={step} className={step <= 2 ? "is-done" : ""}>
                  {step < 2 ? <Check size={13} /> : step}
                </span>
              ))}
            </div>
            <div className="home-preview-labels">
              <span>Received</span>
              <span>In progress</span>
              <span>Payment</span>
              <span>Delivered</span>
            </div>
          </div>
          <div className="home-preview-bottom">
            <div>
              <Clock3 size={17} />
              <span>
                <strong>Live updates</strong>
                Request progress stays visible
              </span>
            </div>
            <Link href="/portal">
              Open portal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
