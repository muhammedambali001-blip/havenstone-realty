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
  sizeSqm: number;
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
    id: "amara",
    name: "Amara Eze",
    role: "Luxury Portfolio Advisor",
    initials: "AE",
    phone: "+234 800 000 0111",
    email: "amara@demo.havenstone.example",
    bio: "Amara advises private clients on Ikoyi and Victoria Island's most distinguished residences, with a decade of experience in premium Lagos property.",
  },
  {
    id: "tunde",
    name: "Tunde Bakare",
    role: "Senior Property Consultant",
    initials: "TB",
    phone: "+234 800 000 0222",
    email: "tunde@demo.havenstone.example",
    bio: "Tunde specialises in Lekki's family duplexes and new developments, guiding buyers from first viewing to final handover.",
  },
  {
    id: "adaeze",
    name: "Adaeze Okafor",
    role: "Head of Sales",
    initials: "AO",
    phone: "+234 800 000 0333",
    email: "adaeze@demo.havenstone.example",
    bio: "Adaeze leads our sales team and oversees valuation, negotiation and closing for every Havenstone transaction.",
  },
  {
    id: "emeka",
    name: "Emeka Nwosu",
    role: "Client Relations Manager",
    initials: "EN",
    phone: "+234 800 000 0444",
    email: "emeka@demo.havenstone.example",
    bio: "Emeka looks after our clients long after keys are handed over — from renovations to resale strategy.",
  },
];

export const LOCATIONS = [
  "Lekki",
  "Victoria Island",
  "Ikoyi",
  "Ikeja",
  "Ajah",
] as const;

export const PROPERTY_TYPES = [
  "Detached Duplex",
  "Semi-Detached Duplex",
  "Terraced Duplex",
  "Apartment",
  "Penthouse",
  "Bungalow",
  "Mansion",
] as const;

export const POPULAR_LOCATIONS = [
  {
    area: "Lekki",
    image: "/images/loc-lekki.jpg",
    blurb:
      "Gated estates, waterfront leisure and the city's most sought-after new builds along the Lekki–Epe corridor.",
  },
  {
    area: "Victoria Island",
    image: "/images/loc-vi.jpg",
    blurb:
      "The commercial heart of Lagos — serviced apartments and sky residences minutes from the business district.",
  },
  {
    area: "Ikoyi",
    image: "/images/loc-ikoyi.jpg",
    blurb:
      "Tree-lined streets and old-money prestige, home to Lagos' finest mansions and penthouses.",
  },
  {
    area: "Ikeja",
    image: "/images/loc-ikeja.jpg",
    blurb:
      "The mainland's green heartbeat, from the quiet GRA to modern apartments near Alausa.",
  },
  {
    area: "Ajah",
    image: "/images/loc-ajah.jpg",
    blurb:
      "Room to grow: value-priced duplexes and bungalows with easy access to the Lekki peninsula.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Havenstone understood exactly what our family needed before we could even describe it. We viewed five homes and the third one was simply ours — the negotiation and paperwork were handled with real care.",
    name: "Chidinma & Emeka A.",
    detail: "Family home, Lekki Phase 1",
    initials: "CA",
  },
  {
    quote:
      "As first-time buyers we had a hundred questions. Our consultant was patient, honest about trade-offs, and never once pushed us. We felt guided rather than sold to.",
    name: "Tolu & Femi Adeyemi",
    detail: "First home, Ikeja GRA",
    initials: "TA",
  },
  {
    quote:
      "Discreet, responsive and meticulous. The team shortlisted three penthouses in Ikoyi that matched my brief precisely, and arranged private viewings around my travel schedule.",
    name: "Dr. Ifeanyi Obi",
    detail: "Penthouse acquisition, Old Ikoyi",
    initials: "IO",
  },
  {
    quote:
      "Relocating from Abuja, I found an apartment in one week. Every listing matched the photographs and the service-charge details were explained upfront — no surprises at all.",
    name: "Fatima Bello",
    detail: "Serviced apartment, Victoria Island",
    initials: "FB",
  },
] as const;

