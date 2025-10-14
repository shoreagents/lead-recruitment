-- Add sample job data to job_requests table
-- This will help populate the /recruiter/post-job page

-- First, let's check if we have any companies in the members table
-- If not, we'll need to add a sample company first

-- Insert a sample company if it doesn't exist
INSERT INTO members (company_id, company, contact_person, email, phone, address, created_at)
VALUES (
    gen_random_uuid(),
    'ShoreAgents',
    'John Smith',
    'contact@shoreagents.com',
    '+1-555-0123',
    '123 Business St, City, Country',
    NOW()
)
ON CONFLICT (company) DO NOTHING;

-- Get the company_id for ShoreAgents
-- Insert sample job requests
INSERT INTO job_requests (
    company_id,
    job_title,
    job_description,
    industry,
    department,
    work_type,
    work_arrangement,
    experience_level,
    salary_min,
    salary_max,
    currency,
    salary_type,
    status,
    priority,
    shift,
    requirements,
    responsibilities,
    benefits,
    skills,
    created_at
) VALUES 
(
    (SELECT company_id FROM members WHERE company = 'ShoreAgents' LIMIT 1),
    'Customer Service Representative',
    'We are looking for a dedicated Customer Service Representative to join our team. You will be responsible for handling customer inquiries, resolving issues, and providing excellent service.',
    'Customer Service',
    'Operations',
    'full-time',
    'remote',
    'entry-level',
    25000,
    35000,
    'PHP',
    'monthly',
    'active',
    'medium',
    'day',
    ARRAY['High school diploma or equivalent', 'Excellent communication skills', 'Basic computer skills', 'Customer service experience preferred'],
    ARRAY['Answer customer inquiries via phone and email', 'Resolve customer complaints', 'Maintain customer records', 'Escalate complex issues to supervisors'],
    ARRAY['Health insurance', 'Paid time off', 'Performance bonuses', 'Career development opportunities'],
    ARRAY['Communication', 'Problem-solving', 'Customer service', 'Computer literacy'],
    NOW()
),
(
    (SELECT company_id FROM members WHERE company = 'ShoreAgents' LIMIT 1),
    'Technical Support Specialist',
    'Join our technical support team to help customers with technical issues. You will troubleshoot problems, provide solutions, and ensure customer satisfaction.',
    'Technology',
    'Support',
    'full-time',
    'hybrid',
    'mid-level',
    30000,
    45000,
    'PHP',
    'monthly',
    'active',
    'high',
    'day',
    ARRAY['Bachelor degree in IT or related field', '2+ years technical support experience', 'Knowledge of common software and hardware', 'Strong problem-solving skills'],
    ARRAY['Diagnose technical issues', 'Provide step-by-step solutions', 'Document support tickets', 'Escalate complex technical problems'],
    ARRAY['Health insurance', 'Dental coverage', 'Flexible work hours', 'Training opportunities'],
    ARRAY['Technical troubleshooting', 'Customer service', 'Documentation', 'Communication'],
    NOW()
),
(
    (SELECT company_id FROM members WHERE company = 'ShoreAgents' LIMIT 1),
    'Sales Representative',
    'We need a motivated Sales Representative to drive revenue growth. You will identify new business opportunities, build relationships with clients, and meet sales targets.',
    'Sales',
    'Business Development',
    'full-time',
    'onsite',
    'mid-level',
    28000,
    50000,
    'PHP',
    'monthly',
    'active',
    'high',
    'day',
    ARRAY['Bachelor degree in Business or related field', '2+ years sales experience', 'Strong negotiation skills', 'Goal-oriented mindset'],
    ARRAY['Identify potential clients', 'Conduct sales presentations', 'Negotiate contracts', 'Maintain client relationships'],
    ARRAY['Commission structure', 'Health insurance', 'Company car allowance', 'Sales incentives'],
    ARRAY['Sales', 'Negotiation', 'Relationship building', 'Communication'],
    NOW()
),
(
    (SELECT company_id FROM members WHERE company = 'ShoreAgents' LIMIT 1),
    'Data Entry Specialist',
    'Looking for a detail-oriented Data Entry Specialist to maintain our database accuracy. You will input, update, and verify data across various systems.',
    'Administrative',
    'Data Management',
    'part-time',
    'remote',
    'entry-level',
    15000,
    22000,
    'PHP',
    'monthly',
    'active',
    'low',
    'day',
    ARRAY['High school diploma', 'Fast typing speed (40+ WPM)', 'Attention to detail', 'Basic Excel knowledge'],
    ARRAY['Input data into systems', 'Verify data accuracy', 'Update existing records', 'Generate reports'],
    ARRAY['Flexible schedule', 'Remote work option', 'Health insurance', 'Performance bonuses'],
    ARRAY['Data entry', 'Attention to detail', 'Excel', 'Time management'],
    NOW()
),
(
    (SELECT company_id FROM members WHERE company = 'ShoreAgents' LIMIT 1),
    'Marketing Coordinator',
    'Join our marketing team to help execute campaigns and support brand initiatives. You will assist with content creation, social media management, and campaign tracking.',
    'Marketing',
    'Marketing',
    'full-time',
    'hybrid',
    'entry-level',
    25000,
    38000,
    'PHP',
    'monthly',
    'active',
    'medium',
    'day',
    ARRAY['Bachelor degree in Marketing or related field', 'Social media experience', 'Creative thinking', 'Analytical skills'],
    ARRAY['Create marketing content', 'Manage social media accounts', 'Track campaign performance', 'Coordinate with design team'],
    ARRAY['Health insurance', 'Creative freedom', 'Professional development', 'Team events'],
    ARRAY['Marketing', 'Social media', 'Content creation', 'Analytics'],
    NOW()
);

