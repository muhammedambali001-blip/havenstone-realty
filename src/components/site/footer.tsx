"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Info } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/lib/router";
import { DEMO_CONTACT, POPULAR_LOCATIONS } from "@/lib/properties";

const QUICK_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "All Properties", href: ROUTES.properties },
  { label: "About Havenstone", href: ROUTES.about },
  { label: "Contact Us", href: ROUTES.contact },
];

export function Footer() {
  const [newsletter, setNewsletter] = useState("");
  const [sending, setSending] = useState(false);

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletter.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setNewsletter("");
      toast.success("Thank you for subscribing to The Havenstone Journal.");
    }, 900);
  };

  return (
    <footer className="mt-auto bg-navy-deep text-ivory/75">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center border border-gold/70 bg-navy">
                <span className="font-serif text-xl text-gold">H</span>
                <span className="absolute -bottom-[3px] -right-[3px] h-2 w-2 rotate-45 bg-gold" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-lg tracking-[0.08em] text-ivory">HAVENSTONE</span>
                <span className="eyebrow mt-1 text-[0.6rem] text-gold">Realty · United States</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Havenstone Realty curates exceptional homes across America — matching
              discerning clients with residences worthy of their lives, from Manhattan
              penthouses to oceanfront estates in Palm Beach.
            </p>
            <div className="mt-6 flex items-start gap-2 rounded-md border border-gold/25 bg-navy/60 p-3 text-xs leading-relaxed text-ivory/55">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <p>
                <span className="font-semibold text-gold">Demonstration website.</span> All
                properties, prices, people, testimonials and contact details on this site are
                fictional examples created for a design showcase.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="eyebrow text-gold">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-gold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Popular areas */}
          <nav aria-label="Popular areas">
            <h3 className="eyebrow text-gold">Popular Areas</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {POPULAR_LOCATIONS.map((loc) => (
                <li key={loc.area}>
                  <a
                    href={`#/properties?location=${encodeURIComponent(loc.area)}`}
                    className="transition-colors hover:text-gold"
                  >
                    Properties in {loc.area}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + newsletter */}
          <div>
            <h3 className="eyebrow text-gold">Get in Touch</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>{DEMO_CONTACT.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  {DEMO_CONTACT.phone}{" "}
                  <span className="text-xs text-ivory/45">(demonstration line)</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  {DEMO_CONTACT.email}{" "}
                  <span className="block text-xs text-ivory/45">(demonstration inbox)</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  Mon – Fri: 9:00 AM – 6:00 PM ET
                  <span className="block text-xs text-ivory/45">Sat: 10:00 AM – 4:00 PM ET</span>
                </span>
              </li>
            </ul>

            <form onSubmit={subscribe} className="mt-6" noValidate>
              <label htmlFor="newsletter-email" className="text-xs uppercase tracking-[0.2em] text-ivory/50">
                Property insights, monthly
              </label>
              <div className="mt-2 flex">
                <input
                  id="newsletter-email"
                  type="email"
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  placeholder="Your email address"
                  className="h-11 w-full min-w-0 flex-1 border border-navy-line bg-navy px-3 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex h-11 items-center gap-2 bg-gold px-4 text-sm font-semibold text-navy transition-colors hover:bg-gold-soft disabled:opacity-60"
                  aria-label="Subscribe to newsletter"
                >
                  {sending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/40 border-t-navy" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-line/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Havenstone Realty. A fictional agency created for a
            website design demonstration.
          </p>
          <a
            href="https://m-webcraft-studio-1kdt.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gold"
          >
            Designed by M-Webcraft Studio
          </a>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold/70" aria-hidden="true" />
            Luxury Properties · United States
          </p>
        </div>
      </div>
    </footer>
  );
}
