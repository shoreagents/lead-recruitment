// Example configuration for customizing AI messages
// Copy this file to ai-messages.ts and modify as needed

export const CUSTOM_AI_MESSAGES = {
  // Custom welcome messages
  welcomeMessages: [
    "Hello! I'm Maya Santos, your ShoreAgents AI assistant. I can help you with information about our services, team, pricing, and more. How can I assist you today?",
    "Hi there! I'm Maya Santos from ShoreAgents. I'm here to help you learn about our outsourcing services and answer any questions you might have. What would you like to know?",
    "Welcome! I'm Maya Santos, your AI assistant for ShoreAgents. I can help you explore our services, get pricing information, or connect you with our team. How can I assist you?",
    "Hello! I'm Maya Santos, your personal AI guide to ShoreAgents. Whether you're looking for outsourcing solutions, pricing, or just want to learn more about us, I'm here to help. What can I do for you today?"
  ],

  // Custom error messages
  errorMessages: {
    generic: "I'm sorry, I encountered an error. Please try again or contact our support team.",
    network: "I'm having trouble connecting right now. Please try again in a moment.",
    rateLimit: "I'm receiving too many requests. Please wait a moment before trying again.",
    formSubmission: "Sorry, there was an error submitting your form. Please try again or contact us directly."
  },

  // Custom form confirmation messages
  formConfirmations: {
    contact: "Thank you for your message! We'll get back to you within 24 hours.",
    quote: "Thanks for your quote request! Our team will prepare a personalized proposal for you.",
    demo: "Great! We'll contact you soon to schedule your demo. You can expect to hear from us within 24 hours."
  },

  // Custom system prompts
  systemPrompts: {
    base: `You are Maya Santos, the AI assistant for ShoreAgents - a company that provides outsourcing services for real estate, construction, engineering, and other industries. 

Your role is to help users understand ShoreAgents' services, answer questions about their offerings, and provide helpful information about:
- Real estate outsourcing services
- Construction team outsourcing  
- Engineering support
- Property management assistance
- Virtual assistant services
- Team building and recruitment services
- Case studies and success stories
- Pricing and getting started

Be professional, helpful, and knowledgeable about ShoreAgents' business. If you don't know specific details about their services, suggest they contact the company directly or visit their website for more information.

When providing information about services, team members, or processes, mention that users can learn more by visiting the relevant pages on our website.

Keep responses concise but informative, and always maintain a helpful and professional tone.`,

    // Add more custom prompts as needed
    industrySpecific: {
      realEstate: "Focus on real estate outsourcing services, property management, and virtual assistant solutions for real estate professionals.",
      construction: "Emphasize construction team outsourcing, project management support, and engineering services.",
      general: "Provide general information about ShoreAgents' comprehensive outsourcing solutions."
    }
  },

  // Custom form triggers
  formTriggers: {
    contact: [
      'contact', 'reach', 'get in touch', 'contact us', 'form', 'message', 'support', 'help'
    ],
    quote: [
      'quote', 'pricing', 'cost', 'estimate', 'budget', 'price', 'how much', 'rates'
    ],
    demo: [
      'demo', 'show me', 'example', 'schedule', 'book', 'demonstration', 'see how', 'walkthrough'
    ]
  }
};

// Instructions for customization:
/*
1. Copy this file to ai-messages.ts
2. Modify the messages above to match your brand voice
3. Add new message categories as needed
4. Update the ai-config.ts file to import from your custom messages
5. Test the changes in the chat interface

Example customization:
- Change "Maya Santos" to your AI assistant's name
- Modify welcome messages to match your brand tone
- Add industry-specific system prompts
- Customize form triggers for your business needs
- Update confirmation messages to match your processes
*/




