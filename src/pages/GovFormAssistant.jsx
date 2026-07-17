import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, ChevronLeft, ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react';

export default function GovFormAssistant({ onBack, user }) {
  const [activeField, setActiveField] = useState(null);
  const [formState, setFormState] = useState({
    aadhar: '',
    pan: '',
    income: '',
    account: ''
  });

  // Mocking the AI Assistant's guidance based on the active field
  const getAiGuidance = () => {
    if (!activeField) return "Click on any field in the form, and I will help you fill it correctly using your Yojana Saathi Passport data.";
    
    switch (activeField) {
      case 'aadhar':
        return `I can auto-fill this with your verified Aadhaar number. Note: The government portal requires the 12-digit format without spaces.`;
      case 'pan':
        return `Enter your PAN. If you don't have one, you can usually provide Form 60 instead for this specific scheme.`;
      case 'income':
        return `Based on your profile, your annual income is ₹${user?.income || 0}. Make sure this exactly matches the Income Certificate you uploaded.`;
      case 'account':
        return `Please enter your primary bank account number. Double-check the IFSC code as mismatches here cause 40% of application rejections!`;
      default:
        return "I'm here to help!";
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
          <ChevronLeft size={16} /> Exit Portal Simulation
        </button>
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto', width: '100%', borderTop: '6px solid #2c3e50' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ color: '#2c3e50', margin: '0 0 0.5rem 0' }}>National Welfare Portal</h2>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>Official Government of India Application Form</p>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" style={{ height: '60px', opacity: 0.8 }} />
          </div>

          <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', fontSize: '0.9rem', display: 'flex', gap: '12px' }}>
            <ShieldAlert size={20} style={{ flexShrink: 0 }} />
            <span>Warning: Providing false information is a punishable offense under the IT Act. Please ensure all details match your official documents.</span>
          </div>

          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#333' }}>1. Aadhaar Number (UID) <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="text" 
                style={{ padding: '0.75rem', borderRadius: '4px', border: activeField === 'aadhar' ? '2px solid var(--primary)' : '1px solid #ccc', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder="Enter 12 digit Aadhaar"
                value={formState.aadhar}
                onChange={e => setFormState({...formState, aadhar: e.target.value})}
                onFocus={() => setActiveField('aadhar')}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#333' }}>2. Permanent Account Number (PAN)</label>
              <input 
                type="text" 
                style={{ padding: '0.75rem', borderRadius: '4px', border: activeField === 'pan' ? '2px solid var(--primary)' : '1px solid #ccc', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder="Enter 10 character PAN"
                value={formState.pan}
                onChange={e => setFormState({...formState, pan: e.target.value})}
                onFocus={() => setActiveField('pan')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#333' }}>3. Declared Annual Income (in INR) <span style={{ color: 'red' }}>*</span></label>
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
              <label style={{ fontWeight: 600, color: '#333' }}>4. Bank Account Number for DBT <span style={{ color: 'red' }}>*</span></label>
              <input 
                type="text" 
                style={{ padding: '0.75rem', borderRadius: '4px', border: activeField === 'account' ? '2px solid var(--primary)' : '1px solid #ccc', fontSize: '1rem', transition: 'all 0.2s', outline: 'none' }}
                placeholder="Enter Account Number"
                value={formState.account}
                onChange={e => setFormState({...formState, account: e.target.value})}
                onFocus={() => setActiveField('account')}
              />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button style={{ padding: '0.75rem 2rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
              <button style={{ padding: '0.75rem 2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Application</button>
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
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Yojana Saathi Assistant</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● Active on Gov Portal</span>
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
              <Sparkles size={16} /> Auto-fill from Passport
            </motion.button>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Common Mistakes Analyzer</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px dashed #ef4444', display: 'flex', gap: '12px' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Do not use initials in the Name field if your Aadhaar has your full name. It causes automated rejections.</p>
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--gold)', display: 'flex', gap: '12px' }}>
                <Check size={18} color="var(--gold)" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Keep your scanned Income Certificate ready in PDF format (Max 2MB) for the next page.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Assistant Confidence</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 'bold' }}>98%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--bg-darker)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '98%', background: 'var(--success)' }}></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
