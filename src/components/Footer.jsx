import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ user, onNavigate, onTriggerAuth }) {
  const { t, lang } = useLanguage();
  return (
    <footer className="glass-footer">
      <div className="footer-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '3rem 0' }}>
        
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <a href="#" className="logo-container mb-3" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
            <div className="logo-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/Logo.png" alt="Yojana Saathi Logo" style={{ height: '60px', width: 'auto', maxWidth: '180px', objectFit: 'contain' }} />
            </div>
          </a>
          <p className="brand-desc text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            {t.brandDesc || "India's AI Welfare Operating System"}
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" className="social-icon" style={{ color: 'var(--text-muted)' }}><Github size={18} /></a>
            <a href="#" className="social-icon" style={{ color: 'var(--text-muted)' }}><Linkedin size={18} /></a>
            <a href="#" className="social-icon" style={{ color: 'var(--text-muted)' }}><Twitter size={18} /></a>
            <a href="#" className="social-icon" style={{ color: 'var(--text-muted)' }}><Mail size={18} /></a>
          </div>
        </div>

        {/* Column 2: Product */}
        <div className="footer-nav-col">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t.product || 'Product'}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.home || 'Home'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('planner')}>{t.planner || 'Planner'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('schemes')}>{t.schemes || 'Schemes'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('family')}>{t.family || 'Family'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('scam-shield')}>{t.scamShield || 'Scam Shield'}</span></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="footer-nav-col">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t.resources || 'Resources'}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.about || 'About'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.privacy || 'Privacy'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.terms || 'Terms'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.contact || 'Contact'}</span></li>
          </ul>
        </div>

        {/* Column 4: Community */}
        <div className="footer-nav-col">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t.community || 'Community'}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.github || 'GitHub'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.reportIssue || 'Report Issue'}</span></li>
            <li><span className="footer-link cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('home')}>{t.linkedin || 'LinkedIn'}</span></li>
          </ul>
        </div>

        {/* Right Side CTA */}
        {!user && (
          <div className="footer-cta-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="premium-glass-cta" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t.ctaReady || 'Ready to discover your eligible schemes?'}</h4>
              <button 
                className="btn btn-primary" 
                onClick={() => onTriggerAuth(true)}
                style={{ width: '100%', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', border: 'none' }}
              >
                {t.ctaCreateProfile || 'Create Free Profile'}
              </button>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.ctaMinutes || 'It only takes 2 minutes.'}</p>
            </div>
          </div>
        )}

      </div>

      <div className="footer-bottom" style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>&copy; 2026 Yojana Saathi</p>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span className="cursor-pointer hover:text-primary transition-colors">{t.privacy || 'Privacy'}</span>
          <span className="cursor-pointer hover:text-primary transition-colors">{t.terms || 'Terms'}</span>
        </div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.madeWithLove || 'Made with ❤️ for India'}</p>
      </div>
    </footer>
  );
}
