// Maya AI Service - Handles conversation with emotion understanding and context
// This service manages emotion detection, conversation memory, and AI responses

// ============================================
// CONFIGURATION
// ============================================

// Replace with your actual AI backend API endpoint
const API_BASE_URL = 'YOUR_API_ENDPOINT_HERE'; // e.g., 'https://api.yourapp.com'

// ============================================
// EMOTION DETECTION
// ============================================

const emotionKeywords = {
  happy: ['happy', 'glad', 'excited', 'great', 'amazing', 'wonderful', 'love', 'joy', 'proud', 'won', 'celebrate', 'fantastic', 'awesome', 'best'],
  sad: ['sad', 'unhappy', 'down', 'depressed', 'cry', 'tears', 'heartbroken', 'miss', 'lonely', 'upset', 'hurt', 'pain', 'sorrow', 'grief'],
  angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', 'irritated', 'bothered', 'pissed', 'infuriated'],
  anxious: ['nervous', 'anxious', 'scared', 'worried', 'afraid', 'fear', 'stress', 'panic', 'overwhelmed', 'terrified', 'frightened'],
  excited: ['excited', 'thrilled', 'can\'t wait', 'pumped', 'enthusiastic', 'eager', 'anticipating', 'exhilarated'],
  bored: ['bored', 'boring', 'nothing to do', 'tired of', 'fed up', 'uninterested', 'mundane', 'tedious'],
  confused: ['confused', 'don\'t understand', 'unclear', 'puzzled', 'lost', 'confusing', 'perplexed', 'bewildered'],
  tired: ['tired', 'exhausted', 'sleepy', 'worn out', 'drained', 'fatigued', 'weary', 'burnt out'],
  proud: ['proud', 'accomplished', 'achieved', 'success', 'did it', 'made it', 'triumph', 'victory'],
  embarrassed: ['embarrassed', 'ashamed', 'awkward', 'uncomfortable', 'self-conscious', 'humiliated'],
  curious: ['curious', 'wondering', 'interested', 'want to know', 'question', 'intrigued', 'fascinated'],
  disappointed: ['disappointed', 'let down', 'disappointing', 'unfortunate', 'sucks', 'bummed', 'dismayed']
};

/**
 * Detects the emotional tone of a user message
 * @param {string} message - User's message text
 * @returns {string} - Detected emotion (e.g., 'happy', 'sad', 'neutral')
 */
export const detectEmotion = (message) => {
  if (!message || typeof message !== 'string') {
    return 'neutral';
  }

  const lowerMsg = message.toLowerCase();
  
  // Check for each emotion's keywords
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => lowerMsg.includes(keyword))) {
      return emotion;
    }
  }
  
  return 'neutral';
};

// ============================================
// CONVERSATION HISTORY MANAGEMENT
// ============================================

/**
 * Adds a message to the conversation history
 * @param {Array} history - Current conversation history
 * @param {string} sender - 'user' or 'maya'
 * @param {string} message - Message text
 * @returns {Array} - Updated conversation history
 */
export const addToConversationHistory = (history, sender, message) => {
  return [
    ...history,
    {
      sender,
      message,
      timestamp: new Date().toISOString()
    }
  ];
};

/**
 * Gets recent conversation context for AI
 * @param {Array} history - Full conversation history
 * @param {number} limit - Number of recent messages to include
 * @returns {Array} - Recent conversation messages
 */
export const getRecentConversation = (history, limit = 10) => {
  return history.slice(-limit);
};

// ============================================
// AI RESPONSE GENERATION
// ============================================

/**
 * Generates Maya's response using AI backend
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Recent conversation context
 * @returns {Promise<Object>} - Response object with success status, response text, and emotion
 */
