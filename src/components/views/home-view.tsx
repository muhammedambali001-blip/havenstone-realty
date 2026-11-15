"use client";

import { useState } from "react";
import {
  MapPin,
  Home as HomeIcon,
  BedDouble,
  Wallet,
  Search,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Compass,
  Handshake,
  Quote,
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSearchUrl, ROUTES } from "@/lib/router";
import {
  LOCATIONS,
  POPULAR_LOCATIONS,
  PROPERTIES,
  PROPERTY_TYPES,
  TESTIMONIALS,
} from "@/lib/properties";
import { PropertyCard } from "@/components/site/property-card";
import { Reveal } from "@/components/site/reveal";

const PRICE_STEPS = [
  { label: "No minimum", value: "" },
  { label: "₦50M", value: "50000000" },
  { label: "₦100M", value: "100000000" },
  { label: "₦150M", value: "150000000" },
  { label: "₦250M", value: "250000000" },
  { label: "₦400M", value: "400000000" },
  { label: "₦700M", value: "700000000" },
];

const PRICE_MAX_STEPS = [
  { label: "No maximum", value: "" },
  { label: "₦100M", value: "100000000" },
  { label: "₦250M", value: "250000000" },
  { label: "₦500M", value: "500000000" },
  { label: "₦750M", value: "750000000" },
  { label: "₦1B", value: "1000000000" },
];

const selectCls =
  "h-12 w-full appearance-none border border-border bg-white px-3 pr-8 text-sm text-charcoal focus:border-gold focus:outline-none disabled:opacity-50";

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
        <Icon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
        {label}
      </span>
      <span className="relative block">
        {children}
        <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-mute/60" aria-hidden="true" />
      </span>
    </label>
  );
}

