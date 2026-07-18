import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Mic, Plus, MessageSquare, Download, History, Users, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { convertWebmToWav } from '../utils/audioHelper';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';

export default function AIPlanner({ initialPrompt, user }) {
  const { lang, setLang, t, gnaniLang } = useLanguage();
  const [chat, setChat] = useState(() => {
    try {
      const saved = localStorage.getItem('planner_history');
      const hist = saved ? JSON.parse(saved) : [];
      if (hist.length > 0) return hist[0].chat;
    } catch {}
    return [{ id: 1, sender: 'system', text: "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you." }];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const [sessionId, setSessionId] = useState(() => {
    try {
      const saved = localStorage.getItem('planner_history');
      const hist = saved ? JSON.parse(saved) : [];
      if (hist.length > 0) return hist[0].id;
    } catch {}
    return Date.now();
  });
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('planner_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const messagesEndRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const API_URL = import.meta.env.VITE_API_URL || '';

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
    // Only scroll if we are actively typing or if user sent a message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chat.length > 1) {
      setHistory(prev => {
        const existingIdx = prev.findIndex(h => h.id === sessionId);
        const newHistory = [...prev];
        const title = chat[1]?.text.slice(0, 30) + '...' || 'New Session';
        if (existingIdx >= 0) {
          newHistory[existingIdx] = { id: sessionId, title, chat, timestamp: Date.now() };
        } else {
          newHistory.unshift({ id: sessionId, title, chat, timestamp: Date.now() });
        }
        localStorage.setItem('planner_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [chat, sessionId]);

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
        setIsListening(false);
        const webmBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        try {
          setIsTranscribing(true);
          const trueWavBlob = await convertWebmToWav(webmBlob);
          const formData = new FormData();
          // Set the language from LanguageContext
          formData.append('audio', trueWavBlob, 'audio.wav');
          formData.append('language', gnaniLang);

          const response = await fetch(`${API_URL}/api/ai/stt`, { method: 'POST', body: formData });
          const data = await response.json();
          if (data.success) {
            setInput(prev => prev + (prev ? ' ' : '') + data.transcript);
          } else {
            alert('Speech to text failed: ' + data.message);
          }
        } catch (err) {
          console.error(err);
          alert('Error connecting to STT service.');
        } finally {
          setIsTranscribing(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsListening(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Could not access microphone.');
    }
  };

  const handleDownloadPDF = async () => {
    const input = document.querySelector('.chat-messages');
    if (!input) return;
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.text(t.roadmapTitle || 'Welfare Roadmap', 20, 20);
      pdf.setFontSize(12);
      pdf.setTextColor('#666666');
      pdf.text(t.roadmapGenerated || 'Generated by Yojana Saathi AI', 20, 28);
      pdf.save(`Welfare_Roadmap_${sessionId}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Error generating PDF.');
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
        // Handle automatic language synchronization
        if (data.reply?.detectedLang && data.reply.detectedLang !== lang) {
          const validLangs = ['en', 'hi', 'ta', 'te', 'bn'];
          if (validLangs.includes(data.reply.detectedLang)) {
            setLang(data.reply.detectedLang);
          }
        }

        let replyText = data.reply?.text || (typeof data.reply === 'object' && data.reply !== null
          ? data.reply.text || JSON.stringify(data.reply, null, 2)
          : data.reply);
          
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
              body: JSON.stringify({ text: replyText, language: gnaniLang })
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
    <div className="view-section planner-view-section animate-fade-in" style={{ paddingTop: 'var(--nav-height)' }}>
      {chat.length <= 1 && (
        <div className="planner-hero" style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
          <span className="pill-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', fontWeight: '600' }}><Sparkles size={14} style={{ marginRight: '6px' }} /> {t.plannerBadge || 'Personal AI Welfare Advisor'}</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>{t.plannerTitle || 'Plan Your Government Journey'}</h1>
          <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.5' }}>{t.plannerSubtitle || 'Describe what your household needs or plans, and our AI will map out a roadmap of schemes you should target, how to prepare documents, and when to apply.'}</p>
        </div>
      )}

      <div className="gpt-layout-container">
        {/* Left Sidebar */}
        <div className="gpt-sidebar glass-card" style={{ padding: '1.25rem' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', borderRadius: '12px' }} onClick={() => {
            setSessionId(Date.now());
            setChat([{ id: 1, sender: 'system', text: lang === 'hi' ? "नमस्ते! मैं योजना साथी का एआई कल्याण योजनाकार हूं।" : "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you." }]);
          }}>
            <Plus size={18} /> New Planning Session
          </motion.button>
          
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>History</span>
            {history.length === 0 ? (
              <div style={{ padding: '1.5rem 1rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)', margin: '0.5rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📂</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No conversations yet</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Start your first AI planning session.</div>
              </div>
            ) : (
              history.map(h => (
                <button 
                  key={h.id} 
                  className={`gpt-sidebar-btn ${h.id === sessionId ? 'active' : ''}`}
                  onClick={() => {
                    setSessionId(h.id);
                    setChat(h.chat);
                  }}
                >
                  <MessageSquare size={16} /> {h.title}
                </button>
              ))
            )}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>Assets</span>
            <button className="action-btn-vertical" onClick={handleDownloadPDF}>
              <Download size={24} /> 
              <span>Download Roadmap PDF</span>
            </button>
            <button className="gpt-sidebar-btn" onClick={() => window.location.hash = 'family'}><History size={16} /> Welfare History</button>
            <button className="gpt-sidebar-btn" onClick={() => window.location.hash = 'family'}><Users size={16} /> Family Profiles</button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="gpt-main-chat glass-card" style={{ padding: 0 }}>
          <div className="chat-messages">
            <AnimatePresence>
              {chat.map((msg, index) => (
                <motion.div 
                  key={msg.id} 
                  initial={index > 0 ? { opacity: 0, y: 15 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`} 
                  style={{ marginBottom: 0, maxWidth: '100%', display: 'flex', gap: '1rem', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}
                >
                  {msg.sender === 'system' && <div className="bot-avatar" style={{ marginTop: '0.5rem', width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold) 0%, var(--primary) 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sparkles size={16} /></div>}
                  
                  <div className={`message-bubble ${msg.sender}`} style={{ maxWidth: msg.sender === 'system' ? '100%' : '85%', overflow: 'hidden' }}>
                    {msg.sender === 'system' ? (
                      <div className="markdown-body" style={{ margin: 0, whiteSpace: 'normal', lineHeight: '1.6', fontSize: '1rem', color: 'var(--text-primary)' }}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({node, ...props}) => {
                              const text = props.children?.[0];
                              const isApply = text === 'Apply Now';
                              const isLearn = text === 'Learn More';
                              if (isApply || isLearn) {
                                return (
                                  <a 
                                    {...props} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`btn ${isApply ? 'btn-primary' : 'btn-outline'} btn-sm`}
                                    style={{ display: 'inline-flex', margin: '8px 8px 8px 0', textDecoration: 'none' }}
                                  >
                                    {props.children}
                                  </a>
                                );
                              }
                              return <a {...props} target="_blank" rel="noopener noreferrer" />;
                            }
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
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

          <div className="chat-input-bar">
            <div className="chat-input-bar-inner">
              <button 
                className={`btn btn-outline`} 
                onClick={() => alert("Attachment functionality coming soon")}
                style={{ width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}
              >
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? "🔴 Recording... Click mic to stop" : isTranscribing ? "⏳ Transcribing audio..." : (t.askPlaceholder || "Ask AI: e.g. 'I want to open a small shop...'")}
                disabled={isListening || isTranscribing}
                style={{ flex: 1, padding: '0 1.5rem', borderRadius: '28px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)', fontSize: '1.05rem', outline: 'none', color: 'var(--text-primary)' }}
              />
              <button 
                className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`} 
                onClick={handleVoiceInput}
                style={{ width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, animation: isListening ? 'pulse 1.5s infinite' : 'none' }}
              >
                <Mic size={22} />
              </button>
              <button className="btn btn-primary" onClick={() => handleSendPrompt(input)} style={{ width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0 }}>
                <Send size={20} style={{ marginLeft: '2px' }} />
              </button>
            </div>
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

