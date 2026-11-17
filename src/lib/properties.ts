export interface Agent {
  id: string;
  name: string;
  role: string;
  initials: string;
  phone: string;
  email: string;
  bio: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  area: string;
  price: number;
  status: "For Sale" | "For Rent";
  type: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  yearBuilt: number;
  tagline: string;
  description: string[];
  features: string[];
  images: string[];
  agentId: string;
  featured: boolean;
}

export const AGENTS: Agent[] = [
  {
    id: "alexandra",
    name: "Alexandra Hayes",
    role: "Luxury Portfolio Advisor",
    initials: "AH",
    phone: "+1 (212) 555-0148",
    email: "alexandra@havenstone.com",
    bio: "Alexandra advises private clients on Manhattan's and Palm Beach's most distinguished residences, with a decade of experience in premium American property.",
  },
  {
    id: "marcus",
    name: "Marcus Bennett",
    role: "Senior Property Consultant",
    initials: "MB",
    phone: "+1 (310) 555-0163",
    email: "marcus@havenstone.com",
    bio: "Marcus specializes in Los Angeles' family estates and architectural new builds, guiding buyers from first viewing to final closing.",
  },
  {
    id: "sophia",
    name: "Sophia Delgado",
    role: "Head of Sales",
    initials: "SD",
    phone: "+1 (305) 555-0174",
    email: "sophia@havenstone.com",
    bio: "Sophia leads our sales team and oversees valuation, negotiation and closing for every Havenstone transaction across Florida's waterfront markets.",
  },
  {
    id: "ethan",
    name: "Ethan Caldwell",
    role: "Client Relations Manager",
    initials: "EC",
    phone: "+1 (970) 555-0119",
    email: "ethan@havenstone.com",
    bio: "Ethan looks after our clients long after keys are handed over — from mountain retreats to resale strategy.",
  },
];

export const LOCATIONS = [
  "New York",
  "Los Angeles",
  "Miami",
  "Palm Beach",
  "Aspen",
] as const;

export const PROPERTY_TYPES = [
  "Estate",
  "Villa",
  "Penthouse",
  "Townhouse",
  "Condominium",
  "Mansion",
  "Chalet",
] as const;

export const POPULAR_LOCATIONS = [
  {
    area: "New York",
    image: "/images/loc-newyork.jpg",
    blurb:
      "Sky-high penthouses and storied brownstones across Manhattan and Brooklyn — the definitive urban address.",
  },
  {
    area: "Los Angeles",
    image: "/images/loc-losangeles.jpg",
    blurb:
      "Beverly Hills estates, Hollywood Hills view homes and the effortless indoor-outdoor California lifestyle.",
  },
  {
    area: "Miami",
    image: "/images/loc-miami.jpg",
    blurb:
      "Waterfront towers and Coconut Grove charm, where resort living meets a booming business core.",
  },
  {
    area: "Palm Beach",
    image: "/images/loc-palmbeach.jpg",
    blurb:
      "Old-money Floridian elegance — oceanfront mansions and manicured estates on the legendary island.",
  },
  {
    area: "Aspen",
    image: "/images/loc-aspen.jpg",
    blurb:
      "Ski-access chalets and mountain-modern estates beneath the Colorado Rockies, moments from the gondola.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Havenstone understood exactly what our family needed before we could even describe it. We viewed five homes and the third one was simply ours — the negotiation and paperwork were handled with real care.",
    name: "Sarah & James Whitfield",
    detail: "Family estate, Beverly Hills",
    initials: "SW",
  },
  {
    quote:
      "As first-time buyers we had a hundred questions. Our consultant was patient, honest about trade-offs, and never once pushed us. We felt guided rather than sold to.",
    name: "Emily & Daniel Ross",
    detail: "First home, Coral Gables, Miami",
    initials: "ER",
  },
  {
    quote:
      "Discreet, responsive and meticulous. The team shortlisted three penthouses in Tribeca that matched my brief precisely, and arranged private viewings around my travel schedule.",
    name: "Dr. Jonathan Pierce",
    detail: "Penthouse acquisition, Tribeca, New York",
    initials: "JP",
  },
  {
    quote:
      "Relocating from Chicago, I found an apartment in one week. Every listing matched the photographs and the HOA details were explained upfront — no surprises at all.",
    name: "Isabella Moreau",
    detail: "Waterfront apartment, Brickell, Miami",
    initials: "IM",
  },
] as const;

