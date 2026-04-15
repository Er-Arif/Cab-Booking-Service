INSERT INTO ride_categories (id, key, name, base_fare, minimum_fare, per_km_rate, per_minute_rate, waiting_charge, cancellation_fee, free_waiting_minutes, is_active)
VALUES
  ('cat_bike', 'bike', 'Bike', 20, 35, 9, 1, 2, 10, 3, TRUE),
  ('cat_erickshaw', 'e_rickshaw', 'E-rickshaw', 30, 50, 12, 1, 3, 15, 5, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO service_zones (id, zone_name, status, notes)
VALUES
  ('zone_station', 'Railway Station', 'active', 'Pilot priority zone'),
  ('zone_busstand', 'Bus Stand', 'active', 'High-footfall arrival point'),
  ('zone_market', 'Main Market', 'active', 'Dense local trips'),
  ('zone_hospital', 'Hospital Area', 'active', 'Care and emergency travel')
ON CONFLICT (id) DO NOTHING;

INSERT INTO landmarks (id, name, address, latitude, longitude, zone_id, status)
VALUES
  ('lm_1', 'Madhupur Railway Station', 'Railway Station Road, Madhupur', 24.273300, 86.646700, 'zone_station', 'active'),
  ('lm_2', 'Bus Stand', 'Main Bus Stand, Madhupur', 24.274800, 86.641900, 'zone_busstand', 'active'),
  ('lm_3', 'Main Market', 'Main Market Area, Madhupur', 24.271400, 86.639500, 'zone_market', 'active'),
  ('lm_4', 'Hospital Area', 'Civil Hospital Area, Madhupur', 24.269100, 86.644100, 'zone_hospital', 'active')
ON CONFLICT (id) DO NOTHING;
