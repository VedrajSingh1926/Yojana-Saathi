import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Mic, Plus, MessageSquare, Bookmark, History, Users, Paperclip, Download, Copy } from 'lucide-react';
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
  const [activeSession, setActiveSession] = useState('current');

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

  const handleDownloadRoadmap = () => {
    if (chat.length <= 1) {
      alert("No active planning session to download. Please start a conversation with the AI Planner first.");
      return;
    }

    const fileName = `yojana_saathi_ai_roadmap_${Date.now()}.txt`;
    
    let content = `==================================================\n`;
    content += `YOJANA SAATHI AI WELFARE ROADMAP & REPORT\n`;
    content += `==================================================\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    if (user) {
      content += `User Profile: ${user.name} (${user.saathiId})\n`;
    }
    content += `==================================================\n\n`;

    chat.forEach((msg, idx) => {
      if (idx === 0) return; // Skip welcome message
      const senderName = msg.sender === 'user' ? 'USER QUERY' : 'AI WELFARE ADVISOR';
      content += `[${senderName}]:\n`;
      content += `${msg.text}\n`;
      content += `\n--------------------------------------------------\n\n`;
    });

    content += `Disclaimer: This roadmap is generated by Yojana Saathi's AI Welfare Advisor based on the information provided. Please verify guidelines and documents with official portals before applying.\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadHistorySession = (sessionKey) => {
    setActiveSession(sessionKey);
    if (sessionKey === 'current') {
      setChat([
        { id: 1, sender: 'system', text: lang === 'hi' ? "नमस्ते! मैं योजना साथी का एआई कल्याण योजनाकार हूं। आपके परिवार को किस चीज़ की आवश्यकता है, इसका वर्णन करें या नीचे दिए गए कार्डों में से एक चुनें, और मैं आपके लिए एक रोडमैप तैयार करूँगा।" : "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you." }
      ]);
    } else if (sessionKey === 'education') {
      setChat([
        { id: 1, sender: 'system', text: "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans..." },
        { id: 2, sender: 'user', text: "My daughter needs a scholarship to study engineering" },
        { id: 3, sender: 'system', text: "### Engineering Scholarship Welfare Roadmap\n\nBased on your daughter's engineering goals, here are the top matching government programs:\n\n1. **Central Sector Scheme of Scholarship (CSSS)**\n   * **Benefit:** Up to ₹20,000 per year for degree courses.\n   * **Eligibility:** Above 80th percentile in Class 12, family income under ₹4.5L/year.\n   * **Key Documents:** Aadhaar, Class 12 Marksheet, Income Certificate.\n\n2. **AICTE Pragati Scholarship for Girls**\n   * **Benefit:** ₹50,000 per year for technical degree courses.\n   * **Eligibility:** Max 2 daughters per family, family income under ₹8L/year.\n   * **Key Documents:** Admission letter, Tuition fee receipt, Bank account details.\n\n### Document Preparation Steps:\n* **Step 1:** Apply for state Income Certificate immediately (takes 10-15 days).\n* **Step 2:** Ensure Aadhaar is linked to the student bank account (required for Direct Benefit Transfer).\n* **Step 3:** Register on the National Scholarship Portal (NSP) during July-September window." }
      ]);
    } else if (sessionKey === 'housing') {
      setChat([
        { id: 1, sender: 'system', text: "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans..." },
        { id: 2, sender: 'user', text: "I want to build my first house" },
        { id: 3, sender: 'system', text: "### Housing Subsidy (PMAY) Welfare Roadmap\n\nTo construct your first house, the primary program is the **Pradhan Mantri Awas Yojana (PMAY)**, supplemented by state matching grants:\n\n1. **PMAY - Gramin (Rural)**\n   * **Benefit:** ₹1.2 Lakhs subsidy in plains / ₹1.3 Lakhs in hilly areas, plus ₹18,000 MGNREGS labor wage component.\n   * **Eligibility:** Households without pucka houses, landless agricultural workers, or low-income categories.\n   * **Key Documents:** Domicile Certificate, Gram Sabha approval, Aadhaar.\n\n2. **PMAY - Urban (Credit Linked Subsidy Scheme)**\n   * **Benefit:** Up to ₹2.67 Lakhs interest subsidy on home loans.\n   * **Eligibility:** EWS (income < ₹3L/year) or LIG (income < ₹6L/year) without owning any other pucka house in India.\n   * **Key Documents:** Income proof, Non-owning self-declaration, Land registry deeds.\n\n### Application Roadmap:\n* **Step 1:** Submit eligibility check to local Gram Panchayat/Urban Local Body office.\n* **Step 2:** File an application on the PMAY portal with your Aadhaar and bank details.\n* **Step 3:** Receive first geotagging inspection step before disbursement." }
      ]);
    }
  };

  return (
    <div className="view-section planner-view-section animate-fade-in" style={{ padding: 0, margin: 0, maxWidth: '100%' }}>
      <div className="gpt-layout-container">
        {/* Left Sidebar */}
        <div className="gpt-sidebar glass-card" style={{ padding: '1.25rem' }}>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', borderRadius: '12px' }} 
            onClick={() => loadHistorySession('current')}
          >
            <Plus size={18} /> New Planning Session
          </motion.button>
          
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>History</span>
            <button 
              className={`gpt-sidebar-btn ${activeSession === 'current' ? 'active' : ''}`}
              onClick={() => loadHistorySession('current')}
            >
              <MessageSquare size={16} /> Current Session
            </button>
            <button 
              className={`gpt-sidebar-btn ${activeSession === 'education' ? 'active' : ''}`}
              onClick={() => loadHistorySession('education')}
            >
              <MessageSquare size={16} /> Education Grant Query
            </button>
            <button 
              className={`gpt-sidebar-btn ${activeSession === 'housing' ? 'active' : ''}`}
              onClick={() => loadHistorySession('housing')}
            >
              <MessageSquare size={16} /> Housing Subsidy (PMAY)
            </button>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>Assets</span>
            <button className="gpt-sidebar-btn" onClick={() => alert("Roadmaps automatically auto-save to cloud lockers.")}><Bookmark size={16} /> Saved Roadmaps</button>
            <button className="gpt-sidebar-btn" onClick={() => alert("Welfare history logs synced from Gram Panchayat database.")}><History size={16} /> Welfare History</button>
            <button className="gpt-sidebar-btn" onClick={() => alert("Configure household profiles in 'Family' page.")}><Users size={16} /> Family Profiles</button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="gpt-main-chat glass-card" style={{ padding: 0 }}>
          {/* Chat Header */}
          <div className="chat-header" style={{ padding: '0.85rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(25, 25, 25, 0.4)', backdropFilter: 'blur(20px)', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="pulsing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981', animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Yojana Saathi AI Advisor v2</span>
              <span className="pill-badge" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--primary)' }}>Gemini 3.5 Flash</span>
            </div>
            {chat.length > 1 && (
              <button 
                className="btn btn-outline" 
                onClick={handleDownloadRoadmap}
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', borderColor: 'rgba(212,175,55,0.3)', color: 'var(--primary)' }}
              >
                <Download size={14} /> Download Full Roadmap
              </button>
            )}
          </div>

          <div className="chat-messages" style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {chat.length === 1 ? (
              <div className="planner-dashboard animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '2rem 1rem', textAlign: 'center' }}>
                <div className="ai-icon-container animate-pulse-slow" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <div className="ai-pulse-ring" style={{ position: 'absolute', top: '-15px', left: '-15px', right: '-15px', bottom: '-15px', borderRadius: '50%', border: '2px dashed var(--primary)', opacity: 0.3, animation: 'spin 20s linear infinite' }}></div>
                  <div className="ai-glow-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, #10b981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
                    <Sparkles size={38} className="text-white" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))' }} />
                  </div>
                </div>
                
                <h1 className="hero-gradient-text" style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 0.75rem 0', background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 40%, #10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                  {t.plannerTitle || 'Plan Your Government Journey'}
                </h1>
                
                <p className="text-muted" style={{ maxWidth: '680px', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 2rem 0' }}>
                  {t.plannerSubtitle || 'Describe what your household needs or plans, and our AI will map out a roadmap of schemes you should target, how to prepare documents, and when to apply.'}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
                  <span className="pill-badge" style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>🇮🇳 Unified National Support</span>
                  <span className="pill-badge" style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>⚡ Real-time Eligibility Match</span>
                  <span className="pill-badge" style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>💬 Multi-language (EN / HI / TA)</span>
                </div>

                <div className="planner-starters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', width: '100%', maxWidth: '950px' }}>
                  {starters.map((st, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSendPrompt(st.text)} 
                      className="starter-card-premium glass-card" 
                      style={{ padding: '1.5rem', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      <div>
                        <div className="starter-icon" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{st.icon}</div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.4' }}>"{st.text}"</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{st.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {chat.map((msg, index) => (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`} 
                    style={{ marginBottom: 0, maxWidth: '100%' }}
                  >
                    {msg.sender === 'system' && (
                      <div className="bot-avatar" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #10b981 100%)', boxShadow: '0 4px 12px rgba(212,175,55,0.25)' }}>
                        <Sparkles size={16} />
                      </div>
                    )}
                    
                    <div className="message-bubble animate-slide-up" style={{ maxWidth: msg.sender === 'system' ? '100%' : '85%', overflow: 'hidden', padding: '1.25rem 1.5rem', borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', background: msg.sender === 'user' ? 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.03) 100%)' : 'rgba(255,255,255,0.03)', border: msg.sender === 'user' ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.06)' }}>
                      {msg.sender === 'system' ? (
                        <div className="markdown-body" style={{ margin: 0, whiteSpace: 'normal', lineHeight: '1.6', fontSize: '1rem', color: 'var(--text-primary)' }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.text}</p>
                      )}

                      {msg.sender === 'system' && index > 0 && (
                        <div className="message-actions" style={{ display: 'flex', gap: '16px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                          <button 
                            className="btn-action-small" 
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text);
                              alert("Copied response text to clipboard!");
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                          >
                            <Copy size={12} /> Copy
                          </button>
                          <button 
                            className="btn-action-small" 
                            onClick={() => {
                              const fileName = `ai_roadmap_step_${index}.txt`;
                              const blob = new Blob([msg.text], { type: 'text/plain;charset=utf-8' });
                              const link = document.createElement('a');
                              link.href = URL.createObjectURL(blob);
                              link.download = fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                          >
                            <Download size={12} /> Download Plan
                          </button>
                        </div>
                      )}
                    </div>
                    {msg.sender === 'user' && <div className="user-avatar" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="typing-indicator" style={{ margin: 0 }}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </motion.div>
            )}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </div>

          <div className="chat-input-bar" style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border-color)', background: 'rgba(20, 20, 20, 0.6)', backdropFilter: 'blur(20px)', display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
            <button 
              className={`btn btn-outline`} 
              onClick={() => alert("Upload documents in 'Family' page to sync locker with AI.")}
              style={{ width: '56px', height: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, borderColor: 'var(--border-color)' }}
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
              style={{ width: '56px', height: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, animation: isListening ? 'pulse 1.5s infinite' : 'none', borderColor: 'var(--border-color)' }}
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
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-pulse-slow {
              animation: pulse-glow 4s ease-in-out infinite;
            }
            @keyframes pulse-glow {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(212,175,55,0.2)); }
              50% { transform: scale(1.03); filter: drop-shadow(0 0 25px rgba(212,175,55,0.4)); }
            }
            .animate-slide-up {
              animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes slide-up {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
