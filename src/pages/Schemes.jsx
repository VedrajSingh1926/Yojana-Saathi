import React, { useState, useEffect } from 'react';
import { Search, Sliders, Scale, Trash2, ArrowRight } from 'lucide-react';
import { SCHEMES_DB } from '../data/schemes';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../data/translations';

export default function Schemes({ 
  lang,
  onNavigate, 
  compareList, 
  onToggleCompare, 
  initialCategory = 'all',
  onTriggerCompare
}) {
  const [search, setSearch] = useState('');
  const [types, setTypes] = useState(['Central', 'State']);
  const [category, setCategory] = useState(initialCategory);
  const [trendingTab, setTrendingTab] = useState('all-trending');

  const t = translations[lang] || translations.en;

  // Keep state in sync with parent updates (e.g. milestone redirects)
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    'all', 'Women', 'Student', 'Farmer', 'Business', 'Housing', 'Health', 'Employment', 'Education', 'Senior Citizen', 'Disabled', 'Minority'
  ];

  const localizedCategories = {
    en: { all: "All Schemes", Women: "Women", Student: "Student", Farmer: "Farmer", Business: "Business", Housing: "Housing", Health: "Health", Employment: "Employment", Education: "Education", 'Senior Citizen': "Senior Citizen", Disabled: "Disabled", Minority: "Minority" },
    hi: { all: "सभी योजनाएं", Women: "महिला", Student: "छात्र", Farmer: "किसान", Business: "व्यवसाय", Housing: "आवास", Health: "स्वास्थ्य", Employment: "रोजगार", Education: "शिक्षा", 'Senior Citizen': "वरिष्ठ नागरिक", Disabled: "दिव्यांग", Minority: "अल्पसंख्यक" },
    ta: { all: "அனைத்து திட்டங்கள்", Women: "பெண்கள்", Student: "மாணவர்", Farmer: "விவசாயி", Business: "வணிகம்", Housing: "வீட்டுவசதி", Health: "சுகாதாரம்", Employment: "வேலைவாய்ப்பு", Education: "கல்வி", 'Senior Citizen': "முதியோர்", Disabled: "மாற்றுத்திறனாளி", Minority: "சிறுபான்மையினர்" },
    te: { all: "అన్ని పథకాలు", Women: "మహిళలు", Student: "విద్యార్థి", Farmer: "రైతు", Business: "వ్యాపారం", Housing: "గృహనిర్మాణం", Health: "ఆరోగ్యం", Employment: "ఉపాధి", Education: "విద్య", 'Senior Citizen': "సీనియర్ సిటిజన్", Disabled: "వికలాంగులు", Minority: "మైనారిటీలు" },
    bn: { all: "সমস্ত স্কিম", Women: "মহিলা", Student: "ছাত্র", Farmer: "কৃষক", Business: "ব্যবসা", Housing: "আবাসন", Health: "স্বাস্থ্য", Employment: "কর্মসংস্থান", Education: "শিক্ষা", 'Senior Citizen': "প্রবীণ নাগরিক", Disabled: "প্রতিবন্ধী", Minority: "সংখ্যালঘু" }
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
    setCategory('all');
    setTrendingTab('all-trending');
  };

  // Filter schemes
  let filtered = SCHEMES_DB.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(search.toLowerCase()) ||
                          scheme.description.toLowerCase().includes(search.toLowerCase()) ||
                          scheme.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = types.length === 0 ? true : types.includes(scheme.type);
    const matchesCategory = category === 'all' || scheme.category === category;
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
              {lang === 'en' ? 'Clear' : lang === 'hi' ? 'साफ़ करें' : lang === 'ta' ? 'அழி' : lang === 'te' ? 'క్లియర్' : 'মুছুন'}
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
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="schemes-layout-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="sidebar-header">
            <h3><Sliders size={18} /> {t.filtersTitle}</h3>
            <button className="btn-text text-gold btn-sm" onClick={handleReset}>{t.resetAll}</button>
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
          <div className="schemes-cards-grid">
            <AnimatePresence>
              {filtered.map(s => {
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
                          {s.type}
                        </span>
                        <span className="badge badge-tag">{localizedCategories[lang]?.[s.category] || s.category}</span>
                      </div>
                    </div>
                    <h3>{s.name}</h3>
                    <p className="scheme-desc">{s.description}</p>
                    
                    <div className="scheme-stats">
                      <div className="stat-box">
                        <span className="stat-label">{t.estimatedBenefit}</span>
                        <span className="stat-val text-gold">{s.benefit}</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">{verificationTimeText[lang] || verificationTimeText.en}</span>
                        <span className="stat-val">2-4 Weeks</span>
                      </div>
                    </div>

                    <div className="scheme-card-actions">
                      <a href="#" className="card-learn-more" onClick={(e) => { e.preventDefault(); onNavigate('detail', { schemeId: s.id }); }}>
                        {learnMoreText[lang] || learnMoreText.en} <ArrowRight size={14} />
                      </a>
                      <label className="compare-checkbox-label">
                        <input 
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => onToggleCompare(s.id)}
                        />
                        <span>{t.compare}</span>
                      </label>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center p-5 w-full col-span-2 glass-card">
                <h3>{noMatchTitle[lang] || noMatchTitle.en}</h3>
                <p className="text-muted text-sm mt-1">{noMatchDesc[lang] || noMatchDesc.en}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
