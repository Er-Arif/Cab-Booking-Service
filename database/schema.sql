create table if not exists admins (
  id uuid primary key,
  name text not null,
  phone text not null unique,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key,
  name text not null,
  phone text not null unique,
  email text,
  profile_image_url text,
  emergency_contact text,
  preferred_payment_method text check (preferred_payment_method in ('cash', 'upi')),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists drivers (
  id uuid primary key,
  name text not null,
  phone text not null unique,
  address text,
  profile_image_url text,
  vehicle_type text not null check (vehicle_type in ('bike', 'e_rickshaw')),
  vehicle_number text not null,
  status text not null check (status in ('pending', 'approved', 'rejected', 'suspended')),
  is_online boolean not null default false,
  current_latitude numeric(9, 6),
  current_longitude numeric(9, 6),
  rating numeric(3, 2) not null default 0,
  total_rides integer not null default 0,
  upi_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ride_categories (
  id text primary key,
  key text not null unique check (key in ('bike', 'e_rickshaw')),
  name text not null,
  base_fare numeric(10, 2) not null,
  minimum_fare numeric(10, 2) not null,
  per_km_rate numeric(10, 2) not null,
  per_minute_rate numeric(10, 2) not null,
  waiting_charge numeric(10, 2) not null,
  cancellation_fee numeric(10, 2) not null,
  free_waiting_minutes integer not null,
  capacity_note text not null default '',
  is_active boolean not null default true
);

create table if not exists service_zones (
  id text primary key,
  zone_name text not null,
  status text not null check (status in ('active', 'inactive')),
  notes text
);

create table if not exists landmarks (
  id text primary key,
  name text not null,
  address text not null,
  latitude numeric(9, 6) not null,
  longitude numeric(9, 6) not null,
  zone_id text not null references service_zones(id),
  status text not null check (status in ('active', 'inactive'))
);

create table if not exists rides (
  id uuid primary key,
  customer_id uuid not null references users(id),
  driver_id uuid references drivers(id),
  category_key text not null references ride_categories(key),
  pickup_address text not null,
  drop_address text not null,
  pickup_note text,
  drop_note text,
  pickup_latitude numeric(9, 6) not null,
  pickup_longitude numeric(9, 6) not null,
  drop_latitude numeric(9, 6) not null,
  drop_longitude numeric(9, 6) not null,
  estimated_distance_km numeric(10, 2) not null,
  estimated_fare numeric(10, 2) not null,
  final_fare numeric(10, 2),
  status text not null check (
    status in (
      'requested',
      'searching_driver',
      'driver_assigned',
      'driver_arriving',
      'driver_arrived',
      'trip_started',
      'trip_completed',
      'cancelled_by_user',
      'cancelled_by_driver',
      'cancelled_by_admin',
      'payment_pending',
      'payment_completed'
    )
  ),
  payment_method text not null check (payment_method in ('cash', 'upi')),
  payment_status text not null check (payment_status in ('pending', 'recorded', 'completed', 'failed')),
  booked_at timestamptz not null default now(),
  accepted_at timestamptz,
  arrived_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

create table if not exists payments (
  id uuid primary key,
  ride_id uuid not null unique references rides(id) on delete cascade,
  driver_id uuid references drivers(id),
  amount numeric(10, 2) not null,
  payment_method text not null check (payment_method in ('cash', 'upi')),
  payment_status text not null check (payment_status in ('pending', 'recorded', 'completed', 'failed')),
  driver_earning numeric(10, 2) not null,
  platform_commission numeric(10, 2) not null,
  transaction_reference text not null,
  created_at timestamptz not null default now()
);

create table if not exists complaints (
  id uuid primary key,
  ride_id uuid not null references rides(id),
  raised_by_type text not null check (raised_by_type in ('customer', 'driver')),
  raised_by_id uuid not null,
  complaint_type text not null,
  description text not null,
  resolution_status text not null check (resolution_status in ('open', 'in_review', 'resolved', 'closed')),
  resolution_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists otp_requests (
  id uuid primary key,
  phone text not null,
  role text not null check (role in ('customer', 'driver', 'admin')),
  otp_code text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed_at timestamptz
);

create table if not exists refresh_tokens (
  id uuid primary key,
  user_id uuid not null,
  role text not null check (role in ('customer', 'driver', 'admin')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index if not exists idx_rides_customer_id on rides(customer_id);
create index if not exists idx_rides_driver_id on rides(driver_id);
create index if not exists idx_otp_requests_phone_role on otp_requests(phone, role);
