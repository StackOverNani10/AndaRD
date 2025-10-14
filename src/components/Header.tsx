import { EventCategory } from '../lib/supabase';

const ANDARD_LOGO_URL = 'https://res.cloudinary.com/deqtp71ut/image/upload/v1760411254/AndaRD/andard_logo.png';

interface HeaderProps {
  categories: EventCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function Header({ categories, selectedCategory, onCategoryChange }: HeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[var(--verde-oscuro1)] via-[var(--verde-oscuro2)] to-[var(--verde-oscuro3)] text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center mb-4">
            <img
              src={ANDARD_LOGO_URL}
              alt="AndaRD Logo"
              className="h-36 w-auto drop-shadow-xl"
            />
          </div>
          <p className="text-2xl font-medium max-w-2xl mx-auto text-orange-100">
            Descubre los mejores eventos y experiencias en República Dominicana
          </p>
          <p className="text-lg max-w-3xl mx-auto text-orange-50">
            Conciertos, excursiones, gastronomía, senderismo y mucho más.
            Lee reseñas auténticas y consejos de viajeros como tú.
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${selectedCategory === null
              ? 'bg-white text-[var(--verde-oscuro1)] shadow-xl scale-105'
              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
          >
            Todos los Eventos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${selectedCategory === category.id
                ? 'bg-white shadow-xl scale-105'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              style={
                selectedCategory === category.id
                  ? { color: category.color }
                  : undefined
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
