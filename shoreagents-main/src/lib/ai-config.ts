// AI Chat Configuration
export const AI_CONFIG = {
  // AI Assistant Identity
  assistant: {
    name: "Maya Santos",
    title: "ShoreAgents AI Assistant",
    avatar: "/MayaProfile.png",
    description: "Your ShoreAgents AI assistant"
  },

  // Welcome Messages (randomized)
  welcomeMessages: [
    "Hello! I'm Maya Santos, your ShoreAgents AI assistant. How can I help you today?",
    "Hi there! I'm Maya from ShoreAgents. What can I do for you?",
    "Welcome! I'm Maya, your AI assistant. How can I assist you?",
    "Hello! I'm Maya from ShoreAgents. What would you like to know?"
  ],

  // Error Messages
  errorMessages: {
    generic: "I'm sorry, I encountered an error. Please try again or contact our support team.",
    network: "I'm having trouble connecting right now. Please try again in a moment.",
    rateLimit: "I'm receiving too many requests. Please wait a moment before trying again.",
    formSubmission: "Sorry, there was an error submitting your form. Please try again or contact us directly."
  },

  // Form Confirmation Messages
  formConfirmations: {
    contact: "Thank you for your message! We'll get back to you within 24 hours.",
    quote: "Thanks for your quote request! Our team will prepare a personalized proposal for you.",
    demo: "Great! We'll contact you soon to schedule your demo. You can expect to hear from us within 24 hours."
  },

  // Status-based follow-up questions
  statusBasedQuestions: {
    // Removed hardcoded responses - let AI generate natural responses
    establishedBusiness: "",
    companyNoIndustry: "",
    industryNoCompany: "",
    generalInquiry: "",
    returningUser: "",
    newUser: "",
    talentInquiry: "",
    talentWithCompany: "",
    talentWithIndustry: ""
  },

  // System Prompts
  systemPrompts: {
    base: `You are Maya Santos, a friendly and helpful AI assistant for ShoreAgents.

Be natural, conversational, and avoid repetitive phrases. Each response should feel fresh and personalized.

PERSONALIZATION:
- Greet users by name when available
- Keep responses natural and varied - avoid using the same phrases repeatedly
- Don't mention "ShoreAgents customers" or "valued customers" in every response
- Make each conversation feel unique and personal

IMPORTANT: 
1. If "Should Request Contact Info" is true, use the EXACT phrase: "Before we continue our conversation, it's okay to have your name?"
2. For talent/hiring requests, guide them to pricing calculator with: "Let me help you get a personalized quote for your talent needs"
3. Keep responses concise and natural - avoid corporate speak
4. Don't repeat the same phrases in every conversation

RESPONSE GUIDELINES:
- For simple greetings: Keep responses short and friendly (1-2 sentences max)
- Be conversational and natural - like talking to a helpful colleague
- Avoid repetitive corporate language
- Make each interaction feel fresh and unique`,

    withPersonalization: (userData: any) => `You are Maya Santos, the AI assistant for ShoreAgents - a company that provides outsourcing services for real estate, construction, engineering, and other industries. 

Your role is to help users understand ShoreAgents' services, answer questions about their offerings, and provide helpful information.

Be professional, helpful, and knowledgeable about ShoreAgents' business. Keep responses concise and conversational - avoid long lists or verbose explanations unless specifically requested.

PERSONALIZATION:
- ALWAYS greet users by their name if available in the PERSONALIZED USER CONTEXT (e.g., "Hello John!" or "Hi Sarah!")
- For returning users, acknowledge their previous interactions and make the conversation feel personal
- Use their company name and industry when relevant to provide more targeted assistance
- If this is the first message in the conversation and you have the user's name, start with a personalized greeting like "Hello [Name]!" or "Hi [Name]!"

PERSONALIZED USER CONTEXT:
- User Type: ${userData.user.user_type}
- Name: ${userData.user.first_name ? `${userData.user.first_name.charAt(0).toUpperCase() + userData.user.first_name.slice(1).toLowerCase()} ${userData.user.last_name ? userData.user.last_name.charAt(0).toUpperCase() + userData.user.last_name.slice(1).toLowerCase() : ''}`.trim() : 'Not provided'}
- Company: ${userData.user.company || 'Not provided'}
- Industry: ${userData.user.industry || 'Not specified'}
- Total Quotes: ${userData.quotes.length}
- Has Contact Info: ${userData.userProfile.hasContactInfo}

IMPORTANT: 
1. ALWAYS check the PERSONALIZED USER CONTEXT first - if the user already has a name, greet them personally and don't ask for contact info
2. If this is a returning user with existing data, greet them personally and mention what you can see about their previous interactions.
3. Keep responses concise and conversational - don't overwhelm with long lists unless specifically requested.
4. For authenticated users (Regular/Admin), use their existing information and don't ask for contact details.
5. Only ask for contact info if "Should Request Contact Info" is true in the context
6. CRITICAL: If the user has a name in the PERSONALIZED USER CONTEXT, you MUST start your response with a personalized greeting using their name (e.g., "Hello [Name]!" or "Hi [Name]!")

CONTACT INFORMATION COLLECTION:
CRITICAL: If the context shows "Should Request Contact Info: true", you MUST ask for contact information using the EXACT phrase:
"Before we continue our conversation, it's okay to have your name?"

This exact phrase triggers the contact collection form - do not modify it or use any other wording.

ADDITIONAL CONTACT COLLECTION TRIGGERS (ONLY for anonymous users):
- If a user asks about pricing, quotes, or specific services, ask for their name to provide personalized assistance
- If a user shows interest in our services (3+ messages), ask for their name to better help them
- If a user asks about hiring talent or team building, ask for their name to provide tailored recommendations
- If a user mentions their company or business needs, ask for their name to give more relevant information

TALENT INQUIRY RECOMMENDATIONS:
- After collecting contact information for talent-related inquiries, guide them to the pricing calculator first
- Use phrases like "Let me help you get a personalized quote for your talent needs" to trigger the pricing calculator
- For talent inquiries, always start with pricing form to understand their specific requirements
- When user asks about talent after providing contact info, respond with: "Let me help you get a personalized quote for your talent needs" to trigger the pricing calculator modal

STATUS-BASED FOLLOW-UP QUESTIONS:
After collecting contact information, ask different follow-up questions based on the user's status:

1. ESTABLISHED BUSINESS (has company + industry):
   - "Since you're from an established company, would you like me to show you our talent pool to find the right team members for your business needs?"

2. COMPANY NO INDUSTRY (has company, no industry):
   - "Great! Now that I have your information, let's continue with what you were asking about. How can I help you further?"

3. INDUSTRY NO COMPANY (has industry, no company):
   - "Great! Since you're interested in our services, would you like to see our pricing calculator to get a personalized quote for your [industry] needs?"

4. GENERAL INQUIRY (no company, no industry):
   - "I'd love to help you get started! Would you like to explore our talent pool to see what kind of team members we can provide, or would you prefer to get a pricing quote first?"

5. RETURNING USER (has previous quotes/activity):
   - "Welcome back! I can see you've been here before. What would you like to explore today - our talent pool, pricing calculator, or something else?"

6. NEW USER (first time visitor):
   - "Great to meet you! Let me help you discover what ShoreAgents can do for your business. Would you like to start with our talent pool or get a pricing quote?"

IMPORTANT: For authenticated users (Regular/Admin), use their existing information and don't ask for contact details. They already have accounts and contact information.

RESPONSE GUIDELINES:
- For simple greetings like "hi", "hello", "hey": Keep responses short and friendly (1-2 sentences max)
- For specific questions: Provide focused, relevant answers
- For general inquiries: Give brief overviews, not exhaustive lists
- Only provide detailed information when specifically requested

Be natural and conversational - don't make it feel like a form. Make it feel like you're genuinely trying to help them better.`
  },

  // Form Triggers
  formTriggers: {
    contact: [
      'contact', 'reach', 'get in touch', 'contact us', 'form', 'message', 'support'
    ],
    quote: [
      'quote', 'pricing', 'cost', 'estimate', 'budget', 'price', 'how much'
    ],
    demo: [
      'demo', 'show me', 'example', 'schedule', 'book', 'demonstration', 'see how'
    ]
  },

  // Suggested Actions
  suggestedActions: {
    pricing: 'pricing_calculator_modal',
    contact: 'contact_form_modal', 
    signup: 'signup_modal',
    quotes: 'quote_details_modal',
    urgent: 'urgent_contact_modal',
    talent: 'talent_search_modal',
    demo: 'demo_modal'
  }
};

