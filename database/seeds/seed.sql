insert into admins (id, name, phone, email)
values ('00000000-0000-0000-0000-000000000001', 'Madhupur Ops Admin', '9000000001', 'admin@madhupur.local')
on conflict (phone) do update
set name = excluded.name,
    email = excluded.email,
    updated_at = now();

insert into users (id, name, phone, email, emergency_contact, preferred_payment_method, status)
values ('00000000-0000-0000-0000-000000000002', 'Aman Kumar', '9000000002', 'aman@example.com', '9000000010', 'cash', 'active')
on conflict (phone) do update
set name = excluded.name,
    email = excluded.email,
    emergency_contact = excluded.emergency_contact,
    preferred_payment_method = excluded.preferred_payment_method,
    updated_at = now();

insert into drivers (id, name, phone, address, vehicle_type, vehicle_number, status, is_online, current_latitude, current_longitude, rating, total_rides, upi_id)
values
  ('00000000-0000-0000-0000-000000000003', 'Rakesh Yadav', '9000000003', 'Station Road, Madhupur', 'bike', 'JH-15AB-1010', 'approved', true, 24.274500, 86.640100, 4.7, 124, 'rakesh@upi'),
  ('00000000-0000-0000-0000-000000000004', 'Sanjay Das', '9000000004', 'Bus Stand Road, Madhupur', 'e_rickshaw', 'JH-15ER-2020', 'approved', true, 24.271200, 86.646300, 4.5, 88, 'sanjay@upi')
on conflict (phone) do update
set name = excluded.name,
    address = excluded.address,
    vehicle_type = excluded.vehicle_type,
    vehicle_number = excluded.vehicle_number,
    status = excluded.status,
    is_online = excluded.is_online,
    current_latitude = excluded.current_latitude,
    current_longitude = excluded.current_longitude,
    rating = excluded.rating,
    total_rides = excluded.total_rides,
    upi_id = excluded.upi_id,
    updated_at = now();

insert into ride_categories (id, key, name, base_fare, minimum_fare, per_km_rate, per_minute_rate, waiting_charge, cancellation_fee, free_waiting_minutes, capacity_note, is_active)
values
  ('cat_bike', 'bike', 'Bike', 20, 35, 9, 1, 2, 10, 3, 'Best for solo short-distance travel', true),
  ('cat_erickshaw', 'e_rickshaw', 'E-rickshaw', 30, 50, 12, 1, 3, 15, 5, 'Best for family and market travel', true)
on conflict (id) do update
set name = excluded.name,
    base_fare = excluded.base_fare,
    minimum_fare = excluded.minimum_fare,
    per_km_rate = excluded.per_km_rate,
    per_minute_rate = excluded.per_minute_rate,
    waiting_charge = excluded.waiting_charge,
    cancellation_fee = excluded.cancellation_fee,
    free_waiting_minutes = excluded.free_waiting_minutes,
    capacity_note = excluded.capacity_note,
    is_active = excluded.is_active;

insert into service_zones (id, zone_name, status, notes)
values
  ('zone_station', 'Railway Station', 'active', 'Pilot priority zone'),
  ('zone_busstand', 'Bus Stand', 'active', 'High-footfall arrival point'),
  ('zone_market', 'Main Market', 'active', 'Dense local trips'),
  ('zone_hospital', 'Hospital Area', 'active', 'Care and emergency travel')
on conflict (id) do update
set zone_name = excluded.zone_name,
    status = excluded.status,
    notes = excluded.notes;

insert into landmarks (id, name, address, latitude, longitude, zone_id, status)
values
  ('lm_1', 'Madhupur Railway Station', 'Railway Station Road, Madhupur', 24.273300, 86.646700, 'zone_station', 'active'),
  ('lm_2', 'Bus Stand', 'Main Bus Stand, Madhupur', 24.274800, 86.641900, 'zone_busstand', 'active'),
  ('lm_3', 'Main Market', 'Main Market Area, Madhupur', 24.271400, 86.639500, 'zone_market', 'active'),
  ('lm_4', 'Hospital Area', 'Civil Hospital Area, Madhupur', 24.269100, 86.644100, 'zone_hospital', 'active')
on conflict (id) do update
set name = excluded.name,
    address = excluded.address,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    zone_id = excluded.zone_id,
    status = excluded.status;

insert into rides (id, customer_id, driver_id, category_key, pickup_address, drop_address, pickup_latitude, pickup_longitude, drop_latitude, drop_longitude, estimated_distance_km, estimated_fare, final_fare, status, payment_method, payment_status, booked_at, accepted_at, arrived_at, started_at, completed_at)
values (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  'bike',
  'Madhupur Railway Station',
  'Main Market',
  24.273300,
  86.646700,
  24.271400,
  86.639500,
  1.50,
  35.00,
  36.00,
  'payment_completed',
  'cash',
  'completed',
  now(),
  now(),
  now(),
  now(),
  now()
)
on conflict (id) do nothing;

insert into payments (id, ride_id, driver_id, amount, payment_method, payment_status, driver_earning, platform_commission, transaction_reference)
values (
  '00000000-0000-0000-0000-000000000201',
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000003',
  36.00,
  'cash',
  'completed',
  30.60,
  5.40,
  'txn_seed_ride_1'
)
on conflict (ride_id) do nothing;

insert into complaints (id, ride_id, raised_by_type, raised_by_id, complaint_type, description, resolution_status, resolution_note, created_at, resolved_at)
values (
  '00000000-0000-0000-0000-000000000301',
  '00000000-0000-0000-0000-000000000101',
  'customer',
  '00000000-0000-0000-0000-000000000002',
  'support_follow_up',
  'Need invoice copy',
  'resolved',
  'Invoice shared over support channel',
  now(),
  now()
)
on conflict (id) do nothing;
