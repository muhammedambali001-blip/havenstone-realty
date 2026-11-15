"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildSearchUrl, type SearchQuery } from "@/lib/router";
import {
  filterProperties,
  LOCATIONS,
  PROPERTIES,
  PROPERTY_TYPES,
  type Property,
} from "@/lib/properties";
import { PropertyCard } from "@/components/site/property-card";
import { Reveal } from "@/components/site/reveal";

const MIN_OPTIONS = [
  { label: "Min Price", value: "" },
  { label: "₦10M", value: "10000000" },
  { label: "₦25M", value: "25000000" },
  { label: "₦50M", value: "50000000" },
  { label: "₦100M", value: "100000000" },
  { label: "₦200M", value: "200000000" },
  { label: "₦400M", value: "400000000" },
  { label: "₦700M", value: "700000000" },
];

const MAX_OPTIONS = [
  { label: "Max Price", value: "" },
  { label: "₦50M", value: "50000000" },
  { label: "₦100M", value: "100000000" },
  { label: "₦250M", value: "250000000" },
  { label: "₦500M", value: "500000000" },
  { label: "₦1B", value: "1000000000" },
];

const selectCls =
  "h-11 w-full appearance-none border border-border bg-white px-3 pr-8 text-sm text-charcoal focus:border-gold focus:outline-none";

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-mute">
        {label}
      </span>
      <span className="relative block">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
          {children}
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
    </label>
  );
}

const EMPTY_FILTERS = {
  location: "anywhere",
  type: "any",
  status: "any",
  min: "",
  max: "",
  beds: "",
};

export function ListingsView({ query }: { query: SearchQuery }) {
  const initial = useMemo(
    () => ({
      location: query.location ?? "anywhere",
      type: query.type ?? "any",
      status: query.status ?? "any",
      min: query.min ?? "",
      max: query.max ?? "",
      beds: query.beds ?? "",
    }),
    [query.location, query.type, query.status, query.min, query.max, query.beds]
  );

  const [draft, setDraft] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const [searching, setSearching] = useState(false);

  const results: Property[] = useMemo(
    () => filterProperties(PROPERTIES, applied),
    [applied]
  );

  const searchNow = () => {
    setApplied(draft);
    setSearching(true);
    window.setTimeout(() => {
      setSearching(false);
      setApplied(draft);
      window.location.hash = buildSearchUrl({
        location: draft.location,
        type: draft.type,
        status: draft.status,
        min: draft.min,
        max: draft.max,
        beds: draft.beds,
      });
    }, 350);
  };

  const resetAll = () => {
    const cleared = { ...EMPTY_FILTERS };
    setDraft(cleared);
    setApplied(cleared);
    window.location.hash = buildSearchUrl({});
  };

  const update = (field: keyof typeof EMPTY_FILTERS) => (v: string) =>
    setDraft((d) => ({ ...d, [field]: v }));

  const activeChips = [
    applied.location !== "anywhere" && `Location: ${applied.location}`,
    applied.type !== "any" && `Type: ${applied.type}`,
    applied.status !== "any" && applied.status,
    applied.min && `From ₦${Number(applied.min) / 1000000}M`,
    applied.max && `Up to ₦${Number(applied.max) / 1000000000}B`,
    applied.beds && `${applied.beds}+ beds`,
  ].filter(Boolean) as string[];

  return (
    <>
      {/* Page header */}
      <section className="bg-navy pb-16 pt-[112px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-gold">Portfolio</p>
          <h1 className="mt-3 font-serif text-3xl text-ivory sm:text-4xl">
            Properties for <em className="text-gold">Sale &amp; Rent</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/70">
            Browse our current listings across Lagos. For rentals, prices shown are per annum.
            Every property has been inspected and title-verified by our team.
          </p>
        </div>
      </section>

      {/* Filter panel */}
      <section className="relative z-10 mx-auto -mt-9 max-w-7xl px-4 sm:px-6 lg:px-8">
        <form
          className="bg-white p-5 shadow-[0_20px_45px_-20px_rgba(20,43,59,0.35)] sm:p-6"
          role="search"
          aria-label="Filter properties"
          onSubmit={(e) => {
            e.preventDefault();
            searchNow();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            <Select label="Location" value={draft.location} onChange={update("location")}>
              <option value="anywhere">Anywhere in Lagos</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
            <Select label="Property Type" value={draft.type} onChange={update("type")}>
              <option value="any">All types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Select label="Status" value={draft.status} onChange={update("status")}>
              <option value="any">Buy or Rent</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </Select>
            <Select label="Minimum Price" value={draft.min} onChange={update("min")}>
              {MIN_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>
                  {o.label === "Min Price" ? "No minimum" : o.label}
                </option>
              ))}
            </Select>
            <Select label="Maximum Price" value={draft.max} onChange={update("max")}>
              {MAX_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>
                  {o.label === "Max Price" ? "No maximum" : o.label}
                </option>
              ))}
            </Select>
            <Select label="Bedrooms" value={draft.beds} onChange={update("beds")}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}+ beds
                </option>
              ))}
            </Select>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={searching}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-gold px-4 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-navy transition-all hover:bg-gold-deep hover:text-ivory disabled:opacity-70"
              >
                {searching ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/40 border-t-navy" />
                ) : (
                  <Search className="h-4 w-4" aria-hidden="true" />
                )}
                Search
              </button>
              <button
                type="button"
                onClick={resetAll}
                aria-label="Reset filters"
                title="Reset filters"
                className="inline-flex h-11 w-11 items-center justify-center border border-border text-slate-mute transition-colors hover:border-gold hover:text-gold-deep"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Results */}
      <section className="bg-ivory py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-mute" aria-live="polite">
              {searching
                ? "Searching…"
                : `${results.length} ${results.length === 1 ? "property" : "properties"} found`}
              {activeChips.length > 0 && !searching && (
                <span className="ml-2 text-charcoal/60">· filtered by</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 border border-gold/40 bg-gold-tint px-3 py-1 text-xs font-medium text-navy"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {searching ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-ivory-dark" />
                  <div className="mt-4 h-4 w-1/3 bg-ivory-dark" />
                  <div className="mt-2 h-5 w-2/3 bg-ivory-dark" />
                  <div className="mt-2 h-4 w-1/2 bg-ivory-dark" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-14 border border-border bg-white px-6 py-16 text-center">
              <MapPin className="mx-auto h-8 w-8 text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-2xl text-navy">No properties match your filters</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-mute">
                Try widening your price range, choosing a nearby area, or removing the bedrooms
                filter. New listings arrive every week.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-7 inline-flex items-center gap-2 bg-navy px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-navy-soft"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
