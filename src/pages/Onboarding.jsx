import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, User, Home, FileText, Upload, Target, Sparkles, Loader2 } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: { name: '', phone: '', email: '', age: '', gender: '', state: '', district: '' },
    household: { isHead: 'Yes', familyType: 'Nuclear', members: [] },
    details: { houseType: 'Own', area: 'Urban', category: 'General', farmer: 'No', bpl: 'No', bank: 'Yes', land: 'None' },
    goals: []
  });

  const [loadingMsg, setLoadingMsg] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    setStep(6);
    const messages = [
      "Creating Household Profile...",
      "Building Family Tree...",
      "Understanding Your Priorities...",
      "Finding Eligible Government Schemes...",
      "Preparing Your Welfare Passport..."
    ];
    let i = 0;
    setLoadingMsg(messages[i]);
    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setLoadingMsg(messages[i]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete(formData);
        }, 1500);
      }
    }, 1200);
  };

  const renderStepIcon = (num) => {
    if (step > num) return <Check size={14} />;
    return num;
  };

  return (
    <div className="view-section animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      {step < 6 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--border-color)', zIndex: -1 }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '0', width: `${((step - 1) / 4) * 100}%`, height: '2px', background: 'var(--primary)', zIndex: -1, transition: 'width 0.3s' }}></div>
          {[1, 2, 3, 4, 5].map(num => (
            <div key={num} style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: step >= num ? 'var(--primary)' : 'var(--bg-darker)',
              color: step >= num ? 'white' : 'var(--text-muted)',
              border: `2px solid ${step >= num ? 'var(--primary)' : 'var(--border-color)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.3s'
            }}>
              {renderStepIcon(num)}
            </div>
          ))}
        </div>
      )}

      <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <User size={24} /> Step 1: Personal Information
            </h2>
            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} />
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <input type="email" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} />
              </div>
              <div className="form-group">
                <label>District</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} />
              </div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Home size={24} /> Step 2: Household Information
            </h2>
            <p className="text-muted mb-4">Tell us about your family</p>
            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                <label>Are you the Family Head?</label>
                <select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}>
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Family Type</label>
                <select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}>
                  <option>Nuclear</option><option>Joint</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-outline btn-sm mb-3">+ Add Family Member</button>
              <div className="text-sm text-muted">You can add detailed information for each member here.</div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-text" onClick={prevStep}>Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <FileText size={24} /> Step 3: Household Details
            </h2>
            <p className="text-muted mb-4">Information to identify eligible schemes</p>
            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
              <div className="form-group"><label>House Type</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>Own</option><option>Rented</option></select></div>
              <div className="form-group"><label>Area</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>Rural</option><option>Urban</option></select></div>
              <div className="form-group"><label>Category</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option></select></div>
              <div className="form-group"><label>Farmer?</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>No</option><option>Yes</option></select></div>
              <div className="form-group"><label>BPL Card?</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>No</option><option>Yes</option></select></div>
              <div className="form-group"><label>Bank Account Available?</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>Yes</option><option>No</option></select></div>
              <div className="form-group"><label>Land Ownership</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>None</option><option>Agricultural</option><option>Residential</option></select></div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-text" onClick={prevStep}>Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Upload size={24} /> Step 4: Documents (Optional)
            </h2>
            <p className="text-muted mb-4">Upload if available (optional for this demo)</p>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center', marginBottom: '1.5rem' }}>
              <p className="text-sm">Click to browse or drag and drop files here.</p>
              <p className="text-xs text-muted mt-1">Aadhaar Card, Income Certificate, Ration Card, etc.</p>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-text" onClick={prevStep}>Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Skip / Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Target size={24} /> Step 5: Goals & Priorities
            </h2>
            <p className="text-muted mb-4">What would you like AI to help you with?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {['🏠 House', '🎓 Education', '💼 Employment', '💰 Business', '🌾 Agriculture', '❤️ Health', '👩 Women Welfare', '👴 Pension', '👶 Child Welfare', '♿ Disability'].map(goal => (
                <div key={goal} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-darkest)' }} onClick={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}>
                  {goal}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-text" onClick={prevStep}>Back</button>
              <button className="btn btn-primary" onClick={handleFinish}>Complete Setup <Sparkles size={18} style={{ marginLeft: '6px' }}/></button>
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Loader2 size={48} className="text-primary" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1.5rem' }} />
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{loadingMsg}</h3>
            <p className="text-muted">Welcome to Yojana Saathi 🚀</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
