import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./JayTalk.css";
import jayAvatar from "../assets/worlds/Jay World.jpeg";

function JayTalk() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [jayMood, setJayMood] = useState("happy");
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState("voice"); // "voice", "text", or "video"

  // Hugging Face API
  const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

  // Initialize camera (optional)
  useEffect(() => {
    if (cameraEnabled) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: chatMode === "video"
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasPermission(true);
          }
        } catch (error) {
          console.error("Camera error:", error);
          setCameraEnabled(false);
        }
      };

      startCamera();

      return () => {
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [cameraEnabled, chatMode]);

  // Load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Get AI response from Hugging Face
  const getAIResponse = async (userMessage) => {
    try {
      const conversationHistory = conversation
        .slice(-6)
        .map(msg => `${msg.type === "user" ? "User" : "Assistant"}: ${msg.text}`)
        .join("\n");

      const prompt = `You are Jay, a friendly, helpful AI companion. You have a warm personality and care about the user. You speak naturally and conversationally.

Conversation so far:
${conversationHistory}

User: ${userMessage}
Jay:`;

      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false,
            do_sample: true
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("API Error:", data.error);
        return "I'm having trouble thinking right now. Can you try again?";
      }

      let aiText = data[0]?.generated_text || "That's interesting! Tell me more!";
      
      // Clean up response
      aiText = aiText.replace(/^Jay:\s*/i, "").trim();
      aiText = aiText.split("\n")[0].trim();
      
      return aiText;
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm sorry, I'm having a bit of trouble processing that. Can you try again?";
    }
  };

  // Speak with natural MALE voice
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;  // Natural speaking speed
      utterance.pitch = 0.9;  // Lower pitch = male voice
      utterance.volume = 1;
      
      // Get available voices and select male voice
      const voices = window.speechSynthesis.getVoices();
      
      // Priority list for male voices
      const maleVoice = voices.find(voice => 
        voice.name.includes('Male') || 
        voice.name.includes('David') || 
        voice.name.includes('James') ||
        voice.name.includes('Daniel') ||
        voice.name.includes('Google US English') ||
        voice.name.includes('Microsoft David') ||
        voice.name.includes('Mark')
      );
      
      if (maleVoice) {
        utterance.voice = maleVoice;
        console.log("Using male voice:", maleVoice.name);
      } else {
        // Fallback to first English voice
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en-US') || voice.lang.includes('en-GB')
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle user message
  const handleUserMessage = async (text) => {
    if (!text.trim()) return;

    setIsLoading(true);
    
    // Add user message
    setConversation(prev => [...prev, { type: "user", text, timestamp: new Date() }]);
    setInputText("");

    // Detect emotion
    const lower = text.toLowerCase();
    if (lower.includes("happy") || lower.includes("great")) setJayMood("happy");
    else if (lower.includes("sad") || lower.includes("bad")) setJayMood("sad");
    else if (lower.includes("angry") || lower.includes("mad")) setJayMood("angry");
    else setJayMood("neutral");

    // Get AI response
    const aiResponse = await getAIResponse(text);
    
    // Add AI response
    setConversation(prev => [...prev, { type: "jay", text: aiResponse, timestamp: new Date() }]);
    
    // Speak if in voice/video mode
    if (chatMode === "voice" || chatMode === "video") {
      setTimeout(() => {
        speak(aiResponse);
      }, 500);
    }

    setIsLoading(false);
  };

  // Voice recognition
  const listenToUser = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setIsListening(false);
        handleUserMessage(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Please use Chrome browser for voice chat!");
    }
  };

  // Send text message
  const sendTextMessage = (e) => {
    e.preventDefault();
    handleUserMessage(inputText);
  };

  // Toggle camera
  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  // Clear conversation
  const clearConversation = () => {
    setConversation([]);
    setJayMood("happy");
    window.speechSynthesis.cancel();
  };

  return (
    <div className="jay-talk-page">
      <button className="jay-talk-back" onClick={() => navigate("/jay")}>
        ← Back to Jay
      </button>

      <div className="jay-talk-container">
        {/* Header */}
        <div className="jay-talk-header">
          <h1>🎥 AI Chat with Jay</h1>
          <p>Chat naturally with Jay! Ask anything - exams, life, jokes, anything!</p>
        </div>

        {/* Mode Selection */}
        <div className="mode-selector">
          <button
            className={`mode-btn ${chatMode === "text" ? "active" : ""}`}
            onClick={() => { setChatMode("text"); setCameraEnabled(false); }}
          >
            💬 Text Only
          </button>
          <button
            className={`mode-btn ${chatMode === "voice" ? "active" : ""}`}
            onClick={() => { setChatMode("voice"); setCameraEnabled(false); }}
          >
            🎤 Voice Only
          </button>
          <button
            className={`mode-btn ${chatMode === "video" ? "active" : ""}`}
            onClick={() => { setChatMode("video"); setCameraEnabled(true); }}
          >
            📹 Video Call
          </button>
        </div>

        {/* Camera Section (Optional) */}
        {(cameraEnabled || chatMode === "video") && (
          <div className="video-call-screen">
            <div className="user-video-section">
              <div className="section-label">You</div>
              <div className="video-feed">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="user-camera"
                />
              </div>
            </div>

            <div className="jay-avatar-section">
              <div className="section-label">
                Jay {isSpeaking ? "🎤 Talking..." : jayMood === "happy" ? "😊" : jayMood === "sad" ? "😔" : "🤔"}
              </div>
              <div className="avatar-container">
                <div className={`jay-avatar ${isSpeaking ? "talking" : ""}`}>
                  <img
                    src={jayAvatar}
                    alt="Jay Avatar"
                    className="jay-avatar-image"
                  />
                  <div className={`mouth-overlay ${isSpeaking ? "moving" : ""}`}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="chat-interface">
          {/* Conversation Log */}
          <div className="conversation-log">
            <div className="log-header">
              <h3>💬 Conversation</h3>
              <button className="clear-btn" onClick={clearConversation}>
                Clear Chat
              </button>
            </div>
            
            {conversation.length === 0 ? (
              <div className="empty-chat">
                <p>👋 Hi! I'm Jay! Ask me anything!</p>
                <p>Try: "How are you?", "How to crack exams?", "Tell me a joke"</p>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div key={index} className={`log-msg ${msg.type}`}>
                  <strong>{msg.type === "user" ? "👤 You" : "🤖 Jay"}:</strong> {msg.text}
                </div>
              ))
            )}

            {isLoading && (
              <div className="log-msg jay loading">
                <strong>🤖 Jay:</strong> Thinking...
              </div>
            )}
            
            {/* Auto-scroll anchor */}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <form onSubmit={sendTextMessage} className="text-input-form">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="message-input"
              />
              <button type="submit" disabled={isLoading || !inputText.trim()} className="send-btn">
                Send
              </button>
            </form>

            <button
              className="mic-button"
              onClick={listenToUser}
              disabled={isListening || isLoading}
            >
              {isListening ? "🎤 Listening..." : "🎤 Speak"}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="status-bar">
          <span>Mode: {chatMode === "text" ? "💬 Text" : chatMode === "voice" ? "🎤 Voice" : "📹 Video"}</span>
          <span>Status: {isLoading ? "Thinking..." : isSpeaking ? "Speaking" : isListening ? "Listening" : "Ready"}</span>
        </div>
      </div>
    </div>
  );
}

export default JayTalk;