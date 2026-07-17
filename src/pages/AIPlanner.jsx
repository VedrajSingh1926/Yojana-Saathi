import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Download, Compass, Mic, FileText, CheckCircle2, AlertTriangle, HelpCircle, Plus, MessageSquare, Bookmark, History, Users, Paperclip } from 'lucide-react';
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
        if (typeof data.reply === 'object' && data.reply !== null) {
          setChat(prev => [...prev, { 
            id: Date.now(), 
            sender: 'system', 
            text: data.reply.text || "Here is your plan:",
            roadmap: data.reply.roadmap 
          }]);
        } else {
          setChat(prev => [...prev, { 
            id: Date.now(), 
            sender: 'system', 
            text: data.reply
          }]);
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
    <div className="view-section planner-view-section animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <div className="planner-hero" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="pill-badge" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center' }}><Sparkles size={14} style={{ marginRight: '6px' }} /> {t.plannerBadge || 'Personal AI Welfare Advisor'}</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{t.plannerTitle || 'Plan Your Government Journey'}</h1>
        <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1rem' }}>{t.plannerSubtitle || 'Describe what your household needs or plans, and our AI will map out a roadmap of schemes you should target, how to prepare documents, and when to apply.'}</p>
      </div>

      <div className="gpt-layout-container">
        {/* Left Sidebar */}
        <div className="gpt-sidebar glass-card">
          <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }} onClick={() => setChat([chat[0]])}>
            <Plus size={18} /> New Planning Session
          </button>
          
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem' }}>History</span>
            <button className="gpt-sidebar-btn active"><MessageSquare size={16} /> Current Session</button>
            <button className="gpt-sidebar-btn"><MessageSquare size={16} /> Education Grant Query</button>
            <button className="gpt-sidebar-btn"><MessageSquare size={16} /> Housing Subsidy (PMAY)</button>
          </div>

          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem' }}>Assets</span>
            <button className="gpt-sidebar-btn"><Bookmark size={16} /> Saved Roadmaps</button>
            <button className="gpt-sidebar-btn"><History size={16} /> Welfare History</button>
            <button className="gpt-sidebar-btn"><Users size={16} /> Family Profiles</button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="gpt-main-chat glass-card" style={{ padding: 0 }}>
          <div className="chat-messages" style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {chat.map(msg => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`} style={{ marginBottom: 0, maxWidth: '100%' }}>
                {msg.sender === 'system' && <div className="bot-avatar"><Sparkles size={16} /></div>}
                
                <div className="message-bubble" style={{ maxWidth: msg.sender === 'system' ? '100%' : '85%' }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.text}</p>
                  
                  {/* Starter Suggestions */}
                  {msg.id === 1 && chat.length === 1 && (
                    <div className="planner-starters-inline" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '1.5rem' }}>
                      {starters.map((st, idx) => (
                        <div key={idx} className="starter-card-inline" onClick={() => handleSendPrompt(st.text)}>
                          <div className="starter-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{st.icon}</div>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>"{st.text.slice(0, 45)}..."</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{st.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Inline Roadmap Content */}
                  {msg.roadmap && msg.roadmap.schemes && msg.roadmap.schemes.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="ai-generated-roadmap"
                      style={{
                        paddingTop: '1.5rem',
                        marginTop: '1.5rem',
                        borderTop: '1px dashed var(--border-color)',
                        display: 'flex', flexDirection: 'column', gap: '1.5rem'
                      }}
                    >
                      <div className="roadmap-headline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--primary)', fontSize: '1.15rem' }}>
                          <Compass size={20} /> Recommended Action Plan
                        </h3>
                        <button className="btn btn-outline btn-sm" onClick={() => alert('Roadmap PDF saved!')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          <Download size={14} /> Save PDF
                        </button>
                      </div>

                      {/* TARGET SCHEMES */}
                      <div>
                        <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>TARGET PROGRAMS</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                          {msg.roadmap.schemes.map((s, idx) => (
                            <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-darkest)', border: '1px solid var(--gold)', borderRadius: '12px', position: 'relative' }}>
                              <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.75rem', background: 'var(--primary-glow)', padding: '2px 8px', borderRadius: '12px', color: 'var(--primary)', fontWeight: 'bold' }}>{s.status}</span>
                              <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', paddingRight: '80px' }}>{s.name}</h5>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gold)', fontWeight: '500' }}>Benefit: {s.benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid-2-col" style={{ gap: '1.5rem' }}>
                        {/* REQUIRED DOCS */}
                        <div style={{ background: 'var(--bg-darkest)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                           <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16}/> REQUIRED DOCUMENTS</h4>
                           <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                             {msg.roadmap.reqDocs?.map(d => (
                               <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-primary)' }}><CheckCircle2 size={18} className="text-success" /> {d}</li>
                             ))}
                           </ul>
                        </div>

                        {/* MISSING DOCS */}
                        {msg.roadmap.missingDocs?.length > 0 && (
                          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #ef4444' }}>
                            <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={16}/> MISSING FROM LOCKER</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {msg.roadmap.missingDocs.map(d => (
                                <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#ef4444' }}><AlertTriangle size={18} /> {d}</li>
                              ))}
                            </ul>
                            <button className="btn btn-outline btn-sm mt-3" style={{ borderColor: '#ef4444', color: '#ef4444', width: '100%' }}>Upload Now</button>
                          </div>
                        )}
                      </div>

                      {/* TIMELINE */}
                      <div>
                        <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>APPLICATION TIMELINE</h4>
                        <div className="roadmap-steps-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid var(--primary-glow)', marginLeft: '12px', paddingLeft: '24px' }}>
                          {msg.roadmap.steps.map((st, idx) => (
                            <div key={idx} style={{ position: 'relative', padding: '0.5rem 0' }}>
                              <div style={{ position: 'absolute', left: '-40px', top: '10px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', zIndex: 1 }}>{st.num}</div>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{st.name}</h4>
                              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{st.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* FAQs */}
                      {msg.roadmap.faqs?.length > 0 && (
                        <div>
                          <h4 className="text-sm mb-3" style={{ fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><HelpCircle size={16}/> FREQUENTLY ASKED</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {msg.roadmap.faqs.map((f, i) => (
                              <div key={i} style={{ background: 'var(--bg-darkest)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Q: {f.q}</strong>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>A: {f.a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
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

          <div className="chat-input-bar" style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <button 
              className={`btn btn-outline`} 
              onClick={() => alert("Attachment functionality coming soon")}
              style={{ width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.askPlaceholder || "Ask AI: e.g. 'I want to open a small shop...'"}
              style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '24px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)', fontSize: '1rem', outline: 'none', color: 'var(--text-primary)' }}
            />
            <button 
              className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`} 
              onClick={handleVoiceInput}
              style={{ width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, animation: isListening ? 'pulse 1.5s infinite' : 'none' }}
            >
              <Mic size={20} />
            </button>
            <button className="btn btn-primary" onClick={() => handleSendPrompt(input)} style={{ width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </div>
          
          <style>{`
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
              100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

