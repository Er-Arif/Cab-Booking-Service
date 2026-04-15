CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  profile_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  profile_image_url TEXT,
  vehicle_type TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  status TEXT NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  current_latitude NUMERIC(9, 6),
  current_longitude NUMERIC(9, 6),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  total_rides INTEGER NOT NULL DEFAULT 0,
  upi_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ride_categories (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  base_fare NUMERIC(10, 2) NOT NULL,
  minimum_fare NUMERIC(10, 2) NOT NULL,
  per_km_rate NUMERIC(10, 2) NOT NULL,
  per_minute_rate NUMERIC(10, 2) NOT NULL,
  waiting_charge NUMERIC(10, 2) NOT NULL,
  cancellation_fee NUMERIC(10, 2) NOT NULL,
  free_waiting_minutes INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS service_zones (
  id TEXT PRIMARY KEY,
  zone_name TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS landmarks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(9, 6) NOT NULL,
  longitude NUMERIC(9, 6) NOT NULL,
  zone_id TEXT REFERENCES service_zones(id),
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rides (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  driver_id TEXT,
  category_key TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  drop_address TEXT NOT NULL,
  pickup_note TEXT,
  drop_note TEXT,
  pickup_latitude NUMERIC(9, 6) NOT NULL,
  pickup_longitude NUMERIC(9, 6) NOT NULL,
  drop_latitude NUMERIC(9, 6) NOT NULL,
  drop_longitude NUMERIC(9, 6) NOT NULL,
  estimated_distance_km NUMERIC(10, 2) NOT NULL,
  estimated_fare NUMERIC(10, 2) NOT NULL,
  final_fare NUMERIC(10, 2),
  status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  booked_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  arrived_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  ride_id TEXT NOT NULL REFERENCES rides(id),
  raised_by_type TEXT NOT NULL,
  raised_by_id TEXT NOT NULL,
  complaint_type TEXT NOT NULL,
  description TEXT NOT NULL,
  resolution_status TEXT NOT NULL,
  resolution_note TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);
