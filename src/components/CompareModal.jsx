import React from 'react';
import { X, CheckCircle, Scale, BrainCircuit, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SCHEMES_DB } from '../data/schemes';

export default function CompareModal({ isOpen, onClose, compareList, onNavigateToPlanner }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const selectedSchemes = compareList.map(id => SCHEMES_DB.find(s => s.id === id)).filter(Boolean);

  const hasPMAwas = compareList.includes("pm-awas");
  const hasMukhAwas = compareList.includes("mukhya-awas");
  
  let claimAdvice = "All selected schemes can be claimed concurrently if eligibility criteria is satisfied.";
  let recommendation = "Apply for central benefits first as their cash-pool is larger.";

  if (hasPMAwas && hasMukhAwas) {
    claimAdvice = "⚠️ Housing Exclusivity Warning: You CANNOT claim both PM Awas and State Mukhyamantri Awas. Only one housing subsidy is allowed per household.";
    recommendation = "PM Awas offers higher assistance (up to ₹2.5L urban / ₹1.2L rural) compared to Mukhyamantri Awas (up to ₹2.0L). We recommend applying for PM Awas first.";
  }

  const handleOpenInPlanner = () => {
    const names = selectedSchemes.map(s => s.name);
    onNavigateToPlanner(`Compare ${names.join(" vs ")} for my family. Which one should I claim first?`);
    onClose();
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Scale size={20} className="text-gold" style={{ display: 'inline', marginRight: '8px' }} /> Scheme Comparison</h2>
          <button className="close-modal" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          {/* AI Advisor Card */}
          <div className="glass-card mb-4" style={{ borderColor: 'var(--primary)' }}>
            <h3 className="text-gold mb-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} /> AI Co-claim Compatibility Assessment
            </h3>
            <p className="mb-2">{claimAdvice}</p>
            <p className="text-sm"><strong>Recommended Strategy:</strong> {recommendation}</p>
          </div>

          {/* Grid Columns */}
          <div className="comparison-grid">
            {selectedSchemes.map(s => (
              <div key={s.id} className={`comparison-column ${s.type === 'Central' ? 'head-column' : ''}`}>
                <div className="comp-scheme-header">
                  <h3>{s.emoji} {s.name}</h3>
                  <span className={`badge ${s.type === 'Central' ? 'badge-type-central' : 'badge-type-state'}`}>
                    {s.type} Gov
                  </span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">Estimated Benefit</span>
                  <strong className="comp-value text-gold">{s.benefit}</strong>
                </div>

                <div className="comp-row">
                  <span className="comp-label">Target Focus</span>
                  <span className="comp-value">{s.category} Assistance</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">Required Monthly Income</span>
                  <span className="comp-value">{s.id === 'scholarship' ? 'Under ₹2.5L/year' : 'Under ₹3.0L/year'}</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">Processing Time</span>
                  <span className="comp-value">2 - 4 Weeks</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">Required Core Documents</span>
                  <span className="comp-value">{s.docs.map(d => d.name).join(', ')}</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">AI Match Confidence</span>
                  <span className="comp-value text-cyan">{s.ai_score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close Comparison</button>
          <button className="btn btn-primary" onClick={handleOpenInPlanner}>
            <Sparkles size={16} /> Open in AI Planner
          </button>
        </div>
      </div>
    </div>
  );
}
