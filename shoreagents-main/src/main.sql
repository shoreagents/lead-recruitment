-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

-- DROP DOMAIN public."content_type";

CREATE DOMAIN public."content_type" AS text
	COLLATE "default"
	CONSTRAINT content_type_check CHECK (VALUE ~ '^\S+\/\S+'::text);
-- DROP DOMAIN public."http_method";

CREATE DOMAIN public."http_method" AS text
	COLLATE "default";
-- DROP TYPE public."user_type_enum";

CREATE TYPE public."user_type_enum" AS ENUM (
	'Anonymous',
	'Regular',
	'Admin');

-- DROP SEQUENCE public.ai_analysis_id_seq;

CREATE SEQUENCE public.ai_analysis_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.ai_analysis_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.ai_analysis_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.ai_analysis_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.ai_analysis_id_seq TO authenticated;

-- DROP SEQUENCE public.bpoc_employees_id_seq;

CREATE SEQUENCE public.bpoc_employees_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.bpoc_employees_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.bpoc_employees_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.bpoc_employees_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.bpoc_employees_id_seq TO authenticated;

-- DROP SEQUENCE public.candidate_views_id_seq;

CREATE SEQUENCE public.candidate_views_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.candidate_views_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.candidate_views_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.candidate_views_id_seq TO anon;
GRANT ALL ON SEQUENCE public.candidate_views_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.candidate_views_id_seq TO public;

-- DROP SEQUENCE public.interview_request_id_seq;

CREATE SEQUENCE public.interview_request_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.interview_request_id_seq OWNER TO postgres;
GRANT ALL ON SEQUENCE public.interview_request_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.interview_request_id_seq TO anon;
GRANT ALL ON SEQUENCE public.interview_request_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.interview_request_id_seq TO service_role;
-- public.bpoc_employees definition

-- Drop table

-- DROP TABLE public.bpoc_employees;

CREATE TABLE public.bpoc_employees (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	full_name varchar(255) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	current_position varchar(255) NULL,
	"position" varchar(255) NULL,
	"location" varchar(255) NULL,
	avatar_url text NULL,
	bio text NULL,
	overall_score int4 DEFAULT 0 NULL,
	skills_snapshot jsonb DEFAULT '[]'::jsonb NULL,
	experience_snapshot jsonb NULL,
	expected_salary numeric(10, 2) NULL,
	work_status varchar(100) NULL,
	user_created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	key_strengths jsonb DEFAULT '[]'::jsonb NULL,
	improvements jsonb DEFAULT '[]'::jsonb NULL,
	recommendations jsonb DEFAULT '[]'::jsonb NULL,
	improved_summary text NULL,
	strengths_analysis jsonb NULL,
	work_status_completed bool DEFAULT false NULL,
	CONSTRAINT bpoc_employees_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100))),
	CONSTRAINT bpoc_employees_pkey PRIMARY KEY (id),
	CONSTRAINT bpoc_employees_user_id_key UNIQUE (user_id)
);
CREATE INDEX idx_bpoc_employees_created_at ON public.bpoc_employees USING btree (created_at);
CREATE INDEX idx_bpoc_employees_full_name ON public.bpoc_employees USING btree (full_name);
CREATE INDEX idx_bpoc_employees_location ON public.bpoc_employees USING btree (location);
CREATE INDEX idx_bpoc_employees_overall_score ON public.bpoc_employees USING btree (overall_score);
CREATE INDEX idx_bpoc_employees_position ON public.bpoc_employees USING btree ("position");
CREATE INDEX idx_bpoc_employees_user_id ON public.bpoc_employees USING btree (user_id);
CREATE INDEX idx_bpoc_employees_work_status ON public.bpoc_employees USING btree (work_status);
CREATE INDEX idx_bpoc_employees_work_status_completed ON public.bpoc_employees USING btree (work_status_completed);

-- Table Triggers

create trigger update_bpoc_employees_updated_at before
update
    on
    public.bpoc_employees for each row execute function update_bpoc_employees_updated_at();

-- Permissions

ALTER TABLE public.bpoc_employees OWNER TO postgres;
GRANT ALL ON TABLE public.bpoc_employees TO postgres;
GRANT ALL ON TABLE public.bpoc_employees TO anon;


-- public.content_views definition

-- Drop table

-- DROP TABLE public.content_views;

CREATE TABLE public.content_views (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id varchar(255) NULL,
	"content_type" varchar(50) NOT NULL,
	content_id varchar(255) NOT NULL,
	content_title varchar(500) NULL,
	content_url text NULL,
	page_section varchar(100) NULL,
	referrer_url text NULL,
	referrer_type varchar(50) NULL,
	view_duration int4 NULL,
	scroll_depth int4 NULL,
	viewed_at timestamptz DEFAULT now() NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	interaction_type varchar(50) DEFAULT 'view'::character varying NULL,
	activity_count int4 DEFAULT 1 NULL,
	CONSTRAINT content_views_activity_count_check CHECK ((activity_count > 0)),
	CONSTRAINT content_views_interaction_type_check CHECK (((interaction_type)::text = ANY (ARRAY[('view'::character varying)::text, ('click'::character varying)::text, ('scroll'::character varying)::text, ('form_submit'::character varying)::text, ('page_exit'::character varying)::text, ('return_visit'::character varying)::text]))),
	CONSTRAINT content_views_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_content_views_activity_count ON public.content_views USING btree (activity_count);
CREATE INDEX idx_content_views_content_analytics ON public.content_views USING btree (content_type, content_id, viewed_at);
CREATE INDEX idx_content_views_content_id ON public.content_views USING btree (content_id);
CREATE INDEX idx_content_views_content_type ON public.content_views USING btree (content_type);
CREATE INDEX idx_content_views_interaction_analytics ON public.content_views USING btree (content_type, content_id, interaction_type);
CREATE INDEX idx_content_views_interaction_type ON public.content_views USING btree (interaction_type);
CREATE INDEX idx_content_views_referrer_type ON public.content_views USING btree (referrer_type);
CREATE INDEX idx_content_views_user_analytics ON public.content_views USING btree (user_id, viewed_at);
CREATE INDEX idx_content_views_user_id ON public.content_views USING btree (user_id);
CREATE INDEX idx_content_views_viewed_at ON public.content_views USING btree (viewed_at);

-- Table Triggers

create trigger trigger_update_content_views_updated_at before
update
    on
    public.content_views for each row execute function update_content_views_updated_at();

-- Permissions

ALTER TABLE public.content_views OWNER TO postgres;
GRANT ALL ON TABLE public.content_views TO postgres;
GRANT ALL ON TABLE public.content_views TO anon;
GRANT DELETE, SELECT, INSERT, UPDATE ON TABLE public.content_views TO authenticated;


-- public.user_page_visits definition

-- Drop table

-- DROP TABLE public.user_page_visits;

CREATE TABLE public.user_page_visits (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id text NOT NULL,
	page_path text NOT NULL,
	ip_address text NULL,
	visit_timestamp timestamptz DEFAULT now() NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	visit_count int4 DEFAULT 1 NULL,
	time_spent_seconds int4 DEFAULT 0 NULL,
	last_visit_timestamp timestamptz DEFAULT now() NULL,
	CONSTRAINT user_page_visits_pkey PRIMARY KEY (id)
);

-- Table Triggers

create trigger trigger_create_user_on_page_visit before
insert
    on
    public.user_page_visits for each row execute function create_user_on_page_visit();

-- Permissions

ALTER TABLE public.user_page_visits OWNER TO postgres;
GRANT ALL ON TABLE public.user_page_visits TO postgres;
GRANT ALL ON TABLE public.user_page_visits TO anon;
GRANT ALL ON TABLE public.user_page_visits TO authenticated;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id varchar(255) NOT NULL,
	first_name varchar(100) NULL,
	last_name varchar(100) NULL,
	company varchar(200) NULL,
	email varchar(255) NULL,
	phone_number varchar(20) NULL,
	country varchar(100) NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	auth_user_id uuid NULL,
	user_type public."user_type_enum" DEFAULT 'Anonymous'::user_type_enum NOT NULL,
	industry_name varchar(200) NULL,
	first_lead_capture bool DEFAULT false NULL,
	second_lead_capture bool DEFAULT false NULL,
	third_lead_capture bool DEFAULT false NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_user_id_key UNIQUE (user_id)
);
CREATE INDEX idx_users_company ON public.users USING btree (company);
CREATE INDEX idx_users_country ON public.users USING btree (country);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_first_lead_capture ON public.users USING btree (first_lead_capture);
CREATE INDEX idx_users_industry_name ON public.users USING btree (industry_name);
CREATE INDEX idx_users_second_lead_capture ON public.users USING btree (second_lead_capture);
CREATE INDEX idx_users_third_lead_capture ON public.users USING btree (third_lead_capture);
CREATE INDEX idx_users_user_id ON public.users USING btree (user_id);

-- Table Triggers

create trigger trigger_update_users_updated_at before
update
    on
    public.users for each row execute function update_updated_at_column();

-- Permissions

ALTER TABLE public.users OWNER TO postgres;
GRANT ALL ON TABLE public.users TO postgres;
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;


-- public.ai_analysis definition

-- Drop table

-- DROP TABLE public.ai_analysis;

