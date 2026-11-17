"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Info,
  MessageCircleQuestion,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { DEMO_CONTACT } from "@/lib/properties";
import { Reveal } from "@/components/site/reveal";

const SUBJECTS = [
  "Buying a property",
  "Renting a property",
  "Selling or listing with you",
  "Property management",
  "Something else",
];

const FAQS = [
  {
    q: "Are the properties on this website real?",
    a: "No. This is a demonstration website — every listing, price, agent and testimonial is fictional and created purely to showcase the design and user experience.",
  },
  {
    q: "How do I arrange a viewing?",
    a: "On a live site you would call the office line, email the listing agent, or submit the enquiry form on any property page. On this demo, forms simply validate and confirm — nothing is sent.",
  },
  {
    q: "What documents do I need to rent a home in the U.S.?",
    a: "Typically: photo identification, proof of income (often 30–40× the monthly rent in annual earnings), a credit check, and a security deposit of one to two months' rent. A good agent will explain every line item before you commit.",
  },
  {
    q: "Do you charge buyers a fee?",
    a: "On a live agency site, buyer-side fees (where they apply) are always disclosed upfront in writing before any transaction begins. Transparency on fees is non-negotiable.",
  },
];

export function ContactView() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (!values.name.trim()) er.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      er.email = "Please enter a valid email address.";
    if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 7)
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

  const contactCards = [
    {
      icon: Phone,
      title: "Call Us",
      lines: [DEMO_CONTACT.phone],
      note: "Demonstration line — not connected",
    },
    {
      icon: Mail,
      title: "Email Us",
      lines: [DEMO_CONTACT.email],
      note: "Demonstration inbox — not connected",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      lines: [DEMO_CONTACT.address],
      note: "Fictional office address",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-navy pb-16 pt-[112px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-gold">Contact</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-ivory sm:text-4xl">
            We Would Love to <em className="text-gold">Hear From You</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/70">
            Call, email or send the form below — a consultant will respond within one working
            day. Prefer instant answers? The Havenstone concierge chat in the corner of the
            screen is online right now.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="relative z-10 mx-auto -mt-9 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {contactCards.map((c) => (
            <Reveal key={c.title} className="border border-border bg-white p-7">
              <c.icon className="h-6 w-6 text-gold" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-lg text-navy">{c.title}</h2>
              <p className="mt-2 text-sm font-medium text-charcoal/85">{c.lines[0]}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-mute/80">
                <Info className="h-3.5 w-3.5 shrink-0 text-gold/70" aria-hidden="true" />
                {c.note}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + hours */}
      <section className="bg-ivory py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
          <Reveal className="border border-border bg-white p-7 sm:p-10">
            {sent ? (
              <div className="py-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-tint">
                  <CheckCircle2 className="h-8 w-8 text-gold-deep" aria-hidden="true" />
                </span>
                <h2 className="mt-6 font-serif text-2xl text-navy">Message Sent</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-mute">
                  Thank you, {values.name.split(" ")[0]}. Your message has been received — our
                  team would normally reply within one working day.
                </p>
                <p className="mt-2 text-xs text-slate-mute/70">
                  (Demonstration website — no real message was sent and nothing was stored.)
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-7 inline-flex items-center gap-2 border border-navy px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:border-gold hover:text-gold-deep"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow text-gold">Enquiry Form</p>
                <h2 className="mt-2 font-serif text-2xl text-navy sm:text-3xl">
                  Send Us a Message
                </h2>
                <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={submit} noValidate>
                  <div>
                    <label htmlFor="ct-name" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="ct-name"
                      type="text"
                      value={values.name}
                      onChange={set("name")}
                      placeholder="e.g. Michael Thompson"
                      className={inputCls("name")}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="ct-email" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="ct-email"
                      type="email"
                      value={values.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                      className={inputCls("email")}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
                      Phone Number <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="ct-phone"
                      type="tel"
                      value={values.phone}
                      onChange={set("phone")}
                      placeholder="+1 (555) 000-0000"
                      className={inputCls("phone")}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <p className="mt-1.5 text-xs text-destructive">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="ct-subject" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
                      Subject
                    </label>
                    <span className="relative block">
                      <select
                        id="ct-subject"
                        value={values.subject}
                        onChange={set("subject")}
                        className={cn(inputCls("subject"), "appearance-none pr-8")}
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-mute/60"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ct-message" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
                      Your Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="ct-message"
                      rows={6}
                      value={values.message}
                      onChange={set("message")}
                      placeholder="Tell us what you are looking for — area, budget, timeline…"
                      className={cn(inputCls("message"), "h-auto py-3")}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>
                    )}
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
                          Submit Message
                        </>
                      )}
                    </button>
                    <p className="text-xs leading-relaxed text-slate-mute/70">
                      Demonstration form — submissions are not delivered or stored.
                    </p>
                  </div>
                </form>
              </>
            )}
          </Reveal>

          {/* Hours + FAQ */}
          <div className="space-y-6">
            <Reveal delay={100} className="bg-navy p-8 text-ivory">
              <Clock className="h-6 w-6 text-gold" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-xl">Office Hours</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {DEMO_CONTACT.hours.map((h) => (
                  <li
                    key={h.days}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-navy-line/60 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-ivory/80">{h.days}</span>
                    <span className="text-gold">{h.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-ivory/50">
                Viewings outside these hours can be arranged for clients relocating from abroad
                or with demanding schedules.
              </p>
            </Reveal>

            <Reveal delay={160} className="border border-border bg-white p-8">
              <MessageCircleQuestion className="h-6 w-6 text-gold" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-xl text-navy">Frequently Asked</h2>
              <Accordion type="single" collapsible className="mt-4">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-medium text-charcoal hover:text-gold-deep hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-slate-mute">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
