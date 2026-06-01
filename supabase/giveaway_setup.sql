-- ============================================================================
-- Giveaway entries + winners
--
-- Anon can INSERT (the public /nagradna-igra/ form posts via the edge
-- function with the anon key). Authenticated users (admins logged into
-- /admin/zrebanje/) can SELECT and INSERT winners.
--
-- Apply via:
--   psql $SUPABASE_DB_URL < supabase/giveaway_setup.sql
-- or via the Supabase SQL editor in the dashboard.
-- ============================================================================

-- 1. Entries -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.giveaway_entries (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at             timestamptz NOT NULL DEFAULT now(),
  ime                    text NOT NULL DEFAULT '',
  priimek                text NOT NULL DEFAULT '',
  naslov                 text NOT NULL DEFAULT '',
  telefon                text NOT NULL DEFAULT '',
  email                  text NOT NULL DEFAULT '',
  consent                boolean NOT NULL DEFAULT false,
  consent_timestamp      timestamptz,
  consent_location_label text DEFAULT '',
  source                 text DEFAULT '',
  user_agent             text DEFAULT ''
);

CREATE INDEX IF NOT EXISTS giveaway_entries_created_at_idx
  ON public.giveaway_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS giveaway_entries_email_idx
  ON public.giveaway_entries (lower(email));

ALTER TABLE public.giveaway_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon can submit giveaway entries" ON public.giveaway_entries;
CREATE POLICY "Anon can submit giveaway entries"
  ON public.giveaway_entries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can read giveaway entries" ON public.giveaway_entries;
CREATE POLICY "Authenticated can read giveaway entries"
  ON public.giveaway_entries FOR SELECT
  TO authenticated
  USING (true);

-- 2. Winners (zapisnik žrebanja) --------------------------------------------
CREATE TABLE IF NOT EXISTS public.giveaway_winners (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drawn_at     timestamptz NOT NULL DEFAULT now(),
  position     int NOT NULL CHECK (position BETWEEN 1 AND 3),
  entry_id     uuid REFERENCES public.giveaway_entries(id) ON DELETE SET NULL,
  ime          text NOT NULL DEFAULT '',
  priimek      text NOT NULL DEFAULT '',
  email        text NOT NULL DEFAULT '',
  telefon      text NOT NULL DEFAULT '',
  drawn_by     text DEFAULT ''  -- admin email who pressed the button
);

CREATE INDEX IF NOT EXISTS giveaway_winners_drawn_at_idx
  ON public.giveaway_winners (drawn_at DESC);

ALTER TABLE public.giveaway_winners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read winners" ON public.giveaway_winners;
CREATE POLICY "Authenticated can read winners"
  ON public.giveaway_winners FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can insert winners" ON public.giveaway_winners;
CREATE POLICY "Authenticated can insert winners"
  ON public.giveaway_winners FOR INSERT
  TO authenticated
  WITH CHECK (true);
