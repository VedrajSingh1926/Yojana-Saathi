import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ChevronLeft, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GovFormAssistant({ onBack, user, onEarnBadge, onNavigate }) {
  const { lang, t } = useLanguage();
  const [activeField, setActiveField] = useState(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);
  const [formState, setFormState] = useState({
    aadhar: '',
    pan: '',
    income: '',
    account: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate Badge
    const badgeId = `YJ-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newBadge = {
      id: badgeId,
      schemeName: 'Pradhan Mantri Awas Yojana', // Using a default for the prototype
      status: 'Completed',
      date: new Date().toLocaleDateString(),
      icon: '🏠'
    };
    if (onEarnBadge) {
      onEarnBadge(newBadge);
    }
    setEarnedBadge(newBadge);
    setShowBadgeModal(true);
  };

  // Mocking the AI Assistant's guidance based on the active field
  const getAiGuidance = () => {
    if (!activeField) return t.aiGuidanceIntro || "Click on any field in the form, and I will help you fill it correctly using your Yojana Saathi Passport data.";
    
    switch (activeField) {
      case 'aadhar':
        return t.aiGuidanceAadhar || `I can auto-fill this with your verified Aadhaar number. Note: The government portal requires the 12-digit format without spaces.`;
      case 'pan':
        return t.aiGuidancePan || `Enter your PAN. If you don't have one, you can usually provide Form 60 instead for this specific scheme.`;
      case 'income':
        return t.aiGuidanceIncome ? t.aiGuidanceIncome.replace('{0}', user?.income || 0) : `Based on your profile, your annual income is ₹${user?.income || 0}. Make sure this exactly matches the Income Certificate you uploaded.`;
      case 'account':
        return t.aiGuidanceAcc || `Please enter your primary bank account number. Double-check the IFSC code as mismatches here cause 40% of application rejections!`;
      default:
        return t.aiGuidanceDefault || "I'm here to help!";
    }
  };

  const handleAutofill = () => {
    if (activeField === 'aadhar') setFormState({ ...formState, aadhar: 'XXXX-XXXX-1234' });
    if (activeField === 'income') setFormState({ ...formState, income: user?.income?.toString() || '0' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999, background: '#f0f2f5' }}>
      
      {/* SIMULATED GOV PORTAL (LEFT SIDE) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <button className="btn btn-outline mb-4" onClick={onBack} style={{ alignSelf: 'flex-start', background: 'white', color: 'black', borderColor: '#ccc' }}>
          <ChevronLeft size={16} /> {t.exitPortal || "Exit Portal Simulation"}
        </button>
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto', width: '100%', borderTop: '6px solid #2c3e50' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: '#2c3e50', margin: '0 0 0.5rem 0' }}>{t.nationalWelfarePortal || "National Welfare Portal"}</h2>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>{t.officialGovForm || "Official Government of India Application Form"}</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" style={{ height: '60px', opacity: 0.8 }} />
          </div>

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '12px' }}>
            <div style={{ background: '#DBEAFE', color: '#2563EB', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Info size={18} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: '#1E3A8A', fontSize: '0.95rem' }}>
                <span style={{ marginRight: '6px' }}>🧪</span>
                {t.prototypeNoticeTitle || "Prototype Demonstration"}
              </h4>
              <p style={{ margin: 0, color: '#3B82F6', fontSize: '0.85rem', lineHeight: '1.4' }}>
                {t.prototypeNoticeDesc || "This is a simulated Government Application Form created for the hackathon demo. It demonstrates how Yojana Saathi's AI can understand government forms, guide users field-by-field, detect common mistakes, and auto-fill information using verified citizen data. The production version will integrate with official government portals and APIs wherever permitted."}
              </p>
            </div>
          </div>

          <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', fontSize: '0.9rem', display: 'flex', gap: '12px' }}>
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <span>{t.warningFalseInfo || "Warning: Providing false information is a punishable offense under the IT Act. Please ensure all details match your official documents."}</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#333' }}>{t.aadhaarNum || "1. Aadhaar Number (UID)"} <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="text" 
                style={{ padding: '0.75rem', borderRadius: '4px', border: activeField === 'aadhar' ? '2px solid var(--primary)' : '1px solid #ccc', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder={t.enterAadhaar || "Enter 12 digit Aadhaar"}
                value={formState.aadhar}
                onChange={e => setFormState({...formState, aadhar: e.target.value})}
                onFocus={() => setActiveField('aadhar')}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#333' }}>{t.panNum || "2. Permanent Account Number (PAN)"}</label>
              <input 
                type="text" 
                style={{ padding: '0.75rem', borderRadius: '4px', border: activeField === 'pan' ? '2px solid var(--primary)' : '1px solid #ccc', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder={t.enterPan || "Enter 10 character PAN"}
                value={formState.pan}
                onChange={e => setFormState({...formState, pan: e.target.value})}
                onFocus={() => setActiveField('pan')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#333' }}>{t.annualIncome || "3. Declared Annual Income (in INR)"} <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="number" 
                style={{ padding: '0.75rem', borderRadius: '4px', border: activeField === 'income' ? '2px solid var(--primary)' : '1px solid #ccc', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder="e.g. 150000"
                value={formState.income}
                onChange={e => setFormState({...formState, income: e.target.value})}
                onFocus={() => setActiveField('income')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#333' }}>{t.bankAccDbt || "4. Bank Account Number for DBT"} <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="text" 
                style={{ padding: '0.75rem', borderRadius: '4px', border: activeField === 'account' ? '2px solid var(--primary)' : '1px solid #ccc', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder={t.enterAcc || "Enter Account Number"}
                value={formState.account}
                onChange={e => setFormState({...formState, account: e.target.value})}
                onFocus={() => setActiveField('account')}
              />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => setFormState({ aadhar: '', pan: '', income: '', account: '' })} style={{ padding: '0.75rem 2rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{t.resetForm || "Reset"}</button>
              <button type="submit" style={{ padding: '0.75rem 2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>{t.submitApp || "Submit Application"}</button>
            </div>
          </form>
        </div>
      </div>

      {/* AI ASSISTANT PANEL (RIGHT SIDE) */}
      <motion.div 
        initial={{ x: 400 }} 
        animate={{ x: 0 }} 
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ width: '400px', background: 'var(--bg-darkest)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 30px rgba(0,0,0,0.2)' }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{t.assistantTitle || "Yojana Saathi Assistant"}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● {t.activePortal || "Active on Gov Portal"}</span>
          </div>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {getAiGuidance()}
            </p>
          </div>

          {(activeField === 'aadhar' || activeField === 'income') && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="btn btn-primary w-full"
              onClick={handleAutofill}
              style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}
            >
              <Sparkles size={16} /> {t.autoFillBtn || "Auto-fill from Passport"}
            </motion.button>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{t.commonMistakes || "Common Mistakes Analyzer"}</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px dashed #ef4444', display: 'flex', gap: '12px' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t.mistakeName || "Do not use initials in the Name field if your Aadhaar has your full name. It causes automated rejections."}</p>
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--gold)', display: 'flex', gap: '12px' }}>
                <Check size={18} color="var(--gold)" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t.mistakeDoc || "Keep your scanned Income Certificate ready in PDF format (Max 2MB) for the next page."}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.assistantConf || "Assistant Confidence"}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 'bold' }}>98%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--bg-darker)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '98%', background: 'var(--success)' }}></div>
          </div>
        </div>
      </motion.div>

      {/* SUCCESS MODAL */}
      {showBadgeModal && earnedBadge && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: '2rem' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
            <div className="glowing-orb orb-primary" style={{ top: '-20%', left: '-20%' }}></div>
            
            <div style={{ background: 'rgba(255,255,255,0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2.5rem' }}>
              {earnedBadge.icon}
            </div>
            
            <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Achievement Unlocked!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You have successfully completed the application for <strong>{earnedBadge.schemeName}</strong>.</p>
            
            <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(26,115,232,0.05))', border: '1px solid var(--gold)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '8px' }}>Badge ID: {earnedBadge.id}</div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Application Verified</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn btn-primary w-full" onClick={() => onNavigate('achievements')}>
                View in Achievements
              </button>
              <button className="btn btn-outline w-full" onClick={onBack}>
                Return to Schemes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
