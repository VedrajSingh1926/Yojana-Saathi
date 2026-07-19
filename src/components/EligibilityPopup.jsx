import React, { useState } from 'react';
import { HelpCircle, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { SCHEMES_DB } from '../data/schemes';
import { useLanguage } from '../context/LanguageContext';

export default function EligibilityPopup({ onRegisterLead }) {
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  
  // Form State
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [state, setState] = useState('Rajasthan');
  const [occupation, setOccupation] = useState('Farmer');

  const [matches, setMatches] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!age || !income) return;

    const parsedAge = parseInt(age);
    const parsedIncome = parseInt(income);

    // Matching logic
    const matchedSchemes = SCHEMES_DB.filter(scheme => {
      // Age checks
      if (scheme.id === 'atal-pension' && (parsedAge < 18 || parsedAge > 40)) return false;
      if (scheme.id === 'disability-pension' && (parsedAge < 18 || parsedAge > 79)) return false;
      if (scheme.id === 'ladli-behna' && (parsedAge < 21 || parsedAge > 60)) return false;

      // Income limits
      if (scheme.id === 'pm-awas' && parsedIncome > 300000) return false;
      if (scheme.id === 'mukhya-awas' && parsedIncome > 250000) return false;
      if (scheme.id === 'scholarship' && parsedIncome > 250000) return false;
      if (scheme.id === 'ladli-behna' && parsedIncome > 250000) return false;

      // Occupation limits
      if (scheme.category === 'Farmer' && occupation !== 'Farmer') return false;
      if (scheme.category === 'Student' && occupation !== 'Student') return false;
      if (scheme.category === 'Senior Citizen' && parsedAge < 60) return false;

      return true;
    });

    setMatches(matchedSchemes);
  };

  const handleReset = () => {
    setAge('');
    setIncome('');
    setState('Rajasthan');
    setOccupation('Farmer');
    setMatches(null);
  };

  const handleCreateAccount = () => {
    onRegisterLead();
    setExpanded(false);
  };

  return (
    <div className={`eligibility-popup ${expanded ? 'expanded' : ''}`}>
      {/* Collapsed Header click toggler */}
      <div className="popup-collapsed-header" onClick={() => setExpanded(!expanded)}>
        <div className="popup-title">
          <span className="popup-pulse"></span>
          <HelpCircle size={16} className="text-gold" /> {t.checkEligibility || "Check Your Eligibility"}
        </div>
        {expanded ? <ChevronDown size={14} className="popup-arrow" /> : <ChevronUp size={14} className="popup-arrow" />}
      </div>

      {/* Expanded body content */}
      {expanded && (
        <div className="popup-expanded-content">
          {!matches ? (
            <>
              <p className="text-sm text-muted mb-3">{t.answerFourQuestions || "Answer 4 quick questions to see your eligible government schemes. No login required."}</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group-sm">
                  <label>{t.age || "Age"}</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 42" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="form-group-sm">
                  <label>{t.annualIncome || "Annual Income (₹)"}</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 240000" 
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div className="form-group-sm">
                  <label>{t.domicileState || "Domicile State"}</label>
                  <select value={state} onChange={(e) => setState(e.target.value)}>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>
                <div className="form-group-sm">
                  <label>{t.occupationTitle || "Occupation"}</label>
                  <select value={occupation} onChange={(e) => setOccupation(e.target.value)}>
                    <option value="Farmer">Farmer</option>
                    <option value="Student">Student</option>
                    <option value="Business">Business/Shopkeeper</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Salaried">Salaried Employee</option>
                    <option value="Retired">Retired Senior Citizen</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm w-full mt-3">
                  {t.scanEligibility || "Scan Eligibility"}
                </button>
              </form>
            </>
          ) : (
            <div className="popup-results text-center">
              <CheckCircle2 size={36} className="text-success" style={{ margin: '0 auto 0.5rem' }} />
              <h3>{t.foundSchemes ? t.foundSchemes.replace('{n}', matches.length) : `Found ${matches.length} Matching Schemes!`}</h3>
              <p className="text-sm text-muted mt-2">{t.qualifyDirectBenefits || "You qualify for direct benefits:"} <strong>{matches.map(m => m.emoji).join(' ')}</strong></p>

              <div className="mb-3 mt-3 text-left" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: 'var(--border-radius-sm)' }}>
                {matches.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="text-xs font-semibold mb-1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="scheme-name">{s.name[lang] || s.name.en}</span>
                    <span className="scheme-benefit">{s.benefit[lang] || s.benefit.en}</span>
                  </div>
                ))}
                {matches.length > 3 && (
                  <div className="text-center text-xs text-muted font-bold">+ {matches.length - 3} {t.moreSchemes || "more schemes"}</div>
                )}
              </div>

              <p className="text-xs text-muted mb-3">{t.wantVerifiedAnalysis || "Want complete verified household analysis & auto-fill applications?"}</p>
              <button className="btn btn-primary btn-sm w-full mb-2" onClick={handleCreateAccount}>
                {t.createFreeAccount || "Create Free Account"}
              </button>
              <button className="btn btn-text btn-sm w-full" onClick={handleReset}>
                {t.checkAgain || "Check Again"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
