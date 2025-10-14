-- Update existing events to have default ticket types based on their current price
-- This ensures backward compatibility for events that don't have explicit ticket types

DO $$
DECLARE
  event_record RECORD;
BEGIN
  -- For each event that doesn't have ticket types yet, create a default one
  FOR event_record IN
    SELECT id, title, price, available_spots
    FROM events e
    WHERE NOT EXISTS (
      SELECT 1 FROM ticket_types tt WHERE tt.event_id = e.id
    )
  LOOP
    -- Create default ticket type
    INSERT INTO ticket_types (
      event_id,
      name,
      description,
      price,
      max_quantity,
      available_quantity
    ) VALUES (
      event_record.id,
      'Entrada General',
      'Acceso estándar al evento',
      COALESCE(event_record.price, 0),
      LEAST(event_record.available_spots, 100), -- Cap at 100 or current availability
      event_record.available_spots
    );

    -- If the event has a premium price, add a VIP option
    IF event_record.price > 1000 THEN
      INSERT INTO ticket_types (
        event_id,
        name,
        description,
        price,
        max_quantity,
        available_quantity
      ) VALUES (
        event_record.id,
        'Entrada VIP',
        'Acceso VIP con beneficios exclusivos',
        GREATEST(event_record.price * 1.5, event_record.price + 500),
        LEAST(event_record.available_spots / 4, 20), -- Max 20 VIP tickets or 25% of capacity
        LEAST(event_record.available_spots / 4, 20)
      );
    END IF;

  END LOOP;
END $$;
