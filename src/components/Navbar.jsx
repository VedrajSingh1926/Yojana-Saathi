import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, MapPin, Bell, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
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
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img src="/Logo.png" alt="Yojana Saathi" className="lux-logo-img" />
            <div className="lux-brand-text">
              <span className="lux-brand-title">Yojana Saathi</span>
              <span className="lux-brand-sub">India's AI Welfare OS</span>
            </div>
          </motion.a>

          {/* Center Links */}
          <nav className="lux-nav-links">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                className={`lux-nav-link ${(activeView === link.id || (link.id === 'schemes' && activeView === 'detail')) ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate(link.id); }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="lux-actions">
            
            {/* Language */}
            <div style={{ position: 'relative' }}>
              <motion.button 
                className="lux-pill" 
                onClick={() => { setLangOpen(!langOpen); setStateOpen(false); setNotiOpen(false); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Languages size={16} />
                <span>{langMap[lang]}</span>
                <ChevronDown size={14} />
              </motion.button>
              
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
              <motion.button 
                className="lux-pill" 
                onClick={() => { setStateOpen(!stateOpen); setLangOpen(false); setNotiOpen(false); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin size={16} />
                <span>{stateLocation}</span>
                <ChevronDown size={14} />
              </motion.button>

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
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
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
              <motion.button 
                className="lux-icon-btn" 
                onClick={() => { setNotiOpen(!notiOpen); setLangOpen(false); setStateOpen(false); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="lux-badge" />}
              </motion.button>

              <AnimatePresence>
                {notiOpen && (
                  <motion.div 
                    className="lux-dropdown"
                    style={{ width: '300px', right: '-80px' }}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--lux-border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>Alerts</span>
                      <span style={{ fontSize: '12px', color: 'var(--lux-accent)', cursor: 'pointer' }} onClick={onClearNoti}>Clear</span>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px 0' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--lux-muted)', fontSize: '14px' }}>No new alerts.</div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            style={{ padding: '12px', display: 'flex', gap: '12px', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(199,169,107,0.05)' }}
                            onClick={() => onMarkNotiRead(n.id)}
                          >
                            {!n.read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', marginTop: '6px' }} />}
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--lux-text)' }}>{n.title}</div>
                              <div style={{ fontSize: '12px', color: 'var(--lux-muted)', marginTop: '4px' }}>{n.text}</div>
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
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="lux-login-btn">Login</button>
                  </SignInButton>
                </SignedOut>
                <button className="lux-cta-btn" onClick={() => onTriggerAuth(true)}>
                  Get Started
                  <ArrowRight size={16} className="arrow-icon" />
                </button>
              </>
            ) : (
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            )}

            {/* Mobile Toggle */}
            <button className="lux-mobile-toggle" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
            </button>

          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="lux-mobile-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="lux-drawer-header">
              <div className="lux-brand">
                <img src="/Logo.png" alt="Logo" style={{ height: '32px' }} />
                <span className="lux-brand-title">Yojana Saathi</span>
              </div>
              <button className="lux-icon-btn" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="lux-drawer-links">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`lux-drawer-link ${activeView === link.id ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); onNavigate(link.id); setMobileOpen(false); }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <div className="lux-drawer-footer">
              {!user ? (
                <>
                  <button className="lux-login-btn" style={{ background: 'rgba(15,23,42,0.05)', borderRadius: '24px', padding: '16px' }} onClick={() => { setMobileOpen(false); onTriggerAuth(false); }}>
                    Login
                  </button>
                  <button className="lux-cta-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setMobileOpen(false); onTriggerAuth(true); }}>
                    Get Started
                  </button>
                </>
              ) : (
                <button className="lux-login-btn" style={{ background: 'rgba(15,23,42,0.05)', borderRadius: '24px', padding: '16px' }} onClick={() => { setMobileOpen(false); onLogout(); }}>
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
