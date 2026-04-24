import { useState, useEffect } from "react";
import { User, Calendar, MessageSquare, Settings, AlertTriangle, Loader2, Edit2, X, Check } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { EventCard } from "../components/event-card";
import { Map, Placemark, SearchControl, useYMaps } from "@pbe/react-yandex-maps";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services/profileServise";
import { reviewsService} from "../services/reviewsService";
import { ReviewItem } from "../components/review-item";
import { eventsService } from "../services/eventsService";
import { EventEntity } from "../entities/event.types";
import { ProfileEntity } from "../entities/profile.types";
import {ReviewEntity} from "../entities/review.types";

export function ProfilePage() {
  const { token, logout, userId } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileEntity | null>(null);
  const [userReviews, setUserReviews] = useState<ReviewEntity[]>([]);
  const [userEvents, setUserEvents] = useState<EventEntity[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<ProfileEntity, 'id' | 'email' | 'avatarUrl'>>({
    userName: "",
    alias: "",
    phone: "",
    biography: "",
    coordinates: null,
    address: null,
  });
  const ymaps = useYMaps(["geocode"]);

  useEffect(() => {
    if (token && userId) {
      profileService.setUserId(userId);
      reviewsService.setCurrentUserId(userId);
      eventsService.setCurrentUserId(userId);
      loadProfile();
    }
  }, [token, userId]);

  const handleMapClick = (e: any) => {
    if (!isEditing) return;

    const coords = e.get("coords");
    if (coords) {
      setFormData(prev => ({ ...prev, coordinates: coords }));
    }

    if (ymaps) {
      ymaps
          .geocode(coords)
          .then((result: any) => {
            const firstGeoObject = result.geoObjects.get(0);
            if (firstGeoObject) {
              const location = firstGeoObject.getLocalities().length > 0
                  ? firstGeoObject.getLocalities()[0]
                  : firstGeoObject.getAdministrativeAreas()[0] || "";

              const route = firstGeoObject.getThoroughfare() || firstGeoObject.getPremiseName() || "";

              const fullAddress = [location, route].filter(Boolean).join(", ");

              setFormData(prev => ({ ...prev, address: fullAddress || null }));
            }
          })
          .catch((err: any) => {
            console.error("GEOCODE RESOLVING ERROR: " + err);
          });
    }
  };

  const loadProfile = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const userProfile: ProfileEntity = await profileService.getProfile(token);

      setProfile(userProfile);

      setFormData({
        userName: userProfile.userName,
        alias: userProfile.alias,
        phone: userProfile.phone,
        biography: userProfile.biography,
        coordinates: userProfile.coordinates || null,
        address: userProfile.address || null,
      });

      if (userId) {
        await Promise.all([
          loadUserReviews(),
          loadUserEvents()
        ]);
      }
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      setError("Не удалось загрузить данные профиля");
      if (err.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserReviews = async () => {
    if (!token || !userId) return;

    setReviewsLoading(true);
    try {
      const reviews = await reviewsService.getUserReviews(userId, token);
      setUserReviews(reviews);
    } catch (err: any) {
      console.error("Failed to load reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadUserEvents = async () => {
    if (!token) return;

    setEventsLoading(true);
    try {
      const events = await eventsService.getUserRegisteredEvents(token);
      setUserEvents(events);
    } catch (err: any) {
      console.error("Failed to load user events:", err);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        userName: profile.userName,
        alias: profile.alias,
        phone: profile.phone,
        biography: profile.biography,
        coordinates: profile.coordinates || null,
        address: profile.address || null,
      });
    }
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!token || !profile) return;

    setSaving(true);
    setError(null);

    try {
      const updatedProfile: ProfileEntity = await profileService.updateProfile(token, {
        id: profile.id,
        userName: formData.userName,
        alias: formData.alias,
        email: profile.email,
        phone: formData.phone,
        biography: formData.biography,
        coordinates: formData.coordinates,
        address: formData.address,
        avatarUrl: profile.avatarUrl,
      });

      setProfile(updatedProfile);

      setFormData({
        userName: updatedProfile.userName,
        alias: updatedProfile.alias,
        phone: updatedProfile.phone,
        biography: updatedProfile.biography,
        coordinates: formData.coordinates || updatedProfile.coordinates || null,
        address: formData.address || updatedProfile.address || null,
      });

      setIsEditing(false);
      alert("Профиль успешно обновлен!");
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError("Не удалось сохранить изменения");
      if (err.status === 401) {
        logout();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!token) return;

    try {
      await profileService.deleteProfile(token, deletePassword);
      alert("Профиль успешно удален");
      logout();
    } catch (err: any) {
      console.error("Failed to delete profile:", err);
      if (err.status === 401) {
        alert("Неверный пароль");
      } else {
        alert("Не удалось удалить профиль");
      }
    }
  };

  const formatCoordinates = (coords: [number, number] | null | undefined): string => {
    if (!coords || coords.length < 2) return "Координаты не заданы";
    return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
  };

  const formatAddress = (address: string | null | undefined): string => {
    if (!address) return "Адрес не задан";
    return address;
  };

  // Получаем данные для отображения в зависимости от режима
  const displayData = isEditing ? formData : profile || formData;
  const mapCoordinates = isEditing ? formData.coordinates : profile?.coordinates;

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header isAuthenticated={true} userName="Загрузка..." />
          <main className="flex-1 bg-muted/30 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary-color)]" />
          </main>
          <Footer />
        </div>
    );
  }

  if (error || !profile) {
    return (
        <div className="min-h-screen flex flex-col">
          <Header isAuthenticated={true} userName="Ошибка" />
          <main className="flex-1 bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Произошла ошибка"}</p>
              <Button onClick={loadProfile}>Попробовать снова</Button>
            </div>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated={true} userName={profile.userName} />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="mb-0">Профиль</h1>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="personal">Профиль</TabsTrigger>
                  <TabsTrigger value="events">Мероприятия</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Menu - Desktop Only */}
              <div className="lg:col-span-1 hidden lg:block">
                <div className="bg-card border rounded-lg p-4 sticky top-20">
                  <nav className="space-y-2">
                    <Button
                        variant={activeTab === "personal" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("personal")}
                        style={activeTab === "personal" ? { backgroundColor: 'var(--primary-color)' } : {}}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Профиль
                    </Button>
                    <Button
                        variant={activeTab === "events" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("events")}
                        style={activeTab === "events" ? { backgroundColor: 'var(--primary-color)' } : {}}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Мои мероприятия
                    </Button>
                    <Button
                        variant={activeTab === "reviews" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("reviews")}
                        style={activeTab === "reviews" ? { backgroundColor: 'var(--primary-color)' } : {}}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Мои отзывы
                    </Button>
                    <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("settings")}
                        style={activeTab === "settings" ? { backgroundColor: 'var(--primary-color)' } : {}}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки
                    </Button>
                    <div className="pt-4 border-t">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Удалить профиль
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Ваш профиль и все связанные данные будут удалены навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Label htmlFor="password">Введите пароль для подтверждения</Label>
                            <Input
                                id="password"
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Ваш пароль"
                                className="mt-2"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={!deletePassword}
                                onClick={handleDeleteProfile}
                            >
                              Удалить профиль
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <div className="bg-card border rounded-lg p-6">
                  {activeTab === "personal" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="mb-4">Профиль</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="userName">Имя пользователя</Label>
                            <Input
                                id="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                className="mt-2 disabled:border-gray-300 disabled:bg-gray-50"
                                disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="alias">Псевдоним</Label>
                            <Input
                                id="alias"
                                value={formData.alias}
                                onChange={handleInputChange}
                                className="mt-2 disabled:border-gray-300 disabled:bg-gray-50"
                                disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                className="mt-2 disabled:border-gray-300 disabled:bg-gray-50"
                                disabled
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Телефон</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-2 disabled:border-gray-300 disabled:bg-gray-50"
                                disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="biography">О себе</Label>
                          <textarea
                              id="biography"
                              value={formData.biography}
                              onChange={handleInputChange}
                              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-[100px] mt-2 disabled:border-gray-300 disabled:bg-gray-50"
                              placeholder="Расскажите о себе..."
                              disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="location" className="mb-2 block">Локация</Label>
                          <div id="location">
                            <Map
                                defaultState={{ center: [53.90, 27.58], zoom: 11 }}
                                width="100%"
                                height="400px"
                                onClick={handleMapClick}
                                options={{ draggable: isEditing }}
                            >
                              {mapCoordinates && <Placemark geometry={mapCoordinates} />}
                              <SearchControl options={{ float: "right" }} />
                            </Map>
                            {!isEditing && (
                                <p className="text-sm text-muted-foreground mt-2 text-center">
                                  Нажмите "Редактировать профиль" чтобы изменить локацию
                                </p>
                            )}
                          </div>
                        </div>

                        {/* Отображение адреса и координат */}
                        <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                          <div>
                            <Label className="text-sm font-semibold">Адрес</Label>
                            <p className="mt-1 text-muted-foreground">
                              {formatAddress(displayData.address)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">Координаты</Label>
                            <p className="mt-1 text-muted-foreground">
                              {formatCoordinates(displayData.coordinates)}
                            </p>
                          </div>
                        </div>

                        {/* Кнопки внизу */}
                        {!isEditing ? (
                            <Button
                                onClick={handleEditProfile}
                                style={{ backgroundColor: 'var(--primary-color)' }}
                                className="hover:cursor-pointer hover:opacity-90 w-full"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Редактировать профиль
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                              <Button
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                  className="hover:cursor-pointer flex-1"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Отмена
                              </Button>
                              <Button
                                  onClick={handleSaveProfile}
                                  disabled={saving}
                                  style={{ backgroundColor: 'var(--primary-color)' }}
                                  className="hover:cursor-pointer hover:opacity-90 flex-1"
                              >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                {saving ? "Сохранение..." : "Сохранить изменения"}
                              </Button>
                            </div>
                        )}
                      </div>
                  )}

                  {activeTab === "events" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="mb-4">Мои мероприятия</h2>
                          <p className="text-muted-foreground mb-6">
                            Мероприятия, на которые вы записались
                          </p>
                        </div>

                        {eventsLoading ? (
                            <div className="flex justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-[var(--primary-color)]" />
                            </div>
                        ) : userEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {userEvents.map((event) => (
                                  <EventCard key={event.id} event={event} />
                              ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                              Вы еще не записались ни на одно мероприятие
                            </div>
                        )}
                      </div>
                  )}

                  {activeTab === "reviews" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="mb-4">Мои отзывы</h2>
                          <p className="text-muted-foreground mb-6">
                            Отзывы, которые вы оставили об организаторах
                          </p>
                        </div>

                        {reviewsLoading ? (
                            <div className="flex justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-[var(--primary-color)]" />
                            </div>
                        ) : userReviews.length > 0 ? (
                            <div className="space-y-4">
                              {userReviews.map((review) => (
                                  <ReviewItem key={review.id} review={review} />
                              ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                              У вас пока нет отзывов
                            </div>
                        )}
                      </div>
                  )}

                  {activeTab === "settings" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="mb-4">Настройки</h2>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="mb-2">Изменить пароль</h3>
                            <div className="space-y-3 max-w-md">
                              <div>
                                <Label htmlFor="currentPassword">Текущий пароль</Label>
                                <Input id="currentPassword" type="password" className="mt-2" />
                              </div>
                              <div>
                                <Label htmlFor="newPassword">Новый пароль</Label>
                                <Input id="newPassword" type="password" className="mt-2" />
                              </div>
                              <div>
                                <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                                <Input id="confirmPassword" type="password" className="mt-2" />
                              </div>
                              <Button style={{ backgroundColor: 'var(--primary-color)' }}>
                                Изменить пароль
                              </Button>
                            </div>
                          </div>

                          <div className="pt-6 border-t">
                            <h3 className="mb-2">Уведомления</h3>
                            <div className="space-y-3 max-w-md">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="emailNotif">Email уведомления</Label>
                                <input type="checkbox" id="emailNotif" defaultChecked className="h-4 w-4" />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label htmlFor="newsNotif">Новости и акции</Label>
                                <input type="checkbox" id="newsNotif" className="h-4 w-4" />
                              </div>
                            </div>
                          </div>

                          <div className="pt-6 border-t lg:hidden">
                            <h3 className="mb-4">Опасная зона</h3>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Удалить профиль
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Это действие нельзя отменить. Ваш профиль и все связанные данные будут удалены навсегда.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                  <Label htmlFor="password-mobile">Введите пароль для подтверждения</Label>
                                  <Input
                                      id="password-mobile"
                                      type="password"
                                      value={deletePassword}
                                      onChange={(e) => setDeletePassword(e.target.value)}
                                      placeholder="Ваш пароль"
                                      className="mt-2"
                                  />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      disabled={!deletePassword}
                                      onClick={handleDeleteProfile}
                                  >
                                    Удалить профиль
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
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