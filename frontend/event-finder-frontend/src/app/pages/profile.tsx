import { useState } from "react";
import { User, Calendar, MessageSquare, Settings, AlertTriangle } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
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
import { mockEvents } from "../data/mock-data";
import { EventCard } from "../components/event-card";
import {Map} from "@pbe/react-yandex-maps";

// Mock user profile data
const mockUserProfile = {
  firstName: "Александр",
  lastName: "Иванов",
  fullName: "Александр",
  email: "alexander@example.com",
  phone: "+7 (999) 123-45-67",
  avatarUrl: "https://static.vecteezy.com/system/resources/previews/019/879/198/non_2x/user-icon-on-transparent-background-free-png.png",
  userEvents: mockEvents.slice(0, 2),
  biography: "Люблю путешествия, фотографию и активный отдых. Организую мероприятия для единомышленников.",
};

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [deletePassword, setDeletePassword] = useState("");
  const [formData, setFormData] = useState({
    firstName: mockUserProfile.firstName,
    lastName: mockUserProfile.lastName,
    email: mockUserProfile.email,
    phone: mockUserProfile.phone,
    biography: mockUserProfile.biography,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Mock user data
  const userEvents = mockUserProfile.userEvents;

  return (
      <div className="min-h-screen flex flex-col">
        <Header isAuthenticated={true} userName={mockUserProfile.fullName} />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8">Профиль</h1>

            {/* Mobile Tabs */}
            <div className="lg:hidden mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="personal">Личные данные</TabsTrigger>
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
                      Личные данные
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
                          <h2 className="mb-4">Личные данные</h2>
                        </div>

                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.fullName} className="object-contain"/>
                            <AvatarFallback>{mockUserProfile.firstName[0]}</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" className="hover:cursor-pointer">Изменить фото</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">Имя</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Фамилия</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Телефон</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-2"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="biography">О себе</Label>
                          <textarea
                              id="biography"
                              value={formData.biography}
                              onChange={handleInputChange}
                              className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-[100px] mt-2"
                              placeholder="Расскажите о себе..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="location">Локация</Label>
                          <div id="location" className="mt-2">
                            <Map
                                defaultState={{ center: [53.90, 27.58], zoom: 11 }}
                                width="100%"
                                height="400px"
                            />
                          </div>
                        </div>

                        <Button style={{ backgroundColor: 'var(--primary-color)'}} className="hover:cursor-pointer hover:opacity-90 w-full">
                          Сохранить изменения
                        </Button>
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

                        {userEvents.length > 0 ? (
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

                        <div className="text-center py-12 text-muted-foreground">
                          У вас пока нет отзывов
                        </div>
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