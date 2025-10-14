import { CheckCircle, Calendar, CreditCard, Ticket } from 'lucide-react';
import { Event, TicketType } from '../lib/supabase';

interface ConfirmationModalProps {
  event: Event;
  selectedTicket: TicketType | undefined;
  bookingForm: {
    name: string;
    email: string;
    tickets: number;
  };
  calculatePriceBreakdown: () => {
    subtotal: number;
    serviceFee: number;
    insuranceFee: number;
    discount: number;
    total: number;
  } | null;
  onViewTicket: () => void;
  onAddToCalendar: () => void;
  onAddToWallet: () => void;
  onClose: () => void;
}

export function ConfirmationModal({
  event,
  selectedTicket,
  bookingForm,
  calculatePriceBreakdown,
  onViewTicket,
  onAddToCalendar,
  onAddToWallet,
  onClose
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 animate-slideUp">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h3>
          <p className="text-gray-600 mb-6">
            Tu reserva para <strong>{event.title}</strong> ha sido procesada exitosamente.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 mb-6 text-left">
            <h4 className="font-bold text-gray-800 mb-2">Detalles de la reserva:</h4>
            <p className="text-sm text-gray-700"><strong>Evento:</strong> {event.title}</p>
            <p className="text-sm text-gray-700"><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString('es-DO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p className="text-sm text-gray-700"><strong>Tipo de entrada:</strong> {selectedTicket?.name}</p>
            <p className="text-sm text-gray-700"><strong>Entradas:</strong> {bookingForm.tickets}</p>
            <p className="text-sm text-gray-700"><strong>Total:</strong> RD$ {(() => {
              const breakdown = calculatePriceBreakdown();
              return breakdown ? breakdown.total.toLocaleString('es-DO') : '0';
            })()}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={onViewTicket}
              className="w-full py-3 px-6 bg-gradient-to-r from-[var(--verde-oscuro1)] to-[var(--verde-oscuro2)] text-white font-bold rounded-xl hover:from-[var(--verde-oscuro2)] hover:to-[var(--verde-oscuro1)] transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              Ver Mi Ticket
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onAddToCalendar}
                className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Calendario
              </button>

              <button
                onClick={onAddToWallet}
                className="py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Wallet
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
