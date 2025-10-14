/*
  # Create AndaRD Events Schema

  ## Overview
  Creates the database schema for AndaRD tourism platform showcasing events in Dominican Republic.

  ## 1. New Tables

  ### `event_categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text, not null) - Category name (e.g., "Conciertos", "Excursiones")
  - `icon` (text) - Icon identifier for UI display
  - `color` (text) - Color code for category theming
  - `created_at` (timestamptz) - Record creation timestamp

  ### `events` 
  - `id` (uuid, primary key) - Unique identifier for each event
  - `title` (text, not null) - Event title
  - `description` (text, not null) - Detailed event description
  - `category_id` (uuid, foreign key) - References event_categories
  - `location` (text, not null) - Event location in Dominican Republic
  - `latitude` (numeric) - Geographic latitude coordinate
  - `longitude` (numeric) - Geographic longitude coordinate
  - `date` (timestamptz, not null) - Event date and time
  - `image_url` (text) - Event image URL (Pexels stock photo)
  - `price` (numeric) - Event price in local currency
  - `available_spots` (integer) - Number of available spots/tickets remaining
  - `highlights` (text[]) - Array of event highlights
  - `created_at` (timestamptz) - Record creation timestamp

  ### `reviews`
  - `id` (uuid, primary key) - Unique identifier for each review
  - `event_id` (uuid, foreign key) - References events table
  - `author_name` (text, not null) - Reviewer name
  - `rating` (integer, not null) - Rating from 1-5
  - `comment` (text, not null) - Review comment
  - `helpful_count` (integer, default 0) - Number of helpful votes
  - `created_at` (timestamptz) - Review creation timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Public read access for events, categories, and reviews
  - Authenticated users can create reviews

  ## 3. Sample Data
  - Pre-populate with Dominican Republic event categories
  - Add sample events showcasing different event types
  - Include sample reviews with tips and advice
*/

-- Create event_categories table
CREATE TABLE IF NOT EXISTS event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES event_categories(id) ON DELETE SET NULL,
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  date timestamptz NOT NULL,
  image_url text,
  price numeric,
  available_spots integer DEFAULT 100,
  highlights text[],
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for event_categories
CREATE POLICY "Public can view event categories"
  ON event_categories FOR SELECT
  TO public
  USING (true);

-- Public read access for events
CREATE POLICY "Public can view events"
  ON events FOR SELECT
  TO public
  USING (true);

-- Public read access for reviews
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert event categories
INSERT INTO event_categories (name, icon, color) VALUES
  ('Conciertos', 'music', '#FF6B6B'),
  ('Excursiones', 'compass', '#4ECDC4'),
  ('Gastronomía', 'utensils', '#FFD93D'),
  ('Senderismo', 'mountain', '#95E1D3'),
  ('Cultura', 'theater', '#A8E6CF'),
  ('Deportes', 'trophy', '#FF8B94')
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, category_id, location, latitude, longitude, date, image_url, price, available_spots, highlights)
SELECT 
  'Festival de Jazz de Cabarete',
  'Disfruta de tres días de jazz internacional en la hermosa playa de Cabarete. Los mejores artistas del Caribe y del mundo se reúnen para ofrecer conciertos inolvidables frente al mar.',
  (SELECT id FROM event_categories WHERE name = 'Conciertos'),
  'Cabarete, Puerto Plata',
  19.7578,
  -70.5100,
  '2025-11-15 19:00:00',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
  2500,
  100,
  ARRAY['Artistas internacionales', 'Vista al mar', 'Food trucks', 'Ambiente familiar']
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Festival de Jazz de Cabarete');

INSERT INTO events (title, description, category_id, location, latitude, longitude, date, image_url, price, available_spots, highlights)
SELECT 
  'Expedición 27 Charcos de Damajagua',
  'Aventura extrema por las 27 cascadas naturales de Damajagua. Salta, nada y deslízate por toboganes naturales en una de las maravillas naturales de República Dominicana.',
  (SELECT id FROM event_categories WHERE name = 'Excursiones'),
  'Damajagua, Puerto Plata',
  19.8167,
  -70.8833,
  '2025-10-20 08:00:00',
  'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg',
  1800,
  50,
  ARRAY['Guía profesional', 'Equipo incluido', 'Almuerzo típico', 'Transporte desde hotel']
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Expedición 27 Charcos de Damajagua');

