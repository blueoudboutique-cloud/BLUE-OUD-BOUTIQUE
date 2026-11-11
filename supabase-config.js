-- BLUE OUD BOUTIQUE: optional storefront content tables.
-- Run once in the Supabase SQL editor for the SAME project used by the store.
-- Existing products, categories, orders and store_settings are not changed.
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['banners','scents','features','pages'] LOOP
    EXECUTE format('CREATE TABLE IF NOT EXISTS public.%I (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
      description text NOT NULL DEFAULT '''' CHECK (char_length(description) <= 10000),
      sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order BETWEEN 0 AND 9999),
      active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now()
    )', table_name);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', table_name);
    EXECUTE format('GRANT INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=table_name AND policyname='Public read active') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (active OR EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))','Public read active',table_name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=table_name AND policyname='Admin insert') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))','Admin insert',table_name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=table_name AND policyname='Admin update') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid()))) WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))','Admin update',table_name);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=table_name AND policyname='Admin delete') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))','Admin delete',table_name);
    END IF;
  END LOOP;
END $$;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS link_url text;
ALTER TABLE public.scents ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.features ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS blue_oud_pages_slug_unique ON public.pages(slug);
