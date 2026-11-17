"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, RotateCcw, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/router";
import { priceLabel, type Property, PROPERTIES } from "@/lib/properties";
import { DEMO_CONTACT } from "@/lib/properties";

interface Message {
  id: number;
  sender: "bot" | "user";
  text?: string;
  cards?: Property[];
  chips?: string[];
}

type Stage =
  | "start"
  | "location"
  | "budget"
  | "results"
  | "faq"
  | "enquiry-name"
  | "enquiry-phone"
  | "done";

const WELCOME_CHIPS = ["Looking to Buy", "Looking to Rent", "Common Questions"];
const LOCATION_CHIPS = ["New York", "Los Angeles", "Miami", "Palm Beach", "Aspen", "Anywhere"];
const BUY_BUDGET_CHIPS = ["Under $3M", "$3M – $8M", "$8M – $15M", "Above $15M"];
const RENT_BUDGET_CHIPS = ["Under $10K / mo", "$10K – $20K / mo", "Above $20K / mo"];
const MAIN_CHIPS = ["Book a Viewing", "Talk to an Agent", "Common Questions", "Search Again"];
const FAQ_CHIPS = [
  "Are these properties real?",
  "How do viewings work?",
  "What fees do you charge?",
  "Where are you located?",
];

const FAQ_ANSWERS: Record<string, string> = {
  "Are these properties real?":
    "Good question! This is a demonstration website, so every listing, price and agent here is fictional — created to showcase the experience. On a live agency site, every listing would be inspected and title-verified before appearing.",
  "How do viewings work?":
    "On a live site, you would pick a property, submit the enquiry form on its page, and your agent would propose viewing times within 24 hours — including evenings and weekends for busy clients. Here, try the enquiry form on any property page to see how it feels!",
  "What fees do you charge?":
    "On a live agency site, every fee (agency, legal, caution and service charges) is disclosed in writing before you commit. No hidden line items, ever. For this demo, no real fees apply — nothing is actually transacted.",
  "Where are you located?":
    `Our (fictional) head office is at ${DEMO_CONTACT.address}, with advisors across New York, Los Angeles, Miami, Palm Beach and Aspen. Office hours are Monday to Friday, 9:00 AM – 6:00 PM ET, and Saturday 10:00 AM – 4:00 PM ET. You can always reach the team through the Contact page.`,
};

const AREA_ALIASES: Record<string, string> = {
  "new york": "New York",
  nyc: "New York",
  manhattan: "New York",
  brooklyn: "New York",
  "los angeles": "Los Angeles",
  la: "Los Angeles",
  beverly: "Los Angeles",
  miami: "Miami",
  brickell: "Miami",
  "palm beach": "Palm Beach",
  aspen: "Aspen",
};

