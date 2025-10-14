import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Banknote, Sparkles, AlertCircle } from 'lucide-react';
import { Event, supabase, TicketType, Booking } from '../lib/supabase';
import { ReviewSection } from './ReviewSection';
import { useToast } from './Toast';
import { TicketDetailView } from './TicketDetailView';
import { ConfirmationModal } from './ConfirmationModal';
import { BookingFormModal } from './BookingFormModal';

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    tickets: 1
  });
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutos en segundos
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimerWarning, setShowTimerWarning] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [insuranceSelected, setInsuranceSelected] = useState(true);
  const [creditCard, setCreditCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holderName: ''
  });
  const [cardErrors, setCardErrors] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holderName: ''
  });

  const { addToast } = useToast();

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
        // Auto-select first ticket type if available
        if (data && data.length > 0) {
          setSelectedTicketType(data[0].id);
        }
      }
    };

    loadTicketTypes();
  }, [event.id]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;

          // Show warning when 2 minutes remaining
          if (newTime === 120) {
            setShowTimerWarning(true);
          }

          // Auto-cancel when time reaches 0
          if (newTime <= 0) {
            setIsTimerActive(false);
            setShowTimerWarning(false);
            setShowBookingForm(false);
            addToast('El tiempo para completar la reserva ha expirado. Por favor, inténtalo de nuevo.', 'warning');
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeRemaining]);

  // Start timer when booking form opens
  useEffect(() => {
    if (showBookingForm && !isTimerActive) {
      startTimer();
    }
  }, [showBookingForm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Entrada Gratuita';
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimeRemaining(300); // 5 minutos
    setIsTimerActive(true);
    setShowTimerWarning(false);
  };

  const extendTimer = () => {
    setTimeRemaining(prev => prev + 120); // Agregar 2 minutos más
    setShowTimerWarning(false);
  };

  const cancelBooking = () => {
    setShowBookingForm(false);
    setIsTimerActive(false);
    setTimeRemaining(300);
    setShowTimerWarning(false);
    setBookingForm({ name: '', email: '', tickets: 1 });
    setSelectedTicketType('');
  };

  const handleBooking = async () => {
    try {
      setIsBooking(true);

      // Check if user is authenticated
      const { data: { user: existingUser } } = await supabase.auth.getUser();

      let currentUser = existingUser;

      // If no user exists, create one automatically
      if (!currentUser && bookingForm.email && bookingForm.name) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: bookingForm.email,
          password: Math.random().toString(36).slice(-12), // Generate random password
          options: {
            data: {
              full_name: bookingForm.name,
            }
          }
        });

        if (signUpError) {
          console.error('Error creating user:', signUpError);
          if (signUpError.message.includes('over_email_send_rate_limit')) {
            addToast('Demasiados intentos de creación de cuenta. Espera al menos 46 segundos antes de intentar de nuevo.', 'warning');
          } else {
            addToast('Error al crear la cuenta. Por favor, inténtalo de nuevo.', 'error');
          }
          return;
        }

        if (signUpData.user) {
          currentUser = signUpData.user;

          // Check if email confirmation is required
          if (!signUpData.session && signUpData.user && !signUpData.user.email_confirmed_at) {
            //addToast(`Se ha creado tu cuenta exitosamente. Por favor, revisa tu email (${bookingForm.email}) y confirma tu cuenta antes de continuar con la reserva.`, 'success', 8000);
            addToast(`Se ha creado la reserva exitosamente`, 'success', 8000);
          }


          // User is confirmed and ready to use
          if (signUpData.session) {
            // Session is available, user can proceed
          }

        }
      }

      if (!currentUser) {
        addToast('Debes proporcionar tu nombre y email para hacer una reserva', 'warning');
        return;
      }

      if (!selectedTicketType) {
        addToast('Por favor selecciona un tipo de entrada', 'warning');
        return;
      }

      // Check availability and book atomically using ticket type
      const { data: eventData, error: eventError } = await supabase.rpc('book_event_ticket', {
        number_of_tickets: bookingForm.tickets,
        p_event_id: event.id,
        ticket_type_id: selectedTicketType,
        user_email: bookingForm.email || currentUser.email || '',
        user_id: currentUser.id,
        user_name: bookingForm.name || 'Usuario Anónimo'
      });

      if (eventError) {
        console.error('Booking error:', eventError);
        if (eventError.message?.includes('No hay suficientes entradas disponibles')) {
          addToast('Lo siento, no hay suficientes entradas disponibles para esta cantidad solicitada.', 'warning');
          // Refresh ticket types to get updated availability
          window.location.reload();
          return;
        }
        throw eventError;
      }

      if (!eventData || eventData.length === 0) {
        throw new Error('No se pudo procesar la reserva');
      }

      // Store booking data for ticket detail view
      setBookingData(eventData[0]);

      setShowConfirmation(true);
      setShowBookingForm(false);
      setIsTimerActive(false);
      setTimeRemaining(300);
      setShowTimerWarning(false);

    } catch (error) {
      console.error('Error creating booking:', error);
      addToast('Error al procesar la reserva. Por favor, inténtalo de nuevo.', 'error');
    } finally {
      setIsBooking(false);
    }
  };

  const resetBooking = () => {
    setShowBookingForm(false);
    setShowConfirmation(false);
    setBookingForm({ name: '', email: '', tickets: 1 });
    setSelectedTicketType('');
    setIsTimerActive(false);
    setTimeRemaining(300);
    setShowTimerWarning(false);
    setDiscountCode('');
    setDiscountApplied(0);
    setInsuranceSelected(true);
    setCreditCard({
      number: '',
      expiry: '',
      cvv: '',
      holderName: ''
    });
    setCardErrors({
      number: '',
      expiry: '',
      cvv: '',
      holderName: ''
    });
  };

  const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType);

  const calculatePriceBreakdown = () => {
    if (!selectedTicket) return null;

    const subtotal = (selectedTicket.price || 0) * bookingForm.tickets;
    const serviceFee = Math.round(subtotal * 0.05); // 5% de cargo por servicio
    const insuranceFee = insuranceSelected ? Math.round(subtotal * 0.02) : 0; // 2% de seguro si está seleccionado
    const discount = discountApplied;
    const total = subtotal + serviceFee + insuranceFee - discount;

    return {
      subtotal,
      serviceFee,
      insuranceFee,
      discount,
      total
    };
  };

  const validateCreditCard = () => {
    const errors = {
      number: '',
      expiry: '',
      cvv: '',
      holderName: ''
    };

    // Validar número de tarjeta (solo dígitos, 13-19 caracteres)
    const cardNumber = creditCard.number.replace(/\s/g, '');
    if (!cardNumber) {
      errors.number = 'Número de tarjeta requerido';
    } else if (!/^\d{13,19}$/.test(cardNumber)) {
      errors.number = 'Número de tarjeta inválido (13-19 dígitos)';
    }

    // Validar fecha de expiración (MM/YY)
    if (!creditCard.expiry) {
      errors.expiry = 'Fecha de expiración requerida';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(creditCard.expiry)) {
      errors.expiry = 'Formato inválido (MM/YY)';
    } else {
      const [month, year] = creditCard.expiry.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      const expMonth = parseInt(month);
      const expYear = parseInt(year);

      if (expMonth < 1 || expMonth > 12) {
        errors.expiry = 'Mes inválido';
      } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        errors.expiry = 'Tarjeta expirada';
      }
    }

    // Validar CVV (3-4 dígitos)
    if (!creditCard.cvv) {
      errors.cvv = 'CVV requerido';
    } else if (!/^\d{3,4}$/.test(creditCard.cvv)) {
      errors.cvv = 'CVV inválido (3-4 dígitos)';
    }

    // Validar nombre del titular
    if (!creditCard.holderName.trim()) {
      errors.holderName = 'Nombre del titular requerido';
    }

    setCardErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const applyDiscountCode = async () => {
    if (!discountCode.trim() || !selectedTicket) {
      return;
    }

    // Basic discount code validation and calculation
    const code = discountCode.trim().toUpperCase();

    // Define valid discount codes (in a real app, this would come from a database)
    const validDiscounts: { [key: string]: number } = {
      'SAVE10': 0.10,    // 10% discount
      'DISCOUNT15': 0.15, // 15% discount
      'SAVE20': 0.20,    // 20% discount
      'WELCOME25': 0.25, // 25% discount
      'EARLY30': 0.30,   // 30% discount
      'FREE100': 1.0,   // 100% discount
    };

    if (validDiscounts[code]) {
      const subtotal = (selectedTicket.price || 0) * bookingForm.tickets;
      const discountAmount = Math.round(subtotal * validDiscounts[code]);
      setDiscountApplied(discountAmount);
      setDiscountCode(''); // Clear the input after successful application
    } else {
      // Show error for invalid code
      addToast('Código de descuento inválido. Por favor, verifica el código e inténtalo de nuevo.', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="relative h-80 overflow-hidden rounded-t-3xl">
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

          <div
            className="absolute top-6 left-6 px-5 py-2 rounded-full text-white font-bold shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: event.event_categories?.color || 'var(--verde-oscuro1)' }}
          >
            {event.event_categories?.name || 'Evento'}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-4xl font-bold text-white drop-shadow-2xl mb-2">
              {event.title}
            </h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <Calendar className="w-6 h-6 text-[var(--verde-oscuro1)]" />
              <div>
                <p className="text-xs text-[var(--verde-oscuro1)] font-semibold">Fecha</p>
                <p className="text-sm text-gray-800 font-medium">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <MapPin className="w-6 h-6 text-[var(--verde-oscuro1)]" />
              <div>
                <p className="text-xs text-[var(--verde-oscuro1)] font-semibold">Ubicación</p>
                <p className="text-sm text-gray-800 font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
              <Banknote className="w-6 h-6 text-[var(--naranja1)]" />
              <div>
                <p className="text-xs text-[var(--naranja1)] font-semibold">Precio</p>
                <p className="text-sm text-gray-800 font-bold">{getMinPriceDisplay()}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-4 rounded-xl ${event.available_spots > 10
              ? 'bg-blue-50'
              : event.available_spots > 0
                ? 'bg-yellow-50'
                : 'bg-red-50'
              }`}>
              <AlertCircle className={`w-6 h-6 ${event.available_spots > 10
                ? 'text-blue-600'
                : event.available_spots > 0
                  ? 'text-yellow-600'
                  : 'text-red-600'
                }`} />
              <div>
                <p className={`text-xs font-semibold ${event.available_spots > 10
                  ? 'text-blue-600'
                  : event.available_spots > 0
                    ? 'text-yellow-600'
                    : 'text-red-600'
                  }`}>
                  {event.available_spots > 0 ? 'Disponibles' : 'Agotado'}
                </p>
                <p className="text-sm text-gray-800 font-bold">
                  {event.available_spots > 0
                    ? `${event.available_spots} entrada${event.available_spots !== 1 ? 's' : ''}`
                    : 'No hay entradas disponibles'
                  }
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Descripción</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {event.description}
            </p>
          </div>

          {event.highlights && event.highlights.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Lo Destacado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                    <span className="text-gray-800 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ReviewSection eventId={event.id} />

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowBookingForm(true)}
              disabled={isBooking}
              className="w-full py-4 bg-gradient-to-r from-[var(--verde-oscuro1)] via-[var(--verde-oscuro2)] to-[var(--verde-oscuro3)] text-white font-bold text-lg rounded-xl hover:from-[var(--verde-oscuro2)] hover:via-[var(--verde-oscuro3)] hover:to-[var(--verde-oscuro1)] transform transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBooking ? 'Procesando...' : 'Reservar Ahora'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingFormModal
          event={event}
          ticketTypes={ticketTypes}
          selectedTicketType={selectedTicketType}
          setSelectedTicketType={setSelectedTicketType}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          timeRemaining={timeRemaining}
          isTimerActive={isTimerActive}
          showTimerWarning={showTimerWarning}
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
          discountApplied={discountApplied}
          setDiscountApplied={setDiscountApplied}
          insuranceSelected={insuranceSelected}
          setInsuranceSelected={setInsuranceSelected}
          creditCard={creditCard}
          setCreditCard={setCreditCard}
          cardErrors={cardErrors}
          setCardErrors={setCardErrors}
          isBooking={isBooking}
          setIsBooking={setIsBooking}
          setShowBookingForm={setShowBookingForm}
          setShowConfirmation={setShowConfirmation}
          setBookingData={setBookingData}
          setTimeRemaining={setTimeRemaining}
          setIsTimerActive={setIsTimerActive}
          setShowTimerWarning={setShowTimerWarning}
          addToast={addToast}
          formatDate={formatDate}
          formatPrice={formatPrice}
          getMinPriceDisplay={getMinPriceDisplay}
          formatTime={formatTime}
          startTimer={startTimer}
          extendTimer={extendTimer}
          cancelBooking={cancelBooking}
          handleBooking={handleBooking}
          resetBooking={resetBooking}
          selectedTicket={selectedTicket}
          calculatePriceBreakdown={calculatePriceBreakdown}
          validateCreditCard={validateCreditCard}
          formatCardNumber={formatCardNumber}
          formatExpiry={formatExpiry}
          applyDiscountCode={applyDiscountCode}
        />
      )}
      {/* Confirmation Modal */}
      {showConfirmation && !showTicketDetail && (
        <ConfirmationModal
          event={event}
          selectedTicket={selectedTicket}
          bookingForm={bookingForm}
          calculatePriceBreakdown={calculatePriceBreakdown}
          onViewTicket={() => setShowTicketDetail(true)}
          onAddToCalendar={() => {
            // Add to calendar functionality
            const eventDate = new Date(event.date);
            const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&text=${encodeURIComponent(event.title)}`;
            window.open(calendarUrl, '_blank');
          }}
          onAddToWallet={() => {
            // Add to wallet functionality
            if ('share' in navigator) {
              navigator.share({
                title: `Entrada para ${event.title}`,
                text: `Evento: ${event.title}\nFecha: ${new Date(event.date).toLocaleDateString()}\nUbicación: ${event.location}`,
                url: window.location.href
              });
            } else {
              if ((navigator as any).clipboard && (navigator as any).clipboard.writeText) {
                (navigator as any).clipboard.writeText(`Evento: ${event.title}\nFecha: ${new Date(event.date).toLocaleDateString()}\nUbicación: ${event.location}`);
                addToast('Información del ticket copiada al portapapeles', 'info');
              } else {
                addToast('No se pudo copiar la información. Usa la función de compartir del navegador.', 'warning');
              }
            }
          }}
          onClose={() => {
            resetBooking();
            onClose();
          }}
        />
      )}

      {/* Ticket Detail View */}
      {showTicketDetail && bookingData && (
        <TicketDetailView
          event={event}
          booking={bookingData}
          onClose={() => {
            setShowTicketDetail(false);
            setShowConfirmation(true);
          }}
        />
      )}
    </div>
  );
}