INSERT INTO events (title, description, category_id, location, latitude, longitude, date, image_url, price, available_spots, highlights)
SELECT 
  'Tour Gastronómico Zona Colonial',
  'Recorre la historia culinaria dominicana en la Zona Colonial de Santo Domingo. Degusta platos tradicionales en los mejores restaurantes locales mientras aprendes sobre nuestra cultura.',
  (SELECT id FROM event_categories WHERE name = 'Gastronomía'),
  'Zona Colonial, Santo Domingo',
  18.4733,
  -69.8839,
  '2025-10-25 10:00:00',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
  1200,
  30,
  ARRAY['7 paradas gastronómicas', 'Chef guía experto', 'Bebidas incluidas', 'Historia y cultura']
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Tour Gastronómico Zona Colonial');

INSERT INTO events (title, description, category_id, location, latitude, longitude, date, image_url, price, available_spots, highlights)
SELECT 
  'Senderismo Pico Duarte',
  'Conquista la montaña más alta del Caribe. Expedición de 3 días al Pico Duarte con guías expertos, camping bajo las estrellas y vistas espectaculares.',
  (SELECT id FROM event_categories WHERE name = 'Senderismo'),
  'Jarabacoa, La Vega',
  19.0333,
  -71.0167,
  '2025-11-01 06:00:00',
  'https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg',
  5500,
  20,
  ARRAY['3 días / 2 noches', 'Guías certificados', 'Comidas incluidas', 'Equipo de camping']
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Senderismo Pico Duarte');

INSERT INTO events (title, description, category_id, location, latitude, longitude, date, image_url, price, available_spots, highlights)
SELECT 
  'Carnaval de La Vega',
  'El carnaval más colorido y tradicional del país. Disfruta de diablos cojuelos, música, baile y la auténtica cultura dominicana en su máxima expresión.',
  (SELECT id FROM event_categories WHERE name = 'Cultura'),
  'La Vega',
  19.2250,
  -70.5333,
  '2026-02-15 15:00:00',
  'https://images.pexels.com/photos/3618162/pexels-photo-3618162.jpeg',
  500,
  200,
  ARRAY['Desfile de comparsas', 'Disfraces tradicionales', 'Música en vivo', 'Comida típica']
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Carnaval de La Vega');

INSERT INTO events (title, description, category_id, location, latitude, longitude, date, image_url, price, available_spots, highlights)
SELECT 
  'Kitesurf Pro Championship',
  'Campeonato internacional de kitesurf en una de las mejores playas del mundo. Observa a los mejores atletas o inscríbete en los talleres para principiantes.',
  (SELECT id FROM event_categories WHERE name = 'Deportes'),
  'Cabarete, Puerto Plata',
  19.7578,
  -70.5100,
  '2025-12-10 09:00:00',
  'https://images.pexels.com/photos/390051/surfer-wave-sunset-the-indian-ocean-390051.jpeg',
  0,
  500,
  ARRAY['Entrada gratuita', 'Talleres disponibles', 'Zona de food trucks', 'Música en vivo']
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Kitesurf Pro Championship');

-- Insert sample reviews
INSERT INTO reviews (event_id, author_name, rating, comment, helpful_count)
SELECT 
  (SELECT id FROM events WHERE title = 'Expedición 27 Charcos de Damajagua'),
  'María González',
  5,
  '¡Increíble experiencia! Los guías son muy profesionales y te hacen sentir seguro en todo momento. Consejo: lleva zapatos acuáticos con buen agarre, el terreno puede ser resbaladizo. El almuerzo estuvo delicioso.',
  15
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE author_name = 'María González');

INSERT INTO reviews (event_id, author_name, rating, comment, helpful_count)
SELECT 
  (SELECT id FROM events WHERE title = 'Tour Gastronómico Zona Colonial'),
  'Carlos Pérez',
  5,
  'Mejor tour gastronómico que he tomado. Probé platos que nunca había visto y la chef guía explicó cada ingrediente con pasión. Recomendación: ven con hambre, las porciones son generosas.',
  23
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE author_name = 'Carlos Pérez');

INSERT INTO reviews (event_id, author_name, rating, comment, helpful_count)
SELECT 
  (SELECT id FROM events WHERE title = 'Senderismo Pico Duarte'),
  'Ana Rodríguez',
  4,
  'Desafiante pero gratificante. La vista desde la cima vale cada paso. Consejo importante: entrena antes, no subestimes la dificultad. Los guías son excelentes y el equipo está en buenas condiciones.',
  18
WHERE NOT EXISTS (SELECT 1 FROM reviews WHERE author_name = 'Ana Rodríguez');