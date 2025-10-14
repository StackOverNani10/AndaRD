import { X, Banknote, User, Mail, Users, CheckCircle, Ticket, Shield, Percent } from 'lucide-react';
import { Event, TicketType } from '../lib/supabase';
import { ToastType } from './Toast';

interface BookingFormModalProps {
    event: Event;
    ticketTypes: TicketType[];
    selectedTicketType: string;
    setSelectedTicketType: (id: string) => void;
    bookingForm: {
        name: string;
        email: string;
        tickets: number;
    };
    setBookingForm: (form: { name: string; email: string; tickets: number }) => void;
    timeRemaining: number;
    isTimerActive: boolean;
    showTimerWarning: boolean;
    discountCode: string;
    setDiscountCode: (code: string) => void;
    discountApplied: number;
    setDiscountApplied: (amount: number) => void;
    insuranceSelected: boolean;
    setInsuranceSelected: (selected: boolean) => void;
    creditCard: {
        number: string;
        expiry: string;
        cvv: string;
        holderName: string;
    };
    setCreditCard: (card: { number: string; expiry: string; cvv: string; holderName: string }) => void;
    cardErrors: {
        number: string;
        expiry: string;
        cvv: string;
        holderName: string;
    };
    setCardErrors: (errors: { number: string; expiry: string; cvv: string; holderName: string }) => void;
    isBooking: boolean;
    setIsBooking: (booking: boolean) => void;
    setShowBookingForm: (show: boolean) => void;
    setShowConfirmation: (show: boolean) => void;
    setBookingData: (data: any) => void;
    setTimeRemaining: (time: number) => void;
    setIsTimerActive: (active: boolean) => void;
    setShowTimerWarning: (warning: boolean) => void;
    addToast: (message: string, type: ToastType, duration?: number) => void;
    formatDate: (dateString: string) => string;
    formatPrice: (price: number) => string;
    getMinPriceDisplay: () => string;
    formatTime: (seconds: number) => string;
    startTimer: () => void;
    extendTimer: () => void;
    cancelBooking: () => void;
    handleBooking: () => Promise<void>;
    resetBooking: () => void;
    selectedTicket: TicketType | undefined;
    calculatePriceBreakdown: () => {
        subtotal: number;
        serviceFee: number;
        insuranceFee: number;
        discount: number;
        total: number;
    } | null;
    validateCreditCard: () => boolean;
    formatCardNumber: (value: string) => string;
    formatExpiry: (value: string) => string;
    applyDiscountCode: () => void;
}

