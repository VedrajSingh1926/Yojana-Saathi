import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ScamShield() {
  const { lang, t } = useLanguage();
  const [text, setText] = useState('');

  const sampleScam = "Urgently claim your PM Awas Yojana subsidy of Rs. 2,500 by paying a processing deposit via UPI to pm-awas-verify@upi immediately. Verify your card here: http://pm-awas-subsidy.in/claim";

  const handleLoadSample = () => {
    setText(sampleScam);
  };

  const handleScan = async () => {
    if (!text.trim()) {
      alert("Please paste a suspicious message first.");
      return;
    }

    setReport({ loading: true });

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/ai/scam-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      
      if (data.success) {
        const { riskScore, category, reason, recommendation } = data.data;
        
        let verdictClass = 'color-success';
        let fillClass = 'bg-success';
        let localizedVerdict = t.safe || 'SAFE';

        if (riskScore > 80) {
          verdictClass = 'color-danger';
          fillClass = 'bg-danger';
          localizedVerdict = t.danger || 'DANGER';
        } else if (riskScore > 40) {
          verdictClass = 'color-warning';
          fillClass = 'bg-warning';
          localizedVerdict = t.warning || 'WARNING';
        }

        setReport({
          riskScore,
          category,
          verdict: localizedVerdict,
          verdictClass,
          fillClass,
          reason,
          recommendation
        });
      } else {
        alert("Failed to analyze message.");
        setReport(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Scam Shield API.");
      setReport(null);
    }
  };

  return (
    <div className="view-section animate-fade-in">
      <div className="scam-hero">
        <span className="pill-badge badge-warning"><ShieldAlert size={14} style={{ display: 'inline', marginRight: '4px' }} /> Real-time Welfare Defense</span>
        <h1>{t.scamTitle || "Yojana Scam Shield"}</h1>
        <p className="text-muted">{t.scamSubtitle || "Received a suspicious WhatsApp message, SMS, or link promising government funds? Paste it here. Our AI scans it to verify if it's official or a phishing trap."}</p>
      </div>

      <div className="scam-analyzer-grid">
        {/* Left Input */}
        <div className="glass-card scam-analyzer-card">
          <h3>Scan Messages & Links</h3>
          <p className="text-muted text-sm mb-4">Paste messages asking for money, OTPs, or redirecting to fake websites.</p>
          
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: 'Congratulations! You have been selected for PM Yojana assistance. Click here to claim ₹50,000 immediately: http://pm-yojana-claims.net/pay...'"
          />
          
          <div className="scam-actions">
            <button className="btn btn-primary" onClick={handleScan}>Scan Message</button>
            <button className="btn btn-text" onClick={handleLoadSample}>Load Fake Message Sample</button>
          </div>
        </div>

        {/* Right Output */}
        <div className="glass-card scam-results-card">
          {!report ? (
            <div className="scam-result-placeholder">
              <ShieldCheck className="text-cyan large-shield" size={48} style={{ margin: '0 auto 1rem' }} />
              <h3>Scam Shield Ready</h3>
              <p className="text-muted text-sm">Enter content on the left to run safety scanning. We run vocabulary heuristics, domain checking, and government API lookups.</p>
            </div>
          ) : report.loading ? (
            <div className="scam-result-placeholder">
              <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
              <h3>Analyzing Threat...</h3>
              <p className="text-muted text-sm">Gemini is inspecting the message for fraud indicators.</p>
            </div>
          ) : (
            <div className="diagnostic-report w-full">
              <div className="safety-gauge-wrapper">
                <span className="safety-title">Danger Level</span>
                <div className={`safety-percent ${report.verdictClass}`}>{report.riskScore}%</div>
                <div className={`safety-verdict ${report.verdictClass}`}>{report.verdict}</div>
              </div>

              <div className="metric-bars">
                <div className="metric-row-item">
                  <div className="bar-header"><span>Category</span><span style={{textTransform: 'capitalize'}}>{report.category}</span></div>
                </div>
              </div>

              <div className="report-hints">
                <h4>AI Threat Diagnostic:</h4>
                <p className="text-xs text-secondary mt-1 mb-3">
                  {report.reason}
                </p>
                <h4>Recommendation:</h4>
                <p className="text-xs text-secondary mt-1">
                  {report.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fraud alerts board */}
      <section className="section-container">
        <div className="section-header text-center">
          <span className="section-tagline text-orange">RECENT THREAT ALERTS</span>
          <h2 className="section-title">Active Fraud Alerts</h2>
        </div>
        <div className="scam-threats-grid">
          <div className="threat-card card-danger">
            <div className="threat-header">
              <span className="threat-badge badge-danger">CRITICAL</span>
              <span className="threat-date">July 2026</span>
            </div>
            <h4>Fake PM Kisan Aadhaar OTP Requests</h4>
            <p>Scammers posing as Agriculture Department officials are calling to "update records" and stealing bank OTPs. <strong>Official PM Kisan never calls for OTPs.</strong></p>
          </div>
          <div className="threat-card card-warning">
            <div className="threat-header">
              <span className="threat-badge badge-warning">HIGH</span>
              <span className="threat-date">June 2026</span>
            </div>
            <h4>Phishing Site: 'pm-awas-subsidy.in'</h4>
            <p>A replica portal asking applicants to transfer a "security verification deposit" of ₹2,500 via UPI. <strong>Government housing allocation is free.</strong></p>
          </div>
          <div className="threat-card card-warning">
            <div className="threat-header">
              <span className="threat-badge badge-warning">HIGH</span>
              <span className="threat-date">June 2026</span>
            </div>
            <h4>Fake Free Laptop / Tablet Messages</h4>
            <p>Viral forward links claiming the government is handing out laptops to students. Clicking installs malicious adware and signs up users for paid premium SMS services.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
