-- Run this once in pgAdmin (Query Tool) against the foodbank schema
ALTER TABLE foodbank.users
  ADD COLUMN IF NOT EXISTS theme           VARCHAR(10)  NOT NULL DEFAULT 'light',
  ADD COLUMN IF NOT EXISTS text_size       SMALLINT     NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS colour_blind    BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS text_to_speech  BOOLEAN      NOT NULL DEFAULT FALSE;


ALTER TABLE foodbank.users
  ADD COLUMN IF NOT EXISTS language VARCHAR(20) NOT NULL DEFAULT 'en';