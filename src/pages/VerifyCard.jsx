import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Key, Calendar, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VerifyCard({ cardId, onLogin }) {
  const { lang, t } = useLanguage();
  const API_URL = import.meta.env.VITE_API_URL || '';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify/${cardId}`);
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Card not found or invalid.');
        }
      } catch (err) {
        setError('Network error verifying card.');
      } finally {
        setLoading(false);
      }
    }
    
    if (cardId) verify();
    else {
      setError("No Card ID provided.");
      setLoading(false);
    }
  }, [cardId]);

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
      <div className="glowing-orb orb-secondary" style={{ bottom: '-10%', right: '-10%' }}></div>
      
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{t.verifyCardSubtitle || "Official Digital Identity Verification"}</p>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0' }}>
            <Loader size={48} className="spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{t.verifying || "Verifying blockchain records..."}</p>
          </div>
        ) : error ? (
          <div style={{ padding: '2rem 0' }}>
            <ShieldAlert size={64} style={{ color: 'var(--danger)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: 'var(--danger)' }}>{t.verifyFailed || "Verification Failed"}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        ) : (
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
              <span style={{ fontWeight: '600' }}>{t.cardValid || "Authentic Card Verified"}</span>
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
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{t.householdHead || "Household Head Name"}</label>
                  <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '500' }}>{data.maskedHeadName}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{t.saathiId || "Saathi ID"}</label>
                  <div style={{ fontSize: '1.1rem', color: 'var(--gold)', fontFamily: 'monospace' }}>{data.maskedSaathiId}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px' }}>{t.status || "Status"}</label>
                    <div style={{ color: '#10b981' }}>{data.cardStatus}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12}/> {t.issueDate || "Issue Date"}</label>
                    <div style={{ color: 'var(--text-secondary)' }}>{data.issueDate}</div>
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
                {t.verifyWarning || "This page only verifies that this Household Card is authentic. Sensitive information is protected for privacy."}
              </p>
            </div>

            <button 
              onClick={onLogin}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Key size={18} />
              Login to View Complete Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
