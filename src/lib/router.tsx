"use client";

import { useEffect, useState } from "react";

export interface SearchQuery {
  location?: string;
  type?: string;
  status?: string;
  min?: string;
  max?: string;
  beds?: string;
}

export type Route =
  | { name: "home"; key: string }
  | { name: "properties"; query: SearchQuery; key: string }
  | { name: "property"; id: string; key: string }
  | { name: "about"; key: string }
  | { name: "contact"; key: string };

export const ROUTES = {
  home: "#/",
  properties: "#/properties",
  property: (id: string) => `#/property/${id}`,
  about: "#/about",
  contact: "#/contact",
} as const;

export function parseRoute(hash: string): Route {
  const clean = (hash || "#/").replace(/^#/, "");
  const [path, queryString] = clean.split("?");
  const key = clean;

  if (path.startsWith("/properties")) {
    const query: SearchQuery = {};
    if (queryString) {
      for (const pair of queryString.split("&")) {
        const [k, v] = pair.split("=");
        if (!k || v === undefined) continue;
        const decoded = decodeURIComponent(v);
        if (decoded) {
          (query as Record<string, string>)[k] = decoded;
        }
      }
    }
    return { name: "properties", query, key };
  }
  if (path.startsWith("/property/")) {
    const id = path.replace("/property/", "").replace(/\/$/, "");
    return { name: "property", id, key };
  }
  if (path.startsWith("/about")) return { name: "about", key };
  if (path.startsWith("/contact")) return { name: "contact", key };
  return { name: "home", key };
}

export function buildSearchUrl(query: SearchQuery): string {
  const params: string[] = [];
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") {
      params.push(`${k}=${encodeURIComponent(v)}`);
    }
  }
  const qs = params.length ? `?${params.join("&")}` : "";
  return `#/properties${qs}`;
}

/** Subscribes to window.location.hash changes (SPA-safe on SSR). */
export function useHash(): string {
  const [hash, setHash] = useState("#/");

  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash || "#/");
    };
    onChange();
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return hash;
}

export function useRoute(): Route {
  return parseRoute(useHash());
}
