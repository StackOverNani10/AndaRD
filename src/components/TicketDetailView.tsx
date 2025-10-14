import { useState } from 'react';
import { X, Calendar, CreditCard, Eye, QrCode, ChevronRight, CheckCircle } from 'lucide-react';
import { Event, Booking } from '../lib/supabase';
import { useToast } from './Toast';

interface TicketDetailViewProps {
  event: Event;
  booking: Booking;
  onClose: () => void;
}

export function TicketDetailView({ event, booking, onClose }: TicketDetailViewProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const { addToast } = useToast();

  // Mock data - in real app this would come from the booking response
  const ticketData = {
    orderId: booking.id,
    customerName: booking.user_name,
    customerEmail: booking.user_email,
    purchaseDate: booking.created_at,
    tickets: [
      {
        id: 'TICK-001',
        type: 'Entrada General',
        status: 'active',
        qrCode: 'QR123456789',
        seatNumber: 'A-15'
      },
      {
        id: 'TICK-002',
        type: 'Entrada VIP',
        status: 'active',
        qrCode: 'QR987654321',
        seatNumber: 'VIP-03'
      }
    ]
  };

  const handleAddToCalendar = () => {
    const eventDate = new Date(event.date);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&text=${encodeURIComponent(event.title)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleAddToWallet = () => {
    // This would typically use the Web Share API or a wallet app integration
    if ('share' in navigator) {
      navigator.share({
        title: `Entrada para ${event.title}`,
        text: `Evento: ${event.title}\nFecha: ${new Date(event.date).toLocaleDateString()}\nUbicación: ${event.location}`,
        url: window.location.href
      });
    } else {
      // Fallback - copy ticket info to clipboard
      if ((navigator as any).clipboard && (navigator as any).clipboard.writeText) {
        (navigator as any).clipboard.writeText(`Evento: ${event.title}\nFecha: ${new Date(event.date).toLocaleDateString()}\nUbicación: ${event.location}`);
        addToast('Información del ticket copiada al portapapeles', 'success');
      } else {
        addToast('No se pudo copiar la información. Usa la función de compartir del navegador.', 'warning');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110 shadow-lg"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-2xl mb-2">
              ¡Reserva Confirmada!
            </h2>
            <p className="text-white/90 text-lg drop-shadow-lg">
              Tu entrada para <strong>{event.title}</strong>
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleAddToCalendar}
              className="flex items-center justify-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors duration-200"
            >
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Agregar al Calendario</span>
            </button>

            <button
              onClick={handleAddToWallet}
              className="flex items-center justify-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors duration-200"
            >
              <CreditCard className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Agregar al Wallet</span>
            </button>

            <button
              onClick={() => setSelectedTicket(ticketData.tickets[0].id)}
              className="flex items-center justify-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors duration-200"
            >
              <Eye className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Ver Ticket</span>
            </button>
          </div>

          {/* Event Information */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Información del Evento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Evento</p>
                <p className="font-semibold text-gray-800">{event.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha y Hora</p>
                <p className="font-semibold text-gray-800">{formatDate(event.date)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                <p className="font-semibold text-gray-800">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Tickets Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <QrCode className="w-6 h-6 text-gray-600" />
              Tus Entradas
            </h3>

            <div className="space-y-3">
              {ticketData.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    selectedTicket === ticket.id
                      ? 'border-[var(--verde-oscuro1)] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${ticket.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <h4 className="font-semibold text-gray-800">{ticket.type}</h4>
                        <p className="text-sm text-gray-600">ID: {ticket.id}</p>
                        <p className="text-sm text-gray-600">Asiento: {ticket.seatNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>

                      {selectedTicket === ticket.id && (
                        <button className="p-2 bg-[var(--verde-oscuro1)] text-white rounded-lg hover:bg-[var(--verde-oscuro2)] transition-colors">
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Tickets Button */}
            <button className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" />
              Ver Todos los Tickets
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Order Information */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Información de la Orden
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">ID de Orden</p>
                <p className="font-semibold text-gray-800">#{ticketData.orderId.slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha de Compra</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(ticketData.purchaseDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre</p>
                <p className="font-semibold text-gray-800">{ticketData.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Correo Electrónico</p>
                <p className="font-semibold text-gray-800">{ticketData.customerEmail}</p>
              </div>
            </div>
          </div>

          {/* QR Code Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-slideUp">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Código QR de Entrada</h3>

                  {/* Mock QR Code - In real app this would be a proper QR code */}
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl mx-auto mb-6 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">QR Code</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {ticketData.tickets.find(t => t.id === selectedTicket)?.qrCode}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