function parseBudget(text: string): { min: number; max: number } | null {
  const t = text.toLowerCase().replace(/,/g, "").replace(/\$/g, " ");
  // Converts a captured money token like "2m", "10k", "1.5 billion" to dollars.
  const unitVal = (cap: string | undefined): number | undefined => {
    if (!cap) return undefined;
    const value = parseFloat(cap.replace(/[^\d.]/g, ""));
    if (Number.isNaN(value)) return undefined;
    const u = cap.trim().slice(-1).toLowerCase();
    if (cap.includes("billion")) return value * 1_000_000_000;
    if (cap.includes("million")) return value * 1_000_000;
    if (u === "b") return value * 1_000_000_000;
    if (u === "m") return value * 1_000_000;
    if (u === "k") return value * 1_000;
    return value;
  };
  const MONEY = "([\\d.]+\\s?(?:billion|million|k|m|b)?)(?![a-z])";

  const under = t.match(new RegExp(`(?:under|less than|below|up to)\\s*${MONEY}`));
  if (under) {
    const max = unitVal(under[1]);
    return max !== undefined ? { min: 0, max } : null;
  }
  const above = t.match(new RegExp(`(?:above|over|more than|from)\\s*${MONEY}`));
  if (above) {
    const min = unitVal(above[1]);
    return min !== undefined ? { min, max: Number.MAX_SAFE_INTEGER } : null;
  }
  const range = t.match(new RegExp(`${MONEY}\\s*(?:-|–|—|to|and)\\s*${MONEY}`));
  if (range) {
    const min = unitVal(range[1]);
    const max = unitVal(range[2]);
    if (min !== undefined && max !== undefined) return { min, max };
  }
  const single = t.match(new RegExp(MONEY));
  const v = unitVal(single?.[1]);
  if (v !== undefined && v >= 5_000) {
    return { min: v * 0.8, max: v * 1.4 };
  }
  return null;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>("start");
  const [unread, setUnread] = useState(true);

  const intent = useRef<"buy" | "rent" | null>(null);
  const pickedArea = useRef<string | null>(null);
  const enquiry = useRef<{ name?: string; phone?: string; property?: Property }>({});
  const idCounter = useRef(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const nextId = () => ++idCounter.current;

  const pushUser = (text: string) => {
    setMessages((m) => [...m, { id: nextId(), sender: "user", text }]);
  };

  const pushBot = (
    text: string,
    opts?: { chips?: string[]; cards?: Property[] },
    delay = 800
  ) => {
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: nextId(), sender: "bot", text, chips: opts?.chips, cards: opts?.cards },
      ]);
    }, delay);
    timers.current.push(t);
  };

  const openChat = () => {
    setOpen(true);
    setUnread(false);
    if (!hasOpened) {
      setHasOpened(true);
      pushBot(
        "Welcome to Havenstone Realty! I'm Ada, your property concierge. I can help you find a home anywhere in the U.S., answer questions, or arrange a viewing. How may I help you today?",
        { chips: WELCOME_CHIPS },
        600
      );
    }
  };

  const resetChat = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMessages([]);
    setStage("start");
    setTyping(false);
    intent.current = null;
    pickedArea.current = null;
    enquiry.current = {};
    window.setTimeout(() => {
      pushBot("Let's start fresh! How may I help you today?", { chips: WELCOME_CHIPS }, 500);
    }, 100);
  };

  const showMatches = (opts: {
    intentKind: "buy" | "rent";
    area: string | null;
    budget: { min: number; max: number } | null;
  }) => {
    const matches = PROPERTIES.filter((p) => {
      if (opts.intentKind === "buy" && p.status !== "For Sale") return false;
      if (opts.intentKind === "rent" && p.status !== "For Rent") return false;
      if (opts.area && opts.area !== "Anywhere" && p.area !== opts.area) return false;
      if (opts.budget) {
        if (p.price < opts.budget.min || p.price > opts.budget.max) return false;
      }
      return true;
    }).sort((a, b) => a.price - b.price);

    if (matches.length === 0) {
      pushBot(
        `I couldn't find an exact match for that brief — the market moves quickly! Here are the closest alternatives I'd recommend, or try widening the budget slightly.`,
        {
          cards: PROPERTIES.filter(
            (p) => (opts.intentKind === "buy" ? p.status === "For Sale" : p.status === "For Rent")
          )
            .sort((a, b) => a.price - b.price)
            .slice(0, 3),
          chips: MAIN_CHIPS,
        }
      );
    } else {
      const word =
        matches.length === 1 ? "a property" : `${matches.length} properties`;
      pushBot(
        `Wonderful news — I found ${word} matching your brief${
          opts.area && opts.area !== "Anywhere" ? ` in ${opts.area}` : ""
        }. Here are my top picks (tap one to see full details):`,
        { cards: matches.slice(0, 3) }
      );
      pushBot(
        "Would you like me to arrange a viewing for any of these, or shall we refine the search?",
        { chips: MAIN_CHIPS },
        1200
      );
    }
    setStage("results");
  };

  const startEnquiry = (property?: Property) => {
    enquiry.current = { property };
    setStage("enquiry-name");
    pushBot(
      property
        ? `Excellent choice! I'd be delighted to arrange a private viewing of ${property.title}. May I have your full name?`
        : "I'd be delighted to arrange a viewing. May I have your full name?",
      undefined,
      700
    );
  };

  const handleLocationChip = (chip: string) => {
    const area = chip === "Anywhere" ? null : chip;
    pickedArea.current = area;
    setStage("budget");
    pushBot(
      area
        ? `Great — ${area} it is! ${area === "Miami" ? "There is excellent value there." : "A wonderful choice."} Now, roughly what budget are you comfortable with?`
        : "No problem — I'll show you the finest options across America. What budget range works for you?",
      { chips: intent.current === "rent" ? RENT_BUDGET_CHIPS : BUY_BUDGET_CHIPS }
    );
  };

  const handleBudgetChip = (chip: string) => {
    const budget = parseBudget(chip);
    showMatches({ intentKind: intent.current ?? "buy", area: pickedArea.current, budget });
  };

  const handleFaq = (chip: string) => {
    const answer = FAQ_ANSWERS[chip];
    pushBot(answer ?? FAQ_ANSWERS["Are these properties real?"], {
      chips: ["Book a Viewing", "Talk to an Agent", "Search Again"],
    });
    setStage("results");
  };

  const handleFreeText = (raw: string) => {
    const text = raw.toLowerCase();

    // Enquiry collection stages
    if (stage === "enquiry-name") {
      enquiry.current.name = raw.trim();
      setStage("enquiry-phone");
      pushBot(
        `Thank you, ${raw.trim().split(" ")[0]}. And the best phone number to reach you on?`,
        undefined,
        700
      );
      return;
    }
    if (stage === "enquiry-phone") {
      const digits = raw.replace(/\D/g, "");
      if (digits.length < 7) {
        pushBot(
          "Hmm, that number looks a little short. Could you share a valid phone number (at least 7 digits)?",
          undefined,
          700
        );
        return;
      }
      enquiry.current.phone = raw.trim();
      setStage("done");
      const prop = enquiry.current.property;
      pushBot(
        `All set! Here's what I've logged:\n• Name: ${enquiry.current.name}\n• Phone: ${enquiry.current.phone}${
          prop ? `\n• Property: ${prop.title}` : ""
        }\n\nOn a live site, one of our advisors would call you within 24 hours to confirm your viewing. (This is a demonstration — no details were sent or stored.) Is there anything else I can help with?`,
        { chips: ["Common Questions", "Search Again"] },
        1000
      );
      return;
    }

    // Greetings
    if (/^(hi|hii+|hello|hey|good (morning|afternoon|evening))\b/.test(text)) {
      pushBot("Hello! Lovely to meet you. Are you looking to buy, rent, or just exploring?", {
        chips: WELCOME_CHIPS,
      });
      setStage("start");
      return;
    }

    // Thanks
    if (/\b(thank|thanks|well done|great job)\b/.test(text)) {
      pushBot("You're most welcome — it's my pleasure! Anything else I can help with?", {
        chips: MAIN_CHIPS,
      });
      return;
    }

    // Intent
    if (/\b(buy|buying|purchase|own|sale|for sale)\b/.test(text)) {
      intent.current = "buy";
      setStage("location");
      pushBot(
        "Excellent — buying! Which of our markets are you drawn to?",
        { chips: LOCATION_CHIPS }
      );
      return;
    }
    if (/\b(rent|renting|lease|letting|tenant)\b/.test(text)) {
      intent.current = "rent";
      setStage("location");
      pushBot(
        "Certainly — renting! Which of our markets would you like to live in?",
        { chips: LOCATION_CHIPS }
      );
      return;
    }

    // Viewing / enquiry
    if (/\b(view|viewing|inspect|inspection|book|schedule|appointment|visit)\b/.test(text)) {
      startEnquiry();
      return;
    }

    // Agent / contact
    if (/\b(agent|human|consultant|call|contact|speak|talk)\b/.test(text)) {
      pushBot(
        `Of course! Our consultants are wonderful people. You can reach the office on ${DEMO_CONTACT.phone} (demo line), email ${DEMO_CONTACT.email}, or leave a note on the Contact page and we'll respond within one working day.`,
        {
          chips: ["Book a Viewing", "Common Questions"],
        }
      );
      return;
    }

    // Fees
    if (/\b(fee|fees|charge|charges|commission|service charge|cost of using)\b/.test(text)) {
      handleFaq("What fees do you charge?");
      return;
    }

    // Real?
    if (/\b(real|genuine|legit|authentic|scam)\b/.test(text)) {
      handleFaq("Are these properties real?");
      return;
    }

    // Location — match any known U.S. market or neighborhood keyword on word boundaries
    const matchedArea = Object.keys(AREA_ALIASES).find((a) =>
      new RegExp(`\\b${a.replace(" ", "\\s+")}\\b`).test(text)
    );
    if (matchedArea) {
      const mapped = AREA_ALIASES[matchedArea];
      if (stage === "location") {
        handleLocationChip(mapped);
      } else {
        intent.current = intent.current ?? "buy";
        pickedArea.current = mapped;
        setStage("budget");
        pushBot(
          `${mapped} is a fantastic area! Do you have a budget in mind?`,
          { chips: intent.current === "rent" ? RENT_BUDGET_CHIPS : BUY_BUDGET_CHIPS }
        );
      }
      return;
    }

    // Budget in free text
    const budget = parseBudget(text);
    if (budget) {
      showMatches({ intentKind: intent.current ?? "buy", area: pickedArea.current, budget });
      return;
    }

    // Property type keywords
    const typeMatch = PROPERTIES.filter((p) =>
      text.includes(p.type.toLowerCase().split(" ")[0])
    );
    if (typeMatch.length > 0 && /\b(estate|villa|penthouse|townhouse|condominium|condo|mansion|chalet|apartment)\b/.test(text)) {
      pushBot("Here's what we currently have in that style:", {
        cards: typeMatch.slice(0, 3),
        chips: MAIN_CHIPS,
      });
      setStage("results");
      return;
    }

    // Property name match
    const named = PROPERTIES.find((p) =>
      p.title.toLowerCase().split(" ").some((w) => w.length > 4 && text.includes(w))
    );
    if (named) {
      pushBot(`Yes — ${named.title} is a beautiful home. Here are the details:`, {
        cards: [named],
        chips: ["Book a Viewing", "Search Again"],
      });
      setStage("results");
      return;
    }

    // Fallback
    pushBot(
      "I'm not entirely sure I follow — but I'm great at finding homes! Try telling me: are you looking to buy or rent, and in which area? Or pick an option below.",
      { chips: WELCOME_CHIPS }
    );
  };

  const handleChip = (chip: string) => {
    pushUser(chip);
    if (stage === "enquiry-name" || stage === "enquiry-phone") {
      handleFreeText(chip);
      return;
    }
    if (WELCOME_CHIPS.includes(chip)) {
      if (chip === "Looking to Buy") {
        intent.current = "buy";
        setStage("location");
        pushBot("Excellent — buying! Which of our markets are you drawn to?", {
          chips: LOCATION_CHIPS,
        });
      } else if (chip === "Looking to Rent") {
        intent.current = "rent";
        setStage("location");
        pushBot("Certainly — renting! Which of our markets would you like to live in?", {
          chips: LOCATION_CHIPS,
        });
      } else {
        setStage("faq");
        pushBot("Happy to answer! Pick a question below:", { chips: FAQ_CHIPS });
      }
      return;
    }
    if (LOCATION_CHIPS.includes(chip)) {
      handleLocationChip(chip);
      return;
    }
    if (BUY_BUDGET_CHIPS.includes(chip) || RENT_BUDGET_CHIPS.includes(chip)) {
      handleBudgetChip(chip);
      return;
    }
    if (FAQ_CHIPS.includes(chip)) {
      handleFaq(chip);
      return;
    }
    if (chip === "Book a Viewing") {
      startEnquiry();
      return;
    }
    if (chip === "Talk to an Agent") {
      pushBot(
        `Of course! Our consultants are wonderful people. You can reach the office on ${DEMO_CONTACT.phone} (demo line), or send a message via the Contact page — we reply within one working day.`,
        { chips: ["Book a Viewing", "Common Questions", "Search Again"] }
      );
      return;
    }
    if (chip === "Search Again") {
      intent.current = null;
      pickedArea.current = null;
      setStage("start");
      pushBot("Let's search again! Are you looking to buy or rent?", { chips: WELCOME_CHIPS });
      return;
    }
    if (chip === "Common Questions") {
      setStage("faq");
      pushBot("Happy to answer! Pick a question below:", { chips: FAQ_CHIPS });
      return;
    }
    handleFreeText(chip);
  };

  const submitInput = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    pushUser(text);
    handleFreeText(text);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? "Close concierge chat" : "Open concierge chat"}
        className={cn(
          "fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-navy shadow-[0_10px_30px_-6px_rgba(20,43,59,0.5)] transition-all duration-300 hover:scale-105 hover:bg-gold-deep hover:text-ivory",
          open && "rotate-90 bg-navy text-ivory"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && unread && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-destructive" aria-hidden="true" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={cn(
          "fixed bottom-[88px] right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-[380px] origin-bottom-right flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-12px_rgba(13,31,43,0.55)] ring-1 ring-navy/10 transition-all duration-300 sm:right-5",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        )}
        style={{ height: "min(600px, calc(100dvh - 120px))" }}
        role="dialog"
        aria-label="Havenstone concierge chat"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-navy px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-navy-soft font-serif text-gold ring-1 ring-gold/50">
              A
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy bg-emerald-400" aria-hidden="true" />
            </span>
            <div>
              <p className="font-serif text-[0.95rem] text-ivory">Havenstone Concierge</p>
              <p className="text-[0.7rem] text-ivory/55">Ada · Typically replies instantly</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={resetChat}
              aria-label="Restart conversation"
              title="Restart conversation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ivory/70 transition-colors hover:bg-navy-soft hover:text-gold"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ivory/70 transition-colors hover:bg-navy-soft hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="chat-scroll flex-1 space-y-4 overflow-y-auto bg-ivory px-4 py-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.sender === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                  m.sender === "user"
                    ? "rounded-br-sm bg-navy text-ivory"
                    : "rounded-bl-sm bg-white text-charcoal ring-1 ring-border"
                )}
              >
                {m.text && (
                  <p className="whitespace-pre-line">{m.text}</p>
                )}
                {m.cards && m.cards.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.cards.map((c) => (
                      <a
                        key={c.id}
                        href={ROUTES.property(c.id)}
                        onClick={() => setOpen(false)}
                        className="group flex items-stretch gap-3 rounded-xl border border-border bg-white p-2 transition-all hover:border-gold/60 hover:shadow-md"
                      >
                        <img
                          src={c.images[0]}
                          alt={c.title}
                          className="h-16 w-20 shrink-0 rounded-lg object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-serif text-[0.82rem] font-semibold text-navy">
                            {c.title}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1 text-[0.7rem] text-slate-mute">
                            <MapPin className="h-3 w-3 text-gold" aria-hidden="true" />
                            {c.location}
                          </span>
                          <span className="mt-1 flex items-center justify-between gap-2">
                            <span className="text-[0.75rem] font-semibold text-gold-deep">
                              {priceLabel(c)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-navy group-hover:text-gold-deep">
                              View
                            </span>
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                )}
                {m.chips && m.chips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.chips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleChip(chip)}
                        className="rounded-full border border-gold/50 bg-gold-tint px-3 py-1.5 text-xs font-medium text-navy transition-colors hover:bg-gold hover:text-navy"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-border" aria-label="Ada is typing">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gold [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={submitInput}
          className="flex items-center gap-2 border-t border-border bg-white px-3 py-3"
        >
          <label htmlFor="chat-input" className="sr-only">
            Message the concierge
          </label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            autoComplete="off"
            className="h-11 min-w-0 flex-1 rounded-full border border-border bg-ivory px-4 text-sm text-charcoal placeholder:text-slate-mute/60 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-navy transition-all hover:bg-gold-deep hover:text-ivory disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </>
  );
}
