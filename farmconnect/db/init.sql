-- FarmConnect seed data
CREATE TABLE IF NOT EXISTS farms (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  location  TEXT NOT NULL,
  crop      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO farms (name, location, crop) VALUES
  ('Green Acres',   'Iowa',       'Corn'),
  ('Sunny Fields',  'California', 'Strawberries'),
  ('Blue Ridge Farm','Virginia',  'Apples');
