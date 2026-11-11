CREATE TABLE public.arcade_fight_rooms (
 code text PRIMARY KEY,
 host_token_hash text NOT NULL,
 guest_token_hash text,
 host_character text NOT NULL,
 state jsonb NOT NULL,
 version integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '2 hours')
);
GRANT ALL ON public.arcade_fight_rooms TO service_role;
ALTER TABLE public.arcade_fight_rooms ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.arcade_fight_rooms IS 'Short-lived arcade rooms; server-only access, scoped player capabilities, optimistic concurrency. No direct browser policies.';