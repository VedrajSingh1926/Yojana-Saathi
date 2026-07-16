import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Download, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPlanner({ initialPrompt }) {
  const [chat, setChat] = useState([
    { id: 1, sender: 'system', text: "Hello! I am Yojana Saathi's AI Welfare Planner. Describe what your household needs or plans, or select one of the cards below, and I will generate a step-by-step Welfare Roadmap for you." }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, typing]);

  const starters = [
    { text: 'I want to build my first house', icon: '🏠', desc: 'AI will analyze PMAY and state housing subsidies.' },
    { text: 'My daughter needs a scholarship to study engineering', icon: '🎓', desc: 'AI finds national higher education student waivers.' },
    { text: 'I want to start a dairy business in my village', icon: '🚜', desc: 'AI maps mudra loans, dairy enterprise schemes.' },
    { text: 'My father is turning 60 this month and has no pension', icon: '👴', desc: 'AI links pension funds and health insurance plans.' }
  ];

  const handleSendPrompt = (promptText) => {
    if (!promptText.trim()) return;

    // Add user message
    const userMsgId = Date.now();
    setChat(prev => [...prev, { id: userMsgId, sender: 'user', text: promptText }]);
    setInput('');
    setTyping(true);

    // AI simulation delay
    setTimeout(() => {
      setTyping(false);
      
      let responseText = '';
      let targetSchemes = [];
      let steps = [];

      const query = promptText.toLowerCase();

      if (query.includes('house') || query.includes('home') || query.includes('awas')) {
        responseText = "Based on your interest in building a house, I have mapped out 2 housing welfare schemes: PM Awas Yojana (PMAY) and Mukhyamantri Awas Yojana. Since PMAY offers a higher subsidy of up to ₹2.5 Lakhs, we have marked that as your Primary Target.";
        targetSchemes = [
          { name: "PM Awas Yojana", benefit: "₹2.5 Lakhs Subsidy", status: "Primary Target" },
          { name: "Mukhyamantri Awas", benefit: "₹2.0 Lakhs", status: "Alternative (Exclude if PMAY approved)" }
        ];
        steps = [
          { num: "1", name: "Assemble Land papers & Income certificate", desc: "Ensure your household income is under ₹3.0 Lakhs/yr and you do not own a brick house." },
          { num: "2", name: "Submit application on PMAY Portal", desc: "Gram Panchayat or local municipal executive registers your citizen ID." },
          { num: "3", name: "Local Inspection & Geotagging", desc: "Officer checks foundation site. Funds are disbursed directly in installments." }
        ];
      } else if (query.includes('scholarship') || query.includes('daughter') || query.includes('student') || query.includes('education')) {
        responseText = "I have identified the Post Matric Scholarship Scheme. This covers engineering, medical, or standard undergraduate degrees. Since your daughter is studying engineering, she is eligible for up to ₹50,000/year to cover tuition fees.";
        targetSchemes = [
          { name: "Post Matric Scholarship", benefit: "₹50,000/year Tuition waiver", status: "Primary Target" }
        ];
        steps = [
          { num: "1", name: "Enrollment & Fee receipt verification", desc: "Get letterhead certificate from college registrar." },
          { num: "2", name: "Submit documents on National Scholarship Portal", desc: "Upload class 10/12 results and family income papers." },
          { num: "3", name: "Institute validation", desc: "College approves enrollment records. Funds transfer to student account." }
        ];
      } else if (query.includes('dairy') || query.includes('business') || query.includes('shop') || query.includes('start')) {
        responseText = "I have generated your Entrepreneurship welfare roadmap. We have matching central grants: Startup India Seed Fund for tech/scaling, and PM Kisan + Dairy entrepreneurship loans for village initiatives.";
        targetSchemes = [
          { name: "PM Kisan Samman Nidhi", benefit: "₹6,000/yr support", status: "Active Income" },
          { name: "Startup India Seed Fund", benefit: "Up to ₹50 Lakhs seed capital", status: "Innovative Business" }
        ];
        steps = [
          { num: "1", name: "DPIIT Entity Recognition registration", desc: "Incorporate partnership or Pvt Ltd. Write pitch slide." },
          { num: "2", name: "Apply to empanelled Incubators online", desc: "Apply directly via Startup India unified portal." },
          { num: "3", name: "Milestone-based fund disbursement", desc: "Deliver prototype reports to unlock installments." }
        ];
      } else {
        responseText = "Based on your custom inquiry, I have analyzed our national database of 700+ schemes. I recommend creating a unified Family Passport so we can run exact rule-matching against age, state, and category profiles.";
        targetSchemes = [
          { name: "PM Jan Arogya Yojana (Health)", benefit: "₹5 Lakhs medical card", status: "Instant Activation" }
        ];
        steps = [
          { num: "1", name: "Verify BPL / SECC listing online", desc: "Search Aadhaar number in PMJAY database." },
          { num: "2", name: "Generate Golden Card", desc: "Visit nearby public hospital or CSC to scan biometric." }
        ];
      }

      setChat(prev => [...prev, { id: Date.now(), sender: 'system', text: responseText }]);
      setRoadmap({ schemes: targetSchemes, steps });
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendPrompt(input);
    }
  };

  return (
    <div className="view-section animate-fade-in">
      <div className="planner-hero">
        <span className="pill-badge"><Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> Personal AI Welfare Advisor</span>
        <h1>Plan Your Government Journey</h1>
        <p className="text-muted">Describe what your household needs or plans, and our AI will map out a roadmap of schemes you should target, how to prepare documents, and when to apply.</p>
      </div>

      <div className="planner-workspace">
        {/* Sidebar Prompt Starters */}
        <div className="planner-starters">
          {starters.map((st, idx) => (
            <div key={idx} className="starter-card" onClick={() => handleSendPrompt(st.text)}>
              <div className="starter-icon">{st.icon}</div>
              <h4>"{st.text.slice(0, 30)}..."</h4>
              <p>{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="chat-container glass-card">
          <div className="chat-messages">
            {chat.map(msg => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`}>
                {msg.sender === 'system' && <div className="bot-avatar"><Sparkles size={16} /></div>}
                <div className="message-bubble">
                  <p>{msg.text}</p>
                </div>
                {msg.sender === 'user' && <div className="user-avatar">👤</div>}
              </div>
            ))}

            {typing && (
              <div className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}

            {/* Dynamic AI Output Roadmap */}
            {roadmap && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="ai-generated-roadmap"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '2rem',
                  marginTop: '1.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}
              >
                <div className="roadmap-headline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <h3 className="text-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--primary)' }}>
                    <Compass size={24} /> Your Customized Welfare Roadmap
                  </h3>
                  <button className="btn btn-outline btn-sm" onClick={() => alert('Roadmap PDF saved!')}>
                    <Download size={16} /> Save PDF
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm text-muted mb-3" style={{ fontWeight: 600, letterSpacing: '1px' }}>TARGET PROGRAMS DETECTED</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {roadmap.schemes.map((s, idx) => (
                      <div key={idx} style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: 'bold' }}>{s.status}</span>
                        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', paddingRight: '4rem', color: 'var(--text-primary)' }}>{s.name}</h5>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--success)', fontWeight: '600' }}>{s.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h4 className="text-sm text-muted mb-3" style={{ fontWeight: 600, letterSpacing: '1px' }}>YOUR TASK TIMELINE LOG</h4>
                  <div className="roadmap-steps-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {roadmap.steps.map((st, idx) => (
                      <div key={idx} className="roadmap-step-card" style={{ display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{st.num}</div>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{st.name}</h4>
                          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-bar">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask AI: e.g. 'I want to open a small shop, what grants can I get?'"
            />
            <button className="btn btn-primary" onClick={() => handleSendPrompt(input)}>
              <span>Send</span> <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
