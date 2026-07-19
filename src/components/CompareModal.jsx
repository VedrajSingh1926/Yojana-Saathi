import React from 'react';
import { X, CheckCircle, Scale, BrainCircuit, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SCHEMES_DB } from '../data/schemes';

export default function CompareModal({ isOpen, onClose, compareList, onNavigateToPlanner, lang }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const selectedSchemes = compareList.map(id => SCHEMES_DB.find(s => s.id === id)).filter(Boolean);

  const hasPMAwas = compareList.includes("pm-awas");
  const hasMukhAwas = compareList.includes("mukhya-awas");
  
  let claimAdvice = "All selected schemes can be claimed concurrently if eligibility criteria is satisfied.";
  let recommendation = "Apply for central benefits first as their cash-pool is larger.";

  if (hasPMAwas && hasMukhAwas) {
    claimAdvice = "⚠️ Housing Exclusivity Warning: You CANNOT claim both PM Awas and State Mukhyamantri Awas. Only one housing subsidy is allowed per household.";
    recommendation = "PM Awas offers higher assistance (up to ₹2.5L urban / ₹1.2L rural) compared to Mukhyamantri Awas (up to ₹2.0L). We recommend applying for PM Awas first.";
  }

  // Basic translation mapping for comparison advice
  const localizedAdviceMap = {
    hi: {
      defaultAdvice: "यदि पात्रता मानदंड पूरा होता है तो सभी चयनित योजनाओं का दावा एक साथ किया जा सकता है।",
      defaultRec: "पहले केंद्रीय लाभों के लिए आवेदन करें क्योंकि उनका नकद पूल बड़ा है।",
      exclusivityWarning: "⚠️ आवास विशिष्टता चेतावनी: आप पीएम आवास और राज्य मुख्यमंत्री आवास दोनों का दावा नहीं कर सकते। प्रति परिवार केवल एक आवास सब्सिडी की अनुमति है।",
      exclusivityRec: "पीएम आवास अधिक सहायता प्रदान करता है (₹2.5L शहरी / ₹1.2L ग्रामीण तक) मुख्यमंत्री आवास की तुलना में (₹2.0L तक)। हम पहले पीएम आवास के लिए आवेदन करने की सलाह देते हैं।"
    },
    ta: {
      defaultAdvice: "தகுதி வரம்புகள் பூர்த்தி செய்யப்பட்டால் தேர்ந்தெடுக்கப்பட்ட அனைத்து திட்டங்களையும் ஒரே நேரத்தில் கோரலாம்.",
      defaultRec: "மத்திய அரசு திட்டங்களுக்கு முதலில் விண்ணப்பிக்கவும்.",
      exclusivityWarning: "⚠️ வீடமைப்பு எச்சரிக்கை: நீங்கள் PM அவாஸ் மற்றும் மாநில முதலமைச்சர் அவாஸ் இரண்டையும் கோர முடியாது. ஒரு குடும்பத்திற்கு ஒரு வீட்டு மானியம் மட்டுமே அனுமதிக்கப்படுகிறது.",
      exclusivityRec: "PM அவாஸ் அதிக உதவியை வழங்குகிறது. முதலில் PM அவாஸ் திட்டத்திற்கு விண்ணப்பிக்க பரிந்துரைக்கிறோம்."
    },
    te: {
      defaultAdvice: "అర్హత ప్రమాణాలు పూర్తయితే ఎంచుకున్న అన్ని పథకాలను ఒకేసారి పొందవచ్చు.",
      defaultRec: "కేంద్ర ప్రభుత్వ పథకాలకు ముందుగా దరఖాస్తు చేసుకోండి.",
      exclusivityWarning: "⚠️ గృహ నిర్మాణ హెచ్చరిక: మీరు PM ఆవాస్ మరియు రాష్ట్ర ముఖ్యమంత్రి ఆవాస్ రెండింటినీ పొందలేరు. కుటుంబానికి ఒకే ఇల్లు రాయితీ అనుమతించబడుతుంది.",
      exclusivityRec: "PM ఆవాస్ ఎక్కువ సహాయాన్ని అందిస్తుంది. ముందుగా PM ఆవాస్ దరఖాస్తు చేసుకోవాలని సిఫార్సు చేస్తున్నాము."
    },
    bn: {
      defaultAdvice: "যোগ্যতার মানদণ্ড পূরণ হলে নির্বাচিত সমস্ত স্কিম একসাথে দাবি করা যেতে পারে।",
      defaultRec: "প্রথমে কেন্দ্রীয় প্রকল্পগুলির জন্য আবেদন করুন কারণ তাদের তহবিল বেশি।",
      exclusivityWarning: "⚠️ আবাসন সংক্রান্ত সতর্কবার্তা: আপনি পিএম আবাস এবং রাজ্য মুখ্যমন্ত্রী আবাস উভয়ই দাবি করতে পারবেন না। পরিবার প্রতি একটিই আবাসন ভর্তুকি প্রযোজ্য।",
      exclusivityRec: "মুখ্যমন্ত্রী আবাসের তুলনায় পিএম আবাস বেশি সাহায্য প্রদান করে। আমরা প্রথমে পিএম আবাস আবেদন করার পরামর্শ দিই।"
    }
  };

  const currentAdvice = localizedAdviceMap[lang] || {
    defaultAdvice: claimAdvice,
    defaultRec: recommendation,
    exclusivityWarning: claimAdvice,
    exclusivityRec: recommendation
  };

  const displayAdvice = (hasPMAwas && hasMukhAwas)
    ? (localizedAdviceMap[lang]?.exclusivityWarning || claimAdvice)
    : (localizedAdviceMap[lang]?.defaultAdvice || claimAdvice);

  const displayRec = (hasPMAwas && hasMukhAwas)
    ? (localizedAdviceMap[lang]?.exclusivityRec || recommendation)
    : (localizedAdviceMap[lang]?.defaultRec || recommendation);

  const handleOpenInPlanner = () => {
    const names = selectedSchemes.map(s => s.name.en || s.name);
    onNavigateToPlanner(`Compare ${names.join(" vs ")} for my family. Which one should I claim first?`);
    onClose();
  };

  const titleMap = { en: "Scheme Comparison", hi: "योजना तुलना", ta: "திட்ட ஒப்பீடு", te: "పథకాల పోలిక", bn: "স্কিম তুলনা" };
  const assessmentMap = { en: "AI Co-claim Compatibility Assessment", hi: "एआई सह-दावा संगतता मूल्यांकन", ta: "AI பொருந்தக்கூடிய மதிப்பீடு", te: "AI అనుకూలత అంచనా", bn: "AI সামঞ্জস্য মূল্যায়ন" };
  const strategyMap = { en: "Recommended Strategy", hi: "अनुशंसित रणनीति", ta: "பரிந்துரைக்கப்பட்ட உத்தி", te: "సిఫార్సు చేసిన వ్యూహం", bn: "প্রস্তাবিত কৌশল" };
  
  const headersMap = {
    benefit: { en: "Estimated Benefit", hi: "अनुमानित लाभ", ta: "மதிப்பிடப்பட்ட பலன்", te: "అంచనా ప్రయోజనం", bn: "আনুমানিক সুবিধা" },
    focus: { en: "Target Focus", hi: "लक्षित फोकस", ta: "இலக்கு கவனம்", te: "లక్ష్య విభాగం", bn: "মূল লক্ষ্য" },
    income: { en: "Required Monthly Income", hi: "आवश्यक मासिक आय", ta: "தேவைப்படும் மாதாந்திர வருமானம்", te: "కావలసిన నెలవారీ ఆదాయం", bn: "প্রয়োজনীয় মাসিক আয়" },
    processing: { en: "Processing Time", hi: "प्रसंस्करण समय", ta: "செயலாக்க நேரம்", te: "ప్రాసెస్ సమయం", bn: "প্রক্রিয়াকরণ সময়" },
    documents: { en: "Required Core Documents", hi: "आवश्यक मुख्य दस्तावेज़", ta: "தேவையான முக்கிய ஆவணங்கள்", te: "కావలసిన పత్రాలు", bn: "প্রয়োজনীয় নথিপত্র" },
    score: { en: "AI Match Confidence", hi: "एआई मिलान आत्मविश्वास", ta: "AI பொருத்த நம்பிக்கை", te: "AI మ్యాచ్ స్కోరు", bn: "AI ম্যাচের গুণমান" },
    closeBtn: { en: "Close Comparison", hi: "तुलना बंद करें", ta: "ஒப்பீட்டை மூடு", te: "పోలిక మూసివేయి", bn: "তুলনা বন্ধ করুন" },
    plannerBtn: { en: "Open in AI Planner", hi: "एआई प्लानर में खोलें", ta: "AI திட்டமிடலில் திறக்கவும்", te: "AI ప్లానర్‌లో తెరువు", bn: "AI প্ল্যানারে খুলুন" }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><Scale size={20} className="text-gold" style={{ display: 'inline', marginRight: '8px' }} /> {titleMap[lang] || titleMap.en}</h2>
          <button className="close-modal" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          {/* AI Advisor Card */}
          <div className="glass-card mb-4" style={{ borderColor: 'var(--primary)' }}>
            <h3 className="text-gold mb-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} /> {assessmentMap[lang] || assessmentMap.en}
            </h3>
            <p className="mb-2">{displayAdvice}</p>
            <p className="text-sm"><strong>{strategyMap[lang] || strategyMap.en}:</strong> {displayRec}</p>
          </div>

          {/* Grid Columns */}
          <div className="comparison-grid">
            {selectedSchemes.map(s => (
              <div key={s.id} className={`comparison-column ${s.type === 'Central' ? 'head-column' : ''}`}>
                <div className="comp-scheme-header">
                  <h3>{s.emoji} {s.name[lang] || s.name.en || s.name}</h3>
                  <span className={`badge ${s.type === 'Central' ? 'badge-type-central' : 'badge-type-state'}`}>
                    {s.type} Gov
                  </span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">{headersMap.benefit[lang] || headersMap.benefit.en}</span>
                  <strong className="comp-value text-gold">{s.benefit[lang] || s.benefit.en || s.benefit}</strong>
                </div>

                <div className="comp-row">
                  <span className="comp-label">{headersMap.focus[lang] || headersMap.focus.en}</span>
                  <span className="comp-value">{s.category[lang] || s.category.en || s.category} Assistance</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">{headersMap.income[lang] || headersMap.income.en}</span>
                  <span className="comp-value">{s.id === 'scholarship' ? 'Under ₹2.5L/year' : 'Under ₹3.0L/year'}</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">{headersMap.processing[lang] || headersMap.processing.en}</span>
                  <span className="comp-value">2 - 4 Weeks</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">{headersMap.documents[lang] || headersMap.documents.en}</span>
                  <span className="comp-value">{(s.docs[lang] || s.docs.en || s.docs || []).map(d => d.name).join(', ')}</span>
                </div>

                <div className="comp-row">
                  <span className="comp-label">{headersMap.score[lang] || headersMap.score.en}</span>
                  <span className="comp-value text-cyan">{s.ai_score[lang] || s.ai_score.en || s.ai_score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>{headersMap.closeBtn[lang] || headersMap.closeBtn.en}</button>
          {lang === 'en' && (
            <button className="btn btn-primary" onClick={handleOpenInPlanner}>
              <Sparkles size={16} /> {headersMap.plannerBtn[lang] || headersMap.plannerBtn.en}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