-- Insert some processed jobs as well
INSERT INTO processed_job_requests (
    id,
    company_id,
    job_title,
    job_description,
    industry,
    department,
    work_type,
    work_arrangement,
    experience_level,
    salary_min,
    salary_max,
    currency,
    salary_type,
    status,
    priority,
    shift,
    requirements,
    responsibilities,
    benefits,
    skills,
    created_at
) VALUES 
(
    1,
    (SELECT company_id FROM members WHERE company = 'ShoreAgents' LIMIT 1),
    'Senior Software Developer',
    'We are seeking an experienced Senior Software Developer to lead our development team. You will design, develop, and maintain software applications while mentoring junior developers.',
    'Technology',
    'Engineering',
    'full-time',
    'remote',
    'senior-level',
    60000,
    80000,
    'PHP',
    'monthly',
    'active',
    'high',
    'day',
    ARRAY['Bachelor degree in Computer Science', '5+ years development experience', 'Proficiency in multiple programming languages', 'Leadership experience'],
    ARRAY['Design software architecture', 'Write clean, maintainable code', 'Mentor junior developers', 'Collaborate with cross-functional teams'],
    ARRAY['Competitive salary', 'Health insurance', 'Stock options', 'Professional development budget'],
    ARRAY['Software development', 'Leadership', 'Problem-solving', 'Team collaboration'],
    NOW() - INTERVAL '5 days'
),
(
    2,
    (SELECT company_id FROM members WHERE company = 'ShoreAgents' LIMIT 1),
    'HR Manager',
    'We need an experienced HR Manager to oversee our human resources operations. You will handle recruitment, employee relations, and policy implementation.',
    'Human Resources',
    'HR',
    'full-time',
    'onsite',
    'senior-level',
    45000,
    65000,
    'PHP',
    'monthly',
    'active',
    'high',
    'day',
    ARRAY['Bachelor degree in HR or related field', '5+ years HR experience', 'Knowledge of labor laws', 'Strong interpersonal skills'],
    ARRAY['Manage recruitment process', 'Handle employee relations', 'Implement HR policies', 'Conduct performance reviews'],
    ARRAY['Health insurance', 'Dental coverage', 'Retirement plan', 'Professional development'],
    ARRAY['Human resources', 'Recruitment', 'Employee relations', 'Policy development'],
    NOW() - INTERVAL '3 days'
);

-- Update the job_requests table to mark some jobs as processed
UPDATE job_requests SET status = 'processed' WHERE id IN (1, 2);

-- Verify the data was inserted
SELECT 
    'job_requests' as table_name,
    COUNT(*) as count
FROM job_requests
UNION ALL
SELECT 
    'processed_job_requests' as table_name,
    COUNT(*) as count
FROM processed_job_requests;