CREATE TABLE public.ai_analysis (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	analysis_id varchar(255) NULL,
	session_id varchar(255) NULL,
	overall_score int4 NULL,
	ats_compatibility_score int4 NULL,
	content_quality_score int4 NULL,
	professional_presentation_score int4 NULL,
	skills_alignment_score int4 NULL,
	key_strengths jsonb DEFAULT '[]'::jsonb NULL,
	improvements jsonb DEFAULT '[]'::jsonb NULL,
	recommendations jsonb DEFAULT '[]'::jsonb NULL,
	improved_summary text NULL,
	strengths_analysis jsonb NULL,
	salary_analysis jsonb NULL,
	career_path jsonb NULL,
	section_analysis jsonb NULL,
	candidate_profile jsonb NULL,
	skills_snapshot jsonb DEFAULT '[]'::jsonb NULL,
	experience_snapshot jsonb NULL,
	education_snapshot jsonb NULL,
	portfolio_links jsonb DEFAULT '[]'::jsonb NULL,
	analysis_created_at timestamptz NULL,
	analysis_updated_at timestamptz NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT ai_analysis_analysis_id_key UNIQUE (analysis_id),
	CONSTRAINT ai_analysis_ats_compatibility_score_check CHECK (((ats_compatibility_score >= 0) AND (ats_compatibility_score <= 100))),
	CONSTRAINT ai_analysis_content_quality_score_check CHECK (((content_quality_score >= 0) AND (content_quality_score <= 100))),
	CONSTRAINT ai_analysis_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100))),
	CONSTRAINT ai_analysis_pkey PRIMARY KEY (id),
	CONSTRAINT ai_analysis_professional_presentation_score_check CHECK (((professional_presentation_score >= 0) AND (professional_presentation_score <= 100))),
	CONSTRAINT ai_analysis_skills_alignment_score_check CHECK (((skills_alignment_score >= 0) AND (skills_alignment_score <= 100))),
	CONSTRAINT ai_analysis_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.bpoc_employees(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_ai_analysis_analysis_id ON public.ai_analysis USING btree (analysis_id);
CREATE INDEX idx_ai_analysis_created_at ON public.ai_analysis USING btree (created_at);
CREATE INDEX idx_ai_analysis_overall_score ON public.ai_analysis USING btree (overall_score);
CREATE INDEX idx_ai_analysis_updated_at ON public.ai_analysis USING btree (updated_at);
CREATE INDEX idx_ai_analysis_user_id ON public.ai_analysis USING btree (user_id);

-- Permissions

ALTER TABLE public.ai_analysis OWNER TO postgres;
GRANT ALL ON TABLE public.ai_analysis TO postgres;
GRANT ALL ON TABLE public.ai_analysis TO anon;


-- public.candidate_views definition

-- Drop table

-- DROP TABLE public.candidate_views;

CREATE TABLE public.candidate_views (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	candidate_id varchar(255) NOT NULL,
	candidate_name varchar(255) NULL,
	view_duration int4 NULL,
	page_views int4 DEFAULT 1 NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	scroll_percentage int4 DEFAULT 0 NULL,
	CONSTRAINT candidate_views_candidate_id_check CHECK (((candidate_id IS NOT NULL) AND ((candidate_id)::text <> ''::text))),
	CONSTRAINT candidate_views_page_views_check CHECK ((page_views > 0)),
	CONSTRAINT candidate_views_pkey PRIMARY KEY (id),
	CONSTRAINT candidate_views_scroll_percentage_check CHECK (((scroll_percentage >= 0) AND (scroll_percentage <= 100))),
	CONSTRAINT candidate_views_user_id_check CHECK (((user_id IS NOT NULL) AND ((user_id)::text <> ''::text))),
	CONSTRAINT candidate_views_user_id_format_check CHECK (((user_id IS NOT NULL) AND ((user_id)::text <> ''::text) AND (length((user_id)::text) >= 3))),
	CONSTRAINT candidate_views_view_duration_check CHECK ((view_duration >= 0)),
	CONSTRAINT unique_user_candidate UNIQUE (user_id, candidate_id),
	CONSTRAINT candidate_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX idx_candidate_views_candidate_created ON public.candidate_views USING btree (candidate_id, created_at);
CREATE INDEX idx_candidate_views_candidate_id ON public.candidate_views USING btree (candidate_id);
CREATE INDEX idx_candidate_views_candidate_name ON public.candidate_views USING btree (candidate_name);
CREATE INDEX idx_candidate_views_created_at ON public.candidate_views USING btree (created_at);
CREATE INDEX idx_candidate_views_scroll_percentage ON public.candidate_views USING btree (scroll_percentage);
CREATE INDEX idx_candidate_views_user_created ON public.candidate_views USING btree (user_id, created_at);
CREATE INDEX idx_candidate_views_user_id ON public.candidate_views USING btree (user_id);

-- Permissions

ALTER TABLE public.candidate_views OWNER TO postgres;
GRANT ALL ON TABLE public.candidate_views TO postgres;
GRANT ALL ON TABLE public.candidate_views TO anon;
GRANT ALL ON TABLE public.candidate_views TO authenticated;
GRANT ALL ON TABLE public.candidate_views TO public;


-- public.interview_request definition

-- Drop table

-- DROP TABLE public.interview_request;

CREATE TABLE public.interview_request (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	candidate_id varchar(255) NOT NULL,
	candidate_name varchar(255) NOT NULL,
	candidate_position varchar(255) NULL,
	requester_first_name varchar(100) NOT NULL,
	requester_last_name varchar(100) NOT NULL,
	requester_email varchar(255) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT interview_request_pkey PRIMARY KEY (id),
	CONSTRAINT interview_request_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_interview_request_candidate_id ON public.interview_request USING btree (candidate_id);
CREATE INDEX idx_interview_request_created_at ON public.interview_request USING btree (created_at);
CREATE INDEX idx_interview_request_user_id ON public.interview_request USING btree (user_id);

-- Table Triggers

create trigger trigger_update_interview_request_updated_at before
update
    on
    public.interview_request for each row execute function update_updated_at_column();

-- Permissions

ALTER TABLE public.interview_request OWNER TO postgres;
GRANT ALL ON TABLE public.interview_request TO postgres;
GRANT ALL ON TABLE public.interview_request TO anon;
GRANT ALL ON TABLE public.interview_request TO authenticated;
GRANT ALL ON TABLE public.interview_request TO service_role;


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
	quote_number int4 DEFAULT 1 NOT NULL,
	candidate_recommendations jsonb DEFAULT '[]'::jsonb NULL, -- JSON array of recommended candidates for this quote
	CONSTRAINT pricing_quotes_pkey PRIMARY KEY (id),
	CONSTRAINT fk_pricing_quotes_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_pricing_quotes_candidate_recommendations ON public.pricing_quotes USING gin (candidate_recommendations);
CREATE INDEX idx_pricing_quotes_industry ON public.pricing_quotes USING btree (industry);
CREATE INDEX idx_pricing_quotes_quote_number ON public.pricing_quotes USING btree (user_id, quote_number);
CREATE INDEX idx_pricing_quotes_user_id ON public.pricing_quotes USING btree (user_id);

-- Column comments

COMMENT ON COLUMN public.pricing_quotes.candidate_recommendations IS 'JSON array of recommended candidates for this quote';

-- Table Triggers

create trigger trigger_update_pricing_quotes_updated_at before
update
    on
    public.pricing_quotes for each row execute function update_updated_at_column();
create trigger trigger_generate_quote_number before
insert
    on
    public.pricing_quotes for each row execute function generate_quote_number();

-- Permissions

ALTER TABLE public.pricing_quotes OWNER TO postgres;
GRANT ALL ON TABLE public.pricing_quotes TO postgres;
GRANT ALL ON TABLE public.pricing_quotes TO anon;
GRANT ALL ON TABLE public.pricing_quotes TO authenticated;


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
	CONSTRAINT pricing_quote_roles_pkey PRIMARY KEY (id),
	CONSTRAINT fk_pricing_quote_roles_quote_id FOREIGN KEY (quote_id) REFERENCES public.pricing_quotes(id) ON DELETE CASCADE
);
CREATE INDEX idx_pricing_quote_roles_quote_id ON public.pricing_quote_roles USING btree (quote_id);

-- Table Triggers

create trigger trigger_update_pricing_quote_roles_updated_at before
update
    on
    public.pricing_quote_roles for each row execute function update_updated_at_column();

-- Permissions

ALTER TABLE public.pricing_quote_roles OWNER TO postgres;
GRANT ALL ON TABLE public.pricing_quote_roles TO postgres;
GRANT ALL ON TABLE public.pricing_quote_roles TO anon;
GRANT ALL ON TABLE public.pricing_quote_roles TO authenticated;


-- public.candidate_view_summary source

CREATE OR REPLACE VIEW public.candidate_view_summary
AS SELECT candidate_id,
    candidate_name,
    count(*) AS total_views,
    sum(view_duration) AS total_duration,
    avg(view_duration) AS avg_duration,
    max(view_duration) AS max_duration,
    avg(scroll_percentage) AS avg_scroll_percentage,
    max(scroll_percentage) AS max_scroll_percentage,
    count(DISTINCT user_id) AS unique_users,
    min(created_at) AS first_viewed,
    max(created_at) AS last_viewed
   FROM candidate_views
  GROUP BY candidate_id, candidate_name;

-- Permissions

ALTER TABLE public.candidate_view_summary OWNER TO postgres;
GRANT ALL ON TABLE public.candidate_view_summary TO postgres;
GRANT ALL ON TABLE public.candidate_view_summary TO anon;


-- public.user_candidate_relationships source

CREATE OR REPLACE VIEW public.user_candidate_relationships
AS SELECT user_id,
    candidate_id,
    candidate_name,
    count(*) AS total_views,
    sum(view_duration) AS total_duration,
    avg(view_duration) AS avg_duration,
    max(view_duration) AS max_duration,
    avg(scroll_percentage) AS avg_scroll_percentage,
    max(scroll_percentage) AS max_scroll_percentage,
    min(created_at) AS first_viewed,
    max(created_at) AS last_viewed
   FROM candidate_views
  GROUP BY user_id, candidate_id, candidate_name;

-- Permissions

ALTER TABLE public.user_candidate_relationships OWNER TO postgres;
GRANT ALL ON TABLE public.user_candidate_relationships TO postgres;
GRANT ALL ON TABLE public.user_candidate_relationships TO anon;



-- DROP FUNCTION public.bytea_to_text(bytea);

CREATE OR REPLACE FUNCTION public.bytea_to_text(data bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$bytea_to_text$function$
;

-- Permissions

ALTER FUNCTION public.bytea_to_text(bytea) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.bytea_to_text(bytea) TO supabase_admin;

-- DROP FUNCTION public.create_user_on_page_visit();

CREATE OR REPLACE FUNCTION public.create_user_on_page_visit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if user exists, if not create one
    INSERT INTO public.users (id, user_id, user_type, created_at)
    VALUES (
        gen_random_uuid(),
        NEW.user_id,
        'Anonymous',
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.create_user_on_page_visit() OWNER TO postgres;
GRANT ALL ON FUNCTION public.create_user_on_page_visit() TO public;
GRANT ALL ON FUNCTION public.create_user_on_page_visit() TO postgres;
GRANT ALL ON FUNCTION public.create_user_on_page_visit() TO anon;

-- DROP FUNCTION public.ensure_user_exists(varchar);

CREATE OR REPLACE FUNCTION public.ensure_user_exists(p_user_id character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    existing_user_id VARCHAR(255);
BEGIN
    -- Check if user already exists
    SELECT user_id INTO existing_user_id
    FROM users
    WHERE user_id = p_user_id
    LIMIT 1;
    
    -- If user exists, return it
    IF existing_user_id IS NOT NULL THEN
        RETURN existing_user_id;
    END IF;
    
    -- If user doesn't exist, create it
    INSERT INTO users (
        user_id,
        user_type,
        created_at
    ) VALUES (
        p_user_id,
        'Anonymous',
        NOW()
    );
    
    RETURN p_user_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.ensure_user_exists(varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.ensure_user_exists(varchar) TO public;
GRANT ALL ON FUNCTION public.ensure_user_exists(varchar) TO postgres;
GRANT ALL ON FUNCTION public.ensure_user_exists(varchar) TO anon;

-- DROP FUNCTION public.fetch_bpoc_employee_by_id(text);

CREATE OR REPLACE FUNCTION public.fetch_bpoc_employee_by_id(emp_user_id text)
 RETURNS TABLE(success boolean, message text, employee_data jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        -- Parse the JSON response
        api_response := http_response::JSONB;
        
        -- Check if the API call was successful
        IF NOT (api_response->>'success')::BOOLEAN THEN
            RETURN QUERY SELECT FALSE, 'BPOC API returned unsuccessful response', NULL::JSONB;
            RETURN;
        END IF;
        
        -- Find the specific employee
        SELECT jsonb_array_elements(api_response->'data') INTO employee_data
        WHERE (jsonb_array_elements(api_response->'data')->>'user_id') = emp_user_id;
        
        IF employee_data IS NULL THEN
            RETURN QUERY SELECT FALSE, 'Employee not found in BPOC API', NULL::JSONB;
        ELSE
            RETURN QUERY SELECT TRUE, 'Employee found successfully', employee_data;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT FALSE, 'Error fetching data from BPOC API: ' || SQLERRM, NULL::JSONB;
    END;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.fetch_bpoc_employee_by_id(text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.fetch_bpoc_employee_by_id(text) TO public;
GRANT ALL ON FUNCTION public.fetch_bpoc_employee_by_id(text) TO postgres;
GRANT ALL ON FUNCTION public.fetch_bpoc_employee_by_id(text) TO anon;

-- DROP FUNCTION public.generate_quote_number();

CREATE OR REPLACE FUNCTION public.generate_quote_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Generate sequential quote number for each user
    SELECT COALESCE(MAX(quote_number), 0) + 1 
    INTO NEW.quote_number
    FROM pricing_quotes 
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.generate_quote_number() OWNER TO postgres;
GRANT ALL ON FUNCTION public.generate_quote_number() TO public;
GRANT ALL ON FUNCTION public.generate_quote_number() TO postgres;
GRANT ALL ON FUNCTION public.generate_quote_number() TO anon;

-- DROP FUNCTION public.get_all_users_activity(int4, int4);

CREATE OR REPLACE FUNCTION public.get_all_users_activity(p_days_back integer DEFAULT 30, p_limit integer DEFAULT 50)
 RETURNS TABLE(user_id character varying, user_name character varying, user_company character varying, user_email character varying, total_views bigint, unique_candidates_viewed bigint, total_favorites bigint, last_activity timestamp with time zone, activity_level character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.company as user_company,
        u.email as user_email,
        COALESCE(COUNT(cv.id), 0) as total_views,
        COALESCE(COUNT(DISTINCT cv.candidate_id), 0) as unique_candidates_viewed,
        COALESCE(COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END), 0) as total_favorites,
        MAX(cv.created_at) as last_activity,
        CASE 
            WHEN COUNT(cv.id) >= 20 THEN 'High'
            WHEN COUNT(cv.id) >= 10 THEN 'Medium'
            WHEN COUNT(cv.id) >= 1 THEN 'Low'
            ELSE 'None'
        END as activity_level
    FROM users u
    LEFT JOIN candidate_views cv ON u.user_id = cv.user_id 
        AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY u.user_id, u.first_name, u.last_name, u.company, u.email
    ORDER BY total_views DESC, last_activity DESC
    LIMIT p_limit;
END;
$function$
;

COMMENT ON FUNCTION public.get_all_users_activity(int4, int4) IS 'Returns activity summary for all users with their candidate viewing statistics';

-- Permissions

ALTER FUNCTION public.get_all_users_activity(int4, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_all_users_activity(int4, int4) TO public;
GRANT ALL ON FUNCTION public.get_all_users_activity(int4, int4) TO postgres;
GRANT ALL ON FUNCTION public.get_all_users_activity(int4, int4) TO anon;

-- DROP FUNCTION public.get_bpoc_employee_stats();

CREATE OR REPLACE FUNCTION public.get_bpoc_employee_stats()
 RETURNS TABLE(total_employees bigint, active_employees bigint, employed_employees bigint, available_employees bigint, employees_with_analysis bigint, average_score numeric, top_skills jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_employees,
        COUNT(*) FILTER (WHERE work_status_completed = true) as active_employees,
        COUNT(*) FILTER (WHERE work_status = 'employed') as employed_employees,
        COUNT(*) FILTER (WHERE work_status = 'available') as available_employees,
        COUNT(*) FILTER (WHERE key_strengths IS NOT NULL AND jsonb_array_length(key_strengths) > 0) as employees_with_analysis,
        ROUND(AVG(overall_score), 2) as average_score,
        (
            SELECT jsonb_agg(skill_data)
            FROM (
                SELECT skill, COUNT(*) as count
                FROM bpoc_employees,
                     jsonb_array_elements_text(skills_snapshot) as skill
                WHERE skills_snapshot IS NOT NULL
                GROUP BY skill
                ORDER BY COUNT(*) DESC
                LIMIT 10
            ) skill_data
        ) as top_skills
    FROM bpoc_employees;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_bpoc_employee_stats() OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_bpoc_employee_stats() TO public;
GRANT ALL ON FUNCTION public.get_bpoc_employee_stats() TO postgres;
GRANT ALL ON FUNCTION public.get_bpoc_employee_stats() TO anon;

-- DROP FUNCTION public.get_candidate_analytics(varchar);

CREATE OR REPLACE FUNCTION public.get_candidate_analytics(p_candidate_id character varying)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, unique_users bigint, total_favorites bigint, total_clicks bigint, total_ai_views bigint, avg_view_duration numeric, hotness_score integer, last_viewed timestamp with time zone, first_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        cv.candidate_id::VARCHAR(255),
        MAX(cv.candidate_name)::VARCHAR(255),
        COUNT(*)::BIGINT,
        COUNT(DISTINCT cv.user_id)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END)::BIGINT,
        ROUND(AVG(cv.view_duration)::NUMERIC, 2),
        LEAST(100, GREATEST(0, 
            (COUNT(*) * 2) + 
            (COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) * 5) + 
            (COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 3) + 
            (COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) * 4) + 
            (CASE WHEN AVG(cv.view_duration) > 30 THEN 10 ELSE 0 END)
        ))::INTEGER,
        MAX(cv.created_at)::TIMESTAMPTZ,
        MIN(cv.created_at)::TIMESTAMPTZ
    FROM candidate_views cv
    WHERE cv.candidate_id = p_candidate_id
    GROUP BY cv.candidate_id;
END;
$function$
;

COMMENT ON FUNCTION public.get_candidate_analytics(varchar) IS 'Returns detailed analytics for a specific candidate including hotness score';

-- Permissions

ALTER FUNCTION public.get_candidate_analytics(varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_candidate_analytics(varchar) TO public;
GRANT ALL ON FUNCTION public.get_candidate_analytics(varchar) TO postgres;
GRANT ALL ON FUNCTION public.get_candidate_analytics(varchar) TO anon;

-- DROP FUNCTION public.get_candidate_analytics(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_candidate_analytics(p_candidate_id character varying DEFAULT NULL::character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(candidate_id character varying, total_views bigint, unique_viewers bigint, total_favorites bigint, total_clicks bigint, total_ai_views bigint, avg_view_duration numeric, total_page_views bigint, daily_views jsonb, hotness_score numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH candidate_stats AS (
        SELECT 
            cv.candidate_id,
            MAX(cv.candidate_name) as candidate_name,
            COUNT(*) as total_views,
            COUNT(DISTINCT cv.user_id) as unique_viewers,
            COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
            COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
            COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as total_ai_views,
            AVG(cv.view_duration) as avg_view_duration,
            SUM(cv.page_views) as total_page_views
        FROM candidate_views cv
        WHERE (p_candidate_id IS NULL OR cv.candidate_id = p_candidate_id)
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.candidate_id
    ),
    daily_stats AS (
        SELECT 
            cv.candidate_id,
            JSONB_OBJECT_AGG(
                DATE(cv.created_at)::TEXT, 
                daily_count
            ) as daily_views
        FROM (
            SELECT 
                candidate_id,
                DATE(created_at) as created_at,
                COUNT(*) as daily_count
            FROM candidate_views cv
            WHERE (p_candidate_id IS NULL OR cv.candidate_id = p_candidate_id)
              AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
            GROUP BY candidate_id, DATE(created_at)
            ORDER BY DATE(created_at)
        ) cv
        GROUP BY cv.candidate_id
    )
    SELECT 
        cs.candidate_id,
        cs.total_views,
        cs.unique_viewers,
        cs.total_favorites,
        cs.total_clicks,
        cs.total_ai_views,
        ROUND(cs.avg_view_duration::NUMERIC, 2) as avg_view_duration,
        cs.total_page_views,
        COALESCE(daily.daily_views, '{}'::JSONB) as daily_views,
        -- Calculate hotness score (0-100)
        ROUND(
            LEAST(100, 
                (cs.total_views * 0.3) + 
                (cs.unique_viewers * 0.4) + 
                (cs.total_favorites * 2.0) + 
                (cs.total_clicks * 0.5) + 
                (cs.total_ai_views * 1.5) +
                (COALESCE(cs.avg_view_duration, 0) * 0.1)
            )::NUMERIC, 2
        ) as hotness_score
    FROM candidate_stats cs
    LEFT JOIN daily_stats daily ON cs.candidate_id = daily.candidate_id
    ORDER BY hotness_score DESC, cs.total_views DESC;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_candidate_analytics(varchar, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_candidate_analytics(varchar, int4) TO public;
GRANT ALL ON FUNCTION public.get_candidate_analytics(varchar, int4) TO postgres;
GRANT ALL ON FUNCTION public.get_candidate_analytics(varchar, int4) TO anon;

-- DROP FUNCTION public.get_candidate_hotness_score(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_candidate_hotness_score(p_candidate_id character varying, p_days_back integer DEFAULT 30)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
DECLARE
    hotness_score NUMERIC;
BEGIN
    SELECT ROUND(
        LEAST(100, 
            (COUNT(*) * 0.3) + 
            (COUNT(DISTINCT user_id) * 0.4) + 
            (COUNT(CASE WHEN interaction_type = 'favorite' THEN 1 END) * 2.0) + 
            (COUNT(CASE WHEN interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 0.5) + 
            (COUNT(CASE WHEN interaction_type = 'ai_analysis_view' THEN 1 END) * 1.5) +
            (COALESCE(AVG(view_duration), 0) * 0.1)
        )::NUMERIC, 2
    ) INTO hotness_score
    FROM candidate_views
    WHERE candidate_id = p_candidate_id
      AND created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back;
    
    RETURN COALESCE(hotness_score, 0);
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_candidate_hotness_score(varchar, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_candidate_hotness_score(varchar, int4) TO public;
GRANT ALL ON FUNCTION public.get_candidate_hotness_score(varchar, int4) TO postgres;
GRANT ALL ON FUNCTION public.get_candidate_hotness_score(varchar, int4) TO anon;

-- DROP FUNCTION public.get_existing_anonymous_user();

CREATE OR REPLACE FUNCTION public.get_existing_anonymous_user()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    anon_user_id VARCHAR(255);
BEGIN
    SELECT user_id INTO anon_user_id
    FROM users
    WHERE user_type = 'Anonymous'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN anon_user_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_existing_anonymous_user() OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_existing_anonymous_user() TO public;
GRANT ALL ON FUNCTION public.get_existing_anonymous_user() TO postgres;
GRANT ALL ON FUNCTION public.get_existing_anonymous_user() TO anon;

-- DROP FUNCTION public.get_existing_authenticated_user(uuid);

CREATE OR REPLACE FUNCTION public.get_existing_authenticated_user(p_auth_user_id uuid)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    auth_user_id_str VARCHAR(255);
BEGIN
    SELECT user_id INTO auth_user_id_str
    FROM users
    WHERE auth_user_id = p_auth_user_id
    LIMIT 1;
    
    RETURN auth_user_id_str;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_existing_authenticated_user(uuid) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_existing_authenticated_user(uuid) TO public;
GRANT ALL ON FUNCTION public.get_existing_authenticated_user(uuid) TO postgres;
GRANT ALL ON FUNCTION public.get_existing_authenticated_user(uuid) TO anon;

-- DROP FUNCTION public.get_most_recent_anonymous_user();

CREATE OR REPLACE FUNCTION public.get_most_recent_anonymous_user()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    most_recent_user_id VARCHAR(255);
BEGIN
    -- Get the most recent anonymous user ID from candidate_views
    SELECT user_id INTO most_recent_user_id
    FROM candidate_views 
    WHERE user_id LIKE 'device_%' OR user_id LIKE 'anon_%'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN most_recent_user_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_most_recent_anonymous_user() OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_most_recent_anonymous_user() TO public;
GRANT ALL ON FUNCTION public.get_most_recent_anonymous_user() TO postgres;
GRANT ALL ON FUNCTION public.get_most_recent_anonymous_user() TO anon;

-- DROP FUNCTION public.get_most_viewed_candidate(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_most_viewed_candidate(p_user_id character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, total_duration bigint, avg_duration numeric, last_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Return the candidate with the highest total view duration
    -- If tied on duration, use total views as tiebreaker
    RETURN QUERY
    WITH candidate_stats AS (
        SELECT 
            cv.candidate_id,
            cv.candidate_name,
            COUNT(*) as view_count,
            SUM(cv.view_duration) as total_duration,
            AVG(cv.view_duration) as avg_duration,
            MAX(cv.created_at) as last_viewed
        FROM candidate_views cv
        WHERE cv.user_id = p_user_id
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.candidate_id, cv.candidate_name
    )
    SELECT 
        cs.candidate_id,
        cs.candidate_name,
        cs.view_count,
        cs.total_duration,
        ROUND(cs.avg_duration::NUMERIC, 2) as avg_duration,
        cs.last_viewed
    FROM candidate_stats cs
    ORDER BY 
        cs.total_duration DESC,  -- Primary: highest total duration
        cs.view_count DESC,     -- Secondary: most views if tied
        cs.last_viewed DESC     -- Tertiary: most recent if still tied
    LIMIT 1;
END;
$function$
;

COMMENT ON FUNCTION public.get_most_viewed_candidate(varchar, int4) IS 'Clean, rewritten function to get most viewed candidate based on total duration';

-- Permissions

ALTER FUNCTION public.get_most_viewed_candidate(varchar, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_most_viewed_candidate(varchar, int4) TO public;
GRANT ALL ON FUNCTION public.get_most_viewed_candidate(varchar, int4) TO postgres;
GRANT ALL ON FUNCTION public.get_most_viewed_candidate(varchar, int4) TO anon;

-- DROP FUNCTION public.get_most_viewed_candidate_smart(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_most_viewed_candidate_smart(p_user_id character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, total_duration bigint, avg_duration numeric, last_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
DECLARE
    found_user_id VARCHAR(255);
BEGIN
    -- First, try with the provided user_id
    RETURN QUERY
    SELECT * FROM get_most_viewed_candidate(p_user_id, p_days_back);
    
    -- If we got results, we're done
    IF FOUND THEN
        RETURN;
    END IF;
    
    -- If no results, try with the most recent anonymous user
    found_user_id := get_most_recent_anonymous_user();
    IF found_user_id IS NOT NULL AND found_user_id != p_user_id THEN
        RETURN QUERY
        SELECT * FROM get_most_viewed_candidate(found_user_id, p_days_back);
        
        -- If we got results, we're done
        IF FOUND THEN
            RETURN;
        END IF;
    END IF;
    
    -- If still no results, try with any user that has views
    FOR found_user_id IN 
        SELECT user_id 
        FROM candidate_views 
        ORDER BY created_at DESC
        LIMIT 1
    LOOP
        RETURN QUERY
        SELECT * FROM get_most_viewed_candidate(found_user_id, p_days_back);
        
        -- If we got results, we're done
        IF FOUND THEN
            RETURN;
        END IF;
    END LOOP;
END;
$function$
;

COMMENT ON FUNCTION public.get_most_viewed_candidate_smart(varchar, int4) IS 'Fixed smart function that tries multiple strategies to find the most viewed candidate';

-- Permissions

ALTER FUNCTION public.get_most_viewed_candidate_smart(varchar, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_most_viewed_candidate_smart(varchar, int4) TO public;
GRANT ALL ON FUNCTION public.get_most_viewed_candidate_smart(varchar, int4) TO postgres;
GRANT ALL ON FUNCTION public.get_most_viewed_candidate_smart(varchar, int4) TO anon;

-- DROP FUNCTION public.get_user_candidate_analytics(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_user_candidate_analytics(p_user_id character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(user_id character varying, user_name character varying, user_company character varying, total_views bigint, unique_candidates_viewed bigint, total_favorites bigint, total_clicks bigint, avg_view_duration numeric, most_viewed_candidate character varying, most_viewed_candidate_name character varying, last_activity timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            cv.user_id,
            CONCAT(u.first_name, ' ', u.last_name) as user_name,
            u.company as user_company,
            COUNT(*) as total_views,
            COUNT(DISTINCT cv.candidate_id) as unique_candidates_viewed,
            0 as total_favorites,  -- No interaction_type column, so set to 0
            0 as total_clicks,     -- No interaction_type column, so set to 0
            AVG(cv.view_duration) as avg_view_duration,
            MAX(cv.created_at) as last_activity
        FROM candidate_views cv
        JOIN users u ON cv.user_id = u.user_id
        WHERE cv.user_id = p_user_id
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.user_id, u.first_name, u.last_name, u.company
    ),
    most_viewed AS (
        SELECT 
            cv.user_id,
            cv.candidate_id,
            cv.candidate_name,
            COUNT(*) as view_count
        FROM candidate_views cv
        WHERE cv.user_id = p_user_id
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.user_id, cv.candidate_id, cv.candidate_name
        ORDER BY view_count DESC
        LIMIT 1
    )
    SELECT 
        us.user_id,
        us.user_name,
        us.user_company,
        us.total_views,
        us.unique_candidates_viewed,
        us.total_favorites,
        us.total_clicks,
        ROUND(us.avg_view_duration::NUMERIC, 2) as avg_view_duration,
        mv.candidate_id as most_viewed_candidate,
        mv.candidate_name as most_viewed_candidate_name,
        us.last_activity
    FROM user_stats us
    LEFT JOIN most_viewed mv ON us.user_id = mv.user_id;
END;
$function$
;

COMMENT ON FUNCTION public.get_user_candidate_analytics(varchar, int4) IS 'Returns detailed analytics for a specific user including their candidate viewing behavior';

-- Permissions

ALTER FUNCTION public.get_user_candidate_analytics(varchar, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.get_user_candidate_analytics(varchar, int4) TO public;
GRANT ALL ON FUNCTION public.get_user_candidate_analytics(varchar, int4) TO postgres;
GRANT ALL ON FUNCTION public.get_user_candidate_analytics(varchar, int4) TO anon;

-- DROP FUNCTION public.http(http_request);

CREATE OR REPLACE FUNCTION public.http(request http_request)
 RETURNS http_response
 LANGUAGE c
AS '$libdir/http', $function$http_request$function$
;

-- Permissions

ALTER FUNCTION public.http(http_request) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http(http_request) TO supabase_admin;

-- DROP FUNCTION public.http_delete(varchar);

CREATE OR REPLACE FUNCTION public.http_delete(uri character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('DELETE', $1, NULL, NULL, NULL)::public.http_request) $function$
;

-- Permissions

ALTER FUNCTION public.http_delete(varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_delete(varchar) TO supabase_admin;

-- DROP FUNCTION public.http_delete(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_delete(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('DELETE', $1, NULL, $3, $2)::public.http_request) $function$
;

-- Permissions

ALTER FUNCTION public.http_delete(varchar, varchar, varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_delete(varchar, varchar, varchar) TO supabase_admin;

-- DROP FUNCTION public.http_get(varchar);

CREATE OR REPLACE FUNCTION public.http_get(uri character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('GET', $1, NULL, NULL, NULL)::public.http_request) $function$
;

-- Permissions

ALTER FUNCTION public.http_get(varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_get(varchar) TO supabase_admin;

-- DROP FUNCTION public.http_get(varchar, jsonb);

CREATE OR REPLACE FUNCTION public.http_get(uri character varying, data jsonb)
 RETURNS http_response
 LANGUAGE sql
AS $function$
        SELECT public.http(('GET', $1 || '?' || public.urlencode($2), NULL, NULL, NULL)::public.http_request)
    $function$
;

-- Permissions

ALTER FUNCTION public.http_get(varchar, jsonb) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_get(varchar, jsonb) TO supabase_admin;

-- DROP FUNCTION public.http_head(varchar);

CREATE OR REPLACE FUNCTION public.http_head(uri character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('HEAD', $1, NULL, NULL, NULL)::public.http_request) $function$
;

-- Permissions

ALTER FUNCTION public.http_head(varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_head(varchar) TO supabase_admin;

-- DROP FUNCTION public.http_header(varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_header(field character varying, value character varying)
 RETURNS http_header
 LANGUAGE sql
AS $function$ SELECT $1, $2 $function$
;

-- Permissions

ALTER FUNCTION public.http_header(varchar, varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_header(varchar, varchar) TO supabase_admin;

-- DROP FUNCTION public.http_list_curlopt();

CREATE OR REPLACE FUNCTION public.http_list_curlopt()
 RETURNS TABLE(curlopt text, value text)
 LANGUAGE c
AS '$libdir/http', $function$http_list_curlopt$function$
;

-- Permissions

ALTER FUNCTION public.http_list_curlopt() OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_list_curlopt() TO supabase_admin;

-- DROP FUNCTION public.http_patch(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_patch(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('PATCH', $1, NULL, $3, $2)::public.http_request) $function$
;

-- Permissions

ALTER FUNCTION public.http_patch(varchar, varchar, varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_patch(varchar, varchar, varchar) TO supabase_admin;

-- DROP FUNCTION public.http_post(varchar, jsonb);

CREATE OR REPLACE FUNCTION public.http_post(uri character varying, data jsonb)
 RETURNS http_response
 LANGUAGE sql
AS $function$
        SELECT public.http(('POST', $1, NULL, 'application/x-www-form-urlencoded', public.urlencode($2))::public.http_request)
    $function$
;

-- Permissions

ALTER FUNCTION public.http_post(varchar, jsonb) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_post(varchar, jsonb) TO supabase_admin;

-- DROP FUNCTION public.http_post(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_post(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('POST', $1, NULL, $3, $2)::public.http_request) $function$
;

-- Permissions

ALTER FUNCTION public.http_post(varchar, varchar, varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_post(varchar, varchar, varchar) TO supabase_admin;

-- DROP FUNCTION public.http_put(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_put(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('PUT', $1, NULL, $3, $2)::public.http_request) $function$
;

-- Permissions

ALTER FUNCTION public.http_put(varchar, varchar, varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_put(varchar, varchar, varchar) TO supabase_admin;

-- DROP FUNCTION public.http_reset_curlopt();

CREATE OR REPLACE FUNCTION public.http_reset_curlopt()
 RETURNS boolean
 LANGUAGE c
AS '$libdir/http', $function$http_reset_curlopt$function$
;

-- Permissions

ALTER FUNCTION public.http_reset_curlopt() OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_reset_curlopt() TO supabase_admin;

-- DROP FUNCTION public.http_set_curlopt(varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_set_curlopt(curlopt character varying, value character varying)
 RETURNS boolean
 LANGUAGE c
AS '$libdir/http', $function$http_set_curlopt$function$
;

-- Permissions

ALTER FUNCTION public.http_set_curlopt(varchar, varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.http_set_curlopt(varchar, varchar) TO supabase_admin;

-- DROP FUNCTION public.increment_activity_count();

CREATE OR REPLACE FUNCTION public.increment_activity_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if there's an existing record with the same user_id, candidate_id, and interaction_type
    -- If yes, increment the activity_count; if no, keep it as 1 (default)
    IF EXISTS (
        SELECT 1 FROM candidate_views 
        WHERE user_id = NEW.user_id 
          AND candidate_id = NEW.candidate_id 
          AND interaction_type = NEW.interaction_type
          AND id != COALESCE(NEW.id, 0)  -- Exclude current record if updating
    ) THEN
        -- Get the maximum activity_count for this combination and increment it
        SELECT COALESCE(MAX(activity_count), 0) + 1 
        INTO NEW.activity_count
        FROM candidate_views 
        WHERE user_id = NEW.user_id 
          AND candidate_id = NEW.candidate_id 
          AND interaction_type = NEW.interaction_type
          AND id != COALESCE(NEW.id, 0);
    ELSE
        -- First time this interaction type for this user-candidate combination
        NEW.activity_count := 1;
    END IF;
    
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.increment_activity_count() OWNER TO postgres;
GRANT ALL ON FUNCTION public.increment_activity_count() TO public;
GRANT ALL ON FUNCTION public.increment_activity_count() TO postgres;
GRANT ALL ON FUNCTION public.increment_activity_count() TO anon;

-- DROP FUNCTION public.increment_candidate_activity(varchar, varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.increment_candidate_activity(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
BEGIN
    -- Look for existing record with same user_id, candidate_id, and interaction_type
    SELECT id, activity_count INTO existing_record
    FROM candidate_views
    WHERE user_id = p_user_id 
      AND candidate_id = p_candidate_id 
      AND interaction_type = p_interaction_type
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record: increment activity_count only
        UPDATE candidate_views
        SET 
            activity_count = existing_record.activity_count + 1,
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Incremented activity_count: id=%, new_count=%', 
            view_id, existing_record.activity_count + 1;
    ELSE
        -- Insert new record only if no existing record found
        INSERT INTO candidate_views (
            user_id, 
            candidate_id, 
            candidate_name, 
            interaction_type,
            page_views,
            activity_count
        ) VALUES (
            p_user_id, 
            p_candidate_id, 
            p_candidate_name, 
            p_interaction_type,
            1,
            1
        ) RETURNING id INTO view_id;
        
        RAISE NOTICE 'Created new record: id=%, activity_count=1', 
            view_id;
    END IF;
    
    RETURN view_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.increment_candidate_activity(varchar, varchar, varchar, varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.increment_candidate_activity(varchar, varchar, varchar, varchar) TO public;
GRANT ALL ON FUNCTION public.increment_candidate_activity(varchar, varchar, varchar, varchar) TO postgres;
GRANT ALL ON FUNCTION public.increment_candidate_activity(varchar, varchar, varchar, varchar) TO anon;

-- DROP FUNCTION public.record_candidate_interaction(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.record_candidate_interaction(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    valid_user_id VARCHAR(255);
BEGIN
    -- Check if the provided user_id exists in users table
    SELECT user_id INTO valid_user_id
    FROM users
    WHERE user_id = p_user_id
    LIMIT 1;
    
    -- If user_id doesn't exist, get any available user
    IF valid_user_id IS NULL THEN
        SELECT user_id INTO valid_user_id
        FROM users
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;
    
    -- Insert the record with the valid user_id
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        valid_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.record_candidate_interaction(varchar, varchar, varchar, int4, varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_interaction(varchar, varchar, varchar, int4, varchar) TO public;
GRANT ALL ON FUNCTION public.record_candidate_interaction(varchar, varchar, varchar, int4, varchar) TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_interaction(varchar, varchar, varchar, int4, varchar) TO anon;

-- DROP FUNCTION public.record_candidate_view(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.record_candidate_view(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
BEGIN
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.record_candidate_view(varchar, varchar, varchar, int4, varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view(varchar, varchar, varchar, int4, varchar) TO public;
GRANT ALL ON FUNCTION public.record_candidate_view(varchar, varchar, varchar, int4, varchar) TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view(varchar, varchar, varchar, int4, varchar) TO anon;

-- DROP FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.record_candidate_view_fixed(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
    safe_user_id VARCHAR(255);
    final_view_duration INTEGER;
    final_scroll_percentage INTEGER;
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Look for existing record with same user_id and candidate_id
    SELECT id, view_duration, scroll_percentage, page_views
    INTO existing_record
    FROM candidate_views
    WHERE user_id = safe_user_id 
      AND candidate_id = p_candidate_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record with better values
        final_view_duration := GREATEST(
            COALESCE(existing_record.view_duration, 0), 
            COALESCE(p_view_duration, 0)
        );
        
        final_scroll_percentage := GREATEST(
            COALESCE(existing_record.scroll_percentage, 0), 
            COALESCE(p_scroll_percentage, 0)
        );
        
        UPDATE candidate_views SET
            view_duration = final_view_duration,
            scroll_percentage = final_scroll_percentage,
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            page_views = existing_record.page_views + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Updated existing record: id=%, view_duration=%, scroll_percentage=%', 
            view_id, final_view_duration, final_scroll_percentage;
    ELSE
        -- Insert new record only if no existing record found
        INSERT INTO candidate_views (
            user_id, 
            candidate_id, 
            candidate_name, 
            view_duration, 
            page_views,
            scroll_percentage
        ) VALUES (
            safe_user_id, 
            p_candidate_id, 
            p_candidate_name, 
            COALESCE(p_view_duration, 0), 
            1,
            COALESCE(p_scroll_percentage, 0)
        ) RETURNING id INTO view_id;
        
        RAISE NOTICE 'Created new record: id=%, view_duration=%, scroll_percentage=%', 
            view_id, COALESCE(p_view_duration, 0), COALESCE(p_scroll_percentage, 0);
    END IF;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4) IS 'Fixed function to record candidate views without duplicates, properly handling view_duration and scroll_percentage';

-- Permissions

ALTER FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4) TO public;
GRANT ALL ON FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4) TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4) TO anon;

-- DROP FUNCTION public.record_candidate_view_safe(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.record_candidate_view_safe(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists before inserting
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Insert the candidate view record
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        safe_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.record_candidate_view_safe(varchar, varchar, varchar, int4, varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_safe(varchar, varchar, varchar, int4, varchar) TO public;
GRANT ALL ON FUNCTION public.record_candidate_view_safe(varchar, varchar, varchar, int4, varchar) TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_safe(varchar, varchar, varchar, int4, varchar) TO anon;

-- DROP FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.record_candidate_view_simple(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
    safe_user_id VARCHAR(255);
    final_view_duration INTEGER;
    final_scroll_percentage INTEGER;
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Look for existing record with same user_id and candidate_id
    SELECT id, view_duration, scroll_percentage, page_views
    INTO existing_record
    FROM candidate_views
    WHERE user_id = safe_user_id 
      AND candidate_id = p_candidate_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record with accumulated values
        final_view_duration := COALESCE(existing_record.view_duration, 0) + COALESCE(p_view_duration, 0);
        
        final_scroll_percentage := GREATEST(
            COALESCE(existing_record.scroll_percentage, 0), 
            COALESCE(p_scroll_percentage, 0)
        );
        
        UPDATE candidate_views SET
            view_duration = final_view_duration,
            scroll_percentage = final_scroll_percentage,
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            page_views = existing_record.page_views + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Updated existing record: id=%, accumulated_duration=%, max_scroll=%', 
            view_id, final_view_duration, final_scroll_percentage;
    ELSE
        -- Insert new record only if no existing record found
        INSERT INTO candidate_views (
            user_id, 
            candidate_id, 
            candidate_name, 
            view_duration, 
            page_views,
            scroll_percentage
        ) VALUES (
            safe_user_id, 
            p_candidate_id, 
            p_candidate_name, 
            COALESCE(p_view_duration, 0), 
            1,
            COALESCE(p_scroll_percentage, 0)
        ) RETURNING id INTO view_id;
        
        RAISE NOTICE 'Created new record: id=%, initial_duration=%, scroll=%', 
            view_id, COALESCE(p_view_duration, 0), COALESCE(p_scroll_percentage, 0);
    END IF;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4) IS 'Corrected function to accumulate view durations with proper COALESCE syntax';

-- Permissions

ALTER FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4) TO public;
GRANT ALL ON FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4) TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4) TO anon;

-- DROP FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.record_candidate_view_upsert(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    safe_user_id VARCHAR(255);
    final_view_duration INTEGER;
    final_scroll_percentage INTEGER;
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Use UPSERT to insert or update
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        page_views,
        scroll_percentage
    ) VALUES (
        safe_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        COALESCE(p_view_duration, 0), 
        1,
        COALESCE(p_scroll_percentage, 0)
    )
    ON CONFLICT (user_id, candidate_id) 
    DO UPDATE SET
        view_duration = GREATEST(
            candidate_views.view_duration, 
            COALESCE(EXCLUDED.view_duration, 0)
        ),
        scroll_percentage = GREATEST(
            candidate_views.scroll_percentage, 
            COALESCE(EXCLUDED.scroll_percentage, 0)
        ),
        candidate_name = COALESCE(EXCLUDED.candidate_name, candidate_views.candidate_name),
        page_views = candidate_views.page_views + 1,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO view_id;
    
    RAISE NOTICE 'UPSERT completed: id=%, view_duration=%, scroll_percentage=%', 
        view_id, 
        COALESCE(p_view_duration, 0), 
        COALESCE(p_scroll_percentage, 0);
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4) IS 'UPSERT function to record candidate views without duplicates, using database-level constraints';

-- Permissions

ALTER FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4) TO public;
GRANT ALL ON FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4) TO postgres;
GRANT ALL ON FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4) TO anon;

-- DROP FUNCTION public.simple_get_analytics(varchar);

CREATE OR REPLACE FUNCTION public.simple_get_analytics(p_candidate_id character varying)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, unique_users bigint, total_favorites bigint, total_clicks bigint, total_ai_views bigint, avg_view_duration numeric, hotness_score integer, last_viewed timestamp with time zone, first_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        cv.candidate_id::VARCHAR(255),
        MAX(cv.candidate_name)::VARCHAR(255),
        COUNT(*)::BIGINT,
        COUNT(DISTINCT cv.user_id)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END)::BIGINT,
        ROUND(AVG(cv.view_duration)::NUMERIC, 2),
        LEAST(100, GREATEST(0, 
            (COUNT(*) * 2) + 
            (COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) * 5) + 
            (COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 3) + 
            (COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) * 4) + 
            (CASE WHEN AVG(cv.view_duration) > 30 THEN 10 ELSE 0 END)
        ))::INTEGER,
        MAX(cv.created_at)::TIMESTAMPTZ,
        MIN(cv.created_at)::TIMESTAMPTZ
    FROM candidate_views cv
    WHERE cv.candidate_id = p_candidate_id
    GROUP BY cv.candidate_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.simple_get_analytics(varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.simple_get_analytics(varchar) TO public;
GRANT ALL ON FUNCTION public.simple_get_analytics(varchar) TO postgres;
GRANT ALL ON FUNCTION public.simple_get_analytics(varchar) TO anon;

-- DROP FUNCTION public.simple_get_anonymous_user(varchar);

CREATE OR REPLACE FUNCTION public.simple_get_anonymous_user(p_user_id character varying DEFAULT NULL::character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    any_user_id VARCHAR(255);
    new_user_id VARCHAR(255);
BEGIN
    -- If a user_id is provided, check if it exists in users table
    IF p_user_id IS NOT NULL THEN
        SELECT user_id INTO any_user_id
        FROM users
        WHERE user_id = p_user_id
        LIMIT 1;
        
        -- If the provided user_id exists, return it
        IF any_user_id IS NOT NULL THEN
            RETURN any_user_id;
        END IF;
    END IF;
    
    -- If no user_id provided or it doesn't exist, create a new anonymous user
    -- Generate a unique user_id for anonymous user
    new_user_id := 'anon_' || extract(epoch from now())::bigint || '_' || floor(random() * 10000)::int;
    
    -- Insert new anonymous user
    INSERT INTO users (
        user_id,
        user_type,
        created_at
    ) VALUES (
        new_user_id,
        'Anonymous',
        NOW()
    );
    
    RETURN new_user_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.simple_get_anonymous_user(varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.simple_get_anonymous_user(varchar) TO public;
GRANT ALL ON FUNCTION public.simple_get_anonymous_user(varchar) TO postgres;
GRANT ALL ON FUNCTION public.simple_get_anonymous_user(varchar) TO anon;

-- DROP FUNCTION public.simple_get_authenticated_user(varchar);

CREATE OR REPLACE FUNCTION public.simple_get_authenticated_user(p_auth_user_id character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_id_result VARCHAR(255);
    uuid_value UUID;
BEGIN
    -- First, try to find by user_id (in case the passed value is already a user_id)
    SELECT user_id INTO user_id_result
    FROM users
    WHERE user_id = p_auth_user_id
    LIMIT 1;
    
    -- If not found by user_id, try to find by auth_user_id (cast VARCHAR to UUID)
    IF user_id_result IS NULL THEN
        BEGIN
            -- Try to cast to UUID, handle potential errors
            uuid_value := p_auth_user_id::uuid;
            
            SELECT user_id INTO user_id_result
            FROM users
            WHERE auth_user_id = uuid_value
            LIMIT 1;
            
        EXCEPTION
            WHEN invalid_text_representation THEN
                -- If UUID casting fails, continue to fallback
                user_id_result := NULL;
        END;
    END IF;
    
    -- If still not found, get any available user
    IF user_id_result IS NULL THEN
        SELECT user_id INTO user_id_result
        FROM users
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;
    
    RETURN user_id_result;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.simple_get_authenticated_user(varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.simple_get_authenticated_user(varchar) TO public;
GRANT ALL ON FUNCTION public.simple_get_authenticated_user(varchar) TO postgres;
GRANT ALL ON FUNCTION public.simple_get_authenticated_user(varchar) TO anon;

-- DROP FUNCTION public.simple_get_authenticated_user(uuid);

CREATE OR REPLACE FUNCTION public.simple_get_authenticated_user(p_auth_user_id uuid)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    auth_user_id_str VARCHAR(255);
BEGIN
    SELECT user_id INTO auth_user_id_str
    FROM users
    WHERE auth_user_id = p_auth_user_id
    LIMIT 1;
    
    RETURN auth_user_id_str;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.simple_get_authenticated_user(uuid) OWNER TO postgres;
GRANT ALL ON FUNCTION public.simple_get_authenticated_user(uuid) TO public;
GRANT ALL ON FUNCTION public.simple_get_authenticated_user(uuid) TO postgres;
GRANT ALL ON FUNCTION public.simple_get_authenticated_user(uuid) TO anon;

-- DROP FUNCTION public.simple_record_view(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.simple_record_view(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    valid_user_id VARCHAR(255);
BEGIN
    -- Get a valid user_id (either the provided one or any available one)
    SELECT simple_get_anonymous_user(p_user_id) INTO valid_user_id;
    
    -- Insert the record with the valid user_id
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        valid_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.simple_record_view(varchar, varchar, varchar, int4, varchar) OWNER TO postgres;
GRANT ALL ON FUNCTION public.simple_record_view(varchar, varchar, varchar, int4, varchar) TO public;
GRANT ALL ON FUNCTION public.simple_record_view(varchar, varchar, varchar, int4, varchar) TO postgres;
GRANT ALL ON FUNCTION public.simple_record_view(varchar, varchar, varchar, int4, varchar) TO anon;

-- DROP FUNCTION public.sync_ai_analysis_data();

CREATE OR REPLACE FUNCTION public.sync_ai_analysis_data()
 RETURNS TABLE(total_fetched integer, new_analyses integer, updated_analyses integer, errors integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    analysis_record RECORD;
    total_count INTEGER := 0;
    new_count INTEGER := 0;
    updated_count INTEGER := 0;
    error_count INTEGER := 0;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        api_response := http_response::jsonb;
        
        -- Check if API response is successful
        IF NOT (api_response->>'success')::boolean THEN
            RAISE EXCEPTION 'BPOC API returned unsuccessful response: %', api_response->>'message';
        END IF;
        
        -- Process each employee's analysis data
        FOR employee_data IN SELECT * FROM jsonb_array_elements(api_response->'data')
        LOOP
            total_count := total_count + 1;
            
            BEGIN
                -- Check if analysis data exists for this user
                SELECT * INTO analysis_record 
                FROM ai_analysis 
                WHERE user_id = (employee_data->>'user_id');
                
                -- Prepare analysis data
                IF analysis_record IS NULL THEN
                    -- Insert new analysis record
                    INSERT INTO ai_analysis (
                        user_id,
                        analysis_id,
                        session_id,
                        overall_score,
                        ats_compatibility_score,
                        content_quality_score,
                        professional_presentation_score,
                        skills_alignment_score,
                        key_strengths,
                        improvements,
                        recommendations,
                        improved_summary,
                        strengths_analysis,
                        salary_analysis,
                        career_path,
                        section_analysis,
                        candidate_profile,
                        skills_snapshot,
                        experience_snapshot,
                        education_snapshot,
                        portfolio_links,
                        analysis_created_at,
                        analysis_updated_at
                    ) VALUES (
                        employee_data->>'user_id',
                        employee_data->>'analysis_id',
                        employee_data->>'session_id',
                        (employee_data->>'overall_score')::integer,
                        (employee_data->>'ats_compatibility_score')::integer,
                        (employee_data->>'content_quality_score')::integer,
                        (employee_data->>'professional_presentation_score')::integer,
                        (employee_data->>'skills_alignment_score')::integer,
                        COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                        COALESCE(employee_data->'improvements', '[]'::jsonb),
                        COALESCE(employee_data->'recommendations', '[]'::jsonb),
                        employee_data->>'improved_summary',
                        employee_data->'strengths_analysis',
                        employee_data->'salary_analysis',
                        employee_data->'career_path',
                        employee_data->'section_analysis',
                        employee_data->'candidate_profile',
                        COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                        employee_data->'experience_snapshot',
                        employee_data->'education_snapshot',
                        COALESCE(employee_data->'portfolio_links', '[]'::jsonb),
                        (employee_data->>'analysis_created_at')::timestamptz,
                        (employee_data->>'analysis_updated_at')::timestamptz
                    );
                    new_count := new_count + 1;
                ELSE
                    -- Update existing analysis record
                    UPDATE ai_analysis SET
                        analysis_id = employee_data->>'analysis_id',
                        session_id = employee_data->>'session_id',
                        overall_score = (employee_data->>'overall_score')::integer,
                        ats_compatibility_score = (employee_data->>'ats_compatibility_score')::integer,
                        content_quality_score = (employee_data->>'content_quality_score')::integer,
                        professional_presentation_score = (employee_data->>'professional_presentation_score')::integer,
                        skills_alignment_score = (employee_data->>'skills_alignment_score')::integer,
                        key_strengths = COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                        improvements = COALESCE(employee_data->'improvements', '[]'::jsonb),
                        recommendations = COALESCE(employee_data->'recommendations', '[]'::jsonb),
                        improved_summary = employee_data->>'improved_summary',
                        strengths_analysis = employee_data->'strengths_analysis',
                        salary_analysis = employee_data->'salary_analysis',
                        career_path = employee_data->'career_path',
                        section_analysis = employee_data->'section_analysis',
                        candidate_profile = employee_data->'candidate_profile',
                        skills_snapshot = COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                        experience_snapshot = employee_data->'experience_snapshot',
                        education_snapshot = employee_data->'education_snapshot',
                        portfolio_links = COALESCE(employee_data->'portfolio_links', '[]'::jsonb),
                        analysis_created_at = (employee_data->>'analysis_created_at')::timestamptz,
                        analysis_updated_at = (employee_data->>'analysis_updated_at')::timestamptz
                    WHERE user_id = employee_data->>'user_id';
                    updated_count := updated_count + 1;
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                error_count := error_count + 1;
                RAISE WARNING 'Error processing analysis for user %: %', employee_data->>'user_id', SQLERRM;
            END;
        END LOOP;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Error fetching BPOC API data: %', SQLERRM;
    END;
    
    -- Return summary
    RETURN QUERY SELECT total_count, new_count, updated_count, error_count;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.sync_ai_analysis_data() OWNER TO postgres;
GRANT ALL ON FUNCTION public.sync_ai_analysis_data() TO public;
GRANT ALL ON FUNCTION public.sync_ai_analysis_data() TO postgres;
GRANT ALL ON FUNCTION public.sync_ai_analysis_data() TO anon;

-- DROP FUNCTION public.sync_bpoc_employees_data();

CREATE OR REPLACE FUNCTION public.sync_bpoc_employees_data()
 RETURNS TABLE(total_fetched integer, new_employees integer, updated_employees integer, errors integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    employee_record RECORD;
    total_count INTEGER := 0;
    new_count INTEGER := 0;
    updated_count INTEGER := 0;
    error_count INTEGER := 0;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        -- Parse the JSON response
        api_response := http_response::JSONB;
        
        -- Check if the API call was successful
        IF NOT (api_response->>'success')::BOOLEAN THEN
            RAISE EXCEPTION 'BPOC API returned unsuccessful response: %', api_response;
        END IF;
        
        -- Process each employee in the response
        FOR employee_data IN SELECT * FROM jsonb_array_elements(api_response->'data')
        LOOP
            total_count := total_count + 1;
            
            BEGIN
                -- Check if employee already exists
                SELECT * INTO employee_record 
                FROM bpoc_employees 
                WHERE user_id = employee_data->>'user_id';
                
                IF FOUND THEN
                    -- Update existing employee
                    UPDATE bpoc_employees SET
                        full_name = COALESCE(employee_data->>'full_name', full_name),
                        first_name = COALESCE(employee_data->>'first_name', first_name),
                        last_name = COALESCE(employee_data->>'last_name', last_name),
                        current_position = COALESCE(employee_data->>'current_position', current_position),
                        position = COALESCE(employee_data->>'position', position),
                        location = COALESCE(employee_data->>'location', location),
                        avatar_url = COALESCE(employee_data->>'avatar_url', avatar_url),
                        bio = COALESCE(employee_data->>'bio', bio),
                        overall_score = COALESCE((employee_data->>'overall_score')::INTEGER, overall_score),
                        skills_snapshot = COALESCE(employee_data->'skills_snapshot', skills_snapshot),
                        experience_snapshot = COALESCE(employee_data->'experience_snapshot', experience_snapshot),
                        expected_salary = COALESCE(
                            CASE 
                                WHEN employee_data->>'expected_salary' IS NOT NULL 
                                THEN (regexp_replace(employee_data->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                                ELSE expected_salary 
                            END, 
                            expected_salary
                        ),
                        work_status = COALESCE(employee_data->>'work_status', work_status),
                        work_status_completed = COALESCE((employee_data->>'work_status_completed')::BOOLEAN, work_status_completed),
                        user_created_at = COALESCE(
                            (employee_data->>'user_created_at')::TIMESTAMPTZ, 
                            user_created_at
                        ),
                        key_strengths = COALESCE(employee_data->'key_strengths', key_strengths),
                        improvements = COALESCE(employee_data->'improvements', improvements),
                        recommendations = COALESCE(employee_data->'recommendations', recommendations),
                        improved_summary = COALESCE(employee_data->>'improved_summary', improved_summary),
                        strengths_analysis = COALESCE(employee_data->'strengths_analysis', strengths_analysis),
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = employee_data->>'user_id';
                    
                    updated_count := updated_count + 1;
                ELSE
                    -- Insert new employee
                    INSERT INTO bpoc_employees (
                        user_id,
                        full_name,
                        first_name,
                        last_name,
                        current_position,
                        position,
                        location,
                        avatar_url,
                        bio,
                        overall_score,
                        skills_snapshot,
                        experience_snapshot,
                        expected_salary,
                        work_status,
                        work_status_completed,
                        user_created_at,
                        key_strengths,
                        improvements,
                        recommendations,
                        improved_summary,
                        strengths_analysis
                    ) VALUES (
                        employee_data->>'user_id',
                        employee_data->>'full_name',
                        employee_data->>'first_name',
                        employee_data->>'last_name',
                        employee_data->>'current_position',
                        employee_data->>'position',
                        employee_data->>'location',
                        employee_data->>'avatar_url',
                        employee_data->>'bio',
                        (employee_data->>'overall_score')::INTEGER,
                        COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                        employee_data->'experience_snapshot',
                        CASE 
                            WHEN employee_data->>'expected_salary' IS NOT NULL 
                            THEN (regexp_replace(employee_data->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                            ELSE NULL 
                        END,
                        employee_data->>'work_status',
                        (employee_data->>'work_status_completed')::BOOLEAN,
                        (employee_data->>'user_created_at')::TIMESTAMPTZ,
                        COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                        COALESCE(employee_data->'improvements', '[]'::jsonb),
                        COALESCE(employee_data->'recommendations', '[]'::jsonb),
                        employee_data->>'improved_summary',
                        employee_data->'strengths_analysis'
                    );
                    
                    new_count := new_count + 1;
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                error_count := error_count + 1;
                RAISE WARNING 'Error processing employee %: %', employee_data->>'user_id', SQLERRM;
            END;
        END LOOP;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Error fetching data from BPOC API: %', SQLERRM;
    END;
    
    -- Return summary
    RETURN QUERY SELECT total_count, new_count, updated_count, error_count;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.sync_bpoc_employees_data() OWNER TO postgres;
GRANT ALL ON FUNCTION public.sync_bpoc_employees_data() TO public;
GRANT ALL ON FUNCTION public.sync_bpoc_employees_data() TO postgres;
GRANT ALL ON FUNCTION public.sync_bpoc_employees_data() TO anon;

-- DROP FUNCTION public.test_bpoc_api_connection();

CREATE OR REPLACE FUNCTION public.test_bpoc_api_connection()
 RETURNS TABLE(success boolean, message text, response_size integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    http_response TEXT;
    api_response JSONB;
BEGIN
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        api_response := http_response::JSONB;
        
        IF (api_response->>'success')::BOOLEAN THEN
            RETURN QUERY SELECT 
                TRUE, 
                'BPOC API connection successful', 
                jsonb_array_length(api_response->'data');
        ELSE
            RETURN QUERY SELECT 
                FALSE, 
                'BPOC API returned unsuccessful response', 
                0;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            FALSE, 
            'BPOC API connection error: ' || SQLERRM, 
            0;
    END;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.test_bpoc_api_connection() OWNER TO postgres;
GRANT ALL ON FUNCTION public.test_bpoc_api_connection() TO public;
GRANT ALL ON FUNCTION public.test_bpoc_api_connection() TO postgres;
GRANT ALL ON FUNCTION public.test_bpoc_api_connection() TO anon;

-- DROP FUNCTION public.test_http_extension();

CREATE OR REPLACE FUNCTION public.test_http_extension()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Try to make a simple HTTP request
    BEGIN
        PERFORM content FROM http((
            'GET',
            'https://httpbin.org/get',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        RETURN 'HTTP extension is working correctly';
    EXCEPTION WHEN OTHERS THEN
        RETURN 'HTTP extension error: ' || SQLERRM;
    END;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.test_http_extension() OWNER TO postgres;
GRANT ALL ON FUNCTION public.test_http_extension() TO public;
GRANT ALL ON FUNCTION public.test_http_extension() TO postgres;
GRANT ALL ON FUNCTION public.test_http_extension() TO anon;

-- DROP FUNCTION public.text_to_bytea(text);

CREATE OR REPLACE FUNCTION public.text_to_bytea(data text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$text_to_bytea$function$
;

-- Permissions

ALTER FUNCTION public.text_to_bytea(text) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.text_to_bytea(text) TO supabase_admin;

-- DROP FUNCTION public.track_view_duration_with_timestamps(varchar, varchar, varchar, timestamptz, timestamptz, int4);

CREATE OR REPLACE FUNCTION public.track_view_duration_with_timestamps(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_start_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    calculated_duration INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Calculate duration if both start and end times are provided
    IF p_start_time IS NOT NULL AND p_end_time IS NOT NULL THEN
        calculated_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time))::INTEGER;
    ELSE
        calculated_duration := 0;
    END IF;
    
    -- Use the updated function to record the view with duration accumulation
    SELECT record_candidate_view_simple(
        safe_user_id,
        p_candidate_id,
        p_candidate_name,
        calculated_duration,
        p_scroll_percentage
    ) INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.track_view_duration_with_timestamps(varchar, varchar, varchar, timestamptz, timestamptz, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.track_view_duration_with_timestamps(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO public;
GRANT ALL ON FUNCTION public.track_view_duration_with_timestamps(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO postgres;
GRANT ALL ON FUNCTION public.track_view_duration_with_timestamps(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO anon;

-- DROP FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4);

CREATE OR REPLACE FUNCTION public.track_view_with_duration(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_start_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    calculated_duration INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Calculate duration if both start and end times are provided
    IF p_start_time IS NOT NULL AND p_end_time IS NOT NULL THEN
        calculated_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time))::INTEGER;
    ELSE
        calculated_duration := 0;
    END IF;
    
    -- Use the fixed function to record the view
    SELECT record_candidate_view_fixed(
        safe_user_id,
        p_candidate_id,
        p_candidate_name,
        calculated_duration,
        p_scroll_percentage
    ) INTO view_id;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4) IS 'Function to track candidate view duration with proper time calculation using start and end timestamps';

-- Permissions

ALTER FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO public;
GRANT ALL ON FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO postgres;
GRANT ALL ON FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO anon;

-- DROP FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4);

CREATE OR REPLACE FUNCTION public.track_view_with_duration_upsert(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_start_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    calculated_duration INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Calculate duration if both start and end times are provided
    IF p_start_time IS NOT NULL AND p_end_time IS NOT NULL THEN
        calculated_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time))::INTEGER;
    ELSE
        calculated_duration := 0;
    END IF;
    
    -- Use the UPSERT function to record the view
    SELECT record_candidate_view_upsert(
        safe_user_id,
        p_candidate_id,
        p_candidate_name,
        calculated_duration,
        p_scroll_percentage
    ) INTO view_id;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4) IS 'Function to track candidate view duration with proper time calculation using UPSERT';

-- Permissions

ALTER FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO public;
GRANT ALL ON FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO postgres;
GRANT ALL ON FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4) TO anon;

-- DROP FUNCTION public.update_bpoc_employees_updated_at();

CREATE OR REPLACE FUNCTION public.update_bpoc_employees_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_bpoc_employees_updated_at() OWNER TO postgres;
GRANT ALL ON FUNCTION public.update_bpoc_employees_updated_at() TO public;
GRANT ALL ON FUNCTION public.update_bpoc_employees_updated_at() TO postgres;
GRANT ALL ON FUNCTION public.update_bpoc_employees_updated_at() TO anon;

-- DROP FUNCTION public.update_candidate_views_updated_at();

CREATE OR REPLACE FUNCTION public.update_candidate_views_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_candidate_views_updated_at() OWNER TO postgres;
GRANT ALL ON FUNCTION public.update_candidate_views_updated_at() TO public;
GRANT ALL ON FUNCTION public.update_candidate_views_updated_at() TO postgres;
GRANT ALL ON FUNCTION public.update_candidate_views_updated_at() TO anon;

-- DROP FUNCTION public.update_content_views_updated_at();

CREATE OR REPLACE FUNCTION public.update_content_views_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_content_views_updated_at() OWNER TO postgres;
GRANT ALL ON FUNCTION public.update_content_views_updated_at() TO public;
GRANT ALL ON FUNCTION public.update_content_views_updated_at() TO postgres;
GRANT ALL ON FUNCTION public.update_content_views_updated_at() TO anon;

-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO public;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO postgres;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;

-- DROP FUNCTION public.update_user_stats();

CREATE OR REPLACE FUNCTION public.update_user_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update user's updated_at timestamp
  UPDATE users 
  SET updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_user_stats() OWNER TO postgres;
GRANT ALL ON FUNCTION public.update_user_stats() TO public;
GRANT ALL ON FUNCTION public.update_user_stats() TO postgres;
GRANT ALL ON FUNCTION public.update_user_stats() TO anon;

-- DROP FUNCTION public.update_user_stats_on_page_visit();

CREATE OR REPLACE FUNCTION public.update_user_stats_on_page_visit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update user's updated_at timestamp
    UPDATE users SET updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_user_stats_on_page_visit() OWNER TO postgres;
GRANT ALL ON FUNCTION public.update_user_stats_on_page_visit() TO public;
GRANT ALL ON FUNCTION public.update_user_stats_on_page_visit() TO postgres;
GRANT ALL ON FUNCTION public.update_user_stats_on_page_visit() TO anon;

-- DROP FUNCTION public.urlencode(bytea);

CREATE OR REPLACE FUNCTION public.urlencode(string bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$urlencode$function$
;

-- Permissions

ALTER FUNCTION public.urlencode(bytea) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.urlencode(bytea) TO supabase_admin;

-- DROP FUNCTION public.urlencode(varchar);

CREATE OR REPLACE FUNCTION public.urlencode(string character varying)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$urlencode$function$
;

-- Permissions

ALTER FUNCTION public.urlencode(varchar) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.urlencode(varchar) TO supabase_admin;

-- DROP FUNCTION public.urlencode(jsonb);

CREATE OR REPLACE FUNCTION public.urlencode(data jsonb)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$urlencode_jsonb$function$
;

-- Permissions

ALTER FUNCTION public.urlencode(jsonb) OWNER TO supabase_admin;
GRANT ALL ON FUNCTION public.urlencode(jsonb) TO supabase_admin;


-- Permissions

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, MAINTAIN, SELECT, INSERT, REFERENCES, UPDATE, TRIGGER, TRUNCATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE, UPDATE ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO anon;