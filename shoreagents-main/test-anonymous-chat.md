# Anonymous User Chat Test Guide

## How to Test the Enhanced AI Chat with Anonymous Users

### 🎯 **What's New:**
The Chat With Maya interface now includes **real AI analysis** that detects when anonymous users need to provide contact information and Maya will politely ask for it.

### 🧪 **Testing Steps:**

#### **1. Open Anonymous Browser:**
- Open a new incognito/private browser window
- Navigate to your ShoreAgents website
- Open the Chat With Maya console (floating widget)

#### **2. Test Scenarios:**

##### **Scenario A: Anonymous User Asking for Pricing**
1. **Type:** "I need pricing for a team of 5 developers"
2. **Expected:** Maya should respond with pricing info AND politely ask for contact details
3. **Maya should say something like:** "I'd love to help you with that! Could I get your name and email so I can provide you with more personalized assistance?"

##### **Scenario B: Anonymous User After 3+ Messages**
1. **Type:** "Hello"
2. **Type:** "Tell me about your services"
3. **Type:** "What can you help me with?"
4. **Expected:** After 3+ messages, Maya should naturally ask for contact information
5. **Maya should say something like:** "To give you the best service, may I have your name and email address?"

##### **Scenario C: Anonymous User Asking for Talent**
1. **Type:** "I need to hire some engineers"
2. **Expected:** Maya should respond about talent services AND ask for contact info
3. **Maya should say something like:** "I'd be happy to help you with talent acquisition. Could you share your name and email so I can connect you with our recruitment team?"

### 🤖 **AI Analysis Features:**

#### **Automatic Detection:**
- ✅ **Anonymous users** without contact info
- ✅ **Engaged users** (3+ messages) without contact info  
- ✅ **Quote requests** without contact info
- ✅ **Talent requests** without contact info

#### **Natural Conversation:**
- ✅ **Polite requests** for contact information
- ✅ **Contextual reasons** for asking (personalized service, detailed quotes, etc.)
- ✅ **No form-like feeling** - feels like genuine help

### 🎉 **Expected Behavior:**

#### **Before (Old System):**
- Maya would just answer questions
- No contact information collection
- No personalized follow-up

#### **After (New System):**
- Maya analyzes user type and conversation context
- Automatically detects when contact info is needed
- Politely and naturally asks for contact details
- Provides personalized reasons for asking

### 🔍 **What to Look For:**

1. **Natural Language:** Maya's requests should feel conversational, not like a form
2. **Contextual Reasons:** Maya should explain WHY she needs the contact info
3. **Timing:** Maya should ask at the right moment (not too early, not too late)
4. **Persistence:** Maya should ask again if the user doesn't provide contact info

### 📝 **Test Notes:**
- The system works with **real AI analysis** using Anthropic Claude
- It analyzes conversation history, user type, and intent
- It only asks for contact info when it makes sense contextually
- The requests are generated dynamically, not hardcoded

### 🚀 **Ready to Test!**
Open an anonymous browser and start chatting with Maya to see the enhanced AI analysis in action!
