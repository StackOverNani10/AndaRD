import { Event } from '../lib/supabase';
import { useEffect, useRef } from 'react';

// Declarar tipos para Google Maps API
declare global {
  interface Window {
    google: any;
  }
}

interface MapSectionProps {
  events: Event[];
}

// Función para obtener ícono personalizado según categoría
const getEventIcon = (categoryId: string, categoryName?: string, categoryIcon?: string, categoryColor?: string) => {
  // Mapa de nombres de categorías a íconos reales de la base de datos
  const categoryNameToIconMap: Record<string, string> = {
    'Conciertos': 'music',
    'Música': 'music',
    'Excursiones': 'compass',
    'Aventura': 'compass',
    'Gastronomía': 'utensils',
    'Senderismo': 'mountain',
    'Cultura': 'theater',
    'Deportes': 'trophy',
  };

  // Función para generar ícono SVG con colores dinámicos
  const createIconSVG = (iconType: string, color: string) => {
    const colorMap: Record<string, Record<string, string>> = {
      music: {
        primary: color,
        secondary: '#ffffff',
      },
      utensils: {
        primary: color,
        secondary: '#ffffff',
        accent: color,
      },
      compass: {
        primary: color,
        secondary: '#ffffff',
      },
      theater: {
        primary: color,
        secondary: '#ffffff',
      },
      trophy: {
        primary: color,
        secondary: '#ffffff',
      },
      mountain: {
        primary: color,
        secondary: '#ffffff',
      },
    };

    const colors = colorMap[iconType] || { primary: '#0f713d', secondary: '#ffffff' };

    switch (iconType) {
      case 'music':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
            <!-- Auriculares modernos -->
            <path d="M10 18 Q10 14 14 14 L18 14 Q22 14 22 18 L22 22 Q22 26 18 26 L14 26 Q10 26 10 22 Z"
                  stroke="${colors.secondary}" stroke-width="2.5" fill="none"/>
            <path d="M26 18 Q26 14 30 14 L30 14 Q30 14 30 14 L30 14"
                  stroke="${colors.secondary}" stroke-width="2.5" fill="none"/>
            <circle cx="12" cy="20" r="3" fill="${colors.secondary}"/>
            <circle cx="28" cy="20" r="3" fill="${colors.secondary}"/>
            <!-- Línea de conexión -->
            <path d="M22 20 L25 20" stroke="${colors.secondary}" stroke-width="2" opacity="0.7"/>
            <!-- Detalles del micrófono -->
            <rect x="18" y="24" width="4" height="8" rx="2" fill="${colors.secondary}" opacity="0.8"/>
            <circle cx="20" cy="32" r="2" fill="${colors.secondary}" opacity="0.6"/>
          </svg>
        `)}`;

      case 'utensils':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
            <!-- Plato con cubiertos -->
            <ellipse cx="20" cy="22" rx="12" ry="3" fill="${colors.secondary}" opacity="0.9"/>
            <!-- Tenedor -->
            <rect x="16" y="14" width="1.5" height="8" fill="${colors.secondary}"/>
            <rect x="18.5" y="14" width="1.5" height="8" fill="${colors.secondary}"/>
            <rect x="21" y="14" width="1.5" height="8" fill="${colors.secondary}"/>
            <!-- Cuchillo -->
            <path d="M24 14 L26 22 L24 22 Z" fill="${colors.secondary}"/>
            <!-- Comida simbólica -->
            <circle cx="20" cy="18" r="4" fill="${colors.secondary}" opacity="0.7"/>
            <circle cx="18" cy="16" r="1.5" fill="${colors.accent}"/>
            <circle cx="22" cy="16" r="1.5" fill="${colors.accent}"/>
          </svg>
        `)}`;

      case 'compass':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
            <!-- Montañas -->
            <path d="M8 26 L14 18 L20 22 L26 16 L32 20 L32 30 L8 30 Z"
                  stroke="${colors.secondary}" stroke-width="2" fill="none"/>
            <!-- Sendero -->
            <path d="M12 26 Q16 24 20 26 Q24 28 28 26"
                  stroke="${colors.secondary}" stroke-width="2" fill="none" stroke-dasharray="2,2"/>
            <!-- Árbol/elemento natural -->
            <circle cx="15" cy="20" r="2" fill="${colors.secondary}" opacity="0.8"/>
            <rect x="14.5" y="22" width="1" height="4" fill="${colors.secondary}" opacity="0.8"/>
          </svg>
        `)}`;

      case 'theater':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
            <!-- Teatro/escenario con cortinas -->
            <rect x="12" y="16" width="16" height="10" rx="2" stroke="${colors.secondary}" stroke-width="2" fill="none"/>
            <!-- Cortinas -->
            <path d="M12 16 L12 12 L14 14 L16 12 L18 14 L20 12 L22 14 L24 12 L26 14 L28 12 L28 16"
                  stroke="${colors.secondary}" stroke-width="1.5" fill="none"/>
            <!-- Escenario -->
            <rect x="14" y="24" width="12" height="2" fill="${colors.secondary}" opacity="0.8"/>
            <!-- Elementos culturales -->
            <circle cx="20" cy="20" r="2" fill="${colors.secondary}"/>
          </svg>
        `)}`;

      case 'trophy':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
            <!-- Pelota de fútbol/soccer -->
            <circle cx="20" cy="20" r="7" stroke="${colors.secondary}" stroke-width="2" fill="none"/>
            <path d="M13 20 Q20 13 27 20 Q20 27 13 20" stroke="${colors.secondary}" stroke-width="1.5" fill="none"/>
            <path d="M20 13 Q20 20 20 27" stroke="${colors.secondary}" stroke-width="1.5"/>
            <!-- Líneas del campo -->
            <path d="M20 13 L20 27" stroke="${colors.secondary}" stroke-width="1" opacity="0.3"/>
            <path d="M13 20 L27 20" stroke="${colors.secondary}" stroke-width="1" opacity="0.3"/>
            <!-- Porterías -->
            <rect x="16" y="18" width="2" height="4" rx="1" fill="${colors.secondary}" opacity="0.7"/>
            <rect x="22" y="18" width="2" height="4" rx="1" fill="${colors.secondary}" opacity="0.7"/>
          </svg>
        `)}`;

      case 'mountain':
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
            <!-- Montañas más altas -->
            <path d="M5 28 L12 16 L20 20 L28 12 L35 18 L35 32 L5 32 Z"
                  stroke="${colors.secondary}" stroke-width="2" fill="none"/>
            <!-- Sendero más pronunciado -->
            <path d="M8 28 Q15 22 20 26 Q25 30 32 28"
                  stroke="${colors.secondary}" stroke-width="2" fill="none" stroke-dasharray="3,2"/>
            <!-- Árboles -->
            <circle cx="12" cy="18" r="1.5" fill="${colors.secondary}" opacity="0.8"/>
            <rect x="11.75" y="19.5" width="0.5" height="3" fill="${colors.secondary}" opacity="0.8"/>
            <circle cx="25" cy="15" r="1.5" fill="${colors.secondary}" opacity="0.8"/>
            <rect x="24.75" y="16.5" width="0.5" height="3" fill="${colors.secondary}" opacity="0.8"/>
          </svg>
        `)}`;

      default:
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
          </svg>
        `)}`;
    }
  };

  // Si tenemos el ícono directamente de la categoría (datos de Supabase)
  if (categoryIcon) {
    return createIconSVG(categoryIcon, categoryColor || '#0f713d');
  }

  // Si categoryId ya es un ícono válido de la base de datos
  const validIconIds = ['music', 'utensils', 'compass', 'theater', 'trophy', 'mountain'];
  if (validIconIds.includes(categoryId)) {
    return createIconSVG(categoryId, categoryColor || '#0f713d');
  }

  // Si tenemos un nombre de categoría, mapea a ícono
  if (categoryName) {
    const iconId = categoryNameToIconMap[categoryName] || 'music';
    return createIconSVG(iconId, categoryColor || '#0f713d');
  }

  // Fallback por defecto
  return createIconSVG('music', categoryColor || '#0f713d');
};

