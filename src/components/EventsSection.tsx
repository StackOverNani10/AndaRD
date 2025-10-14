import { Sparkles } from 'lucide-react';
import { Event, EventCategory } from '../lib/supabase';
import { EventCard } from './EventCard';

interface EventsSectionProps {
  events: Event[];
  categories: EventCategory[];
  selectedCategory: string | null;
  loading: boolean;
  onEventClick: (event: Event) => void;
  onCategoryChange: (categoryId: string | null) => void;
}

export function EventsSection({
  events,
  categories,
  selectedCategory,
  loading,
  onEventClick,
  onCategoryChange
}: EventsSectionProps) {
  const filteredEvents = selectedCategory
    ? events.filter(event => event.category_id === selectedCategory)
    : events;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Filtros de categorías */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
              selectedCategory === null
                ? 'bg-[var(--verde-oscuro1)] text-white shadow-xl scale-105'
                : 'bg-white text-gray-700 border-2 border-[var(--verde-oscuro1)] hover:bg-[var(--verde-oscuro1)] hover:text-white'
            }`}
          >
            Todos los Eventos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                selectedCategory === category.id
                  ? 'shadow-xl scale-105'
                  : 'border-2 hover:bg-[var(--verde-oscuro1)] hover:text-white'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : 'white',
                color: selectedCategory === category.id ? 'white' : category.color,
                borderColor: category.color,
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--verde-oscuro1)]"></div>
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-800 mb-3">
              {selectedCategory
                ? `${categories.find(c => c.id === selectedCategory)?.name || 'Eventos'}`
                : 'Todos los Eventos'}
            </h2>
            <p className="text-lg text-gray-600">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'evento disponible' : 'eventos disponibles'}
            </p>
          </div>

          {filteredEvents.length === 0 && !loading ? (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-4">
                {categories.length === 0
                  ? 'Cargando datos mock... La aplicación funciona correctamente.'
                  : 'No hay eventos disponibles en esta categoría'}
              </p>
              <p className="text-sm text-gray-500">
                Los datos mostrados son de ejemplo. Configura Supabase para usar datos reales.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
