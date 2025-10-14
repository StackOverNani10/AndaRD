import { useEffect, useState } from 'react';
import { supabase, Event, EventCategory } from './lib/supabase';
import { EventModal } from './components/EventModal';
import { Footer } from './components/Footer';
import { MapSection } from './components/MapSection';
import { Header } from './components/Header';
import { EventsSection } from './components/EventsSection';
import { getMockData } from './lib/mockData';
import { ToastProvider } from './components/Toast';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      try {
        // Intentar cargar datos reales de Supabase
        const [eventsResponse, categoriesResponse] = await Promise.all([
          supabase
            .from('events')
            .select('*, event_categories(*)')
            .order('date', { ascending: true }),
          supabase
            .from('event_categories')
            .select('*')
            .order('name')
        ]);

        if (eventsResponse.error) {
          console.warn('Error fetching events from Supabase:', eventsResponse.error);
          throw new Error('Supabase events error');
        }
        if (categoriesResponse.error) {
          console.warn('Error fetching categories from Supabase:', categoriesResponse.error);
          throw new Error('Supabase categories error');
        }

        // Si llegamos aquí, los datos se cargaron correctamente
        setEvents(eventsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        console.log('Datos cargados exitosamente desde Supabase');
        return;

      } catch (supabaseError) {
        console.warn('No se pudo conectar a Supabase, usando datos mock:', supabaseError);
      }

      // Si falla Supabase, usar datos mock
      const mockData = getMockData();
      setEvents(mockData.events);
      setCategories(mockData.categories);
      console.log('Datos mock cargados exitosamente');

    } catch (error) {
      console.error('Error general:', error);
      // Última línea de defensa: cargar datos mock
      const mockData = getMockData();
      setEvents(mockData.events);
      setCategories(mockData.categories);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedCategory
    ? events.filter(event => event.category_id === selectedCategory)
    : events;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-100">
        <Header
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <MapSection events={filteredEvents} />

        <EventsSection
          events={events}
          categories={categories}
          selectedCategory={selectedCategory}
          loading={loading}
          onEventClick={setSelectedEvent}
          onCategoryChange={setSelectedCategory}
        />

        <Footer />

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