export function MapSection({ events }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    console.log('MapSection useEffect ejecutándose');
    console.log('mapRef.current:', mapRef.current);
    console.log('window.google:', window.google);
    console.log('Eventos recibidos:', events.length);

    if (!mapRef.current) {
      console.log('mapRef.current es null');
      return;
    }

    if (!window.google) {
      console.log('window.google no está disponible');
      return;
    }

    console.log('Inicializando mapa...');

    try {
      // Crear mapa usando la API de JavaScript de Google Maps
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 18.7357, lng: -70.1627 },
        zoom: 8,
        mapId: '27b36cbee5ea47b143ca4369',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      console.log('Mapa creado exitosamente:', map);

      // Limpiar marcadores anteriores si existen
      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current = [];

      // Agregar marcadores para cada evento filtrado
      events.forEach((event, index) => {
        if (event.latitude && event.longitude) {
          console.log(`Agregando marcador ${index + 1} para evento filtrado:`, event.title);

          const marker = new window.google.maps.Marker({
            position: { lat: event.latitude, lng: event.longitude },
            map: map,
            title: event.title,
            icon: {
              url: getEventIcon(event.category_id, event.event_categories?.name, event.event_categories?.icon, event.event_categories?.color),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            },
          });

          // Guardar referencia del marcador
          markersRef.current.push(marker);

          console.log(`Marcador ${index + 1} creado:`, marker);

          // Crear ventana de información para cada marcador
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="px-4 max-w-sm">
                <div>
                  ${event.image_url ? `
                    <img src="${event.image_url}" alt="${event.title}" class="w-full h-32 object-cover rounded-lg mb-3">
                  ` : ''}
                  <h4 class="font-bold text-green-800 text-lg mb-2">${event.title}</h4>
                  <div class="space-y-2 text-sm">
                    <p class="text-gray-600 flex items-center gap-2">
                      <span class="text-green-600">📍</span>
                      ${event.location}
                    </p>
                    <p class="text-orange-600 font-semibold flex items-center gap-2">
                      <span class="text-green-600">📅</span>
                      ${new Date(event.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    ${event.price >= 0 ? `
                      <p class="text-green-700 font-bold flex items-center gap-2">
                        <span class="text-orange-600">💰</span>
                        ${event.price > 0 ? `RD$ ${event.price.toLocaleString()}` : 'Gratis'}
                      </p>
                    ` : ''}
                    <p class="text-gray-700 text-xs leading-relaxed">
                      ${event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}
                    </p>
                    ${event.highlights && event.highlights.length > 0 ? `
                      <div class="pt-2">
                        <p class="text-green-800 font-semibold text-xs mb-1">Destacados:</p>
                        <ul class="text-xs text-gray-600 space-y-1">
                          ${event.highlights.slice(0, 2).map(highlight => `<li>• ${highlight}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `,
          });

          marker.addListener('click', () => {
            console.log(`Clic en marcador ${index + 1}`);
            infoWindow.open(map, marker);
          });
        }
      });

      console.log(`Mapa actualizado con ${events.length} eventos filtrados`);

      // Si hay eventos filtrados, ajustar el centro y zoom para mostrarlos mejor
      if (events.length > 0) {
        // Calcular el centro promedio de los eventos filtrados
        const validEvents = events.filter(event => event.latitude && event.longitude);
        if (validEvents.length > 0) {
          const avgLat = validEvents.reduce((sum, event) => sum + event.latitude, 0) / validEvents.length;
          const avgLng = validEvents.reduce((sum, event) => sum + event.longitude, 0) / validEvents.length;

          // Ajustar el centro del mapa si hay eventos
          setTimeout(() => {
            map.setCenter({ lat: avgLat, lng: avgLng });
            if (validEvents.length === 1) {
              map.setZoom(12); // Zoom más cercano para un solo evento
            } else if (validEvents.length < 5) {
              map.setZoom(10); // Zoom medio para pocos eventos
            } else {
              map.setZoom(8); // Zoom amplio para muchos eventos
            }
          }, 100);
        }
      }

    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }, [events]);

  return (
    <div className="bg-gradient-to-br from-green-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-800 mb-4">
            Ubicación de Eventos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre la magia de República Dominicana a través de sus eventos más emocionantes
          </p>
        </div>

        {/* Mapa usando la API de JavaScript de Google Maps */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div
              ref={mapRef}
              className="w-full h-96 rounded-lg bg-gray-100"
              style={{ border: '2px solid #e5e7eb', minHeight: '400px' }}
            />

            <p className="text-sm text-gray-600 text-center mt-4">
              Mapa interactivo con {events.length} evento{events.length !== 1 ? 's' : ''} filtrado{events.length !== 1 ? 's' : ''}. Haz clic en los números para ver detalles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