export function BookingFormModal({
    event,
    ticketTypes,
    selectedTicketType,
    setSelectedTicketType,
    bookingForm,
    setBookingForm,
    timeRemaining,
    isTimerActive,
    showTimerWarning,
    discountCode,
    setDiscountCode,
    discountApplied,
    insuranceSelected,
    setInsuranceSelected,
    creditCard,
    setCreditCard,
    cardErrors,
    isBooking,
    setShowBookingForm,
    formatDate,
    formatPrice,
    getMinPriceDisplay,
    formatTime,
    extendTimer,
    cancelBooking,
    handleBooking,
    selectedTicket,
    calculatePriceBreakdown,
    validateCreditCard,
    formatCardNumber,
    formatExpiry,
    applyDiscountCode
}: BookingFormModalProps) {
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 animate-slideUp">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Reservar Evento</h3>
                    <button
                        onClick={() => setShowBookingForm(false)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Timer Section */}
                {isTimerActive && (
                    <div className={`p-4 rounded-xl border-2 mb-6 ${showTimerWarning
                        ? 'bg-orange-50 border-orange-300'
                        : timeRemaining < 60
                            ? 'bg-red-50 border-red-300'
                            : 'bg-blue-50 border-blue-300'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${showTimerWarning
                                    ? 'bg-orange-500 animate-pulse'
                                    : timeRemaining < 60
                                        ? 'bg-red-500 animate-pulse'
                                        : 'bg-blue-500'
                                    }`} />
                                <span className={`font-semibold ${showTimerWarning
                                    ? 'text-orange-700'
                                    : timeRemaining < 60
                                        ? 'text-red-700'
                                        : 'text-blue-700'
                                    }`}>
                                    {showTimerWarning
                                        ? '¡Tiempo limitado!'
                                        : timeRemaining < 60
                                            ? '¡Último minuto!'
                                            : 'Tiempo restante para reservar:'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-2xl font-bold ${showTimerWarning
                                    ? 'text-orange-600'
                                    : timeRemaining < 60
                                        ? 'text-red-600'
                                        : 'text-blue-600'
                                    }`}>
                                    {formatTime(timeRemaining)}
                                </span>
                                {showTimerWarning && (
                                    <button
                                        onClick={extendTimer}
                                        className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                    >
                                        +2 min
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{event.title}</h4>
                        <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        <p className="text-lg font-bold text-[var(--verde-oscuro1)] mt-2">
                            {getMinPriceDisplay()}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                Tipo de entrada
                            </label>
                            <div className="space-y-3">
                                {ticketTypes.map(ticketType => (
                                    <div
                                        key={ticketType.id}
                                        onClick={() => setSelectedTicketType(ticketType.id)}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedTicketType === ticketType.id
                                            ? 'border-[var(--verde-oscuro1)] bg-green-50 ring-2 ring-green-100'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 mb-1">{ticketType.name}</h4>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {ticketType.description || 'Sin descripción adicional'}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    {ticketType.max_quantity && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3 h-3" />
                                                            Máx. {ticketType.max_quantity} por persona
                                                        </span>
                                                    )}
                                                    <span className={`font-medium ${ticketType.available_quantity > 10
                                                        ? 'text-green-600'
                                                        : ticketType.available_quantity > 0
                                                            ? 'text-yellow-600'
                                                            : 'text-red-600'
                                                        }`}>
                                                        {ticketType.available_quantity > 0
                                                            ? `${ticketType.available_quantity} disponibles`
                                                            : 'Agotado'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className={`text-lg font-bold ${selectedTicketType === ticketType.id
                                                    ? 'text-[var(--verde-oscuro1)]'
                                                    : 'text-gray-800'
                                                    }`}>
                                                    {formatPrice(ticketType.price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {selectedTicket && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <strong>Descripción:</strong> {selectedTicket.description || 'Sin descripción adicional'}
                                    </p>
                                    {selectedTicket.max_quantity && (
                                        <p className="text-sm text-gray-600">
                                            <strong>Límite por persona:</strong> {selectedTicket.max_quantity}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                value={bookingForm.name}
                                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent"
                                placeholder="Tu nombre completo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={bookingForm.email}
                                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent"
                                placeholder="tu@email.com"
                            />
                        </div>

                        {/* Discount Code Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Percent className="w-4 h-4" />
                                Código de descuento (opcional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent"
                                    placeholder="Ingresa tu código"
                                    disabled={!selectedTicket}
                                />
                                <button
                                    onClick={applyDiscountCode}
                                    disabled={!discountCode.trim() || !selectedTicket}
                                    className="px-4 py-3 bg-[var(--verde-oscuro1)] text-white rounded-xl hover:bg-[var(--verde-oscuro2)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Aplicar
                                </button>
                            </div>
                            {discountApplied > 0 && (
                                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Descuento aplicado: RD$ {discountApplied.toLocaleString('es-DO')}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Número de entradas
                            </label>
                            <select
                                value={bookingForm.tickets}
                                onChange={(e) => setBookingForm({ ...bookingForm, tickets: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent"
                                disabled={!selectedTicket || selectedTicket.available_quantity === 0}
                            >
                                {selectedTicket && Array.from({ length: Math.min(selectedTicket.available_quantity, selectedTicket.max_quantity || 10) }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>{num} entrada{num > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                            {!selectedTicket && (
                                <p className="text-sm text-gray-500 mt-1">Selecciona un tipo de entrada primero</p>
                            )}
                            {selectedTicket && selectedTicket.available_quantity === 0 && (
                                <p className="text-sm text-red-600 mt-1">No hay entradas disponibles para este tipo</p>
                            )}
                        </div>

                        {/* Insurance Section */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <div className="flex items-start gap-3 mb-3">
                                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 mb-1">Asegura tu compra</h4>
                                    <p className="text-sm text-gray-600">
                                        Protege tu inversión contra cancelaciones inesperadas del evento. Recibirás el 100% de reembolso si el evento es cancelado por el organizador.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="insurance"
                                        checked={insuranceSelected}
                                        onChange={(e) => setInsuranceSelected(e.target.checked)}
                                        className="w-4 h-4 text-[var(--verde-oscuro1)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--verde-oscuro1)]"
                                    />
                                    <label htmlFor="insurance" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Sí, asegurar mi compra ({(() => {
                                            const subtotal = selectedTicket ? (selectedTicket.price || 0) * bookingForm.tickets : 0;
                                            return `+RD$ ${Math.round(subtotal * 0.02).toLocaleString('es-DO')}`;
                                        })()})
                                    </label>
                                </div>

                                {insuranceSelected && (
                                    <button
                                        onClick={() => setInsuranceSelected(false)}
                                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                                    >
                                        No gracias
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price Details - Always Visible */}
                        {selectedTicket && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Banknote className="w-4 h-4 text-blue-600" />
                                    Desglose de precios
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {(() => {
                                        const breakdown = calculatePriceBreakdown();
                                        if (!breakdown) return null;

                                        return (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Subtotal ({bookingForm.tickets} entrada{bookingForm.tickets > 1 ? 's' : ''}):</span>
                                                    <span>RD$ {breakdown.subtotal.toLocaleString('es-DO')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Cargo por servicio (5%):</span>
                                                    <span>RD$ {breakdown.serviceFee.toLocaleString('es-DO')}</span>
                                                </div>
                                                {breakdown.insuranceFee > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Seguro de compra (2%):</span>
                                                        <span>RD$ {breakdown.insuranceFee.toLocaleString('es-DO')}</span>
                                                    </div>
                                                )}
                                                {breakdown.discount > 0 && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Descuento aplicado:</span>
                                                        <span>-RD$ {breakdown.discount.toLocaleString('es-DO')}</span>
                                                    </div>
                                                )}
                                                <hr className="my-2" />
                                                <div className="flex justify-between font-bold text-lg">
                                                    <span>Total a pagar:</span>
                                                    <span>RD$ {breakdown.total.toLocaleString('es-DO')}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {selectedTicket && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                <p className="text-sm text-gray-700">
                                    <strong>Total a pagar:</strong> RD$ {(() => {
                                        const breakdown = calculatePriceBreakdown();
                                        return breakdown ? breakdown.total.toLocaleString('es-DO') : '0';
                                    })()}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    Precio unitario: {formatPrice(selectedTicket.price || 0)}
                                </p>
                            </div>
                        )}

                        {/* Credit Card Section */}
                        {selectedTicket && (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Información de Pago
                                </h4>

                                {/* Payment Methods */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/payment-methods/visa.svg" alt="Visa" className="h-8 w-auto" />
                                        <img src="/assets/payment-methods/mastercard.svg" alt="Mastercard" className="h-8 w-auto" />
                                        <img src="/assets/payment-methods/amex.svg" alt="American Express" className="h-8 w-auto" />
                                        <img src="/assets/payment-methods/discover.svg" alt="Discover" className="h-8 w-auto" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Número de tarjeta */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de tarjeta *
                                        </label>
                                        <input
                                            type="text"
                                            value={creditCard.number}
                                            onChange={(e) => setCreditCard({ ...creditCard, number: formatCardNumber(e.target.value) })}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent ${cardErrors.number ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                        />
                                        {cardErrors.number && (
                                            <p className="text-sm text-red-600 mt-1">{cardErrors.number}</p>
                                        )}
                                    </div>

                                    {/* Fecha de expiración */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha de expiración *
                                        </label>
                                        <input
                                            type="text"
                                            value={creditCard.expiry}
                                            onChange={(e) => setCreditCard({ ...creditCard, expiry: formatExpiry(e.target.value) })}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent ${cardErrors.expiry ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                        />
                                        {cardErrors.expiry && (
                                            <p className="text-sm text-red-600 mt-1">{cardErrors.expiry}</p>
                                        )}
                                    </div>

                                    {/* CVV */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV *
                                        </label>
                                        <input
                                            type="text"
                                            value={creditCard.cvv}
                                            onChange={(e) => setCreditCard({ ...creditCard, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent ${cardErrors.cvv ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="123"
                                            maxLength={4}
                                        />
                                        {cardErrors.cvv && (
                                            <p className="text-sm text-red-600 mt-1">{cardErrors.cvv}</p>
                                        )}
                                    </div>

                                    {/* Nombre del titular */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del titular *
                                        </label>
                                        <input
                                            type="text"
                                            value={creditCard.holderName}
                                            onChange={(e) => setCreditCard({ ...creditCard, holderName: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--verde-oscuro1)] focus:border-transparent ${cardErrors.holderName ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Nombre como aparece en la tarjeta"
                                        />
                                        {cardErrors.holderName && (
                                            <p className="text-sm text-red-600 mt-1">{cardErrors.holderName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Tus datos de pago están protegidos y encriptados
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={cancelBooking}
                                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (validateCreditCard()) {
                                        handleBooking();
                                    }
                                }}
                                disabled={isBooking || !bookingForm.name.trim() || !bookingForm.email.trim() || !selectedTicketType || !selectedTicket || selectedTicket.available_quantity === 0 || bookingForm.tickets > selectedTicket.available_quantity || !creditCard.number.trim() || !creditCard.expiry.trim() || !creditCard.cvv.trim() || !creditCard.holderName.trim()}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-[var(--verde-oscuro1)] to-[var(--verde-oscuro2)] text-white font-bold rounded-xl hover:from-[var(--verde-oscuro2)] hover:to-[var(--verde-oscuro1)] transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isBooking ? 'Procesando...' : (() => {
                                    const breakdown = calculatePriceBreakdown();
                                    return `Pagar RD$ ${breakdown ? breakdown.total.toLocaleString('es-DO') : '0'}`;
                                })()}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