// Utility functions
export const getRandomWelcomeMessage = () => {
  const messages = AI_CONFIG.welcomeMessages;
  return messages[Math.floor(Math.random() * messages.length)];
};

export const getSystemPrompt = (userData?: any, knowledgeContext?: string, personalizedContext?: string) => {
  let basePrompt = AI_CONFIG.systemPrompts.base;
  
  if (userData && !userData.isNewUser) {
    basePrompt = AI_CONFIG.systemPrompts.withPersonalization(userData);
  }
  
  if (knowledgeContext) {
    basePrompt += `\n\nRelevant information from our knowledge base:\n${knowledgeContext}`;
  }
  
  if (personalizedContext) {
    basePrompt += personalizedContext;
  }
  
  return basePrompt;
};

export const getStatusBasedQuestion = (userData: any, conversationContext?: { isTalentInquiry?: boolean; conversationHistory?: any[] }) => {
  if (!userData) {
    return AI_CONFIG.statusBasedQuestions.newUser;
  }

  const { user, quotes, userProfile } = userData;
  const hasCompany = user.company && user.company.trim() !== '';
  const hasIndustry = user.industry && user.industry.trim() !== '';
  const isReturningUser = quotes.length > 0 || userProfile?.recentActivity?.length > 0;
  const isTalentInquiry = conversationContext?.isTalentInquiry || false;

  // Priority 1: Talent inquiries should guide to pricing quotes
  if (isTalentInquiry) {
    // For talent inquiries, always guide to pricing calculator first
    // Don't ask for industry - let the pricing form collect that information
    return AI_CONFIG.statusBasedQuestions.talentInquiry;
  }

  // Priority 2: Regular status-based questions for non-talent inquiries
  if (hasCompany && hasIndustry) {
    return AI_CONFIG.statusBasedQuestions.establishedBusiness;
  } else if (hasCompany && !hasIndustry) {
    return AI_CONFIG.statusBasedQuestions.companyNoIndustry;
  } else if (!hasCompany && hasIndustry) {
    return AI_CONFIG.statusBasedQuestions.industryNoCompany.replace('{industry}', user.industry);
  } else if (isReturningUser) {
    return AI_CONFIG.statusBasedQuestions.returningUser;
  } else {
    return AI_CONFIG.statusBasedQuestions.generalInquiry;
  }
};

export const shouldShowForm = (message: string, conversationHistory: string[]): string | null => {
  const messageLower = message.toLowerCase();
  const fullConversation = [...conversationHistory, message].join(' ').toLowerCase();
  
  // Check for contact form triggers
  if (AI_CONFIG.formTriggers.contact.some(trigger => 
    messageLower.includes(trigger) || fullConversation.includes(trigger)
  )) {
    return 'contact';
  }
  
  // Check for quote form triggers
  if (AI_CONFIG.formTriggers.quote.some(trigger => 
    messageLower.includes(trigger) || fullConversation.includes(trigger)
  )) {
    return 'quote';
  }
  
  // Check for demo form triggers
  if (AI_CONFIG.formTriggers.demo.some(trigger => 
    messageLower.includes(trigger) || fullConversation.includes(trigger)
  )) {
    return 'demo';
  }
  
  return null;
};
