import React from 'react';
import { Globe, Link, Video, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const brandDescMap = {
  en: "Empowering 1.4 billion Indians with AI-driven welfare access.",
  hi: "1.4 अरब भारतीयों को एआई-संचालित कल्याण तक पहुंच के साथ सशक्त बनाना।"
};

const ecosystemItems = {
  gp: { en: "Gram Panchayat Login", hi: "ग्राम पंचायत लॉगिन" },
  csc: { en: "CSC VLE Portal", hi: "सीएससी वीएलई पोर्टल" }
};

const partnerIntegrationsMap = {
  en: "Partner Integrations",
  hi: "पार्टनर इंटीग्रेशन"
};

const getStartedBtnText = {
  en: "Create Free Profile",
  hi: "मुफ्त प्रोफाइल बनाएं"
};

export default function Footer({ user, onNavigate, onTriggerAuth }) {
  const { t, lang } = useLanguage();
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
