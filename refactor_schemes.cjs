const fs = require('fs');
let content = fs.readFileSync('src/pages/Schemes.jsx', 'utf8');

const target = `        <div className="scheme-card-actions">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary btn-sm" 
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => onNavigate('form-assistant')}
            >
              <Sparkles size={12} /> {t.fillWithAI || "Fill with AI"}
            </button>
            <a 
              href={\`https://www.google.com/search?q=\${encodeURIComponent(s.name + ' CSC near me')}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm" 
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              📍 {t.findNearbyCsc || "Find Nearby CSC"}
            </a>
            <a href="#" className="card-learn-more" onClick={(e) => { e.preventDefault(); onNavigate('detail', { schemeId: s.id }); }} style={{ display: 'flex', alignItems: 'center' }}>
              {learnMoreText[lang] || learnMoreText.en} <ArrowRight size={14} />
            </a>
          </div>
        </div>`;

const replacement = `        <div className="scheme-card-actions scheme-card-actions-responsive">
            <button 
              className="btn btn-primary btn-sm scheme-action-btn" 
              onClick={() => onNavigate('form-assistant')}
            >
              <Sparkles size={12} /> {t.fillWithAI || "Fill with AI"}
            </button>
            <a 
              href={\`https://www.google.com/search?q=\${encodeURIComponent(s.name + ' CSC near me')}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm scheme-action-btn" 
            >
              📍 {t.findNearbyCsc || "Find Nearby CSC"}
            </a>
            <a href="#" className="card-learn-more scheme-action-btn-link" onClick={(e) => { e.preventDefault(); onNavigate('detail', { schemeId: s.id }); }}>
              {learnMoreText[lang] || learnMoreText.en} <ArrowRight size={14} />
            </a>
        </div>`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/pages/Schemes.jsx', content, 'utf8');
    console.log('Successfully replaced styles in Schemes.jsx');
} else {
    console.log('Target string not found in Schemes.jsx');
}