export const DEMO_CONTACT = {
  phone: "+1 (212) 555-0100",
  email: "hello@havenstone.com",
  address: "425 Madison Avenue, 28th Floor, New York, NY 10017",
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM ET" },
    { days: "Saturday", time: "10:00 AM – 4:00 PM ET" },
    { days: "Sunday & Federal Holidays", time: "Closed" },
  ],
};

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactUSD(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return `$${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${amount / 1_000}K`;
  }
  return formatUSD(amount);
}

export function priceLabel(p: Property): string {
  return p.status === "For Rent"
    ? `${formatUSD(p.price)} / month`
    : formatUSD(p.price);
}

export function getAgent(id: string): Agent {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0];
}

export function getProperty(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id || p.slug === id);
}

export interface FilterOptions extends Record<string, string | undefined> {
  location?: string;
  type?: string;
  status?: string;
  min?: string;
  max?: string;
  beds?: string;
}

export function filterProperties(props: Property[], q: FilterOptions): Property[] {
  const min = q.min ? Number(q.min) : undefined;
  const max = q.max ? Number(q.max) : undefined;
  const beds = q.beds ? Number(q.beds) : undefined;
  return props.filter((p) => {
    if (q.location && q.location !== "anywhere" && p.area !== q.location) return false;
    if (q.type && q.type !== "any" && p.type !== q.type) return false;
    if (q.status && q.status !== "any" && p.status !== q.status) return false;
    if (min !== undefined && p.price < min) return false;
    if (max !== undefined && p.price > max) return false;
    if (beds !== undefined && p.bedrooms < beds) return false;
    return true;
  });
}

