import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Mic, Plus, MessageSquare, Download, History, Users, Paperclip, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { convertWebmToWav } from '../utils/audioHelper';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../context/LanguageContext';
import { useLocationContext } from '../context/LocationContext';

function TypewriterMarkdown({ content, speed = 10, ...props }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    if (!content) return;
    const timer = setInterval(() => {
      i++;
      setDisplayed(content.slice(0, i));
      if (i >= content.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [content, speed]);
  
  return <ReactMarkdown {...props}>{displayed}</ReactMarkdown>;
}

export default function AIPlanner({ initialPrompt, user }) {
  const { lang, setLang, t, gnaniLang } = useLanguage();
  const { stateLocation } = useLocationContext();
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
  const [activeSession, setActiveSession] = useState('current');
  
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
        const baseMsgEn = user ? `Welcome ${user.name}! I have analyzed your profile and family structure. Describe what your household needs or plans, and I will generate a highly personalized Welfare Roadmap for you.` : "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you.";
        const baseMsgHi = user ? `नमस्ते ${user.name}! मैंने आपकी प्रोफाइल और परिवार की संरचना का विश्लेषण किया है। अपनी आवश्यकताएं बताएं, और मैं आपके लिए एक व्यक्तिगत रोडमैप तैयार करूँगा।` : "नमस्ते! मैं योजना साथी का एआई कल्याण योजनाकार हूं। आपके परिवार को किस चीज़ की आवश्यकता है, इसका वर्णन करें या नीचे दिए गए कार्डों में से एक चुनें, और मैं आपके लिए एक रोडमैप तैयार करूँगा।";
        return [{ id: 1, sender: 'system', text: lang === 'hi' ? baseMsgHi : baseMsgEn }];
      }
      return prev;
    });
  }, [lang, user]);

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const isInitialMount = useRef(true);
  const prevSessionId = useRef(sessionId);
  const prevChatLength = useRef(chat.length);

  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current) return;

    const container = messagesEndRef.current.parentElement;
    if (!container) return;

    const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 60;
    
    if (force || isNearBottom || typing) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSessionId.current = sessionId;
      prevChatLength.current = chat.length;
      return;
    }

    if (sessionId !== prevSessionId.current) {
      prevSessionId.current = sessionId;
      prevChatLength.current = chat.length;
      return;
    }

    if (chat.length > prevChatLength.current) {
      scrollToBottom(true);
    } else {
      scrollToBottom();
    }

    prevChatLength.current = chat.length;
  }, [chat, typing, sessionId]);

  const starters = [
    { text: t.starter1 || 'I want to build my first house', icon: '🏠', desc: t.starter1Desc || 'AI will analyze PMAY and state housing subsidies.' },
    { text: t.starter2 || 'My daughter needs a scholarship to study engineering', icon: '🎓', desc: t.starter2Desc || 'AI finds national higher education student waivers.' },
    { text: t.starter3 || 'I want to start a dairy business in my village', icon: '🚜', desc: t.starter3Desc || 'AI maps mudra loans, dairy enterprise schemes.' },
    { text: t.starter4 || 'My father is turning 60 this month and has no pension', icon: '👴', desc: t.starter4Desc || 'AI links pension funds and health insurance plans.' }
  ];

  const handleStarterClick = (starterText) => {
    handleSendPrompt(starterText);
  };

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

    const requestBody = { prompt: promptText, user, lang, state: stateLocation || 'All States' };

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
    <div className="view-section planner-view-section animate-fade-in" style={{ padding: 0, margin: 0, maxWidth: '100%', minHeight: 0 }}>
      <div className="gpt-layout-container">
        {/* Left Sidebar */}
        <div className="gpt-sidebar glass-card" style={{ padding: '1.25rem' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem', borderRadius: '12px' }} onClick={() => {
            const nextSessionId = Date.now();
            setSessionId(nextSessionId);
            setActiveSession('current');
            setChat([{ id: 1, sender: 'system', text: t.plannerSubtitle || "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you." }]);
          }}>
            <Plus size={18} /> {t.newSession || "New Planning Session"}
          </motion.button>
          
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>{t.history || "History"}</span>
            {history.length === 0 ? (
              <div style={{ padding: '1.5rem 1rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)', margin: '0.5rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📂</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t.noConversations || "No conversations yet"}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.startFirstSession || "Start your first AI planning session."}</div>
              </div>
            ) : (
              history.map(h => (
                <button 
                  key={h.id} 
                  className={`gpt-sidebar-btn ${h.id === sessionId ? 'active' : ''}`}
                  onClick={() => {
                    setSessionId(h.id);
                    setActiveSession(h.id);
                    setChat(h.chat);
                  }}
                >
                  <MessageSquare size={16} /> {h.title}
                </button>
              ))
            )}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>{t.assets || "Assets"}</span>
            <button className="action-btn-vertical" onClick={handleDownloadPDF}>
              <Download size={24} /> 
              <span>{t.downloadPdf || "Download Roadmap PDF"}</span>
            </button>
            <button className="gpt-sidebar-btn" onClick={() => window.location.hash = 'family'}><History size={16} /> {t.welfareHistory || "Welfare History"}</button>
            <button className="gpt-sidebar-btn" onClick={() => window.location.hash = 'family'}><Users size={16} /> {t.familyProfiles || "Family Profiles"}</button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="gpt-main-chat glass-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="chat-messages" role="log" aria-live="polite" style={{ flex: 1, overflowY: 'auto' }}>
              {chat.map((msg, index) => (
                <React.Fragment key={msg.id}>
                  <motion.div 
                    initial={index > 0 ? { opacity: 0, y: 15 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`} 
                  >
                  {msg.sender === 'system' && <div className="bot-avatar"><Sparkles size={16} /></div>}
                  
                  <div className={`message-bubble ${msg.sender} animate-slide-up`}>
                    {msg.sender === 'system' ? (
                      <div className="markdown-body">
                        <TypewriterMarkdown
                          content={msg.text.replace(/\n/g, '  \n')}
                          speed={5}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({node, ...props}) => {
                              const isApply = props.children && String(props.children).toLowerCase().includes('apply');
                              const isLearn = props.children && String(props.children).toLowerCase().includes('learn');
                              
                              if (isApply) {
                                return (
                                  <a 
                                    {...props} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-sm"
                                    style={{ display: 'inline-flex', margin: '8px 8px 8px 0', textDecoration: 'none', color: '#ffffff' }}
                                  >
                                    {props.children}
                                  </a>
                                );
                              }
                              if (isLearn) {
                                return (
                                  <a 
                                    {...props} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm"
                                    style={{ display: 'inline-flex', margin: '8px 8px 8px 0', textDecoration: 'none' }}
                                  >
                                    {props.children}
                                  </a>
                                );
                              }
                              return <a {...props} target="_blank" rel="noopener noreferrer" />;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{msg.text}</p>
                    )}

                    {msg.sender === 'system' && index > 0 && (
                      <div className="message-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
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
                          <Copy size={12} /> {t.copy || "Copy"}
                        </button>
                        <button 
                          className="btn-action-small" 
                          onClick={() => {
                            import('jspdf').then(({ jsPDF }) => {
                              const pdf = new jsPDF();
                              pdf.setFontSize(14);
                              pdf.text('AI Welfare Planner Roadmap', 10, 10);
                              pdf.setFontSize(10);
                              
                              const splitText = pdf.splitTextToSize(msg.text.replace(/[*#]/g, ''), 190);
                              let y = 20;
                              splitText.forEach(line => {
                                if (y > 280) {
                                  pdf.addPage();
                                  y = 10;
                                }
                                pdf.text(line, 10, y);
                                y += 6;
                              });
                              
                              pdf.save(`ai_roadmap_step_${index}.pdf`);
                            });
                          }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                        >
                          <Download size={12} /> {t.downloadPdf || "Download PDF"}
                        </button>
                      </div>
                    )}
                  </div>
                    {msg.sender === 'user' && <div className="user-avatar">👤</div>}
                  </motion.div>
                  {index === 0 && chat.length <= 1 && (
                    <div className="planner-hero" style={{ marginTop: '2rem' }}>
                      <div className="planner-hero-badge">{t.plannerBadge || "AI Welfare Planner"}</div>
                      <h2>{t.plannerTitle || "Plan your next welfare step with confidence"}</h2>
                      <p>{t.plannerSubtitle || "Describe your household goal or pick a starter prompt to generate a tailored roadmap."}</p>
                      <div className="planner-starters">
                        {starters.map((starter) => (
                          <button key={starter.text} type="button" className="starter-card-inline" onClick={() => handleStarterClick(starter.text)}>
                            <div className="starter-card-icon">{starter.icon}</div>
                            <div className="starter-card-content">
                              <h4>{starter.text}</h4>
                              <p>{starter.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
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
