import { Event, EventCategory } from './supabase';

export const mockCategories: EventCategory[] = [
  {
    id: 'music',
    name: 'Conciertos',
    icon: 'music',
    color: '#FF6B6B', // Rojo (de la base de datos)
    created_at: new Date().toISOString(),
  },
  {
    id: 'food',
    name: 'Gastronomía',
    icon: 'utensils',
    color: '#FFD93D', // Amarillo (de la base de datos)
    created_at: new Date().toISOString(),
  },
  {
    id: 'adventure',
    name: 'Excursiones',
    icon: 'compass',
    color: '#4ECDC4', // Verde azulado (de la base de datos)
    created_at: new Date().toISOString(),
  },
  {
    id: 'culture',
    name: 'Cultura',
    icon: 'theater',
    color: '#A8E6CF', // Verde muy claro (de la base de datos)
    created_at: new Date().toISOString(),
  },
  {
    id: 'sports',
    name: 'Deportes',
    icon: 'trophy',
    color: '#FF8B94', // Rosa (de la base de datos)
    created_at: new Date().toISOString(),
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Concierto de Juan Luis Guerra',
    description: 'El legendario artista dominicano presenta sus mayores éxitos en una noche inolvidable bajo las estrellas del Malecón de Santo Domingo.',
    category_id: 'music',
    location: 'Malecón de Santo Domingo',
    latitude: 18.4697,
    longitude: -69.8923,
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Próxima semana
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    price: 2500,
    highlights: [
      'Más de 20 éxitos musicales',
      'Escenario frente al mar Caribe',
      'Artistas invitados especiales',
      'Ambiente familiar y seguro'
    ],
    available_spots: 1000,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[0],
  },
  {
    id: '2',
    title: 'Festival Gastronómico del Cibao',
    description: 'Descubre los sabores auténticos de la región del Cibao con más de 50 puestos de comida tradicional dominicana.',
    category_id: 'food',
    location: 'Santiago de los Caballeros',
    latitude: 19.4517,
    longitude: -70.6970,
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // En 2 semanas
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    price: 0,
    highlights: [
      'Comida típica dominicana',
      'Música en vivo',
      'Zona infantil',
      'Entrada gratuita'
    ],
    available_spots: 500,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[1],
  },
  {
    id: '3',
    title: 'Excursión al Pico Duarte',
    description: 'Conquista la montaña más alta del Caribe en esta aventura de 3 días con guías expertos y equipo completo.',
    category_id: 'adventure',
    location: 'Parque Nacional José Armando Bermúdez',
    latitude: 19.0333,
    longitude: -71.0167,
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // En 3 semanas
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    price: 8500,
    highlights: [
      'Guías certificados',
      'Equipo de camping incluido',
      'Vistas panorámicas',
      'Dificultad media-alta'
    ],
    available_spots: 20,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[2],
  },
  {
    id: '4',
    title: 'Festival Internacional de Teatro',
    description: 'Una semana de espectáculos teatrales con compañías nacionales e internacionales en el Teatro Nacional.',
    category_id: 'culture',
    location: 'Teatro Nacional Eduardo Brito, Santo Domingo',
    latitude: 18.4723,
    longitude: -69.8937,
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Próximos 10 días
    image_url: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&h=600&fit=crop',
    price: 1200,
    highlights: [
      'Obras internacionales',
      'Talleres para actores',
      'Descuentos para estudiantes',
      'Duración: 7 días'
    ],
    available_spots: 200,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[3],
  },
  {
    id: '5',
    title: 'Torneo Nacional de Béisbol Infantil',
    description: 'El futuro del béisbol dominicano se reúne en el Estadio Quisqueya para competir por el campeonato nacional.',
    category_id: 'sports',
    location: 'Estadio Quisqueya Juan Marichal',
    latitude: 18.4897,
    longitude: -69.9378,
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Próximos 5 días
    image_url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop',
    price: 500,
    highlights: [
      'Categorías por edad',
      'Scouts de MLB presentes',
      'Premios para ganadores',
      'Ambiente familiar'
    ],
    available_spots: 300,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[4],
  },
  {
    id: '6',
    title: 'Noche de Jazz en la Zona Colonial',
    description: 'Músicos locales e internacionales presentan lo mejor del jazz contemporáneo en el corazón histórico de Santo Domingo.',
    category_id: 'music',
    location: 'Plaza España, Zona Colonial',
    latitude: 18.4733,
    longitude: -69.8839,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Próximos 3 días
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    price: 1500,
    highlights: [
      'Jazz fusión latino',
      'Ambiente íntimo',
      'Cócteles artesanales',
      'Entrada limitada'
    ],
    available_spots: 150,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[0],
  },
  {
    id: '7',
    title: 'Ruta del Café en las Montañas',
    description: 'Recorre las plantaciones de café de Jarabacoa, aprende sobre el proceso y degusta las mejores tazas de República Dominicana.',
    category_id: 'food',
    location: 'Jarabacoa, La Vega',
    latitude: 19.1167,
    longitude: -70.6333,
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // Próximos 12 días
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop',
    price: 3200,
    highlights: [
      'Visita a plantaciones',
      'Degustación incluida',
      'Transporte desde SD',
      'Guía especializado'
    ],
    available_spots: 25,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[1],
  },
  {
    id: '8',
    title: 'Carnaval Dominicano 2025',
    description: 'La fiesta más colorida del Caribe regresa con sus mejores comparsas, música y tradición cultural.',
    category_id: 'culture',
    location: 'Malecón de Santo Domingo',
    latitude: 18.4697,
    longitude: -69.8923,
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // En mes y medio
    image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    price: 0,
    highlights: [
      'Comparsas tradicionales',
      'Música típica',
      'Comida callejera',
      'Evento gratuito'
    ],
    available_spots: 2000,
    created_at: new Date().toISOString(),
    event_categories: mockCategories[3],
  }
];

export function getMockData() {
  return {
    categories: mockCategories,
    events: mockEvents,
  };
}
