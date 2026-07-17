import React, { useState } from 'react';
import { X, Send, Fingerprint, Phone } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [loginMethod, setLoginMethod] = useState('mobile'); // 'mobile' or 'saathi'
  const [phone, setPhone] = useState('');
  const [saathiId, setSaathiId] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  
  const [step, setStep] = useState(1); // 1: Input ID/Mobile, 2: Confirm Masked (for Saathi), 3: Enter OTP
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleLookupSaathi = async (e) => {
    e.preventDefault();
    if (!saathiId.trim()) return alert("Enter Saathi ID");

    try {
      const res = await fetch('/api/auth/saathi-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saathiId })
      });
      const data = await res.json();
      if (data.success) {
        setPhone(data.mobileNumber);
        setMaskedPhone(data.maskedMobile);
        setStep(2);
      } else {
        alert(data.message || "Saathi ID not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Error looking up Saathi ID.");
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (phone.length < 5) {
      alert("Please enter a valid mobile number.");
      return;
    }
    
    try {
      const fullPhone = '+91' + phone;
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone })
      });
      const data = await res.json();
      
      if (data.success) {
        setStep(3);
        alert("SMS OTP Sent successfully!");
      } else {
        alert(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server to send OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const fullPhone = '+91' + phone;
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone, otp })
      });
      const data = await res.json();

      if (data.success) {
        onLoginSuccess(data.user, data.user?.saathiId);
        onClose();
        // Reset
        setPhone('');
        setSaathiId('');
        setOtp('');
        setStep(1);
      } else {
        alert(data.message || "Invalid OTP code.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server to verify OTP.");
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog modal-split" onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Image */}
        <div className="modal-split-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000)' }}>
          <div className="modal-split-image-overlay">
            <h3 className="text-white">Your Family's Digital Welfare Passport</h3>
            <p className="text-white-alpha mt-2">Unlock personalized schemes, track applications, and store your important documents securely in one place.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="modal-split-content">
          <div className="modal-header border-0 pb-0">
            <h2>Sign In to Yojana Saathi</h2>
            <button className="close-modal" onClick={onClose}><X size={20} /></button>
          </div>
          
          <div className="modal-body">
            
            {step === 1 && (
              <>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'var(--lux-bg)', padding: '4px', borderRadius: '12px' }}>
                  <button 
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: loginMethod === 'mobile' ? 'white' : 'transparent', boxShadow: loginMethod === 'mobile' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', fontWeight: loginMethod === 'mobile' ? 600 : 500, color: loginMethod === 'mobile' ? 'var(--lux-text)' : 'var(--lux-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    onClick={() => { setLoginMethod('mobile'); setPhone(''); }}
                  >
                    <Phone size={16} /> Mobile
                  </button>
                  <button 
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: loginMethod === 'saathi' ? 'white' : 'transparent', boxShadow: loginMethod === 'saathi' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', fontWeight: loginMethod === 'saathi' ? 600 : 500, color: loginMethod === 'saathi' ? 'var(--lux-text)' : 'var(--lux-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    onClick={() => { setLoginMethod('saathi'); setSaathiId(''); }}
                  >
                    <Fingerprint size={16} /> Saathi ID
                  </button>
                </div>

                {loginMethod === 'mobile' ? (
                  <form onSubmit={handleSendOtp}>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <div className="phone-input-wrapper" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-darkest)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem' }}>
                        <span style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: '500', borderRight: '1px solid var(--border-color)' }}>+91</span>
                        <input 
                          type="tel" 
                          required 
                          maxLength={10}
                          pattern="[0-9]{10}"
                          placeholder="98765 43210" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: 'none', outline: 'none', width: '100%' }}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-3">
                      Send OTP <Send size={14} />
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                      <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Forgot Mobile No.?</a>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLookupSaathi}>
                    <div className="form-group">
                      <label>Saathi ID</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="YS-2026-XXXXXX" 
                        value={saathiId}
                        onChange={(e) => setSaathiId(e.target.value.toUpperCase())}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-3">
                      Continue <Send size={14} />
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setLoginMethod('phone'); }} style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Forgot Saathi ID? Login with Phone</a>
                    </div>
                  </form>
                )}
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleSendOtp}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(199,169,107,0.1)', color: 'var(--lux-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Fingerprint size={30} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--lux-text)' }}>Account Found</h3>
                  <p style={{ color: 'var(--lux-muted)', fontSize: '14px', marginTop: '8px' }}>
                    Linked Mobile Number:<br/>
                    <strong style={{ fontSize: '20px', color: 'var(--lux-text)', letterSpacing: '2px', display: 'block', marginTop: '8px' }}>{maskedPhone}</strong>
                  </p>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Send OTP to this number
                </button>
                <button type="button" className="btn btn-outline w-full mt-3" onClick={() => setStep(1)}>
                  Back
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <label>Enter 6-digit OTP</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="123456" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    autoFocus
                  />
                  <span className="form-hint text-gold">An OTP code was sent to {loginMethod === 'saathi' ? maskedPhone : phone}.</span>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-3">
                  Verify OTP <Send size={14} />
                </button>
                <button type="button" className="btn btn-outline w-full mt-3" onClick={() => { setStep(1); setOtp(''); }}>
                  Cancel
                </button>
              </form>
            )}

            <div className="auth-alternative-footer mt-4">
              <p className="text-sm text-center">
                <span>Don't have an account? <a href="#" className="text-gold" onClick={(e) => { e.preventDefault(); onClose(); window.location.hash = 'onboarding'; }}>Register Household</a></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