export const DEMO_CONTACT = {
  phone: "+234 800 000 0000",
  email: "hello@demo.havenstone.example",
  address: "Plot 14, Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  hours: [
    { days: "Monday – Friday", time: "8:30 AM – 6:00 PM" },
    { days: "Saturday", time: "10:00 AM – 4:00 PM" },
    { days: "Sunday & Public Holidays", time: "Closed" },
  ],
};

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function priceLabel(p: Property): string {
  return p.status === "For Rent"
    ? `${formatNaira(p.price)} / year`
    : formatNaira(p.price);
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
    slug: "the-signature-penthouse-ikoyi",
    title: "The Signature Penthouse",
    location: "Old Ikoyi, Lagos",
    area: "Ikoyi",
    price: 950000000,
    status: "For Sale",
    type: "Penthouse",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqm: 720,
    yearBuilt: 2021,
    tagline: "Crown-of-the-tower living with sweeping views across Old Ikoyi.",
    description: [
      "Perched on the top two floors of one of Ikoyi's most exclusive towers, The Signature Penthouse is a private world above the city. A dedicated lift lobby opens onto a double-height living room framed by floor-to-ceiling glass, with uninterrupted views over the lagoon and the tree canopies of Old Ikoyi.",
      "The principal suite occupies its own wing with a private terrace, dressing room and marble bath, while four further en-suite bedrooms welcome family and guests. A sculpted chef's kitchen, cinema room and glass-walled study complete the interior.",
      "Above it all, a landscaped rooftop terrace with an infinity-edge pool and outdoor lounge is made for sunset entertaining — serviced around the clock by the building's discreet concierge team.",
    ],
    features: [
      "Private lift lobby",
      "Double-height living room",
      "Infinity rooftop pool",
      "Chef's kitchen with premium appliances",
      "Cinema room",
      "Smart-home automation",
      "24/7 concierge & security",
      "4 dedicated parking bays",
      "Staff quarters",
      "Backup power & water treatment",
    ],
    images: img(1),
    agentId: "amara",
    featured: true,
  },
  {
    id: "p02",
    slug: "magnolia-court-mansion-ikoyi",
    title: "Magnolia Court Mansion",
    location: "Old Ikoyi, Lagos",
    area: "Ikoyi",
    price: 1200000000,
    status: "For Sale",
    type: "Mansion",
    bedrooms: 6,
    bathrooms: 7,
    sizeSqm: 1150,
    yearBuilt: 2019,
    tagline: "A stately family mansion on one of Ikoyi's quietest streets.",
    description: [
      "Set behind mature gardens on a generous half-acre plot, Magnolia Court is a residence built for generational living. A double-volume foyer with sweeping staircase introduces formal and family reception rooms, each opening onto the garden.",
      "Six en-suite bedrooms include a self-contained guest wing and a principal floor with private lounge. An elevator serves all three levels, and a staff apartment with separate entrance supports effortless daily running.",
      "Outside, a swimming pool with pool house, covered terrace and children's garden create a resort atmosphere in the middle of Old Ikoyi — minutes from the clubs, schools and embassies the district is known for.",
    ],
    features: [
      "Half-acre landscaped plot",
      "Swimming pool & pool house",
      "Internal elevator",
      "Guest wing with separate access",
      "Home office & library",
      "Gym & spa room",
      "Wine cellar",
      "2 staff apartments",
      "Smart-home system",
      "Backup generator & borehole",
    ],
    images: img(2),
    agentId: "amara",
    featured: true,
  },
  {
    id: "p03",
    slug: "azure-residences-apartment-vi",
    title: "Azure Residences — Sky Apartment",
    location: "Victoria Island, Lagos",
    area: "Victoria Island",
    price: 450000000,
    status: "For Sale",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 4,
    sizeSqm: 310,
    yearBuilt: 2022,
    tagline: "Turn-key luxury on a high floor, minutes from the business district.",
    description: [
      "On the fourteenth floor of Azure Residences, this three-bedroom sky apartment pairs hotel-grade amenities with a lock-up-and-leave ease that suits executives and young families alike.",
      "The open-plan living and dining space flows onto a wrap-around balcony with views over the Atlantic skyline. A fitted Italian kitchen, engineered-oak floors and layered lighting give the apartment a calm, contemporary character.",
      "Residents enjoy a rooftop pool, fully equipped gym, residents' lounge and round-the-clock security with CCTV — all within a short drive of the offices, restaurants and private clubs of Victoria Island.",
    ],
    features: [
      "Wrap-around skyline balcony",
      "Italian fitted kitchen",
      "Rooftop pool & gym",
      "Residents' lounge",
      "24/7 security & CCTV",
      "2 dedicated parking bays",
      "Central backup power",
      "Water treatment plant",
    ],
    images: img(3),
    agentId: "adaeze",
    featured: true,
  },
  {
    id: "p04",
    slug: "marina-heights-serviced-apartment-vi",
    title: "Marina Heights Serviced Apartment",
    location: "Falomo, Victoria Island, Lagos",
    area: "Victoria Island",
    price: 35000000,
    status: "For Rent",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 240,
    yearBuilt: 2020,
    tagline: "Fully serviced living with housekeeping, power and concierge included.",
    description: [
      "Marina Heights offers genuinely effortless city living: this serviced three-bedroom apartment comes with professional housekeeping, utilities management and a resident concierge included in the rent.",
      "Interiors are finished in a warm neutral palette, with a generous living room, dining area and a kitchen fitted with premium appliances. The principal bedroom features floor-to-ceiling windows and a spa-style bathroom.",
      "The building sits between Falomo bridge and the Marina, keeping the corporate core of Victoria Island within ten minutes' drive — ideal for professionals who value time above all else.",
    ],
    features: [
      "Housekeeping included",
      "Concierge service",
      "Uninterrupted backup power",
      "Gym & swimming pool",
      "Business lounge",
      "Secure basement parking",
      "Water treatment",
      "Close to the Marina business district",
    ],
    images: img(4),
    agentId: "emeka",
    featured: true,
  },
  {
    id: "p05",
    slug: "palm-grove-duplex-lekki",
    title: "Palm Grove Duplex",
    location: "Lekki Phase 1, Lagos",
    area: "Lekki",
    price: 650000000,
    status: "For Sale",
    type: "Detached Duplex",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqm: 560,
    yearBuilt: 2021,
    tagline: "A sun-filled family duplex wrapped around a private pool garden.",
    description: [
      "Palm Grove is that rare Lekki Phase 1 find: a detached family home with genuine outdoor space. The plan centres on a bright open kitchen and family room that spill through full-height glass doors onto a paved pool terrace framed by mature palms.",
      "Five en-suite bedrooms are arranged across two floors, with the principal suite enjoying a private balcony and dressing room. A ground-floor guest room doubles as a comfortable home office.",
      "Set on a gated close with estate security, the house also includes a two-car garage, boys' quarters and inverter-backed power — ready for immediate occupation.",
    ],
    features: [
      "Private swimming pool",
      "Landscaped pool terrace",
      "5 en-suite bedrooms",
      "Two-car garage",
      "Boys' quarters",
      "Inverter & backup system",
      "Gated estate security",
      "Walking distance to Admiralty Way",
    ],
    images: img(5),
    agentId: "tunde",
    featured: true,
  },
  {
    id: "p06",
    slug: "haven-smart-villa-lekki",
    title: "The Haven Smart Villa",
    location: "Ikate, Lekki, Lagos",
    area: "Lekki",
    price: 950000000,
    status: "For Sale",
    type: "Detached Duplex",
    bedrooms: 6,
    bathrooms: 7,
    sizeSqm: 800,
    yearBuilt: 2024,
    tagline: "New-generation smart living for entertaining at scale.",
    description: [
      "Completed in 2024, The Haven Smart Villa is a statement home for a new era of Lagos living. Clean architectural lines, a cantilevered entrance canopy and a glass bridge linking the wings give the house a gallery-like presence.",
      "Inside, six en-suite bedrooms orbit a double-volume family lounge, a formal dining room for fourteen and a showpiece island kitchen. Full smart-home control covers lighting, climate, curtains, cameras and entry — manageable from a phone anywhere in the world.",
      "The rear of the plot opens onto a pool and sunken fire-pit lounge under the stars, with an outdoor kitchen beside it. A private cinema, gym and staff wing complete this fully self-contained estate.",
    ],
    features: [
      "Full smart-home automation",
      "Private cinema",
      "Swimming pool & fire-pit lounge",
      "Outdoor kitchen",
      "Gym & spa",
      "Staff wing",
      "Solar-assisted power system",
      "Water treatment plant",
      "CCTV & access control",
      "3-car garage",
    ],
    images: img(6),
    agentId: "tunde",
    featured: true,
  },
  {
    id: "p07",
    slug: "brookfield-terrace-lekki",
    title: "Brookfield Terrace",
    location: "Chevron Drive, Lekki, Lagos",
    area: "Lekki",
    price: 380000000,
    status: "For Sale",
    type: "Terraced Duplex",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqm: 340,
    yearBuilt: 2023,
    tagline: "Contemporary terrace living in a secured, amenity-rich estate.",
    description: [
      "Brookfield Terrace is a cluster of just eight homes in a landscaped estate off Chevron Drive. This four-bedroom unit is finished to a high standard across three efficient floors, with a light-filled living room and open kitchen at its heart.",
      "All bedrooms are en-suite, and the roof terrace — a rarity at this price point — is ideal for evening gatherings above the treeline. The estate offers 24-hour security, a children's playground and adequate resident parking.",
      "An excellent choice for young families and professionals seeking a modern, low-maintenance home with straightforward access to both the Lekki business corridor and the Epe expressway.",
    ],
    features: [
      "Private roof terrace",
      "All rooms en-suite",
      "Estate playground",
      "24-hour estate security",
      "Fitted kitchen",
      "Adequate parking",
      "Backup inverter provision",
      "Close to Chevron roundabout",
    ],
    images: img(7),
    agentId: "tunde",
    featured: true,
  },
  {
    id: "p08",
    slug: "lagoon-view-residence-lekki",
    title: "Lagoon View Residence",
    location: "Second Lagoon, Lekki, Lagos",
    area: "Lekki",
    price: 25000000,
    status: "For Rent",
    type: "Semi-Detached Duplex",
    bedrooms: 4,
    bathrooms: 5,
    sizeSqm: 420,
    yearBuilt: 2018,
    tagline: "Serene semi-detached home with evening lagoon views.",
    description: [
      "Tucked into the leafy Second Lagoon layout, this semi-detached duplex offers the calm that busy families crave. Its first-floor lounge frames the water through a wall of glass, glowing gold at sunset.",
      "Four en-suite bedrooms, a family TV room and a study nook give everyone room to breathe, while the kitchen-breakfast area opens onto a shaded garden safe for children.",
      "The service charge covers estate security, common-area maintenance and shared backup power — a well-run home in one of Lekki's most quietly prestigious streets.",
    ],
    features: [
      "Lagoon views from first floor",
      "4 en-suite bedrooms",
      "Children-safe garden",
      "Family TV room",
      "Estate security",
      "Shared backup power",
      "Ample visitor parking",
      "Close to international schools",
    ],
    images: img(8),
    agentId: "emeka",
    featured: false,
  },
  {
    id: "p09",
    slug: "cedar-ridge-duplex-ajah",
    title: "Cedar Ridge Duplex",
    location: "Ajah, Lagos",
    area: "Ajah",
    price: 180000000,
    status: "For Sale",
    type: "Detached Duplex",
    bedrooms: 4,
    bathrooms: 4,
    sizeSqm: 380,
    yearBuilt: 2022,
    tagline: "Bold contemporary lines, honest value — a home to grow into.",
    description: [
      "Cedar Ridge pairs striking black-and-white architecture with genuinely practical family living. The ground floor flows kitchen-dining-living, opening to a fenced rear garden with room for play and planting.",
      "Upstairs, four en-suite bedrooms include a principal suite with balcony. Ceilings are generous, windows are oversized, and every room catches cross-ventilation from the ocean breeze.",
      "Located minutes from the Ajah roundabout with easy access to schools, markets and the expressway — an outstanding entry into detached-home ownership on the corridor.",
    ],
    features: [
      "Fenced rear garden",
      "4 en-suite bedrooms",
      "Principal balcony",
      "Cross-ventilated design",
      "Ample parking",
      "Gated compound",
      "Borehole & treatment plant",
      "Minutes from Ajah roundabout",
    ],
    images: img(9),
    agentId: "tunde",
    featured: false,
  },
  {
    id: "p10",
    slug: "palmrose-bungalow-ajah",
    title: "Palmrose Bungalow",
    location: "Sangotedo, Ajah, Lagos",
    area: "Ajah",
    price: 95000000,
    status: "For Sale",
    type: "Bungalow",
    bedrooms: 3,
    bathrooms: 3,
    sizeSqm: 260,
    yearBuilt: 2021,
    tagline: "Easy single-level living — ideal for families and retirees alike.",
    description: [
      "Palmrose answers a simple wish: a well-built, single-level home with no stairs and no stress. Three en-suite bedrooms wrap around a central living-dining space and a kitchen fitted with soft-close cabinetry.",
      "The compound is fully fenced with space for four cars and a small kitchen garden. A spare room behind the house serves as boys' quarters or a quiet home office.",
      "Positioned in a developing Sangotedo close with good road access and a strong neighbourhood feel — a sensible, comfortable first home or a lock-up property for the diaspora.",
    ],
    features: [
      "Single-level living",
      "3 en-suite bedrooms",
      "Boys' quarters / office",
      "Fenced compound",
      "Parking for 4 cars",
      "Borehole & overhead tank",
      "Quiet developing close",
      "Good road access",
    ],
    images: img(10),
    agentId: "emeka",
    featured: false,
  },
  {
    id: "p11",
    slug: "rosewood-duplex-ikeja",
    title: "Rosewood Duplex",
    location: "Ikeja GRA, Lagos",
    area: "Ikeja",
    price: 220000000,
    status: "For Sale",
    type: "Detached Duplex",
    bedrooms: 4,
    bathrooms: 5,
    sizeSqm: 450,
    yearBuilt: 2017,
    tagline: "Mature GRA charm on a tree-lined street with room for everything.",
    description: [
      "Rosewood sits on one of Ikeja GRA's famously tree-lined streets, offering mainland convenience with an established, neighbourly feel. The duplex has a warm, solid character — thick walls, wide corridors and a veranda for evening cool.",
      "Four en-suite bedrooms and a study serve growing families, while a detached boys' quarters and generous compound suit households that entertain or host regularly.",
      "The location is unbeatable for mainland professionals: minutes from Alausa secretariat, the airport and Ikeja's schools and clubs, with the GRA's calm as a nightly reward.",
    ],
    features: [
      "Tree-lined GRA street",
      "4 en-suite bedrooms",
      "Detached boys' quarters",
      "Study & veranda",
      "Generous compound",
      "Backup generator",
      "Borehole & treatment",
      "Close to airport & Alausa",
    ],
    images: img(11),
    agentId: "adaeze",
    featured: false,
  },
  {
    id: "p12",
    slug: "central-park-apartment-ikeja",
    title: "Central Park Apartment",
    location: "Alausa, Ikeja, Lagos",
    area: "Ikeja",
    price: 12000000,
    status: "For Rent",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 110,
    yearBuilt: 2023,
    tagline: "A fresh, low-rise apartment steps from the Alausa business district.",
    description: [
      "Central Park is a compact, beautifully finished two-bedroom apartment in a low-rise block beside the greenery of the Alausa district. Light timber floors, white walls and black-framed windows keep it crisp and current.",
      "Both bedrooms are en-suite, and the open kitchen-living room is bright throughout the day. The building provides secure parking, intercom access and steady water and power infrastructure.",
      "An effortless rental for young professionals working around Alausa, Opebi or the airport corridor — with everything new, nothing to fix.",
    ],
    features: [
      "2 en-suite bedrooms",
      "Open kitchen-living room",
      "Secure parking",
      "Intercom access",
      "Steady water supply",
      "Power infrastructure",
      "Balcony with green views",
      "Steps from Alausa district",
    ],
    images: img(12),
    agentId: "emeka",
    featured: false,
  },
];
