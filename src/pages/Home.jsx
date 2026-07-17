import React from 'react';
import { ArrowRight, Sparkles, ChevronRight, Landmark, Brain, IdCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../data/translations';

export default function Home({ lang, onNavigate, onTriggerAuth }) {

  const t = translations[lang] || translations.en;

  const milestones = [
    { id: 'child', icon: '👶', title: t.milestoneChild || 'Child Born', desc: t.milestoneChildDesc || 'Maternity relief, baby supplies, nutritional support.', cat: 'Women', color: 'bg-soft-blue' },
    { id: 'education', icon: '🎓', title: t.milestoneEducation || 'Education', desc: t.milestoneEducationDesc || 'Scholarships, study loans, books, laptop grants.', cat: 'Student', color: 'bg-soft-purple' },
    { id: 'housing', icon: '🏠', title: t.milestoneHousing || 'House Building', desc: t.milestoneHousingDesc || 'Urban/rural housing subsidies, repair funds.', cat: 'Housing', color: 'bg-soft-gold' },
    { id: 'marriage', icon: '💍', title: t.milestoneMarriage || 'Marriage', desc: t.milestoneMarriageDesc || 'Social support for daughters\' marriages, community funds.', cat: 'Women', color: 'bg-soft-red' },
    { id: 'women', icon: '👩', title: t.milestoneWomen || 'Women', desc: t.milestoneWomenDesc || 'Livelihood support, cooking gas subsidies, self-help groups.', cat: 'Women', color: 'bg-soft-rose' },
    { id: 'senior', icon: '👴', title: t.milestoneSenior || 'Senior Citizen', desc: t.milestoneSeniorDesc || 'Old age pensions, health insurance, free transport cards.', cat: 'Senior Citizen', color: 'bg-soft-green' },
    { id: 'farmer', icon: '🚜', title: t.milestoneFarmer || 'Farmer Support', desc: t.milestoneFarmerDesc || 'Direct cash transfers, crop insurance, solar pump subsidies.', cat: 'Farmer', color: 'bg-soft-amber' },
    { id: 'business', icon: '💼', title: t.milestoneBusiness || 'Start a Business', desc: t.milestoneBusinessDesc || 'Collateral-free loans, seed funds, vendor startup kits.', cat: 'Business', color: 'bg-soft-cyan' },
  ];

  const handleMilestoneClick = (category) => {
    onNavigate('schemes', { category });
  };

  return (
    <div className="view-section animate-fade-in" style={{ padding: 0, maxWidth: '100%' }}>
      {/* Hero Section */}
      <section className="hero-section hero-carousel">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-carousel-bg"
          style={{ objectFit: 'cover' }}
        >
          <source src="/Background Video.mp4" type="video/mp4" />
        </video>
        
        <div className="hero-carousel-overlay"></div>

        <div className="hero-content hero-carousel-content">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pill-badge pill-badge-light"
          >
            <span className="badge-dot"></span> AI-POWERED • TRUSTED • SECURE
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="hero-title text-white"
          >
            {t.heroTitlePrefix || "Every Family Deserves "}<br />
            <span className="text-gradient">{t.heroTitleGradient || "Every Benefit."}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle text-white-alpha"
          >
            {t.heroSubtitle || "Yojana Saathi uses AI to match your household with government schemes, simplifying criteria, avoiding scams, and managing applications end-to-end."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-ctas"
          >
            <button className="btn btn-primary btn-lg" onClick={() => onTriggerAuth(true)}>
              {t.getStarted || "Get Started"} <ArrowRight size={18} />
            </button>
            <button className="btn btn-outline btn-outline-light btn-lg" onClick={() => onNavigate('planner')}>
              <Sparkles size={18} className="text-gold" /> {t.tryPlanner || "Try AI Planner"}
            </button>
            <button className="btn btn-text btn-text-light btn-lg" onClick={() => onNavigate('schemes')}>
              {t.exploreSchemes || "Explore Schemes"} <ChevronRight size={18} />
            </button>
          </motion.div>

          <p className="hero-footer-text text-white-alpha">
            {t.madeForIndia || "🇮🇳 Made for India. Built for Every Family."}
          </p>
        </div>
      </section>

      {/* Life Events Milestones Section */}
      <section className="section-container">
        <div className="section-header text-center">
          <span className="section-tagline">{t.discoverMilestones || "DISCOVER BY LIFE MILESTONES"}</span>
          <h2 className="section-title">{t.findSchemesMilestone || "Find Schemes by Life Events"}</h2>
          <p className="section-desc">{t.chooseMilestone || "Choose a milestone below to instantly see helpful government programs."}</p>
        </div>
        
        <div className="life-events-grid">
          {milestones.map((m, idx) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="life-event-card"
              onClick={() => handleMilestoneClick(m.cat)}
            >
              <div className={`event-icon ${m.color}`}>{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <span className="event-link">Find Schemes <ArrowRight size={14} /></span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Process Section */}
      <section className="section-container bg-dark-gradient">
        <div className="section-header text-center">
          <span className="section-tagline">HOW YOJANA SAATHI WORKS</span>
          <h2 className="section-title">Simple Steps. Maximum Benefits.</h2>
        </div>
        
        <div className="steps-grid">
          {[
            { num: 1, icon: 'users', title: 'Create Profile', desc: 'Tell us about your family size, income, land status, and needs.' },
            { num: 2, icon: 'brain', title: 'AI Understands', desc: 'Our engine matches your background to hundreds of government rules.' },
            { num: 3, icon: 'search', title: 'Find Schemes', desc: 'Instantly discover central and state schemes you qualify for.' },
            { num: 4, icon: 'file-signature', title: 'Apply Smarter', desc: 'Detailed document checklists and instructions show you how to apply.' },
            { num: 5, icon: 'circle-check', title: 'Receive Benefits', desc: 'Track steps from validation to final direct bank transfer.' }
          ].map((st, idx) => (
            <motion.div 
              key={st.num}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="step-card"
            >
              <div className="step-num">{st.num}</div>
              <div className="step-icon text-gold">
                {st.icon === 'users' && <IdCard size={28} />}
                {st.icon === 'brain' && <Brain size={28} />}
                {st.icon === 'search' && <Landmark size={28} />}
                {st.icon === 'file-signature' && <ChevronRight size={28} />}
                {st.icon === 'circle-check' && <Sparkles size={28} />}
              </div>
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Row and Partners */}
      <section className="section-container text-center">
        <div className="metrics-row">
          <div className="metric-item">
            <h2>700+</h2>
            <p>Government Schemes Mapped</p>
          </div>
          <div className="metric-item">
            <h2>25 Cr+</h2>
            <p>Families Can Benefit</p>
          </div>
          <div className="metric-item">
            <h2>23</h2>
            <p>Languages Supported</p>
          </div>
          <div className="metric-item">
            <h2>100%</h2>
            <p>Secure & Private</p>
          </div>
          <div className="metric-item">
            <h2>AI</h2>
            <p>Built for Bharat</p>
          </div>
        </div>

        <div className="partner-section">
          <span className="partner-tagline">BUILDING THE FUTURE OF WELFARE WITH INDIA'S BEST</span>
          <div className="partner-logos">
            <div className="logo-box"><span className="logo-text">⚡ Slashy</span><span className="sub-logo">Automation</span></div>
            <div className="logo-box"><span className="logo-text">🎯 Keploy</span><span className="sub-logo">API Testing</span></div>
            <div className="logo-box"><span className="logo-text">🗣️ Gnani.ai</span><span className="sub-logo">Voice AI</span></div>
            <div className="logo-box"><span className="logo-text">🧠 Mem0</span><span className="sub-logo">AI Memory</span></div>
            <div className="logo-box"><span className="logo-text">🧬 Alchemyst AI</span><span className="sub-logo">AI Agents</span></div>
            <div className="logo-box"><span className="logo-text">🔵 Outlier</span><span className="sub-logo">AI Research</span></div>
            <div className="logo-box"><span className="logo-text">🤝 GenzDealz.ai</span><span className="sub-logo">Partner</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
