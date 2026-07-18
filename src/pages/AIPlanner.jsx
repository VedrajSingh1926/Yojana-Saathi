import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Mic, Plus, MessageSquare, Bookmark, History, Users, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { translations } from '../data/translations';

export default function AIPlanner({ initialPrompt, user, lang }) {
  const [chat, setChat] = useState([
    { id: 1, sender: 'system', text: "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you." }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const API_URL = import.meta.env.VITE_API_URL || '';

  const t = translations[lang] || translations.en;

  useEffect(() => {
    // Translate the initial welcome message when language changes
    setChat(prev => {
      if (prev.length === 1 && prev[0].sender === 'system' && prev[0].id === 1) {
        return [{ id: 1, sender: 'system', text: lang === 'hi' ? "नमस्ते! मैं योजना साथी का एआई कल्याण योजनाकार हूं। आपके परिवार को किस चीज़ की आवश्यकता है, इसका वर्णन करें या नीचे दिए गए कार्डों में से एक चुनें, और मैं आपके लिए एक रोडमैप तैयार करूँगा।" : "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you." }];
      }
      return prev;
    });
  }, [lang]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, typing]);

  const starters = [
    { text: t.starter1 || 'I want to build my first house', icon: '🏠', desc: t.starter1Desc || 'AI will analyze PMAY and state housing subsidies.' },
    { text: t.starter2 || 'My daughter needs a scholarship to study engineering', icon: '🎓', desc: t.starter2Desc || 'AI finds national higher education student waivers.' },
    { text: t.starter3 || 'I want to start a dairy business in my village', icon: '🚜', desc: t.starter3Desc || 'AI maps mudra loans, dairy enterprise schemes.' },
    { text: t.starter4 || 'My father is turning 60 this month and has no pension', icon: '👴', desc: t.starter4Desc || 'AI links pension funds and health insurance plans.' }
  ];

  const handleVoiceInput = async () => {
    if (isListening) {
      if (mediaRecorder.current) mediaRecorder.current.stop();
      setIsListening(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');
        formData.append('language', lang);

        setInput(t.transcribing || 'Transcribing via Gnani...');
        try {
          const response = await fetch(`${API_URL}/api/ai/stt`, { method: 'POST', body: formData });
          const data = await response.json();
          if (data.success) {
            setInput(data.transcript);
            handleSendPrompt(data.transcript);
          } else {
            alert('Speech to text failed: ' + data.message);
            setInput('');
          }
        } catch (err) {
          console.error(err);
          alert('Error connecting to STT service.');
          setInput('');
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsListening(true);
      setInput(t.listening || 'Listening via Gnani.ai... (Click mic to stop)');
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Could not access microphone.');
    }
  };

  const handleSendPrompt = async (promptText) => {
    if (!promptText.trim()) return;

    // Add user message
    const userMsgId = Date.now();
    setChat(prev => [...prev, { id: userMsgId, sender: 'user', text: promptText }]);
    setInput('');
    setTyping(true);

    const requestBody = { prompt: promptText, user, lang };

    try {
      const res = await fetch(`${API_URL}/api/ai/planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await res.json();
      setTyping(false);
      
      if (data.success) {
        let replyText = typeof data.reply === 'object' && data.reply !== null
          ? data.reply.text || JSON.stringify(data.reply, null, 2)
          : data.reply;
          
        setChat(prev => [...prev, { 
          id: Date.now(), 
          sender: 'system', 
          text: replyText
        }]);

        // Auto-play the response text via Gnani TTS
        if (replyText) {
          try {
            const ttsRes = await fetch(`${API_URL}/api/ai/tts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: replyText, language: lang })
            });
            if (ttsRes.ok) {
              const audioBlob = await ttsRes.blob();
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              audio.play().catch(e => console.error("Audio playback prevented:", e));
            } else {
              console.error("TTS returned error:", await ttsRes.text());
            }
          } catch (ttsErr) {
            console.error("Failed to fetch TTS:", ttsErr);
          }
        }
      } else {
        setChat(prev => [...prev, { id: Date.now(), sender: 'system', text: "Error: " + (data.message || data.error) }]);
      }
    } catch (err) {
      setTyping(false);
      setChat(prev => [...prev, { id: Date.now(), sender: 'system', text: "Network error communicating with AI Planner." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendPrompt(input);
    }
  };

  return (
    <div className="view-section planner-view-section animate-fade-in" style={{ padding: '1.5rem 1rem 0 1rem' }}>
      <div className="planner-hero" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span className="pill-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', fontWeight: '600' }}><Sparkles size={14} style={{ marginRight: '6px' }} /> {t.plannerBadge || 'Personal AI Welfare Advisor'}</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>{t.plannerTitle || 'Plan Your Government Journey'}</h1>
        <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.5' }}>{t.plannerSubtitle || 'Describe what your household needs or plans, and our AI will map out a roadmap of schemes you should target, how to prepare documents, and when to apply.'}</p>
      </div>

      <div className="gpt-layout-container">
        {/* Left Sidebar */}
        <div className="gpt-sidebar glass-card" style={{ padding: '1.25rem' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', borderRadius: '12px' }} onClick={() => setChat([chat[0]])}>
            <Plus size={18} /> New Planning Session
          </motion.button>
          
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>History</span>
            <button className="gpt-sidebar-btn active"><MessageSquare size={16} /> Current Session</button>
            <button className="gpt-sidebar-btn"><MessageSquare size={16} /> Education Grant Query</button>
            <button className="gpt-sidebar-btn"><MessageSquare size={16} /> Housing Subsidy (PMAY)</button>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>Assets</span>
            <button className="gpt-sidebar-btn"><Bookmark size={16} /> Saved Roadmaps</button>
            <button className="gpt-sidebar-btn"><History size={16} /> Welfare History</button>
            <button className="gpt-sidebar-btn"><Users size={16} /> Family Profiles</button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="gpt-main-chat glass-card" style={{ padding: 0 }}>
          <div className="chat-messages" style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AnimatePresence>
              {chat.map((msg, index) => (
                <motion.div 
                  key={msg.id} 
                  initial={index > 0 ? { opacity: 0, y: 15 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`} 
                  style={{ marginBottom: 0, maxWidth: '100%' }}
                >
                  {msg.sender === 'system' && <div className="bot-avatar"><Sparkles size={16} /></div>}
                  
                  <div className="message-bubble" style={{ maxWidth: msg.sender === 'system' ? '100%' : '85%', overflow: 'hidden' }}>
                    {msg.sender === 'system' ? (
                      <div className="markdown-body" style={{ margin: 0, whiteSpace: 'normal', lineHeight: '1.6', fontSize: '1rem', color: 'var(--text-primary)' }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.text}</p>
                    )}
                    
                    {/* Starter Suggestions */}
                    {msg.id === 1 && chat.length === 1 && (
                      <div className="planner-starters-inline" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '1.5rem' }}>
                        {starters.map((st, idx) => (
                          <div key={idx} className="starter-card-inline" onClick={() => handleSendPrompt(st.text)} style={{ padding: '1.25rem' }}>
                            <div className="starter-icon" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{st.icon}</div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '600' }}>"{st.text.slice(0, 45)}..."</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{st.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && <div className="user-avatar">👤</div>}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="typing-indicator" style={{ margin: 0 }}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </motion.div>
            )}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>

          <div className="chat-input-bar" style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
            <button 
              className={`btn btn-outline`} 
              onClick={() => alert("Attachment functionality coming soon")}
              style={{ width: '56px', height: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}
            >
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.askPlaceholder || "Ask AI: e.g. 'I want to open a small shop...'"}
              style={{ flex: 1, padding: '0 1.5rem', borderRadius: '30px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)', fontSize: '1.05rem', outline: 'none', color: 'var(--text-primary)' }}
            />
            <button 
              className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`} 
              onClick={handleVoiceInput}
              style={{ width: '56px', height: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, animation: isListening ? 'pulse 1.5s infinite' : 'none' }}
            >
              <Mic size={22} />
            </button>
            <button className="btn btn-primary" onClick={() => handleSendPrompt(input)} style={{ width: '56px', height: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
              <Send size={20} style={{ marginLeft: '2px' }} />
            </button>
          </div>
          
          <style>{`
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
              70% { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); }
              100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

