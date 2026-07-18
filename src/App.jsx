import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CompareModal from './components/CompareModal';
import EligibilityPopup from './components/EligibilityPopup';
import { useLanguage } from './context/LanguageContext';
// Pages
import Home from './pages/Home';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import AIPlanner from './pages/AIPlanner';
import Family from './pages/Family';
import ScamShield from './pages/ScamShield';
import Onboarding from './pages/Onboarding';
import GovFormAssistant from './pages/GovFormAssistant';
import Partners from './pages/Partners';
import OutlierDashboard from './pages/OutlierDashboard';
import VerifyCard from './pages/VerifyCard';
import SplashLoader from './components/SplashLoader';

export default function App() {
  const { lang, t } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState(() => {
    if (typeof window === 'undefined') return 'home';

    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('verify/')) return 'verify';
    if (['home', 'planner', 'schemes', 'family', 'scam-shield', 'onboarding', 'form-assistant', 'partners', 'outlier'].includes(hash)) {
      return hash;
    }
    return 'home';
  });
  const [detailSchemeId, setDetailSchemeId] = useState(null);
  const [plannerPrompt, setPlannerPrompt] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('all');

  // Global App States
  const [stateLocation, setStateLocation] = useState('Rajasthan');
  const [compareList, setCompareList] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "PM Awas Yojana Update", text: "Your application verification step 2 is complete. Local officer will visit for geotagging.", time: "2 hrs ago", read: false },
    { id: 2, title: "PM Kisan Installment Released", text: "₹2,000 has been successfully credited to SBI ***4912.", time: "1 day ago", read: false },
    { id: 3, title: "Alert: New Scheme Launched", text: "State Government launched 'Mahila Udyami Grants' for self-help groups. Check eligibility.", time: "2 days ago", read: true }
  ]);

  const [user, setUser] = useState(null);

  // Auto-route on hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('verify/')) {
        setActiveView('verify');
        return;
      }
      if (['home', 'planner', 'schemes', 'family', 'scam-shield', 'onboarding', 'form-assistant', 'partners', 'outlier'].includes(hash)) {
        setActiveView(hash);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [lang]);

  const handleNavigate = (view, params = {}) => {
    setActiveView(view);
    window.location.hash = view;
    window.scrollTo(0, 0);
    
    if (view === 'detail') {
      setDetailSchemeId(params.schemeId);
    }
    if (view === 'planner') {
      setPlannerPrompt(params.defaultPrompt || '');
    }
    if (view === 'schemes' && params.category) {
      setCatalogCategory(params.category);
    } else {
      setCatalogCategory('all');
    }
  };

  const handleToggleCompare = (schemeId) => {
    if (compareList.includes(schemeId)) {
      setCompareList(compareList.filter(id => id !== schemeId));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 schemes side-by-side.");
        return;
      }
      setCompareList([...compareList, schemeId]);
    }
  };

  const handleLoginSuccess = (registeredData = null, saathiId = null) => {
    if (registeredData && saathiId) {
      // Check if it's the raw formData from Onboarding or the DB User object
      const isFromDB = !!registeredData.fullName;
      
      const userName = isFromDB ? registeredData.fullName : (registeredData.personal?.name || 'User');
      const userAge = isFromDB ? 0 : (parseInt(registeredData.personal?.age) || 0);
      const userOccupation = isFromDB ? 'N/A' : (registeredData.personal?.occupation || 'N/A');
      const userIncome = isFromDB ? (registeredData.household?.annualIncome || 0) : (parseInt(registeredData.personal?.income) || 0);
      const userPhone = isFromDB ? registeredData.mobileNumber : (registeredData.personal?.phone || '9999999999');

      let userRelation = "Head";
      let headName = userName;

      if (!isFromDB && registeredData.household?.isHead === 'No') {
        userRelation = "Applicant";
        headName = registeredData.household?.headName || "Head";
      } else if (isFromDB && !registeredData.household?.isHead) {
        userRelation = "Applicant";
        headName = registeredData.household?.headName || "Head";
      }

      // Create dynamic user profile from registration data
      const familyMembers = [];
      
      if (userRelation === "Applicant") {
        familyMembers.push({ 
          name: headName, 
          relation: "Head", 
          age: 0, occupation: 'N/A', income: 0, status: "Pending" 
        });
      }

      familyMembers.push({ 
        name: userName, 
        relation: userRelation, 
        age: userAge, 
        occupation: userOccupation, 
        income: userIncome, 
        status: "Verified" 
      });

      if (registeredData.household && registeredData.household.members) {
        registeredData.household.members.forEach(m => {
          familyMembers.push({
            name: m.name,
            relation: m.relation || 'Member',
            age: parseInt(m.age) || 0,
            occupation: m.occupation || 'N/A',
            income: parseInt(m.income) || 0,
            status: "Pending"
          });
        });
      }

      setUser({
        name: userRelation === "Applicant" ? headName : userName,
        applicantName: userName,
        relation: "Head",
        age: userRelation === "Applicant" ? 0 : userAge,
        occupation: userRelation === "Applicant" ? "N/A" : userOccupation,
        income: userIncome,
        saathiId: saathiId,
        mobileNumber: userPhone,
        family: familyMembers,
        documents: [
          { name: "Aadhaar Card", verified: true }
        ],
        events: [
          { date: isFromDB && registeredData.createdAtIST ? registeredData.createdAtIST.split(',')[0] : new Date().toLocaleDateString('en-GB'), title: "Welfare Passport Created", desc: "Profile successfully registered." }
        ]
      });

      setNotifications(prev => [
        { id: Date.now(), title: "Welfare Passport Activated", text: `Welcome ${userName}! Your Saathi ID is ${saathiId}.`, time: "Just now", read: false },
        ...prev
      ]);
    } else {
      // Load default Ramesh Kumar demo profile matching standard specs
      setUser({
        name: "Ramesh Kumar",
        relation: "Head",
        age: 42,
        occupation: "Farmer",
        income: 240000,
        saathiId: "YS-9824",
        mobileNumber: "9876543210",
        family: [
          { name: "Ramesh Kumar", relation: "Head", age: 42, occupation: "Farmer", income: 240000, status: "Verified" },
          { name: "Pooja Kumar", relation: "Spouse", age: 38, occupation: "Housewife", income: 0, status: "Verified" },
          { name: "Amit Kumar", relation: "Son", age: 19, occupation: "Student", income: 0, status: "Verified" },
          { name: "Mohan Kumar", relation: "Father", age: 62, occupation: "Retired", income: 0, status: "Verified" }
        ],
        documents: [
          { name: "Aadhaar Card", verified: true },
          { name: "Income Certificate", verified: true },
          { name: "SBI Passbook", verified: true },
          { name: "Land Registry Copy", verified: true }
        ],
        events: [
          { date: new Date().toLocaleDateString('en-GB'), title: "Welfare Passport Created", desc: "Initial registration approved by Gram Panchayat." },
          { date: new Date().toLocaleDateString('en-GB'), title: "PM Kisan Installment", desc: "₹2,000 received in registered bank account." },
          { date: "Jun 2026", title: "Amit joined College (Education)", desc: "Triggered recommendations for central post-matric higher education grants." },
          { date: "Mar 2026", title: "Applied for PM Awas (Housing)", desc: "Document checklist completed. Application registered with rural development office." },
          { date: "Jan 2024", title: "Mohan Kumar turned 60 (Senior)", desc: "Triggered Old Age Pension claim and registration for Senior Medical Health Cards." }
        ]
      });
      
      // Send notification
      setNotifications(prev => [
        { id: Date.now(), title: "Welfare Passport Activated", text: "Welcome Ramesh Kumar! Your household details have been verified.", time: "Just now", read: false },
        ...prev
      ]);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCompareList([]);
    alert("Logged out successfully.");
  };

  const handleAddMember = (member) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      family: [...prev.family, member]
    }));
    setNotifications(prev => [
      { id: Date.now(), title: "Member Registry Update", text: `${member.name} has been added. Initializing verification APIs.`, time: "Just now", read: false },
      ...prev
    ]);
  };

  const handleUploadDoc = (docName) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      documents: [...prev.documents, { name: docName.split('.')[0], verified: false }]
    }));
    setNotifications(prev => [
      { id: Date.now(), title: "Locker File Uploaded", text: `"${docName}" uploaded securely. Verification is in progress.`, time: "Just now", read: false },
      ...prev
    ]);
  };

  const handleSaveScheme = (scheme) => {
    setNotifications(prev => [
      { id: Date.now(), title: "Welfare Saved", text: `"${scheme.name}" saved to your target timelines checklist.`, time: "Just now", read: false },
      ...prev
    ]);
    alert(`"${scheme.name}" saved to your welfare profiles tracker!`);
  };

  const handleNavigateToPlannerFromCompare = (promptText) => {
    handleNavigate('planner', { defaultPrompt: promptText });
  };

  const handleClearNoti = () => {
    setNotifications([]);
  };

  const handleMarkNotiRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // If verify view, render only verify card
  if (activeView === 'verify') {
    const cardId = window.location.hash.split('/')[1] || '';
    return <VerifyCard cardId={cardId} onLogin={() => {
      handleNavigate('home');
      setTimeout(() => setIsAuthOpen(true), 100);
    }} />;
  }

  return (
    <div className="app-shell">
      {showSplash && <SplashLoader onComplete={() => setShowSplash(false)} />}
      
      {/* Background Glowing Ambient Orbs */}
      <div className="glowing-orb orb-primary"></div>
      <div className="glowing-orb orb-secondary"></div>
      <div className="glowing-orb orb-tertiary"></div>

      {/* Floating Navbar */}
      <Navbar 
        activeView={activeView}
        onNavigate={handleNavigate}
        stateLocation={stateLocation}
        onChangeState={setStateLocation}
        notifications={notifications}
        onClearNoti={handleClearNoti}
        onMarkNotiRead={handleMarkNotiRead}
        user={user}
        onLogout={handleLogout}
        onTriggerAuth={(isRegister) => {
          if (isRegister) {
            handleNavigate('onboarding');
          } else {
            setIsAuthOpen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className={`main-content ${activeView === 'planner' ? 'main-content-planner' : ''}`}>
        {activeView === 'home' && (
          <Home 
            onNavigate={handleNavigate}
            onTriggerAuth={(isRegister) => {
              if (isRegister) handleNavigate('onboarding');
              else setIsAuthOpen(true);
            }}
          />
        )}
        
        {activeView === 'schemes' && (
          <Schemes 
            onNavigate={handleNavigate}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            initialCategory={catalogCategory}
            onTriggerCompare={() => setIsCompareOpen(true)}
          />
        )}

        {activeView === 'detail' && (
          <SchemeDetail 
            schemeId={detailSchemeId}
            onBack={() => handleNavigate('schemes')}
            onNavigate={handleNavigate}
            onSaveScheme={handleSaveScheme}
          />
        )}

        {activeView === 'planner' && (
          <AIPlanner 
            initialPrompt={plannerPrompt}
            user={user}
          />
        )}

        {activeView === 'family' && (
          <Family 
            user={user}
            onAddMember={handleAddMember}
            onUploadDoc={handleUploadDoc}
            onTriggerAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeView === 'scam-shield' && (
          <ScamShield />
        )}

        {activeView === 'onboarding' && (
          <Onboarding 
            stateLocation={stateLocation}
            onChangeState={setStateLocation}
            onTriggerAuth={() => setIsAuthOpen(true)}
            onComplete={(data, saathiId) => {
              handleLoginSuccess(data, saathiId);
              handleNavigate('home');
            }} 
          />
        )}

        {activeView === 'form-assistant' && (
          <GovFormAssistant 
            user={user}
            onBack={() => handleNavigate('schemes')}
          />
        )}

        {activeView === 'partners' && (
          <Partners />
        )}

        {activeView === 'outlier' && (
          <OutlierDashboard />
        )}
      </main>

      {/* Bottom Sticky Footer */}
      {activeView !== 'planner' && (
        <Footer 
          user={user}
          onNavigate={handleNavigate}
          onTriggerAuth={(isRegister) => {
            if (isRegister) handleNavigate('onboarding');
            else setIsAuthOpen(true);
          }}
          lang={lang}
        />
      )}

      {/* Modals & Overlays */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CompareModal 
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareList}
        onNavigateToPlanner={handleNavigateToPlannerFromCompare}
        lang={lang}
      />

      {activeView !== 'planner' && (
        <EligibilityPopup 
          onRegisterLead={() => setIsAuthOpen(true)}
        />
      )}
    </div>
  );
}
