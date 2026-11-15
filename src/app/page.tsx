"use client";

import { useEffect } from "react";
import { useRoute } from "@/lib/router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Chatbot } from "@/components/site/chatbot";
import { HomeView } from "@/components/views/home-view";
import { ListingsView } from "@/components/views/listings-view";
import { PropertyView } from "@/components/views/property-view";
import { AboutView } from "@/components/views/about-view";
import { ContactView } from "@/components/views/contact-view";

export default function Page() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.key]);

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar route={route} />
      <main className="flex-1">
        {route.name === "home" && <HomeView />}
        {route.name === "properties" && <ListingsView key={route.key} query={route.query} />}
        {route.name === "property" && <PropertyView key={route.key} id={route.id} />}
        {route.name === "about" && <AboutView />}
        {route.name === "contact" && <ContactView />}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
