"use client";

import { useMemo, useRef, useState } from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Building2,
  CalendarDays,
  Tag,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle2,
  Send,
  Loader2,
  ArrowLeft,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/router";
import {
  getAgent,
  getProperty,
  priceLabel,
  similarProperties,
  DEMO_CONTACT,
} from "@/lib/properties";
import { PropertyCard } from "@/components/site/property-card";
import { Reveal } from "@/components/site/reveal";

export function PropertyView({ id }: { id: string }) {
  const property = getProperty(id);
  const [current, setCurrent] = useState(0);
  const formRef = useRef<HTMLDivElement | null>(null);

  const similar = useMemo(
    () => (property ? similarProperties(property) : []),
    [property]
  );

  if (!property) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-ivory px-4 pt-[76px] text-center">
        <h1 className="font-serif text-3xl text-navy">Property not found</h1>
        <p className="mt-3 max-w-md text-sm text-slate-mute">
          This listing may have been sold or the link is incorrect. Explore our current
          portfolio instead.
        </p>
        <a
          href={ROUTES.properties}
          className="mt-8 inline-flex items-center gap-2 bg-gold px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-gold-soft"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to All Properties
        </a>
      </section>
    );
  }

  const p = property;
  const agent = getAgent(p.agentId);

  const nextImage = () => setCurrent((c) => (c + 1) % p.images.length);
  const prevImage = () =>
    setCurrent((c) => (c - 1 + p.images.length) % p.images.length);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const facts = [
    { icon: BedDouble, label: "Bedrooms", value: `${p.bedrooms}` },
    { icon: Bath, label: "Bathrooms", value: `${p.bathrooms}` },
    { icon: Ruler, label: "Floor Area", value: `${p.sizeSqm.toLocaleString()} m²` },
    { icon: Building2, label: "Property Type", value: p.type },
    { icon: CalendarDays, label: "Year Built", value: `${p.yearBuilt}` },
    { icon: Tag, label: "Status", value: p.status },
  ];

  return (
    <>
      {/* Header band */}
      <section className="bg-navy pb-14 pt-[112px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.14em] text-ivory/50">
            <a href={ROUTES.home} className="transition-colors hover:text-gold">
              Home
            </a>
            <span className="mx-2 text-gold/60">/</span>
            <a href={ROUTES.properties} className="transition-colors hover:text-gold">
              Properties
            </a>
            <span className="mx-2 text-gold/60">/</span>
            <span className="text-gold">{p.title}</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
                    p.status === "For Sale" ? "bg-gold text-navy" : "bg-ivory/15 text-ivory"
                  )}
                >
                  {p.status}
                </span>
                <span className="text-[0.68rem] uppercase tracking-[0.14em] text-ivory/60">
                  Ref · HS-{p.id.toUpperCase()}
                </span>
              </div>
              <h1 className="mt-4 max-w-2xl font-serif text-3xl text-ivory sm:text-4xl">
                {p.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-ivory/75">
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                {p.location}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-ivory/55">
                {p.status === "For Rent" ? "Rent per annum" : "Asking price"}
              </p>
              <p className="mt-1 font-serif text-3xl text-gold sm:text-4xl">{priceLabel(p)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-ivory py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="relative overflow-hidden bg-navy">
            <img
              src={p.images[current]}
              alt={`${p.title} — view ${current + 1} of ${p.images.length}`}
              className="aspect-[16/9] w-full object-cover sm:aspect-[2/1]"
            />
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-navy-deep/60 text-ivory backdrop-blur-sm transition-colors hover:bg-gold hover:text-navy"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-navy-deep/60 text-ivory backdrop-blur-sm transition-colors hover:bg-gold hover:text-navy"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-4 right-4 bg-navy-deep/70 px-3 py-1 text-xs tracking-wider text-ivory backdrop-blur-sm">
              {current + 1} / {p.images.length}
            </span>
          </Reveal>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {p.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-pressed={i === current}
                className={cn(
                  "overflow-hidden border-2 transition-all",
                  i === current ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <img src={src} alt="" aria-hidden="true" className="aspect-[4/3] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-ivory pb-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
          {/* Left: description + features + facts */}
          <div>
            <Reveal>
              <p className="font-serif text-xl italic text-gold-deep">“{p.tagline}”</p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {facts.map((f) => (
                  <div key={f.label} className="border border-border bg-white p-4">
                    <f.icon className="h-5 w-5 text-gold" aria-hidden="true" />
                    <p className="mt-2 text-[0.68rem] uppercase tracking-[0.14em] text-slate-mute">
                      {f.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy">{f.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-2xl text-navy">About This Property</h2>
              <div className="gold-rule mt-4" />
              <div className="mt-6 space-y-5">
                {p.description.map((para, i) => (
                  <p key={i} className="text-[0.95rem] leading-[1.85] text-charcoal/85">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-2xl text-navy">Property Features</h2>
              <div className="gold-rule mt-4" />
              <ul className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[0.92rem] text-charcoal/85">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Right: agent card */}
          <div>
            <Reveal className="lg:sticky lg:top-28">
              <div className="bg-navy p-8 text-ivory">
                <p className="eyebrow text-gold">Your Advisor</p>
                <div className="mt-5 flex items-center gap-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-navy-soft font-serif text-lg text-gold">
                    {agent.initials}
                  </span>
                  <div>
                    <p className="font-serif text-xl text-ivory">{agent.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-gold">
                      {agent.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-ivory/70">{agent.bio}</p>
                <div className="mt-6 space-y-3 text-sm">
                  <p className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      {agent.phone}
                      <span className="ml-1.5 text-xs text-ivory/45">(demo)</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span className="break-all">{agent.email}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-gold-soft"
                >
                  Contact Agent
                </button>
                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ivory/50">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" aria-hidden="true" />
                  Demonstration listing — enquiries go nowhere and are never stored. Office line:
                  {DEMO_CONTACT.phone}.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Enquiry form */}
        <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={formRef} className="scroll-mt-28 border border-border bg-white p-7 sm:p-10">
            <EnquiryForm propertyTitle={p.title} agentName={agent.name} />
          </div>
        </div>

        {/* Similar properties */}
        <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow text-gold">Keep Exploring</p>
            <h2 className="mt-3 font-serif text-3xl text-navy">Similar Properties</h2>
            <div className="gold-rule mt-4" />
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <PropertyCard property={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function EnquiryForm({
  propertyTitle,
  agentName,
}: {
  propertyTitle: string;
  agentName: string;
}) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hello ${agentName.split(" ")[0]}, I would like to arrange a viewing for ${propertyTitle}. Please contact me at your earliest convenience.`,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (!values.name.trim()) er.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      er.email = "Please enter a valid email address.";
    const phoneDigits = values.phone.replace(/[^\d+]/g, "");
    if (!values.phone.trim() || phoneDigits.replace(/\D/g, "").length < 7)
      er.phone = "Please enter a valid phone number.";
    if (values.message.trim().length < 10)
      er.message = "Please write a short message (at least 10 characters).";
    return er;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1400);
  };

  const inputCls = (field: string) =>
    cn(
      "h-12 w-full border bg-white px-3.5 text-sm text-charcoal placeholder:text-slate-mute/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40",
      errors[field] ? "border-destructive" : "border-border"
    );

  if (sent) {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-tint">
          <CheckCircle2 className="h-8 w-8 text-gold-deep" aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-serif text-2xl text-navy">Enquiry Received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-mute">
          Thank you, {values.name.split(" ")[0]}. Your enquiry about{" "}
          <span className="font-semibold text-navy">{propertyTitle}</span> has been logged.
          {agentName} would normally respond within one working day.
        </p>
        <p className="mt-2 text-xs text-slate-mute/70">
          (Demonstration website — no real message was sent and nothing was stored.)
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-7 inline-flex items-center gap-2 border border-navy px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:border-gold hover:text-gold-deep"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-gold">Enquire</p>
          <h2 className="mt-2 font-serif text-2xl text-navy sm:text-3xl">
            Arrange a Viewing for {propertyTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-mute">
          Fields marked <span className="text-destructive">*</span> are required
        </p>
      </div>

      <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={submit} noValidate>
        <div>
          <label htmlFor="eq-name" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            id="eq-name"
            type="text"
            value={values.name}
            onChange={set("name")}
            placeholder="e.g. Adaeze Musa"
            className={inputCls("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="eq-email" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
            Email Address <span className="text-destructive">*</span>
          </label>
          <input
            id="eq-email"
            type="email"
            value={values.email}
            onChange={set("email")}
            placeholder="you@example.com"
            className={inputCls("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="eq-phone" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <input
            id="eq-phone"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="+234 8XX XXX XXXX"
            className={inputCls("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="eq-message" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
            Message <span className="text-destructive">*</span>
          </label>
          <textarea
            id="eq-message"
            rows={5}
            value={values.message}
            onChange={set("message")}
            className={cn(inputCls("message"), "h-auto py-3")}
            aria-invalid={!!errors.message}
          />
          {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2.5 bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-gold-deep hover:text-ivory disabled:opacity-70"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit Enquiry
              </>
            )}
          </button>
          <p className="text-xs leading-relaxed text-slate-mute/70">
            Demonstration form — submissions are not delivered or stored.
          </p>
        </div>
      </form>
    </div>
  );
}
