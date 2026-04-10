import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Star, Loader2 } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { EventCard } from "../components/event-card";
import { ReviewItem } from "../components/review-item";
import { useAuth } from "../context/AuthContext";
import { eventsService } from "../services/eventsService";
import { reviewsService } from "../services/reviewsService";
import { EventEntity } from "../entities/event.types";
import { ReviewEntity } from "../entities/review.types";

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, userId } = useAuth();
  const [event, setEvent] = useState<EventEntity | null>(null);
  const [organizerEvents, setOrganizerEvents] = useState<EventEntity[]>([]);
  const [reviews, setReviews] = useState<ReviewEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (token && id) {
      loadEventData();
    }
  }, [token, id]);

  const loadEventData = async () => {
    if (!token || !id) return;

    setLoading(true);
    setError(null);

    try {
      const eventData = await eventsService.getEventById(id, token);
      setEvent(eventData);

      // Проверяем, зарегистрирован ли пользователь
      if (userId) {
        const userEvents = await eventsService.getUserRegisteredEvents(token);
        setIsRegistered(userEvents.some(e => e.id === eventData.id));
      }

      // Load other events from same organizer
      const organizerEventsData = await eventsService.getEventsByOrganizer(eventData.organizerId, token);
      setOrganizerEvents(organizerEventsData.filter(e => e.id !== eventData.id).slice(0, 3));

      // Load reviews for organizer
      const organizerReviews = await reviewsService.getReviewsByOrganizer(eventData.organizerId, token);
      setReviews(organizerReviews.slice(0, 3));
    } catch (err: any) {
      console.error("Failed to load event:", err);
      if (err.status === 404) {
        setError("Мероприятие не найдено");
      } else {
        setError("Не удалось загрузить мероприятие");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!token || !id) return;

    setRegistering(true);
    try {
      await eventsService.registerForEvent(id, token);
      await loadEventData(); // Reload event data to update spots
      alert("Вы успешно записались на мероприятие!");
    } catch (err: any) {
      console.error("Failed to register for event:", err);
      if (err.status === 400) {
        alert("Нет свободных мест");
      } else if (err.status === 409) {
        alert("Вы уже записаны на это мероприятие");
      } else {
        alert("Не удалось записаться на мероприятие");
      }
    } finally {
      setRegistering(false);
    }
  };

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

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header isAuthenticated={true} userName="Загрузка..." />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary-color)]" />
          </div>
          <Footer />
        </div>
    );
  }

  if (error || !event) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header isAuthenticated={true} userName="Ошибка" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="mb-4">{error || "Мероприятие не найдено"}</h2>
              <Button asChild className="mt-4">
                <Link to="/">На главную</Link>
              </Button>
            </div>
          </div>
          <Footer />
        </div>
    );
  }

  const isOrganizer = event.organizerId === userId;

  return (
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated={true} userName="Пользователь" />
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
                <div>
                  <h2 className="mb-4">Отзывы об организаторе</h2>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))}
                    {reviews.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          Пока нет отзывов об этом организаторе
                        </p>
                    )}
                  </div>
                </div>
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

                    {!isOrganizer && (
                        <Button
                            className="w-full"
                            size="lg"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                            onClick={handleRegister}
                            disabled={registering || isRegistered || event.availableSpots === 0}
                        >
                          {registering ? "Запись..." : isRegistered ? "Вы уже записаны" : event.availableSpots === 0 ? "Нет мест" : "Записаться"}
                        </Button>
                    )}

                    {isOrganizer && (
                        <Button
                            className="w-full"
                            size="lg"
                            variant="outline"
                            onClick={() => navigate(`/events/${event.id}/edit`)}
                        >
                          Редактировать мероприятие
                        </Button>
                    )}
                  </div>

                  {/* Organizer Card */}
                  <Link
                      to={`/organizers/${event.organizerId}`}
                      className="block border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="mb-4">Организатор</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={event.organizerAvatar} alt={event.organizerName} />
                        <AvatarFallback>{event.organizerName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4>{event.organizerName}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}