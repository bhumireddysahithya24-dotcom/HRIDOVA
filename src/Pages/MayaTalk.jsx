import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MayaSubPage.css';

const MayaTalk = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [isSpeechRecognizing, setIsSpeechRecognizing] = useState(false);
  
  const messagesEndRef = useRef(null);

  const topicData = {
    fashion: {
      icon: '👗',
      title: 'Fashion',
      greeting: "Fashion is so much fun! 👗✨ What kind of style are you feeling today?",
      subtopics: [
        { id: 'outfit', label: 'Help me choose an outfit', response: "Absolutely! 💗 Tell me where you're going and I'll help you put together something that feels like YOU." },
        { id: 'style', label: "I want to discover my style", response: "That's exciting! ✨ Let's explore what makes you feel confident and beautiful. What colors or pieces do you already love?" },
        { id: 'idea', label: 'Give me a fashion idea', response: "Ooh, I love this! 👗 How about trying a monochrome look with different textures? It's chic and so easy to pull off!" },
        { id: 'colors', label: "Let's talk about colors", response: "Yes! Colors are amazing! 💗 What's your favorite color to wear? I can help you find complementary shades that'll make you glow!" }
      ]
    },
    feelings: {
      icon: '💖',
      title: 'Feelings',
      greeting: "Of course. 💗 You can talk to me about how you're feeling.",
      subtopics: [
        { id: 'happy', label: "I'm feeling happy", response: "That makes me so happy to hear! 🌸 Happiness looks beautiful on you. Want to share what's making you smile?" },
        { id: 'sad', label: "I'm feeling sad", response: "Thank you for sharing that with me. 💗 Want to tell me a little more about what happened? I'm here to listen." },
        { id: 'stressed', label: "I'm feeling stressed", response: "I hear you. 💗 Stress can feel so heavy. Want to talk about what's on your mind? Sometimes just sharing helps." },
        { id: 'listen', label: "I just want someone to listen", response: "I'm here for you. 💗 Take your time. I'm listening with my whole heart." },
        { id: 'confused', label: "I don't know how I feel", response: "That's totally okay. 💗 Feelings can be confusing sometimes. We can just sit with that uncertainty together." }
      ]
    },
    ideas: {
      icon: '✨',
      title: 'Ideas',
      greeting: "Let's create something! ✨ What are you thinking about?",
      subtopics: [
        { id: 'creative', label: 'Give me a creative idea', response: "Ooh! ✨ How about starting a vision board? You can collect images, quotes, and colors that inspire you!" },
        { id: 'project', label: "I want to start a project", response: "That's amazing! 💗 What kind of project? A creative hobby, learning something new, or maybe organizing something?" },
        { id: 'inspiration', label: "I need inspiration", response: "Let me share something! ✨ Sometimes the best inspiration comes from trying something completely new. What's one thing you've always wanted to try?" },
        { id: 'imagine', label: "Let's imagine something", response: "Yes! ✨ Let's dream together. If you could create any world, what would it look like? What colors, what feelings?" }
      ]
    },
    fun: {
      icon: '🌞',
      title: 'Something Fun',
      greeting: "Let's have some fun! 🌞✨ What sounds good?",
      subtopics: [
        { id: 'joke', label: 'Tell me a joke', response: "Okay! 😄 Why don't scientists trust atoms? Because they make up everything! 👗✨" },
        { id: 'wouldyou', label: 'Would you rather?', response: "Would you rather have a magical wardrobe that creates any outfit you imagine 👗 or a room that changes into any place you dream of? ✨" },
        { id: 'quiz', label: 'Quick quiz', response: "Fun! ✨ Quick question: What's your go-to outfit when you want to feel confident? A) Bold colors B) Comfy classics C) Something sparkly D) All of the above! 💗" },
        { id: 'challenge', label: 'Give me a challenge', response: "I've got one! 🌞 Today, try wearing or doing something that makes you feel like the main character. Even if it's just for you! ✨" },
        { id: 'surprising', label: 'Tell me something surprising', response: "Here's something cool! ✨ Did you know that the color you wear can actually affect your mood? Pink can boost feelings of kindness and warmth! 💗" }
      ]
    }
  };

  const demoResponses = [
    "That sounds lovely! 💗 Tell me more.",
    "I'm listening. You can tell me anything. ✨",
    "Oh, I like that idea! 👗",
    "That sounds interesting! What happened next?",
    "I'm happy you shared that with me. 🌸",
    "You're doing great! Keep going. 💖",
    "That's wonderful! I'd love to hear more. ✨",
    "Thank you for sharing that with me. 💗"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onend = () => {
        setIsSpeechRecognizing(false);
      };

      recognition.onerror = () => {
        setIsSpeechRecognizing(false);
      };

      setSpeechRecognition(recognition);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMayaResponse = () => {
    const randomIndex = Math.floor(Math.random() * demoResponses.length);
    return demoResponses[randomIndex];
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
    setConversation([
      { id: Date.now(), text: topicData[topic].greeting, sender: 'maya', timestamp: new Date() }
    ]);
  };

  const handleSubtopicSelect = (subtopic) => {
    setSelectedSubtopic(subtopic.id);
    setConversation(prev => [
      ...prev,
      { id: Date.now(), text: subtopic.label, sender: 'user', timestamp: new Date() },
      { id: Date.now() + 1, text: subtopic.response, sender: 'maya', timestamp: new Date() }
    ]);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedSubtopic(null);
    setConversation([]);
  };

  const handleBackToMaya = () => {
    navigate('/maya');
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setConversation(prev => [...prev, newUserMessage]);
    setInputText('');

    setTimeout(() => {
      const mayaResponse = {
        id: Date.now() + 1,
        text: getMayaResponse(),
        sender: 'maya',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, mayaResponse]);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeechRecognition = () => {
    if (!speechRecognition) return;

    if (isSpeechRecognizing) {
      speechRecognition.stop();
      setIsSpeechRecognizing(false);
    } else {
      setIsSpeechRecognizing(true);
      speechRecognition.start();
    }
  };

  const formatMessageTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="maya-talk-page">
      <button className="talk-back-button" onClick={handleBackToMaya}>
        ← Back to Maya
      </button>

      {!selectedTopic ? (
        /* Main Topic Selection Screen */
        <div className="talk-main-content">
          <div className="talk-header">
            <div className="talk-microphone">🎤</div>
            <h1 className="talk-title">Talk with Maya</h1>
            <p className="talk-subtitle">Maya is ready to spend some time with you. 💗</p>
          </div>

          <div className="talk-card">
            <div className="talk-dress-icon">👗</div>
            <h2 className="talk-maya-name">MAYA</h2>
            <h3 className="talk-maya-greeting">Hi! I'm Maya! ✨</h3>
            <p className="talk-maya-question">What would you like to talk about today?</p>

            <div className="talk-topic-buttons">
              <button 
                className="talk-topic-btn fashion-btn" 
                onClick={() => handleTopicSelect('fashion')}
              >
                👗 Fashion
              </button>
              <button 
                className="talk-topic-btn feelings-btn" 
                onClick={() => handleTopicSelect('feelings')}
              >
                💖 Feelings
              </button>
              <button 
                className="talk-topic-btn ideas-btn" 
                onClick={() => handleTopicSelect('ideas')}
              >
                ✨ Ideas
              </button>
              <button 
                className="talk-topic-btn fun-btn" 
                onClick={() => handleTopicSelect('fun')}
              >
                🌞 Something Fun
              </button>
            </div>
          </div>

          <div className="talk-input-section">
            <input
              type="text"
              className="talk-input"
              placeholder="Say something to Maya..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {speechRecognition && (
              <button
                className={`talk-speech-btn ${isSpeechRecognizing ? 'listening' : ''}`}
                onClick={toggleSpeechRecognition}
                title="Voice to Text"
                type="button"
              >
                🎙
              </button>
            )}
            <button
              className="talk-send-btn"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              type="button"
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        /* Topic Conversation Screen */
        <div className="talk-conversation-content">
          <button className="talk-back-topics-btn" onClick={handleBackToTopics}>
            ← Back to Topics
          </button>

          <div className="talk-conversation-header">
            <div className="talk-topic-icon">{topicData[selectedTopic].icon}</div>
            <h1 className="talk-topic-title">{topicData[selectedTopic].title}</h1>
          </div>

          <div className="talk-conversation-area">
            <div className="talk-messages-container">
              {conversation.map((message) => (
                <div
                  key={message.id}
                  className={`talk-message ${message.sender === 'user' ? 'user-talk-message' : 'maya-talk-message'}`}
                >
                  {message.sender === 'maya' && (
                    <div className="talk-message-avatar">👗</div>
                  )}
                  <div className="talk-message-body">
                    <div className="talk-message-bubble">
                      <p className="talk-message-text">{message.text}</p>
                    </div>
                    <span className="talk-message-time">{formatMessageTime(message.timestamp)}</span>
                  </div>
                  {message.sender === 'user' && (
                    <div className="talk-message-avatar-user">👤</div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {!selectedSubtopic ? (
            <div className="talk-subtopics-container">
              <p className="talk-subtopics-title">Choose a topic:</p>
              <div className="talk-subtopics-list">
                {topicData[selectedTopic].subtopics.map((subtopic) => (
                  <button
                    key={subtopic.id}
                    className="talk-subtopic-btn"
                    onClick={() => handleSubtopicSelect(subtopic)}
                  >
                    {subtopic.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="talk-continue-section">
              <p className="talk-continue-text">Keep talking with Maya...</p>
              <div className="talk-input-section">
                <input
                  type="text"
                  className="talk-input"
                  placeholder="Say something to Maya..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {speechRecognition && (
                  <button
                    className={`talk-speech-btn ${isSpeechRecognizing ? 'listening' : ''}`}
                    onClick={toggleSpeechRecognition}
                    title="Voice to Text"
                    type="button"
                  >
                    🎙
                  </button>
                )}
                <button
                  className="talk-send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  type="button"
                >
                  ➤
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MayaTalk;