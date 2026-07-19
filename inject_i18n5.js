import fs from 'fs';
import path from 'path';

const keysToAdd = {
  brandDesc: { en: "India's AI Welfare Operating System", hi: "भारत का एआई कल्याण ऑपरेटिंग सिस्टम", ta: "இந்தியாவின் ஏஐ நல ஆப்பரேட்டிங் சிஸ்டம்", te: "భారతదేశ AI సంక్షేమ ఆపరేటింగ్ సిస్టమ్", bn: "ভারতের এআই ওয়েলফেয়ার অপারেটিং সিস্টেম" },
  product: { en: "Product", hi: "उत्पाद", ta: "தயாரிப்பு", te: "ఉత్పత్తి", bn: "পণ্য" },
  resources: { en: "Resources", hi: "संसाधन", ta: "வளங்கள்", te: "వనరులు", bn: "সম্পদ" },
  community: { en: "Community", hi: "समुदाय", ta: "சமூகம்", te: "సంఘం", bn: "সম্প্রদায়" },
  about: { en: "About", hi: "हमारे बारे में", ta: "பற்றி", te: "గురించి", bn: "আমাদের সম্পর্কে" },
  privacy: { en: "Privacy", hi: "गोपनीयता", ta: "தனியுரிமை", te: "గోప్యత", bn: "গোপনীয়তা" },
  terms: { en: "Terms", hi: "शर्तें", ta: "விதிமுறைகள்", te: "నిబంధనలు", bn: "শর্তাবলী" },
  contact: { en: "Contact", hi: "संपर्क करें", ta: "தொடர்பு", te: "సంప్రదించండి", bn: "যোগাযোগ করুন" },
  github: { en: "GitHub", hi: "गिटहब", ta: "கிட்ஹப்", te: "గిట్‌హబ్", bn: "গিটহাব" },
  reportIssue: { en: "Report Issue", hi: "समस्या की रिपोर्ट करें", ta: "சிக்கலைப் புகாரளி", te: "సమస్యను నివేదించండి", bn: "সমস্যা রিপোর্ট করুন" },
  linkedin: { en: "LinkedIn", hi: "लिंक्डइन", ta: "லிங்க்ட்இன்", te: "లింక్డ్ఇన్", bn: "লিংকডইন" },
  ctaReady: { en: "Ready to discover your eligible schemes?", hi: "क्या आप अपनी योग्य योजनाओं की खोज के लिए तैयार हैं?", ta: "உங்களுக்கு தகுதியான திட்டங்களைக் கண்டறியத் தயாரா?", te: "మీకు అర్హత ఉన్న పథకాలను కనుగొనడానికి సిద్ధంగా ఉన్నారా?", bn: "আপনার যোগ্য স্কিমগুলি আবিষ্কার করতে প্রস্তুত?" },
  ctaCreateProfile: { en: "Create Free Profile", hi: "मुफ्त प्रोफ़ाइल बनाएँ", ta: "இலவச சுயவிவரத்தை உருவாக்கவும்", te: "ఉచిత ప్రొఫైల్‌ను సృష్టించండి", bn: "ফ্রি প্রোফাইল তৈরি করুন" },
  ctaMinutes: { en: "It only takes 2 minutes.", hi: "इसमें केवल 2 मिनट लगते हैं।", ta: "இதற்கு 2 நிமிடங்கள் மட்டுமே ஆகும்.", te: "దీనికి కేవలం 2 నిమిషాలు మాత్రమే పడుతుంది.", bn: "এতে মাত্র 2 মিনিট সময় লাগে।" },
  madeWithLove: { en: "Made with ❤️ for India", hi: "भारत के लिए ❤️ से बना", ta: "இந்தியாவுக்காக ❤️ உடன் உருவாக்கப்பட்டது", te: "భారతదేశం కోసం ❤️ తో తయారు చేయబడింది", bn: "ভারতের জন্য ❤️ দিয়ে তৈরি" },
  prototypeNoticeTitle: { en: "Prototype Demonstration", hi: "प्रोटोटाइप प्रदर्शन", ta: "மாதிரி செயல் விளக்கம்", te: "నమూనా ప్రదర్శన", bn: "প্রোটোটাইপ প্রদর্শন" },
  prototypeNoticeDesc: { en: "This is a simulated Government Application Form created for the hackathon demo. It demonstrates how Yojana Saathi's AI can understand government forms, guide users field-by-field, detect common mistakes, and auto-fill information using verified citizen data. The production version will integrate with official government portals and APIs wherever permitted.", hi: "यह एक सिम्युलेटेड सरकारी आवेदन पत्र है जो हैकथॉन डेमो के लिए बनाया गया है। यह दर्शाता है कि कैसे योजना साथी का एआई सरकारी फॉर्म को समझ सकता है, उपयोगकर्ताओं को क्षेत्र-दर-क्षेत्र निर्देशित कर सकता है, सामान्य गलतियों का पता लगा सकता है, और सत्यापित नागरिक डेटा का उपयोग करके जानकारी को स्वत: भर सकता है।", ta: "இது ஹேக்கத்தான் டெமோவிற்காக உருவாக்கப்பட்ட ஒரு மாதிரி அரசு விண்ணப்ப படிவம். யோஜனா சாதியின் AI எவ்வாறு அரசாங்க படிவங்களைப் புரிந்து கொள்ளும் என்பதை இது விளக்குகிறது.", te: "ఇది హ్యాకథాన్ డెమో కోసం సృష్టించబడిన అనుకరణ ప్రభుత్వ దరఖాస్తు ఫారం. యోజనా సాథీ AI ప్రభుత్వ ఫారాలను ఎలా అర్థం చేసుకోగలదో ఇది ప్రదర్శిస్తుంది.", bn: "এটি হ্যাকাথন ডেমোর জন্য তৈরি একটি সিমুলেটেড সরকারি আবেদনপত্র। এটি প্রদর্শন করে কীভাবে যোজনা সাথীর এআই সরকারি ফর্মগুলি বুঝতে পারে।" },
  home: { en: "Home", hi: "होम", ta: "முகப்பு", te: "హోమ్", bn: "হোম" },
  planner: { en: "Planner", hi: "योजनाकार", ta: "திட்டமிடுபவர்", te: "ప్లానర్", bn: "পরিকল্পনাকারী" },
  schemes: { en: "Schemes", hi: "योजनाएं", ta: "திட்டங்கள்", te: "పథకాలు", bn: "স্কিম" },
  family: { en: "Family", hi: "परिवार", ta: "குடும்பம்", te: "కుటుంబం", bn: "পরিবার" },
  scamShield: { en: "Scam Shield", hi: "स्कैम शील्ड", ta: "மோசடி காப்பு", te: "స్కామ్ షీల్డ్", bn: "স্ক্যাম শিল্ড" }
};

const langs = ['en', 'hi', 'ta', 'te', 'bn'];
const dir = 'src/i18n';

langs.forEach(lang => {
  const filePath = path.join(dir, `${lang}.js`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let additions = '\n  // Added dynamically 5\n';
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
