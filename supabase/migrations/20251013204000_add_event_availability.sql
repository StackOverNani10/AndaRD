-- Add availability management to events table
-- Add available_spots column to track remaining capacity
ALTER TABLE events ADD COLUMN IF NOT EXISTS available_spots integer DEFAULT 100;

-- Update existing events with reasonable availability (can be adjusted by admin later)
UPDATE events SET available_spots = 100 WHERE available_spots IS NULL;

-- Add constraint to ensure available_spots never goes below 0
ALTER TABLE events ADD CONSTRAINT check_available_spots_positive CHECK (available_spots >= 0);

-- Create index for better performance when checking availability
CREATE INDEX IF NOT EXISTS idx_events_available_spots ON events(available_spots);

-- Add comments for documentation
COMMENT ON COLUMN events.available_spots IS 'Number of available spots/tickets remaining for this event';
