import { useParams, Link } from "react-router";
import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { mockEvents, mockOrganizers, mockReviews } from "../data/mock-data";
import { EventCard } from "../components/event-card";
import { ReviewItem } from "../components/review-item";

export function EventDetailPage() {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated={true} userName="Александр" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2>Мероприятие не найдено</h2>
            <Button asChild className="mt-4">
              <Link to="/">На главную</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const organizer = mockOrganizers.find((o) => o.id === event.organizerId);
  const organizerEvents = mockEvents.filter(
    (e) => e.organizerId === event.organizerId && e.id !== event.id
  ).slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric' 
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} userName="Александр" />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Event Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge style={{ backgroundColor: 'var(--primary-color)' }}>
                {event.category}
              </Badge>
            </div>
            <h1 className="mb-4">{event.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Description */}
              <div>
                <h2 className="mb-4">Описание</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>

              {/* Location Map Placeholder */}
              <div>
                <h2 className="mb-4">Место проведения</h2>
                <div className="bg-muted rounded-lg p-8 text-center h-64 flex items-center justify-center">
                  <div>
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">{event.location}</p>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                  </div>
                </div>
              </div>

              {/* Other Events from Organizer */}
              {organizerEvents.length > 0 && (
                <div>
                  <h2 className="mb-4">Другие мероприятия этого организатора</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organizerEvents.map((evt) => (
                      <EventCard key={evt.id} event={evt} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {organizer && (
                <div>
                  <h2 className="mb-4">Отзывы об организаторе</h2>
                  <div className="space-y-4">
                    {mockReviews.slice(0, 3).map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Event Info Card */}
                <div className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Дата</p>
                      <p>{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Время</p>
                      <p>{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Место</p>
                      <p>{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Места</p>
                      <p>
                        {event.availableSpots} из {event.totalSpots} свободно
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    Записаться
                  </Button>
                </div>

                {/* Organizer Card */}
                {organizer && (
                  <Link
                    to={`/organizers/${organizer.id}`}
                    className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="mb-4">Организатор</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={organizer.avatar} alt={organizer.name} />
                        <AvatarFallback>{organizer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4>{organizer.name}</h4>
                        <div className="flex items-center gap-1">
                          {renderStars(organizer.rating)}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({organizer.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {organizer.description}
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}