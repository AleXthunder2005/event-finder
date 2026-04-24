import {EventEntity} from "../entities/event.types";
import {ReviewEntity} from "../entities/review.types";


export const mockEvents: EventEntity[] = [
  {
    id: "1",
    title: "Мастер-класс по фотографии",
    description: "Научитесь делать профессиональные фотографии на смартфон. В программе: композиция, освещение, обработка. Подходит для начинающих.",
    date: "2026-03-20",
    time: "18:00",
    location: "Творческое пространство LOFT",
    address: "ул. Пушкина, 10",
    category: "Образование",
    image: "https://images.unsplash.com/photo-1572028629184-6ecbfc2fcb86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHdvcmtzaG9wJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzczNDA2NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1572028629184-6ecbfc2fcb86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHdvcmtzaG9wJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzczNDA2NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    organizerId: "org1",
    organizerName: "Студия CreativeSpace",
    organizerAvatar: "https://images.unsplash.com/photo-1760780567530-389d8a3fba75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzMzNjEzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableSpots: 8,
    totalSpots: 15,
    coordinates: [55.751244, 37.618423],
    amIMember: true,
  },
  {
    id: "2",
    title: "Вечер настольных игр",
    description: "Присоединяйтесь к нашему еженедельному вечеру настольных игр! Играем в классику и новинки. Напитки и закуски включены.",
    date: "2026-03-15",
    time: "19:00",
    location: "Антикафе GameZone",
    address: "пр. Ленина, 45",
    category: "Развлечения",
    image: "https://images.unsplash.com/photo-1506954673998-b077f05b13c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwZ3JvdXAlMjBmcmllbmRzfGVufDF8fHx8MTc3MzQwNjQ0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1506954673998-b077f05b13c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwZ3JvdXAlMjBmcmllbmRzfGVufDF8fHx8MTc3MzQwNjQ0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    organizerId: "org2",
    organizerName: "GameZone Events",
    organizerAvatar: "https://images.unsplash.com/photo-1772587002840-30b82d74fbf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBldmVudCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableSpots: 12,
    totalSpots: 20,
    coordinates: [55.751244, 37.618423],
    amIMember: true,
  },
  {
    id: "3",
    title: "Йога на рассвете",
    description: "Начните день с энергии! Практика йоги на свежем воздухе в парке. Все уровни подготовки приветствуются.",
    date: "2026-03-18",
    time: "07:00",
    location: "Центральный парк",
    address: "Парковая аллея, 1",
    category: "Спорт",
    image: "https://images.unsplash.com/photo-1592580715317-19adca36288e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3VucmlzZSUyMG91dGRvb3J8ZW58MXx8fHwxNzczNDA2NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1592580715317-19adca36288e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3VucmlzZSUyMG91dGRvb3J8ZW58MXx8fHwxNzczNDA2NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    organizerId: "org3",
    organizerName: "Yoga Life",
    organizerAvatar: "https://images.unsplash.com/photo-1667890785988-8da12fd0989b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW5zdHJ1Y3RvciUyMG1lZGl0YXRpb258ZW58MXx8fHwxNzczMzY5MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableSpots: 15,
    totalSpots: 25,
    coordinates: [55.751244, 37.618423],
    amIMember: true,
  },
  {
    id: "4",
    title: "Стендап вечер",
    description: "Лучшие комики города выступят с новыми номерами. Два часа смеха гарантированы!",
    date: "2026-03-22",
    time: "20:00",
    location: "Комеди Клуб",
    address: "ул. Театральная, 23",
    category: "Развлечения",
    image: "https://images.unsplash.com/photo-1762537132884-cc6bbde0667a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZHVwJTIwY29tZWR5JTIwc2hvd3xlbnwxfHx8fDE3NzMzMTE4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1762537132884-cc6bbde0667a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZHVwJTIwY29tZWR5JTIwc2hvd3xlbnwxfHx8fDE3NzMzMTE4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    organizerId: "org1",
    organizerName: "Студия CreativeSpace",
    organizerAvatar: "https://images.unsplash.com/photo-1760780567530-389d8a3fba75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzMzNjEzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableSpots: 30,
    totalSpots: 50,
    coordinates: [55.751244, 37.618423],
    amIMember: false,
  },
  {
    id: "5",
    title: "Кулинарный мастер-класс: Итальянская кухня",
    description: "Научитесь готовить настоящую пасту карбонара и тирамису под руководством шеф-повара.",
    date: "2026-03-25",
    time: "16:00",
    location: "Кулинарная школа Viva Italia",
    address: "ул. Гастрономическая, 7",
    category: "Образование",
    image: "https://images.unsplash.com/photo-1609166639722-47053ca112ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwY29va2luZyUyMHBhc3RhfGVufDF8fHx8MTc3MzQwNjQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1609166639722-47053ca112ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwY29va2luZyUyMHBhc3RhfGVufDF8fHx8MTc3MzQwNjQ0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    organizerId: "org2",
    organizerName: "GameZone Events",
    organizerAvatar: "https://images.unsplash.com/photo-1772587002840-30b82d74fbf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBldmVudCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableSpots: 5,
    totalSpots: 10,
    coordinates: [55.751244, 37.618423],
    amIMember: true,
  },
  {
    id: "6",
    title: "Концерт джазовой музыки",
    description: "Вечер живой джазовой музыки с известными музыкантами города.",
    date: "2026-03-28",
    time: "21:00",
    location: "Джаз-клуб Blue Note",
    address: "наб. Музыкальная, 15",
    category: "Музыка",
    image: "https://images.unsplash.com/photo-1708743536025-ecfe7ffb75b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwY29uY2VydCUyMGxpdmUlMjBtdXNpY3xlbnwxfHx8fDE3NzM0MDY0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1708743536025-ecfe7ffb75b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwY29uY2VydCUyMGxpdmUlMjBtdXNpY3xlbnwxfHx8fDE3NzM0MDY0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    organizerId: "org3",
    organizerName: "Yoga Life",
    organizerAvatar: "https://images.unsplash.com/photo-1667890785988-8da12fd0989b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW5zdHJ1Y3RvciUyMG1lZGl0YXRpb258ZW58MXx8fHwxNzczMzY5MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    availableSpots: 20,
    totalSpots: 40,
    coordinates: [55.751244, 37.618423],
    amIMember: false,
  }
];

