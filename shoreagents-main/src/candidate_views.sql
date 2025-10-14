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
	interaction_type varchar(50) DEFAULT 'view'::character varying NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT candidate_views_candidate_id_check CHECK (((candidate_id IS NOT NULL) AND ((candidate_id)::text <> ''::text))),
	CONSTRAINT candidate_views_interaction_type_check CHECK (((interaction_type)::text = ANY ((ARRAY['view'::character varying, 'favorite'::character varying, 'unfavorite'::character varying, 'contact'::character varying, 'download'::character varying, 'share'::character varying, 'click'::character varying, 'ai_analysis_view'::character varying, 'profile_click'::character varying, 'skills_click'::character varying, 'experience_click'::character varying])::text[]))),
	CONSTRAINT candidate_views_page_views_check CHECK ((page_views > 0)),
	CONSTRAINT candidate_views_pkey PRIMARY KEY (id),
	CONSTRAINT candidate_views_user_id_check CHECK (((user_id IS NOT NULL) AND ((user_id)::text <> ''::text))),
	CONSTRAINT candidate_views_view_duration_check CHECK ((view_duration >= 0))
);
CREATE INDEX idx_candidate_views_candidate_created ON public.candidate_views USING btree (candidate_id, created_at);
CREATE INDEX idx_candidate_views_candidate_id ON public.candidate_views USING btree (candidate_id);
CREATE INDEX idx_candidate_views_candidate_interaction ON public.candidate_views USING btree (candidate_id, interaction_type);
CREATE INDEX idx_candidate_views_candidate_name ON public.candidate_views USING btree (candidate_name);
CREATE INDEX idx_candidate_views_created_at ON public.candidate_views USING btree (created_at);
CREATE INDEX idx_candidate_views_interaction_type ON public.candidate_views USING btree (interaction_type);
CREATE INDEX idx_candidate_views_user_created ON public.candidate_views USING btree (user_id, created_at);
CREATE INDEX idx_candidate_views_user_id ON public.candidate_views USING btree (user_id);

-- Foreign key comments

COMMENT ON CONSTRAINT candidate_views_user_id_fkey ON public.candidate_views IS 'Foreign key constraint linking candidate_views.user_id to users.user_id';

-- Table Triggers

create trigger update_candidate_views_updated_at before
update
    on
    public.candidate_views for each row execute function update_candidate_views_updated_at();


-- public.candidate_views foreign keys

ALTER TABLE public.candidate_views ADD CONSTRAINT candidate_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE;