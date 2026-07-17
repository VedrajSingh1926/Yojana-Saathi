import React, { useState } from 'react';
import { X, Send, Fingerprint, Phone } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const API_URL = import.meta.env.VITE_API_URL || 'https://yojana-saathi-qkgl.onrender.com';
  const [loginMethod, setLoginMethod] = useState('mobile'); // 'mobile' or 'saathi' or 'recovery'
  const [phone, setPhone] = useState('');
  const [saathiId, setSaathiId] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoveredData, setRecoveredData] = useState(null);

  if (!isOpen) return null;

  const handleRecovery = async (e) => {
    e.preventDefault();
    if (!recoveryInput.trim()) return alert("Enter Phone Number or Email");

    try {
      const res = await fetch(`${API_URL}/api/auth/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: recoveryInput })
      });
      const data = await res.json();
      if (data.success) {
        setRecoveredData({ saathiId: data.saathiId, maskedMobile: data.maskedMobile });
      } else {
        alert(data.message || "Account not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Error looking up account.");
    }
  };

  const handleLogin = async (e, type) => {
    e.preventDefault();
    const identifier = type === 'mobile' ? phone : saathiId;
    if (!identifier || !password) {
      return alert("Please enter all required fields.");
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      
      if (data.success) {
        onLoginSuccess(data.user, data.saathiId);
        onClose();
        // Reset
        setPhone('');
        setSaathiId('');
        setPassword('');
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog modal-split" onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Image */}
        <div className="modal-split-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1590403328249-14a9a08eec13?auto=format&fit=crop&q=80&w=1000)' }}>
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
            
              <>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'var(--lux-bg)', padding: '4px', borderRadius: '12px' }}>
                  <button 
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: loginMethod === 'mobile' ? 'white' : 'transparent', boxShadow: loginMethod === 'mobile' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', fontWeight: loginMethod === 'mobile' ? 600 : 500, color: loginMethod === 'mobile' ? 'var(--lux-text)' : 'var(--lux-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    onClick={() => { setLoginMethod('mobile'); setPhone(''); setPassword(''); }}
                  >
                    <Phone size={16} /> Mobile
                  </button>
                  <button 
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: loginMethod === 'saathi' ? 'white' : 'transparent', boxShadow: loginMethod === 'saathi' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', fontWeight: loginMethod === 'saathi' ? 600 : 500, color: loginMethod === 'saathi' ? 'var(--lux-text)' : 'var(--lux-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    onClick={() => { setLoginMethod('saathi'); setSaathiId(''); setPassword(''); }}
                  >
                    <Fingerprint size={16} /> Saathi ID
                  </button>
                </div>

                {loginMethod === 'mobile' ? (
                  <form onSubmit={(e) => handleLogin(e, 'mobile')}>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <div className="phone-input-wrapper" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-darkest)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem', marginBottom: '1rem' }}>
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
                    <div className="form-group">
                      <label>Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-3">
                      Login <Send size={14} />
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setLoginMethod('recovery'); setRecoveredData(null); }} style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Forgot Mobile No.?</a>
                    </div>
                  </form>
                ) : loginMethod === 'saathi' ? (
                  <form onSubmit={(e) => handleLogin(e, 'saathi')}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label>Saathi ID</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="YS-2026-XXXXXX" 
                        value={saathiId}
                        onChange={(e) => setSaathiId(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-3">
                      Login <Send size={14} />
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setLoginMethod('recovery'); setRecoveredData(null); }} style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Forgot Saathi ID?</a>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRecovery}>
                    {recoveredData ? (
                      <div style={{ background: 'var(--bg-darkest)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed var(--gold)', textAlign: 'center' }}>
                        <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Account Recovered</h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Your Saathi ID:</p>
                        <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'block', marginBottom: '1rem' }}>{recoveredData.saathiId}</strong>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Linked Mobile:</p>
                        <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)', display: 'block' }}>{recoveredData.maskedMobile}</strong>
                        <button type="button" className="btn btn-primary w-full mt-4" onClick={() => { setLoginMethod('mobile'); }}>
                          Back to Login
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="form-group">
                          <label>Enter Registered Email or Mobile</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Email or Phone Number" 
                            value={recoveryInput}
                            onChange={(e) => setRecoveryInput(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary w-full mt-3">
                          Recover Details
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '12px' }}>
                          <a href="#" onClick={(e) => { e.preventDefault(); setLoginMethod('mobile'); }} style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Back to Login</a>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </>

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

