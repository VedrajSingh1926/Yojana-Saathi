import React from 'react';
import { Landmark, Globe, Link, Video, Camera } from 'lucide-react';

export default function Footer({ onNavigate, onTriggerAuth }) {
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
            Empowering every Indian family to discover, apply, and receive every government benefit they deserve, backed by encrypted security.
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
          <h3>Quick Links</h3>
          <span className="footer-link" onClick={() => onNavigate('home')}>Home</span>
          <span className="footer-link" onClick={() => onNavigate('planner')}>AI Planner</span>
          <span className="footer-link" onClick={() => onNavigate('schemes')}>Schemes Catalog</span>
          <span className="footer-link" onClick={() => onNavigate('family')}>Family Hub</span>
          <span className="footer-link" onClick={() => onNavigate('scam-shield')}>Scam Shield</span>
        </div>

        {/* Column 2 */}
        <div className="footer-nav-col">
          <h3>Resources</h3>
          <span className="footer-link" onClick={() => onNavigate('schemes')}>Schemes List</span>
          <a href="#" className="footer-link">Help Center</a>
          <a href="#" className="footer-link">Welfare Guides</a>
          <a href="#" className="footer-link">Blog & News</a>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>

        {/* CTA Column */}
        <div className="footer-brand-action">
          <div className="footer-cta-card">
            <h3>Ready to Get Started?</h3>
            <p className="text-sm text-muted mb-3">Create your verified household profile and unlock all matching welfare benefits.</p>
            <button className="btn btn-primary w-full" onClick={() => onTriggerAuth(true)}>
              Get Started Now
            </button>
          </div>
        </div>

      </div>

      <div className="footer-bottom text-center">
        <p>&copy; 2026 Yojana Saathi. All rights reserved. <span className="mx-2">•</span> Made with <span className="text-red">❤️</span> for India.</p>
      </div>
    </footer>
  );
}
