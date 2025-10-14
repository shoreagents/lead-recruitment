-- AI Analysis Results Schema for Railway Database
-- This table stores comprehensive AI analysis results from resume processing

CREATE TABLE ai_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL, -- Links to the analysis session
  original_resume_id UUID REFERENCES resumes_extracted(id) ON DELETE SET NULL,
  
  -- Overall Analysis Scores
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  ats_compatibility_score INTEGER NOT NULL CHECK (ats_compatibility_score >= 0 AND ats_compatibility_score <= 100),
  content_quality_score INTEGER NOT NULL CHECK (content_quality_score >= 0 AND content_quality_score <= 100),
  professional_presentation_score INTEGER NOT NULL CHECK (professional_presentation_score >= 0 AND professional_presentation_score <= 100),
  skills_alignment_score INTEGER NOT NULL CHECK (skills_alignment_score >= 0 AND skills_alignment_score <= 100),
  
  -- Strengths Analysis (JSONB for flexible structure)
  key_strengths JSONB NOT NULL, -- Array of key strengths
  strengths_analysis JSONB NOT NULL, -- Detailed strengths breakdown
  improvements JSONB NOT NULL, -- Array of improvement suggestions
  recommendations JSONB NOT NULL, -- Array of actionable recommendations
  
  -- Enhanced Content
  improved_summary TEXT NOT NULL, -- AI-generated improved summary
  
  -- Salary Analysis
  salary_analysis JSONB NOT NULL, -- Complete salary analysis data
  
  -- Career Path Analysis
  career_path JSONB NOT NULL, -- Complete career path data
  
  -- Section-by-Section Analysis
  section_analysis JSONB NOT NULL, -- Detailed analysis of each resume section
  
  -- Analysis Metadata
  analysis_metadata JSONB, -- Additional metadata about the analysis
  portfolio_links JSONB, -- Portfolio links used in analysis
  files_analyzed JSONB, -- Information about files analyzed

  -- Overview Snapshot (for Overview tab rendering from DB)
  candidate_profile JSONB, -- { name, email, phone, location }
  skills_snapshot JSONB, -- array of skills
  experience_snapshot JSONB, -- array of experiences
  education_snapshot JSONB, -- array of education entries
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id) -- One analysis result per user. Re-running overwrites the same row
);

-- Create indexes for better performance
CREATE INDEX idx_ai_analysis_results_user_id ON ai_analysis_results(user_id);
-- Optional index if you still want to query by session_id
CREATE INDEX idx_ai_analysis_results_session_id ON ai_analysis_results(session_id);
CREATE INDEX idx_ai_analysis_results_original_resume_id ON ai_analysis_results(original_resume_id);
CREATE INDEX idx_ai_analysis_results_created_at ON ai_analysis_results(created_at);
CREATE INDEX idx_ai_analysis_results_overall_score ON ai_analysis_results(overall_score);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ai_analysis_results_updated_at 
    BEFORE UPDATE ON ai_analysis_results
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE ai_analysis_results IS 'Stores comprehensive AI analysis results from resume processing';
COMMENT ON COLUMN ai_analysis_results.overall_score IS 'Overall resume quality score (0-100)';
COMMENT ON COLUMN ai_analysis_results.key_strengths IS 'Array of key strengths identified by AI';
COMMENT ON COLUMN ai_analysis_results.strengths_analysis IS 'Detailed breakdown of strengths (core, technical, soft skills, achievements, market advantage)';
COMMENT ON COLUMN ai_analysis_results.improvements IS 'Array of specific improvement suggestions';
COMMENT ON COLUMN ai_analysis_results.recommendations IS 'Array of actionable recommendations';
COMMENT ON COLUMN ai_analysis_results.improved_summary IS 'AI-generated improved professional summary';
COMMENT ON COLUMN ai_analysis_results.salary_analysis IS 'Complete salary analysis including level, range, factors, and negotiation tips';
COMMENT ON COLUMN ai_analysis_results.career_path IS 'Career path analysis including current position, next steps, skill gaps, and timeline';
COMMENT ON COLUMN ai_analysis_results.section_analysis IS 'Detailed analysis of each resume section (contact, summary, experience, education, skills)';
COMMENT ON COLUMN ai_analysis_results.analysis_metadata IS 'Additional metadata about the analysis process';
COMMENT ON COLUMN ai_analysis_results.portfolio_links IS 'Portfolio links that were considered in the analysis';
COMMENT ON COLUMN ai_analysis_results.files_analyzed IS 'Information about the files that were analyzed';

-- Example of the JSONB structure for strengths_analysis:
-- {
--   "coreStrengths": ["Strong communication skills", "Customer service experience"],
--   "technicalStrengths": ["Microsoft Office proficiency", "CRM systems"],
--   "softSkills": ["Teamwork", "Problem-solving"],
--   "achievements": ["Consistent performance", "Reliable attendance"],
--   "marketAdvantage": ["Philippine market knowledge", "English proficiency"]
-- }

-- Example of the JSONB structure for salary_analysis:
-- {
--   "currentLevel": "mid",
--   "recommendedSalaryRange": "PHP 20,000 - 30,000",
--   "factorsAffectingSalary": ["Experience level", "Technical skills", "Location"],
--   "negotiationTips": ["Highlight achievements", "Research market rates"]
-- }

-- Example of the JSONB structure for career_path:
-- {
--   "currentPosition": "Customer Service Representative",
--   "nextCareerSteps": [
--     {"step": "1", "title": "Team Lead", "description": "Lead small teams"},
--     {"step": "2", "title": "Quality Analyst", "description": "Monitor service quality"}
--   ],
--   "skillGaps": ["Leadership skills", "Advanced analytics"],
--   "timeline": "2-3 years for promotion",
--   "timelineDetails": "Focus on developing leadership skills and taking on additional responsibilities"
-- }

-- Example of the JSONB structure for section_analysis:
-- {
--   "contact": {"score": 80, "reasons": ["Contact info present"], "issues": [], "improvements": []},
--   "summary": {"score": 70, "reasons": ["Summary included"], "issues": ["Could be stronger"], "improvements": ["Add achievements"]},
--   "experience": {"score": 75, "reasons": ["Experience shown"], "issues": ["Missing metrics"], "improvements": ["Add numbers"]},
--   "education": {"score": 80, "reasons": ["Education listed"], "issues": [], "improvements": []},
--   "skills": {"score": 70, "reasons": ["Skills included"], "issues": ["Missing technical skills"], "improvements": ["Add industry keywords"]}
-- }
