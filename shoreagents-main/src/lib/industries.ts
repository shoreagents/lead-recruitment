// Focused list of specific industries for the pricing calculator
export interface Industry {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const industries: Industry[] = [
  // Core Industries - More Specific
  { id: 'real-estate', name: 'Real Estate', category: 'Property & Real Estate', description: 'Property sales, management, and development' },
  { id: 'ecommerce', name: 'E-commerce', category: 'Online Retail', description: 'Online stores, digital marketplaces, dropshipping' },
  { id: 'healthcare', name: 'Healthcare', category: 'Medical & Health', description: 'Medical practices, clinics, telemedicine' },
  { id: 'technology', name: 'Technology', category: 'Software & IT', description: 'Software development, IT services, tech startups' },
  { id: 'finance', name: 'Finance', category: 'Financial Services', description: 'Banking, investment, insurance, accounting' },
  { id: 'marketing', name: 'Marketing', category: 'Marketing & Advertising', description: 'Digital marketing, advertising agencies, PR' },
  { id: 'education', name: 'Education', category: 'Learning & Training', description: 'Online education, training, e-learning platforms' },
  { id: 'legal', name: 'Legal', category: 'Legal Services', description: 'Law firms, legal consulting, compliance' },
  { id: 'construction', name: 'Construction', category: 'Building & Development', description: 'Construction companies, contractors, developers' },
  { id: 'manufacturing', name: 'Manufacturing', category: 'Production & Manufacturing', description: 'Product manufacturing, assembly, production' },
  { id: 'retail', name: 'Retail', category: 'Physical Retail', description: 'Brick-and-mortar stores, retail chains' },
  { id: 'hospitality', name: 'Hospitality', category: 'Travel & Hospitality', description: 'Hotels, restaurants, travel services' },
  { id: 'logistics', name: 'Logistics', category: 'Transportation & Logistics', description: 'Shipping, warehousing, supply chain' },
  { id: 'consulting', name: 'Consulting', category: 'Professional Services', description: 'Business consulting, management consulting' },
  { id: 'media', name: 'Media', category: 'Media & Entertainment', description: 'Publishing, broadcasting, content creation' },
  { id: 'nonprofit', name: 'Non-Profit', category: 'Non-Profit & Government', description: 'Charities, foundations, government agencies' },
  { id: 'other', name: 'Other', category: 'Other', description: 'Other industries not listed' }
];

// Helper function to search industries
export const searchIndustries = (query: string): Industry[] => {
  if (!query.trim()) return industries;
  
  const lowercaseQuery = query.toLowerCase();
  return industries.filter(industry => 
    industry.name.toLowerCase().includes(lowercaseQuery) ||
    industry.category.toLowerCase().includes(lowercaseQuery) ||
    industry.description?.toLowerCase().includes(lowercaseQuery)
  );
};

// Helper function to get industries by category
export const getIndustriesByCategory = (category: string): Industry[] => {
  return industries.filter(industry => industry.category === category);
};

// Helper function to get all categories
export const getCategories = (): string[] => {
  return [...new Set(industries.map(industry => industry.category))];
};

// Industry-specific role suggestions
export interface RoleSuggestion {
  id: string;
  title: string;
  description: string;
  level: 'entry' | 'mid' | 'senior';
}

export const industryRoleSuggestions: Record<string, RoleSuggestion[]> = {
  'real-estate': [
    { id: 're-va', title: 'Real Estate Virtual Assistant', description: 'Lead generation, CRM management, listing support', level: 'entry' },
    { id: 're-admin', title: 'Real Estate Administrative Assistant', description: 'Document processing, scheduling, client communication', level: 'entry' },
    { id: 're-marketing', title: 'Real Estate Marketing Specialist', description: 'Social media, content creation, lead nurturing', level: 'mid' },
    { id: 're-transaction', title: 'Real Estate Transaction Coordinator', description: 'Transaction management, compliance, closing support', level: 'mid' },
    { id: 're-property-manager', title: 'Property Management Assistant', description: 'Tenant relations, maintenance coordination, rent collection', level: 'mid' },
    { id: 're-listing-specialist', title: 'Listing Specialist', description: 'Property listings, photography coordination, market analysis', level: 'senior' }
  ],
  'ecommerce': [
    { id: 'ec-va', title: 'E-commerce Virtual Assistant', description: 'Product listing, inventory management, customer service', level: 'entry' },
    { id: 'ec-customer-service', title: 'E-commerce Customer Service Rep', description: 'Order support, returns, live chat management', level: 'entry' },
    { id: 'ec-product-manager', title: 'Product Listing Specialist', description: 'Product research, listing optimization, SEO', level: 'mid' },
    { id: 'ec-social-media', title: 'E-commerce Social Media Manager', description: 'Social media marketing, influencer outreach, content creation', level: 'mid' },
    { id: 'ec-data-analyst', title: 'E-commerce Data Analyst', description: 'Sales analytics, performance tracking, reporting', level: 'senior' },
    { id: 'ec-marketing-manager', title: 'E-commerce Marketing Manager', description: 'Campaign management, PPC, email marketing', level: 'senior' }
  ],
  'healthcare': [
    { id: 'hc-medical-va', title: 'Medical Virtual Assistant', description: 'Patient scheduling, medical records, insurance verification', level: 'entry' },
    { id: 'hc-billing-specialist', title: 'Medical Billing Specialist', description: 'Insurance claims, billing, payment processing', level: 'mid' },
    { id: 'hc-transcriptionist', title: 'Medical Transcriptionist', description: 'Medical dictation, report transcription, documentation', level: 'entry' },
    { id: 'hc-patient-coordinator', title: 'Patient Care Coordinator', description: 'Patient communication, appointment scheduling, follow-ups', level: 'mid' },
    { id: 'hc-compliance-officer', title: 'Healthcare Compliance Officer', description: 'HIPAA compliance, regulatory requirements, audits', level: 'senior' },
    { id: 'hc-telemedicine-coordinator', title: 'Telemedicine Coordinator', description: 'Virtual appointment management, platform support', level: 'mid' }
  ],
  'technology': [
    { id: 'tech-junior-dev', title: 'Junior Web Developer', description: 'Frontend development, UI/UX implementation, testing', level: 'entry' },
    { id: 'tech-qa-tester', title: 'QA Tester', description: 'Software testing, bug reporting, quality assurance', level: 'entry' },
    { id: 'tech-devops', title: 'DevOps Engineer', description: 'Deployment automation, infrastructure management', level: 'mid' },
    { id: 'tech-data-analyst', title: 'Data Analyst', description: 'Data processing, reporting, business intelligence', level: 'mid' },
    { id: 'tech-senior-dev', title: 'Senior Software Developer', description: 'Full-stack development, architecture, team leadership', level: 'senior' },
    { id: 'tech-product-manager', title: 'Technical Product Manager', description: 'Product strategy, roadmap planning, stakeholder management', level: 'senior' }
  ],
  'finance': [
    { id: 'fin-bookkeeper', title: 'Bookkeeper', description: 'Accounts payable/receivable, bank reconciliation, reporting', level: 'entry' },
    { id: 'fin-accountant', title: 'Accountant', description: 'Financial statements, tax preparation, compliance', level: 'mid' },
    { id: 'fin-financial-analyst', title: 'Financial Analyst', description: 'Financial modeling, budgeting, forecasting', level: 'mid' },
    { id: 'fin-loan-processor', title: 'Loan Processor', description: 'Loan applications, documentation, underwriting support', level: 'mid' },
    { id: 'fin-compliance-officer', title: 'Financial Compliance Officer', description: 'Regulatory compliance, risk management, audits', level: 'senior' },
    { id: 'fin-cfo', title: 'CFO Assistant', description: 'Executive support, financial planning, board reporting', level: 'senior' }
  ],
  'marketing': [
    { id: 'mkt-social-media', title: 'Social Media Manager', description: 'Content creation, community management, engagement', level: 'entry' },
    { id: 'mkt-content-writer', title: 'Content Writer', description: 'Blog posts, copywriting, SEO content', level: 'entry' },
    { id: 'mkt-seo-specialist', title: 'SEO Specialist', description: 'Search optimization, keyword research, analytics', level: 'mid' },
    { id: 'mkt-ppc-manager', title: 'PPC Manager', description: 'Google Ads, Facebook Ads, campaign optimization', level: 'mid' },
    { id: 'mkt-email-marketer', title: 'Email Marketing Specialist', description: 'Email campaigns, automation, list management', level: 'mid' },
    { id: 'mkt-marketing-manager', title: 'Marketing Manager', description: 'Strategy development, campaign management, team leadership', level: 'senior' }
  ],
  'education': [
    { id: 'edu-virtual-tutor', title: 'Virtual Tutor', description: 'Online teaching, student support, curriculum delivery', level: 'entry' },
    { id: 'edu-course-developer', title: 'Course Developer', description: 'Curriculum design, content creation, assessment development', level: 'mid' },
    { id: 'edu-student-support', title: 'Student Support Specialist', description: 'Student services, enrollment support, academic advising', level: 'entry' },
    { id: 'edu-lms-admin', title: 'LMS Administrator', description: 'Learning management system, technical support, user training', level: 'mid' },
    { id: 'edu-instructional-designer', title: 'Instructional Designer', description: 'Learning design, multimedia development, assessment', level: 'senior' },
    { id: 'edu-program-manager', title: 'Educational Program Manager', description: 'Program development, faculty coordination, quality assurance', level: 'senior' }
  ],
  'legal': [
    { id: 'legal-paralegal', title: 'Paralegal', description: 'Legal research, document preparation, case management', level: 'entry' },
    { id: 'legal-legal-assistant', title: 'Legal Assistant', description: 'Administrative support, client communication, scheduling', level: 'entry' },
    { id: 'legal-document-reviewer', title: 'Document Review Specialist', description: 'Contract review, due diligence, compliance checking', level: 'mid' },
    { id: 'legal-litigation-support', title: 'Litigation Support Specialist', description: 'Discovery management, trial preparation, evidence organization', level: 'mid' },
    { id: 'legal-compliance-officer', title: 'Legal Compliance Officer', description: 'Regulatory compliance, policy development, risk assessment', level: 'senior' },
    { id: 'legal-contract-manager', title: 'Contract Manager', description: 'Contract negotiation, vendor management, legal review', level: 'senior' }
  ],
  'construction': [
    { id: 'con-project-coordinator', title: 'Project Coordinator', description: 'Project scheduling, vendor coordination, progress tracking', level: 'entry' },
    { id: 'con-estimator', title: 'Construction Estimator', description: 'Cost estimation, material pricing, bid preparation', level: 'mid' },
    { id: 'con-safety-coordinator', title: 'Safety Coordinator', description: 'Safety compliance, training, incident reporting', level: 'mid' },
    { id: 'con-procurement-specialist', title: 'Procurement Specialist', description: 'Material sourcing, vendor management, purchasing', level: 'mid' },
    { id: 'con-project-manager', title: 'Construction Project Manager', description: 'Project oversight, team management, client relations', level: 'senior' },
    { id: 'con-superintendent', title: 'Construction Superintendent', description: 'Site management, quality control, safety oversight', level: 'senior' }
  ],
  'manufacturing': [
    { id: 'mfg-production-coordinator', title: 'Production Coordinator', description: 'Production scheduling, inventory management, quality control', level: 'entry' },
    { id: 'mfg-quality-inspector', title: 'Quality Inspector', description: 'Product inspection, testing, quality assurance', level: 'entry' },
    { id: 'mfg-supply-chain-analyst', title: 'Supply Chain Analyst', description: 'Inventory optimization, supplier management, logistics', level: 'mid' },
    { id: 'mfg-process-engineer', title: 'Process Engineer', description: 'Process improvement, efficiency optimization, automation', level: 'mid' },
    { id: 'mfg-production-manager', title: 'Production Manager', description: 'Production planning, team management, cost control', level: 'senior' },
    { id: 'mfg-operations-manager', title: 'Operations Manager', description: 'Operations oversight, strategic planning, performance optimization', level: 'senior' }
  ],
  'retail': [
    { id: 'ret-customer-service', title: 'Customer Service Representative', description: 'Customer support, order processing, complaint resolution', level: 'entry' },
    { id: 'ret-inventory-specialist', title: 'Inventory Specialist', description: 'Stock management, ordering, warehouse coordination', level: 'entry' },
    { id: 'ret-visual-merchandiser', title: 'Visual Merchandiser', description: 'Store displays, product presentation, layout optimization', level: 'mid' },
    { id: 'ret-buyer', title: 'Retail Buyer', description: 'Product sourcing, vendor relations, purchasing decisions', level: 'mid' },
    { id: 'ret-store-manager', title: 'Store Manager', description: 'Store operations, staff management, sales optimization', level: 'senior' },
    { id: 'ret-regional-manager', title: 'Regional Manager', description: 'Multi-store oversight, strategic planning, performance management', level: 'senior' }
  ],
  'hospitality': [
    { id: 'hosp-front-desk', title: 'Front Desk Agent', description: 'Guest check-in/out, reservations, customer service', level: 'entry' },
    { id: 'hosp-concierge', title: 'Concierge', description: 'Guest services, local recommendations, event coordination', level: 'entry' },
    { id: 'hosp-event-coordinator', title: 'Event Coordinator', description: 'Event planning, vendor coordination, guest management', level: 'mid' },
    { id: 'hosp-revenue-manager', title: 'Revenue Manager', description: 'Pricing strategy, demand forecasting, revenue optimization', level: 'mid' },
    { id: 'hosp-guest-relations', title: 'Guest Relations Manager', description: 'Guest satisfaction, complaint resolution, loyalty programs', level: 'senior' },
    { id: 'hosp-operations-manager', title: 'Hospitality Operations Manager', description: 'Operations oversight, staff management, quality standards', level: 'senior' }
  ],
  'logistics': [
    { id: 'log-warehouse-clerk', title: 'Warehouse Clerk', description: 'Inventory management, order picking, shipping preparation', level: 'entry' },
    { id: 'log-dispatch-coordinator', title: 'Dispatch Coordinator', description: 'Driver scheduling, route optimization, delivery tracking', level: 'entry' },
    { id: 'log-supply-chain-analyst', title: 'Supply Chain Analyst', description: 'Logistics optimization, cost analysis, performance tracking', level: 'mid' },
    { id: 'log-fleet-manager', title: 'Fleet Manager', description: 'Vehicle maintenance, driver management, compliance', level: 'mid' },
    { id: 'log-operations-manager', title: 'Logistics Operations Manager', description: 'Operations oversight, process improvement, team management', level: 'senior' },
    { id: 'log-supply-chain-manager', title: 'Supply Chain Manager', description: 'Strategic planning, vendor relations, cost optimization', level: 'senior' }
  ],
  'consulting': [
    { id: 'cons-research-analyst', title: 'Research Analyst', description: 'Market research, data analysis, report preparation', level: 'entry' },
    { id: 'cons-business-analyst', title: 'Business Analyst', description: 'Process analysis, requirements gathering, solution design', level: 'mid' },
    { id: 'cons-project-coordinator', title: 'Project Coordinator', description: 'Project management, client communication, deliverable tracking', level: 'mid' },
    { id: 'cons-strategy-consultant', title: 'Strategy Consultant', description: 'Strategic planning, market analysis, business development', level: 'senior' },
    { id: 'cons-engagement-manager', title: 'Engagement Manager', description: 'Client relationship management, project oversight, team leadership', level: 'senior' },
    { id: 'cons-principal-consultant', title: 'Principal Consultant', description: 'Senior advisory, business development, thought leadership', level: 'senior' }
  ],
  'media': [
    { id: 'media-content-creator', title: 'Content Creator', description: 'Video production, graphic design, social media content', level: 'entry' },
    { id: 'media-social-media-manager', title: 'Social Media Manager', description: 'Platform management, engagement, content strategy', level: 'entry' },
    { id: 'media-video-editor', title: 'Video Editor', description: 'Video editing, post-production, motion graphics', level: 'mid' },
    { id: 'media-graphic-designer', title: 'Graphic Designer', description: 'Visual design, branding, marketing materials', level: 'mid' },
    { id: 'media-creative-director', title: 'Creative Director', description: 'Creative strategy, brand direction, team leadership', level: 'senior' },
    { id: 'media-production-manager', title: 'Production Manager', description: 'Production oversight, budget management, timeline coordination', level: 'senior' }
  ],
  'nonprofit': [
    { id: 'np-volunteer-coordinator', title: 'Volunteer Coordinator', description: 'Volunteer recruitment, training, program management', level: 'entry' },
    { id: 'np-fundraising-coordinator', title: 'Fundraising Coordinator', description: 'Donor relations, event planning, grant writing', level: 'mid' },
    { id: 'np-program-coordinator', title: 'Program Coordinator', description: 'Program development, implementation, evaluation', level: 'mid' },
    { id: 'np-communications-manager', title: 'Communications Manager', description: 'Public relations, marketing, stakeholder communication', level: 'mid' },
    { id: 'np-executive-assistant', title: 'Executive Assistant', description: 'Executive support, board coordination, strategic planning', level: 'senior' },
    { id: 'np-program-manager', title: 'Program Manager', description: 'Program oversight, strategic planning, impact measurement', level: 'senior' }
  ],
  'other': [
    { id: 'gen-virtual-assistant', title: 'Virtual Assistant', description: 'General administrative support, scheduling, data entry', level: 'entry' },
    { id: 'gen-customer-service', title: 'Customer Service Representative', description: 'Customer support, order processing, inquiry handling', level: 'entry' },
    { id: 'gen-data-entry', title: 'Data Entry Specialist', description: 'Data processing, database management, record keeping', level: 'entry' },
    { id: 'gen-administrative-assistant', title: 'Administrative Assistant', description: 'Office support, document management, coordination', level: 'mid' },
    { id: 'gen-project-coordinator', title: 'Project Coordinator', description: 'Project management, team coordination, progress tracking', level: 'mid' },
    { id: 'gen-operations-manager', title: 'Operations Manager', description: 'Operations oversight, process improvement, team management', level: 'senior' }
  ]
};

// Helper function to get role suggestions for an industry
export const getRoleSuggestionsForIndustry = (industryName: string): RoleSuggestion[] => {
  const industry = industries.find(ind => ind.name.toLowerCase() === industryName.toLowerCase());
  if (!industry) return industryRoleSuggestions['other'];
  
  return industryRoleSuggestions[industry.id] || industryRoleSuggestions['other'];
};
