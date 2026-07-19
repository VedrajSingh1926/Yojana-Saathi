import React, { useState } from 'react';
import { ArrowLeft, Landmark, Info, Banknote, ListChecks, FileText, Compass, HelpCircle, Globe, Download, Bookmark, Sparkles } from 'lucide-react';
import { triggerLocalDownload } from '../utils/downloadHelper';
import { SCHEMES_DB } from '../data/schemes';
import { useLanguage } from '../context/LanguageContext';

export default function SchemeDetail({ schemeId, onBack, onNavigate, onSaveScheme }) {
  const { lang, t } = useLanguage();
  const scheme = SCHEMES_DB.find(s => s.id === schemeId) || SCHEMES_DB[0];
  const [activeFaq, setActiveFaq] = useState(null);

  // Language based AI Summary selection
  const schemeT = scheme.translations?.[lang] || scheme;
  let summaryText = schemeT.ai_summaries?.[lang] || scheme.ai_summaries?.en || "";

  const handleAskAI = () => {
    onNavigate('planner', { defaultPrompt: `I want to apply for ${scheme.name}. Can you analyze my household documents?` });
  };

  const handleDownload = () => {
    import('jspdf').then(({ jsPDF }) => {
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text('WELFARE PASSPORT CHECKLIST', 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Scheme: ${scheme.name}`, 20, 30);
      pdf.text(`Category: ${scheme.category}`, 20, 40);
      pdf.text(`Fund Amount: ${scheme.benefit}`, 20, 50);
      
      pdf.text('REQUIRED DOCUMENTS:', 20, 70);
      let y = 80;
      scheme.docs.forEach(doc => {
        pdf.text(`[ ] ${doc.name}`, 20, y);
        y += 10;
      });

      pdf.text('ELIGIBILITY CRITERIA:', 20, y + 10);
      y += 20;
      scheme.eligibility.forEach(crit => {
        pdf.text(`[ ] ${crit.name}`, 20, y);
        y += 10;
      });
      
      pdf.save(`${scheme.name.replace(/\s+/g, '_')}_Checklist.pdf`);
    });
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
            <div className={`pill-badge ${scheme.type === 'Central' ? 'badge-central' : 'badge-state'}`}>
              <span className="badge-dot"></span> {scheme.type === 'Central' ? (t.centralGov || 'Central') : (t[scheme.state] || scheme.state)} {t.stateBadgeSuffix || 'Government'}
            </div>
            <h1>{schemeT.name || scheme.name}</h1>
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
              <h2><Info size={20} className="text-gold" /> {t.programPurpose || "Program Purpose"}</h2>
              <p className="detail-purpose">{schemeT.purpose || scheme.purpose}</p>
            </div>

            {/* Benefits */}
            <div className="detail-block">
              <h2><Banknote size={20} className="text-gold" /> {t.financialBenefits || "Financial & Welfare Benefits"}</h2>
              <p className="detail-purpose">{schemeT.benefits_detail || scheme.benefits_detail}</p>
            </div>

            {/* Eligibility Checklist */}
            <div className="detail-block">
              <h2><ListChecks size={20} className="text-gold" /> {t.eligibilityTitle || "Eligibility Checklist"}</h2>
              <div className="checklist-grid">
                {(schemeT.eligibility || scheme.eligibility).map((el, idx) => (
                  <div key={idx} className="checklist-item">
                    <span className="checkmark-circle-icon">✓</span>
                    <span>{el.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="detail-block">
              <h2><FileText size={20} className="text-gold" /> {t.documentsTitle || "Required Documents"}</h2>
              <div className="doc-cards-row">
                {(schemeT.docs || scheme.docs).map((doc, idx) => (
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
              <h2><Compass size={20} className="text-gold" /> {t.appTimeline || "Application Timeline Steps"}</h2>
              <div className="detail-timeline">
                {(schemeT.timeline || scheme.timeline).map((step, idx) => (
                  <div key={idx} className={`timeline-step ${idx === 0 ? 'active' : ''}`}>
                    <div className="timeline-marker"></div>
                    <h4>{t.step || "Step"} {idx + 1}: {step.split('.')[0]}</h4>
                    <p>{step.split('.').slice(1).join('.') || (t.verifyDetails || 'Verify details and submit proofs.')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="detail-block">
              <h2><HelpCircle size={20} className="text-gold" /> {t.faq || "Frequently Asked Questions"}</h2>
              <div className="faq-accordion">
                {(schemeT.faqs || scheme.faqs).map((faq, idx) => (
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
                <span className="text-muted text-xs">Translated via AI</span>
              </div>
              
              <p>{summaryText}</p>
              
              <hr className="menu-divider" />
              
              <button className="btn btn-outline w-full" onClick={handleAskAI}>
                Ask AI Assistant
              </button>
              <button className="btn btn-primary w-full" onClick={handleDownload}>
                <Download size={16} /> Download Checklist
              </button>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(scheme.name + ' CSC service provider near me')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                📍 Find Nearby CSC
              </a>
              <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}>
                <span className="text-xs text-muted" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Need Legal Help?</span>
              </div>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(scheme.name + ' consultant near me')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                ⚖️ Find Service Provider
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
