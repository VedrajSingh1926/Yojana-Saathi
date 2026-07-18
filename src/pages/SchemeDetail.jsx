import React, { useState } from 'react';
import { ArrowLeft, Landmark, Info, Banknote, ListChecks, FileText, Compass, HelpCircle, Globe, Download, Bookmark, Sparkles } from 'lucide-react';
import { triggerLocalDownload } from '../utils/downloadHelper';
import { SCHEMES_DB } from '../data/schemes';

export default function SchemeDetail({ schemeId, onBack, onNavigate, onSaveScheme, lang }) {
  const scheme = SCHEMES_DB.find(s => s.id === schemeId) || SCHEMES_DB[0];
  const [activeFaq, setActiveFaq] = useState(null);

  // Language based AI Summary selection
  let summaryText = scheme.ai_summaries.en;
  if (lang === 'hi') summaryText = scheme.ai_summaries.hi;
  else if (lang === 'ta') summaryText = scheme.ai_summaries.ta;

  const handleAskAI = () => {
    onNavigate('planner', { defaultPrompt: `I want to apply for ${scheme.name}. Can you analyze my household documents?` });
  };

  const handleDownload = () => {
    const content = `
WELFARE PASSPORT CHECKLIST
--------------------------
Scheme: ${scheme.name}
Department: ${scheme.department}
Fund Amount: ${scheme.amount}

REQUIRED DOCUMENTS:
${scheme.docs.map(doc => `- [ ] ${doc}`).join('\n')}

ELIGIBILITY CRITERIA:
${scheme.eligibility.map(crit => `- [ ] ${crit}`).join('\n')}

Next Steps:
1. Gather all required documents.
2. Visit the nearest Common Service Centre (CSC) or apply online.
3. Keep this checklist handy for tracking your application progress.
    `.trim();
    triggerLocalDownload(`${scheme.name.replace(/\s+/g, '_')}_Checklist.txt`, content);
  };

  return (
    <div className="view-section animate-fade-in">
      <div className="detail-back-bar">
        <button className="btn btn-text" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Schemes
        </button>
      </div>

      <div className="scheme-detail-wrapper">
        {/* Top Hero block */}
        <div className="detail-hero">
          <div className="detail-title-block">
            <div className="pill-badge">
              <span className="badge-dot"></span> {scheme.type} Government Scheme
            </div>
            <h1>{scheme.name}</h1>
            <div className="detail-meta-row">
              <span className="score-badge">✓ AI Verified Domicile</span>
              <span className="text-muted"><Landmark size={14} style={{ display: 'inline', marginRight: '4px' }} /> {scheme.category} Category</span>
            </div>
          </div>
          <div className="detail-actions-panel">
            <button className="btn btn-outline" onClick={() => onSaveScheme(scheme)}>
              <Bookmark size={16} /> Save
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('form-assistant')}>
              Apply with AI Assistant <Sparkles size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => window.open(scheme.official_url, '_blank')}>
              Official Web <Globe size={16} />
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="detail-grid">
          {/* Main Left Content */}
          <div className="detail-main">
            {/* Purpose */}
            <div className="detail-block">
              <h2><Info size={20} className="text-gold" /> Program Purpose</h2>
              <p className="detail-purpose">{scheme.purpose}</p>
            </div>

            {/* Benefits */}
            <div className="detail-block">
              <h2><Banknote size={20} className="text-gold" /> Financial & Welfare Benefits</h2>
              <p className="detail-purpose">{scheme.benefits_detail}</p>
            </div>

            {/* Eligibility Checklist */}
            <div className="detail-block">
              <h2><ListChecks size={20} className="text-gold" /> Eligibility Checklist</h2>
              <div className="checklist-grid">
                {scheme.eligibility.map((el, idx) => (
                  <div key={idx} className="checklist-item">
                    <span className="checkmark-circle-icon">✓</span>
                    <span>{el.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="detail-block">
              <h2><FileText size={20} className="text-gold" /> Required Documents</h2>
              <div className="doc-cards-row">
                {scheme.docs.map((doc, idx) => (
                  <div key={idx} className="doc-detail-card">
                    <div className="doc-detail-icon"><FileText size={24} style={{ margin: '0 auto' }} /></div>
                    <h4>{doc.name}</h4>
                    <p>{doc.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical timeline application tracker */}
            <div className="detail-block">
              <h2><Compass size={20} className="text-gold" /> Application Timeline Steps</h2>
              <div className="detail-timeline">
                {scheme.timeline.map((step, idx) => (
                  <div key={idx} className={`timeline-step ${idx === 0 ? 'active' : ''}`}>
                    <div className="timeline-marker"></div>
                    <h4>Step {idx + 1}: {step.split('.')[0]}</h4>
                    <p>{step.split('.').slice(1).join('.') || 'Verify details and submit proofs.'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="detail-block">
              <h2><HelpCircle size={20} className="text-gold" /> Frequently Asked Questions</h2>
              <div className="faq-accordion">
                {scheme.faqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className={`accordion-item ${activeFaq === idx ? 'active' : ''}`}
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  >
                    <div className="accordion-header">
                      <span>{faq.q}</span>
                      <span className="accordion-chevron">▼</span>
                    </div>
                    <div className="accordion-content">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="detail-sidebar">
            <div className="glass-card summary-widget">
              <h3>⚡ AI Unified Summary</h3>
              
              <div className="languages-tabs">
                <button className={`lang-tab-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
                <button className={`lang-tab-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>HI</button>
                <button className={`lang-tab-btn ${lang === 'ta' ? 'active' : ''}`} onClick={() => setLang('ta')}>TA</button>
              </div>
              
              <p>{summaryText}</p>
              
              <hr className="menu-divider" />
              
              <button className="btn btn-outline w-full" onClick={handleAskAI}>
                Ask AI Assistant
              </button>
              <button className="btn btn-primary w-full" onClick={handleDownload}>
                <Download size={16} /> Download Checklist
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