export function similarProperties(p: Property, count = 3): Property[] {
  const scored = PROPERTIES.filter((o) => o.id !== p.id).map((o) => {
    let score = 0;
    if (o.area === p.area) score += 2;
    if (o.type === p.type) score += 1;
    if (o.status === p.status) score += 1;
    const priceGap = Math.abs(o.price - p.price) / Math.max(p.price, 1);
    if (priceGap < 0.5) score += 1;
    return { o, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.o);
}

const img = (pid: number) => [
  `/images/p${String(pid).padStart(2, "0")}-1.jpg`,
  `/images/p${String(pid).padStart(2, "0")}-2.jpg`,
  `/images/p${String(pid).padStart(2, "0")}-3.jpg`,
  `/images/p${String(pid).padStart(2, "0")}-4.jpg`,
];

export const PROPERTIES: Property[] = [
  {
    id: "p01",
    slug: "the-signature-penthouse-tribeca",
    title: "The Signature Penthouse",
    location: "Tribeca, New York",
    area: "New York",
    price: 14500000,
    status: "For Sale",
    type: "Penthouse",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 7750,
    yearBuilt: 2021,
    tagline: "Crown-of-the-tower living with sweeping views over Lower Manhattan.",
    description: [
      "Perched on the top two floors of one of Tribeca's most exclusive towers, The Signature Penthouse is a private world above the city. A dedicated keyed elevator opens onto a double-height great room framed by floor-to-ceiling glass, with uninterrupted views over the Hudson River and the landmarked rooftops of the historic district.",
      "The principal suite occupies its own wing with a private terrace, custom dressing room and book-matched marble bath, while four further en-suite bedrooms welcome family and guests. A sculpted chef's kitchen, screening room and glass-walled study complete the interior.",
      "Above it all, a landscaped rooftop terrace with a heated plunge pool and outdoor lounge is made for sunset entertaining — serviced around the clock by the building's discreet concierge team.",
    ],
    features: [
      "Private keyed elevator landing",
      "Double-height great room",
      "Rooftop terrace with heated plunge pool",
      "Chef's kitchen with Sub-Zero & Wolf appliances",
      "Screening room",
      "Crestron smart-home automation",
      "24/7 concierge & doorman",
      "4 deeded garage parking spaces",
      "Climate-controlled wine cellar",
      "Private storage room",
    ],
    images: img(1),
    agentId: "alexandra",
    featured: true,
  },
  {
    id: "p02",
    slug: "magnolia-court-estate-palm-beach",
    title: "Magnolia Court Estate",
    location: "Estate Section, Palm Beach",
    area: "Palm Beach",
    price: 22500000,
    status: "For Sale",
    type: "Mansion",
    bedrooms: 6,
    bathrooms: 7,
    sizeSqft: 12400,
    yearBuilt: 2019,
    tagline: "A stately family estate minutes from the lake trail and Worth Avenue.",
    description: [
      "Set behind mature banyan and jacaranda gardens on a generous two-thirds-of-an-acre lot, Magnolia Court is a residence built for generational living. A double-height foyer with a sweeping staircase introduces formal and family reception rooms, each opening onto the pool terrace.",
      "Six en-suite bedrooms include a self-contained guest wing and a first-floor principal suite with a private loggia. An elevator serves all three levels, and a staff apartment with a separate entrance supports effortless daily running.",
      "Outside, a resort-style pool with covered loggia and summer kitchen create the classic Palm Beach rhythm — five minutes from the lake trail, the beaches and the boutiques of Worth Avenue.",
    ],
    features: [
      "Two-thirds-acre landscaped grounds",
      "Resort-style pool & spa",
      "Internal elevator",
      "Guest wing with separate entrance",
      "Summer kitchen & loggia",
      "Home office & library",
      "Fitness room & sauna",
      "1,200-bottle wine cellar",
      "2 staff apartments",
      "Whole-home automation & generator",
    ],
    images: img(2),
    agentId: "alexandra",
    featured: true,
  },
  {
    id: "p03",
    slug: "azure-residences-sky-suite-miami",
    title: "Azure Residences — Sky Suite",
    location: "Brickell, Miami",
    area: "Miami",
    price: 3250000,
    status: "For Sale",
    type: "Condominium",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqft: 3340,
    yearBuilt: 2022,
    tagline: "Turn-key luxury on a high floor in the heart of Brickell.",
    description: [
      "On the thirty-second floor of Azure Residences, this three-bedroom sky home pairs five-star amenities with a lock-up-and-leave ease that suits executives and seasonal residents alike.",
      "The open-plan living and dining space flows onto a wrap-around terrace with views over Biscayne Bay and the Miami skyline. A fitted Italian kitchen, wide-plank oak floors and layered lighting give the residence a calm, contemporary character.",
      "Residents enjoy a resort deck with two pools, a fully equipped fitness center, residents' lounge and round-the-clock security with valet — all minutes from Brickell's offices, marinas and restaurants.",
    ],
    features: [
      "Wrap-around bay-view terrace",
      "Italian fitted kitchen",
      "Two resort pools & spa",
      "Fitness center & residents' lounge",
      "24/7 security, valet & concierge",
      "2 assigned parking spaces",
      "Private storage unit",
      "Smart-home automation",
    ],
    images: img(3),
    agentId: "sophia",
    featured: true,
  },
  {
    id: "p04",
    slug: "the-whitby-serviced-residence-nyc",
    title: "The Whitby Serviced Residence",
    location: "Midtown Manhattan, New York",
    area: "New York",
    price: 18500,
    status: "For Rent",
    type: "Condominium",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqft: 2580,
    yearBuilt: 2020,
    tagline: "Fully serviced living with housekeeping, concierge and skyline views included.",
    description: [
      "The Whitby offers genuinely effortless city living: this serviced three-bedroom residence comes with twice-weekly housekeeping, utilities management and a resident concierge included in the rent.",
      "Interiors are finished in a warm neutral palette, with a generous living room, dining area and a kitchen fitted with premium appliances. The principal bedroom features floor-to-ceiling windows and a spa-style bath.",
      "The building sits between Bryant Park and Grand Central, keeping Midtown's corporate core within a ten-minute walk — ideal for professionals and relocating families who value time above all else.",
    ],
    features: [
      "Housekeeping included",
      "Concierge & doorman services",
      "Skyline views from the 28th floor",
      "Fitness center & residents' lounge",
      "Business center",
      "Attended garage parking",
      "Steps from Bryant Park & Grand Central",
      "Furnished or unfurnished options",
    ],
    images: img(4),
    agentId: "ethan",
    featured: true,
  },
  {
    id: "p05",
    slug: "palm-grove-estate-beverly-hills",
    title: "Palm Grove Estate",
    location: "Beverly Hills, Los Angeles",
    area: "Los Angeles",
    price: 6800000,
    status: "For Sale",
    type: "Estate",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqft: 6030,
    yearBuilt: 2021,
    tagline: "A sun-filled family estate wrapped around a private pool garden.",
    description: [
      "Palm Grove is that rare Beverly Hills find: a detached family home with genuine flat, usable grounds. The plan centers on a bright open kitchen and family room that spill through full-height glass doors onto a paved pool terrace framed by mature palms.",
      "Five en-suite bedrooms are arranged across two floors, with the principal suite enjoying a private balcony and dressing room. A ground-floor guest suite doubles as a comfortable home office.",
      "Set behind private gates on a quiet tree-lined street, the estate also includes a two-car garage, a pool house and owned solar — ready for immediate occupancy.",
    ],
    features: [
      "Private swimming pool & spa",
      "Landscaped pool terrace",
      "5 en-suite bedrooms",
      "Two-car garage",
      "Pool house & guest suite",
      "Owned solar system",
      "Gated motor court",
      "Minutes from Rodeo Drive",
    ],
    images: img(5),
    agentId: "marcus",
    featured: true,
  },
  {
    id: "p06",
    slug: "haven-smart-villa-hollywood-hills",
    title: "The Haven Smart Villa",
    location: "Hollywood Hills, Los Angeles",
    area: "Los Angeles",
    price: 9800000,
    status: "For Sale",
    type: "Villa",
    bedrooms: 6,
    bathrooms: 7,
    sizeSqft: 8600,
    yearBuilt: 2024,
    tagline: "New-generation smart living for entertaining at scale.",
    description: [
      "Completed in 2024, The Haven Smart Villa is a statement home for a new era of Los Angeles living. Clean architectural lines, a cantilevered entrance canopy and a glass bridge linking the wings give the house a gallery-like presence.",
      "Inside, six en-suite bedrooms orbit a double-volume family lounge, a formal dining room for fourteen and a showpiece island kitchen. Full smart-home control covers lighting, climate, shades, cameras and entry — manageable from a phone anywhere in the world.",
      "The rear of the lot opens onto an infinity pool and sunken fire-pit lounge under the stars, with an outdoor kitchen beside it and canyon views beyond. A private cinema, gym and staff wing complete this fully self-contained estate.",
    ],
    features: [
      "Full smart-home automation",
      "Private cinema",
      "Infinity pool & fire-pit lounge",
      "Outdoor kitchen",
      "Gym & spa",
      "Staff wing",
      "Owned solar & battery backup",
      "CCTV & access control",
      "3-car garage",
      "Canyon-to-city views",
    ],
    images: img(6),
    agentId: "marcus",
    featured: true,
  },
  {
    id: "p07",
    slug: "brookfield-townhouse-brooklyn-heights",
    title: "Brookfield Townhouse",
    location: "Brooklyn Heights, New York",
    area: "New York",
    price: 3950000,
    status: "For Sale",
    type: "Townhouse",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqft: 3660,
    yearBuilt: 2023,
    tagline: "Contemporary townhouse living in a landmarked, leafy neighborhood.",
    description: [
      "Brookfield Townhouse is one of just eight new residences on a landscaped close in Brooklyn Heights. This four-bedroom home is finished to a high standard across three efficient floors, with a light-filled parlor floor and open kitchen at its heart.",
      "All bedrooms are en-suite, and the private roof terrace — a rarity at this price point — is ideal for evening gatherings above the treeline. The building offers smart access, a planted courtyard and dedicated parking.",
      "An excellent choice for families and professionals seeking a modern, low-maintenance home with the promenade, waterfront parks and Manhattan ferries a short stroll away.",
    ],
    features: [
      "Private roof terrace",
      "All bedrooms en-suite",
      "Planted shared courtyard",
      "Smart-home access control",
      "Fitted kitchen",
      "Dedicated garage parking",
      "Steps from the Brooklyn Heights Promenade",
      "Close to waterfront parks & ferries",
    ],
    images: img(7),
    agentId: "alexandra",
    featured: true,
  },
  {
    id: "p08",
    slug: "bay-view-residence-coconut-grove",
    title: "Bay View Residence",
    location: "Coconut Grove, Miami",
    area: "Miami",
    price: 12500,
    status: "For Rent",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 4520,
    yearBuilt: 2018,
    tagline: "Serene bay-adjacent home with evening water views.",
    description: [
      "Tucked into the leafy streets of Coconut Grove, this bay-adjacent villa offers the calm that busy families crave. Its first-floor lounge frames the water through a wall of glass, glowing gold at sunset.",
      "Four en-suite bedrooms, a family media room and a study nook give everyone room to breathe, while the kitchen-breakfast area opens onto a shaded garden safe for children.",
      "The lease covers landscaping, pool service and community security — a well-run home in one of Miami's most quietly prestigious neighborhoods, minutes from the marina and top private schools.",
    ],
    features: [
      "Bay views from the first floor",
      "4 en-suite bedrooms",
      "Children-safe garden",
      "Family media room",
      "Landscaping & pool service included",
      "Gated community security",
      "Ample guest parking",
      "Close to marinas & private schools",
    ],
    images: img(8),
    agentId: "sophia",
    featured: false,
  },
  {
    id: "p09",
    slug: "cedar-ridge-villa-coral-gables",
    title: "Cedar Ridge Villa",
    location: "Coral Gables, Miami",
    area: "Miami",
    price: 1850000,
    status: "For Sale",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqft: 4090,
    yearBuilt: 2022,
    tagline: "Contemporary comfort in Coral Gables style — a home to grow into.",
    description: [
      "Cedar Ridge pairs crisp contemporary architecture with genuinely practical family living in the heart of Coral Gables. The ground floor flows kitchen-dining-living, opening to a fenced rear garden with room for play and planting.",
      "Upstairs, four en-suite bedrooms include a principal suite with balcony. Ceilings are generous, windows are oversized, and a covered loggia catches the bay breeze on even the warmest afternoons.",
      "Located minutes from the shops of Miracle Mile with easy access to top-rated schools and the Gables' historic boulevards — an outstanding entry into detached-home ownership in one of Miami's most beloved districts.",
    ],
    features: [
      "Fenced rear garden",
      "4 en-suite bedrooms",
      "Principal balcony",
      "Covered loggia",
      "Impact windows & doors",
      "Ample parking",
      "Smart thermostat & lighting",
      "Minutes from Miracle Mile",
    ],
    images: img(9),
    agentId: "sophia",
    featured: false,
  },
  {
    id: "p10",
    slug: "palmrose-villa-palm-beach",
    title: "Palmrose Villa",
    location: "Palm Beach, Florida",
    area: "Palm Beach",
    price: 2950000,
    status: "For Sale",
    type: "Villa",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqft: 2800,
    yearBuilt: 2021,
    tagline: "Easy single-level island living, minutes from the ocean.",
    description: [
      "Palmrose answers a simple wish: a well-built, single-level home with no stairs and no fuss. Three en-suite bedrooms wrap around a central living-dining space and a kitchen fitted with custom cabinetry.",
      "The lot is fully hedged for privacy, with space for four cars and a small kitchen garden. A spare room behind the house serves as a studio or a quiet home office.",
      "Positioned on a quiet interior street with good road access and a strong neighborhood feel — a sensible, comfortable winter retreat or a lock-up-and-leave base between Palm Beach and West Palm.",
    ],
    features: [
      "Single-level living",
      "3 en-suite bedrooms",
      "Studio / home office",
      "Hedged private lot",
      "Parking for 4 cars",
      "Impact windows",
      "Quiet interior street",
      "Minutes from the ocean & Worth Avenue",
    ],
    images: img(10),
    agentId: "alexandra",
    featured: false,
  },
  {
    id: "p11",
    slug: "rosewood-chalet-red-mountain",
    title: "Rosewood Chalet",
    location: "Red Mountain, Aspen",
    area: "Aspen",
    price: 7900000,
    status: "For Sale",
    type: "Chalet",
    bedrooms: 4,
    bathrooms: 5,
    sizeSqft: 4840,
    yearBuilt: 2017,
    tagline: "Timber-and-stone mountain charm with valley views, minutes from the gondola.",
    description: [
      "Rosewood sits on one of Red Mountain's most coveted lanes, offering mountain convenience with an established, neighborly feel. The chalet has a warm, solid character — reclaimed timber, wide-plank floors and a stone hearth at the heart of the great room.",
      "Four en-suite bedrooms and a bunk room serve growing families and ski weekends, while a detached guest cabin and generous heated decks suit households that entertain or host regularly.",
      "The location is unbeatable for mountain professionals and skiers alike: minutes from the Silver Queen Gondola, Aspen's core and the airport, with Red Mountain's calm as a nightly reward.",
    ],
    features: [
      "Reclaimed-timber great room",
      "Stone hearth & wine room",
      "4 en-suite bedrooms + bunk room",
      "Detached guest cabin",
      "Heated flagstone decks",
      "Heated 2-car garage",
      "Snowmelt driveway",
      "Minutes from the Silver Queen Gondola",
    ],
    images: img(11),
    agentId: "ethan",
    featured: false,
  },
  {
    id: "p12",
    slug: "silver-queen-residence-aspen",
    title: "Silver Queen Residence",
    location: "Downtown Aspen",
    area: "Aspen",
    price: 7200,
    status: "For Rent",
    type: "Condominium",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqft: 1180,
    yearBuilt: 2023,
    tagline: "A fresh, mountain-modern apartment steps from the gondola and the core.",
    description: [
      "Silver Queen is a compact, beautifully finished two-bedroom residence in a low-rise building beside the pedestrian core of Aspen. Light timber floors, white walls and black-framed windows keep it crisp and current.",
      "Both bedrooms are en-suite, and the open kitchen-living room is bright throughout the day. The building provides secure parking, ski storage, intercom access and a shared hot tub and residents' lounge.",
      "An effortless rental for professionals and mountain lovers alike — walk to the gondola, restaurants and Galena Street, with everything new and nothing to fix.",
    ],
    features: [
      "2 en-suite bedrooms",
      "Open kitchen-living room",
      "Secure garage parking",
      "Ski storage & tuning room",
      "Shared hot tub & residents' lounge",
      "Intercom access",
      "Balcony with mountain views",
      "Steps from the Silver Queen Gondola",
    ],
    images: img(12),
    agentId: "ethan",
    featured: false,
  },
];
