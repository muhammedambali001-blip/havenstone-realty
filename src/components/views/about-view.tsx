"use client";

import {
  Target,
  Eye,
  Gem,
  HandHeart,
  ShieldCheck,
  KeyRound,
  Building2,
  TrendingUp,
  Globe2,
  Calculator,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/lib/router";
import { AGENTS } from "@/lib/properties";
import { Reveal } from "@/components/site/reveal";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity First",
    body: "We say what we know, admit what we do not, and never push a client toward a property that does not fit. A reputation built over fifteen years is guarded deal by deal.",
  },
  {
    icon: Gem,
    title: "Quiet Excellence",
    body: "No hype, no pressure. We believe the right home speaks for itself, and our job is simply to present it properly and negotiate fairly.",
  },
  {
    icon: HandHeart,
    title: "Service That Stays",
    body: "From the first viewing to years after handover, our clients know one phone call gets things moving. Most of our business now comes from referrals — proof that it works.",
  },
];

const SERVICES = [
  {
    icon: KeyRound,
    title: "Buying & Acquisition",
    body: "Shortlisting, negotiation, title verification, survey coordination and full closing support for homes across Lagos.",
  },
  {
    icon: Building2,
    title: "Leasing & Rentals",
    body: "Serviced apartments and family homes for individuals, families and corporate tenants — with transparent service-charge breakdowns.",
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    body: "Yield analysis, off-plan opportunities and portfolio guidance for investors building wealth through Lagos real estate.",
  },
  {
    icon: Calculator,
    title: "Valuation & Advisory",
    body: "Independent market valuations for sales, purchases, mortgages and estate planning.",
  },
  {
    icon: Globe2,
    title: "Diaspora Services",
    body: "Live video tours, verified reporting and trusted representatives for Nigerians abroad buying back home.",
  },
  {
    icon: HandHeart,
    title: "Property Management",
    body: "Hands-off ownership: tenant sourcing, rent collection, maintenance and annual reporting for landlords.",
  },
];

const APPROACH = [
  {
    step: "01",
    title: "Listen",
    body: "Every engagement starts with a proper conversation — how you live, what you value, what your budget really is. No assumptions.",
  },
  {
    step: "02",
    title: "Curate",
    body: "We inspect and shortlist on your behalf, then present a tight selection with honest notes on each home's strengths and trade-offs.",
  },
  {
    step: "03",
    title: "Negotiate",
    body: "Our consultants handle price discussions, legal review and paperwork, keeping you informed at every milestone.",
  },
  {
    step: "04",
    title: "Handover",
    body: "We walk the property with you, document its condition, hand over the keys — and stay reachable long after.",
  },
];

export function AboutView() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-deep pb-20 pt-[76px]">
        <img
          src="/images/about.jpg"
          alt="Lagos city skyline"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="hero-overlay absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-gold">About Havenstone</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl">
              Homes Are Personal. <em className="text-gold">So Are We.</em>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ivory/85">
              Havenstone Realty was founded in 2010 on a simple observation: Lagos property was
              full of noise, and buyers deserved quieter, wiser counsel. Fifteen years later, we
              remain a deliberately boutique agency — small enough to know every client, large
              enough to move quickly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal className="border border-border bg-ivory p-10">
            <Target className="h-8 w-8 text-gold" aria-hidden="true" />
            <h2 className="mt-5 font-serif text-2xl text-navy">Our Mission</h2>
            <div className="gold-rule mt-4" />
            <p className="mt-5 text-[0.95rem] leading-[1.85] text-charcoal/85">
              To help every client find a home that genuinely fits their life — and to make the
              journey there transparent, respectful and remarkably calm. We measure success not
              in transactions closed, but in families settled well.
            </p>
          </Reveal>
          <Reveal delay={120} className="border border-border bg-ivory p-10">
            <Eye className="h-8 w-8 text-gold" aria-hidden="true" />
            <h2 className="mt-5 font-serif text-2xl text-navy">Our Vision</h2>
            <div className="gold-rule mt-4" />
            <p className="mt-5 text-[0.95rem] leading-[1.85] text-charcoal/85">
              A Lagos property market where verified listings are the norm, service charges are
              explained upfront, and every buyer — from first renter to billionaire collector —
              is treated with the same care.
            </p>
          </Reveal>
        </div>

        {/* Values */}
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 100}
                className="border-t-2 border-gold/70 bg-navy p-8 text-ivory"
              >
                <v.icon className="h-7 w-7 text-gold" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-navy py-24 text-ivory">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold">How We Work</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              A Calm, Four-Step <em className="text-gold">Approach</em>
            </h2>
            <div className="gold-rule mx-auto mt-5" />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <Reveal key={a.step} delay={i * 100} className="relative border border-navy-line/70 bg-navy-soft/40 p-7">
                <span className="font-serif text-4xl text-gold/50">{a.step}</span>
                <h3 className="mt-3 font-serif text-xl text-ivory">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-ivory py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold">What We Do</p>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Our Services</h2>
            <div className="gold-rule mx-auto mt-5" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-mute">
              One agency for the whole journey — before, during and long after the sale.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.title}
                delay={(i % 3) * 90}
                className="group border border-border bg-white p-8 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_20px_40px_-20px_rgba(20,43,59,0.25)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center bg-gold-tint transition-colors group-hover:bg-gold">
                  <s.icon className="h-6 w-6 text-gold-deep transition-colors group-hover:text-navy" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-lg text-navy">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-mute">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold">The People</p>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Meet Our Advisors</h2>
            <div className="gold-rule mx-auto mt-5" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-mute">
              Four consultants, one standard: your interest first.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {AGENTS.map((a, i) => (
              <Reveal
                key={a.id}
                delay={i * 90}
                className="group border border-border bg-ivory p-8 text-center transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(20,43,59,0.25)]"
              >
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy font-serif text-xl text-gold ring-2 ring-gold/40 ring-offset-2 ring-offset-ivory">
                  {a.initials}
                </span>
                <h3 className="mt-5 font-serif text-lg text-navy">{a.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gold-deep">{a.role}</p>
                <p className="mt-4 text-[0.82rem] leading-relaxed text-slate-mute">{a.bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-xl">
            <h2 className="font-serif text-3xl text-ivory sm:text-4xl">
              Ready to Talk About <em className="text-gold">Your Home?</em>
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ivory/70">
              A fifteen-minute conversation is usually enough for us to understand what you need.
              Reach out — there is no obligation.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <a
              href={ROUTES.contact}
              className="inline-flex items-center gap-2 bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-gold-soft"
            >
              Contact Our Team
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
