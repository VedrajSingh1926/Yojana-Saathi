export const SCHEMES_DB = [
  {
    id: "pm-awas",
    name: "PM Awas Yojana (PMAY)",
    emoji: "🏠",
    benefit: "₹1.2L–2.5L Assistance",
    type: "Central",
    category: "Housing",
    description: "Affordable housing program for rural and urban low-income families.",
    purpose: "To provide pukka houses with basic amenities to all eligible urban and rural households who are currently homeless or living in dilapidated houses.",
    benefits_detail: "Financial assistance of ₹1.2 Lakhs in plains and ₹1.3 Lakhs in hilly/difficult areas for rural housing. Urban housing provides interest subsidy of up to 6.5% on home loans.",
    who_can_apply: "Families without a brick house anywhere in India. Annual household income must be under ₹3 Lakhs (for EWS) or ₹6 Lakhs (for LIG).",
    timeline: [
      "Online Application registration on PMAY Portal.",
      "Local Gram Panchayat or Municipal verification.",
      "Geotagging of land/construction stage updates.",
      "Direct Benefit Transfer (DBT) of funds in 3 installments."
    ],
    ai_score: "98% Match",
    eligibility: [
      { name: "Annual household income < ₹3,00,000", match: true },
      { name: "Must not own brick house in India", match: true },
      { name: "Possess valid Aadhaar Card", match: true },
      { name: "Valid Income Certificate", match: true }
    ],
    docs: [
      { name: "Aadhaar Card", desc: "For biometric verification of all members." },
      { name: "Income Certificate", desc: "Issued by authorized state revenue officer." },
      { name: "Bank Passbook", desc: "Linked with Aadhaar for direct cash transfers." },
      { name: "Land Registry Copy", desc: "Proof of site ownership or housing plot." }
    ],
    faqs: [
      { q: "Can I apply if my father owns a brick house?", a: "No, if any direct member of the family household unit owns a brick house in India, the household is not eligible." },
      { q: "Are there any application fees?", a: "Absolutely not. The government allocation process is completely free. Beware of middleman scams charging commissions." }
    ],
    ai_summaries: {
      en: "PMAY is a central government grant that provides up to ₹2.5 Lakhs to build or buy a brick house. It is fully subsidized, and funds are paid directly to your bank account based on construct stages. It is highly recommended if you currently live in a rent or mud house.",
      hi: "पीएम आवास योजना एक केंद्रीय योजना है जो पक्का घर बनाने के लिए ₹2.5 लाख तक की सहायता देती है। राशि सीधे लाभार्थी के बैंक खाते में निर्माण चरणों के आधार पर भेजी जाती है। यदि आप कच्चे मकान में रहते हैं तो यह आपके लिए सर्वोत्तम है।",
      ta: "பிஎம் அவாஸ் யோஜனா என்பது ஏழை குடும்பங்களுக்கு சொந்தமாக வீடு கட்ட ₹2.5 லட்சம் வரை நிதியுதவி வழங்கும் திட்டமாகும். கட்டுமான நிலைகளின் அடிப்படையில் நேரடியாக வங்கி கணக்கில் பணம் செலுத்தப்படும்."
    },
    official_url: "https://pmaymis.gov.in"
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    emoji: "🌾",
    benefit: "₹6,000/year Cash",
    type: "Central",
    category: "Farmer",
    description: "Direct income support of ₹6000 per year paid in three equal installments.",
    purpose: "To supplement the financial needs of landholding farmers in procuring inputs like seeds, fertilizers, and equipment.",
    benefits_detail: "Direct cash transfer of ₹6,00,0 per year, delivered in three equal installments of ₹2,000 every 4 months directly to linked bank accounts.",
    who_can_apply: "All small and marginal landholding farmer families who own cultivable land in their names.",
    timeline: [
      "Self-registration via PM Kisan Portal or CSC center.",
      "Land record validation by State Nodal Officer.",
      "District Level Beneficiary approval.",
      "DBT payment transfer on national release dates."
    ],
    ai_score: "95% Match",
    eligibility: [
      { name: "Cultivable land ownership records", match: true },
      { name: "Must be active farmer", match: true },
      { name: "Aadhaar e-KYC completed", match: true },
      { name: "Excluded: Institutional landholders", match: false }
    ],
    docs: [
      { name: "Aadhaar Card", desc: "Must be linked to the mobile number." },
      { name: "Land Ownership Papers (Khasra)", desc: "Showing clear registry under the applicant's name." },
      { name: "Bank Account Passbook", desc: "Must be Aadhaar seeded for DBT transfers." }
    ],
    faqs: [
      { q: "Is there a land limit to apply?", a: "No, the landholding limit of 2 hectares has been removed. All landholder farmer families are eligible now." },
      { q: "What is Aadhaar e-KYC?", a: "It is a mandatory digital verification step. You can complete it online using mobile OTP or via biometric scans at CSC centers." }
    ],
    ai_summaries: {
      en: "PM Kisan provides direct cash assistance of ₹6,000 annually to all farmers owning land. It has no land size limits but requires land papers to be in the applicant's name. This is a perpetual lifetime benefit program.",
      hi: "पीएम किसान योजना के तहत भूमिधारक किसानों को प्रति वर्ष ₹6,000 की नकद सहायता सीधे बैंक खाते में दी जाती है। यह ₹2,000 की तीन किस्तों में मिलती है। भूमि दस्तावेज आवेदक के नाम होने आवश्यक हैं।",
      ta: "பிஎம் கிசான் திட்டம் விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000 நிதியுதவி வழங்குகிறது. ₹2,000 வீதம் 3 தவணையாக வங்கி கணக்கில் செலுத்தப்படும். நிலப்பத்திரங்கள் விண்ணப்பதாரர் பெயரில் இருக்க வேண்டும்."
    },
    official_url: "https://pmkisan.gov.in"
  },
  {
    id: "startup-india",
    name: "Startup India Seed Fund",
    emoji: "💼",
    benefit: "Up to ₹50L Grants",
    type: "Central",
    category: "Business",
    description: "Financial assistance to early-stage startups for proof of concept and prototype.",
    purpose: "To provide financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
    benefits_detail: "Up to ₹20 Lakhs for validation of proof of concept, prototype development, or product trials. Up to ₹50 Lakhs for market entry, commercialization, or scaling through debt-linked instruments.",
    who_can_apply: "Startups recognized by DPIIT, incorporated not more than 2 years ago, with a viable business model and commercial potential.",
    timeline: [
      "Apply for DPIIT Recognition online.",
      "Submit pitch application to incubator on Startup India portal.",
      "Incubator evaluation committee review & pitch presentation.",
      "Seed fund approval and milestone-based disbursement."
    ],
    ai_score: "80% Match",
    eligibility: [
      { name: "Recognized by DPIIT", match: true },
      { name: "Incorporation age < 2 years", match: true },
      { name: "Must utilize technology or innovation", match: true }
    ],
    docs: [
      { name: "Certificate of Incorporation", desc: "Private limited or LLP certificate." },
      { name: "DPIIT Recognition Certificate", desc: "Issued by Ministry of Commerce." },
      { name: "Business Pitch Deck", desc: "Explaining problem, solution, market size, and team." }
    ],
    faqs: [
      { q: "Can a sole proprietorship apply?", a: "No. The startup must be incorporated as a Private Limited Company, a Registered Partnership Firm, or a Limited Liability Partnership (LLP)." }
    ],
    ai_summaries: {
      en: "This is a highly competitive central grant providing up to ₹50 Lakhs for innovative business ideas. Startups must register with DPIIT first. Ideal for technology, hardware, or high-scale business models.",
      hi: "यह स्टार्टअप्स को नया व्यवसाय शुरू करने, प्रोटोटाइप बनाने और बाजार में उतरने के लिए ₹50 लाख तक का अनुदान देता है। इसके लिए कंपनी का DPIIT से मान्यता प्राप्त होना अनिवार्य है।",
      ta: "புதிய தொழில்களைத் தொடங்க ₹50 லட்சம் வரை நிதியுதவி வழங்கும் திட்டமாகும். இதற்கு நிறுவனம் DPIIT அங்கீகாரம் பெற்றிருக்க வேண்டும்."
    },
    official_url: "https://www.startupindia.gov.in"
  },
  {
    id: "mukhya-awas",
    name: "Mukhyamantri Awas Yojana",
    emoji: "🏠",
    benefit: "₹1.0L–2.0L Assistance",
    type: "State",
    category: "Housing",
    description: "State-funded affordable housing scheme matching central housing efforts.",
    purpose: "To support economically weaker sections within the state who are left out of central housing lists.",
    benefits_detail: "State government subsidy ranging from ₹1 Lakh to ₹2 Lakhs depending on household income category and location (hilly vs plain areas).",
    who_can_apply: "State residents below the poverty line (BPL) or low-income category (LIG) who do not own any concrete residence.",
    timeline: [
      "Submit application to Block Development Office.",
      "Verification of residence and BPL status by local officers.",
      "List publication and bank transfer execution."
    ],
    ai_score: "90% Match",
    eligibility: [
      { name: "Valid State Domicile Certificate", match: true },
      { name: "BPL Card or Low Income status", match: true },
      { name: "Do not own brick house", match: true }
    ],
    docs: [
      { name: "Domicile Certificate", desc: "Proof of residing in the state for > 10 years." },
      { name: "Income Certificate / BPL Card", desc: "Showing household status." },
      { name: "Aadhaar Card", desc: "Linked to active bank account." }
    ],
    faqs: [
      { q: "Can I claim both PM Awas and State Awas?", a: "No. You can only claim one housing subsidy program. Yojana Saathi recommends applying for PM Awas first as the benefit amount is higher." }
    ],
    ai_summaries: {
      en: "This is a state-funded program. If you are rejected or delayed in PMAY, this is the best alternative. It provides up to ₹2 Lakhs. You cannot claim both housing benefits simultaneously.",
      hi: "यह राज्य सरकार द्वारा संचालित आवास योजना है। यदि आपको पीएम आवास योजना का लाभ नहीं मिला है, तो आप इसके लिए आवेदन कर सकते हैं। दोनों आवास योजनाओं का लाभ एक साथ नहीं लिया जा सकता।",
      ta: "மாநில அரசால் வழங்கப்படும் வீட்டு வசதி திட்டமாகும். பிஎம் அவாஸ் திட்டத்தில் விடுபட்டவர்கள் இதற்கு விண்ணப்பிக்கலாம்."
    },
    official_url: "#"
  },
  {
    id: "scholarship",
    name: "Post Matric Scholarship",
    emoji: "🎓",
    benefit: "₹50,000/year Tuition",
    type: "Central",
    category: "Student",
    description: "Financial assistance for students from lower-income backgrounds pursuing higher education.",
    purpose: "To support students from economically weaker sections to complete professional and general graduation courses.",
    benefits_detail: "Full tuition fee waiver and maintenance allowance of up to ₹50,000 per year depending on course category.",
    who_can_apply: "Students enrolled in recognized colleges whose annual family income is under ₹2.5 Lakhs.",
    timeline: [
      "Registration on National Scholarship Portal (NSP).",
      "Institute-level verification of documents and enrollment.",
      "District officer verification.",
      "Direct transfer of fees and allowance."
    ],
    ai_score: "85% Match",
    eligibility: [
      { name: "Income Certificate < ₹2,50,000", match: true },
      { name: "Passed Matriculation (Class 10)", match: true },
      { name: "Valid College Fee Receipt", match: true }
    ],
    docs: [
      { name: "Income Certificate", desc: "Must be under ₹2,50,000." },
      { name: "College Enrollment Receipt & Fee Card", desc: "Proof of current student status." },
      { name: "Mark Sheets", desc: "Class 10/12 results sheets." }
    ],
    faqs: [
      { q: "Does this cover private colleges?", a: "Yes, as long as the college is recognized by AICTE, UGC, or State Boards." }
    ],
    ai_summaries: {
      en: "A critical central scheme that waives tuition fees and grants maintenance allowances up to ₹50k for lower income students. Applications must be renewed every academic year on the NSP portal.",
      hi: "गरीब और पिछड़े परिवारों के छात्रों को उच्च शिक्षा जारी रखने के लिए छात्रवृत्ति दी जाती है। इसके तहत कॉलेज फीस माफी और वार्षिक भत्ता मिलता है। आवेदन हर साल करना होता है।",
      ta: "ஏழை எளிய மாணவர்கள் உயர்கல்வி கற்க உதவும் கல்வி உதவித்தொகை திட்டமாகும். கல்வி கட்டணம் மற்றும் பராமரிப்பு தொகை ஆண்டுக்கு ₹50,000 வரை வழங்கப்படும்."
    },
    official_url: "https://scholarships.gov.in"
  },
  {
    id: "ayushman-bharat",
    name: "PM Jan Arogya Yojana (AB-PMJAY)",
    emoji: "🏥",
    benefit: "₹5L/year Health Cover",
    type: "Central",
    category: "Health",
    description: "World's largest government-funded healthcare program providing cashless secondary and tertiary treatment.",
    purpose: "To reduce out-of-pocket medical expenditures for underprivileged families.",
    benefits_detail: "Cashless health coverage of up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization across all network hospitals.",
    who_can_apply: "Families listed in the Socio-Economic Caste Census (SECC 2011) or possessing BPL cards.",
    timeline: [
      "Check eligibility on PMJAY portal using phone/ration card.",
      "Visit hospital helpdesk or Ayushman Mitra.",
      "Generate Golden Card using Aadhaar biometric authentication.",
      "Cashless treatment admission."
    ],
    ai_score: "99% Match",
    eligibility: [
      { name: "BPL status or SECC listing", match: true },
      { name: "Family size: No limits", match: true },
      { name: "Aadhaar linked to Ration Card", match: true }
    ],
    docs: [
      { name: "Ration Card", desc: "To prove family units." },
      { name: "Aadhaar Card", desc: "Mandatory for patient verification." }
    ],
    faqs: [
      { q: "Which hospitals are covered?", a: "All government district hospitals and empanelled private hospitals. Check list on PMJAY portal." }
    ],
    ai_summaries: {
      en: "PMJAY gives ₹5 Lakhs annual cashless medical coverage per family. No signup is required if your family is listed in SECC or BPL databases; you just need to print the Golden Card.",
      hi: "आयुष्मान भारत योजना प्रत्येक गरीब परिवार को प्रति वर्ष ₹5 लाख का मुफ्त इलाज देती है। अस्पताल में कैशलेस इलाज की सुविधा है। आपको केवल गोल्डन कार्ड बनवाना होगा।",
      ta: "ஏழை குடும்பங்களுக்கு ஆண்டுக்கு ₹5 லட்சம் வரை இலவச மருத்துவ சிகிச்சை வழங்கும் திட்டமாகும். அரசு மற்றும் அங்கீகரிக்கப்பட்ட தனியார் மருத்துவமனைகளில் சிகிச்சை பெறலாம்."
    },
    official_url: "https://pmjay.gov.in"
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana (APY)",
    emoji: "👴",
    benefit: "₹1k–5k/month Pension",
    type: "Central",
    category: "Senior Citizen",
    description: "Co-contribution pension scheme for citizens in the unorganized sector.",
    purpose: "To provide social security in old age by ensuring a fixed minimum pension for workers.",
    benefits_detail: "Guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60, based on contributions made between age 18 to 40.",
    who_can_apply: "Any Indian citizen aged between 18 and 40 years holding a savings bank account.",
    timeline: [
      "Visit your savings bank branch or open online.",
      "Fill APY application form, link bank account auto-debit.",
      "Maintain monthly balance for contribution auto-deduct.",
      "Receive monthly pension payout upon turning age 60."
    ],
    ai_score: "85% Match",
    eligibility: [
      { name: "Age between 18 and 40 years", match: true },
      { name: "Active bank savings account", match: true },
      { name: "Must not be income taxpayer", match: true }
    ],
    docs: [
      { name: "Bank Passbook", desc: "Required for linking auto-debit." },
      { name: "Aadhaar Card", desc: "Mandatory for registration." }
    ],
    faqs: [
      { q: "Can I close the account early?", a: "Yes, voluntary exit is permitted with refund of contributions and accrued interest." }
    ],
    ai_summaries: {
      en: "A co-funded retirement pension for citizens not covered by corporate PF. If you register early (say at 18), you pay as little as ₹42/month to get a guaranteed ₹1,000/month pension later.",
      hi: "असंगठित क्षेत्र के कामगारों के लिए पेंशन योजना। 18 से 40 वर्ष की आयु के लोग जुड़ सकते हैं। 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह पेंशन मिलती है।",
      ta: "விவசாயிகள் மற்றும் அமைப்புசாரா தொழிலாளர்களுக்கு ஓய்வூதியம் வழங்கும் திட்டமாகும். 18 முதல் 40 வயது வரை உள்ளவர்கள் சேர்ந்து 60 வயதிற்கு பின் ஓய்வூதியம் பெறலாம்."
    },
    official_url: "https://www.npscra.nsdl.co.in"
  },
  {
    id: "disability-pension",
    name: "National Disability Pension Scheme",
    emoji: "♿",
    benefit: "₹1,000/month Cash",
    type: "Central",
    category: "Disabled",
    description: "Financial assistance for citizens with severe or multiple disabilities.",
    purpose: "To provide basic financial independence to disabled individuals under the National Social Assistance Programme (NSAP).",
    benefits_detail: "Direct cash transfer of ₹1,000 per month (combined central + state share) directly to the beneficiary's bank account.",
    who_can_apply: "Individuals aged 18-79 with a disability degree of 80% or higher, belonging to a BPL household.",
    timeline: [
      "Obtain Disability Certificate from Government Medical Board.",
      "Submit application to Social Welfare Office or Gram Panchayat.",
      "Social verification audit.",
      "Monthly pension disbursement."
    ],
    ai_score: "75% Match",
    eligibility: [
      { name: "Age between 18 and 79 years", match: true },
      { name: "Disability level >= 80%", match: true },
      { name: "Below Poverty Line (BPL) status", match: true }
    ],
    docs: [
      { name: "Disability Certificate", desc: "Issued by district medical board showing degree of disability." },
      { name: "BPL Ration Card Copy", desc: "Household poverty proof." },
      { name: "Aadhaar Card", desc: "Identity proof." }
    ],
    faqs: [
      { q: "What if the disability level is less than 80%?", a: "This central pension requires 80% or more. However, look up State-specific disability cards, which often cover 40% and above." }
    ],
    ai_summaries: {
      en: "A monthly social welfare grant of ₹1,000 for severely disabled individuals from low-income families. Requires a government-certified medical board disability certificate.",
      hi: "80% या उससे अधिक विकलांगता वाले गरीब व्यक्तियों को ₹1,000 प्रति माह की पेंशन दी जाती है। इसके लिए सरकारी अस्पताल का विकलांगता प्रमाणपत्र आवश्यक है।",
      ta: "80%க்கும் அதிகமான மாற்றுத்திறன் கொண்ட வறிய குடும்பங்களை சேர்ந்தவர்களுக்கு மாதம் ₹1,000 ஓய்வூதியம் வழங்கும் திட்டமாகும்."
    },
    official_url: "https://nsap.nic.in"
  },
  {
    id: "ladli-behna",
    name: "Ladli Behna Yojana",
    emoji: "👩",
    benefit: "₹1,250/month Cash",
    type: "State",
    category: "Women",
    description: "Financial empowerment program for women residents of the state.",
    purpose: "To improve the health, nutrition, and financial independence of women in rural and urban households.",
    benefits_detail: "Direct cash assistance of ₹1,250 deposited monthly into the bank account of the beneficiary woman.",
    who_can_apply: "Married women residents aged between 21 and 60 years, whose family annual income is under ₹2.5 Lakhs and who do not pay income tax.",
    timeline: [
      "Application forms distributed at Ward/Gram Panchayat camps.",
      "Direct photo and document submission with local facilitators.",
      "Draft list publication and objections resolution.",
      "Monthly DBT transfers on the 10th of every month."
    ],
    ai_score: "92% Match",
    eligibility: [
      { name: "Resident married woman (21-60 yrs)", match: true },
      { name: "Family Income < ₹2,50,000", match: true },
      { name: "No family member pays Income Tax", match: true }
    ],
    docs: [
      { name: "Ration Card / Jan Aadhaar Card", desc: "Family certificate proof." },
      { name: "Aadhaar Card", desc: "Must be e-KYC verified." },
      { name: "Bank Account Detail", desc: "Must be personal and Aadhaar linked." }
    ],
    faqs: [
      { q: "Can single/divorced women apply?", a: "Yes. Widowed, divorced, and abandoned women in the eligible age group are fully eligible and prioritized." }
    ],
    ai_summaries: {
      en: "A state cash assistance program transferring ₹1,250 monthly directly to women. High priority is given to single, widowed, or lower income households. Check if your state has launched this program.",
      hi: "राज्य की महिलाओं के आर्थिक सशक्तिकरण की योजना। इसके तहत प्रति माह ₹1,250 सीधे बैंक खाते में भेजे जाते हैं। विवाहित, विधवा, तलाकशुदा सभी महिलाएं पात्र हैं।",
      ta: "பெண்களின் பொருளாதார சுதந்திரத்திற்காக மாதம் ₹1,250 வழங்கும் மாநில அரசின் திட்டமாகும். வறுமைக்கோட்டிற்கு கீழ் உள்ள பெண்கள் இதற்கு தகுதியானவர்கள்."
    },
    official_url: "#"
  }
];
