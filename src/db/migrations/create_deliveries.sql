-- Run once in pgAdmin against the foodbank schema
CREATE TABLE IF NOT EXISTS foodbank.deliveries (
  id           SERIAL       PRIMARY KEY,
  reference    VARCHAR(20)  UNIQUE NOT NULL,
  user_id      INTEGER      REFERENCES foodbank.users(id),
  food_bank_id INTEGER      REFERENCES foodbank.food_banks(id),
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(20)  NOT NULL,
  address      TEXT         NOT NULL,
  postcode     VARCHAR(10)  NOT NULL,
  notes        TEXT,
  status       VARCHAR(20)  DEFAULT 'preparing',
  created_at   TIMESTAMP    DEFAULT NOW()
);