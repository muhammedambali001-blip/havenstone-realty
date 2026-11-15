"use client";

import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES, type Route } from "@/lib/router";
import { DEMO_CONTACT } from "@/lib/properties";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.home, match: "home" },
  { label: "Properties", href: ROUTES.properties, match: "properties" },
  { label: "About", href: ROUTES.about, match: "about" },
  { label: "Contact", href: ROUTES.contact, match: "contact" },
];

function BrandMark({ dark }: { dark?: boolean }) {
  return (
    <a href={ROUTES.home} className="flex items-center gap-3 group" aria-label="Havenstone Realty — home">
      <span
        className={cn(
          "relative flex h-10 w-10 items-center justify-center border transition-colors duration-300",
          dark
            ? "border-gold/70 bg-navy"
            : "border-gold/80 bg-white/10 backdrop-blur-sm group-hover:bg-white/20"
        )}
      >
        <span className="font-serif text-xl text-gold leading-none">H</span>
        <span className="absolute -bottom-[3px] -right-[3px] h-2 w-2 rotate-45 bg-gold" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif text-lg tracking-[0.08em]", dark ? "text-ivory" : "text-white")}>
          HAVENSTONE
        </span>
        <span className="eyebrow mt-1 text-[0.6rem] text-gold">Realty · Lagos</span>
      </span>
    </a>
  );
}

export function Navbar({ route }: { route: Route }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // The menu is only "open" for the route it was opened on — navigating
  // anywhere automatically closes it without needing an effect.
  const [openKey, setOpenKey] = useState<string | null>(null);
  const menuOpen = open && openKey === route.key;
  const onHome = route.name === "home";
  const transparent = onHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const activeMatch =
    route.name === "property" ? "properties" : route.name === "home" ? "home" : route.name;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500",
          transparent
            ? "bg-transparent"
            : "bg-navy/95 shadow-[0_10px_40px_-12px_rgba(13,31,43,0.5)] backdrop-blur-md"
        )}
      >
        <nav
          className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <BrandMark />

          <div className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-active={activeMatch === link.match}
                className={cn(
                  "link-underline text-[0.82rem] font-medium uppercase tracking-[0.18em] transition-colors",
                  activeMatch === link.match ? "text-gold" : "text-ivory/80 hover:text-ivory"
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href={ROUTES.contact}
              className="ml-2 inline-flex items-center gap-2 bg-gold px-5 py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-navy transition-all hover:bg-gold-soft"
            >
              Book a Viewing
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setOpen((v) => !v);
              setOpenKey(route.key);
            }}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 top-[76px] z-40 flex flex-col bg-navy transition-all duration-300 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div className="flex flex-1 flex-col justify-center gap-2 px-8">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "border-b border-navy-line py-5 font-serif text-3xl transition-all duration-500",
                activeMatch === link.match ? "text-gold" : "text-ivory",
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={ROUTES.contact}
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex w-fit items-center gap-2 bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-navy"
          >
            Book a Viewing
          </a>
        </div>
        <div className="px-8 pb-10 text-sm text-ivory/60">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gold" /> {DEMO_CONTACT.phone}{" "}
            <span className="text-[0.7rem] uppercase tracking-wider text-ivory/40">(demo line)</span>
          </p>
        </div>
      </div>
    </header>
  );
}
