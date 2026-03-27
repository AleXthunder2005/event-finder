import { Header } from "../components/header";
import { HeroBanner } from "../components/hero-banner";
import { EventFeed } from "../components/event-feed";
import { Footer } from "../components/footer";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} userName="Александр" />
      <main className="flex-1">
        <HeroBanner />
        <EventFeed />
      </main>
      <Footer />
    </div>
  );
}
