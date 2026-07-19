import React, { useState, useEffect } from 'react';
import { Search, Sliders, Scale, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SCHEMES_DB } from '../data/schemes';
import { useLocationContext } from '../context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';


export default function Schemes({ 
  onNavigate, 
  compareList, 
  onToggleCompare, 
  initialCategory = 'all',
  onTriggerCompare,
  user
}) {
  const { lang, t } = useLanguage();
  const { stateLocation, setStateLocation } = useLocationContext();
  const [search, setSearch] = useState('');
  const [types, setTypes] = useState(['Central', 'State']);
  const [category, setCategory] = useState(initialCategory);
  const [trendingTab, setTrendingTab] = useState('all-trending');
  const [showMobileFilters, setShowMobileFilters] = useState(false);


  // Keep state in sync with parent updates (e.g. milestone redirects)
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    'all', 'recommended', 'Women', 'Student', 'Farmer', 'Business', 'Housing', 'Health', 'Employment', 'Education', 'Senior Citizen', 'Disabled', 'Minority'
  ];

  const localizedCategories = {
    en: { all: "All Schemes", recommended: "✨ For You", Women: "Women", Student: "Student", Farmer: "Farmer", Business: "Business", Housing: "Housing", Health: "Health", Employment: "Employment", Education: "Education", 'Senior Citizen': "Senior Citizen", Disabled: "Disabled", Minority: "Minority" },
    hi: { all: "सभी योजनाएं", recommended: "✨ आपके लिए", Women: "महिला", Student: "छात्र", Farmer: "किसान", Business: "व्यवसाय", Housing: "आवास", Health: "स्वास्थ्य", Employment: "रोजगार", Education: "शिक्षा", 'Senior Citizen': "वरिष्ठ नागरिक", Disabled: "दिव्यांग", Minority: "अल्पसंख्यक" },
    ta: { all: "அனைத்து திட்டங்கள்", recommended: "✨ உங்களுக்கானவை", Women: "பெண்கள்", Student: "மாணவர்", Farmer: "விவசாயி", Business: "வணிகம்", Housing: "வீட்டுவசதி", Health: "சுகாதாரம்", Employment: "வேலைவாய்ப்பு", Education: "கல்வி", 'Senior Citizen': "முதியோர்", Disabled: "மாற்றுத்திறனாளி", Minority: "சிறுபான்மையினர்" },
    te: { all: "అన్ని పథకాలు", recommended: "✨ మీ కోసం", Women: "మహిళలు", Student: "విద్యార్థి", Farmer: "రైతు", Business: "వ్యాపారం", Housing: "గృహనిర్మాణం", Health: "ఆరోగ్యం", Employment: "ఉపాధి", Education: "విద్య", 'Senior Citizen': "సీనియర్ సిటిజన్", Disabled: "వికలాంగులు", Minority: "మైనారిటీలు" },
    bn: { all: "সমস্ত স্কিম", recommended: "✨ আপনার জন্য", Women: "মহিলা", Student: "ছাত্র", Farmer: "কৃষক", Business: "ব্যবসা", Housing: "আবাসন", Health: "স্বাস্থ্য", Employment: "কর্মসংস্থান", Education: "শিক্ষা", 'Senior Citizen': "প্রবীণ নাগরিক", Disabled: "প্রতিবন্ধী", Minority: "সংখ্যালঘু" }
  };

  const handleTypeChange = (typeVal) => {
    if (types.includes(typeVal)) {
      setTypes(types.filter(t => t !== typeVal));
    } else {
      setTypes([...types, typeVal]);
    }
  };

  const handleReset = () => {
    setSearch('');
    setTypes(['Central', 'State']);
    setStateLocation('All States');
    setCategory('all');
    setTrendingTab('all-trending');
  };

  // Filter schemes
  let filtered = SCHEMES_DB.filter(scheme => {
    const locName = scheme.name[lang] || scheme.name.en || "";
    const locDesc = scheme.description[lang] || scheme.description.en || "";
    const locCat = scheme.category[lang] || scheme.category.en || "";

    const matchesSearch = locName.toLowerCase().includes(search.toLowerCase()) ||
                          locDesc.toLowerCase().includes(search.toLowerCase()) ||
                          locCat.toLowerCase().includes(search.toLowerCase());
    const matchesType = types.length === 0 ? true : types.includes(scheme.type);
    
    let matchesCategory = false;
    const baseCategory = scheme.category.en || scheme.category;
    if (category === 'all') {
      matchesCategory = true;
    } else if (category === 'recommended') {
      if (!user) {
        matchesCategory = true;
      } else {
        const familyOccupations = user.family ? user.family.map(m => m.occupation) : [user.occupation];
        const hasSenior = user.family ? user.family.some(m => m.age >= 60) : user.age >= 60;
        
        matchesCategory = familyOccupations.includes(baseCategory) || 
                          (hasSenior && baseCategory === 'Senior Citizen') ||
                          ['Housing', 'Health'].includes(baseCategory);
      }
    } else {
      matchesCategory = baseCategory === category;
    }
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Tab filters
  if (trendingTab === 'recently-updated') {
    filtered = filtered.filter(s => ['pm-kisan', 'ladli-behna', 'mukhya-awas'].includes(s.id));
  } else if (trendingTab === 'most-applied') {
    filtered = filtered.filter(s => ['pm-awas', 'pm-kisan', 'ayushman-bharat'].includes(s.id));
  } else if (trendingTab === 'deadline-soon') {
    filtered = filtered.filter(s => ['scholarship'].includes(s.id));
  } else if (trendingTab === 'new-launch') {
    filtered = filtered.filter(s => ['ladli-behna'].includes(s.id));
  }

  // Localized UI Texts
  const widgetTitle = { en: "Scheme Compare", hi: "योजना तुलना", ta: "திட்ட ஒப்பீடு", te: "పథకాల పోలిక", bn: "স্কিম তুলনা" };
  const widgetDesc = {
    en: "Add up to 3 schemes to compare side-by-side.",
    hi: "साथ-साथ तुलना करने के लिए 3 योजनाओं तक जोड़ें।",
    ta: "ஒப்பிட 3 திட்டங்கள் வரை சேர்க்கவும்.",
    te: "పోల్చడానికి గరిష్టంగా 3 పథకాలను జోడించండి.",
    bn: "পাশাপাশি তুলনা করতে ৩টি পর্যন্ত স্কিম যোগ করুন।"
  };
  const compareBtnText = {
    en: `Compare Selected (${compareList.length})`,
    hi: `चयनित तुलना करें (${compareList.length})`,
    ta: `தேர்ந்தெடுக்கப்பட்டதை ஒப்பிடுக (${compareList.length})`,
    te: `ఎంచుకున్నవి పోల్చండి (${compareList.length})`,
    bn: `নির্বাচিত স্কিম তুলনা করুন (${compareList.length})`
  };
  const showingSchemesText = {
    en: `Showing ${filtered.length} schemes`,
    hi: `${filtered.length} योजनाएं दिखा रहे हैं`,
    ta: `${filtered.length} திட்டங்கள் காட்டப்படுகின்றன`,
    te: `${filtered.length} పథకాలు చూపబడుతున్నాయి`,
    bn: `${filtered.length}টি স্কিম দেখানো হচ্ছে`
  };
  const verificationTimeText = { en: "Verification Time", hi: "सत्यापन समय", ta: "சரிபார்ப்பு நேரம்", te: "ధృవీకరణ సమయం", bn: "যাচাইকরণের সময়" };
  const learnMoreText = { en: "Learn More", hi: "अधिक जानें", ta: "மேலும் அறிய", te: "మరింత తెలుసుకోండి", bn: "বিস্তারিত জানুন" };
  const noMatchTitle = {
    en: "No schemes match your criteria",
    hi: "आपकी आवश्यकताओं से मेल खाने वाली कोई योजना नहीं मिली",
    ta: "தகுதியான திட்டங்கள் எதுவும் இல்லை",
    te: "మీ అర్హతకు సరిపోయే పథకాలు లేవు",
    bn: "আপনার অনুরোধের সাথে মেলে এমন কোনো স্কিম পাওয়া যায়নি"
  };
  const noMatchDesc = {
    en: "Try resetting the filters or modifying your search query.",
    hi: "फ़िल्टर रीसेट करने या अपनी खोज क्वेरी को बदलने का प्रयास करें।",
    ta: "வடிகட்டிகளை மீட்டமைக்க அல்லது தேடலை மாற்ற முயற்சிக்கவும்.",
    te: "ఫిల్టర్లను రీసెట్ చేయడానికి లేదా మీ శోధనను మార్చడానికి ప్రయత్నించండి.",
    bn: "অনুগ্রহ করে ফিল্টার রিসেট করুন অথবা অন্য কিছু লিখে সার্চ করুন।"
  };

  const getCentralHeading = (lang) => {
    const map = {
      en: "Central Government Schemes",
      hi: "केंद्र सरकार की योजनाएँ",
      ta: "மத்திய அரசு திட்டங்கள்",
      te: "కేంద్ర ప్రభుత్వ పథకాలు",
      bn: "কেন্দ্রীয় সরকারের স্কিম"
    };
    return map[lang] || map.en;
  };

  const getStateHeading = (state, lang) => {
    const stateStr = state === 'All States' ? 'State' : state;
    const stateLoc = {
      hi: { "State": "राज्य", "Rajasthan": "राजस्थान", "Madhya Pradesh": "मध्य प्रदेश", "Tamil Nadu": "तमिलनाडु", "Maharashtra": "महाराष्ट्र" },
      ta: { "State": "மாநில", "Rajasthan": "ராஜஸ்தான்", "Madhya Pradesh": "மத்தியப் பிரதேசம்", "Tamil Nadu": "தமிழ்நாடு", "Maharashtra": "மகாராட்டிரம்" },
      te: { "State": "రాష్ట్ర", "Rajasthan": "రాజస్థాన్", "Madhya Pradesh": "మధ్యప్రదేశ్", "Tamil Nadu": "తమిళనాడు", "Maharashtra": "మహారాష్ట్ర" },
      bn: { "State": "রাজ্য", "Rajasthan": "রাজস্থান", "Madhya Pradesh": "মধ্যপ্রদেশ", "Tamil Nadu": "তামিলনাড়ু", "Maharashtra": "মহারাষ্ট্র" }
    };
    const localizedState = stateLoc[lang]?.[stateStr] || stateStr;
    
    const suffix = {
      en: "Government Schemes",
      hi: "सरकार की योजनाएँ",
      ta: "அரசு திட்டங்கள்",
      te: "ప్రభుత్వ పథకాలు",
      bn: "সরকারের স্কিম"
    };
    return `${localizedState} ${suffix[lang] || suffix.en}`;
  };

  const localizedStates = {
    hi: { "All States": "सभी राज्य", "Rajasthan": "राजस्थान", "Madhya Pradesh": "मध्य प्रदेश", "Tamil Nadu": "तमिलनाडु", "Maharashtra": "महाराष्ट्र" },
    ta: { "All States": "அனைத்து மாநிலங்கள்", "Rajasthan": "ராஜஸ்தான்", "Madhya Pradesh": "மத்தியப் பிரதேசம்", "Tamil Nadu": "தமிழ்நாடு", "Maharashtra": "மகாராட்டிரம்" },
    te: { "All States": "అన్ని రాష్ట్రాలు", "Rajasthan": "రాజస్థాన్", "Madhya Pradesh": "మధ్యప్రదేశ్", "Tamil Nadu": "తమిళనాడు", "Maharashtra": "మహారాష్ట్ర" },
    bn: { "All States": "সমস্ত রাজ্য", "Rajasthan": "রাজস্থান", "Madhya Pradesh": "মধ্যপ্রদেশ", "Tamil Nadu": "তামিলনাড়ু", "Maharashtra": "মহারাষ্ট্র" }
  };

  const centralSchemes = filtered.filter(s => s.type === 'Central');
  const stateSchemes = filtered.filter(s => s.type === 'State' && (stateLocation === 'All States' || s.state === stateLocation));

  const renderSchemeCard = (s) => {
    const isCompared = compareList.includes(s.id);
    return (
      <motion.div 
        layout
        key={s.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="scheme-card glass-card"
      >
        <div className="scheme-card-header">
          <div className="scheme-emoji">{s.emoji}</div>
          <div className="scheme-badges">
            <span className={`badge ${s.type === 'Central' ? 'badge-type-central' : 'badge-type-state'}`}>
              {s.type === 'Central' ? (t.centralBadge || '🟢 Central Government') : `🟠 ${s.state || 'State'} ${(t.stateBadgeSuffix || 'Government')}`}
            </span>
            <span className="badge badge-tag">{localizedCategories[lang]?.[(s.category && s.category.en) || s.category] || s.category[lang] || s.category.en}</span>
          </div>
        </div>
        <h3 className="break-words">{s.name[lang] || s.name.en}</h3>
        <p className="scheme-desc break-words">{s.description[lang] || s.description.en}</p>
        
        <div className="scheme-stats">
          <div className="stat-box">
            <span className="stat-label">{t.estimatedBenefit || "Benefit"}</span>
            <span className="stat-val text-gold">{s.benefit[lang] || s.benefit.en}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">{verificationTimeText[lang] || verificationTimeText.en}</span>
            <span className="stat-val">2-4 Weeks</span>
          </div>
        </div>

        <div className="scheme-card-actions-wrapper">
          <div className="main-actions-group">
            <button 
              className="btn btn-primary btn-sm main-btn" 
              onClick={() => onNavigate('form-assistant')}
            >
              <Sparkles size={12} /> {t.fillWithAI || "Fill with AI"}
            </button>
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent((s.name.en || s.name) + ' CSC near me')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm main-btn" 
            >
              📍 {t.findNearbyCsc || "Find Nearby CSC"}
            </a>
          </div>
          <div className="secondary-actions-group">
            <a href="#" className="card-learn-more" onClick={(e) => { e.preventDefault(); onNavigate('detail', { schemeId: s.id }); }}>
              {learnMoreText[lang] || learnMoreText.en} <ArrowRight size={14} />
            </a>
            <label className="compare-checkbox-label">
              <input 
                type="checkbox"
                checked={isCompared}
                onChange={() => onToggleCompare(s.id)}
              />
              <span>{t.compare || "Compare"}</span>
            </label>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="view-section animate-fade-in">
      <div className="schemes-hero">
        <h1 className="hero-title text-center">{t.catalogTitle || "Explore Government Schemes"}</h1>
        <p className="text-center text-muted">{t.catalogSubtitle || "AI organized. Easy to understand. Always updated."}</p>

        {/* Search */}
        <div className="search-box-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder || "Search any scheme... (e.g. PM Awas, PM Kisan, Startup India, Scholarship)"}
          />
          {search && (
            <button className="btn btn-primary search-clear-btn" onClick={() => setSearch('')}>
              {t.clear || "Clear"}
            </button>
          )}
        </div>

        {/* Suggestion pills */}
        <div className="search-suggestions">
          {['PM Awas', 'PM Kisan', 'Startup India', 'Scholarship', 'Women', 'Senior Citizen'].map(tag => (
            <span 
              key={tag} 
              className="suggestion-tag"
              onClick={() => setSearch(tag === 'Startup India' ? 'Startup' : tag)}
            >
              {t[tag.replace(/\s+/g, '')] || tag}
            </span>
          ))}
        </div>
      </div>

      <div className="schemes-layout-container">
        {/* Filters Sidebar (Desktop) */}
        <aside className="filters-sidebar">
          <div className="sidebar-header">
            <h3><Sliders size={18} /> {t.filtersTitle || "Filters"}</h3>
            <button className="btn-text text-gold btn-sm" onClick={handleReset}>{t.resetAll || "Reset"}</button>
          </div>

          {/* Type filters */}
          <div className="filter-group">
            <h4>{t.govType}</h4>
            <div className="filter-options-stack">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={types.includes('Central')}
                  onChange={() => handleTypeChange('Central')}
                />
                <span className="checkmark"></span> {t.centralGov}
              </label>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={types.includes('State')}
                  onChange={() => handleTypeChange('State')}
                />
                <span className="checkmark"></span> {t.stateGov}
              </label>
            </div>
          </div>

            <div className="filter-group">
              <h4>{t.stateSelection || "State Selection"}</h4>
              <select 
                className="input-field w-full"
                value={stateLocation}
                onChange={(e) => setStateLocation(e.target.value)}
                style={{ padding: '0.5rem', marginTop: '0.5rem' }}
              >
                <option value="All States">{localizedStates[lang]?.["All States"] || "All States"}</option>
                <option value="Rajasthan">{localizedStates[lang]?.["Rajasthan"] || "Rajasthan"}</option>
                <option value="Madhya Pradesh">{localizedStates[lang]?.["Madhya Pradesh"] || "Madhya Pradesh"}</option>
                <option value="Tamil Nadu">{localizedStates[lang]?.["Tamil Nadu"] || "Tamil Nadu"}</option>
                <option value="Maharashtra">{localizedStates[lang]?.["Maharashtra"] || "Maharashtra"}</option>
              </select>
            </div>


          {/* Category Filters */}
          <div className="filter-group">
            <h4>{t.targetCategories}</h4>
            <div className="filter-tags-grid">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {localizedCategories[lang]?.[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          {/* Compare Tray Widget */}
          <div className="compare-tray-widget">
            <h3><Scale size={18} /> {widgetTitle[lang] || widgetTitle.en}</h3>
            <div className="compare-tray-items">
              {compareList.length === 0 ? (
                <p className="text-muted text-sm">{widgetDesc[lang] || widgetDesc.en}</p>
              ) : (
                compareList.map(id => {
                  const s = SCHEMES_DB.find(sch => sch.id === id);
                  return (
                    <div key={id} className="tray-item">
                      <span>{s?.emoji} {s?.name.split('(')[0]}</span>
                      <button className="tray-item-remove" onClick={() => onToggleCompare(id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            {compareList.length > 0 && (
              <button 
                className="btn btn-primary btn-sm w-full"
                onClick={onTriggerCompare}
              >
                {compareBtnText[lang] || compareBtnText.en}
              </button>
            )}
          </div>
        </aside>

        {/* Schemes list content */}
        <main className="schemes-grid-content">
          <div className="trending-tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${trendingTab === 'all-trending' ? 'active' : ''}`}
                onClick={() => setTrendingTab('all-trending')}
              >
                {localizedCategories[lang]?.all || 'All Schemes'}
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'recently-updated' ? 'active' : ''}`}
                onClick={() => setTrendingTab('recently-updated')}
              >
                {t.tabRecentlyUpdated}
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'most-applied' ? 'active' : ''}`}
                onClick={() => setTrendingTab('most-applied')}
              >
                {t.tabMostApplied}
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'deadline-soon' ? 'active' : ''}`}
                onClick={() => setTrendingTab('deadline-soon')}
              >
                {t.tabDeadlineSoon}
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'new-launch' ? 'active' : ''}`}
                onClick={() => setTrendingTab('new-launch')}
              >
                {t.tabNewLaunch}
              </button>
            </div>
          </div>

          <div className="results-meta">
            <span>{showingSchemesText[lang] || showingSchemesText.en}</span>
          </div>

          {/* Cards Grid */}
          <div className="schemes-cards-section">
            
            {centralSchemes.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--primary-glow)', paddingBottom: '0.5rem', fontSize: '1.4rem' }}>
                  {getCentralHeading(lang)}
                </h3>
                <div className="schemes-cards-grid">
                  <AnimatePresence>
                    {centralSchemes.map(s => renderSchemeCard(s))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {stateSchemes.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--secondary-glow)', paddingBottom: '0.5rem', fontSize: '1.4rem' }}>
                  {getStateHeading(stateLocation, lang)}
                </h3>
                <div className="section-title-wrap">
                  <div className="title-icon bg-gold"></div>
                  <h2>{t.stateGovSchemes || "State Government Schemes"}</h2>
                  {getStateHeading(stateLocation, lang)}
                </div>
                <div className="schemes-cards-grid">
                  <AnimatePresence>
                    {stateSchemes.map(s => renderSchemeCard(s))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center p-5 w-full col-span-2 glass-card">
                <h3>{noMatchTitle[lang] || noMatchTitle.en}</h3>
                <p className="text-muted text-sm mt-1">{noMatchDesc[lang] || noMatchDesc.en}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Filter FAB */}
      <button 
        className="mobile-filter-fab" 
        onClick={() => setShowMobileFilters(true)}
        aria-label="Open Filters"
      >
        <Sliders size={24} />
      </button>

      {/* Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              className="bottom-sheet-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div 
              className="bottom-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="bottom-sheet-handle" onClick={() => setShowMobileFilters(false)} />
              
              <div className="sidebar-header">
                <h3><Sliders size={18} /> {t.filtersTitle || "Filters"}</h3>
                <button className="btn-text text-gold btn-sm" onClick={() => { handleReset(); setShowMobileFilters(false); }}>{t.resetAll || "Reset"}</button>
              </div>

              {/* Type filters */}
              <div className="filter-group">
                <h4>{t.govType || "Govt Type"}</h4>
                <div className="filter-options-stack">
                  <label className="checkbox-container">
                    <input type="checkbox" checked={types.includes('Central')} onChange={() => handleTypeChange('Central')} />
                    <span className="checkmark"></span> {t.centralGov || "Central"}
                  </label>
                  <label className="checkbox-container">
                    <input type="checkbox" checked={types.includes('State')} onChange={() => handleTypeChange('State')} />
                    <span className="checkmark"></span> {t.stateGov || "State"}
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <h4>{t.stateSelection || "State Selection"}</h4>
                <select 
                  className="input-field w-full"
                  value={stateLocation}
                  onChange={(e) => setStateLocation(e.target.value)}
                  style={{ padding: '0.5rem', marginTop: '0.5rem' }}
                >
                  <option value="All States">{localizedStates[lang]?.["All States"] || "All States"}</option>
                  <option value="Rajasthan">{localizedStates[lang]?.["Rajasthan"] || "Rajasthan"}</option>
                  <option value="Madhya Pradesh">{localizedStates[lang]?.["Madhya Pradesh"] || "Madhya Pradesh"}</option>
                  <option value="Tamil Nadu">{localizedStates[lang]?.["Tamil Nadu"] || "Tamil Nadu"}</option>
                  <option value="Maharashtra">{localizedStates[lang]?.["Maharashtra"] || "Maharashtra"}</option>
                </select>
              </div>

              <div className="filter-group">
                <h4>{t.targetCategories || "Categories"}</h4>
                <div className="filter-tags-grid">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={`filter-pill ${category === cat ? 'active' : ''}`}
                      onClick={() => setCategory(cat)}
                    >
                      {localizedCategories[lang]?.[cat] || cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <button className="btn btn-primary w-full mt-3" onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
