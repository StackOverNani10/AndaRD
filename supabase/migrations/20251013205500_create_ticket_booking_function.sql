-- Drop the old function if it exists with different signature
DROP FUNCTION IF EXISTS book_event_ticket(uuid, uuid, uuid, text, text, integer);

-- Create function to handle atomic ticket booking with ticket type support
CREATE OR REPLACE FUNCTION book_event_ticket(
  number_of_tickets integer,
  p_event_id uuid,
  ticket_type_id uuid,
  user_email text,
  user_id uuid,
  user_name text
)
RETURNS json AS $$
DECLARE
  ticket_record record;
  booking_result json;
BEGIN
  RAISE NOTICE 'Starting book_event_ticket with number_of_tickets: %, event_id: %, ticket_type_id: %', $1, $2, $3;

  -- Get ticket type details
  RAISE NOTICE 'Querying ticket_types for ticket_type_id: % and event_id: %', $3, $2;
  SELECT * INTO ticket_record
  FROM ticket_types
  WHERE id = $3 AND event_id = $2 AND is_active = true;

  RAISE NOTICE 'Ticket record found: %', ticket_record;

  -- Check if ticket type exists and is active
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tipo de ticket no encontrado o inactivo';
  END IF;

  -- Check if there are enough tickets available for this type
  IF ticket_record.available_quantity < number_of_tickets THEN
    RAISE EXCEPTION 'No hay suficientes entradas disponibles para este tipo. Disponibles: %, Solicitadas: %', ticket_record.available_quantity, number_of_tickets;
  END IF;

  -- Use a transaction to atomically decrement ticket availability and create booking
  BEGIN
    RAISE NOTICE 'Starting transaction for UPDATE and INSERT';

    -- Decrement available quantity for this ticket type
    UPDATE ticket_types
    SET available_quantity = available_quantity - $1
    WHERE id = $3 AND event_id = $2;

    RAISE NOTICE 'Updated ticket availability for ticket_type_id: %', $3;

    -- Create the booking record
    INSERT INTO bookings (
      event_id,
      ticket_type_id,
      user_id,
      user_name,
      user_email,
      number_of_tickets,
      total_price,
      booking_status
    )
    VALUES (
      $2,
      $3,
      $5,
      $6,
      $4,
      $1,
      ticket_record.price * $1,
      'confirmed'
    )
    RETURNING json_build_object(
      'booking_id', id,
      'event_id', $2,
      'ticket_type_id', $3,
      'tickets_booked', $1,
      'ticket_price', ticket_record.price,
      'total_price', ticket_record.price * $1,
      'remaining_tickets', (SELECT available_quantity FROM ticket_types WHERE id = $3 AND event_id = $2)
    ) INTO booking_result;

    RAISE NOTICE 'Booking created successfully: %', booking_result;

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
GRANT EXECUTE ON FUNCTION book_event_ticket(integer, uuid, uuid, text, uuid, text) TO authenticated;
