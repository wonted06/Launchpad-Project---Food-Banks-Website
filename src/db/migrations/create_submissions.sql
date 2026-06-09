-- Run once in pgAdmin against the foodbank schema

CREATE TABLE IF NOT EXISTS foodbank.contact_submissions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  subject    VARCHAR(50)  NOT NULL DEFAULT 'General Enquiry',
  message    TEXT         NOT NULL,
  created_at TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foodbank.feedback (
  id         SERIAL PRIMARY KEY,
  rating     SMALLINT     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  service    VARCHAR(50),
  comment    TEXT,
  email      VARCHAR(150),
  created_at TIMESTAMP    DEFAULT NOW()
);