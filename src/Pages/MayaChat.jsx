import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MayaChat.css';

const MayaChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Maya. 💗 What would you like to talk about?", sender: 'maya', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [permissionError, setPermissionError] = useState('');
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [isSpeechRecognizing, setIsSpeechRecognizing] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioChunksRef = useRef([]);

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
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

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

  const sendMessage = (text = null, isVoice = false, voiceUrl = null) => {
    const messageText = text || inputText;
    
    if (!messageText && !isVoice) return;
    if (isVoice && !voiceUrl) return;

    const newUserMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      isVoice: isVoice,
      voiceUrl: voiceUrl
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');

    if (audioUrl) {
      setAudioUrl(null);
      setAudioBlob(null);
    }

    setTimeout(() => {
      const mayaResponse = {
        id: Date.now() + 1,
        text: getMayaResponse(),
        sender: 'maya',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, mayaResponse]);
    }, 1000 + Math.random() * 1000);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const startRecording = async () => {
    setPermissionError('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Microphone permission was denied. Please enable it in your browser settings to use voice chat. 🎤');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('No microphone found. Please connect a microphone to use voice chat. 🎤');
      } else {
        setPermissionError('Unable to access microphone. Please check your browser settings. 🎤');
      }
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const sendVoiceMessage = () => {
    if (audioUrl) {
      sendMessage('Voice message', true, audioUrl);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMessageTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="maya-chat-page">
      <div className="maya-chat-container">
        {/* Header Section */}
        <div className="chat-header">
          <button className="back-button" onClick={() => navigate('/maya')}>
            ← Back to Maya
          </button>
          
          <div className="header-content">
            <div className="maya-avatar-header">👗</div>
            <h1 className="maya-name-header">Maya</h1>
            <p className="chat-subtitle">Talk, type, or use your voice. Maya is listening. 💗</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-area" ref={chatContainerRef}>
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.sender === 'user' ? 'user-message-wrapper' : 'maya-message-wrapper'}`}
              >
                {message.sender === 'maya' && (
                  <div className="message-avatar">👗</div>
                )}
                <div className="message-body">
                  {message.isVoice ? (
                    <div className="voice-message-bubble">
                      <audio controls src={message.voiceUrl} className="voice-audio" />
                      <span className="voice-label">🎤 Voice message</span>
                    </div>
                  ) : (
                    <div className="message-bubble">
                      <p className="message-text">{message.text}</p>
                    </div>
                  )}
                  <span className="message-time">{formatMessageTime(message.timestamp)}</span>
                </div>
                {message.sender === 'user' && (
                  <div className="message-avatar-user">👤</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} className="messages-spacer" />
          </div>
        </div>

        {/* Permission Error */}
        {permissionError && (
          <div className="permission-error">
            <p>{permissionError}</p>
            <button onClick={() => setPermissionError('')} className="dismiss-error">Dismiss</button>
          </div>
        )}

        {/* Voice Preview */}
        {audioUrl && !isRecording && (
          <div className="voice-preview">
            <div className="preview-content">
              <audio controls src={audioUrl} className="preview-audio" />
              <div className="preview-actions">
                <button onClick={sendVoiceMessage} className="send-voice-btn">
                  ➤ Send
                </button>
                <button onClick={handleDeleteRecording} className="delete-voice-btn">
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="input-area">
          {speechRecognition && (
            <button
              className={`speech-btn ${isSpeechRecognizing ? 'listening' : ''}`}
              onClick={toggleSpeechRecognition}
              title="Voice to Text"
              type="button"
            >
              🎙
            </button>
          )}
          
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message to Maya..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isRecording}
          />
          
          <button
            className={`mic-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
            type="button"
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          
          {isRecording && (
            <div className="recording-indicator">
              <span className="recording-dot"></span>
              <span className="recording-text">Recording... {formatTime(recordingTime)}</span>
            </div>
          )}
          
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || isRecording}
            type="button"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default MayaChat;