const fs = require('fs');

let c = fs.readFileSync('src/pages/Schemes.jsx', 'utf8');
const lines = c.split('\n');

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

// Lines 198 to 221
lines.splice(198, 24, replacement);

fs.writeFileSync('src/pages/Schemes.jsx', lines.join('\n'));
console.log('Fixed Schemes.jsx buttons');
