import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Loader, Calendar, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VerifyBadge({ badgeId, onNavigate }) {
  const { lang, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    // Simulate fetching badge data from a public endpoint or local storage
    setTimeout(() => {
      // In a real app, we'd fetch this from the backend by ID
      // For this demo, we'll try to find it in localStorage
      const storedBadges = JSON.parse(localStorage.getItem('yojana_badges') || '[]');
      const foundBadge = storedBadges.find(b => b.id === badgeId);
      
      if (foundBadge) {
        setBadge(foundBadge);
      } else {
        // Fallback mock for demo if opened directly
        if (badgeId === 'DEMO-1234') {
          setBadge({
            id: 'DEMO-1234',
            schemeName: 'Pradhan Mantri Awas Yojana',
            status: 'Completed',
            date: new Date().toLocaleDateString(),
            icon: '🏠'
          });
        }
      }
      setLoading(false);
    }, 1500);
  }, [badgeId]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-darkest)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="glowing-orb orb-primary" style={{ top: '-10%', left: '-10%' }}></div>
      
      <div style={{
        background: 'rgba(20, 20, 25, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary)' }}>Yojana</span> Saathi
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{t.publicVerifyDesc || "Public Achievement Verification"}</p>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0' }}>
            <Loader size={48} className="spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{t.verifyingBadge || "Verifying digital credentials..."}</p>
          </div>
        ) : badge ? (
          <div style={{ textAlign: 'left' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              background: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '50px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: '2rem',
              width: 'fit-content',
              margin: '0 auto 2rem auto'
            }}>
              <ShieldCheck size={20} />
              <span style={{ fontWeight: '600' }}>{t.badgeValid || "Authentic Achievement"}</span>
            </div>

            <div style={{ 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{t.schemeName || "Scheme Name"}</label>
                  <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{badge.icon}</span> {badge.schemeName}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{t.badgeId || "Badge ID"}</label>
                  <div style={{ fontSize: '1.1rem', color: 'var(--gold)', fontFamily: 'monospace' }}>{badge.id}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{t.status || "Status"}</label>
                    <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={16} /> {badge.status}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12}/> {t.completionDate || "Completion Date"}</label>
                    <div style={{ color: 'var(--text-secondary)' }}>{badge.date}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              padding: '1rem', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.1)',
              marginBottom: '2rem'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', position: 'relative', top: '2px' }}/>
                {t.privacyNotice || "This page verifies the achievement only. Personal information (Name, Aadhaar, Income) is protected and hidden for privacy."}
              </p>
            </div>
            
            <button 
              className="btn btn-outline w-full" 
              onClick={() => onNavigate('home')}
            >
              {t.returnHome || "Return to Yojana Saathi"}
            </button>
          </div>
        ) : (
          <div style={{ padding: '2rem 0' }}>
            <ShieldAlert size={64} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: 'var(--danger)' }}>{t.badgeNotFound || "Badge Not Found"}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.badgeNotFoundDesc || "This achievement badge is invalid or does not exist."}</p>
            <button className="btn btn-primary w-full" onClick={() => onNavigate('home')}>
              {t.returnHome || "Return Home"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
