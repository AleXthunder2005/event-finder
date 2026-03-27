import { Link } from "react-router";
import { Button } from "./ui/button";

export function HeroBanner() {
  const scrollToEvents = (e: React.MouseEvent) => {
    e.preventDefault();
    const eventsSection = document.getElementById('events');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl mb-6">
          Спланируй крутой вечер уже сейчас
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          Находи интересные мероприятия в твоем городе и создавай незабываемые впечатления
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={scrollToEvents}
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            Смотреть мероприятия
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            <Link to="/organizers/org1">Стать организатором</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}