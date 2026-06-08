-- Run once in pgAdmin against the foodbank schema
CREATE TABLE IF NOT EXISTS foodbank.food_banks (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  address     TEXT NOT NULL,
  postcode    VARCHAR(10)  NOT NULL,
  phone       VARCHAR(20),
  email       VARCHAR(150),
  lat         DECIMAL(9,6) NOT NULL,
  lng         DECIMAL(9,6) NOT NULL,
  hours       TEXT,
  description TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO foodbank.food_banks (name, address, postcode, phone, email, lat, lng, hours, description) VALUES
('Birmingham Central Food Bank',   '123 Broad Street, Birmingham',             'B1 2AA',  '0121 000 1001', 'central@feedbirmingham.org',      52.481400, -1.900000, 'Mon–Fri: 10:00–16:00',                  'Centrally located food bank serving the city centre area.'),
('Sparkhill Food Bank',            '78 Sparkhill Road, Birmingham',            'B11 4EJ', '0121 000 1002', 'sparkhill@feedbirmingham.org',    52.455500, -1.862000, 'Mon, Wed, Fri: 11:00–14:00',            'Community food bank serving the Sparkhill and Sparkbrook areas.'),
('Narthex Sparkhill',              '40 Stratford Road, Sparkhill, Birmingham', 'B11 1JB', '0121 000 1003', 'narthex@feedbirmingham.org',      52.457500, -1.865000, 'Tue, Thu: 10:00–13:00',                 'Community hub providing hot meals and food parcels.'),
('Kings Heath Food Bank',          '18 Institute Road, Kings Heath',           'B14 7EG', '0121 000 1004', 'kingsheath@feedbirmingham.org',   52.428000, -1.887000, 'Mon–Thu: 09:30–15:30, Fri: 09:30–13:00','Serving the Kings Heath, Moseley and Stirchley communities.'),
('B30 Foodbank Centre',            '23a Watford Road, Bournville',             'B30 2JG', '07582 143972',  'b30@feedbirmingham.org',          52.428500, -1.925000, 'Tue: 13:30–15:30, Fri: 10:00–12:00',   'Friendly volunteers and excellent food provision for south Birmingham.'),
('Great Barr Food Bank',           'Broome Avenue, Great Barr',                'B44 8NL', '0121 357 5399', 'greatbarr@feedbirmingham.org',    52.552000, -1.905000, 'Wed: 10:00–12:00, Fri: 12:00–14:00',   'Well-organised food bank serving the Great Barr and Pheasey areas.'),
('Bethany Foodbank',               'Church Road, Erdington, Birmingham',       'B23 7AB', '0121 000 1007', 'bethany@feedbirmingham.org',      52.503000, -1.874000, 'Mon, Wed, Fri: 10:00–13:00',            'Faith-based food bank open to all Birmingham residents.'),
('Green Lane Food Bank',           '45 Green Lane, Small Heath',               'B9 5DE',  '0121 000 1008', 'greenlane@feedbirmingham.org',    52.466000, -1.853000, 'Tue, Thu, Sat: 10:00–14:00',            'Serving the Small Heath and Bordesley Green communities.'),
('Noor E Huda Masjid Food Bank',   '120 Highfield Road, Hall Green',           'B28 0EL', '0121 000 1009', 'noorelhuda@feedbirmingham.org',   52.452000, -1.838000, 'Daily: 08:00–22:00',                    '24-hour food bank providing support at any time of day.'),
('Feeding Hands Digbeth',          '24-28 Smithfield House, Digbeth',          'B5 6BS',  '0300 000 0300', 'digbeth@feedbirmingham.org',      52.472000, -1.886000, 'Mon–Sat: 09:00–17:00',                  'Open to all — no referral needed. Serves the Digbeth and Highgate areas.');