export function HeroSearch({ className }: { className?: string }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("For Sale");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [beds, setBeds] = useState("");

  const search = () => {
    window.location.hash = buildSearchUrl({
      location: location || "anywhere",
      type: type || "any",
      status: status === "For Sale" ? "For Sale" : status === "For Rent" ? "For Rent" : "any",
      min,
      max,
      beds,
    });
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 bg-white p-5 shadow-[0_30px_60px_-20px_rgba(13,31,43,0.45)] sm:p-6 lg:grid-cols-6",
        className
      )}
      role="search"
      aria-label="Property search"
    >
      {/* Buy / Rent toggle */}
      <div className="col-span-2 flex h-12 items-center border border-border p-1 lg:col-span-1" role="group" aria-label="Buy or rent">
        {(["For Sale", "For Rent"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={cn(
              "h-full flex-1 px-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] transition-colors",
              status === s ? "bg-navy text-ivory" : "text-slate-mute hover:text-navy"
            )}
          >
            {s === "For Sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <Field icon={MapPin} label="Location">
        <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectCls} aria-label="Location">
          <option value="">Anywhere in Lagos</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Field>

      <Field icon={HomeIcon} label="Property Type">
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls} aria-label="Property type">
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <div className="col-span-2 grid grid-cols-2 gap-3 lg:col-span-2">
        <Field icon={Wallet} label="Min Price">
          <select value={min} onChange={(e) => setMin(e.target.value)} className={selectCls} aria-label="Minimum price">
            {PRICE_STEPS.map((s) => (
              <option key={s.label} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field icon={Wallet} label="Max Price">
          <select value={max} onChange={(e) => setMax(e.target.value)} className={selectCls} aria-label="Maximum price">
            {PRICE_MAX_STEPS.map((s) => (
              <option key={s.label} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="col-span-2 grid grid-cols-2 gap-3 lg:col-span-1">
        <Field icon={BedDouble} label="Beds">
          <select value={beds} onChange={(e) => setBeds(e.target.value)} className={selectCls} aria-label="Bedrooms">
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          onClick={search}
          className="inline-flex h-12 items-center justify-center gap-2 bg-gold px-4 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-navy transition-all hover:bg-gold-deep hover:text-ivory"
          aria-label="Search properties"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </button>
      </div>
    </div>
  );
}

const WHY_US = [
  {
    icon: ShieldCheck,
    title: "Verified Properties, Every Time",
    body: "Every home we list is physically inspected and title-checked before it reaches you. What you see on Havenstone is what you find at the gate — no surprises, no hot air.",
  },
  {
    icon: Compass,
    title: "Deep Local Knowledge",
    body: "From flood lines in Ajah to the quietest closes in Old Ikoyi, our advisors live where they sell. We will tell you honestly which street fits your life and budget.",
  },
  {
    icon: KeyRound,
    title: "End-to-End Guidance",
    body: "Negotiation, legal review, survey, handover — one dedicated consultant coordinates everything, so buying or renting feels like a well-run project, not a gamble.",
  },
  {
    icon: Handshake,
    title: "Service Beyond the Keys",
    body: "Our relationship does not end at handover. From renovation contacts to resale strategy, we stay a phone call away for as long as you own your home.",
  },
];

const STATS = [
  { icon: Award, value: "15+", label: "Years in Lagos real estate" },
  { icon: Users, value: "250+", label: "Families successfully placed" },
  { icon: TrendingUp, value: "₦85B+", label: "In completed transactions" },
  { icon: BadgeCheck, value: "98%", label: "Clients who would recommend us" },
];

export function HomeView() {
  const featured = PROPERTIES.filter((p) => p.featured);
  const [tIndex, setTIndex] = useState(0);
  const testimonial = TESTIMONIALS[tIndex];

  const nextTestimonial = () => setTIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prevTestimonial = () =>
    setTIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative">
        <div className="relative min-h-[92vh] overflow-hidden bg-navy-deep pb-40 pt-[76px]">
          <img
            src="/images/hero.jpg"
            alt="Luxury modern residence with a swimming pool at dusk in Lagos"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[calc(92vh-76px)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl">
              <p className="eyebrow text-gold">Lagos · Luxury Properties · Est. 2010</p>
              <h1 className="mt-5 font-serif text-4xl leading-[1.12] text-white sm:text-5xl lg:text-[3.6rem]">
                Find a Place That{" "}
                <em className="text-gold">Feels Like Home.</em>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/85 sm:text-lg">
                Discover exceptional properties across Lagos — from lagoon-view penthouses in
                Ikoyi to garden family duplexes in Lekki. Our advisors walk with you from first
                search to final key handover.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href={ROUTES.properties}
                  className="inline-flex items-center gap-2 bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-all hover:bg-gold-soft"
                >
                  Browse Properties
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={ROUTES.contact}
                  className="inline-flex items-center gap-2 border border-ivory/40 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-all hover:border-gold hover:text-gold"
                >
                  Book a Private Viewing
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Search bar overlapping hero */}
        <div className="relative mx-auto -mt-32 max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal delay={150}>
            <HeroSearch />
          </Reveal>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="bg-ivory py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <s.icon className="mx-auto h-6 w-6 text-gold" aria-hidden="true" />
              <p className="mt-3 font-serif text-4xl text-navy">{s.value}</p>
              <p className="mt-1.5 text-sm text-slate-mute">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold">Curated Portfolio</p>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Featured Residences</h2>
            <div className="gold-rule mx-auto mt-5" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-mute">
              A selection of homes our advisors are most proud to represent this season — each
              one inspected, title-verified and ready for viewing.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 100}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 text-center">
            <a
              href={ROUTES.properties}
              className="inline-flex items-center gap-2 border border-navy px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-all hover:border-gold hover:bg-gold hover:text-navy"
            >
              View All Properties
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-navy py-24 text-ivory">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-gold">Why Choose Havenstone</p>
              <h2 className="mt-3 font-serif text-3xl leading-snug sm:text-4xl">
                The Difference Is in the{" "}
                <em className="text-gold">Details</em>
              </h2>
              <div className="gold-rule mt-5" />
              <p className="mt-6 text-[0.95rem] leading-relaxed text-ivory/75">
                Lagos property moves fast, and trust is the only currency that matters. We built
                Havenstone around a simple promise: honest advice, verified homes and service
                that treats your budget with respect — whether it is ₦12 million or ₦1.2 billion.
              </p>
              <a
                href={ROUTES.about}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-soft"
              >
                More About Our Approach
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {WHY_US.map((w, i) => (
                <Reveal
                  key={w.title}
                  delay={i * 90}
                  className="border border-navy-line/70 bg-navy-soft/40 p-7 transition-colors duration-300 hover:border-gold/50"
                >
                  <w.icon className="h-7 w-7 text-gold" aria-hidden="true" />
                  <h3 className="mt-4 font-serif text-lg text-ivory">{w.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ivory/65">{w.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOCATIONS ============ */}
      <section className="bg-ivory py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold">Where We Operate</p>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Popular Lagos Locations</h2>
            <div className="gold-rule mx-auto mt-5" />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-slate-mute">
              Five districts, five distinct ways to live in Lagos. Explore the neighbourhoods
              our clients love most.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_LOCATIONS.map((loc, i) => {
              const count = PROPERTIES.filter((p) => p.area === loc.area).length;
              return (
                <Reveal
                  key={loc.area}
                  delay={(i % 3) * 90}
                  className={cn(i === 0 && "sm:col-span-2 lg:col-span-1")}
                >
                  <a
                    href={`#/properties?location=${encodeURIComponent(loc.area)}`}
                    className="group relative block h-64 overflow-hidden sm:h-72"
                  >
                    <img
                      src={loc.image}
                      alt={`${loc.area}, Lagos`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/25 to-transparent transition-opacity group-hover:opacity-90"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-2xl text-white">{loc.area}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gold">
                            {count} {count === 1 ? "Listing" : "Listings"}
                          </p>
                        </div>
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-gold/60 text-gold transition-all group-hover:bg-gold group-hover:text-navy">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-ivory/80 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
                        {loc.blurb}
                      </p>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow text-gold">Client Stories</p>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
              What Our Clients <em className="text-gold">Say</em>
            </h2>
            <div className="gold-rule mx-auto mt-5" />
          </Reveal>

          <Reveal delay={120} className="relative mt-12">
            <Quote className="mx-auto h-10 w-10 text-gold/40" aria-hidden="true" />
            <figure className="mt-6 min-h-[190px] sm:min-h-[160px]">
              <blockquote
                key={tIndex}
                className="reveal reveal-visible mx-auto max-w-3xl font-serif text-xl italic leading-relaxed text-charcoal sm:text-2xl"
              >
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy font-serif text-sm text-gold">
                  {testimonial.initials}
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold text-navy">{testimonial.name}</span>
                  <span className="block text-xs text-slate-mute">{testimonial.detail}</span>
                </span>
              </figcaption>
            </figure>

            <div className="mt-8 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="inline-flex h-11 w-11 items-center justify-center border border-border text-navy transition-colors hover:border-gold hover:text-gold-deep"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2" role="tablist" aria-label="Testimonial selector">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    role="tab"
                    aria-selected={i === tIndex}
                    aria-label={`Testimonial from ${t.name}`}
                    onClick={() => setTIndex(i)}
                    className={cn(
                      "h-2 w-2 rotate-45 transition-colors",
                      i === tIndex ? "bg-gold" : "bg-border hover:bg-gold/50"
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="inline-flex h-11 w-11 items-center justify-center border border-border text-navy transition-colors hover:border-gold hover:text-gold-deep"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-6 text-xs text-slate-mute/70">
              Client stories are illustrative examples for this demonstration website.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden">
        <img
          src="/images/cta.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-deep/85" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow text-gold">Begin Your Search</p>
            <h2 className="mt-4 font-serif text-3xl leading-snug text-white sm:text-4xl lg:text-[2.75rem]">
              Let Us Find the Home You <em className="text-gold">Deserve.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ivory/80">
              Tell us how you want to live — our advisors will curate a private shortlist and
              arrange viewings around your schedule.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href={ROUTES.contact}
                className="inline-flex items-center gap-2 bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-all hover:bg-gold-soft"
              >
                Start an Enquiry
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={ROUTES.properties}
                className="inline-flex items-center gap-2 border border-ivory/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-all hover:border-gold hover:text-gold"
              >
                Explore Listings
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