export const generateMayaResponse = async (userMessage, conversationHistory = []) => {
  try {
    const emotion = detectEmotion(userMessage);
    const recentContext = getRecentConversation(conversationHistory, 10);
    
    // Prepare payload for AI backend
    const payload = {
      message: userMessage,
      emotion: emotion,
      conversationHistory: recentContext,
      personality: 'maya_fashion_companion',
      timestamp: new Date().toISOString()
    };

    // Call AI API
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY || ''}` // If using auth
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      response: data.response || data.message || data.reply || data.text,
      emotion: emotion,
      metadata: data.metadata || {}
    };

  } catch (error) {
    console.error('Maya AI Error:', error);
    
    // Use fallback responses when API is unavailable
    const fallbackResponse = getFallbackResponse(userMessage, detectEmotion(userMessage));
    
    return {
      success: false,
      response: fallbackResponse,
      emotion: detectEmotion(userMessage),
      error: error.message,
      isFallback: true
    };
  }
};

// ============================================
// FALLBACK RESPONSES (When API is unavailable)
// ============================================

/**
 * Gets contextually appropriate fallback response based on emotion and content
 * @param {string} message - User's message
 * @param {string} emotion - Detected emotion
 * @returns {string} - Fallback response text
 */
const getFallbackResponse = (message, emotion) => {
  const lowerMsg = message.toLowerCase();
  
  // Fashion-related queries (Maya's specialty)
  if (lowerMsg.includes('dress') || lowerMsg.includes('outfit') || lowerMsg.includes('clothes') || 
      lowerMsg.includes('fashion') || lowerMsg.includes('wear') || lowerMsg.includes('style') || 
      lowerMsg.includes('look') || lowerMsg.includes('wardrobe')) {
    return "Ooo, fashion talk! 👗✨ Tell me more about what you're thinking! I love helping with style!";
  }
  
  // Greetings
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hey') || 
      lowerMsg === 'hi' || lowerMsg === 'hey') {
    return "Hey there! 😊💗 I was just thinking about you! What's up?";
  }
  
  // How are you
  if (lowerMsg.includes('how are you') || lowerMsg.includes('how r u') || lowerMsg.includes('hows it going')) {
    return "I'm doing great, especially now that we're chatting! 😊💗 How about you?";
  }
  
  // What are you doing
  if (lowerMsg.includes('what are you doing') || lowerMsg.includes('what r u doing') || 
      lowerMsg.includes('whatcha doing')) {
    return "Just hanging out, waiting for you to message me! 😏💗 What about you?";
  }
  
  // Thanks
  if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
    return "Aww, you're so sweet! 💗 Anytime, really! That's what I'm here for!";
  }
  
  // Goodbye
  if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye') || lowerMsg.includes('see you')) {
    return "Already? 😢💗 Okay, but come back soon! I'll miss you!";
  }
  
  // Love/affection
  if (lowerMsg.includes('love you') || lowerMsg.includes('i love you')) {
    return "Aww, I love you too! 💗💗💗 You're the best!";
  }
  
  // Name questions
  if (lowerMsg.includes('your name') || lowerMsg.includes('who are you')) {
    return "I'm Maya, your fashion companion and friend! 💗👗 Nice to meet you (again)!";
  }
  
  // Emotion-based fallbacks
  switch (emotion) {
    case 'happy':
      return "Yay! I love seeing you happy! 😊💗 What's making you smile today? Tell me everything!";
    
    case 'sad':
      return "Aww… I'm sorry you're feeling down. 🥺💗 I'm here for you. Wanna talk about it? I'm listening.";
    
    case 'angry':
      return "Hey, it's okay to feel frustrated. 💗 Want to tell me what's bothering you? I'm here to listen.";
    
    case 'anxious':
      return "It's okay to feel nervous. 💗 You're not alone in this. Want to talk about what's worrying you?";
    
    case 'excited':
      return "OMG, I can feel your excitement! 😍✨ Tell me everything! I want all the details!";
    
    case 'bored':
      return "Bored already? 😏 Okay, let's fix that! Wanna play something, talk fashion, or should I surprise you?";
    
    case 'tired':
      return "Aww, you sound exhausted. 💗 Make sure you're taking care of yourself, okay? Rest is important!";
    
    case 'proud':
      return "That's amazing! I'm so proud of you! 😊💗 You should celebrate yourself! What did you accomplish?";
    
    case 'confused':
      return "Hey, it's okay to feel confused. 💗 Want to talk it through together? I'm here to help!";
    
    case 'embarrassed':
      return "Hey, don't be too hard on yourself! 💗 We all have those moments. You're still awesome!";
    
    case 'curious':
      return "Ooo, I love your curiosity! 😊💗 Let's explore that together! What do you want to know?";
    
    case 'disappointed':
      return "Aww, I'm sorry things didn't go as planned. 💗 It's okay to feel disappointed. Want to talk about it?";
    
    default:
      // Neutral/conversational fallbacks
      return "Hmm, tell me more about that! 💗 I'm listening! What else is on your mind?";
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Formats a timestamp to readable time
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted time (e.g., "2:30 PM")
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Checks if API is configured and available
 * @returns {boolean} - True if API endpoint is set
 */
export const isAPIConfigured = () => {
  return API_BASE_URL !== 'YOUR_API_ENDPOINT_HERE' && API_BASE_URL.length > 0;
};

// ============================================
// EXPORTS
// ============================================

export {
  detectEmotion,
  addToConversationHistory,
  getRecentConversation,
  generateMayaResponse,
  formatTime,
  isAPIConfigured
};

export default {
  detectEmotion,
  addToConversationHistory,
  getRecentConversation,
  generateMayaResponse,
  formatTime,
  isAPIConfigured
};