export const mockOrganizers: any[] = [
  {
    id: "org1",
    name: "Студия CreativeSpace",
    avatar: "https://images.unsplash.com/photo-1760780567530-389d8a3fba75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzMzNjEzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    logo: "https://images.unsplash.com/photo-1760780567530-389d8a3fba75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzMzNjEzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Мы создаем пространство для творчества и развития. Проводим мастер-классы, воркшопы и культурные мероприятия.",
    email: "info@creativespace.com",
    website: "creativespace.com",
    rating: 4.8,
    reviewCount: 127,
    followers: 1542,
    eventsCount: 89,
    joinDate: "2024-01-15"
  },
  {
    id: "org2",
    name: "GameZone Events",
    avatar: "https://images.unsplash.com/photo-1772587002840-30b82d74fbf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBldmVudCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    logo: "https://images.unsplash.com/photo-1772587002840-30b82d74fbf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBldmVudCUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Организуем развлекательные мероприятия: игротеки, квизы, турниры. Создаем атмосферу веселья и дружбы!",
    email: "hello@gamezone.events",
    website: "gamezone.events",
    rating: 4.6,
    reviewCount: 93,
    followers: 984,
    eventsCount: 156,
    joinDate: "2023-11-20"
  },
  {
    id: "org3",
    name: "Yoga Life",
    avatar: "https://images.unsplash.com/photo-1667890785988-8da12fd0989b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW5zdHJ1Y3RvciUyMG1lZGl0YXRpb258ZW58MXx8fHwxNzczMzY5MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    logo: "https://images.unsplash.com/photo-1667890785988-8da12fd0989b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwaW5zdHJ1Y3RvciUyMG1lZGl0YXRpb258ZW58MXx8fHwxNzczMzY5MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Практика йоги и медитации для всех уровней. Помогаем найти баланс и гармонию в жизни.",
    email: "contact@yogalife.ru",
    website: "yogalife.ru",
    rating: 4.9,
    reviewCount: 215,
    followers: 2341,
    eventsCount: 234,
    joinDate: "2023-05-10"
  }
];

export const mockReviews: ReviewEntity[] = [
  {
    id: "1",
    eventId: "2",
    userId: "u1",
    userName: "Анна Смирнова",
    userAvatar: "https://images.unsplash.com/photo-1712168567852-ea607c2d3177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    comment: "Отличный организатор! Мероприятие прошло на высшем уровне, всё четко и по расписанию.",
    date: "2026-02-10"
  },
  {
    id: "2",
    eventId: "1",
    userId: "u2",
    userName: "Дмитрий Петров",
    userAvatar: "https://images.unsplash.com/photo-1712168567852-ea607c2d3177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4,
    comment: "Хорошее мероприятие, но немного задержались с началом. В целом всё понравилось!",
    date: "2026-02-08"
  },
  {
    id: "3",
    eventId: "3",
    userId: "u3",
    userName: "Елена Волкова",
    userAvatar: "https://images.unsplash.com/photo-1712168567852-ea607c2d3177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    comment: "Прекрасная атмосфера и организация. Обязательно приду еще!",
    date: "2026-01-25"
  },
  {
    id: "4",
    eventId: "1",
    userId: "u4",
    userName: "Михаил Козлов",
    userAvatar: "https://images.unsplash.com/photo-1712168567852-ea607c2d3177?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM0MDY0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    comment: "Профессиональный подход к каждой детали. Рекомендую!",
    date: "2026-01-15"
  }
];

export const cities = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань"
];

export const categories = [
  "Все категории",
  "Образование",
  "Развлечения",
  "Спорт",
  "Музыка",
  "Искусство",
  "Бизнес",
  "Технологии"
];
