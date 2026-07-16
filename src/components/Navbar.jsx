import React, { useState } from 'react';
import { Languages, MapPin, Bell, Landmark, User, LogOut, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

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
  const [langOpen, setLangOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedNotiId, setExpandedNotiId] = useState(null);

  const langMap = { en: "English", hi: "हिन्दी (Hindi)", ta: "தமிழ் (Tamil)", te: "తెలుగు (Telugu)", bn: "বাংলা (Bengali)" };
  const states = ["Rajasthan", "Maharashtra", "Uttar Pradesh", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Bihar"];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="glass-navbar">
      <div className="nav-container">
        
        {/* Left: Logo */}
        <a href="#" className="logo-container" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
          <div className="logo-icon">
            <Landmark size={28} />
          </div>
          <div className="logo-text">
            <span className="logo-title">Yojana Saathi</span>
            <span className="logo-tagline">India's AI Welfare OS</span>
          </div>
        </a>

        {/* Center: Navigation Links */}
        <nav className="nav-menu">
          {['home', 'planner', 'schemes', 'family', 'scam-shield'].map(view => (
            <a 
              key={view}
              href={`#${view}`} 
              className={`nav-link ${activeView === view || (view === 'schemes' && activeView === 'detail') ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onNavigate(view); }}
            >
              {view === 'scam-shield' ? 'Scam Shield' : view.charAt(0).toUpperCase() + view.slice(1).replace('Planner', ' Planner')}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          
          {/* Language Selector */}
          <div className="dropdown-wrapper">
            <button className="dropdown-trigger" onClick={() => setLangOpen(!langOpen)}>
              <Languages size={16} />
              <span className="trigger-label">{langMap[lang]}</span>
              <ChevronDown size={12} className="trigger-chevron" />
            </button>
            {langOpen && (
              <div className="dropdown-menu">
                {Object.entries(langMap).map(([code, label]) => (
                  <div 
                    key={code} 
                    className={`dropdown-item ${lang === code ? 'active' : ''}`}
                    onClick={() => { onChangeLang(code); setLangOpen(false); }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* State Selector */}
          <div className="dropdown-wrapper">
            <button className="dropdown-trigger" onClick={() => setStateOpen(!stateOpen)}>
              <MapPin size={16} />
              <span className="trigger-label">{stateLocation}</span>
              <ChevronDown size={12} className="trigger-chevron" />
            </button>
            {stateOpen && (
              <div className="dropdown-menu scrollable">
                {states.map(st => (
                  <div 
                    key={st} 
                    className={`dropdown-item ${stateLocation === st ? 'active' : ''}`}
                    onClick={() => { onChangeState(st); setStateOpen(false); }}
                  >
                    {st}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications panel */}
          <div className="dropdown-wrapper">
            <button className="icon-btn notification-btn" onClick={() => setNotiOpen(!notiOpen)}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            
            {notiOpen && (
              <div className="notification-pane">
                <div className="pane-header">
                  <h3>Welfare Alerts</h3>
                  <button className="clear-all-btn" onClick={onClearNoti}>Clear All</button>
                </div>
                <div className="pane-content">
                  {notifications.length === 0 ? (
                    <div className="text-center text-muted p-4 text-sm">No new welfare alerts.</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`noti-item ${n.read ? 'read' : ''}`}
                        onClick={() => { 
                          onMarkNotiRead(n.id);
                          setExpandedNotiId(expandedNotiId === n.id ? null : n.id);
                        }}
                        style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                      >
                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                          {!n.read && <div className="noti-dot"></div>}
                          <div className="noti-content">
                            <h4>{n.title}</h4>
                            <p>{n.text}</p>
                            <span className="noti-time">{n.time}</span>
                          </div>
                        </div>
                        {expandedNotiId === n.id && (
                          <div className="noti-brief" style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', fontSize: '0.85rem' }}>
                            {n.brief || 'More details regarding this update will be shown here. Keep an eye on your portal to apply.'}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Circle or Login CTA */}
          <div className="auth-buttons-container">
            {!user ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="btn btn-text">Login</button>
                  </SignInButton>
                </SignedOut>
                <button className="btn btn-primary" onClick={() => onTriggerAuth(true)}>Get Started</button>
                <SignedIn>
                  <div style={{ marginLeft: '1rem' }}>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </>
            ) : (
              <div className="profile-dropdown-wrapper">
                <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
                  <div className="profile-avatar">{user.name.charAt(0)}</div>
                </button>
                {profileOpen && (
                  <div className="dropdown-menu right-aligned">
                    <div className="user-summary">
                      <span className="user-name">{user.name}</span>
                      <span className="user-role">Welfare Passport</span>
                    </div>
                    <hr className="menu-divider" />
                    <div className="dropdown-item" onClick={() => { setProfileOpen(false); onNavigate('family'); }}>
                      <User size={16} /> My Profile
                    </div>
                    <div className="dropdown-item" onClick={() => { setProfileOpen(false); onLogout(); }}>
                      <LogOut size={16} /> Logout
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Mobile Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer open">
          <div className="drawer-header">
            <span className="logo-title">Yojana Saathi</span>
            <button className="close-drawer" onClick={() => setMobileOpen(false)}><X size={24} /></button>
          </div>
          <nav className="drawer-nav">
            {['home', 'planner', 'schemes', 'family', 'scam-shield'].map(view => (
              <a 
                key={view}
                href={`#${view}`}
                className={`drawer-link ${activeView === view ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); onNavigate(view); setMobileOpen(false); }}
              >
                {view === 'scam-shield' ? 'Scam Shield' : view.charAt(0).toUpperCase() + view.slice(1).replace('Planner', ' Planner')}
              </a>
            ))}
          </nav>
          <div className="drawer-footer">
            {!user ? (
              <button className="btn btn-primary w-full" onClick={() => { setMobileOpen(false); onTriggerAuth(false); }}>
                Login / Get Started
              </button>
            ) : (
              <button className="btn btn-outline w-full" onClick={() => { setMobileOpen(false); onLogout(); }}>
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
