import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Star, Loader2, Send, X } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { EventCard } from "../components/event-card";
import { ReviewItem } from "../components/review-item";
import { StarRating } from "../components/star-rating";
import { Map, Placemark, SearchControl, useYMaps } from "@pbe/react-yandex-maps";
import { useAuth } from "../context/AuthContext";
import { eventsService } from "../services/eventsService";
import { reviewsService } from "../services/reviewsService";
import { profileService } from "../services/profileServise";
import { EventEntity } from "../entities/event.types";
import { ReviewEntity } from "../entities/review.types";
import { ProfileEntity } from "../entities/profile.types";

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
  const [cancelling, setCancelling] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileEntity | null>(null);

  const ymaps = useYMaps(["geocode"]);

  useEffect(() => {
    if (token && id) {
      loadEventData();
      loadUserProfile();
    }
  }, [token, id]);

  const loadUserProfile = async () => {
    if (!token) return;
    try {
      const profile = await profileService.getProfile(token);
      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

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

  const handleCancelRegistration = async () => {
    if (!token || !id) return;

    setCancelling(true);
    try {
      await eventsService.cancelEventRegistration(id, token);
      await loadEventData(); // Reload event data to update spots
      alert("Вы успешно отменили запись на мероприятие");
    } catch (err: any) {
      console.error("Failed to cancel registration:", err);
      alert("Не удалось отменить запись");
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!token || !userId || !event || !userProfile) return;

    if (!reviewComment.trim()) {
      alert("Пожалуйста, напишите комментарий");
      return;
    }

    setSubmittingReview(true);
    try {
      const newReview: ReviewEntity = {
        userId: userId,
        eventId: event.id!,
        userName: userProfile.userName || userProfile.alias || "Пользователь",
        userAvatar: userProfile.avatarUrl,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString(),
      };

      await reviewsService.createReview(newReview, token);

      // Reset form and reload reviews
      setReviewRating(5);
      setReviewComment("");
      setShowReviewForm(false);
      await loadEventData(); // Reload to get updated reviews
      alert("Отзыв успешно добавлен!");
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      alert("Не удалось отправить отзыв");
    } finally {
      setSubmittingReview(false);
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
  const isFullyBooked = event.availableSpots === 0;

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
                      src={event.image || "/placeholder-event.jpg"}
                      alt={event.title}
                      className="w-full h-96 object-cover"
                  />
                </div>

                {/* Description */}
                <div>
                  <h2 className="mb-4">Описание</h2>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>

                {/* Location Map with Yandex Maps */}
                <div>
                  <h2 className="mb-4">Место проведения</h2>
                  <div className="rounded-lg overflow-hidden border">
                    <Map
                        defaultState={{
                          center: event.coordinates || [53.90, 27.58],
                          zoom: 15
                        }}
                        width="100%"
                        height="400px"
                        options={{ draggable: false }}
                    >
                      {event.coordinates && (
                          <Placemark
                              geometry={event.coordinates}
                              options={{
                                preset: 'islands#redDotIcon',
                              }}
                          />
                      )}
                      <SearchControl options={{ float: "right" }} />
                    </Map>
                    <div className="p-4 bg-muted/30">
                      <p className="font-semibold">{event.location}</p>
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

                {/* Reviews Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2>Отзывы об организаторе</h2>
                    {!isOrganizer && userId && !showReviewForm && (
                        <Button
                            variant="outline"
                            onClick={() => setShowReviewForm(true)}
                        >
                          Написать отзыв
                        </Button>
                    )}
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                      <div className="border rounded-lg p-6 mb-6 bg-muted/30">
                        <div className="flex justify-between items-center mb-4">
                          <h3>Ваш отзыв</h3>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowReviewForm(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Рейтинг</Label>
                            <div className="mt-2">
                              <StarRating
                                  rating={reviewRating}
                                  maxRating={5}
                                  interactive={true}
                                  onRate={setReviewRating}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="comment">Комментарий</Label>
                            <Textarea
                                id="comment"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Поделитесь впечатлениями об организаторе..."
                                className="mt-2"
                                rows={4}
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowReviewForm(false)}
                            >
                              Отмена
                            </Button>
                            <Button
                                onClick={handleSubmitReview}
                                disabled={submittingReview || !reviewComment.trim()}
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              {submittingReview ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                  <Send className="h-4 w-4 mr-2" />
                              )}
                              Отправить отзыв
                            </Button>
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewItem
                            key={review.id}
                            review={review}
                            onClick={() => navigate(`/events/${review.eventId}`)}
                        />
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
                        <p className="font-semibold">
                          {event.availableSpots} из {event.totalSpots} свободно
                        </p>
                        {event.totalSpots && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div
                                  className="bg-[var(--primary-color)] h-2 rounded-full transition-all"
                                  style={{
                                    width: `${((event.totalSpots - (event.availableSpots || 0)) / event.totalSpots) * 100}%`
                                  }}
                              />
                            </div>
                        )}
                      </div>
                    </div>

                    {!isOrganizer && (
                        <>
                          {!isRegistered ? (
                              <Button
                                  className="w-full"
                                  size="lg"
                                  style={{ backgroundColor: 'var(--primary-color)' }}
                                  onClick={handleRegister}
                                  disabled={registering || isFullyBooked}
                              >
                                {registering ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : isFullyBooked ? (
                                    "Нет мест"
                                ) : (
                                    "Записаться"
                                )}
                              </Button>
                          ) : (
                              <Button
                                  className="w-full"
                                  size="lg"
                                  variant="destructive"
                                  onClick={handleCancelRegistration}
                                  disabled={cancelling}
                              >
                                {cancelling ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    "Отменить запись"
                                )}
                              </Button>
                          )}
                        </>
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
                        <AvatarFallback>{event.organizerName?.[0] || "О"}</AvatarFallback>
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