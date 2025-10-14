import { useState, useEffect } from 'react';
import { Calendar, MapPin, Banknote } from 'lucide-react';
import { Event, supabase, TicketType } from '../lib/supabase';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);

  // Load ticket types for this event
  useEffect(() => {
    const loadTicketTypes = async () => {
      const { data, error } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', event.id)
        .eq('is_active', true)
        .order('price');

      if (error) {
        console.error('Error loading ticket types:', error);
      } else {
        setTicketTypes(data || []);
      }
    };

    loadTicketTypes();
  }, [event.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `RD$ ${price.toLocaleString('es-DO')}`;
  };

  const getMinPriceDisplay = () => {
    if (!ticketTypes || ticketTypes.length === 0) {
      return formatPrice(event.price);
    }

    // Filter out inactive or unavailable ticket types
    const availableTickets = ticketTypes.filter(ticket =>
      ticket.is_active && ticket.available_quantity > 0
    );

    if (availableTickets.length === 0) {
      return formatPrice(event.price);
    }

    // Find minimum price
    const minPrice = Math.min(...availableTickets.map(ticket => ticket.price || 0));

    // Check if there's only one price or all prices are the same
    const uniquePrices = [...new Set(availableTickets.map(ticket => ticket.price || 0))];
    const shouldShowDesde = uniquePrices.length > 1;

    if (shouldShowDesde) {
      return `Desde ${formatPrice(minPrice)}`;
    } else {
      return formatPrice(minPrice);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-300  border border-gray-100 hover:border-[var(--verde-oscuro1)]/20"
    >
      {/* Imagen con overlay mejorado */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Categoría con mejor diseño */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-white font-semibold text-xs shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: event.event_categories?.color + 'cc' || 'rgba(15, 113, 61, 0.8)' }}
        >
          {event.event_categories?.name || 'Evento'}
        </div>

        {/* Título con mejor posicionamiento */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold drop-shadow-lg line-clamp-2 leading-tight">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Contenido con mejor organización */}
      <div className="p-6">
        {/* Descripción mejorada */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
            {event.description}
          </p>
        </div>

        {/* Información estructurada */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--verde-oscuro1)]/10">
              <MapPin className="w-4 h-4 text-[var(--verde-oscuro1)]" />
            </div>
            <span className="text-sm font-medium flex-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--verde-oscuro1)]/10">
              <Calendar className="w-4 h-4 text-[var(--verde-oscuro1)]" />
            </div>
            <span className="text-sm font-medium">{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--verde-oscuro1)]/10">
              <Banknote className="w-4 h-4 text-[var(--verde-oscuro1)]" />
            </div>
            <span className="text-sm font-bold text-[var(--verde-oscuro2)]">{getMinPriceDisplay()}</span>
          </div>
        </div>

        {/* Botón mejorado */}
        <div className="pt-4 border-t border-gray-100">
          <button className="w-full py-3.5 bg-gradient-to-r from-[var(--verde-oscuro1)] to-[var(--verde-oscuro2)] text-white font-bold rounded-xl hover:from-[var(--verde-oscuro2)] hover:to-[var(--verde-oscuro3)] transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl">
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
