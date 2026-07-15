import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!otpSent) {
      if (phone.length < 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      setOtpSent(true);
      alert("Demo SMS OTP Sent! Enter '123456' to verify.");
    } else {
      if (otp !== '123456') {
        alert("Invalid OTP code. Please enter '123456' for verification.");
        return;
      }
      onLoginSuccess();
      onClose();
      // Reset
      setPhone('');
      setOtp('');
      setOtpSent(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isRegisterMode ? "Register Family Unit" : "Sign In to Yojana Saathi"}</h2>
          <button className="close-modal" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <p className="text-muted text-sm mb-4">
            Unlock your unified family Welfare Passport, save scheme timelines, and upload verified documents locker.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mobile Number</label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+91</span>
                <input 
                  type="tel" 
                  required 
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="98765 43210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {otpSent && (
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
                />
                <span className="form-hint text-gold">A demo OTP code was sent to your phone. Use code "123456" to log in.</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full mt-3">
              {otpSent ? "Verify OTP" : "Send OTP"} <Send size={14} />
            </button>
          </form>

          <div className="auth-alternative-footer">
            <p className="text-sm">
              {isRegisterMode ? (
                <span>Already have a household registered? <a href="#" className="text-gold" onClick={(e) => { e.preventDefault(); setIsRegisterMode(false); }}>Sign In instead</a></span>
              ) : (
                <span>Don't have an account? <a href="#" className="text-gold" onClick={(e) => { e.preventDefault(); setIsRegisterMode(true); }}>Register Household</a></span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
