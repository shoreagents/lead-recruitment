-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP TYPE public."application_status_enum";

CREATE TYPE public."application_status_enum" AS ENUM (
	'submitted',
	'qualified',
	'for verification',
	'verified',
	'initial interview',
	'final interview',
	'not qualified',
	'passed',
	'rejected',
	'withdrawn',
	'hired',
	'closed',
	'failed');

-- DROP TYPE public."experience_level_enum";

CREATE TYPE public."experience_level_enum" AS ENUM (
	'entry-level',
	'mid-level',
	'senior-level');

-- DROP TYPE public."job_status_enum";

CREATE TYPE public."job_status_enum" AS ENUM (
	'active',
	'inactive',
	'closed',
	'processed');

-- DROP TYPE public."leaderboard_period_enum";

CREATE TYPE public."leaderboard_period_enum" AS ENUM (
	'weekly',
	'monthly',
	'all');

-- DROP TYPE public."member_status_enum";

CREATE TYPE public."member_status_enum" AS ENUM (
	'Current Client',
	'Lost Client');

-- DROP TYPE public."mood_enum";

CREATE TYPE public."mood_enum" AS ENUM (
	'Happy',
	'Satisfied',
	'Sad',
	'Undecided');

-- DROP TYPE public."priority_enum";

CREATE TYPE public."priority_enum" AS ENUM (
	'low',
	'medium',
	'high',
	'urgent');

-- DROP TYPE public."shift_enum";

CREATE TYPE public."shift_enum" AS ENUM (
	'day',
	'night',
	'both');

-- DROP TYPE public."work_arrangement_enum";

CREATE TYPE public."work_arrangement_enum" AS ENUM (
	'onsite',
	'remote',
	'hybrid');

-- DROP TYPE public."work_setup_enum";

CREATE TYPE public."work_setup_enum" AS ENUM (
	'Work From Office',
	'Work From Home',
	'Hybrid',
	'Any');

-- DROP TYPE public."work_status_enum";

CREATE TYPE public."work_status_enum" AS ENUM (
	'employed',
	'unemployed-looking-for-work',
	'freelancer',
	'part-time',
	'on-leave',
	'retired',
	'student',
	'career-break',
	'transitioning',
	'remote-worker');

-- DROP TYPE public."work_status_enum_new";

CREATE TYPE public."work_status_enum_new" AS ENUM (
	'employed',
	'unemployed-looking-for-work',
	'freelancer',
	'part-time',
	'student');

-- DROP SEQUENCE public.job_request_comments_id_seq;

CREATE SEQUENCE public.job_request_comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.job_requests_id_seq;

CREATE SEQUENCE public.job_requests_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.privacy_settings_id_seq;

CREATE SEQUENCE public.privacy_settings_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.job_match_results definition

-- Drop table

-- DROP TABLE public.job_match_results;

CREATE TABLE public.job_match_results (
	user_id uuid NOT NULL,
	score int4 NOT NULL,
	reasoning text NULL,
	breakdown jsonb NULL,
	analyzed_at timestamptz DEFAULT now() NOT NULL,
	job_id text NOT NULL,
	CONSTRAINT job_match_results_pkey PRIMARY KEY (user_id, job_id)
);
CREATE INDEX idx_job_match_results_job ON public.job_match_results USING btree (job_id);
CREATE INDEX idx_job_match_results_score ON public.job_match_results USING btree (score);
CREATE INDEX idx_job_match_results_user ON public.job_match_results USING btree (user_id);


-- public.members definition

-- Drop table

-- DROP TABLE public.members;

CREATE TABLE public.members (
	company text NOT NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	company_id uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT members_company_id_key UNIQUE (company_id),
	CONSTRAINT members_pkey PRIMARY KEY (company_id)
);

-- Table Triggers

create trigger update_members_updated_at before
update
    on
    public.members for each row execute function update_updated_at_column();


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid NOT NULL,
	email text NOT NULL,
	first_name text NOT NULL,
	last_name text NOT NULL,
	full_name text NOT NULL,
	"location" text NOT NULL,
	avatar_url text NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	phone text NULL,
	bio text NULL,
	"position" text NULL,
	admin_level varchar(10) DEFAULT 'user'::character varying NULL,
	completed_data bool DEFAULT false NOT NULL,
	birthday date NULL,
	slug text NULL,
	gender text NULL,
	gender_custom text NULL,
	location_place_id text NULL,
	location_lat float8 NULL,
	location_lng float8 NULL,
	location_city text NULL,
	location_province text NULL,
	location_country text NULL,
	location_barangay text NULL,
	location_region text NULL,
	username text NULL,
	company varchar(255) NULL,
	CONSTRAINT users_admin_level_check CHECK (((admin_level)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying, 'recruiter'::character varying])::text[]))),
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_gender_check CHECK (((gender IS NULL) OR (lower(gender) = ANY (ARRAY['male'::text, 'female'::text, 'others'::text])))),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username)
);
CREATE INDEX idx_users_gender_custom ON public.users USING btree (gender_custom) WHERE (gender_custom IS NOT NULL);
CREATE UNIQUE INDEX users_slug_key ON public.users USING btree (slug);

-- Table Triggers

create trigger update_users_updated_at before
update
    on
    public.users for each row execute function update_updated_at_column();
create trigger users_set_slug before
insert
    or
update
    of username on
    public.users for each row execute function users_set_slug_trigger();
create trigger trigger_update_leaderboard_on_user after
update
    of completed_data,
    avatar_url,
    bio,
    location on
    public.users for each row execute function trigger_update_leaderboard_score();


-- public.bpoc_cultural_sessions definition

-- Drop table

-- DROP TABLE public.bpoc_cultural_sessions;

