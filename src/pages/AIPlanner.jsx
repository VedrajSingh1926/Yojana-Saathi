import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Download, Compass, Mic, FileText, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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

    console.log('[Frontend Debug] Button clicked / Send initiated with prompt:', promptText);

    // Add user message
    const userMsgId = Date.now();
    setChat(prev => {
      console.log('[Frontend Debug] Updating State (User Message)');
      return [...prev, { id: userMsgId, sender: 'user', text: promptText }];
    });
    setInput('');
    setTyping(true);

    const requestBody = { prompt: promptText, user, lang };
    console.log('[Frontend Debug] Sending request to:', `${API_URL}/api/ai/planner`);
    console.log('[Frontend Debug] Request Body:', requestBody);

    try {
      const res = await fetch(`${API_URL}/api/ai/planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      console.log('[Frontend Debug] Response Status:', res.status, res.statusText);
      
      const data = await res.json();
      console.log('[Frontend Debug] Parsed JSON (Response Body):', data);
      
      setTyping(false);
      
      if (data.success) {
        // If the backend returns structured roadmap data (parsed from Gemini)
        if (typeof data.reply === 'object' && data.reply !== null) {
          console.log('[Frontend Debug] Updating State (AI Message - Structured Roadmap)');
          setChat(prev => [...prev, { 
            id: Date.now(), 
            sender: 'system', 
            text: data.reply.text || "Here is your plan:",
            roadmap: data.reply.roadmap 
          }]);
        } else {
          console.log('[Frontend Debug] Updating State (AI Message - Plain Text)');
          // Fallback if backend just returns text
          setChat(prev => [...prev, { 
            id: Date.now(), 
            sender: 'system', 
            text: data.reply
          }]);
        }
      } else {
        console.error('[Frontend Debug] API returned success: false', data);
        setChat(prev => [...prev, { id: Date.now(), sender: 'system', text: "Error: " + (data.message || data.error) }]);
      }
    } catch (err) {
      console.error('[Frontend Debug] AI Planner Error (Fetch failed):', err);
      setTyping(false);
      setChat(prev => [...prev, { id: Date.now(), sender: 'system', text: "Network error communicating with AI Planner." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendPrompt(input);
    }
  };

  const latestRoadmapMessage = [...chat].reverse().find(msg => msg.roadmap);
  const latestRoadmap = latestRoadmapMessage ? latestRoadmapMessage.roadmap : null;

  return (
    <div className="view-section planner-view-section animate-fade-in" style={{ height: 'calc(100vh - var(--nav-height))', display: 'flex', flexDirection: 'column', padding: '1rem 2rem' }}>
      <div className="planner-hero" style={{ textAlign: 'left', marginBottom: '1.5rem', flexShrink: 0 }}>
        <span className="pill-badge" style={{ marginBottom: '0.5rem' }}><Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> {t.plannerBadge || 'Personal AI Welfare Advisor'}</span>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.plannerTitle || 'Plan Your Government Journey'}</h1>
        <p className="text-muted" style={{ maxWidth: '800px', fontSize: '0.95rem' }}>{t.plannerSubtitle || 'Describe what your household needs or plans, and our AI will map out a roadmap of schemes you should target, how to prepare documents, and when to apply.'}</p>
      </div>

      <div className="planner-two-col">
        {/* Left Column: Chat Area */}
        <div className="planner-chat-panel glass-card" style={{ padding: 0 }}>
          <div className="chat-messages" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chat.map(msg => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`} style={{ marginBottom: 0 }}>
                {msg.sender === 'system' && <div className="bot-avatar"><Sparkles size={16} /></div>}
                <div className="message-bubble">
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  
                  {/* Starter Suggestions inside the chat for the first message */}
                  {msg.id === 1 && chat.length === 1 && (
                    <div className="planner-starters-inline" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.5rem' }}>
                      {starters.map((st, idx) => (
                        <div key={idx} className="starter-card-inline" onClick={() => handleSendPrompt(st.text)} style={{ width: '100%' }}>
                          <div className="starter-icon" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{st.icon}</div>
                          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>"{st.text.length > 40 ? st.text.slice(0, 40) + '...' : st.text}"</h4>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.sender === 'user' && <div className="user-avatar">👤</div>}
              </div>
            ))}

            {typing && (
              <div className="typing-indicator" style={{ margin: 0 }}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>

          {/* Fixed Input at bottom of Chat Panel */}
          <div className="chat-input-bar" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button 
              className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`} 
              onClick={handleVoiceInput}
              style={{ width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, animation: isListening ? 'pulse 1.5s infinite' : 'none' }}
            >
              <Mic size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.askPlaceholder || "Ask AI..."}
              style={{ flex: 1, minWidth: 0 }}
            />
            <button className="btn btn-primary" onClick={() => handleSendPrompt(input)} style={{ flexShrink: 0, padding: '0 1rem' }}>
               <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Preview Area */}
        <div className="planner-preview-panel">
          {latestRoadmap ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card"
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div className="roadmap-headline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--primary)', fontSize: '1.25rem' }}>
                  <Compass size={22} /> Recommended Action Plan
                </h3>
                <button className="btn btn-outline btn-sm" onClick={() => alert('Roadmap PDF saved!')} style={{ padding: '0.4rem 0.8rem' }}>
                  <Download size={14} /> Save PDF
                </button>
              </div>

              {/* TARGET SCHEMES */}
              <div>
                <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>TARGET PROGRAMS</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {latestRoadmap.schemes?.map((s, idx) => (
                    <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-darkest)', border: '1px solid var(--primary)', borderRadius: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.75rem', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>{s.status}</span>
                      <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', paddingRight: '80px' }}>{s.name}</h5>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--gold)', fontWeight: '500' }}>Benefit: {s.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-2-col" style={{ gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {/* REQUIRED DOCS */}
                <div style={{ background: 'var(--bg-darkest)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                   <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16}/> REQUIRED DOCUMENTS</h4>
                   <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                     {latestRoadmap.reqDocs?.map((d, i) => (
                       <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text-primary)' }}><CheckCircle2 size={18} className="text-success" /> {d}</li>
                     ))}
                   </ul>
                </div>

                {/* MISSING DOCS */}
                {latestRoadmap.missingDocs?.length > 0 && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed #ef4444' }}>
                    <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16}/> MISSING FROM LOCKER</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {latestRoadmap.missingDocs.map((d, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: '#ef4444' }}><AlertTriangle size={18} /> {d}</li>
                      ))}
                    </ul>
                    <button className="btn btn-outline btn-sm mt-4" style={{ borderColor: '#ef4444', color: '#ef4444', width: '100%' }}>Upload Now</button>
                  </div>
                )}
              </div>

              {/* TIMELINE */}
              <div>
                <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>APPLICATION TIMELINE</h4>
                <div className="roadmap-steps-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid var(--primary-glow)', marginLeft: '12px', paddingLeft: '24px' }}>
                  {latestRoadmap.steps?.map((st, idx) => (
                    <div key={idx} style={{ position: 'relative', padding: '0.5rem 0' }}>
                      <div style={{ position: 'absolute', left: '-40px', top: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', zIndex: 1 }}>{st.num}</div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{st.name}</h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {latestRoadmap.faqs?.length > 0 && (
                <div>
                  <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><HelpCircle size={16}/> FREQUENTLY ASKED</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {latestRoadmap.faqs.map((f, i) => (
                      <div key={i} style={{ background: 'var(--bg-darkest)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Q: {f.q}</strong>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>A: {f.a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="empty-state-preview glass-card" style={{ height: '100%' }}>
              <Compass size={64} style={{ opacity: 0.2, marginBottom: '1rem', color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your Roadmap Awaits</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '1rem' }}>Start a conversation with your AI Welfare Advisor to generate a personalized action plan.</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
      `}</style>
    </div>
  );
}

