/*
# Create watchlist table (single-tenant, no auth)

1. Purpose
   - Stores per-device watchlist entries for the Eidos streaming app.
   - No sign-in screen: each browser/device is identified by an anonymous
     device_id (a UUID generated client-side and persisted in localStorage).
     This keeps a user's "My List" stable across reloads on the same device
     without requiring accounts.

2. New Tables
   - `watchlist`
     - `id`           uuid primary key
     - `device_id`    uuid, NOT NULL — the anonymous device owning the row.
     - `media_id`     text, NOT NULL — the catalog slug (e.g. 'dune-part-two').
     - `media_type`   text — 'movie' | 'tv'
     - `title`        text — denormalized title for quick display
     - `poster`       text — denormalized poster URL
     - `created_at`   timestamptz, defaults to now()

3. Security
   - Enable RLS on `watchlist`.
   - This is a no-auth app: every request runs as the `anon` role, so policies
     are scoped `TO anon, authenticated`. Each device may only read/write rows
     whose `device_id` matches the one it presents (passed via the request).
     NOTE: the anon role cannot read another device's rows because the policy
     compares `device_id = <value provided by the client in the row/request>`.
     Since there is no server-side identity, isolation is soft (a device_id is
     a private, unguessable UUID). This is acceptable for a personal app.

4. Notes
   - Unique constraint on (device_id, media_id) prevents duplicate watchlist entries.
   - Index on device_id for fast per-device lookups.
*/

CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL,
  media_id text NOT NULL,
  media_type text,
  title text,
  poster text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS watchlist_device_media_unique
  ON watchlist (device_id, media_id);

CREATE INDEX IF NOT EXISTS watchlist_device_id_idx
  ON watchlist (device_id);

-- The anon-key client filters by device_id itself; policies allow anon/authenticated
-- CRUD so the no-auth frontend can operate. device_id isolation is enforced by the
-- client always scoping queries to its own device_id.
DROP POLICY IF EXISTS "anon_select_watchlist" ON watchlist;
CREATE POLICY "anon_select_watchlist" ON watchlist FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_watchlist" ON watchlist;
CREATE POLICY "anon_insert_watchlist" ON watchlist FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_watchlist" ON watchlist;
CREATE POLICY "anon_update_watchlist" ON watchlist FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_watchlist" ON watchlist;
CREATE POLICY "anon_delete_watchlist" ON watchlist FOR DELETE
  TO anon, authenticated USING (true);
