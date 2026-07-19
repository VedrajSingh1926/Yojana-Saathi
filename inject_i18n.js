import fs from 'fs';
import path from 'path';

const keysToAdd = {
  findNearbyCsc: { en: "Find Nearby CSC", hi: "निकटतम सीएससी खोजें", ta: "அருகிலுள்ள சிஎஸ்சி-யைக் கண்டறிக", te: "సమీప CSC కనుగొనండి", bn: "নিকটবর্তী সিএসসি খুঁজুন" },
  clear: { en: "Clear", hi: "साफ़ करें", ta: "அழி", te: "క్లియర్", bn: "মুছুন" },
  centralGov: { en: "Central Gov", hi: "केंद्र सरकार", ta: "மத்திய அரசு", te: "కేంద్ర ప్రభుత్వం", bn: "কেন্দ্রীয় সরকার" },
  stateGov: { en: "State Gov", hi: "राज्य सरकार", ta: "மாநில அரசு", te: "రాష్ట్ర ప్రభుత్వం", bn: "রাজ্য সরকার" },
  stateSelection: { en: "State Selection", hi: "राज्य का चयन", ta: "மாநில தேர்வு", te: "రాష్ట్ర ఎంపిక", bn: "রাজ্য নির্বাচন" },
  centralBadge: { en: "🟢 Central Government", hi: "🟢 केंद्र सरकार", ta: "🟢 மத்திய அரசு", te: "🟢 కేంద్ర ప్రభుత్వం", bn: "🟢 কেন্দ্রীয় সরকার" },
  stateBadgeSuffix: { en: "Government", hi: "सरकार", ta: "அரசு", te: "ప్రభుత్వం", bn: "সরকার" },
  tabRecentlyUpdated: { en: "Recently Updated", hi: "हाल ही में अपडेट किया गया", ta: "சமீபத்தில் புதுப்பிக்கப்பட்டது", te: "ఇటీవల నవీకరించబడింది", bn: "সম্প্রতি আপডেট করা হয়েছে" },
  tabMostApplied: { en: "Most Applied", hi: "सबसे अधिक आवेदन", ta: "அதிகமாக விண்ணப்பிக்கப்பட்டவை", te: "అత్యధికంగా దరఖాస్తు చేయబడింది", bn: "সবচেয়ে বেশি আবেদন করা হয়েছে" },
  tabDeadlineSoon: { en: "Deadline Soon", hi: "अंतिम तिथि जल्द", ta: "காலக்கெடு விரைவில்", te: "గడువు త్వరలో", bn: "শীঘ্রই শেষ তারিখ" },
  tabNewLaunch: { en: "New Launch", hi: "नया लॉन्च", ta: "புதிய வெளியீடு", te: "కొత్త ప్రారంభం", bn: "নতুন লঞ্চ" },
  
  Startup: { en: "Startup", hi: "स्टार्टअप", ta: "ஸ்டார்ட்அப்", te: "స్టార్టప్", bn: "স্টার্টআপ" },
  PMAwas: { en: "PM Awas", hi: "पीएम आवास", ta: "பிஎம் அவாஸ்", te: "పిఎం ఆవాస్", bn: "প্রধানমন্ত্রী আবাস" },
  PMKisan: { en: "PM Kisan", hi: "पीएम किसान", ta: "பிஎம் கிசான்", te: "పిఎం కిసాన్", bn: "প্রধানমন্ত্রী কিষাণ" },
  Scholarship: { en: "Scholarship", hi: "छात्रवृत्ति", ta: "கல்வி உதவித்தொகை", te: "స్కాలర్‌షిప్", bn: "বৃত্তি" }
};

const langs = ['en', 'hi', 'ta', 'te', 'bn'];
const dir = 'src/i18n';

langs.forEach(lang => {
  const filePath = path.join(dir, `${lang}.js`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // check where to inject - before the closing brace
  let additions = '\n  // Added dynamically\n';
  for (const [key, valObj] of Object.entries(keysToAdd)) {
    if (!content.includes(`${key}:`)) {
      additions += `  ${key}: "${valObj[lang]}",\n`;
    }
  }
  
  if (additions.length > 30) {
    // Replace last closing brace
    content = content.replace(/};?\s*$/, additions + '};\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${lang}.js`);
  }
});
