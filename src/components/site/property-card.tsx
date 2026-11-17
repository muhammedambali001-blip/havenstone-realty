"use client";

import { BedDouble, Bath, MapPin, Ruler, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/router";
import { priceLabel, type Property } from "@/lib/properties";

export function PropertyCard({ property, className }: { property: Property; className?: string }) {
  const p = property;
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden bg-white shadow-[0_2px_20px_-8px_rgba(20,43,59,0.15)] ring-1 ring-border transition-all duration-500 hover:shadow-[0_24px_50px_-16px_rgba(20,43,59,0.35)] hover:ring-gold/40",
        className
      )}
    >
      <a
        href={ROUTES.property(p.id)}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={`View ${p.title}`}
      >
        <img
          src={p.images[0]}
          alt={`${p.title} — ${p.type} in ${p.location}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span
          className={cn(
            "absolute left-4 top-4 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
            p.status === "For Sale" ? "bg-gold text-navy" : "bg-navy/90 text-ivory"
          )}
        >
          {p.status}
        </span>
        <span className="absolute inset-x-0 bottom-0 h-1 w-0 bg-gold transition-all duration-500 group-hover:w-full" />
      </a>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-serif text-xl text-gold-deep">{priceLabel(p)}</p>
        <h3 className="mt-2 font-serif text-lg text-navy">
          <a href={ROUTES.property(p.id)} className="transition-colors hover:text-gold-deep">
            {p.title}
          </a>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-mute">
          <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
          {p.location}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-4 text-[0.8rem] text-charcoal/80">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-gold" aria-hidden="true" /> {p.bedrooms} Beds
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-gold" aria-hidden="true" /> {p.bathrooms} Baths
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-gold" aria-hidden="true" /> {p.sizeSqft.toLocaleString()} sq ft
          </span>
        </div>
        <p className="mt-2 text-[0.78rem] uppercase tracking-[0.12em] text-slate-mute/80">{p.type}</p>

        <a
          href={ROUTES.property(p.id)}
          className="mt-5 inline-flex items-center gap-2 self-start text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-navy transition-colors hover:text-gold-deep"
        >
          View Property
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
