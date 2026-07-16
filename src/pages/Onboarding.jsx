import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, User, Home, FileText, Upload, Target, Sparkles, Loader2, Plus, X } from 'lucide-react';
import { useSignUp } from '@clerk/clerk-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState(['', '', '', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    personal: { name: '', phone: '', email: '', age: '', gender: 'Male', state: '', district: '' },
    household: { isHead: 'Yes', familyType: 'Nuclear', members: [] },
    details: { houseType: 'Own', area: 'Urban', category: 'General', farmer: 'No', bpl: 'No', bank: 'Yes', land: 'None' },
    goals: []
  });

  const { isLoaded, signUp, setActive } = useSignUp();
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [loadingMsg, setLoadingMsg] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', age: '', gender: 'Male', relation: '', occupation: '', education: '', income: '', marital: 'Single', disability: 'No' });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = async () => {
    setStep(7);
    const messages = [
      "Creating Household Profile...",
      "Building Family Tree...",
      "Understanding Your Priorities...",
      "Finding Eligible Government Schemes...",
      "Preparing Your Welfare Passport..."
    ];
    let i = 0;
    setLoadingMsg(messages[i]);
    
    // Save to MongoDB in background
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        console.error("Backend error:", await response.text());
        alert("Warning: Failed to save to MongoDB. Is the backend running?");
      }
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Warning: Could not connect to backend server. Data will not be saved.");
    }

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

  const handleAddMember = () => {
    setFormData(prev => ({
      ...prev,
      household: {
        ...prev.household,
        members: [...prev.household.members, newMember]
      }
    }));
    setShowAddMember(false);
    setNewMember({ name: '', age: '', gender: 'Male', relation: '', occupation: '', education: '', income: '', marital: 'Single', disability: 'No' });
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
    <div className="view-section animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      {step < 7 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'var(--border-color)', zIndex: -1 }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '0', width: `${((step - 1) / 5) * 100}%`, height: '2px', background: 'var(--primary)', zIndex: -1, transition: 'width 0.3s' }}></div>
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
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <User size={24} /> Step 1 — Personal Information
            </h2>
            <p className="text-muted mb-4">Basic details</p>
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
              <button type="button" className="btn btn-primary" onClick={async () => {
                if (!formData.personal.phone || !formData.personal.email) {
                  alert("Please enter both phone number and email for verification.");
                  return;
                }
                nextStep();
              }}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <User size={24} /> Step 2 — Identity Verification
            </h2>
            <p className="text-muted mb-4">Verify your phone and email to secure your account</p>
            
            <div className="grid-2-col" style={{ gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--bg-darkest)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Mobile OTP</h4>
                <p className="text-sm text-muted mb-3">Sent to {formData.personal.phone}</p>
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
                  <button type="button" className="btn btn-outline btn-sm" disabled={isSendingOtp} onClick={async () => {
                    if (!isLoaded) return;
                    setIsSendingOtp(true);
                    try {
                      // Attempt to create a user in Clerk with phone and email
                      await signUp.create({
                        phoneNumber: '+91' + formData.personal.phone,
                        emailAddress: formData.personal.email,
                        password: Math.random().toString(36).slice(-8) + 'A1!' // Dummy password in case instance requires one
                      });
                      
                      // Trigger SMS
                      await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
                      // Trigger Email OTP
                      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                      
                      setOtpSent(true);
                    } catch (err) {
                      console.error("Clerk Error:", err);
                      alert(err.errors?.[0]?.longMessage || "Error sending OTP. Make sure Clerk has Phone/Email auth enabled.");
                    } finally {
                      setIsSendingOtp(false);
                    }
                  }}>
                    {isSendingOtp ? "Sending..." : "Send Real OTP via Clerk"}
                  </button>
                ) : (
                  <span className="text-success text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Sent successfully</span>
                )}
              </div>

              <div style={{ background: 'var(--bg-darkest)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Email OTP</h4>
                <p className="text-sm text-muted mb-3">Sent to {formData.personal.email}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <input 
                      key={i} 
                      type="text" 
                      maxLength="1" 
                      className="form-input" 
                      value={emailOtp[i]}
                      onChange={(e) => {
                        const newOtp = [...emailOtp];
                        newOtp[i] = e.target.value;
                        setEmailOtp(newOtp);
                        if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
                      }}
                      style={{ width: '45px', height: '45px', textAlign: 'center', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }} 
                    />
                  ))}
                </div>
                {!otpSent ? (
                  <button type="button" className="btn btn-outline btn-sm" disabled={isSendingOtp} onClick={() => alert("Please click the 'Send Real OTP' button under Mobile OTP first. It will send both simultaneously!")}>
                    Send OTP
                  </button>
                ) : (
                  <span className="text-success text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={14}/> Sent successfully</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" disabled={isVerifying} onClick={async () => {
                if (mobileOtp.join('').length < 6 || emailOtp.join('').length < 6) {
                  alert("Please enter the full 6-digit OTP codes sent by Clerk.");
                  return;
                }
                
                setIsVerifying(true);
                try {
                  // Verify Phone
                  const phoneVerification = await signUp.attemptPhoneNumberVerification({
                    code: mobileOtp.join('')
                  });
                  
                  if (phoneVerification.status !== "complete" && phoneVerification.status !== "missing_requirements") {
                    alert("Invalid Phone OTP");
                    setIsVerifying(false);
                    return;
                  }

                  // Verify Email
                  const emailVerification = await signUp.attemptEmailAddressVerification({
                    code: emailOtp.join('')
                  });

                  if (emailVerification.status === "complete") {
                    await setActive({ session: emailVerification.createdSessionId });
                    nextStep();
                  } else {
                    alert("Verification incomplete. Status: " + emailVerification.status);
                  }
                } catch (err) {
                  console.error("Verification Error:", err);
                  alert(err.errors?.[0]?.longMessage || "Invalid OTP codes provided.");
                } finally {
                  setIsVerifying(false);
                }
              }}>
                {isVerifying ? "Verifying..." : "Verify & Next"} <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Home size={24} /> Step 3 — Household Information
            </h2>
            <p className="text-muted mb-4">Tell us about your family</p>
            <div className="grid-2-col" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
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

            {/* Added Members List */}
            {formData.household.members.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Family Members ({formData.household.members.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {formData.household.members.map((m, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', background: 'var(--bg-darker)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><strong>{m.name}</strong> <span className="text-muted">({m.relation})</span> - {m.age} yrs, {m.gender}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Member Form */}
            {showAddMember ? (
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px dashed var(--border-color)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4>Add Family Member</h4>
                  <button className="icon-btn" onClick={() => setShowAddMember(false)} style={{ width: '28px', height: '28px' }}><X size={14}/></button>
                </div>
                <div className="grid-2-col" style={{ gap: '1rem' }}>
                  <div className="form-group"><label>Name</label><input type="text" className="form-input" value={newMember.name} onChange={e=>setNewMember({...newMember, name: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} /></div>
                  <div className="form-group"><label>Age</label><input type="number" className="form-input" value={newMember.age} onChange={e=>setNewMember({...newMember, age: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} /></div>
                  <div className="form-group"><label>Gender</label><select className="form-input" value={newMember.gender} onChange={e=>setNewMember({...newMember, gender: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>Male</option><option>Female</option><option>Other</option></select></div>
                  <div className="form-group"><label>Relation</label><input type="text" className="form-input" placeholder="e.g. Son, Wife" value={newMember.relation} onChange={e=>setNewMember({...newMember, relation: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} /></div>
                  <div className="form-group"><label>Occupation</label><input type="text" className="form-input" value={newMember.occupation} onChange={e=>setNewMember({...newMember, occupation: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} /></div>
                  <div className="form-group"><label>Education</label><input type="text" className="form-input" value={newMember.education} onChange={e=>setNewMember({...newMember, education: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} /></div>
                  <div className="form-group"><label>Annual Income</label><input type="number" className="form-input" value={newMember.income} onChange={e=>setNewMember({...newMember, income: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }} /></div>
                  <div className="form-group"><label>Marital Status</label><select className="form-input" value={newMember.marital} onChange={e=>setNewMember({...newMember, marital: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>Single</option><option>Married</option><option>Widowed</option></select></div>
                  <div className="form-group"><label>Disability (Yes/No)</label><select className="form-input" value={newMember.disability} onChange={e=>setNewMember({...newMember, disability: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-darkest)' }}><option>No</option><option>Yes</option></select></div>
                </div>
                <button className="btn btn-primary btn-sm mt-3" onClick={handleAddMember}>Save Member</button>
              </div>
            ) : (
              <button className="btn btn-outline btn-sm mb-3" onClick={() => setShowAddMember(true)}>
                <Plus size={14} /> Add Family Members (Unlimited)
              </button>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <FileText size={24} /> Step 4 — Household Details
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
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Upload size={24} /> Step 5 — Documents (Optional)
            </h2>
            <p className="text-muted mb-4">For Hackathon Demo - Upload if available (optional):</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {['Aadhaar Card', 'Income Certificate', 'Ration Card', 'Disability Certificate', 'Caste Certificate', 'Other Supporting Documents'].map(doc => (
                <div key={doc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-darker)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                  <span>{doc}</span>
                  <button className="btn btn-outline btn-sm">Upload</button>
                </div>
              ))}
            </div>

            <div style={{ padding: '1rem', background: 'rgba(217, 119, 54, 0.1)', borderLeft: '4px solid var(--primary)', borderRadius: '0 8px 8px 0', fontSize: '0.85rem' }}>
              <strong>Note:</strong> Documents are optional for this demo. Government verification will happen through official APIs in the production version.
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>Next <ChevronRight size={18} /></button>
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              <Target size={24} /> Step 6 — Goals & Priorities
            </h2>
            <p className="text-muted mb-4">What would you like AI to help you with?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {['🏠 House', '🎓 Education', '💼 Employment', '💰 Business', '🌾 Agriculture', '❤️ Health', '👩 Women Welfare', '👴 Pension', '👶 Child Welfare', '♿ Disability Support'].map(goal => (
                <div 
                  key={goal} 
                  onClick={() => toggleGoal(goal)}
                  style={{ 
                    padding: '1rem', border: '1px solid', borderColor: formData.goals.includes(goal) ? 'var(--primary)' : 'var(--border-color)', 
                    borderRadius: '8px', textAlign: 'center', cursor: 'pointer', 
                    background: formData.goals.includes(goal) ? 'var(--primary-glow)' : 'var(--bg-darkest)',
                    transition: 'all 0.2s', fontWeight: formData.goals.includes(goal) ? '600' : '400'
                  }}
                >
                  {goal}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted">The AI uses these priorities to personalize recommendations.</p>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-text" onClick={prevStep}>Back</button>
              <button type="button" className="btn btn-primary" onClick={handleFinish}>Complete Setup <Sparkles size={18} style={{ marginLeft: '6px' }}/></button>
            </div>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            {loadingMsg.includes("Welcome") ? (
              <div style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                <Check size={56} style={{ margin: '0 auto' }} />
              </div>
            ) : (
              <Loader2 size={48} className="text-gold" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1.5rem', color: 'var(--primary)' }} />
            )}
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            
            <div style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: loadingMsg.includes("Building") || loadingMsg.includes("Welcome") || loadingMsg.includes("Priorities") || loadingMsg.includes("Schemes") || loadingMsg.includes("Passport") ? 'var(--primary)' : 'var(--text-muted)' }}><Check size={16}/> Creating Household Profile...</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: loadingMsg.includes("Priorities") || loadingMsg.includes("Welcome") || loadingMsg.includes("Schemes") || loadingMsg.includes("Passport") ? 'var(--primary)' : 'var(--text-muted)' }}><Check size={16}/> Building Family Tree...</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: loadingMsg.includes("Schemes") || loadingMsg.includes("Welcome") || loadingMsg.includes("Passport") ? 'var(--primary)' : 'var(--text-muted)' }}><Check size={16}/> Understanding Your Priorities...</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: loadingMsg.includes("Passport") || loadingMsg.includes("Welcome") ? 'var(--primary)' : 'var(--text-muted)' }}><Check size={16}/> Finding Eligible Government Schemes...</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: loadingMsg.includes("Welcome") ? 'var(--primary)' : 'var(--text-muted)' }}><Check size={16}/> Preparing Your Welfare Passport...</div>
            </div>

            {loadingMsg.includes("Welcome") && (
              <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>Welcome to Yojana Saathi 🚀</h3>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
