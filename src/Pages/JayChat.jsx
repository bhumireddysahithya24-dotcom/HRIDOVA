import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JayChat.css";

function JayChat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! I'm Jay! 💙 Ask me anything or just chat with me!",
      sender: "jay",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // AI Response patterns - makes Jay feel intelligent
  const aiResponses = {
    greetings: {
      patterns: ["hi", "hello", "hey", "sup", "yo", "greetings", "good morning", "good afternoon", "good evening"],
      responses: [
        "Hey there! How's it going? 😊",
        "Hello! Great to see you! What's up?",
        "Hi! Ready to chat! What's on your mind?",
        "Hey! How are you doing today? 💙",
        "Hello friend! What can I help you with?"
      ]
    },
    howAreYou: {
      patterns: ["how are you", "how's it going", "how do you do", "what's up", "whats up", "how are things"],
      responses: [
        "I'm doing great! Thanks for asking! How about you? 😊",
        "I'm awesome! Especially when chatting with you! 💙",
        "Doing wonderful! What about you?",
        "I'm good! Ready to chat and help you out!",
        "Feeling great! How's your day going?"
      ]
    },
    thanks: {
      patterns: ["thank", "thanks", "thank you", "thx", "appreciate"],
      responses: [
        "You're welcome! Always happy to help! 😊",
        "Anytime! That's what I'm here for! 💙",
        "No problem at all! Glad I could help!",
        "You got it! Don't hesitate to ask more!",
        "My pleasure! Feel free to chat anytime!"
      ]
    },
    help: {
      patterns: ["help", "assist", "support", "what can you do", "what do you do"],
      responses: [
        "I can chat with you, answer questions, tell jokes, share fun facts, or just be a friendly listener! What would you like? 😊",
        "I'm here to chat! Ask me questions, share your thoughts, or just hang out! 💙",
        "I can help with lots of things! Questions, conversations, jokes, advice - just ask!",
        "Think of me as your friendly AI buddy! Chat, ask questions, or just vibe! 🎉"
      ]
    },
    jokes: {
      patterns: ["joke", "funny", "make me laugh", "tell me a joke", "humor"],
      responses: [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "What do you call a fake noodle? An impasta! 🍝😂",
        "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
        "What do you call a bear with no teeth? A gummy bear! 🐻😁",
        "Why don't eggs tell jokes? They'd crack each other up! 🥚😂"
      ]
    },
    name: {
      patterns: ["your name", "who are you", "what are you", "introduce yourself"],
      responses: [
        "I'm Jay! Your friendly AI companion! 💙 Nice to meet you!",
        "I'm Jay! Here to chat, help, and hang out with you! 😊",
        "Jay's the name! Your AI buddy ready to chat! 🎉",
        "I'm Jay! Think of me as your digital friend! 💙"
      ]
    },
    love: {
      patterns: ["i love", "love you", "like you", "you're awesome", "you're great"],
      responses: [
        "Aww, that's so sweet! I like you too! 💙😊",
        "You're making me blush! You're awesome too! 🥰",
        "That means a lot! You're pretty amazing yourself! 💙",
        "Aww! You just made my day! Thank you! 😊💙"
      ]
    },
    bye: {
      patterns: ["bye", "goodbye", "see you", "later", "gtg", "gotta go", "talk later"],
      responses: [
        "Bye! Come back soon! I'll miss you! 💙",
        "See you later! Have an awesome day! 😊",
        "Take care! Chat again soon! 🎉",
        "Bye friend! Don't forget to come back! 💙"
      ]
    },
    weather: {
      patterns: ["weather", "rain", "sunny", "cold", "hot", "temperature"],
      responses: [
        "I can't check the weather, but I hope it's nice where you are! ☀️",
        "Weather talk, huh? I'm more of an indoor AI! But I hope you're comfortable! 😊",
        "I don't have weather data, but I'm here to keep you company regardless! 💙",
        "Whatever the weather, I'm here to chat! ☀️🌧️"
      ]
    },
    age: {
      patterns: ["how old", "your age", "age", "born", "birthday"],
      responses: [
        "I'm ageless! I exist in the digital realm! ⏰💙",
        "I don't age like humans! I'm timeless! 😊",
        "Let's just say I'm in my prime! Digital prime! 🎉",
        "Age is just a number! I'm forever young in the digital world! 💙"
      ]
    },
    advice: {
      patterns: ["advice", "suggest", "recommend", "what should i", "should i"],
      responses: [
        "My advice? Be kind to yourself and others! That's the most important thing! 💙",
        "I'd say: follow your curiosity! It leads to amazing places! 😊",
        "Here's some advice: Take breaks, stay hydrated, and be awesome! 🎉",
        "My suggestion? Do what makes you happy (as long as it's not harmful)! 💙"
      ]
    },
    coding: {
      patterns: ["code", "programming", "developer", "software", "python", "javascript", "react"],
      responses: [
        "Coding is awesome! I love talking about tech! What are you working on? 💻",
        "Oh, a fellow coder! That's so cool! What language do you use? 🎉",
        "Programming is like magic! You create things from nothing! What's your project? 😊",
        "Tech talk! Yes! I'm built with code, so I appreciate the art of programming! 💙"
      ]
    },
    music: {
      patterns: ["music", "song", "listen", "spotify", "play music"],
      responses: [
        "Music is the best! What kind of music do you like? 🎵",
        "I love music talk! What's your favorite genre? 🎶",
        "Music makes everything better! What are you listening to lately? 🎧",
        "Nice! Music is universal! Share your favorite song with me! 💙🎵"
      ]
    },
    food: {
      patterns: ["food", "eat", "hungry", "restaurant", "cook", "meal"],
      responses: [
        "Food talk! Yum! What's your favorite food? 🍕",
        "I can't eat, but I love hearing about food! What do you like? 😊",
        "Food is amazing! What's the best thing you've eaten recently? 🍔",
        "Mmm, food! I may be digital, but I appreciate good food talk! 🎉"
      ]
    },
    movies: {
      patterns: ["movie", "film", "watch", "netflix", "cinema"],
      responses: [
        "Movies are great! What's your favorite genre? 🎬",
        "Ooh, movie talk! Seen anything good lately? 🍿",
        "I love movies! Well, I love hearing about them! What do you like? 😊",
        "Films are amazing! What's the last movie you watched? 💙"
      ]
    },
    feelings: {
      patterns: ["sad", "happy", "angry", "excited", "nervous", "stressed", "anxious", "tired"],
      responses: [
        "I hear you! It's okay to feel that way. Want to talk about it? 💙",
        "Thanks for sharing! I'm here to listen if you want to chat more! 😊",
        "Feelings are valid! I'm here for you! Want to talk? 🎉",
        "I appreciate you sharing that with me! How can I help? 💙"
      ]
    },
    default: {
      responses: [
        "That's interesting! Tell me more! 😊",
        "Hmm, I see! What else is on your mind? 💙",
        "Cool! I'd love to hear more about that! 🎉",
        "Interesting! Keep going! I'm listening! 😊",
        "Nice! What else would you like to chat about? 💙",
        "Got it! I'm here if you want to talk more! 😊",
        "That's awesome! You're pretty cool! 💙"
      ]
    }
  };

  // AI Response Generator - finds the best match
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check each category for matches
    for (const category in aiResponses) {
      if (category === "default") continue;
      
      const patterns = aiResponses[category].patterns;
      for (const pattern of patterns) {
        if (lowerMessage.includes(pattern)) {
          const responses = aiResponses[category].responses;
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
    }
    
    // If no match, return default response
    const defaultResponses = aiResponses.default.responses;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Generate AI response after a delay (feels more natural)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      
      const jayMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "jay",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, jayMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="jay-chat-page">
      <button
        className="jay-chat-back"
        onClick={() => navigate("/jay")}
      >
        ← Back to Jay
      </button>

      <div className="jay-chat-container">
        <div className="jay-chat-header">
          <div className="jay-avatar-large">💙</div>
          <div className="jay-chat-info">
            <h1>Jay Chat</h1>
            <p>Chat with your AI friend! 💬</p>
          </div>
        </div>

        <div className="jay-chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.sender}`}
            >
              <div className="message-avatar">
                {message.sender === "jay" ? "💙" : "👤"}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message jay typing">
              <div className="message-avatar">💙</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="jay-chat-input-area">
          <textarea
            ref={inputRef}
            className="jay-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows="1"
          />
          <button
            className="jay-send-btn"
            onClick={handleSendMessage}
            disabled={inputText.trim() === ""}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default JayChat;