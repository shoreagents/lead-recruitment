-- public.pricing_quotes definition

-- Drop table

-- DROP TABLE public.pricing_quotes;

CREATE TABLE public.pricing_quotes (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id text NOT NULL,
	session_id text NULL,
	quote_timestamp timestamptz DEFAULT now() NOT NULL,
	member_count int4 NOT NULL,
	industry text NOT NULL,
	total_monthly_cost numeric(10, 2) NOT NULL,
	currency_code varchar(3) DEFAULT 'PHP'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT pricing_quotes_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_pricing_quotes_industry ON public.pricing_quotes USING btree (industry);
CREATE INDEX idx_pricing_quotes_user_id ON public.pricing_quotes USING btree (user_id);

-- Table Triggers

create trigger trigger_update_pricing_quotes_updated_at before
update
    on
    public.pricing_quotes for each row execute function update_updated_at_column();


-- public.pricing_quotes foreign keys

ALTER TABLE public.pricing_quotes ADD CONSTRAINT fk_pricing_quotes_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;