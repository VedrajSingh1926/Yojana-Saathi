import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, User, Home, Upload, Target, Sparkles, Loader2, Plus, X, Users, Fingerprint } from 'lucide-react';

export default function Onboarding({ stateLocation, onChangeState, onComplete, onTriggerAuth }) {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '', '', '']);
  const [generatedSaathiId, setGeneratedSaathiId] = useState(null);

  const [formData, setFormData] = useState({
    personal: { name: '', age: '', gender: 'Male', occupation: '', income: '', phone: '', email: '', password: '', state: stateLocation || '', district: '' },
    household: { isHead: 'Yes', headName: '', members: [] },
    details: { houseType: 'Own', area: 'Urban', category: 'General', farmer: 'No', bpl: 'No', bank: 'Yes', land: 'None' },
    goals: []
  });

  useEffect(() => {
    if (formData.personal.state && onChangeState && formData.personal.state !== stateLocation) {
      onChangeState(formData.personal.state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.personal.state]);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [loadingMsg, setLoadingMsg] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', age: '', gender: 'Male', relation: '', occupation: '', income: '', education: '', disability: 'No', marital: 'Single' });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = async () => {
    setStep(7);
    const messages = [
      "Creating Household AI...",
      "Building Family Tree...",
      "Finding Schemes...",
      "Preparing Welfare Passport...",
      "Welcome to Yojana Saathi!"
    ];
    let i = 0;
    setLoadingMsg(messages[i]);

    const interval = setInterval(() => {
      i++;
      if (i < messages.length) {
        setLoadingMsg(messages[i]);
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      // Create a copy of formData with the full phone number for submission
      const submitData = {
        ...formData,
        personal: {
          ...formData.personal,
          phone: '+91' + formData.personal.phone
        }
      };
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      const data = await res.json();
      
      // Wait for the animation to finish roughly
      setTimeout(() => {
        if (data.success) {
          setGeneratedSaathiId(data.saathiId);
          setStep(8);
          // Auto close after 60 seconds
          setTimeout(() => {
            onComplete(formData, data.saathiId);
          }, 60000);
        } else {
          alert("Registration failed: " + data.message);
        }
      }, messages.length * 1200);
    } catch (err) {
      console.error(err);
      alert("Error saving data to server.");
    }
  };

  const handleAddMember = () => {
    setFormData(prev => ({
      ...prev,
      household: {
        ...prev.household,
        members: [...prev.household.members, newMember]
      }
    }));
    setShowAddMember(false);
    setNewMember({ name: '', age: '', gender: 'Male', relation: '', occupation: '', income: '', education: '', disability: 'No', marital: 'Single' });
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal]
    }));
  };

  const renderStepIcon = (num) => {
    if (step > num) return <Check size={14} />;
    return num;
  };

  return (
    <div className="onboarding-split-layout">
      <div className="onboarding-split-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1000)' }}>
        <div className="onboarding-split-overlay">
           <h2 className="text-white mb-2" style={{ fontSize: '2.5rem' }}>Your Unified Family Welfare Passport</h2>
           <p className="text-white-alpha" style={{ fontSize: '1.15rem' }}>Create your family profile securely to instantly discover all government schemes you are eligible for, with step-by-step AI guidance.</p>
        </div>
      </div>
      <div className="onboarding-split-content">
        <div className="view-section animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '2rem' }}>
      {step < 7 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--border-color)', zIndex: -1 }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '0', width: `${((step - 1) / 6) * 100}%`, height: '2px', background: 'var(--primary)', zIndex: -1, transition: 'width 0.3s' }}></div>
          {[1, 2, 3, 4, 5, 6].map(num => (
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
        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <User size={24} /> Step 1 — Personal Information
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p className="text-muted mb-0">Basic details for primary applicant</p>
              <p className="text-sm m-0">
                Already have an account? <a href="#" className="text-gold" onClick={(e) => { e.preventDefault(); if (onTriggerAuth) onTriggerAuth(false); }}>Sign In</a>
              </p>
            </div>
            
            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.name} onChange={(e) => setFormData({...formData, personal: {...formData.personal, name: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.age} onChange={(e) => setFormData({...formData, personal: {...formData.personal, age: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.gender} onChange={(e) => setFormData({...formData, personal: {...formData.personal, gender: e.target.value}})}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Occupation</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.occupation} onChange={(e) => setFormData({...formData, personal: {...formData.personal, occupation: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>Income (Annual)</label>
                <input type="number" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.income} onChange={(e) => setFormData({...formData, personal: {...formData.personal, income: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-darkest)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem' }}>
                  <span style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: '500', borderRight: '1px solid var(--border-color)' }}>+91</span>
                  <input type="tel" className="form-input" style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', outline: 'none', width: '100%' }} 
                    value={formData.personal.phone} onChange={(e) => setFormData({...formData, personal: {...formData.personal, phone: e.target.value.replace(/\D/g, '')}})} placeholder="98765 43210" maxLength={10} />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.email} onChange={(e) => setFormData({...formData, personal: {...formData.personal, email: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.password} onChange={(e) => setFormData({...formData, personal: {...formData.personal, password: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.state} onChange={(e) => setFormData({...formData, personal: {...formData.personal, state: e.target.value}})} />
              </div>
              <div className="form-group">
                <label>District</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} 
                  value={formData.personal.district} onChange={(e) => setFormData({...formData, personal: {...formData.personal, district: e.target.value}})} />
              </div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary" disabled={isSendingOtp} onClick={async () => {
                if (!formData.personal.phone) {
                  alert("Please enter your phone number.");
                  return;
                }
                
                setIsSendingOtp(true);
                try {
                  const fullPhone = '+91' + formData.personal.phone;
                  
                  // Check if number exists
                  const checkRes = await fetch('/api/auth/check-number', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber: fullPhone })
                  });
                  const checkData = await checkRes.json();
                  
                  if (checkData.exists) {
                    alert("This mobile number is already registered. Please login instead.");
                    if (onTriggerAuth) onTriggerAuth(false);
                    setIsSendingOtp(false);
                    return;
                  }

                  if (!otpSent) {
                    const res = await fetch('/api/auth/send-otp', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ phoneNumber: fullPhone })
                    });
                    const data = await res.json();
                    if (data.success) {
                      setOtpSent(true);
                      nextStep();
                    } else {
                      alert(data.message || "Failed to send OTP.");
                    }
                  } else {
                    nextStep();
                  }
                } catch (err) {
                  console.error(err);
                  alert("Error connecting to server.");
                } finally {
                  setIsSendingOtp(false);
                }
              }}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <User size={24} /> Step 2 — Identity Verification
            </h2>
            <p className="text-muted mb-4">Verify your phone and email to secure your account</p>
            
            <div style={{ gap: '2rem', marginBottom: '2rem', maxWidth: '500px' }}>
              <div style={{ background: 'var(--bg-darkest)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Mobile OTP</h4>
                <p className="text-sm text-muted mb-3">Sent to +91{formData.personal.phone}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <input 
                      key={i} 
                      type="text" 
                      maxLength="1" 
                      className="form-input" 
                      value={mobileOtp[i]}
                      onChange={(e) => {
                        const newOtp = [...mobileOtp];
                        newOtp[i] = e.target.value;
                        setMobileOtp(newOtp);
                        if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
                      }}
                      style={{ width: '45px', height: '45px', textAlign: 'center', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }} 
                    />
                  ))}
                </div>
                {!otpSent ? (
                  <button type="button" className="btn btn-outline btn-sm" disabled={true}>
                    {isSendingOtp ? "Sending OTP Automatically..." : "Preparing..."}
                  </button>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="text-success text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Sent successfully</span>
                    <button type="button" className="btn btn-text btn-sm text-gold" disabled={isSendingOtp} onClick={async () => {
                      setIsSendingOtp(true);
                      try {
                        const fullPhone = '+91' + formData.personal.phone;
                        const res = await fetch('/api/auth/send-otp', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ phoneNumber: fullPhone })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert("OTP Resent successfully!");
                        } else {
                          alert(data.message || "Failed to resend OTP.");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Error connecting to server.");
                      } finally {
                        setIsSendingOtp(false);
                      }
                    }}>{isSendingOtp ? "Resending..." : "Resend OTP"}</button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" disabled={isVerifying} onClick={async () => {
                const otpString = mobileOtp.join('');
                if (otpString.length !== 6) {
                  alert("Please enter the 6-digit Mobile OTP.");
                  return;
                }
                
                setIsVerifying(true);
                try {
                  const fullPhone = '+91' + formData.personal.phone;
                  const res = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber: fullPhone, otp: otpString })
                  });
                  const data = await res.json();

                  if (data.success) {
                    nextStep();
                  } else {
                    alert(data.message || "Invalid OTP code.");
                  }
                } catch (err) {
                  console.error(err);
                  alert("Error connecting to server to verify OTP.");
                } finally {
                  setIsVerifying(false);
                }
              }}>
                {isVerifying ? "Verifying..." : "Verify & Next"} <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: FAMILY DETAILS */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Users size={24} /> Step 3 — Family Details
            </h2>
            <p className="text-muted mb-4">Build your Family Tree for maximum scheme coverage.</p>
            
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Are you the Family Head?</label>
              <select className="form-input" style={{ width: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}
                value={formData.household.isHead} onChange={(e) => setFormData({...formData, household: {...formData.household, isHead: e.target.value}})}>
                <option>Yes</option><option>No</option>
              </select>
            </div>

            {formData.household.isHead === 'No' && (
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label>Family Head Name</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)', maxWidth: '400px' }} 
                  placeholder="Enter name of the Family Head"
                  value={formData.household.headName || ''} 
                  onChange={(e) => setFormData({...formData, household: {...formData.household, headName: e.target.value}})} 
                />
              </div>
            )}

            {/* Added Members List - Premium Cards */}
            {formData.household.members.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Family Members ({formData.household.members.length})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {formData.household.members.map((m, idx) => (
                    <motion.div key={idx} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      style={{ 
                        padding: '1.25rem', 
                        background: 'linear-gradient(145deg, var(--bg-card), var(--bg-darkest))', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        position: 'relative'
                      }}>
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary-glow)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>{m.relation}</div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--gold)' }}>{m.name}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div><strong>Age:</strong> {m.age}</div>
                        <div><strong>Gender:</strong> {m.gender}</div>
                        <div><strong>Occupation:</strong> {m.occupation}</div>
                        <div><strong>Income:</strong> ₹{m.income}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Animated Add Member Form */}
            {showAddMember ? (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ overflow: 'hidden', padding: '1.5rem', background: 'var(--bg-darker)', border: '1px solid var(--border-color)', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--primary)' }}><Users size={16} style={{ display: 'inline', marginRight: '4px' }}/> Add Family Member</h4>
                  <button className="icon-btn" onClick={() => setShowAddMember(false)} style={{ width: '28px', height: '28px' }}><X size={14}/></button>
                </div>
                <div className="grid-2-col" style={{ gap: '1rem' }}>
                  <div className="form-group"><label>Name</label><input type="text" className="form-input" value={newMember.name} onChange={e=>setNewMember({...newMember, name: e.target.value})} /></div>
                  <div className="form-group"><label>Age</label><input type="number" className="form-input" value={newMember.age} onChange={e=>setNewMember({...newMember, age: e.target.value})} /></div>
                  <div className="form-group"><label>Gender</label><select className="form-input" value={newMember.gender} onChange={e=>setNewMember({...newMember, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
                  <div className="form-group"><label>Relation</label><input type="text" className="form-input" placeholder="e.g. Son, Wife, Father" value={newMember.relation} onChange={e=>setNewMember({...newMember, relation: e.target.value})} /></div>
                  <div className="form-group"><label>Occupation</label><input type="text" className="form-input" value={newMember.occupation} onChange={e=>setNewMember({...newMember, occupation: e.target.value})} /></div>
                  <div className="form-group"><label>Annual Income</label><input type="number" className="form-input" value={newMember.income} onChange={e=>setNewMember({...newMember, income: e.target.value})} /></div>
                  <div className="form-group"><label>Education</label><input type="text" className="form-input" value={newMember.education} onChange={e=>setNewMember({...newMember, education: e.target.value})} /></div>
                  <div className="form-group"><label>Marital Status</label><select className="form-input" value={newMember.marital} onChange={e=>setNewMember({...newMember, marital: e.target.value})}><option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option></select></div>
                  <div className="form-group"><label>Disability (Yes/No)</label><select className="form-input" value={newMember.disability} onChange={e=>setNewMember({...newMember, disability: e.target.value})}><option>No</option><option>Yes</option></select></div>
                </div>
                <button className="btn btn-primary btn-sm mt-4" onClick={handleAddMember} style={{ padding: '0.75rem 1.5rem' }}>Save Member Profile</button>
              </motion.div>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} className="btn btn-outline mb-3" onClick={() => setShowAddMember(true)} style={{ width: '100%', padding: '1rem', borderStyle: 'dashed' }}>
                <Plus size={18} style={{ marginRight: '8px' }} /> Add Family Member (Unlimited)
              </motion.button>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: HOUSE DETAILS */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Home size={24} /> Step 4 — House Details
            </h2>
            <p className="text-muted mb-4">Information to identify specific eligible schemes (like housing, farming)</p>
            
            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
              <div className="form-group"><label>House Ownership</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} value={formData.details.houseType} onChange={e=>setFormData({...formData, details: {...formData.details, houseType: e.target.value}})}><option>Own</option><option>Rent</option></select></div>
              <div className="form-group"><label>Area Type</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} value={formData.details.area} onChange={e=>setFormData({...formData, details: {...formData.details, area: e.target.value}})}><option>Rural</option><option>Urban</option></select></div>
              <div className="form-group"><label>Land Ownership</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} value={formData.details.land} onChange={e=>setFormData({...formData, details: {...formData.details, land: e.target.value}})}><option>None</option><option>Agricultural</option><option>Residential</option></select></div>
              <div className="form-group"><label>Category</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} value={formData.details.category} onChange={e=>setFormData({...formData, details: {...formData.details, category: e.target.value}})}><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>EWS</option></select></div>
              <div className="form-group"><label>Bank Account Available?</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} value={formData.details.bank} onChange={e=>setFormData({...formData, details: {...formData.details, bank: e.target.value}})}><option>Yes</option><option>No</option></select></div>
              <div className="form-group"><label>Farmer?</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} value={formData.details.farmer} onChange={e=>setFormData({...formData, details: {...formData.details, farmer: e.target.value}})}><option>No</option><option>Yes</option></select></div>
              <div className="form-group"><label>BPL Card Holder?</label><select className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} value={formData.details.bpl} onChange={e=>setFormData({...formData, details: {...formData.details, bpl: e.target.value}})}><option>No</option><option>Yes</option></select></div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={() => {
                const { houseType, area, land, category, bank, farmer, bpl } = formData.details;
                if (!houseType || !area || !land || !category || !bank || !farmer || !bpl) {
                  alert("Please fill in all house details before proceeding.");
                  return;
                }
                nextStep();
              }}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {/* STEP 5: DOCUMENTS */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Upload size={24} /> Step 5 — Documents
            </h2>
            <p className="text-muted mb-4">Optional Upload for faster verifications</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {['Income Certificate', 'Aadhaar Card', 'Ration Card', 'Disability Certificate', 'Other Supporting Documents'].map(doc => (
                <div key={doc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-darker)', border: '1px dashed var(--border-color)', borderRadius: '12px', transition: 'all 0.2s' }} className="hover:border-primary cursor-pointer">
                  <span style={{ fontWeight: 500 }}>{doc}</span>
                  <button className="btn btn-outline btn-sm">Select File</button>
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem', background: 'rgba(217, 119, 54, 0.1)', borderLeft: '4px solid var(--primary)', borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong>For demo purposes documents are optional. Government verification will happen in production.</strong>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {/* STEP 6: GOALS */}
        {step === 6 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Target size={24} /> Step 6 — Goals
            </h2>
            <p className="text-muted mb-4">What would you like the AI to help you achieve?</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {['🏠 House', '🎓 Education', '💼 Employment', '💰 Business', '👩 Women Improvement', '❤️ Health', '🌾 Agriculture', '👴 Pension'].map(goal => (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  key={goal} 
                  onClick={() => toggleGoal(goal)}
                  style={{ 
                    padding: '1.5rem', 
                    border: '2px solid', 
                    borderColor: formData.goals.includes(goal) ? 'var(--primary)' : 'var(--border-color)', 
                    borderRadius: '12px', 
                    textAlign: 'center', 
                    cursor: 'pointer', 
                    background: formData.goals.includes(goal) ? 'var(--primary-glow)' : 'var(--bg-darkest)',
                    boxShadow: formData.goals.includes(goal) ? '0 4px 15px rgba(212,175,55,0.15)' : 'none',
                    transition: 'all 0.2s', 
                    fontWeight: formData.goals.includes(goal) ? '700' : '500',
                    fontSize: '1.1rem'
                  }}
                >
                  {goal}
                </motion.div>
              ))}
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={handleFinish} style={{ padding: '0.75rem 2rem' }}>Complete Registration <Sparkles size={18} style={{ marginLeft: '8px' }}/></button>
            </div>
          </motion.div>
        )}

        {/* STEP 7: LOADING ANIMATION */}
        {step === 7 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            {loadingMsg.includes("Welcome") ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary)' }}>
                    <Check size={40} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <Loader2 size={56} className="text-gold" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 2rem', color: 'var(--primary)' }} />
            )}
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            
            <div style={{ textAlign: 'left', maxWidth: '350px', margin: '0 auto 2.5rem', padding: '1.5rem', background: 'var(--bg-darker)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '1.05rem', color: loadingMsg.includes("Building") || loadingMsg.includes("Finding") || loadingMsg.includes("Preparing") || loadingMsg.includes("Welcome") ? 'var(--primary)' : 'var(--text-muted)' }}>
                {loadingMsg.includes("Creating") ? <Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> : <Check size={18}/>} 
                Creating Household AI...
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '1.05rem', color: loadingMsg.includes("Finding") || loadingMsg.includes("Preparing") || loadingMsg.includes("Welcome") ? 'var(--primary)' : 'var(--text-muted)' }}>
                {loadingMsg.includes("Building") ? <Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> : <Check size={18}/>} 
                Building Family Tree...
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '1.05rem', color: loadingMsg.includes("Preparing") || loadingMsg.includes("Welcome") ? 'var(--primary)' : 'var(--text-muted)' }}>
                {loadingMsg.includes("Finding") ? <Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> : <Check size={18}/>} 
                Finding Schemes...
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', color: loadingMsg.includes("Welcome") ? 'var(--primary)' : 'var(--text-muted)' }}>
                {loadingMsg.includes("Preparing") ? <Loader2 size={18} style={{ animation: 'spin 2s linear infinite' }} /> : <Check size={18}/>} 
                Preparing Welfare Passport...
              </div>
            </div>

            {loadingMsg.includes("Welcome") && (
              <motion.h3 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>
                Welcome to Yojana Saathi 🚀
              </motion.h3>
            )}
          </motion.div>
        )}

        {/* STEP 8: SAATHI ID GENERATION POPUP (60s) */}
        {step === 8 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              <Fingerprint size={48} />
            </div>
            
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Welcome to Yojana Saathi!</h2>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Your Family's Digital Welfare Passport is ready.</p>
            
            <div style={{ background: 'var(--bg-darkest)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', margin: '0 auto 2rem', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your Saathi ID</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', border: '1px dashed var(--gold)' }}>
                <strong style={{ fontSize: '1.8rem', color: 'var(--gold)', letterSpacing: '3px' }}>{generatedSaathiId}</strong>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1 }}
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSaathiId);
                    alert("Saathi ID Copied to clipboard!");
                  }}
                >
                  Copy ID
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={() => alert("Downloading ID Card (Demo)...")}
                >
                  Download Card
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: '8px', display: 'inline-block' }}>
                {/* Mock QR Code */}
                <div style={{ width: '120px', height: '120px', background: 'url(https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg) center/contain no-repeat' }}></div>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              <strong>Note:</strong> Your Saathi ID will be used for all future logins and government benefit tracking. Please keep it safe.
            </p>

            <button 
              className="btn btn-text" 
              onClick={() => onComplete(formData, generatedSaathiId)}
            >
              Continue to Dashboard <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
      </div>
      </div>
    </div>
  );
}
