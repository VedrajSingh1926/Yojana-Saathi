import React, { useState, useEffect } from 'react';
import { Search, Sliders, Scale, Trash2, ArrowRight } from 'lucide-react';
import { SCHEMES_DB } from '../data/schemes';
import { motion, AnimatePresence } from 'framer-motion';

export default function Schemes({ 
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

  // Keep state in sync with parent updates (e.g. milestone redirects)
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    'all', 'Women', 'Student', 'Farmer', 'Business', 'Housing', 'Health', 'Employment', 'Education', 'Senior Citizen', 'Disabled', 'Minority'
  ];

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
    const matchesType = types.includes(scheme.type);
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

  return (
    <div className="view-section animate-fade-in">
      <div className="schemes-hero">
        <h1 className="hero-title text-center">Explore Government Schemes</h1>
        <p className="text-center text-muted">AI organized. Easy to understand. Always updated.</p>

        {/* Search */}
        <div className="search-box-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any scheme... (e.g. PM Awas, PM Kisan, Startup India, Scholarship)"
          />
          {search && (
            <button className="btn btn-primary search-clear-btn" onClick={() => setSearch('')}>
              Clear
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
            <h3><Sliders size={18} /> Filters</h3>
            <button className="btn-text text-gold btn-sm" onClick={handleReset}>Reset All</button>
          </div>

          {/* Type filters */}
          <div className="filter-group">
            <h4>Type</h4>
            <div className="filter-options-stack">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={types.includes('Central')}
                  onChange={() => handleTypeChange('Central')}
                />
                <span className="checkmark"></span> Central Gov
              </label>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={types.includes('State')}
                  onChange={() => handleTypeChange('State')}
                />
                <span className="checkmark"></span> State Gov
              </label>
            </div>
          </div>

          {/* Category Filters */}
          <div className="filter-group">
            <h4>Target Categories</h4>
            <div className="filter-tags-grid">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === 'all' ? 'All Schemes' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Compare Tray Widget */}
          <div className="compare-tray-widget">
            <h3><Scale size={18} /> Scheme Compare</h3>
            <div className="compare-tray-items">
              {compareList.length === 0 ? (
                <p className="text-muted text-sm">Add up to 3 schemes to compare side-by-side.</p>
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
                Compare Selected ({compareList.length})
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
                All Schemes
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'recently-updated' ? 'active' : ''}`}
                onClick={() => setTrendingTab('recently-updated')}
              >
                Recently Updated
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'most-applied' ? 'active' : ''}`}
                onClick={() => setTrendingTab('most-applied')}
              >
                Most Applied
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'deadline-soon' ? 'active' : ''}`}
                onClick={() => setTrendingTab('deadline-soon')}
              >
                Deadline Soon
              </button>
              <button 
                className={`tab-btn ${trendingTab === 'new-launch' ? 'active' : ''}`}
                onClick={() => setTrendingTab('new-launch')}
              >
                New Launch
              </button>
            </div>
          </div>

          <div className="results-meta">
            <span>Showing {filtered.length} schemes</span>
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
                        <span className="badge badge-tag">{s.category}</span>
                      </div>
                    </div>
                    <h3>{s.name}</h3>
                    <p className="scheme-desc">{s.description}</p>
                    
                    <div className="scheme-stats">
                      <div className="stat-box">
                        <span className="stat-label">Estimated Benefit</span>
                        <span className="stat-val text-gold">{s.benefit}</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Verification Time</span>
                        <span className="stat-val">2-4 Weeks</span>
                      </div>
                    </div>

                    <div className="scheme-card-actions">
                      <a href="#" className="card-learn-more" onClick={(e) => { e.preventDefault(); onNavigate('detail', { schemeId: s.id }); }}>
                        Learn More <ArrowRight size={14} />
                      </a>
                      <label className="compare-checkbox-label">
                        <input 
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => onToggleCompare(s.id)}
                        />
                        <span>Compare</span>
                      </label>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center p-5 w-full col-span-2 glass-card">
                <h3>No schemes match your criteria</h3>
                <p className="text-muted text-sm mt-1">Try resetting the filters or modifying your search query.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
