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

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [deletePassword, setDeletePassword] = useState("");

  // Mock user data
  const userEvents = mockEvents.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={true} userName="Александр" />
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
                        {/*<AvatarImage src="https://images.unsplash.com/photo-1712168567852-ea607c2d3177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Александр" />*/}
                        <AvatarImage src={"https://static.vecteezy.com/system/resources/previews/019/879/198/non_2x/user-icon-on-transparent-background-free-png.png"} alt="Александр" className="object-contain"/>
                        <AvatarFallback>А</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="hover:cursor-pointer">Изменить фото</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Имя</Label>
                        <Input id="firstName" defaultValue="Александр" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input id="lastName" defaultValue="Иванов" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="alexander@example.com" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input id="phone" type="tel" defaultValue="+7 (999) 123-45-67" className="mt-2" />
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