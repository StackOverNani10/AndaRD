import { Sparkles, MapPin, Phone, Mail, Clock, Users, Star, Award, Heart } from 'lucide-react';

const ANDARD_LOGO_URL = 'https://res.cloudinary.com/deqtp71ut/image/upload/v1760411254/AndaRD/andard_logo.png';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[var(--verde-oscuro2)] via-[var(--verde-oscuro3)] to-[var(--verde-oscuro1)] text-white overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-sm animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/10 rounded-full blur-lg animate-pulse delay-1500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Estadísticas destacadas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center group cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Users className="w-8 h-8 group-hover:text-[var(--naranja1)] transition-colors duration-300" />
            </div>
            <div className="text-2xl font-bold mb-1 group-hover:text-[var(--naranja1)] transition-colors duration-300">10K+</div>
            <div className="text-sm text-white/80">Usuarios Activos</div>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <MapPin className="w-8 h-8 group-hover:text-[var(--naranja1)] transition-colors duration-300" />
            </div>
            <div className="text-2xl font-bold mb-1 group-hover:text-[var(--naranja1)] transition-colors duration-300">500+</div>
            <div className="text-sm text-white/80">Lugares Únicos</div>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Star className="w-8 h-8 group-hover:text-[var(--naranja1)] transition-colors duration-300" />
            </div>
            <div className="text-2xl font-bold mb-1 group-hover:text-[var(--naranja1)] transition-colors duration-300">4.9</div>
            <div className="text-sm text-white/80">Calificación Promedio</div>
          </div>

          <div className="text-center group cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Award className="w-8 h-8 group-hover:text-[var(--naranja1)] transition-colors duration-300" />
            </div>
            <div className="text-2xl font-bold mb-1 group-hover:text-[var(--naranja1)] transition-colors duration-300">5</div>
            <div className="text-sm text-white/80">Años de Experiencia</div>
          </div>
        </div>

        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <div className="flex justify-start items-center mb-6">
              <img
                src={ANDARD_LOGO_URL}
                alt="AndaRD Logo"
                className="h-auto w-24 hover:scale-110 transition-all duration-300 cursor-pointer"
              />
            </div>
            <p className="text-white/90 text-lg leading-relaxed mb-6 hover:text-white transition-colors duration-300">
              Tu compañero definitivo para descubrir las experiencias más auténticas de República Dominicana.
              Desde playas paradisíacas hasta aventuras culturales inolvidables.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/80 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <Clock className="w-4 h-4 text-[var(--naranja1)]" />
                <span>Lun - Vie: 8:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white hover:text-[var(--naranja1)] transition-colors duration-300 cursor-pointer">Explorar</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/80 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[var(--naranja1)] rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                <span className="group-hover:text-[var(--naranja1)] transition-colors duration-200">Eventos Populares</span>
              </a></li>
              <li><a href="#" className="text-white/80 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[var(--naranja1)] rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                <span className="group-hover:text-[var(--naranja1)] transition-colors duration-200">Nuevos Lanzamientos</span>
              </a></li>
              <li><a href="#" className="text-white/80 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[var(--naranja1)] rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                <span className="group-hover:text-[var(--naranja1)] transition-colors duration-200">Categorías</span>
              </a></li>
              <li><a href="#" className="text-white/80 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-3 group">
                <span className="w-2 h-2 bg-[var(--naranja1)] rounded-full group-hover:scale-125 transition-transform duration-200"></span>
                <span className="group-hover:text-[var(--naranja1)] transition-colors duration-200">Próximos Eventos</span>
              </a></li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-white hover:text-[var(--naranja1)] transition-colors duration-300 cursor-pointer">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-all duration-200 group cursor-pointer">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--naranja1)]/20 transition-all duration-200">
                  <Phone className="w-4 h-4 text-[var(--naranja1)] group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-200">+1 (809) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-all duration-200 group cursor-pointer">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--naranja1)]/20 transition-all duration-200">
                  <Mail className="w-4 h-4 text-[var(--naranja1)] group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-200">info@andard.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-all duration-200 group cursor-pointer">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[var(--naranja1)]/20 transition-all duration-200">
                  <MapPin className="w-4 h-4 text-[var(--naranja1)] group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="group-hover:translate-x-1 transition-transform duration-200">Santo Domingo, RD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria con efecto mejorado */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-6 py-2 bg-gradient-to-r from-[var(--verde-oscuro2)] to-[var(--verde-oscuro3)] rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--naranja1)] animate-pulse" />
                <Heart className="w-4 h-4 text-[var(--naranja1)] animate-pulse delay-300" />
                <Sparkles className="w-5 h-5 text-[var(--naranja1)] animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright y derechos mejorados */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white/90 text-sm">
              <span className="flex items-center gap-2">
                Hecho con <Heart className="w-4 h-4 text-[var(--naranja1)] animate-pulse" /> para República Dominicana
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white hover:text-[var(--naranja1)] transition-all duration-200 relative group">
                Política de Privacidad
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--naranja1)] group-hover:w-full transition-all duration-200"></span>
              </a>
              <span className="text-white/40">•</span>
              <a href="#" className="hover:text-white hover:text-[var(--naranja1)] transition-all duration-200 relative group">
                Términos de Servicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--naranja1)] group-hover:w-full transition-all duration-200"></span>
              </a>
              <span className="text-white/40">•</span>
              <a href="#" className="hover:text-white hover:text-[var(--naranja1)] transition-all duration-200 relative group">
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--naranja1)] group-hover:w-full transition-all duration-200"></span>
              </a>
            </div>
          </div>
          <div className="mt-4 text-xs text-white/50">
            © 2025 AndaRD. Todos los derechos reservados. | Plataforma desarrollada para promover el turismo dominicano.
          </div>
        </div>
      </div>
    </footer>
  );
}