CREATE TABLE public.bpoc_cultural_sessions (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	started_at timestamptz DEFAULT now() NULL,
	finished_at timestamptz NULL,
	duration_ms int4 NULL,
	stage_reached int4 NULL,
	challenge_completed int4 NULL,
	game_state text NULL,
	time_left int4 NULL,
	survival_status int4 NULL,
	interaction_count int4 NULL,
	tier_name text NULL,
	tier_description text NULL,
	achievements jsonb DEFAULT '[]'::jsonb NOT NULL,
	metrics jsonb DEFAULT '{}'::jsonb NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	c1a_us_text text NULL,
	c1a_uk_text text NULL,
	c1a_au_text text NULL,
	c1a_ca_text text NULL,
	c1b_text text NULL,
	c1c_text text NULL,
	c2a_text text NULL,
	c2b_us_text text NULL,
	c2b_uk_text text NULL,
	c2b_au_text text NULL,
	c2b_ca_text text NULL,
	c3a_text text NULL,
	c3b_text text NULL,
	c3c_text text NULL,
	CONSTRAINT bpoc_cultural_sessions_challenge_completed_check CHECK ((challenge_completed >= 0)),
	CONSTRAINT bpoc_cultural_sessions_duration_ms_check CHECK (((duration_ms IS NULL) OR (duration_ms >= 0))),
	CONSTRAINT bpoc_cultural_sessions_game_state_check CHECK ((game_state = ANY (ARRAY['welcome'::text, 'intro'::text, 'playing'::text, 'results'::text]))),
	CONSTRAINT bpoc_cultural_sessions_interaction_count_check CHECK ((interaction_count >= 0)),
	CONSTRAINT bpoc_cultural_sessions_pkey PRIMARY KEY (id),
	CONSTRAINT bpoc_cultural_sessions_stage_reached_check CHECK (((stage_reached >= 1) AND (stage_reached <= 4))),
	CONSTRAINT bpoc_cultural_sessions_survival_status_check CHECK (((survival_status >= 0) AND (survival_status <= 100))),
	CONSTRAINT bpoc_cultural_sessions_time_left_check CHECK ((time_left >= 0)),
	CONSTRAINT bpoc_cultural_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_bpoc_cultural_sessions_started ON public.bpoc_cultural_sessions USING btree (started_at);
CREATE INDEX idx_bpoc_cultural_sessions_tier ON public.bpoc_cultural_sessions USING btree (tier_name);
CREATE INDEX idx_bpoc_cultural_sessions_user ON public.bpoc_cultural_sessions USING btree (user_id);


-- public.bpoc_cultural_stats definition

-- Drop table

-- DROP TABLE public.bpoc_cultural_stats;

CREATE TABLE public.bpoc_cultural_stats (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	total_sessions int4 DEFAULT 0 NOT NULL,
	completed_sessions int4 DEFAULT 0 NOT NULL,
	last_played_at timestamptz NULL,
	current_tier text NULL,
	tier_progression jsonb DEFAULT '[]'::jsonb NOT NULL,
	percentile numeric(5, 2) NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	last_c1a_us_text text NULL,
	last_c1a_uk_text text NULL,
	last_c1a_au_text text NULL,
	last_c1a_ca_text text NULL,
	last_c1b_text text NULL,
	last_c1c_text text NULL,
	last_c2a_text text NULL,
	last_c2b_us_text text NULL,
	last_c2b_uk_text text NULL,
	last_c2b_au_text text NULL,
	last_c2b_ca_text text NULL,
	last_c3a_text text NULL,
	last_c3b_text text NULL,
	last_c3c_text text NULL,
	CONSTRAINT bpoc_cultural_stats_percentile_check CHECK (((percentile >= (0)::numeric) AND (percentile <= (100)::numeric))),
	CONSTRAINT bpoc_cultural_stats_pkey PRIMARY KEY (id),
	CONSTRAINT bpoc_cultural_stats_user_id_key UNIQUE (user_id),
	CONSTRAINT bpoc_cultural_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_bpoc_cultural_stats_percentile ON public.bpoc_cultural_stats USING btree (percentile);
CREATE INDEX idx_bpoc_cultural_stats_tier ON public.bpoc_cultural_stats USING btree (current_tier);
CREATE INDEX idx_bpoc_cultural_stats_user ON public.bpoc_cultural_stats USING btree (user_id);


-- public.disc_personality_sessions definition

-- Drop table

-- DROP TABLE public.disc_personality_sessions;

CREATE TABLE public.disc_personality_sessions (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	started_at timestamptz NOT NULL,
	finished_at timestamptz NULL,
	duration_seconds int4 NULL,
	total_questions int4 DEFAULT 35 NOT NULL,
	d_score int4 DEFAULT 0 NOT NULL,
	i_score int4 DEFAULT 0 NOT NULL,
	s_score int4 DEFAULT 0 NOT NULL,
	c_score int4 DEFAULT 0 NOT NULL,
	primary_type text NOT NULL,
	secondary_type text NULL,
	confidence_score int4 DEFAULT 0 NULL,
	cultural_alignment int4 DEFAULT 95 NULL,
	consistency_index numeric(5, 2) NULL,
	ai_assessment jsonb DEFAULT '{}'::jsonb NULL, -- Full AI-generated personality assessment text
	ai_bpo_roles jsonb DEFAULT '[]'::jsonb NULL, -- AI-recommended BPO roles based on personality and user background
	core_responses jsonb DEFAULT '[]'::jsonb NULL, -- Detailed responses to the 30 Filipino scenario questions
	personalized_responses jsonb DEFAULT '[]'::jsonb NULL, -- Responses to AI-generated personalized follow-up questions
	response_patterns jsonb DEFAULT '{}'::jsonb NULL, -- Analysis of response times, consistency, and decision patterns
	user_position text NULL,
	user_location text NULL,
	user_experience text NULL,
	session_status text DEFAULT 'completed'::text NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT disc_personality_sessions_c_score_check CHECK (((c_score >= 0) AND (c_score <= 100))),
	CONSTRAINT disc_personality_sessions_confidence_score_check CHECK (((confidence_score >= 0) AND (confidence_score <= 100))),
	CONSTRAINT disc_personality_sessions_cultural_alignment_check CHECK (((cultural_alignment >= 0) AND (cultural_alignment <= 100))),
	CONSTRAINT disc_personality_sessions_d_score_check CHECK (((d_score >= 0) AND (d_score <= 100))),
	CONSTRAINT disc_personality_sessions_i_score_check CHECK (((i_score >= 0) AND (i_score <= 100))),
	CONSTRAINT disc_personality_sessions_pkey PRIMARY KEY (id),
	CONSTRAINT disc_personality_sessions_primary_type_check CHECK ((primary_type = ANY (ARRAY['D'::text, 'I'::text, 'S'::text, 'C'::text]))),
	CONSTRAINT disc_personality_sessions_s_score_check CHECK (((s_score >= 0) AND (s_score <= 100))),
	CONSTRAINT disc_personality_sessions_secondary_type_check CHECK ((secondary_type = ANY (ARRAY['D'::text, 'I'::text, 'S'::text, 'C'::text]))),
	CONSTRAINT disc_personality_sessions_session_status_check CHECK ((session_status = ANY (ARRAY['completed'::text, 'abandoned'::text, 'in_progress'::text]))),
	CONSTRAINT disc_personality_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_disc_sessions_ai_assessment ON public.disc_personality_sessions USING gin (ai_assessment);
CREATE INDEX idx_disc_sessions_ai_bpo_roles ON public.disc_personality_sessions USING gin (ai_bpo_roles);
CREATE INDEX idx_disc_sessions_confidence ON public.disc_personality_sessions USING btree (confidence_score);
CREATE INDEX idx_disc_sessions_core_responses ON public.disc_personality_sessions USING gin (core_responses);
CREATE INDEX idx_disc_sessions_created_at ON public.disc_personality_sessions USING btree (created_at);
CREATE INDEX idx_disc_sessions_primary_type ON public.disc_personality_sessions USING btree (primary_type);
CREATE INDEX idx_disc_sessions_response_patterns ON public.disc_personality_sessions USING gin (response_patterns);
CREATE INDEX idx_disc_sessions_status ON public.disc_personality_sessions USING btree (session_status);
CREATE INDEX idx_disc_sessions_user_id ON public.disc_personality_sessions USING btree (user_id);
COMMENT ON TABLE public.disc_personality_sessions IS 'Individual DISC personality assessment sessions with detailed response tracking and AI analysis';

-- Column comments

COMMENT ON COLUMN public.disc_personality_sessions.ai_assessment IS 'Full AI-generated personality assessment text';
COMMENT ON COLUMN public.disc_personality_sessions.ai_bpo_roles IS 'AI-recommended BPO roles based on personality and user background';
COMMENT ON COLUMN public.disc_personality_sessions.core_responses IS 'Detailed responses to the 30 Filipino scenario questions';
COMMENT ON COLUMN public.disc_personality_sessions.personalized_responses IS 'Responses to AI-generated personalized follow-up questions';
COMMENT ON COLUMN public.disc_personality_sessions.response_patterns IS 'Analysis of response times, consistency, and decision patterns';

-- Table Triggers

create trigger update_disc_sessions_updated_at before
update
    on
    public.disc_personality_sessions for each row execute function update_disc_sessions_updated_at();


-- public.disc_personality_stats definition

-- Drop table

-- DROP TABLE public.disc_personality_stats;

CREATE TABLE public.disc_personality_stats (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	total_sessions int4 DEFAULT 0 NOT NULL,
	completed_sessions int4 DEFAULT 0 NOT NULL,
	last_taken_at timestamptz NULL,
	latest_d_score int4 NULL,
	latest_i_score int4 NULL,
	latest_s_score int4 NULL,
	latest_c_score int4 NULL,
	latest_primary_type text NULL,
	latest_secondary_type text NULL,
	best_confidence_score int4 NULL,
	average_completion_time int4 NULL,
	consistency_trend numeric(5, 2) NULL,
	latest_ai_assessment text NULL,
	latest_bpo_roles jsonb DEFAULT '[]'::jsonb NULL,
	percentile numeric(5, 2) NULL,
	total_xp int4 DEFAULT 0 NULL, -- Cumulative XP earned across all DISC sessions
	badges_earned int4 DEFAULT 0 NULL, -- Total number of badges/achievements earned
	cultural_alignment_score int4 NULL, -- Latest cultural alignment percentage (Filipino workplace fit)
	authenticity_score int4 NULL, -- Latest authenticity score from DISC assessment
	latest_session_xp int4 DEFAULT 0 NULL, -- XP earned in the most recent session
	CONSTRAINT disc_personality_stats_authenticity_score_check CHECK (((authenticity_score IS NULL) OR ((authenticity_score >= 0) AND (authenticity_score <= 100)))),
	CONSTRAINT disc_personality_stats_best_confidence_score_check CHECK (((best_confidence_score IS NULL) OR ((best_confidence_score >= 0) AND (best_confidence_score <= 100)))),
	CONSTRAINT disc_personality_stats_cultural_alignment_score_check CHECK (((cultural_alignment_score IS NULL) OR ((cultural_alignment_score >= 0) AND (cultural_alignment_score <= 100)))),
	CONSTRAINT disc_personality_stats_latest_c_score_check CHECK (((latest_c_score IS NULL) OR ((latest_c_score >= 0) AND (latest_c_score <= 100)))),
	CONSTRAINT disc_personality_stats_latest_d_score_check CHECK (((latest_d_score IS NULL) OR ((latest_d_score >= 0) AND (latest_d_score <= 100)))),
	CONSTRAINT disc_personality_stats_latest_i_score_check CHECK (((latest_i_score IS NULL) OR ((latest_i_score >= 0) AND (latest_i_score <= 100)))),
	CONSTRAINT disc_personality_stats_latest_primary_type_check CHECK (((latest_primary_type IS NULL) OR (latest_primary_type = ANY (ARRAY['D'::text, 'I'::text, 'S'::text, 'C'::text])))),
	CONSTRAINT disc_personality_stats_latest_s_score_check CHECK (((latest_s_score IS NULL) OR ((latest_s_score >= 0) AND (latest_s_score <= 100)))),
	CONSTRAINT disc_personality_stats_latest_secondary_type_check CHECK (((latest_secondary_type IS NULL) OR (latest_secondary_type = ANY (ARRAY['D'::text, 'I'::text, 'S'::text, 'C'::text])))),
	CONSTRAINT disc_personality_stats_percentile_check CHECK (((percentile IS NULL) OR ((percentile >= (0)::numeric) AND (percentile <= (100)::numeric)))),
	CONSTRAINT disc_personality_stats_pkey PRIMARY KEY (id),
	CONSTRAINT disc_personality_stats_user_id_key UNIQUE (user_id),
	CONSTRAINT disc_personality_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_disc_stats_badges ON public.disc_personality_stats USING btree (badges_earned);
CREATE INDEX idx_disc_stats_bpo_roles ON public.disc_personality_stats USING gin (latest_bpo_roles);
CREATE INDEX idx_disc_stats_confidence ON public.disc_personality_stats USING btree (best_confidence_score);
CREATE INDEX idx_disc_stats_cultural_alignment ON public.disc_personality_stats USING btree (cultural_alignment_score);
CREATE INDEX idx_disc_stats_last_taken ON public.disc_personality_stats USING btree (last_taken_at);
CREATE INDEX idx_disc_stats_percentile ON public.disc_personality_stats USING btree (percentile);
CREATE INDEX idx_disc_stats_primary_type ON public.disc_personality_stats USING btree (latest_primary_type);
CREATE INDEX idx_disc_stats_total_xp ON public.disc_personality_stats USING btree (total_xp);
CREATE INDEX idx_disc_stats_user_id ON public.disc_personality_stats USING btree (user_id);
COMMENT ON TABLE public.disc_personality_stats IS 'Aggregated DISC personality statistics per user for quick lookups and leaderboards';

-- Column comments

COMMENT ON COLUMN public.disc_personality_stats.total_xp IS 'Cumulative XP earned across all DISC sessions';
COMMENT ON COLUMN public.disc_personality_stats.badges_earned IS 'Total number of badges/achievements earned';
COMMENT ON COLUMN public.disc_personality_stats.cultural_alignment_score IS 'Latest cultural alignment percentage (Filipino workplace fit)';
COMMENT ON COLUMN public.disc_personality_stats.authenticity_score IS 'Latest authenticity score from DISC assessment';
COMMENT ON COLUMN public.disc_personality_stats.latest_session_xp IS 'XP earned in the most recent session';

-- Table Triggers

create trigger trigger_update_leaderboard_on_disc after
insert
    or
update
    on
    public.disc_personality_stats for each row execute function trigger_update_leaderboard_score();
create trigger update_disc_stats_updated_at before
update
    on
    public.disc_personality_stats for each row execute function update_disc_stats_updated_at();


-- public.job_requests definition

-- Drop table

-- DROP TABLE public.job_requests;

CREATE TABLE public.job_requests (
	id serial4 NOT NULL,
	company_id uuid NULL,
	job_title text NOT NULL,
	work_arrangement public."work_arrangement_enum" NULL,
	salary_min int4 NULL,
	salary_max int4 NULL,
	job_description text NOT NULL,
	requirements _text DEFAULT '{}'::text[] NULL,
	responsibilities _text DEFAULT '{}'::text[] NULL,
	benefits _text DEFAULT '{}'::text[] NULL,
	skills _text DEFAULT '{}'::text[] NULL,
	experience_level public."experience_level_enum" NULL,
	application_deadline date NULL,
	industry text NULL,
	department text NULL,
	work_type text DEFAULT 'full-time'::text NOT NULL,
	currency text DEFAULT 'PHP'::text NOT NULL,
	salary_type text DEFAULT 'monthly'::text NOT NULL,
	status public."job_status_enum" DEFAULT 'active'::job_status_enum NOT NULL,
	"views" int4 DEFAULT 0 NOT NULL,
	applicants int4 DEFAULT 0 NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	priority public."priority_enum" DEFAULT 'medium'::priority_enum NOT NULL,
	shift public."shift_enum" DEFAULT 'day'::shift_enum NOT NULL,
	CONSTRAINT job_requests_pkey PRIMARY KEY (id),
	CONSTRAINT job_requests_salary_max_check CHECK (((salary_max IS NULL) OR (salary_max >= 0))),
	CONSTRAINT job_requests_salary_min_check CHECK (((salary_min IS NULL) OR (salary_min >= 0))),
	CONSTRAINT job_requests_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.members(company_id) ON DELETE SET NULL
);
CREATE INDEX idx_job_requests_company_id ON public.job_requests USING btree (company_id);
CREATE INDEX idx_job_requests_created_at ON public.job_requests USING btree (created_at);
CREATE INDEX idx_job_requests_priority ON public.job_requests USING btree (priority);
CREATE INDEX idx_job_requests_shift ON public.job_requests USING btree (shift);
CREATE INDEX idx_job_requests_status ON public.job_requests USING btree (status);

-- Table Triggers

create trigger update_job_requests_updated_at before
update
    on
    public.job_requests for each row execute function update_updated_at_column();


-- public.privacy_settings definition

-- Drop table

-- DROP TABLE public.privacy_settings;

CREATE TABLE public.privacy_settings (
	id serial4 NOT NULL,
	user_id uuid NOT NULL,
	username varchar(20) DEFAULT 'public'::character varying NULL,
	first_name varchar(20) DEFAULT 'public'::character varying NULL,
	last_name varchar(20) DEFAULT 'only-me'::character varying NULL,
	"location" varchar(20) DEFAULT 'public'::character varying NULL,
	job_title varchar(20) DEFAULT 'public'::character varying NULL,
	birthday varchar(20) DEFAULT 'only-me'::character varying NULL,
	age varchar(20) DEFAULT 'only-me'::character varying NULL,
	gender varchar(20) DEFAULT 'only-me'::character varying NULL,
	member_since varchar(20) DEFAULT 'public'::character varying NULL,
	resume_score varchar(20) DEFAULT 'public'::character varying NULL,
	games_completed varchar(20) DEFAULT 'public'::character varying NULL,
	key_strengths varchar(20) DEFAULT 'only-me'::character varying NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT privacy_settings_age_check CHECK (((age)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_birthday_check CHECK (((birthday)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_first_name_check CHECK (((first_name)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_games_completed_check CHECK (((games_completed)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_gender_check CHECK (((gender)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_job_title_check CHECK (((job_title)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_key_strengths_check CHECK (((key_strengths)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_last_name_check CHECK (((last_name)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_location_check CHECK (((location)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_member_since_check CHECK (((member_since)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_pkey PRIMARY KEY (id),
	CONSTRAINT privacy_settings_resume_score_check CHECK (((resume_score)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_user_id_key UNIQUE (user_id),
	CONSTRAINT privacy_settings_username_check CHECK (((username)::text = ANY ((ARRAY['public'::character varying, 'only-me'::character varying])::text[]))),
	CONSTRAINT privacy_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_privacy_settings_user_id ON public.privacy_settings USING btree (user_id);

-- Table Triggers

create trigger trigger_update_privacy_settings_updated_at before
update
    on
    public.privacy_settings for each row execute function update_privacy_settings_updated_at();


-- public.processed_job_requests definition

-- Drop table

-- DROP TABLE public.processed_job_requests;

CREATE TABLE public.processed_job_requests (
	id int4 NOT NULL,
	company_id uuid NULL,
	job_title text NOT NULL,
	work_arrangement public."work_arrangement_enum" NULL,
	salary_min int4 NULL,
	salary_max int4 NULL,
	job_description text NOT NULL,
	requirements _text DEFAULT '{}'::text[] NULL,
	responsibilities _text DEFAULT '{}'::text[] NULL,
	benefits _text DEFAULT '{}'::text[] NULL,
	skills _text DEFAULT '{}'::text[] NULL,
	experience_level public."experience_level_enum" NULL,
	application_deadline date NULL,
	industry text NULL,
	department text NULL,
	work_type text DEFAULT 'full-time'::text NOT NULL,
	currency text DEFAULT 'PHP'::text NOT NULL,
	salary_type text DEFAULT 'monthly'::text NOT NULL,
	status public."job_status_enum" DEFAULT 'active'::job_status_enum NOT NULL,
	"views" int4 DEFAULT 0 NOT NULL,
	applicants int4 DEFAULT 0 NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	priority public."priority_enum" DEFAULT 'medium'::priority_enum NOT NULL,
	shift public."shift_enum" DEFAULT 'day'::shift_enum NOT NULL,
	CONSTRAINT processed_job_requests_pkey PRIMARY KEY (id),
	CONSTRAINT processed_job_requests_salary_max_check CHECK (((salary_max IS NULL) OR (salary_max >= 0))),
	CONSTRAINT processed_job_requests_salary_min_check CHECK (((salary_min IS NULL) OR (salary_min >= 0))),
	CONSTRAINT processed_job_requests_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.members(company_id) ON DELETE SET NULL,
	CONSTRAINT processed_job_requests_id_fkey FOREIGN KEY (id) REFERENCES public.job_requests(id) ON DELETE CASCADE
);
CREATE INDEX idx_processed_job_requests_company_id ON public.processed_job_requests USING btree (company_id);
CREATE INDEX idx_processed_job_requests_created_at ON public.processed_job_requests USING btree (created_at);
CREATE INDEX idx_processed_job_requests_shift ON public.processed_job_requests USING btree (shift);
CREATE INDEX idx_processed_job_requests_status ON public.processed_job_requests USING btree (status);

-- Table Triggers

create trigger update_processed_job_requests_updated_at before
update
    on
    public.processed_job_requests for each row execute function update_updated_at_column();


-- public.recruiter_jobs definition

-- Drop table

-- DROP TABLE public.recruiter_jobs;

CREATE TABLE public.recruiter_jobs (
	id uuid DEFAULT gen_random_uuid() NOT NULL, -- References users.id - the recruiter who created the job
	company_id text NULL, -- References users.company - the company of the logged-in recruiter
	job_title text NOT NULL,
	work_arrangement public."work_arrangement_enum" NULL,
	salary_min int4 NULL,
	salary_max int4 NULL,
	job_description text NOT NULL,
	requirements _text DEFAULT '{}'::text[] NULL,
	responsibilities _text DEFAULT '{}'::text[] NULL,
	benefits _text DEFAULT '{}'::text[] NULL,
	skills _text DEFAULT '{}'::text[] NULL,
	experience_level public."experience_level_enum" NULL,
	application_deadline date NULL,
	industry text NULL,
	department text NULL,
	work_type text DEFAULT 'full-time'::text NOT NULL,
	currency text DEFAULT 'PHP'::text NOT NULL,
	salary_type text DEFAULT 'monthly'::text NOT NULL,
	status text DEFAULT 'new_request'::text NOT NULL, -- Job status: new_request (default), active, inactive, closed
	"views" int4 DEFAULT 0 NOT NULL, -- Number of times the job has been viewed
	applicants int4 DEFAULT 0 NOT NULL, -- Number of applicants for this job
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	priority public."priority_enum" DEFAULT 'medium'::priority_enum NOT NULL,
	shift public."shift_enum" DEFAULT 'day'::shift_enum NOT NULL,
	recruiter_id uuid NOT NULL,
	CONSTRAINT recruiter_jobs_pkey PRIMARY KEY (id),
	CONSTRAINT recruiter_jobs_salary_max_check CHECK (((salary_max IS NULL) OR (salary_max >= 0))),
	CONSTRAINT recruiter_jobs_salary_min_check CHECK (((salary_min IS NULL) OR (salary_min >= 0))),
	CONSTRAINT recruiter_jobs_status_check CHECK ((status = ANY (ARRAY['new_request'::text, 'active'::text, 'inactive'::text, 'closed'::text]))),
	CONSTRAINT recruiter_jobs_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_recruiter_jobs_company_id ON public.recruiter_jobs USING btree (company_id);
CREATE INDEX idx_recruiter_jobs_created_at ON public.recruiter_jobs USING btree (created_at);
CREATE INDEX idx_recruiter_jobs_recruiter_id ON public.recruiter_jobs USING btree (recruiter_id);
CREATE INDEX idx_recruiter_jobs_shift ON public.recruiter_jobs USING btree (shift);
CREATE INDEX idx_recruiter_jobs_status ON public.recruiter_jobs USING btree (status);
COMMENT ON TABLE public.recruiter_jobs IS 'Table to store job postings created by recruiters';

-- Column comments

COMMENT ON COLUMN public.recruiter_jobs.id IS 'References users.id - the recruiter who created the job';
COMMENT ON COLUMN public.recruiter_jobs.company_id IS 'References users.company - the company of the logged-in recruiter';
COMMENT ON COLUMN public.recruiter_jobs.status IS 'Job status: new_request (default), active, inactive, closed';
COMMENT ON COLUMN public.recruiter_jobs."views" IS 'Number of times the job has been viewed';
COMMENT ON COLUMN public.recruiter_jobs.applicants IS 'Number of applicants for this job';

-- Table Triggers

create trigger update_recruiter_jobs_updated_at before
update
    on
    public.recruiter_jobs for each row execute function update_updated_at_column();


-- public.resumes_extracted definition

-- Drop table

-- DROP TABLE public.resumes_extracted;

CREATE TABLE public.resumes_extracted (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	resume_data jsonb NOT NULL,
	original_filename text NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT resumes_extracted_pkey PRIMARY KEY (id),
	CONSTRAINT resumes_extracted_user_id_unique UNIQUE (user_id),
	CONSTRAINT resumes_extracted_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_resumes_extracted_created_at ON public.resumes_extracted USING btree (created_at);

-- Table Triggers

create trigger update_resumes_extracted_updated_at before
update
    on
    public.resumes_extracted for each row execute function update_updated_at_column();


-- public.resumes_generated definition

-- Drop table

-- DROP TABLE public.resumes_generated;

CREATE TABLE public.resumes_generated (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	original_resume_id uuid NULL,
	generated_resume_data jsonb NOT NULL,
	template_used text NULL,
	generation_metadata jsonb NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT resumes_generated_pkey PRIMARY KEY (id),
	CONSTRAINT resumes_generated_user_id_unique UNIQUE (user_id),
	CONSTRAINT resumes_generated_original_resume_id_fkey FOREIGN KEY (original_resume_id) REFERENCES public.resumes_extracted(id) ON DELETE SET NULL,
	CONSTRAINT resumes_generated_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_resumes_generated_original_resume_id ON public.resumes_generated USING btree (original_resume_id);

-- Table Triggers

create trigger update_resumes_generated_updated_at before
update
    on
    public.resumes_generated for each row execute function update_updated_at_column();


-- public.saved_resumes definition

-- Drop table

-- DROP TABLE public.saved_resumes;

CREATE TABLE public.saved_resumes (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	resume_slug text NOT NULL,
	resume_title text NOT NULL,
	resume_data jsonb NOT NULL,
	template_used text NOT NULL,
	is_public bool DEFAULT true NULL,
	view_count int4 DEFAULT 0 NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	original_resume_id uuid NULL, -- References the resumes_generated table to track which AI-generated resume was used to create this saved resume
	CONSTRAINT saved_resumes_pkey PRIMARY KEY (id),
	CONSTRAINT saved_resumes_resume_slug_key UNIQUE (resume_slug),
	CONSTRAINT saved_resumes_original_resume_id_fkey FOREIGN KEY (original_resume_id) REFERENCES public.resumes_generated(id) ON DELETE SET NULL,
	CONSTRAINT saved_resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_saved_resumes_original_resume_id ON public.saved_resumes USING btree (original_resume_id);
CREATE INDEX idx_saved_resumes_public ON public.saved_resumes USING btree (is_public);

-- Column comments

COMMENT ON COLUMN public.saved_resumes.original_resume_id IS 'References the resumes_generated table to track which AI-generated resume was used to create this saved resume';

-- Table Triggers

create trigger update_saved_resumes_updated_at before
update
    on
    public.saved_resumes for each row execute function update_updated_at_column();


-- public.typing_hero_sessions definition

-- Drop table

-- DROP TABLE public.typing_hero_sessions;

CREATE TABLE public.typing_hero_sessions (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	score int4 DEFAULT 0 NOT NULL, -- Total score achieved in the session
	wpm int4 DEFAULT 0 NOT NULL, -- Words per minute achieved
	longest_streak int4 DEFAULT 0 NOT NULL, -- Longest consecutive correct words streak
	correct_words int4 DEFAULT 0 NOT NULL, -- Number of correctly typed words
	wrong_words int4 DEFAULT 0 NOT NULL, -- Number of incorrectly typed words
	elapsed_time int4 DEFAULT 0 NOT NULL, -- Session duration in seconds
	overall_accuracy numeric(5, 2) DEFAULT 0.00 NOT NULL, -- Overall accuracy percentage (0-100)
	ai_analysis jsonb DEFAULT '{}'::jsonb NULL, -- Complete AI assessment and analysis as JSONB
	difficulty_level text DEFAULT 'rockstar'::text NULL, -- Difficulty level played (rookie, rockstar, virtuoso, legend)
	session_status text DEFAULT 'completed'::text NULL, -- Session completion status
	updated_at timestamptz DEFAULT now() NULL,
	words_correct jsonb DEFAULT '[]'::jsonb NULL, -- Array of correctly typed words with metadata (word, timestamp, reactionTime, difficulty, position) as JSONB.
	words_incorrect jsonb DEFAULT '[]'::jsonb NULL, -- Array of incorrectly typed words with metadata (word, userInput, timestamp, errorType, difficulty, position) as JSONB.
	CONSTRAINT typing_hero_sessions_pkey PRIMARY KEY (id),
	CONSTRAINT typing_hero_sessions_session_status_check CHECK ((session_status = ANY (ARRAY['completed'::text, 'failed'::text, 'abandoned'::text]))),
	CONSTRAINT typing_hero_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_typing_hero_sessions_accuracy ON public.typing_hero_sessions USING btree (overall_accuracy);
CREATE INDEX idx_typing_hero_sessions_ai_analysis ON public.typing_hero_sessions USING gin (ai_analysis);
CREATE INDEX idx_typing_hero_sessions_created_at ON public.typing_hero_sessions USING btree (created_at);
CREATE INDEX idx_typing_hero_sessions_difficulty ON public.typing_hero_sessions USING btree (difficulty_level);
CREATE INDEX idx_typing_hero_sessions_performance_level ON public.typing_hero_sessions USING btree (((ai_analysis ->> 'performanceLevel'::text)));
CREATE INDEX idx_typing_hero_sessions_score ON public.typing_hero_sessions USING btree (score);
CREATE INDEX idx_typing_hero_sessions_user_id ON public.typing_hero_sessions USING btree (user_id);
CREATE INDEX idx_typing_hero_sessions_words_correct ON public.typing_hero_sessions USING gin (words_correct);
CREATE INDEX idx_typing_hero_sessions_words_incorrect ON public.typing_hero_sessions USING gin (words_incorrect);
CREATE INDEX idx_typing_hero_sessions_wpm ON public.typing_hero_sessions USING btree (wpm);
COMMENT ON TABLE public.typing_hero_sessions IS 'Individual Typing Hero session records with core metrics and AI analysis';

-- Column comments

COMMENT ON COLUMN public.typing_hero_sessions.score IS 'Total score achieved in the session';
COMMENT ON COLUMN public.typing_hero_sessions.wpm IS 'Words per minute achieved';
COMMENT ON COLUMN public.typing_hero_sessions.longest_streak IS 'Longest consecutive correct words streak';
COMMENT ON COLUMN public.typing_hero_sessions.correct_words IS 'Number of correctly typed words';
COMMENT ON COLUMN public.typing_hero_sessions.wrong_words IS 'Number of incorrectly typed words';
COMMENT ON COLUMN public.typing_hero_sessions.elapsed_time IS 'Session duration in seconds';
COMMENT ON COLUMN public.typing_hero_sessions.overall_accuracy IS 'Overall accuracy percentage (0-100)';
COMMENT ON COLUMN public.typing_hero_sessions.ai_analysis IS 'Complete AI assessment and analysis as JSONB';
COMMENT ON COLUMN public.typing_hero_sessions.difficulty_level IS 'Difficulty level played (rookie, rockstar, virtuoso, legend)';
COMMENT ON COLUMN public.typing_hero_sessions.session_status IS 'Session completion status';
COMMENT ON COLUMN public.typing_hero_sessions.words_correct IS 'Array of correctly typed words with metadata (word, timestamp, reactionTime, difficulty, position) as JSONB.';
COMMENT ON COLUMN public.typing_hero_sessions.words_incorrect IS 'Array of incorrectly typed words with metadata (word, userInput, timestamp, errorType, difficulty, position) as JSONB.';

-- Table Triggers

create trigger update_typing_hero_sessions_updated_at before
update
    on
    public.typing_hero_sessions for each row execute function update_typing_hero_sessions_updated_at();


-- public.typing_hero_stats definition

-- Drop table

-- DROP TABLE public.typing_hero_stats;

CREATE TABLE public.typing_hero_stats (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	total_sessions int4 DEFAULT 0 NULL, -- Total number of sessions played
	completed_sessions int4 DEFAULT 0 NULL, -- Number of completed sessions
	last_played_at timestamptz NULL,
	best_score int4 NULL, -- Highest score achieved across all sessions
	best_wpm int4 NULL, -- Highest WPM achieved across all sessions
	best_accuracy numeric(5, 2) NULL, -- Highest accuracy achieved across all sessions
	best_streak int4 NULL, -- Longest streak achieved across all sessions
	latest_score int4 NULL, -- Score from most recent session
	latest_wpm int4 NULL, -- WPM from most recent session
	latest_accuracy numeric(5, 2) NULL, -- Accuracy from most recent session
	latest_difficulty text NULL, -- Difficulty level from most recent session
	avg_wpm numeric(5, 2) NULL, -- Average WPM across all sessions
	avg_accuracy numeric(5, 2) NULL, -- Average accuracy across all sessions
	total_play_time int4 NULL, -- Total time played in seconds
	ai_analysis jsonb NULL, -- Latest AI assessment and analysis
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	total_words_correct int4 DEFAULT 0 NULL, -- Total number of correctly typed words across all sessions.
	total_words_incorrect int4 DEFAULT 0 NULL, -- Total number of incorrectly typed words across all sessions.
	most_common_correct_words jsonb DEFAULT '[]'::jsonb NULL, -- Array of most frequently correctly typed words with counts as JSONB.
	most_common_incorrect_words jsonb DEFAULT '[]'::jsonb NULL, -- Array of most frequently incorrectly typed words with counts as JSONB.
	average_reaction_time numeric(5, 2) NULL, -- Average reaction time across all correct words in milliseconds.
	vocabulary_strengths jsonb DEFAULT '[]'::jsonb NULL, -- Array of vocabulary areas where the user performs well as JSONB.
	vocabulary_weaknesses jsonb DEFAULT '[]'::jsonb NULL, -- Array of vocabulary areas where the user needs improvement as JSONB.
	generated_story text NULL,
	CONSTRAINT typing_hero_stats_pkey PRIMARY KEY (id),
	CONSTRAINT typing_hero_stats_user_id_key UNIQUE (user_id),
	CONSTRAINT typing_hero_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_typing_hero_stats_ai_analysis ON public.typing_hero_stats USING gin (ai_analysis);
CREATE INDEX idx_typing_hero_stats_best_score ON public.typing_hero_stats USING btree (best_score);
CREATE INDEX idx_typing_hero_stats_best_wpm ON public.typing_hero_stats USING btree (best_wpm);
CREATE INDEX idx_typing_hero_stats_last_played ON public.typing_hero_stats USING btree (last_played_at);
CREATE INDEX idx_typing_hero_stats_user_id ON public.typing_hero_stats USING btree (user_id);
CREATE INDEX idx_typing_hero_stats_vocabulary_strengths ON public.typing_hero_stats USING gin (vocabulary_strengths);
CREATE INDEX idx_typing_hero_stats_vocabulary_weaknesses ON public.typing_hero_stats USING gin (vocabulary_weaknesses);
COMMENT ON TABLE public.typing_hero_stats IS 'Aggregated Typing Hero statistics per user for fast lookups';

-- Column comments

COMMENT ON COLUMN public.typing_hero_stats.total_sessions IS 'Total number of sessions played';
COMMENT ON COLUMN public.typing_hero_stats.completed_sessions IS 'Number of completed sessions';
COMMENT ON COLUMN public.typing_hero_stats.best_score IS 'Highest score achieved across all sessions';
COMMENT ON COLUMN public.typing_hero_stats.best_wpm IS 'Highest WPM achieved across all sessions';
COMMENT ON COLUMN public.typing_hero_stats.best_accuracy IS 'Highest accuracy achieved across all sessions';
COMMENT ON COLUMN public.typing_hero_stats.best_streak IS 'Longest streak achieved across all sessions';
COMMENT ON COLUMN public.typing_hero_stats.latest_score IS 'Score from most recent session';
COMMENT ON COLUMN public.typing_hero_stats.latest_wpm IS 'WPM from most recent session';
COMMENT ON COLUMN public.typing_hero_stats.latest_accuracy IS 'Accuracy from most recent session';
COMMENT ON COLUMN public.typing_hero_stats.latest_difficulty IS 'Difficulty level from most recent session';
COMMENT ON COLUMN public.typing_hero_stats.avg_wpm IS 'Average WPM across all sessions';
COMMENT ON COLUMN public.typing_hero_stats.avg_accuracy IS 'Average accuracy across all sessions';
COMMENT ON COLUMN public.typing_hero_stats.total_play_time IS 'Total time played in seconds';
COMMENT ON COLUMN public.typing_hero_stats.ai_analysis IS 'Latest AI assessment and analysis';
COMMENT ON COLUMN public.typing_hero_stats.total_words_correct IS 'Total number of correctly typed words across all sessions.';
COMMENT ON COLUMN public.typing_hero_stats.total_words_incorrect IS 'Total number of incorrectly typed words across all sessions.';
COMMENT ON COLUMN public.typing_hero_stats.most_common_correct_words IS 'Array of most frequently correctly typed words with counts as JSONB.';
COMMENT ON COLUMN public.typing_hero_stats.most_common_incorrect_words IS 'Array of most frequently incorrectly typed words with counts as JSONB.';
COMMENT ON COLUMN public.typing_hero_stats.average_reaction_time IS 'Average reaction time across all correct words in milliseconds.';
COMMENT ON COLUMN public.typing_hero_stats.vocabulary_strengths IS 'Array of vocabulary areas where the user performs well as JSONB.';
COMMENT ON COLUMN public.typing_hero_stats.vocabulary_weaknesses IS 'Array of vocabulary areas where the user needs improvement as JSONB.';

-- Table Triggers

create trigger update_typing_hero_stats_updated_at before
update
    on
    public.typing_hero_stats for each row execute function update_typing_hero_stats_updated_at();
create trigger trigger_update_leaderboard_on_typing_hero after
insert
    or
update
    on
    public.typing_hero_stats for each row execute function trigger_update_leaderboard_score();


-- public.ultimate_sessions definition

-- Drop table

-- DROP TABLE public.ultimate_sessions;

CREATE TABLE public.ultimate_sessions (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	started_at timestamptz DEFAULT now() NULL,
	finished_at timestamptz NULL,
	duration_ms int4 NULL,
	smart int4 NULL,
	motivated int4 NULL,
	"integrity" int4 NULL,
	business int4 NULL,
	platinum_choices int4 NULL,
	gold_choices int4 NULL,
	bronze_choices int4 NULL,
	nightmare_choices int4 NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	tier text NULL,
	tier_recommendation text NULL,
	client_value text NULL,
	team_morale int4 NULL,
	client_trust int4 NULL,
	business_impact int4 NULL,
	crisis_pressure int4 NULL,
	key_strengths jsonb NULL,
	development_areas jsonb NULL,
	player_name text NULL,
	avatar text NULL,
	CONSTRAINT ultimate_sessions_pkey PRIMARY KEY (id),
	CONSTRAINT ultimate_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_ultimate_sessions_started ON public.ultimate_sessions USING btree (started_at);
CREATE INDEX idx_ultimate_sessions_user ON public.ultimate_sessions USING btree (user_id);

-- Table Triggers

create trigger update_ultimate_sessions_updated_at before
update
    on
    public.ultimate_sessions for each row execute function update_updated_at_column();


-- public.ultimate_stats definition

-- Drop table

-- DROP TABLE public.ultimate_stats;

CREATE TABLE public.ultimate_stats (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	total_sessions int4 DEFAULT 0 NOT NULL,
	last_taken_at timestamptz NULL,
	smart int4 NULL,
	motivated int4 NULL,
	"integrity" int4 NULL,
	business int4 NULL,
	platinum_choices int4 NULL,
	gold_choices int4 NULL,
	bronze_choices int4 NULL,
	nightmare_choices int4 NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	last_tier text NULL,
	last_recommendation text NULL,
	last_client_value text NULL,
	latest_competencies jsonb NULL,
	key_strengths jsonb NULL,
	development_areas jsonb NULL,
	CONSTRAINT ultimate_stats_pkey PRIMARY KEY (id),
	CONSTRAINT ultimate_stats_user_id_key UNIQUE (user_id),
	CONSTRAINT ultimate_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_ultimate_stats_user ON public.ultimate_stats USING btree (user_id);

-- Table Triggers

create trigger update_ultimate_stats_updated_at before
update
    on
    public.ultimate_stats for each row execute function update_updated_at_column();


-- public.user_leaderboard_scores definition

-- Drop table

-- DROP TABLE public.user_leaderboard_scores;

CREATE TABLE public.user_leaderboard_scores (
	user_id uuid NOT NULL,
	typing_hero_score int4 DEFAULT 0 NOT NULL,
	disc_personality_score int4 DEFAULT 0 NOT NULL,
	profile_completion_score int4 DEFAULT 0 NOT NULL,
	resume_building_score int4 DEFAULT 0 NOT NULL,
	application_activity_score int4 DEFAULT 0 NOT NULL,
	overall_score int4 DEFAULT 0 NOT NULL,
	tier text DEFAULT 'Bronze'::text NOT NULL,
	rank_position int4 DEFAULT 0 NOT NULL,
	metrics jsonb DEFAULT '{}'::jsonb NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	last_activity_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT user_leaderboard_scores_application_activity_score_check CHECK (((application_activity_score >= 0) AND (application_activity_score <= 100))),
	CONSTRAINT user_leaderboard_scores_disc_personality_score_check CHECK (((disc_personality_score >= 0) AND (disc_personality_score <= 100))),
	CONSTRAINT user_leaderboard_scores_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100))),
	CONSTRAINT user_leaderboard_scores_pkey PRIMARY KEY (user_id),
	CONSTRAINT user_leaderboard_scores_profile_completion_score_check CHECK (((profile_completion_score >= 0) AND (profile_completion_score <= 100))),
	CONSTRAINT user_leaderboard_scores_resume_building_score_check CHECK (((resume_building_score >= 0) AND (resume_building_score <= 100))),
	CONSTRAINT user_leaderboard_scores_tier_check CHECK ((tier = ANY (ARRAY['Bronze'::text, 'Silver'::text, 'Gold'::text, 'Platinum'::text, 'Diamond'::text]))),
	CONSTRAINT user_leaderboard_scores_typing_hero_score_check CHECK (((typing_hero_score >= 0) AND (typing_hero_score <= 100))),
	CONSTRAINT user_leaderboard_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_leaderboard_disc ON public.user_leaderboard_scores USING btree (disc_personality_score DESC);
CREATE INDEX idx_user_leaderboard_metrics ON public.user_leaderboard_scores USING gin (metrics);
CREATE INDEX idx_user_leaderboard_overall_score ON public.user_leaderboard_scores USING btree (overall_score DESC);
CREATE INDEX idx_user_leaderboard_rank ON public.user_leaderboard_scores USING btree (rank_position);
CREATE INDEX idx_user_leaderboard_tier ON public.user_leaderboard_scores USING btree (tier);
CREATE INDEX idx_user_leaderboard_typing ON public.user_leaderboard_scores USING btree (typing_hero_score DESC);
CREATE INDEX idx_user_leaderboard_updated ON public.user_leaderboard_scores USING btree (updated_at DESC);
COMMENT ON TABLE public.user_leaderboard_scores IS 'Unified leaderboard scoring system based on typing hero, DISC personality, profile completion, resume building, and job applications';


-- public.user_work_status definition

-- Drop table

-- DROP TABLE public.user_work_status;

CREATE TABLE public.user_work_status (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	current_employer text NULL,
	current_position text NULL,
	current_salary numeric(12, 2) NULL,
	notice_period_days int4 NULL,
	current_mood public."mood_enum" NULL,
	work_status public."work_status_enum" NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	preferred_shift public."shift_enum" NULL,
	expected_salary text NULL,
	work_setup public."work_setup_enum" NULL,
	completed_data bool DEFAULT false NULL,
	work_status_new public."work_status_enum_new" NULL,
	minimum_salary_range numeric(12, 2) NULL, -- Minimum salary range for expected salary
	maximum_salary_range numeric(12, 2) NULL, -- Maximum salary range for expected salary
	CONSTRAINT user_work_status_pkey PRIMARY KEY (id),
	CONSTRAINT user_work_status_salary_range_check CHECK (((minimum_salary_range IS NULL) OR (maximum_salary_range IS NULL) OR (minimum_salary_range <= maximum_salary_range))),
	CONSTRAINT user_work_status_user_uidx UNIQUE (user_id),
	CONSTRAINT user_work_status_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX user_work_status_user_idx ON public.user_work_status USING btree (user_id);

-- Column comments

COMMENT ON COLUMN public.user_work_status.minimum_salary_range IS 'Minimum salary range for expected salary';
COMMENT ON COLUMN public.user_work_status.maximum_salary_range IS 'Maximum salary range for expected salary';

-- Table Triggers

create trigger user_work_status_updated_at before
update
    on
    public.user_work_status for each row execute function update_updated_at_column();
create trigger trigger_update_leaderboard_on_work_status after
insert
    or
update
    of completed_data on
    public.user_work_status for each row execute function trigger_update_leaderboard_score();


-- public.ai_analysis_results definition

-- Drop table

-- DROP TABLE public.ai_analysis_results;

CREATE TABLE public.ai_analysis_results (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	session_id text NOT NULL,
	original_resume_id uuid NULL,
	overall_score int4 NOT NULL, -- Overall resume quality score (0-100)
	ats_compatibility_score int4 NOT NULL,
	content_quality_score int4 NOT NULL,
	professional_presentation_score int4 NOT NULL,
	skills_alignment_score int4 NOT NULL,
	key_strengths jsonb NOT NULL, -- Array of key strengths identified by AI
	strengths_analysis jsonb NOT NULL, -- Detailed breakdown of strengths (core, technical, soft skills, achievements, market advantage)
	improvements jsonb NOT NULL, -- Array of specific improvement suggestions
	recommendations jsonb NOT NULL, -- Array of actionable recommendations
	improved_summary text NOT NULL, -- AI-generated improved professional summary
	salary_analysis jsonb NOT NULL, -- Complete salary analysis including level, range, factors, and negotiation tips
	career_path jsonb NOT NULL, -- Career path analysis including current position, next steps, skill gaps, and timeline
	section_analysis jsonb NOT NULL, -- Detailed analysis of each resume section (contact, summary, experience, education, skills)
	analysis_metadata jsonb NULL, -- Additional metadata about the analysis process
	portfolio_links jsonb NULL, -- Portfolio links that were considered in the analysis
	files_analyzed jsonb NULL, -- Information about the files that were analyzed
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	candidate_profile jsonb NULL,
	skills_snapshot jsonb NULL,
	experience_snapshot jsonb NULL,
	education_snapshot jsonb NULL,
	CONSTRAINT ai_analysis_results_ats_compatibility_score_check CHECK (((ats_compatibility_score >= 0) AND (ats_compatibility_score <= 100))),
	CONSTRAINT ai_analysis_results_content_quality_score_check CHECK (((content_quality_score >= 0) AND (content_quality_score <= 100))),
	CONSTRAINT ai_analysis_results_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100))),
	CONSTRAINT ai_analysis_results_pkey PRIMARY KEY (id),
	CONSTRAINT ai_analysis_results_professional_presentation_score_check CHECK (((professional_presentation_score >= 0) AND (professional_presentation_score <= 100))),
	CONSTRAINT ai_analysis_results_skills_alignment_score_check CHECK (((skills_alignment_score >= 0) AND (skills_alignment_score <= 100))),
	CONSTRAINT ai_analysis_results_user_id_key UNIQUE (user_id),
	CONSTRAINT ai_analysis_results_original_resume_id_fkey FOREIGN KEY (original_resume_id) REFERENCES public.resumes_extracted(id) ON DELETE SET NULL,
	CONSTRAINT ai_analysis_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_ai_analysis_results_created_at ON public.ai_analysis_results USING btree (created_at);
CREATE INDEX idx_ai_analysis_results_original_resume_id ON public.ai_analysis_results USING btree (original_resume_id);
CREATE INDEX idx_ai_analysis_results_overall_score ON public.ai_analysis_results USING btree (overall_score);
CREATE INDEX idx_ai_analysis_results_session_id ON public.ai_analysis_results USING btree (session_id);
CREATE INDEX idx_ai_analysis_results_user_id ON public.ai_analysis_results USING btree (user_id);
COMMENT ON TABLE public.ai_analysis_results IS 'Stores comprehensive AI analysis results from resume processing';

-- Column comments

COMMENT ON COLUMN public.ai_analysis_results.overall_score IS 'Overall resume quality score (0-100)';
COMMENT ON COLUMN public.ai_analysis_results.key_strengths IS 'Array of key strengths identified by AI';
COMMENT ON COLUMN public.ai_analysis_results.strengths_analysis IS 'Detailed breakdown of strengths (core, technical, soft skills, achievements, market advantage)';
COMMENT ON COLUMN public.ai_analysis_results.improvements IS 'Array of specific improvement suggestions';
COMMENT ON COLUMN public.ai_analysis_results.recommendations IS 'Array of actionable recommendations';
COMMENT ON COLUMN public.ai_analysis_results.improved_summary IS 'AI-generated improved professional summary';
COMMENT ON COLUMN public.ai_analysis_results.salary_analysis IS 'Complete salary analysis including level, range, factors, and negotiation tips';
COMMENT ON COLUMN public.ai_analysis_results.career_path IS 'Career path analysis including current position, next steps, skill gaps, and timeline';
COMMENT ON COLUMN public.ai_analysis_results.section_analysis IS 'Detailed analysis of each resume section (contact, summary, experience, education, skills)';
COMMENT ON COLUMN public.ai_analysis_results.analysis_metadata IS 'Additional metadata about the analysis process';
COMMENT ON COLUMN public.ai_analysis_results.portfolio_links IS 'Portfolio links that were considered in the analysis';
COMMENT ON COLUMN public.ai_analysis_results.files_analyzed IS 'Information about the files that were analyzed';

-- Table Triggers

create trigger update_ai_analysis_results_updated_at before
update
    on
    public.ai_analysis_results for each row execute function update_updated_at_column();
create trigger trigger_update_leaderboard_on_resume after
insert
    or
update
    of overall_score on
    public.ai_analysis_results for each row execute function trigger_update_leaderboard_score();


-- public.applications definition

-- Drop table

-- DROP TABLE public.applications;

CREATE TABLE public.applications (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	job_id int8 NOT NULL,
	resume_id uuid NOT NULL,
	resume_slug text NOT NULL,
	status public."application_status_enum" DEFAULT 'submitted'::application_status_enum NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	"position" int4 DEFAULT 0 NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT applications_pkey PRIMARY KEY (id),
	CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.processed_job_requests(id) ON DELETE CASCADE,
	CONSTRAINT applications_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.saved_resumes(id) ON DELETE RESTRICT,
	CONSTRAINT applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX applications_job_idx ON public.applications USING btree (job_id);
CREATE INDEX applications_status_idx ON public.applications USING btree (status);
CREATE INDEX applications_user_idx ON public.applications USING btree (user_id);
CREATE UNIQUE INDEX applications_user_job_uidx ON public.applications USING btree (user_id, job_id);
CREATE INDEX idx_applications_created_at ON public.applications USING btree (created_at);
CREATE INDEX idx_applications_user_job_status ON public.applications USING btree (user_id, job_id, status);

-- Table Triggers

create trigger applications_after_insert_inc_applicants after
insert
    on
    public.applications for each row execute function applications__inc_job_applicants();
create trigger update_applications_updated_at before
update
    on
    public.applications for each row execute function update_applications_updated_at();
create trigger applications_notify_status_changes after
update
    on
    public.applications for each row execute function notify_job_status_change();
create trigger trigger_update_leaderboard_on_applications after
insert
    or
update
    of status on
    public.applications for each row execute function trigger_update_leaderboard_score();


-- public.bpoc_cultural_results definition

-- Drop table

-- DROP TABLE public.bpoc_cultural_results;

CREATE TABLE public.bpoc_cultural_results (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	session_id uuid NULL,
	model_provider text DEFAULT 'anthropic'::text NOT NULL,
	model_version text NOT NULL,
	prompt text NULL,
	result_json jsonb DEFAULT '{}'::jsonb NOT NULL,
	summary_text text NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT bpoc_cultural_results_pkey PRIMARY KEY (id),
	CONSTRAINT uq_bpoc_cultural_results_user UNIQUE (user_id),
	CONSTRAINT bpoc_cultural_results_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.bpoc_cultural_sessions(id) ON DELETE SET NULL,
	CONSTRAINT bpoc_cultural_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_bpoc_cultural_results_user_created ON public.bpoc_cultural_results USING btree (user_id, created_at DESC);


-- public.job_request_comments definition

-- Drop table

-- DROP TABLE public.job_request_comments;

CREATE TABLE public.job_request_comments (
	id serial4 NOT NULL,
	job_request_id int4 NOT NULL,
	user_id uuid NOT NULL,
	"comment" text NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT job_request_comments_pkey PRIMARY KEY (id),
	CONSTRAINT job_request_comments_job_request_id_fkey FOREIGN KEY (job_request_id) REFERENCES public.job_requests(id) ON DELETE CASCADE
);
CREATE INDEX idx_job_request_comments_job_request_id ON public.job_request_comments USING btree (job_request_id);


-- public.recruiter_applications definition

-- Drop table

-- DROP TABLE public.recruiter_applications;

CREATE TABLE public.recruiter_applications (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	job_id uuid NOT NULL,
	resume_id uuid NOT NULL,
	resume_slug text NOT NULL,
	status text DEFAULT 'submitted'::text NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NULL,
	CONSTRAINT recruiter_applications_pkey PRIMARY KEY (id),
	CONSTRAINT recruiter_applications_user_job_uidx UNIQUE (user_id, job_id),
	CONSTRAINT recruiter_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.recruiter_jobs(id) ON DELETE CASCADE,
	CONSTRAINT recruiter_applications_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.saved_resumes(id) ON DELETE RESTRICT,
	CONSTRAINT recruiter_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- public.v_user_complete_data source

CREATE OR REPLACE VIEW public.v_user_complete_data
AS SELECT u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.full_name,
    u.location,
    u.avatar_url,
    u.phone,
    u.bio,
    u."position",
    u.gender,
    u.gender_custom,
    u.admin_level,
    u.completed_data,
    u.birthday,
    u.slug,
    u.username,
    u.location_place_id,
    u.location_lat,
    u.location_lng,
    u.location_city,
    u.location_province,
    u.location_country,
    u.location_barangay,
    u.location_region,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    uws.id AS work_status_id,
    uws.user_id AS work_status_user_id,
    uws.current_employer,
    uws.current_position,
    uws.current_salary,
    uws.notice_period_days,
    uws.current_mood,
    uws.work_status,
    uws.preferred_shift,
    uws.expected_salary,
    uws.work_setup,
    uws.completed_data AS work_status_completed,
    uws.created_at AS work_status_created_at,
    uws.updated_at AS work_status_updated_at,
    aar.id AS analysis_id,
    aar.user_id AS analysis_user_id,
    aar.session_id,
    aar.original_resume_id,
    aar.overall_score,
    aar.ats_compatibility_score,
    aar.content_quality_score,
    aar.professional_presentation_score,
    aar.skills_alignment_score,
    aar.key_strengths,
    aar.strengths_analysis,
    aar.improvements,
    aar.recommendations,
    aar.improved_summary,
    aar.salary_analysis,
    aar.career_path,
    aar.section_analysis,
    aar.analysis_metadata,
    aar.portfolio_links,
    aar.files_analyzed,
    aar.candidate_profile,
    aar.skills_snapshot,
    aar.experience_snapshot,
    aar.education_snapshot,
    aar.created_at AS analysis_created_at,
    aar.updated_at AS analysis_updated_at,
    dps.id AS disc_personality_stats_id,
    dps.user_id AS disc_personality_user_id,
    dps.created_at AS disc_created_at,
    dps.updated_at AS disc_updated_at,
    dps.total_sessions AS disc_total_sessions,
    dps.completed_sessions AS disc_completed_sessions,
    dps.last_taken_at AS disc_last_taken_at,
    dps.latest_d_score,
    dps.latest_i_score,
    dps.latest_s_score,
    dps.latest_c_score,
    dps.latest_primary_type AS disc_primary_type,
    dps.latest_secondary_type AS disc_secondary_type,
    dps.best_confidence_score AS disc_confidence_score,
    dps.average_completion_time AS disc_completion_time,
    dps.consistency_trend AS disc_consistency_trend,
    dps.latest_ai_assessment AS disc_ai_assessment,
    dps.latest_bpo_roles AS disc_bpo_roles,
    dps.percentile AS disc_percentile,
    dps.total_xp AS disc_total_xp,
    dps.badges_earned AS disc_badges_earned,
    dps.cultural_alignment_score AS disc_cultural_alignment_score,
    dps.authenticity_score AS disc_authenticity_score,
    dps.latest_session_xp AS disc_latest_session_xp,
    ths.id AS typing_hero_stats_id,
    ths.user_id AS typing_hero_user_id,
    ths.created_at AS typing_created_at,
    ths.updated_at AS typing_updated_at,
    ths.total_sessions AS typing_total_sessions,
    ths.completed_sessions AS typing_completed_sessions,
    ths.last_played_at AS typing_last_played_at,
    ths.best_score AS typing_best_score,
    ths.best_wpm AS typing_best_wpm,
    ths.best_accuracy AS typing_best_accuracy,
    ths.best_streak AS typing_best_streak,
    ths.latest_score AS typing_latest_score,
    ths.latest_wpm AS typing_latest_wpm,
    ths.latest_accuracy AS typing_latest_accuracy,
    ths.latest_difficulty AS typing_latest_difficulty,
    ths.avg_wpm AS typing_avg_wpm,
    ths.avg_accuracy AS typing_avg_accuracy,
    ths.total_play_time AS typing_total_play_time,
    ths.ai_analysis AS typing_ai_analysis,
    ths.total_words_correct AS typing_total_words_correct,
    ths.total_words_incorrect AS typing_total_words_incorrect,
    ths.most_common_correct_words AS typing_most_common_correct_words,
    ths.most_common_incorrect_words AS typing_most_common_incorrect_words,
    ths.average_reaction_time AS typing_average_reaction_time,
    ths.vocabulary_strengths AS typing_vocabulary_strengths,
    ths.vocabulary_weaknesses AS typing_vocabulary_weaknesses,
    ths.generated_story AS typing_generated_story
   FROM users u
     LEFT JOIN user_work_status uws ON u.id = uws.user_id
     LEFT JOIN ai_analysis_results aar ON u.id = aar.user_id
     LEFT JOIN disc_personality_stats dps ON u.id = dps.user_id
     LEFT JOIN typing_hero_stats ths ON u.id = ths.user_id;

COMMENT ON VIEW public.v_user_complete_data IS 'Complete user data view with ALL columns from users, work status, AI analysis, DISC personality stats (including XP, badges, cultural alignment), and typing hero stats (including generated story) for comprehensive public API consumption.';



-- DROP FUNCTION public.applications__inc_job_applicants();

CREATE OR REPLACE FUNCTION public.applications__inc_job_applicants()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only increment when a brand-new application row is inserted
  UPDATE processed_job_requests
     SET applicants = COALESCE(applicants, 0) + 1
   WHERE id = NEW.job_id;
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.armor(bytea, _text, _text);

CREATE OR REPLACE FUNCTION public.armor(bytea, text[], text[])
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- DROP FUNCTION public.armor(bytea);

CREATE OR REPLACE FUNCTION public.armor(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- DROP FUNCTION public.calculate_user_leaderboard_score(uuid);

CREATE OR REPLACE FUNCTION public.calculate_user_leaderboard_score(p_user_id uuid)
 RETURNS TABLE(typing_score integer, disc_score integer, profile_score integer, resume_score integer, application_score integer, overall integer, tier_name text, detailed_metrics jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_typing_score INTEGER := 0;
    v_disc_score INTEGER := 0;
    v_profile_score INTEGER := 0;
    v_resume_score INTEGER := 0;
    v_application_score INTEGER := 0;
    v_overall_score INTEGER := 0;
    v_tier TEXT := 'Bronze';
    v_metrics JSONB := '{}'::jsonb;
    
    -- Typing Hero variables
    v_typing_best_wpm INTEGER;
    v_typing_best_accuracy NUMERIC;
    v_typing_avg_wpm NUMERIC;
    v_typing_sessions INTEGER;
    
    -- DISC Personality variables
    v_disc_confidence INTEGER;
    v_disc_completed INTEGER;
    v_disc_primary_type TEXT;
    
    -- Profile completion variables
    v_profile_completed BOOLEAN;
    v_work_status_completed BOOLEAN;
    v_has_avatar BOOLEAN;
    v_has_bio BOOLEAN;
    v_has_location BOOLEAN;
    
    -- Resume variables
    v_resume_overall_score INTEGER;
    v_has_resume BOOLEAN;
    
    -- Application variables
    v_total_applications INTEGER;
    v_active_applications INTEGER;
    v_hired_count INTEGER;
    v_passed_count INTEGER;
BEGIN
    -- =====================================================
    -- 1. TYPING HERO SCORE (0-100)
    -- =====================================================
    -- Scoring: 40% best WPM, 30% accuracy, 20% avg WPM, 10% consistency (sessions)
    SELECT 
        ths.best_wpm,
        ths.best_accuracy,
        ths.avg_wpm,
        ths.completed_sessions
    INTO v_typing_best_wpm, v_typing_best_accuracy, v_typing_avg_wpm, v_typing_sessions
    FROM typing_hero_stats ths
    WHERE ths.user_id = p_user_id;
    
    IF v_typing_best_wpm IS NOT NULL THEN
        -- WPM Score: 0 at 0 WPM, 100 at 100+ WPM
        v_typing_score := LEAST(100, (
            (LEAST(v_typing_best_wpm, 100)::NUMERIC / 100.0 * 40) +  -- 40% weight
            (COALESCE(v_typing_best_accuracy, 0) / 100.0 * 30) +      -- 30% weight
            (LEAST(COALESCE(v_typing_avg_wpm, 0), 100)::NUMERIC / 100.0 * 20) +  -- 20% weight
            (LEAST(v_typing_sessions, 10)::NUMERIC / 10.0 * 10)       -- 10% weight
        ))::INTEGER;
    END IF;
    
    -- =====================================================
    -- 2. DISC PERSONALITY SCORE (0-100)
    -- =====================================================
    -- Scoring: 50% confidence, 30% completion, 20% engagement
    SELECT 
        dps.best_confidence_score,
        dps.completed_sessions,
        dps.latest_primary_type
    INTO v_disc_confidence, v_disc_completed, v_disc_primary_type
    FROM disc_personality_stats dps
    WHERE dps.user_id = p_user_id;
    
    IF v_disc_confidence IS NOT NULL THEN
        v_disc_score := (
            (COALESCE(v_disc_confidence, 0) * 0.5) +                  -- 50% weight
            (LEAST(v_disc_completed, 3)::NUMERIC / 3.0 * 30) +        -- 30% weight (cap at 3 sessions)
            (CASE WHEN v_disc_primary_type IS NOT NULL THEN 20 ELSE 0 END)  -- 20% weight
        )::INTEGER;
    END IF;
    
    -- =====================================================
    -- 3. PROFILE COMPLETION SCORE (0-100)
    -- =====================================================
    -- Scoring: All sections weighted
    SELECT 
        u.completed_data,
        uws.completed_data,
        u.avatar_url IS NOT NULL,
        u.bio IS NOT NULL AND length(u.bio) > 20,
        u.location IS NOT NULL
    INTO v_profile_completed, v_work_status_completed, v_has_avatar, v_has_bio, v_has_location
    FROM users u
    LEFT JOIN user_work_status uws ON u.id = uws.user_id
    WHERE u.id = p_user_id;
    
    v_profile_score := (
        (CASE WHEN v_profile_completed THEN 30 ELSE 0 END) +          -- Personal data: 30%
        (CASE WHEN v_work_status_completed THEN 30 ELSE 0 END) +      -- Work status: 30%
        (CASE WHEN v_has_avatar THEN 15 ELSE 0 END) +                 -- Avatar: 15%
        (CASE WHEN v_has_bio THEN 15 ELSE 0 END) +                    -- Bio: 15%
        (CASE WHEN v_has_location THEN 10 ELSE 0 END)                 -- Location: 10%
    )::INTEGER;
    
    -- =====================================================
    -- 4. RESUME BUILDING SCORE (0-100)
    -- =====================================================
    -- Scoring: Resume quality + having saved resume
    SELECT 
        aar.overall_score,
        EXISTS(SELECT 1 FROM saved_resumes sr WHERE sr.user_id = p_user_id)
    INTO v_resume_overall_score, v_has_resume
    FROM ai_analysis_results aar
    WHERE aar.user_id = p_user_id;
    
    IF v_resume_overall_score IS NOT NULL THEN
        v_resume_score := (
            (v_resume_overall_score * 0.7) +                           -- AI score: 70%
            (CASE WHEN v_has_resume THEN 30 ELSE 0 END)               -- Has saved resume: 30%
        )::INTEGER;
    ELSIF v_has_resume THEN
        v_resume_score := 30; -- At least they have a resume
    END IF;
    
    -- =====================================================
    -- 5. APPLICATION ACTIVITY SCORE (0-100)
    -- =====================================================
    -- Scoring: Based on quantity and quality of applications
    SELECT 
        COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE status IN ('submitted', 'qualified', 'for verification', 'verified', 'initial interview', 'final interview'))::INTEGER,
        COUNT(*) FILTER (WHERE status = 'hired')::INTEGER,
        COUNT(*) FILTER (WHERE status = 'passed')::INTEGER
    INTO v_total_applications, v_active_applications, v_hired_count, v_passed_count
    FROM applications
    WHERE user_id = p_user_id;
    
    IF v_total_applications > 0 THEN
        v_application_score := LEAST(100, (
            (LEAST(v_total_applications, 20)::NUMERIC / 20.0 * 40) +  -- Total apps: 40% (cap at 20)
            (LEAST(v_active_applications, 10)::NUMERIC / 10.0 * 30) + -- Active apps: 30% (cap at 10)
            (v_hired_count * 20) +                                     -- Each hire: 20 points
            (v_passed_count * 10)                                      -- Each pass: 10 points
        ))::INTEGER;
    END IF;
    
    -- =====================================================
    -- 6. CALCULATE OVERALL SCORE (Weighted Average)
    -- =====================================================
    -- Weights: Typing 25%, DISC 25%, Profile 15%, Resume 20%, Applications 15%
    v_overall_score := (
        (v_typing_score * 0.25) +
        (v_disc_score * 0.25) +
        (v_profile_score * 0.15) +
        (v_resume_score * 0.20) +
        (v_application_score * 0.15)
    )::INTEGER;
    
    -- =====================================================
    -- 7. DETERMINE TIER
    -- =====================================================
    v_tier := CASE 
        WHEN v_overall_score >= 90 THEN 'Diamond'
        WHEN v_overall_score >= 75 THEN 'Platinum'
        WHEN v_overall_score >= 60 THEN 'Gold'
        WHEN v_overall_score >= 40 THEN 'Silver'
        ELSE 'Bronze'
    END;
    
    -- =====================================================
    -- 8. BUILD DETAILED METRICS JSON
    -- =====================================================
    v_metrics := jsonb_build_object(
        'typing_hero', jsonb_build_object(
            'best_wpm', v_typing_best_wpm,
            'best_accuracy', v_typing_best_accuracy,
            'avg_wpm', v_typing_avg_wpm,
            'sessions', v_typing_sessions,
            'score', v_typing_score
        ),
        'disc_personality', jsonb_build_object(
            'confidence', v_disc_confidence,
            'completed_sessions', v_disc_completed,
            'primary_type', v_disc_primary_type,
            'score', v_disc_score
        ),
        'profile_completion', jsonb_build_object(
            'personal_data', v_profile_completed,
            'work_status', v_work_status_completed,
            'has_avatar', v_has_avatar,
            'has_bio', v_has_bio,
            'has_location', v_has_location,
            'score', v_profile_score
        ),
        'resume_building', jsonb_build_object(
            'ai_score', v_resume_overall_score,
            'has_saved_resume', v_has_resume,
            'score', v_resume_score
        ),
        'applications', jsonb_build_object(
            'total', v_total_applications,
            'active', v_active_applications,
            'hired', v_hired_count,
            'passed', v_passed_count,
            'score', v_application_score
        ),
        'weights', jsonb_build_object(
            'typing_hero', '25%',
            'disc_personality', '25%',
            'profile_completion', '15%',
            'resume_building', '20%',
            'applications', '15%'
        )
    );
    
    -- Return calculated values
    RETURN QUERY SELECT 
        v_typing_score,
        v_disc_score,
        v_profile_score,
        v_resume_score,
        v_application_score,
        v_overall_score,
        v_tier,
        v_metrics;
END;
$function$
;

COMMENT ON FUNCTION public.calculate_user_leaderboard_score(uuid) IS 'Calculates comprehensive leaderboard score for a user based on typing hero, DISC personality, profile completion, resume building, and applications';

-- DROP FUNCTION public.compute_user_slug(text, uuid);

CREATE OR REPLACE FUNCTION public.compute_user_slug(p_username text, p_id uuid)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  -- If username is provided, use it directly (already unique)
  -- If no username, fallback to a simple user-{last4} format
  SELECT CASE 
    WHEN p_username IS NOT NULL AND trim(p_username) != '' THEN 
      public.slugify_text(p_username)
    ELSE 
      concat('user-', right(translate(p_id::text, '-', ''), 4))
  END;
$function$
;

-- DROP FUNCTION public.compute_user_slug(text, text, uuid);

CREATE OR REPLACE FUNCTION public.compute_user_slug(p_first text, p_last text, p_id uuid)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT concat_ws('-',
           nullif(public.slugify_text(p_first), ''),
           nullif(public.slugify_text(p_last), ''),
           right(translate(p_id::text, '-', ''), 4)
         );
$function$
;

-- DROP FUNCTION public.crypt(text, text);

CREATE OR REPLACE FUNCTION public.crypt(text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_crypt$function$
;

-- DROP FUNCTION public.dearmor(text);

CREATE OR REPLACE FUNCTION public.dearmor(text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_dearmor$function$
;

-- DROP FUNCTION public.decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt$function$
;

-- DROP FUNCTION public.decrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt_iv$function$
;

-- DROP FUNCTION public.digest(text, text);

CREATE OR REPLACE FUNCTION public.digest(text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- DROP FUNCTION public.digest(bytea, text);

CREATE OR REPLACE FUNCTION public.digest(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- DROP FUNCTION public.encrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt$function$
;

-- DROP FUNCTION public.encrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt_iv$function$
;

-- DROP FUNCTION public.gen_random_bytes(int4);

CREATE OR REPLACE FUNCTION public.gen_random_bytes(integer)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_random_bytes$function$
;

-- DROP FUNCTION public.gen_random_uuid();

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/pgcrypto', $function$pg_random_uuid$function$
;

-- DROP FUNCTION public.gen_salt(text, int4);

CREATE OR REPLACE FUNCTION public.gen_salt(text, integer)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt_rounds$function$
;

-- DROP FUNCTION public.gen_salt(text);

CREATE OR REPLACE FUNCTION public.gen_salt(text)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt$function$
;

-- DROP FUNCTION public.hmac(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.hmac(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- DROP FUNCTION public.hmac(text, text, text);

CREATE OR REPLACE FUNCTION public.hmac(text, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- DROP FUNCTION public.notify_job_status_change();

CREATE OR REPLACE FUNCTION public.notify_job_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Only notify when status actually changes
    IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
        PERFORM pg_notify(
            'bpoc_job_status_changes',
            json_build_object(
                'type', 'bpoc_job_status_update',
                'application_id', NEW.id,
                'user_id', NEW.user_id,
                'job_id', NEW.job_id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'timestamp', now()
            )::text
        );
        
        RAISE NOTICE 'Notification sent for job status change: % -> % (job_id: %)', 
            OLD.status, NEW.status, NEW.job_id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.pgp_armor_headers(in text, out text, out text);

CREATE OR REPLACE FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text)
 RETURNS SETOF record
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_armor_headers$function$
;

-- DROP FUNCTION public.pgp_key_id(bytea);

CREATE OR REPLACE FUNCTION public.pgp_key_id(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_key_id_w$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- DROP FUNCTION public.recalculate_leaderboard_ranks();

CREATE OR REPLACE FUNCTION public.recalculate_leaderboard_ranks()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    WITH ranked_users AS (
        SELECT 
            user_id,
            ROW_NUMBER() OVER (ORDER BY overall_score DESC, updated_at ASC) AS new_rank
        FROM user_leaderboard_scores
    )
    UPDATE user_leaderboard_scores uls
    SET rank_position = ru.new_rank
    FROM ranked_users ru
    WHERE uls.user_id = ru.user_id;
END;
$function$
;

COMMENT ON FUNCTION public.recalculate_leaderboard_ranks() IS 'Recalculates rank positions for all users in the leaderboard';

-- DROP FUNCTION public.slugify_text(text);

CREATE OR REPLACE FUNCTION public.slugify_text(input text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT trim(both '-' from lower(regexp_replace(coalesce(input, ''), '[^A-Za-z0-9]+', '-', 'g')));
$function$
;

-- DROP FUNCTION public.trigger_update_leaderboard_score();

CREATE OR REPLACE FUNCTION public.trigger_update_leaderboard_score()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update score for the affected user
    -- Handle different table structures properly
    IF TG_TABLE_NAME = 'users' THEN
        PERFORM update_user_leaderboard_score(NEW.id);
    ELSIF TG_TABLE_NAME = 'user_work_status' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'ai_analysis_results' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'applications' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'typing_hero_stats' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'disc_personality_stats' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSE
        -- Fallback: try to get user_id from the record
        PERFORM update_user_leaderboard_score(NEW.user_id);
    END IF;
    
    -- Recalculate ranks after score update
    PERFORM recalculate_leaderboard_ranks();
    
    RETURN NEW;
END;
$function$
;

COMMENT ON FUNCTION public.trigger_update_leaderboard_score() IS 'Fixed trigger function that properly handles different table structures for leaderboard score updates';

-- DROP FUNCTION public.update_all_leaderboard_scores();

CREATE OR REPLACE FUNCTION public.update_all_leaderboard_scores()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_id UUID;
    v_count INTEGER := 0;
BEGIN
    FOR v_user_id IN SELECT id FROM users LOOP
        PERFORM update_user_leaderboard_score(v_user_id);
        v_count := v_count + 1;
    END LOOP;
    
    -- Recalculate ranks after all scores updated
    PERFORM recalculate_leaderboard_ranks();
    
    RETURN v_count;
END;
$function$
;

COMMENT ON FUNCTION public.update_all_leaderboard_scores() IS 'Updates leaderboard scores for all users and recalculates ranks';

-- DROP FUNCTION public.update_applications_updated_at();

CREATE OR REPLACE FUNCTION public.update_applications_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_disc_sessions_updated_at();

CREATE OR REPLACE FUNCTION public.update_disc_sessions_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_disc_stats_updated_at();

CREATE OR REPLACE FUNCTION public.update_disc_stats_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_privacy_settings_updated_at();

CREATE OR REPLACE FUNCTION public.update_privacy_settings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_typing_hero_sessions_updated_at();

CREATE OR REPLACE FUNCTION public.update_typing_hero_sessions_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_typing_hero_stats_updated_at();

CREATE OR REPLACE FUNCTION public.update_typing_hero_stats_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

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

-- DROP FUNCTION public.update_user_leaderboard_score(uuid);

CREATE OR REPLACE FUNCTION public.update_user_leaderboard_score(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_scores RECORD;
BEGIN
    -- Calculate scores
    SELECT * INTO v_scores FROM calculate_user_leaderboard_score(p_user_id);
    
    -- Upsert into leaderboard table
    INSERT INTO user_leaderboard_scores (
        user_id,
        typing_hero_score,
        disc_personality_score,
        profile_completion_score,
        resume_building_score,
        application_activity_score,
        overall_score,
        tier,
        metrics,
        updated_at,
        last_activity_at
    ) VALUES (
        p_user_id,
        v_scores.typing_score,
        v_scores.disc_score,
        v_scores.profile_score,
        v_scores.resume_score,
        v_scores.application_score,
        v_scores.overall,
        v_scores.tier_name,
        v_scores.detailed_metrics,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        typing_hero_score = EXCLUDED.typing_hero_score,
        disc_personality_score = EXCLUDED.disc_personality_score,
        profile_completion_score = EXCLUDED.profile_completion_score,
        resume_building_score = EXCLUDED.resume_building_score,
        application_activity_score = EXCLUDED.application_activity_score,
        overall_score = EXCLUDED.overall_score,
        tier = EXCLUDED.tier,
        metrics = EXCLUDED.metrics,
        updated_at = NOW(),
        last_activity_at = NOW();
END;
$function$
;

COMMENT ON FUNCTION public.update_user_leaderboard_score(uuid) IS 'Updates leaderboard score for a specific user';

-- DROP FUNCTION public.users_set_slug_trigger();

CREATE OR REPLACE FUNCTION public.users_set_slug_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update slug when username changes, or when slug is null, or on insert
  IF NEW.slug IS NULL OR TG_OP = 'INSERT' OR NEW.username IS DISTINCT FROM OLD.username THEN
    NEW.slug := public.compute_user_slug(NEW.username, NEW.id);
  END IF;
  RETURN NEW;
END;
$function$
;