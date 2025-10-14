import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchKnowledge, knowledgeBase } from '@/lib/knowledge-base';
import { createClient } from '@/lib/supabase/client';
import { getSystemPrompt } from '@/lib/ai-config';

// Conversation analysis function
function analyzeConversation(message: string, conversationHistory: Array<{ role: string; content: string }>, userData: any) {
  const messageLower = message.toLowerCase();
  const fullConversation = [...conversationHistory.map(msg => msg.content), message].join(' ').toLowerCase();
  
  // Analyze user intent
  let intent = 'general_inquiry';
  if (messageLower.includes('pricing') || messageLower.includes('cost') || messageLower.includes('price') || messageLower.includes('quote')) {
    intent = 'pricing_inquiry';
  } else if (messageLower.includes('talent') || messageLower.includes('hire') || messageLower.includes('team') || messageLower.includes('staff')) {
    intent = 'talent_inquiry';
  } else if (messageLower.includes('service') || messageLower.includes('help') || messageLower.includes('support')) {
    intent = 'service_inquiry';
  } else if (messageLower.includes('contact') || messageLower.includes('reach') || messageLower.includes('call')) {
    intent = 'contact_inquiry';
  } else if (messageLower.includes('account') || messageLower.includes('signup') || messageLower.includes('register')) {
    intent = 'account_inquiry';
  }
  
  // Determine conversation stage
  let stage = 'initial';
  if (conversationHistory.length === 0) {
    stage = 'greeting';
  } else if (conversationHistory.length < 3) {
    stage = 'exploration';
  } else if (conversationHistory.length < 6) {
    stage = 'engagement';
  } else {
    stage = 'deep_discussion';
  }
  
  // Extract key topics
  const topics = [];
  if (fullConversation.includes('real estate')) topics.push('real_estate');
  if (fullConversation.includes('construction')) topics.push('construction');
  if (fullConversation.includes('engineering')) topics.push('engineering');
  if (fullConversation.includes('marketing')) topics.push('marketing');
  if (fullConversation.includes('finance') || fullConversation.includes('accounting')) topics.push('finance');
  if (fullConversation.includes('virtual assistant') || fullConversation.includes('va')) topics.push('virtual_assistant');
  if (fullConversation.includes('outsourcing')) topics.push('outsourcing');
  if (fullConversation.includes('team building')) topics.push('team_building');
  
  // Determine urgency level
  let urgency = 'low';
  if (messageLower.includes('urgent') || messageLower.includes('asap') || messageLower.includes('immediately') || messageLower.includes('quickly')) {
    urgency = 'high';
  } else if (messageLower.includes('soon') || messageLower.includes('fast') || messageLower.includes('quick')) {
    urgency = 'medium';
  }
  
  // Suggest actions based on conversation analysis - only show modals for specific requests
  const suggestedActions = [];
  
  // Only suggest pricing calculator for specific pricing/quote requests
  if ((fullConversation.includes('pricing') || fullConversation.includes('cost') || fullConversation.includes('quote') || fullConversation.includes('estimate')) && 
      (fullConversation.includes('get') || fullConversation.includes('calculate') || fullConversation.includes('see') || fullConversation.includes('show'))) {
    suggestedActions.push('pricing_calculator_modal');
  }
  
  // Only suggest contact form for specific contact requests
  if ((fullConversation.includes('contact') || fullConversation.includes('reach') || fullConversation.includes('get in touch') || fullConversation.includes('speak to')) && 
      (fullConversation.includes('form') || fullConversation.includes('message') || fullConversation.includes('send'))) {
    suggestedActions.push('contact_form_modal');
  }
  
  // Only suggest quote details if user has quotes and asks to see them
  if (fullConversation.includes('my quotes') || fullConversation.includes('view quotes') || fullConversation.includes('see quotes') || 
      (fullConversation.includes('quote') && (fullConversation.includes('my') || fullConversation.includes('view') || fullConversation.includes('see')))) {
    if (userData && userData.totalQuotes > 0) {
      suggestedActions.push('quote_details_modal');
    }
  }
  
  // Only suggest urgent contact for urgent requests
  if (urgency === 'high' && (fullConversation.includes('urgent') || fullConversation.includes('asap') || fullConversation.includes('immediately'))) {
    suggestedActions.push('urgent_contact_modal');
  }
  
  // Only suggest talent search for specific hiring requests
  if ((fullConversation.includes('talent') || fullConversation.includes('hire') || fullConversation.includes('find') || fullConversation.includes('recruit')) && 
      (fullConversation.includes('candidate') || fullConversation.includes('employee') || fullConversation.includes('staff') || fullConversation.includes('team'))) {
    suggestedActions.push('talent_search_modal');
  }
  
  // Only suggest demo for specific demo requests
  if ((fullConversation.includes('demo') || fullConversation.includes('show me') || fullConversation.includes('example') || fullConversation.includes('demonstration')) && 
      (fullConversation.includes('see') || fullConversation.includes('show') || fullConversation.includes('schedule') || fullConversation.includes('book'))) {
    suggestedActions.push('demo_modal');
  }
  
  // Suggest dynamic forms for more conversational requests
  if ((fullConversation.includes('pricing') || fullConversation.includes('cost') || fullConversation.includes('budget')) && 
      (fullConversation.includes('tell me') || fullConversation.includes('help me') || fullConversation.includes('need'))) {
    suggestedActions.push('pricing_form_modal');
  }
  
  if ((fullConversation.includes('interview') || fullConversation.includes('meet') || fullConversation.includes('schedule')) && 
      (fullConversation.includes('candidate') || fullConversation.includes('person') || fullConversation.includes('someone'))) {
    suggestedActions.push('interview_form_modal');
  }
  
  if ((fullConversation.includes('demo') || fullConversation.includes('show') || fullConversation.includes('presentation')) && 
      (fullConversation.includes('request') || fullConversation.includes('schedule') || fullConversation.includes('book'))) {
    suggestedActions.push('demo_form_modal');
  }
  
  return {
    intent,
    stage,
    topics,
    urgency,
    suggestedActions
  };
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const rateLimitKey = clientIP;
    
    const rateLimitData = rateLimitMap.get(rateLimitKey);
    if (rateLimitData) {
      if (now < rateLimitData.resetTime) {
        if (rateLimitData.count >= RATE_LIMIT_MAX_REQUESTS) {
          return NextResponse.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        }
        rateLimitData.count++;
      } else {
        rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Check if API key is available (without logging sensitive information)
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { message, conversationHistory, userId }: { message: string; conversationHistory: Array<{ role: string; content: string }>; userId?: string } = requestBody;

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 4000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 4000 characters.' },
        { status: 400 }
      );
    }

    // Validate conversation history
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'Conversation history must be an array' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!hasApiKey) {
      console.error('API key not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Prepare conversation context for Claude
    const messages = conversationHistory.map(msg => ({
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content
    }));

    // Add the current user message
    messages.push({
      role: 'user' as const,
      content: message
    });

    // Fetch user data for personalization if userId is provided
    let userData = null;
    if (userId) {
      try {
        const supabase = createClient();
        
        // Fetch user data
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user:', userError);
        } else if (user) {
          // Fetch user's pricing quotes
          const { data: quotes, error: quotesError } = await supabase
            .from('pricing_quotes')
            .select('*')
            .eq('user_id', userId)
            .order('quote_timestamp', { ascending: false });

          if (quotesError) {
            console.error('Error fetching quotes:', quotesError);
          }

          // Fetch recent page visits for activity tracking
          const { data: pageVisits, error: visitsError } = await supabase
            .from('user_page_visits')
            .select('*')
            .eq('user_id', userId)
            .order('visit_timestamp', { ascending: false })
            .limit(5);

          if (visitsError) {
            console.error('Error fetching page visits:', visitsError);
          }

          // Determine user status and interests
          const isAnonymous = user.user_type === 'Anonymous';
          const isRegular = user.user_type === 'Regular';
          const hasQuotes = quotes && quotes.length > 0;
          const hasContactInfo = !!(user.first_name || user.last_name || user.email);
          const hasCompany = !!user.company;
          const hasIndustry = !!user.industry;

          // Analyze user interests based on data
          const interests = [];
          if (user.industry) interests.push(user.industry);
          if (hasQuotes) interests.push('pricing');
          if (user.company) interests.push('business solutions');

          // Determine what the user might be looking for
          const potentialNeeds = [];
          if (isAnonymous && !hasContactInfo) {
            potentialNeeds.push('contact_information');
          }
          if (isAnonymous && !hasQuotes) {
            potentialNeeds.push('pricing_calculator');
          }
          if (hasQuotes && !isRegular) {
            potentialNeeds.push('account_creation');
          }
          if (hasCompany && !hasQuotes) {
            potentialNeeds.push('quote_creation');
          }

          userData = {
            user: {
              user_id: user.user_id,
              user_type: user.user_type,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              company: user.company,
              industry: user.industry,
              created_at: user.created_at,
              updated_at: user.updated_at
            },
            quotes: quotes || [],
            totalQuotes: quotes?.length || 0,
            recentActivity: pageVisits || [],
            leadCaptureStatus: {
              first_lead_capture: user.first_lead_capture || false,
              second_lead_capture: user.second_lead_capture || false,
              third_lead_capture: user.third_lead_capture || false
            },
            userProfile: {
              isAnonymous,
              isRegular,
              hasQuotes,
              hasContactInfo,
              hasCompany,
              hasIndustry,
              interests,
              potentialNeeds
            },
            isNewUser: false
          };
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    // Search knowledge base for relevant information (skip for simple greetings)
    let relevantKnowledge = null;
    const messageLower = message.toLowerCase().trim();
    const simpleGreetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'];
    
    if (!simpleGreetings.includes(messageLower)) {
      relevantKnowledge = searchKnowledge(message);
    }
    
    // Also search for specific trigger phrases that should always include links
    const triggerPhrases = [
      { phrase: 'talent pool', knowledgeId: 'talent-pool' },
      { phrase: 'team location', knowledgeId: 'team-location' },
      { phrase: 'where are you located', knowledgeId: 'team-location' },
      { phrase: 'hire team', knowledgeId: 'hire-team' },
      { phrase: 'case studies', knowledgeId: 'case-studies' },
      { phrase: 'testimonials', knowledgeId: 'testimonials' },
      { phrase: 'contact', knowledgeId: 'contact-us' },
      { phrase: 'pricing', knowledgeId: 'pricing-overview' },
      { phrase: 'how it works', knowledgeId: 'how-it-works' },
      { phrase: 'virtual assistant', knowledgeId: 'virtual-assistant' },
      { phrase: 'real estate virtual assistant', knowledgeId: 'real-estate-va' },
      { phrase: 'property management assistant', knowledgeId: 'property-management-va' },
      { phrase: 'customer service', knowledgeId: 'customer-service' },
      { phrase: 'engineering support', knowledgeId: 'engineering-support' },
      { phrase: 'marketing team', knowledgeId: 'marketing-team' },
      { phrase: 'finance', knowledgeId: 'finance-accounting' },
      { phrase: 'accounting', knowledgeId: 'finance-accounting' }
    ];
    
    // Add specific knowledge items based on trigger phrases
    const messageLowerForTriggers = message.toLowerCase();
    const triggeredKnowledge = triggerPhrases
      .filter(trigger => messageLowerForTriggers.includes(trigger.phrase))
      .map(trigger => knowledgeBase.find(item => item.id === trigger.knowledgeId))
      .filter(Boolean);
    
    // Combine search results with triggered knowledge, removing duplicates
    const allRelevantKnowledge = relevantKnowledge ? [...relevantKnowledge] : [];
    triggeredKnowledge.forEach(item => {
      if (item && !allRelevantKnowledge.find(existing => existing.id === item.id)) {
        allRelevantKnowledge.push(item);
      }
    });
    
  // Analyze conversation context and user intent
  const conversationAnalysis = analyzeConversation(message, conversationHistory, userData);
  
  // Create personalized context based on user data and conversation analysis
  let personalizedContext = '';
  const suggestedComponents = [];
  
  // Enhanced AI analysis for anonymous users
  let shouldRequestContactInfo = false;
  let contactRequestReason = '';
  let statusBasedQuestion = '';
  
  // Check for anonymous users without userData (new visitors)
  if (!userData || userData.isNewUser) {
    // For new/anonymous users, check conversation patterns
    if (conversationHistory.length >= 2) {
      shouldRequestContactInfo = true;
      contactRequestReason = 'new_user_engagement';
    }
    
    // Check if user is asking for specific services
    if (conversationAnalysis.intent === 'pricing_inquiry' || 
        conversationAnalysis.intent === 'talent_inquiry' || 
        conversationAnalysis.intent === 'service_inquiry') {
      shouldRequestContactInfo = true;
      contactRequestReason = 'service_inquiry_anonymous';
    }
  }
  
  if (userData && !userData.isNewUser) {
    const { user, quotes, leadCaptureStatus, userProfile } = userData;
    
    // Check if user is anonymous and missing contact information
    if (user.user_type === 'Anonymous' && !userProfile.hasContactInfo) {
      shouldRequestContactInfo = true;
      contactRequestReason = 'anonymous_user_missing_contact';
    }
    
    // Don't ask for contact info from authenticated users (Regular/Admin)
    if (user.user_type === 'Regular' || user.user_type === 'Admin') {
      shouldRequestContactInfo = false;
      contactRequestReason = 'authenticated_user_has_contact_info';
    }
    
    // Check if user has been engaging but hasn't provided contact info
    if (conversationHistory.length >= 3 && !userProfile.hasContactInfo) {
      shouldRequestContactInfo = true;
      contactRequestReason = 'engaged_user_missing_contact';
    }
    
    // Check if user is asking for quotes but hasn't provided contact info
    if ((conversationAnalysis.intent === 'pricing_inquiry' || conversationAnalysis.intent === 'talent_inquiry') && !userProfile.hasContactInfo) {
      shouldRequestContactInfo = true;
      contactRequestReason = 'quote_request_missing_contact';
    }
    
    // Determine status-based question
    const hasCompany = user.company && user.company.trim() !== '';
    const hasIndustry = user.industry && user.industry.trim() !== '';
    const isReturningUser = quotes.length > 0 || userProfile.recentActivity?.length > 0;
    
    if (hasCompany && hasIndustry) {
      statusBasedQuestion = "Since you're from an established company, would you like me to show you our talent pool to find the right team members for your business needs?";
    } else if (hasCompany && !hasIndustry) {
      statusBasedQuestion = "I'd love to help you find the right talent for your company. What industry does your business operate in?";
    } else if (!hasCompany && hasIndustry) {
      statusBasedQuestion = `Great! Since you're interested in our services, would you like to see our pricing calculator to get a personalized quote for your ${user.industry} needs?`;
    } else if (isReturningUser) {
      statusBasedQuestion = "Welcome back! I can see you've been here before. What would you like to explore today - our talent pool, pricing calculator, or something else?";
    } else {
      statusBasedQuestion = "Great to meet you! Let me help you discover what ShoreAgents can do for your business. Would you like to start with our talent pool or get a pricing quote?";
    }

    // Create personalized greeting context
    personalizedContext = `\n\nPERSONALIZED USER CONTEXT:
- User Type: ${user.user_type}
- Name: ${user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Not provided'}
- Company: ${user.company || 'Not provided'}
- Industry: ${user.industry || 'Not specified'}
- Total Quotes: ${quotes.length}
- Lead Capture Status: First=${leadCaptureStatus.first_lead_capture}, Second=${leadCaptureStatus.second_lead_capture}, Third=${leadCaptureStatus.third_lead_capture}
- Has Contact Info: ${userProfile.hasContactInfo}
- Interests: ${userProfile.interests.join(', ') || 'None specified'}
- Potential Needs: ${userProfile.potentialNeeds.join(', ') || 'None identified'}
- Status-Based Question: ${statusBasedQuestion}

CONVERSATION ANALYSIS:
- User Intent: ${conversationAnalysis.intent}
- Conversation Stage: ${conversationAnalysis.stage}
- Key Topics: ${conversationAnalysis.topics.join(', ')}
- Urgency Level: ${conversationAnalysis.urgency}
- Suggested Actions: ${conversationAnalysis.suggestedActions.join(', ')}
- Should Request Contact Info: ${shouldRequestContactInfo}
- Contact Request Reason: ${contactRequestReason}`;
  } else {
    // For new/anonymous users without userData
    personalizedContext = `\n\nANONYMOUS USER CONTEXT:
- User Type: Anonymous/New Visitor
- Has Contact Info: No
- Conversation History Length: ${conversationHistory.length}

CONVERSATION ANALYSIS:
- User Intent: ${conversationAnalysis.intent}
- Conversation Stage: ${conversationAnalysis.stage}
- Key Topics: ${conversationAnalysis.topics.join(', ')}
- Urgency Level: ${conversationAnalysis.urgency}
- Suggested Actions: ${conversationAnalysis.suggestedActions.join(', ')}
- Should Request Contact Info: ${shouldRequestContactInfo}
- Contact Request Reason: ${contactRequestReason}`;
  }

  // Suggest relevant components based on user data and conversation analysis
  if (userData && !userData.isNewUser) {
    const { userProfile, quotes } = userData;
    
    if (conversationAnalysis.suggestedActions.includes('pricing_calculator_modal') || userProfile.potentialNeeds.includes('pricing_calculator') || userProfile.potentialNeeds.includes('quote_creation')) {
      suggestedComponents.push('pricing_calculator_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('signup_modal') || userProfile.potentialNeeds.includes('account_creation')) {
      suggestedComponents.push('signup_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('contact_form_modal') || userProfile.potentialNeeds.includes('contact_information')) {
      suggestedComponents.push('contact_form_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('quote_details_modal') || quotes.length > 0) {
      suggestedComponents.push('quote_details_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('urgent_contact_modal')) {
      suggestedComponents.push('urgent_contact_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('talent_search_modal')) {
      suggestedComponents.push('talent_search_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('demo_modal')) {
      suggestedComponents.push('demo_modal');
    }
  } else {
    // For new users, analyze conversation to suggest components
    if (conversationAnalysis.suggestedActions.includes('pricing_calculator_modal')) {
      suggestedComponents.push('pricing_calculator_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('contact_form_modal')) {
      suggestedComponents.push('contact_form_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('urgent_contact_modal')) {
      suggestedComponents.push('urgent_contact_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('talent_search_modal')) {
      suggestedComponents.push('talent_search_modal');
    }
    if (conversationAnalysis.suggestedActions.includes('demo_modal')) {
      suggestedComponents.push('demo_modal');
    }
  }

  // Create system prompt using dynamic configuration
  const knowledgeContext = allRelevantKnowledge.length > 0 
    ? allRelevantKnowledge.map(item => `- ${item.title}: ${item.content}`).join('\n')
    : '';

  const systemPrompt = getSystemPrompt(userData, knowledgeContext, personalizedContext);

    // Log request details (without sensitive information)
    console.log('Processing chat request...');
    console.log('Message length:', message.length);
    console.log('Conversation history length:', conversationHistory.length);

    // Call Anthropic API
    const anthropicResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    });

    console.log('API response received successfully');

    // Extract the response content
    const aiResponse = anthropicResponse.content[0];
    if (aiResponse.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic API');
    }

    // Prepare related content with clickable links
    const relatedContent = allRelevantKnowledge
      .filter(item => item.url) // Only include items with URLs
      .map(item => ({
        title: item.title,
        content: item.content,
        url: item.url
      }));

    const nextResponse = NextResponse.json({
      content: aiResponse.text,
      components: relatedContent,
      suggestedComponents: suggestedComponents,
      userData: userData ? {
        userType: userData.user.user_type,
        hasQuotes: userData.totalQuotes > 0,
        leadCaptureStatus: userData.leadCaptureStatus
      } : null
    });

    // Add security headers
    nextResponse.headers.set('X-Content-Type-Options', 'nosniff');
    nextResponse.headers.set('X-Frame-Options', 'DENY');
    nextResponse.headers.set('X-XSS-Protection', '1; mode=block');
    nextResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return nextResponse;

  } catch (error) {
    console.error('Chat API error occurred');
    
    // Log error details without exposing sensitive information
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      // Only log error message if it doesn't contain sensitive information
      if (!error.message.toLowerCase().includes('key') && !error.message.toLowerCase().includes('token')) {
        console.error('Error message:', error.message);
      }
    }
    
    // Handle specific error types without exposing details
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }
}
