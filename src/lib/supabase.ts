import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export type EventCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
};

export type TicketType = {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  max_quantity?: number;
  available_quantity: number;
  is_active: boolean;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  category_id: string;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  image_url: string;
  price: number;
  highlights: string[];
  available_spots: number;
  created_at: string;
  event_categories?: EventCategory;
  ticket_types?: TicketType[];
};

export type Review = {
  id: string;
  event_id: string;
  author_name: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
};

export type Booking = {
  id: string;
  event_id: string;
  ticket_type_id?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  number_of_tickets: number;
  total_price: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled';
  booking_date: string;
  created_at: string;
};
