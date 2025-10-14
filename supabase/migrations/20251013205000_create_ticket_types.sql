-- Create ticket_types table for multiple ticket options per event
CREATE TABLE IF NOT EXISTS ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL, -- e.g., 'General', 'VIP', 'Estudiante', 'Niños'
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  max_quantity integer, -- NULL for unlimited
  available_quantity integer, -- Current available spots for this ticket type
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX idx_ticket_types_active ON ticket_types(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;

-- Public read access for ticket types
CREATE POLICY "Public can view ticket types"
  ON ticket_types FOR SELECT
  TO public
  USING (is_active = true);

-- Update events table to remove single price field (will use ticket_types instead)
-- Note: We'll keep the price field for backward compatibility but make it nullable
ALTER TABLE events ALTER COLUMN price DROP NOT NULL;

-- Add constraint to ensure available_quantity never goes below 0
ALTER TABLE ticket_types ADD CONSTRAINT check_available_quantity_positive CHECK (available_quantity >= 0);

-- Insert sample ticket types for existing events
INSERT INTO ticket_types (event_id, name, description, price, max_quantity, available_quantity)
SELECT
  e.id,
  'Entrada General',
  'Acceso estándar al evento',
  COALESCE(e.price, 0),
  100,
  100
FROM events e
WHERE e.price IS NOT NULL
ON CONFLICT DO NOTHING;

-- Add VIP tickets for premium events
INSERT INTO ticket_types (event_id, name, description, price, max_quantity, available_quantity)
SELECT
  e.id,
  'Entrada VIP',
  'Acceso VIP con beneficios exclusivos',
  GREATEST(COALESCE(e.price, 0) * 1.5, 100),
  20,
  20
FROM events e
WHERE e.price > 1000 -- Only for premium events
ON CONFLICT DO NOTHING;

-- Add student discount for educational events
INSERT INTO ticket_types (event_id, name, description, price, max_quantity, available_quantity)
SELECT
  e.id,
  'Estudiante',
  'Entrada con descuento para estudiantes (ID requerido)',
  GREATEST(COALESCE(e.price, 0) * 0.7, 50),
  50,
  50
FROM events e
WHERE e.price > 500 -- For events that might have student pricing
ON CONFLICT DO NOTHING;
