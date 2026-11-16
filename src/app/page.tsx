import Link from "next/link";
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ListTodo,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/ui/brand-logo";
import ScrollReveal from "@/components/landing/scroll-reveal";
import FeaturesLink from "@/components/landing/features-link";
import CalendarDemo from "@/components/landing/calendar-demo";
import { getAuth } from "@/lib/auth";

const features = [
  {
    icon: CalendarDays,
    title: "See your time clearly",
    copy: "A calendar that brings your plans and priorities into one calm, clear view.",
  },
  {
    icon: ListTodo,
    title: "Make room for what matters",
    copy: "Keep tasks close to your schedule, so turning intentions into action feels easier.",
  },
  {
    icon: Sparkles,
    title: "Find a rhythm that feels right",
    copy: "Shape your workspace around the way you like to plan, focus, and reset.",
  },
];

export default function Home() {
  return (
    <Suspense fallback={<div className="landing-auth-check" aria-busy="true"><BrandLogo className="landing-logo" /><span className="brand-wordmark">Cheveryday</span></div>}>
      <ResolveHome />
    </Suspense>
  );
}

async function ResolveHome() {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  if (session) {
    redirect("/calendar");
  }

  return <LandingPage />;
}

function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" href="/" aria-label="Cheveryday home">
          <BrandLogo className="landing-logo" />
          <span className="brand-wordmark landing-wordmark">Cheveryday</span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <FeaturesLink className="landing-nav-features" label="Why Cheveryday" />
          <Link href="/login">Sign in</Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy scroll-reveal">
          <div className="landing-eyebrow"><span /> A little more ease, every day</div>
          <h1>Make space for<br /><em>your everyday.</em></h1>
          <p className="landing-intro">
            Your plans, tasks, and time—together in one thoughtful place. Find a rhythm that works for you, one day at a time.
          </p>
          <div className="landing-actions">
            <Link className="landing-primary" href="/login">Start planning <CalendarDays size={16} strokeWidth={1.8} /></Link>
            <FeaturesLink className="landing-text-link" label="Take a look" targetId="demo-preview" />
          </div>
          <div className="landing-note"><CheckCircle2 size={16} /> A calmer way to stay on top of your day</div>
        </div>

          <div className="landing-preview-wrap" aria-label="Preview of the Cheveryday planner">
          <div className="landing-orbit landing-orbit-one" />
          <div className="landing-orbit landing-orbit-two" />
            <div className="landing-preview">
              <aside className="system-sidebar">
                <div className="system-brand"><BrandLogo className="system-logo" /><span className="brand-wordmark">Cheveryday</span></div>
                <small className="system-nav-label">WORKSPACE</small>
                <div className="system-nav-item system-nav-active"><CalendarDays size={14} /> Calendar</div>
                <div className="system-nav-item"><ListTodo size={14} /> My Activities</div>
                <div className="system-nav-item"><span className="system-palette">◒</span> Appearance</div>
                <div className="system-nav-item"><span className="system-gear">⚙</span> Settings</div>
                <div className="system-user"><span>JD</span><div><b>John Doe</b><small>john.doe@example.com</small></div></div>
              </aside>
              <div className="system-workspace">
                <div className="system-header"><div><b>May 2025</b><small>Plan your time and activities</small></div><span className="system-search"><span>⌕</span> Search activities <i>⌘ K</i></span><span className="system-avatar">JD</span></div>
                <div className="system-toolbar"><div><button>Today</button><span>‹</span><span>›</span></div><div className="system-views"><b>Month</b><span>Week</span><span>Day</span></div></div>
                <div className="system-calendar">
                  <div className="system-weekdays">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <span key={day}>{day}</span>)}</div>
                  <div className="system-month-grid">
                    {[...[28, 29, 30], ...Array.from({ length: 31 }, (_, i) => i + 1), 1, 2, 3, 4, 5, 6, 7].slice(0, 35).map((date, index) => <div className={`system-day ${index < 3 || index > 33 ? "system-outside" : ""} ${date === 19 && index > 3 ? "system-today" : ""}`} key={`${date}-${index}`}><span>{date}</span>{[5, 9, 13, 19, 23, 27].includes(date) && index > 3 && <i className={`system-event-dot system-dot-${date % 3}`}>{date === 19 ? "Planning" : date === 23 ? "Focus time" : "Activity"}</i>}{date === 19 && index > 3 && <i className="system-event-dot system-dot-green">Walk & reset</i>}</div>)}
                  </div>
                </div>
                <div className="system-legend"><span><i /> Today</span><span><i /> Selected day</span><small>Tip: Select any date to view its activities</small></div>
              </div>
            </div>
        </div>
      </section>

      <section className="landing-demo-section" id="demo-preview">
        <div className="landing-demo-heading">
          <span className="landing-section-kicker">A closer look</span>
          <h2>Make the calendar <em>your own.</em></h2>
          <p>Choose a date, switch your view, or add an activity. Go ahead and try it.</p>
        </div>
        <CalendarDemo />
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-heading"><span className="landing-section-kicker">A softer approach to getting things done</span><h2>Your life has a lot going on.<br /><em>Your planner can make it simpler.</em></h2><p>Cheveryday brings the pieces of your day together, without adding more noise.</p></div>
        <div className="landing-feature-grid">
          {features.map(({ icon: Icon, title, copy }, index) => <article className="landing-feature scroll-reveal" key={title}><span className={`landing-feature-icon feature-${index}`}><Icon size={21} /></span><span className="landing-feature-number">0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="landing-bottom-cta scroll-reveal"><div><span>One day at a time</span><h2>Let’s make today<br /><em>a little more yours.</em></h2></div><Link className="landing-primary" href="/login">Come on in <ArrowRight size={17} /></Link></section>
      <footer className="landing-footer"><Link className="landing-brand" href="/"><BrandLogo className="landing-logo" /><span className="brand-wordmark landing-wordmark">Cheveryday</span></Link><span>A little more ease, every day.</span><span>© Cheveryday</span></footer>
      <ScrollReveal />
    </main>
  );
}
