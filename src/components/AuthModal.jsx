import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegisterMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpSent) {
      if (phone.length < 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone })
        });
        const data = await res.json();
        
        if (data.success) {
          setOtpSent(true);
          alert("SMS OTP Sent successfully!");
        } else {
          alert(data.message || "Failed to send OTP.");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server to send OTP.");
      }

    } else {
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: phone, otp })
        });
        const data = await res.json();

        if (data.success) {
          onLoginSuccess();
          onClose();
          // Reset
          setPhone('');
          setOtp('');
          setOtpSent(false);
        } else {
          alert(data.message || "Invalid OTP code.");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server to verify OTP.");
      }
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog modal-split" onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Image */}
        <div className="modal-split-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1000)' }}>
          <div className="modal-split-image-overlay">
            <h3 className="text-white">Your Family's Digital Welfare Passport</h3>
            <p className="text-white-alpha mt-2">Unlock personalized schemes, track applications, and store your important documents securely in one place.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="modal-split-content">
          <div className="modal-header border-0 pb-0">
            <h2>{isRegisterMode ? "Register Family Unit" : "Sign In to Yojana Saathi"}</h2>
            <button className="close-modal" onClick={onClose}><X size={20} /></button>
          </div>
          
          <div className="modal-body">
            <p className="text-muted text-sm mb-4">
              Enter your mobile number to get started securely via OTP.
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
                  <span className="form-hint text-gold">An OTP code was sent to your phone.</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full mt-3">
                {otpSent ? "Verify OTP" : "Send OTP"} <Send size={14} />
              </button>
            </form>

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
