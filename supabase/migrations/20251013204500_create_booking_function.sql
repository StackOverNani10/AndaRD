-- Create function to handle atomic event booking with availability checking
CREATE OR REPLACE FUNCTION book_event_spot(
  event_id uuid,
  user_id uuid,
  user_name text,
  user_email text,
  number_of_tickets integer
)
RETURNS json AS $$
DECLARE
  current_spots integer;
  booking_result json;
BEGIN
  -- Get current available spots
  SELECT available_spots INTO current_spots
  FROM events
  WHERE id = event_id;

  -- Check if there are enough spots available
  IF current_spots < number_of_tickets THEN
    RAISE EXCEPTION 'No hay suficientes entradas disponibles. Disponibles: %, Solicitadas: %', current_spots, number_of_tickets;
  END IF;

  -- Use a transaction to atomically decrement spots and create booking
  BEGIN
    -- Decrement available spots
    UPDATE events
    SET available_spots = available_spots - number_of_tickets
    WHERE id = event_id;

    -- Create the booking record
    INSERT INTO bookings (
      event_id,
      user_id,
      user_name,
      user_email,
      number_of_tickets,
      total_price,
      booking_status
    )
    SELECT
      event_id,
      user_id,
      user_name,
      user_email,
      number_of_tickets,
      price * number_of_tickets,
      'confirmed'
    FROM events
    WHERE id = event_id
    RETURNING json_build_object(
      'booking_id', id,
      'event_id', event_id,
      'tickets_booked', number_of_tickets,
      'remaining_spots', (SELECT available_spots FROM events WHERE id = event_id)
    ) INTO booking_result;

    -- Return success result
    RETURN booking_result;

  EXCEPTION
    WHEN OTHERS THEN
      -- If anything fails, rollback the transaction
      RAISE EXCEPTION 'Error al procesar la reserva: %', SQLERRM;
  END;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION book_event_spot(uuid, uuid, text, text, integer) TO authenticated;
