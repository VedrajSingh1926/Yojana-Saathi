import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ScamShield() {
  const { lang, t } = useLanguage();
  const [text, setText] = useState('');
  const [report, setReport] = useState(null);

  const localizedScam = {
    en: {
      scanMessagesTitle: "Scan Messages & Links",
      scanMessagesDesc: "Paste messages asking for money, OTPs, or redirecting to fake websites.",
      scanPlaceholder: "Example: 'Congratulations! You have been selected for PM Yojana assistance. Click here to claim ₹50,000 immediately: http://pm-yojana-claims.net/pay...'",
      scanBtn: "Scan Message",
      loadSampleBtn: "Load Fake Message Sample",
      placeholderTitle: "Scam Shield Ready",
      placeholderDesc: "Results and threat intelligence assessment will appear here after scanning.",
      safetyTitle: "Safety Score Index",
      domainAuthority: "Domain Authority (NIC / GOV check)",
      paymentDemands: "No Payment / UPI Demands",
      urgencyIndex: "Linguistic Urgency Index",
      aiThreatTitle: "AI Threat Diagnostic:",
      threatFailMsg: "This message fails multiple government safety checks. Government welfare funds NEVER demand processing deposits or security transfers via UPI. Furthermore, the URL links lead to an unofficial server domain.",
      threatPassMsg: "No critical threat indicators matched. However, always ensure you only submit details to official websites ending in '.gov.in' or '.nic.in'.",
      recentThreats: "RECENT THREAT ALERTS",
      activeFraud: "Active Fraud Alerts",
      threatAlert1Title: "Fake PM Kisan Aadhaar OTP Requests",
      threatAlert1Desc: "Scammers posing as Agriculture Department officials are calling to \"update records\" and stealing bank OTPs. Official PM Kisan never calls for OTPs.",
      threatAlert2Title: "Phishing Site: 'pm-awas-subsidy.in'",
      threatAlert2Desc: "A replica portal asking applicants to transfer a \"security verification deposit\" of ₹2,500 via UPI. Government housing allocation is free.",
      threatAlert3Title: "Fake Free Laptop / Tablet Messages",
      threatAlert3Desc: "Viral forward links claiming the government is handing out laptops to students. Clicking installs malicious adware and signs up users for paid premium SMS services.",
      dangerVerdict: "DANGER: PHISHING FRAUD DETECTED",
      warningVerdict: "WARNING: SUSPICIOUS CONTENT",
      safeVerdict: "SAFE",
      realTimeDefense: "Real-time Welfare Defense",
      criticalBadge: "CRITICAL",
      highBadge: "HIGH"
    },
    hi: {
      scanMessagesTitle: "संदेश और लिंक स्कैन करें",
      scanMessagesDesc: "पैसे, ओटीपी मांगने वाले या नकली वेबसाइटों पर रीडायरेक्ट करने वाले संदेश पेस्ट करें।",
      scanPlaceholder: "उदाहरण: 'बधाई हो! आपको पीएम योजना सहायता के लिए चुना गया है। ₹50,000 तुरंत प्राप्त करने के लिए यहां क्लिक करें: http://pm-yojana-claims.net/pay...'",
      scanBtn: "संदेश स्कैन करें",
      loadSampleBtn: "नकली संदेश का नमूना लोड करें",
      placeholderTitle: "स्कैम शील्ड तैयार है",
      placeholderDesc: "स्कैन करने के बाद परिणाम और खतरे का आकलन यहां दिखाई देगा।",
      safetyTitle: "सुरक्षा स्कोर सूचकांक",
      domainAuthority: "डोमेन प्राधिकरण (NIC / GOV जांच)",
      paymentDemands: "कोई भुगतान / यूपीआई मांग नहीं",
      urgencyIndex: "भाषाई तात्कालिकता सूचकांक",
      aiThreatTitle: "एआई खतरा निदान:",
      threatFailMsg: "यह संदेश कई सरकारी सुरक्षा जांचों में विफल रहता है। सरकारी कल्याण कोष कभी भी यूपीआई के माध्यम से प्रसंस्करण जमा या सुरक्षा हस्तांतरण की मांग नहीं करते हैं। इसके अलावा, यूआरएल लिंक एक अनौपचारिक सर्वर डोमेन की ओर ले जाते हैं।",
      threatPassMsg: "कोई महत्वपूर्ण खतरा संकेतक नहीं मिला। हालांकि, हमेशा सुनिश्चित करें कि आप केवल '.gov.in' या '.nic.in' पर समाप्त होने वाली आधिकारिक वेबसाइटों पर ही विवरण जमा करें।",
      recentThreats: "हालिया खतरा अलर्ट",
      activeFraud: "सक्रिय धोखाधड़ी अलर्ट",
      threatAlert1Title: "फेक पीएम किसान आधार ओटीपी अनुरोध",
      threatAlert1Desc: "कृषि विभाग के अधिकारी बनकर स्कैमर 'रिकॉर्ड अपडेट' करने के लिए फोन कर रहे हैं और बैंक ओटीपी चुरा रहे हैं। आधिकारिक पीएम किसान कभी ओटीपी के लिए फोन नहीं करता है।",
      threatAlert2Title: "फ़िशिंग साइट: 'pm-awas-subsidy.in'",
      threatAlert2Desc: "एक रेप्लिका पोर्टल जो आवेदकों से यूपीआई के माध्यम से ₹2,500 का 'सुरक्षा सत्यापन जमा' स्थानांतरित करने के लिए कह रहा है। सरकारी आवास आवंटन मुफ़्त है।",
      threatAlert3Title: "नकली मुफ्त लैपटॉप / टैबलेट संदेश",
      threatAlert3Desc: "वायरल फॉरवर्ड लिंक दावा कर रहे हैं कि सरकार छात्रों को लैपटॉप दे रही है। क्लिक करने पर दुर्भावनापूर्ण एडवेयर इंस्टॉल हो जाता है और उपयोगकर्ता सशुल्क प्रीमियम एसएमएस सेवाओं के लिए साइन अप हो जाते हैं।",
      dangerVerdict: "खतरा: फ़िशिंग धोखाधड़ी का पता चला",
      warningVerdict: "चेतावनी: संदिग्ध सामग्री",
      safeVerdict: "सुरक्षित",
      realTimeDefense: "वास्तविक समय कल्याण सुरक्षा",
      criticalBadge: "गंभीर",
      highBadge: "उच्च"
    },
    ta: {
      scanMessagesTitle: "செய்திகள் & இணைப்புகளை ஸ்கேன் செய்யவும்",
      scanMessagesDesc: "பணம், OTP கேட்கும் அல்லது போலி வலைத்தளங்களுக்கு திருப்பிவிடும் செய்திகளை ஒட்டவும்.",
      scanPlaceholder: "உதாரணம்: 'வாழ்த்துகள்! நீங்கள் நல திட்ட உதவிக்கு தேர்வு செய்யப்பட்டுள்ளீர்கள். ₹50,000 பெற இங்கே கிளிக் செய்யவும்...'",
      scanBtn: "செய்தியை ஸ்கேன் செய்",
      loadSampleBtn: "போலி செய்தி மாதிரியை ஏற்று",
      placeholderTitle: "மோசடி காப்பு தயார்",
      placeholderDesc: "ஸ்கேன் செய்த பிறகு முடிவுகள் மற்றும் ஆபத்து மதிப்பீடு இங்கே தோன்றும்.",
      safetyTitle: "பாதுகாப்பு மதிப்பெண் குறியீடு",
      domainAuthority: "இணையதள அங்கீகாரம் (NIC / GOV சரிபார்ப்பு)",
      paymentDemands: "பணக் கோரிக்கைகள் இல்லை",
      urgencyIndex: "அவசரத்தன்மை குறியீடு",
      aiThreatTitle: "AI அச்சுறுத்தல் கண்டறிதல்:",
      threatFailMsg: "இந்த செய்தி பல அரசு பாதுகாப்பு சரிபார்ப்புகளில் தோல்வியடைகிறது. அரசாங்கம் ஒருபோதும் UPI மூலம் பணம் கேட்காது. உத்தியோகபூர்வமற்ற இணையதள முகவரிகள் இதில் உள்ளன.",
      threatPassMsg: "அச்சுறுத்தல் குறியீடுகள் எதுவும் இல்லை. இருப்பினும், இணையதளங்கள் '.gov.in' அல்லது '.nic.in' என முடிவடைவதை எப்போதும் உறுதிப்படுத்தவும்.",
      recentThreats: "சமீபத்திய அச்சுறுத்தல் விழிப்பூட்டல்கள்",
      activeFraud: "செயலில் உள்ள மோசடி விழிப்பூட்டல்கள்",
      threatAlert1Title: "போலி PM கிசான் ஆதார் OTP கோரிக்கைகள்",
      threatAlert1Desc: "விவசாயத் துறை அதிகாரிகள் போல நடித்து போலி அழைப்புகள் மூலம் OTP திருடப்படுகிறது. அரசு ஒருபோதும் OTP கேட்காது.",
      threatAlert2Title: "போலி இணையதளம்: 'pm-awas-subsidy.in'",
      threatAlert2Desc: "UPI மூலம் ₹2,500 பாதுகாப்பு வைப்புத்தொகை கேட்கும் போலி தளம். அரசு வீடு ஒதுக்கீடு முற்றிலும் இலவசம்.",
      threatAlert3Title: "போலி இலவச மடிக்கணினி செய்திகள்",
      threatAlert3Desc: "மாணவர்களுக்கு இலவச லேப்டாப் தருவதாக பரவும் போலி இணைப்புகள். இதை கிளிக் செய்வதால் ஆவணங்கள் திருடப்படலாம்.",
      dangerVerdict: "ஆபத்து: மோசடி கண்டறியப்பட்டது",
      warningVerdict: "எச்சரிக்கை: சந்தேகத்திற்குரிய உள்ளடக்கம்",
      safeVerdict: "பாதுகாப்பானது",
      realTimeDefense: "நல பாதுகாப்பு",
      criticalBadge: "முக்கியமானது",
      highBadge: "அதிக"
    },
    te: {
      scanMessagesTitle: "సందేశాలు & లింక్‌లను స్కాన్ చేయండి",
      scanMessagesDesc: "డబ్బులు, OTP అడిగే అనుమానాస్పద సందేశాలు లేదా లింకులను ఇక్కడ పేస్ట్ చేయండి.",
      scanPlaceholder: "ఉదాహరణ: 'అభినందనలు! మీరు పీఎం యోజన సహాయానికి ఎంపికయ్యారు. ₹50,000 పొందేందుకు ఇక్కడ క్లిక్ చేయండి...'",
      scanBtn: "సందేశాన్ని స్కాన్ చేయండి",
      loadSampleBtn: "నకిలీ సందేశం నమూనాను లోడ్ చేయండి",
      resultsPlaceholderTitle: "రక్షణ కవచం సిద్ధం",
      resultsPlaceholderDesc: "స్కాన్ చేసిన తర్వాత ఫలితాలు మరియు విశ్లేషణ నివేదిక ఇక్కడ కనిపిస్తాయి.",
      safetyTitle: "భద్రత స్కోరు సూచిక",
      domainAuthority: "డొమైన్ ప్రామాణికత (NIC / GOV తనిఖీ)",
      paymentDemands: "చెల్లింపు / యూపీఐ డిమాండ్లు లేవు",
      urgencyIndex: "భాషా అత్యవసర సూచిక",
      aiThreatTitle: "AI మోసాల విశ్లేషణ:",
      threatFailMsg: "ఈ సందేశం ప్రభుత్వ భద్రతా ప్రమాణాలను ఉల్లంఘిస్తోంది. ప్రభుత్వం ఎప్పుడూ UPI ద్వారా డబ్బులు లేదా డిపాజిట్లు అడగదు. అనధికారిక లింకులను క్లిక్ చేయవద్దు.",
      threatPassMsg: "ఎలాంటి ప్రమాదకర సంకేతాలు లేవు. అయినా, వెబ్‌సైట్ చిరునామా '.gov.in' లేదా '.nic.in' తో ముగుస్తుందో లేదో సరిచూసుకోండి.",
      recentThreats: "ఇటీవలి మోసాల అలర్ట్లు",
      activeFraud: "ప్రస్తుత మోసాల హెచ్చరికలు",
      threatAlert1Title: "నకిలీ పీఎం కిసాన్ ఆధార్ OTP అభ్యర్థనలు",
      threatAlert1Desc: "అధికారుల పేరుతో ఫోన్ చేసి ఓటీపీలను దొంగిలిస్తున్నారు. పీఎం కిసాన్ ఎప్పుడూ ఓటీపీ అడగదు.",
      threatAlert2Title: "నకిలీ సైట్: 'pm-awas-subsidy.in'",
      threatAlert2Desc: "యూపీఐ ద్వారా ₹2,500 డిపాజిట్ అడుగుతున్న నకిలీ పోర్టల్. గృహ కేటాయింపు ఉచితం.",
      threatAlert3Title: "నకిలీ ఉచిత లాప్‌టాప్ మెసేజ్‌లు",
      threatAlert3Desc: "ఉచితంగా లాప్‌టాప్‌లు ఇస్తున్నారంటూ వచ్చే లింకులను క్లిక్ చేయవద్దు. ఇవి వైరస్‌లను వ్యాప్తి చేస్తాయి.",
      dangerVerdict: "ప్రమాదం: మోసం కనుగొనబడింది",
      warningVerdict: "హెచ్చరిక: అనుమానాస్పద సమాచారం",
      safeVerdict: "సురక్షితం",
      realTimeDefense: "తక్షణ సంక్షేమ రక్షణ",
      criticalBadge: "తీవ్రమైన",
      highBadge: "ఎక్కువ"
    },
    bn: {
      scanMessagesTitle: "বার্তা ও লিঙ্ক স্ক্যান করুন",
      scanMessagesDesc: "টাকা, ওটিপি চাওয়া সন্দেহজনক বার্তা বা লিঙ্কগুলি এখানে পেস্ট করুন।",
      scanPlaceholder: "উদাহরণ: 'অভিনন্দন! আপনি পিএম যোজনা সহায়তার জন্য নির্বাচিত হয়েছেন। ₹৫০,০০০ পেতে এখানে ক্লিক করুন...'",
      scanBtn: "বার্তা স্ক্যান করুন",
      loadSampleBtn: "নকল বার্তার নমুনা লোড করুন",
      resultsPlaceholderTitle: "স্ক্যাম শিল্ড প্রস্তুত",
      resultsPlaceholderDesc: "স্ক্যান করার পর ফলাফল এবং হুমকির বিশ্লেষণ এখানে প্রদর্শিত হবে।",
      safetyTitle: "নিরাপত্তা স্কোর সূচক",
      domainAuthority: "ডোমেন সত্যতা যাচাই (NIC / GOV পরীক্ষা)",
      paymentDemands: "কোনো পেমেন্ট বা ইউপিআই দাবি নেই",
      urgencyIndex: "জরুরী বার্তা সূচক",
      aiThreatTitle: "AI হুমকি বিশ্লেষণ:",
      threatFailMsg: "এই বার্তাটি একাধিক সরকারি নিরাপত্তা পরীক্ষায় অনুত্তীর্ণ হয়েছে। সরকারি প্রকল্পগুলিতে কখনোই কোনো টাকা বা ইউপিআই আমানত চাওয়া হয় না। এই লিঙ্কগুলি ভুয়ো ডোমেনের দিকে নির্দেশ করছে।",
      threatPassMsg: "কোনো গুরুতর হুমকি পাওয়া যায়নি। তবে, যেকোনো বিবরণ জমা দেওয়ার আগে নিশ্চিত করুন যে সাইটের শেষে '.gov.in' বা '.nic.in' রয়েছে।",
      recentThreats: "সাম্প্রতিক হুমকি সতর্কবার্তা",
      activeFraud: "সক্রিয় ফ্রড অ্যালার্ট",
      threatAlert1Title: "ভুয়ো পিএম কিষাণ আধার ওটিপি অনুরোধ",
      threatAlert1Desc: "কৃষি দপ্তরের কর্মকর্তা সেজে স্ক্যামাররা কল করে ব্যাংক ওটিপি চুরি করছে। পিএম কিষাণ কখনোই কল করে ওটিপি চায় না।",
      threatAlert2Title: "ভুয়ো ওয়েবসাইট: 'pm-awas-subsidy.in'",
      threatAlert2Desc: "ইউপিআই এর মাধ্যমে ₹২,৫০০ নিরাপত্তা আমানত দাবি করা একটি নকল পোর্টাল। সরকারি আবাসন বণ্টন সম্পূর্ণ বিনামূল্যে করা হয়।",
      threatAlert3Title: "ভুয়ো ফ্রি ল্যাপটপ / ট্যাবলেট বার্তা",
      threatAlert3Desc: "ল্যাপটপ দেওয়ার ভুয়ো লিঙ্ক সোশ্যাল মিডিয়ায় ভাইরাল করা হয়েছে। এই লিঙ্কগুলিতে ক্লিক করলে ক্ষতিকারক অ্যাডওয়্যার ইনস্টল হতে পারে।",
      dangerVerdict: "বিপদ: ফিশিং জালিয়াতি সনাক্ত হয়েছে",
      warningVerdict: "সতর্কবার্তা: সন্দেহজনক কন্টেন্ট",
      safeVerdict: "নিরাপদ",
      realTimeDefense: "রিয়েল-টাইম কল্যাণ সুরক্ষা",
      criticalBadge: "গুরুতর",
      highBadge: "উচ্চ"
    }
  };

  const f = localizedScam[lang] || localizedScam.en;

  const sampleScam = "Urgently claim your PM Awas Yojana subsidy of Rs. 2,500 by paying a processing deposit via UPI to pm-awas-verify@upi immediately. Verify your card here: http://pm-awas-subsidy.in/claim";

  const handleLoadSample = () => {
    setText(sampleScam);
  };

  const handleScan = async () => {
    if (!text.trim()) {
      alert(lang === 'en' ? "Please paste a suspicious message first." : "कृपया पहले एक संदिग्ध संदेश पेस्ट करें।");
      return;
    }

    setReport({ loading: true });

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/ai/scam-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      
      if (data.success) {
        const { riskScore, category, reason, recommendation } = data.data;
        
        let verdictClass = 'color-success';
        let fillClass = 'bg-success';
        let localizedVerdict = t.safe || 'SAFE';

        if (riskScore > 80) {
          verdictClass = 'color-danger';
          fillClass = 'bg-danger';
          localizedVerdict = t.danger || 'DANGER';
        } else if (riskScore > 40) {
          verdictClass = 'color-warning';
          fillClass = 'bg-warning';
          localizedVerdict = t.warning || 'WARNING';
        }

        setReport({
          riskScore,
          category,
          verdict: localizedVerdict,
          verdictClass,
          fillClass,
          reason,
          recommendation
        });
      } else {
        alert("Failed to analyze message.");
        setReport(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Scam Shield API.");
      setReport(null);
    }
  };

  return (
    <div className="view-section animate-fade-in">
      <div className="scam-hero">
        <span className="pill-badge badge-warning"><ShieldAlert size={14} style={{ display: 'inline', marginRight: '4px' }} /> {f.realTimeDefense}</span>
        <h1>{t.scamTitle || "Yojana Scam Shield"}</h1>
        <p className="text-muted">{t.scamSubtitle || "Received a suspicious WhatsApp message, SMS, or link promising government funds? Paste it here. Our AI scans it to verify if it's official or a phishing trap."}</p>
      </div>

      <div className="scam-analyzer-grid">
        {/* Left Input */}
        <div className="glass-card scam-analyzer-card">
          <h3>{f.scanMessagesTitle}</h3>
          <p className="text-muted text-sm mb-4">{f.scanMessagesDesc}</p>
          
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={f.scanPlaceholder}
          />
          
          <div className="scam-actions">
            <button className="btn btn-primary" onClick={handleScan}>{f.scanBtn}</button>
            <button className="btn btn-text" onClick={handleLoadSample}>{f.loadSampleBtn}</button>
          </div>
        </div>

        {/* Right Output */}
        <div className="glass-card scam-results-card">
          {!report ? (
            <div className="scam-result-placeholder">
              <ShieldCheck className="text-cyan large-shield" size={48} style={{ margin: '0 auto 1rem' }} />
              <h3>{f.resultsPlaceholderTitle}</h3>
              <p className="text-muted text-sm">{f.placeholderDesc}</p>
            </div>
          ) : report.loading ? (
            <div className="scam-result-placeholder">
              <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
              <h3>Analyzing Threat...</h3>
              <p className="text-muted text-sm">Gemini is inspecting the message for fraud indicators.</p>
            </div>
          ) : (
            <div className="diagnostic-report w-full">
              <div className="safety-gauge-wrapper">
                <span className="safety-title">Danger Level</span>
                <div className={`safety-percent ${report.verdictClass}`}>{report.riskScore}%</div>
                <div className={`safety-verdict ${report.verdictClass}`}>{report.verdict}</div>
              </div>

              <div className="metric-bars">
                <div className="metric-row-item">
                  <div className="bar-header"><span>Category</span><span style={{textTransform: 'capitalize'}}>{report.category}</span></div>
                </div>
              </div>

              <div className="report-hints">
                <h4>AI Threat Diagnostic:</h4>
                <p className="text-xs text-secondary mt-1 mb-3">
                  {report.reason}
                </p>
                <h4>Recommendation:</h4>
                <p className="text-xs text-secondary mt-1">
                  {report.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fraud alerts board */}
      <section className="section-container">
        <div className="section-header text-center">
          <span className="section-tagline text-orange">RECENT THREAT ALERTS</span>
          <h2 className="section-title">Active Fraud Alerts</h2>
        </div>
        <div className="scam-threats-grid">
          <div className="threat-card card-danger">
            <div className="threat-header">
              <span className="threat-badge badge-danger">{f.criticalBadge}</span>
              <span className="threat-date">{lang === 'en' ? 'July 2026' : lang === 'hi' ? 'जुलाई 2026' : lang === 'ta' ? 'ஜூலை 2026' : lang === 'te' ? 'జూలై 2026' : 'জুলাই ২০২৬'}</span>
            </div>
            <h4>{f.threatAlert1Title}</h4>
            <p dangerouslySetInnerHTML={{ __html: f.threatAlert1Desc.replace('Official PM Kisan never calls for OTPs.', '<strong>Official PM Kisan never calls for OTPs.</strong>') }} />
          </div>
          <div className="threat-card card-warning">
            <div className="threat-header">
              <span className="threat-badge badge-warning">HIGH</span>
              <span className="threat-date">June 2026</span>
            </div>
            <h4>{f.threatAlert2Title}</h4>
            <p dangerouslySetInnerHTML={{ __html: f.threatAlert2Desc.replace('Government housing allocation is free.', '<strong>Government housing allocation is free.</strong>') }} />
          </div>
          <div className="threat-card card-warning">
            <div className="threat-header">
              <span className="threat-badge badge-warning">HIGH</span>
              <span className="threat-date">June 2026</span>
            </div>
            <h4>{f.threatAlert3Title}</h4>
            <p>{f.threatAlert3Desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
