import React from 'react';
import { Globe, Link, Video, Camera } from 'lucide-react';
import { translations } from '../data/translations';

export default function Footer({ user, onNavigate, onTriggerAuth, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const brandDescMap = {
    en: "Empowering every Indian family to discover, apply, and receive every government benefit they deserve, backed by encrypted security.",
    hi: "प्रत्येक भारतीय परिवार को सुरक्षित रूप से उनके हकदार हर सरकारी लाभ को खोजने, आवेदन करने और प्राप्त करने के लिए सशक्त बनाना।",
    ta: "ஒவ்வொரு இந்திய குடும்பமும் தங்களுக்கு தகுதியான அரசு நலன்களை கண்டறிந்து விண்ணப்பிக்க உதவுதல்.",
    te: "ప్రతి భారతీయ కుటుంబానికి ప్రభుత్వ పథకాలను సురక్షితంగా పొందేలా సహాయపడటం.",
    bn: "প্রতিটি ভারতীয় পরিবার যাতে তাদের প্রাপ্য সরকারি সুবিধা সহজেই খুঁজে পায় ও লাভ করতে পারে তা নিশ্চিত করা।"
  };

  const partnerIntegrationsMap = {
    en: "Partner Integrations",
    hi: "भागीदार एकीकरण",
    ta: "கூட்டாளர் ஒருங்கிணைப்புகள்",
    te: "భాగస్వామ్య అనుసంధానం",
    bn: "পার্টনার ইন্টিগ্রেশন"
  };

  const ecosystemItems = {
    gp: { en: "Gram Panchayats", hi: "ग्राम पंचायतें", ta: "கிராம ஊராட்சிகள்", te: "గ్రామ పంచాయతీలు", bn: "গ্রাম পঞ্চায়েত" },
    csc: { en: "CSC Centers", hi: "सीएससी केंद्र", ta: "CSC மையங்கள்", te: "CSC కేంద్రాలు", bn: "সিএসসি কেন্দ্র" }
  };

  const getStartedBtnText = {
    en: "Get Started Now",
    hi: "अभी शुरू करें",
    ta: "இப்போது தொடங்கவும்",
    te: "ఇప్పుడే ప్రారంభించండి",
    bn: "এখনই শুরু করুন"
  };

  return (
    <footer className="glass-footer">
      <div className="footer-container">
        
        {/* Brand Info */}
        <div className="footer-brand">
          <a href="#" className="logo-container mb-3" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
            <div className="logo-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/Logo.png" alt="Yojana Saathi Logo" style={{ height: '60px', width: 'auto', maxWidth: '180px', objectFit: 'contain' }} />
            </div>
          </a>
          <p className="brand-desc text-muted">
            {brandDescMap[lang] || brandDescMap.en}
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Globe size={16} /></a>
            <a href="#" className="social-icon"><Link size={16} /></a>
            <a href="#" className="social-icon"><Video size={16} /></a>
            <a href="#" className="social-icon"><Camera size={16} /></a>
          </div>
        </div>


        {/* Column 1 */}
        <div className="footer-nav-col">
          <h3>{t.quickLinks}</h3>
          <span className="footer-link" onClick={() => onNavigate('home')}>{t.home}</span>
          {lang === 'en' && <span className="footer-link" onClick={() => onNavigate('planner')}>{t.planner}</span>}
          <span className="footer-link" onClick={() => onNavigate('schemes')}>{t.schemes}</span>
          <span className="footer-link" onClick={() => onNavigate('family')}>{t.family}</span>
          <span className="footer-link" onClick={() => onNavigate('scam-shield')}>{t.scamShield}</span>
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--lux-text)', marginBottom: '0.75rem', fontSize: '1rem' }}>{t.ecosystem}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>{ecosystemItems.gp[lang] || ecosystemItems.gp.en}</a></li>
              <li><a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>{ecosystemItems.csc[lang] || ecosystemItems.csc.en}</a></li>
              <li><a href="#partners" onClick={(e) => { e.preventDefault(); onNavigate('partners'); }} className="footer-link">{partnerIntegrationsMap[lang] || partnerIntegrationsMap.en} <span className="pill-badge" style={{ fontSize: '10px', padding: '2px 6px' }}>Live</span></a></li>
            </ul>
          </div>
        </div>

        {/* Column 2 */}
        <div className="footer-nav-col">
          <h3>{t.resources}</h3>
          <span className="footer-link" onClick={() => onNavigate('schemes')}>{t.schemes}</span>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>{t.helpCenter}</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>{t.welfareGuides}</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>{t.blogNews}</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>{t.privacyPolicy}</a>
        </div>

        {/* CTA Column */}
        {!user && (
          <div className="footer-brand-action">
            <div className="footer-cta-card">
              <h3>{t.readyToGetStarted}</h3>
              <p className="text-sm text-muted mb-3">{t.getStartedDesc}</p>
              <button className="btn btn-primary w-full" onClick={() => onTriggerAuth(true)}>
                {getStartedBtnText[lang] || getStartedBtnText.en}
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="footer-bottom text-center">
        <p>&copy; 2026 Yojana Saathi. {t.allRightsReserved}</p>
      </div>
    </footer>
  );
}
