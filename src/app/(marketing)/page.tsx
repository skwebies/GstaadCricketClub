import { createAdminClient } from "@/infrastructure/supabase/admin";
import { ScrollSpyNav } from "@/shared/components/marketing/ScrollSpyNav";
import { SinglePageHero } from "@/shared/components/marketing/SinglePageHero";
import { AboutSection } from "@/shared/components/marketing/AboutSection";
import { EventsSection } from "@/shared/components/marketing/EventsSection";
import { RegistrationSection } from "@/shared/components/marketing/RegistrationSection";
import { MembershipSection } from "@/shared/components/marketing/MembershipSection";
import { ContactSection } from "@/shared/components/marketing/ContactSection";
import { Footer } from "@/shared/components/marketing/Footer";

export const dynamic = "force-dynamic";

export default async function PublicSinglePage() {
  const supabase = createAdminClient();

  // Fetch active events from Supabase for live event dropdown
  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .order("start_date", { ascending: true });

  const eventOptions = (events || []).map((e) => ({
    id: e.id,
    title: e.title,
  }));

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      {/* 1. Sticky Glassmorphism Header with Scroll-Spy */}
      <ScrollSpyNav />

      {/* Main Single-Page Sections */}
      <main id="main-content" className="flex-1">
        {/* 1. #hero */}
        <SinglePageHero />

        {/* 2. #about */}
        <AboutSection />

        {/* 3. #events */}
        <EventsSection />

        {/* 4. #register */}
        <RegistrationSection events={eventOptions} />

        {/* 5. #membership */}
        <MembershipSection />

        {/* 6. #contact */}
        <ContactSection />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
