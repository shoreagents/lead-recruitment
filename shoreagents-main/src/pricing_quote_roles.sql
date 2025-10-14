-- public.pricing_quote_roles definition

-- Drop table

-- DROP TABLE public.pricing_quote_roles;

CREATE TABLE public.pricing_quote_roles (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	quote_id uuid NOT NULL,
	role_title text NOT NULL,
	role_description text NULL,
	experience_level text NOT NULL,
	workspace_type text NOT NULL,
	base_salary_php numeric(10, 2) NOT NULL,
	multiplier numeric(3, 2) NOT NULL,
	monthly_cost numeric(10, 2) NOT NULL,
	workspace_cost numeric(10, 2) NOT NULL,
	total_cost numeric(10, 2) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT pricing_quote_roles_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_pricing_quote_roles_quote_id ON public.pricing_quote_roles USING btree (quote_id);

-- Table Triggers

create trigger trigger_update_pricing_quote_roles_updated_at before
update
    on
    public.pricing_quote_roles for each row execute function update_updated_at_column();


-- public.pricing_quote_roles foreign keys

ALTER TABLE public.pricing_quote_roles ADD CONSTRAINT fk_pricing_quote_roles_quote_id FOREIGN KEY (quote_id) REFERENCES public.pricing_quotes(id) ON DELETE CASCADE;