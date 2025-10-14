-- Create bookings table for event reservations
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id uuid REFERENCES ticket_types(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  number_of_tickets integer NOT NULL DEFAULT 1 CHECK (number_of_tickets > 0),
  total_price numeric NOT NULL,
  booking_status text NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  booking_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ticket_type_id ON bookings(ticket_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create bookings for themselves
CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public read access for events (for availability checking)
CREATE POLICY "Public can view event bookings count"
  ON bookings FOR SELECT
  TO public
  USING (true);
