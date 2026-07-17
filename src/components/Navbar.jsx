import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, MapPin, Bell, Menu, X, ChevronDown, ArrowRight, User, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ 
  activeView, 
  onNavigate, 
  lang, 
  onChangeLang, 
  stateLocation, 
  onChangeState, 
  notifications, 
  onClearNoti, 
  onMarkNotiRead,
  user, 
  onLogout, 
  onTriggerAuth 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  const langMap = { en: "English", hi: "हिन्दी", ta: "தமிழ்", te: "తెలుగు", bn: "বাংলা" };
  const states = ["Rajasthan", "Maharashtra", "Uttar Pradesh", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Bihar"];

  const filteredStates = states.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'planner', label: 'Planner' },
    { id: 'schemes', label: 'Schemes' },
    { id: 'family', label: 'Family' },
    { id: 'scam-shield', label: 'Scam Shield' }
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } },
    exit: { opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.2 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <motion.header 
        className={`luxury-navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="lux-container">
          
          {/* Logo */}
          <motion.a 
            href="#" 
            className="lux-brand" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img src="/Logo.png" alt="Yojana Saathi" className="lux-logo-img" />
            <div className="lux-brand-text">
              <span className="lux-brand-title">Yojana Saathi</span>
              <span className="lux-brand-sub">India's AI Welfare OS</span>
            </div>
          </motion.a>

          {/* Center Links (Staggered Animation) */}
          <motion.nav 
            className="lux-nav-links"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.id}
                variants={linkVariants}
                href={`#${link.id}`}
                className={`lux-nav-link ${(activeView === link.id || (link.id === 'schemes' && activeView === 'detail')) ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate(link.id); }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>

          {/* Right Actions */}
          <motion.div 
            className="lux-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            
            {/* Language */}
            <div style={{ position: 'relative' }}>
              <button 
                className="lux-pill" 
                onClick={() => { setLangOpen(!langOpen); setStateOpen(false); setNotiOpen(false); }}
              >
                <Languages size={18} />
                <span>{langMap[lang]}</span>
                <ChevronDown size={16} className="chevron-icon" />
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    className="lux-dropdown"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {Object.entries(langMap).map(([code, label]) => (
                      <div 
                        key={code} 
                        className="lux-dropdown-item"
                        onClick={() => { onChangeLang(code); setLangOpen(false); }}
                      >
                        {label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* State */}
            <div style={{ position: 'relative' }}>
              <button 
                className="lux-pill" 
                onClick={() => { setStateOpen(!stateOpen); setLangOpen(false); setNotiOpen(false); setProfileOpen(false); }}
              >
                <MapPin size={18} />
                <span>{stateLocation}</span>
                <ChevronDown size={16} className="chevron-icon" />
              </button>

              <AnimatePresence>
                {stateOpen && (
                  <motion.div 
                    className="lux-dropdown"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <input 
                      type="text" 
                      className="lux-search-input" 
                      placeholder="Search state..." 
                      value={stateSearch}
                      onChange={e => setStateSearch(e.target.value)}
                      autoFocus
                    />
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                      {filteredStates.map(st => (
                        <div 
                          key={st} 
                          className="lux-dropdown-item"
                          onClick={() => { onChangeState(st); setStateOpen(false); setStateSearch(''); }}
                        >
                          {st}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button 
                className="lux-icon-btn" 
                onClick={() => { setNotiOpen(!notiOpen); setLangOpen(false); setStateOpen(false); setProfileOpen(false); }}
              >
                <Bell size={20} className="bell-icon" />
                {unreadCount > 0 && <span className="lux-badge" />}
              </button>

              <AnimatePresence>
                {notiOpen && (
                  <motion.div 
                    className="lux-dropdown"
                    style={{ width: '320px', right: '-40px' }}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--lux-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>Welfare Alerts</span>
                      <span style={{ fontSize: '13px', color: 'var(--lux-accent)', cursor: 'pointer', fontWeight: 500 }} onClick={onClearNoti}>Clear All</span>
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '8px 0' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--lux-muted)', fontSize: '14px' }}>No new alerts.</div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            style={{ padding: '16px', display: 'flex', gap: '14px', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(199,169,107,0.04)', borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                            onClick={() => onMarkNotiRead(n.id)}
                          >
                            {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', marginTop: '6px', flexShrink: 0 }} />}
                            <div>
                              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--lux-text)' }}>{n.title}</div>
                              <div style={{ fontSize: '13px', color: 'var(--lux-muted)', marginTop: '6px', lineHeight: 1.4 }}>{n.text}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Buttons */}
            {!user ? (
              <>
                <button className="lux-login-btn" onClick={() => onTriggerAuth(false)}>Login</button>
                <button className="lux-cta-btn" onClick={() => onTriggerAuth(true)}>
                  Get Started
                  <ArrowRight size={18} className="arrow-icon" />
                </button>
              </>
            ) : (
              <div style={{ paddingLeft: '8px', position: 'relative' }}>
                <button 
                  className="lux-pill"
                  onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); setStateOpen(false); setNotiOpen(false); }}
                  style={{ background: 'var(--lux-accent)', color: 'white', border: 'none' }}
                >
                  <User size={18} />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown size={16} className="chevron-icon" />
                </button>
                
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div 
                      className="lux-dropdown"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div 
                        className="lux-dropdown-item"
                        onClick={() => { onNavigate('family'); setProfileOpen(false); }}
                      >
                        <User size={16} /> My Family
                      </div>
                      <div 
                        className="lux-dropdown-item"
                        style={{ color: 'var(--danger)', marginTop: '4px', borderTop: '1px solid var(--lux-border)', paddingTop: '14px', borderRadius: '0 0 12px 12px' }}
                        onClick={() => { onLogout(); setProfileOpen(false); }}
                      >
                        <LogOut size={16} /> Logout
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Toggle */}
            <button className="lux-mobile-toggle" onClick={() => setMobileOpen(true)}>
              <Menu size={28} />
            </button>

          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="lux-mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="lux-drawer-header">
              <div className="lux-brand">
                <img src="/Logo.png" alt="Logo" className="lux-logo-img" style={{ height: '40px' }} />
                <div className="lux-brand-text">
                  <span className="lux-brand-title">Yojana Saathi</span>
                  <span className="lux-brand-sub">India's AI Welfare OS</span>
                </div>
              </div>
              <button className="lux-icon-btn" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }} onClick={() => setMobileOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <div className="lux-drawer-links">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`lux-drawer-link ${activeView === link.id ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); onNavigate(link.id); setMobileOpen(false); }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <div className="lux-drawer-footer">
              {!user ? (
                <>
                  <button className="lux-login-btn" style={{ background: 'rgba(15,23,42,0.04)', borderRadius: '26px', padding: '18px', width: '100%' }} onClick={() => { setMobileOpen(false); onTriggerAuth(false); }}>
                    Login
                  </button>
                  <button className="lux-cta-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileOpen(false); onTriggerAuth(true); }}>
                    Get Started
                  </button>
                </>
              ) : (
                <button className="lux-login-btn" style={{ background: 'rgba(15,23,42,0.04)', borderRadius: '26px', padding: '18px', width: '100%' }} onClick={() => { setMobileOpen(false); onLogout(); }}>
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
