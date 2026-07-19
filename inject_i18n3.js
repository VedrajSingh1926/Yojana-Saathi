import fs from 'fs';
import path from 'path';

const keysToAdd = {
  // GovFormAssistant Missing
  exitPortal: { en: "Exit Portal Simulation", hi: "पोर्टल सिमुलेशन से बाहर निकलें", ta: "போர்டல் சிமுலேஷனிலிருந்து வெளியேறு", te: "పోర్టల్ అనుకరణ నుండి నిష్క్రమించండి", bn: "পোর্টাল সিমুলেশন থেকে প্রস্থান করুন" },
  nationalWelfarePortal: { en: "National Welfare Portal", hi: "राष्ट्रीय कल्याण पोर्टल", ta: "தேசிய நலத்திட்ட போர்டல்", te: "జాతీయ సంక్షేమ పోర్టల్", bn: "জাতীয় কল্যাণ পোর্টাল" },
  officialGovForm: { en: "Official Government of India Application Form", hi: "भारत सरकार का आधिकारिक आवेदन पत्र", ta: "அதிகாரப்பூர்வ இந்திய அரசு விண்ணப்ப படிவம்", te: "అధికారిక భారత ప్రభుత్వ దరఖాస్తు ఫారం", bn: "সরকারি ভারত সরকার আবেদন ফর্ম" },
  aadhaarNum: { en: "1. Aadhaar Number (UID)", hi: "1. आधार नंबर (यूआईडी)", ta: "1. ஆதார் எண் (யுஐடி)", te: "1. ఆధార్ సంఖ్య (UID)", bn: "১. আধার নম্বর (UID)" },
  panNum: { en: "2. Permanent Account Number (PAN)", hi: "2. स्थायी खाता संख्या (पैन)", ta: "2. நிரந்தர கணக்கு எண் (பான்)", te: "2. పర్మనెంట్ అకౌంట్ నంబర్ (PAN)", bn: "২. স্থায়ী অ্যাকাউন্ট নম্বর (প্যান)" },
  annualIncome: { en: "3. Declared Annual Income (in INR)", hi: "3. घोषित वार्षिक आय (रुपये में)", ta: "3. அறிவிக்கப்பட்ட ஆண்டு வருமானம் (INR இல்)", te: "3. ప్రకటించిన వార్షిక ఆదాయం (INR లో)", bn: "৩. ঘোষিত বার্ষিক আয় (টাকায়)" },
  bankAccDbt: { en: "4. Bank Account Number for DBT", hi: "4. डीबीटी के लिए बैंक खाता संख्या", ta: "4. DBT க்கான வங்கி கணக்கு எண்", te: "4. DBT కోసం బ్యాంక్ ఖాతా సంఖ్య", bn: "৪. ডিবিটি এর জন্য ব্যাংক অ্যাকাউন্ট নম্বর" },
  resetForm: { en: "Reset", hi: "रीसेट", ta: "மீட்டமை", te: "రీసెట్ చేయండి", bn: "রিসেট" },
  submitApp: { en: "Submit Application", hi: "आवेदन जमा करें", ta: "விண்ணப்பத்தை சமர்ப்பிக்கவும்", te: "దరఖాస్తును సమర్పించండి", bn: "আবেদন জমা দিন" },
  warningFalseInfo: { en: "Warning: Providing false information is a punishable offense under the IT Act. Please ensure all details match your official documents.", hi: "चेतावनी: आईटी अधिनियम के तहत झूठी जानकारी प्रदान करना एक दंडनीय अपराध है। कृपया सुनिश्चित करें कि सभी विवरण आपके आधिकारिक दस्तावेजों से मेल खाते हैं।", ta: "எச்சரிக்கை: IT சட்டத்தின் கீழ் தவறான தகவல்களை வழங்குவது தண்டனைக்குரிய குற்றமாகும். உங்கள் அதிகாரப்பூர்வ ஆவணங்களுடன் அனைத்து விவரங்களும் பொருந்துகின்றனவா என்பதை உறுதிப்படுத்தவும்.", te: "హెచ్చరిక: IT చట్టం కింద తప్పుడు సమాచారం అందించడం శిక్షార్హమైన నేరం. దయచేసి అన్ని వివరాలు మీ అధికారిక పత్రాలతో సరిపోలుతున్నాయని నిర్ధారించుకోండి.", bn: "সতর্কতা: তথ্য প্রযুক্তি আইনের অধীনে মিথ্যা তথ্য প্রদান করা একটি শাস্তিযোগ্য অপরাধ। অনুগ্রহ করে নিশ্চিত করুন যে সমস্ত বিবরণ আপনার অফিসিয়াল নথির সাথে মেলে।" },
  assistantTitle: { en: "Yojana Saathi Assistant", hi: "योजना साथी सहायक", ta: "யோஜனா சாதி உதவியாளர்", te: "యోજના సాథీ అసిస్టెంట్", bn: "যোজনা সাথী সহকারী" },
  activePortal: { en: "Active on Gov Portal", hi: "सरकारी पोर्टल पर सक्रिय", ta: "அரசு போர்ட்டலில் செயலில் உள்ளது", te: "ప్రభుత్వ పోర్టల్‌లో యాక్టివ్‌గా ఉంది", bn: "সরকারি পোর্টালে সক্রিয়" },
  enterAadhaar: { en: "Enter 12 digit Aadhaar", hi: "12 अंकों का आधार दर्ज करें", ta: "12 இலக்க ஆதாரை உள்ளிடவும்", te: "12 అంకెల ఆధార్‌ను నమోదు చేయండి", bn: "১২ ডিজিটের আধার লিখুন" },
  enterPan: { en: "Enter 10 character PAN", hi: "10 वर्णों का पैन दर्ज करें", ta: "10 எழுத்துகளைக் கொண்ட பானை உள்ளிடவும்", te: "10 అక్షరాల PAN ను నమోదు చేయండి", bn: "১০ অক্ষরের প্যান লিখুন" },
  enterAcc: { en: "Enter Account Number", hi: "खाता संख्या दर्ज करें", ta: "கணக்கு எண்ணை உள்ளிடவும்", te: "ఖాతా సంఖ్యను నమోదు చేయండి", bn: "অ্যাকাউন্ট নম্বর লিখুন" }
};

const langs = ['en', 'hi', 'ta', 'te', 'bn'];
const dir = 'src/i18n';

langs.forEach(lang => {
  const filePath = path.join(dir, `${lang}.js`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let additions = '\n  // Added dynamically 3\n';
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
