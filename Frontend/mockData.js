// Mock data for Sahaj Seva app
export const schemes = [
  {
    id: 'pm-kisan',
    name: {
      en: 'PM-Kisan Samman Nidhi',
      hi: 'पीएम-किसान सम्मान निधि',
    },
    description: {
      en: 'Income support for small and marginal farmers.',
      hi: 'छोटे और सीमांत किसानों के लिए आय सहायता।',
    },
    eligibility: {
      en: 'All small and marginal farmers with up to 2 hectares of land.',
      hi: '2 हेक्टेयर तक भूमि वाले सभी छोटे और सीमांत किसान।',
    },
  },
  {
    id: 'old-age-pension',
    name: {
      en: 'Indira Gandhi Old Age Pension',
      hi: 'इंदिरा गांधी वृद्धावस्था पेंशन',
    },
    description: {
      en: 'Monthly pension for senior citizens above 60 years.',
      hi: '60 वर्ष से ऊपर के वरिष्ठ नागरिकों के लिए मासिक पेंशन।',
    },
    eligibility: {
      en: 'Indian citizens above 60 years from BPL families.',
      hi: 'बीपीएल परिवारों के 60 वर्ष से ऊपर के भारतीय नागरिक।',
    },
  },
];

export const formExplanations = {
  'pm-kisan': {
    what: {
      en: 'This form is for applying to the PM-Kisan Samman Nidhi scheme.',
      hi: 'यह फॉर्म पीएम-किसान सम्मान निधि योजना के लिए है।',
    },
    who: {
      en: 'Small and marginal farmers can fill this form.',
      hi: 'छोटे और सीमांत किसान यह फॉर्म भर सकते हैं।',
    },
    benefits: {
      en: 'Eligible farmers receive ₹6000 per year in 3 installments.',
      hi: 'पात्र किसानों को साल में 3 किश्तों में ₹6000 मिलते हैं।',
    },
    warnings: {
      en: 'Provide correct land and bank details to avoid rejection.',
      hi: 'अस्वीकृति से बचने के लिए सही भूमि और बैंक विवरण दें।',
    },
    fields: [
      { name: { en: 'Farmer Name', hi: 'किसान का नाम' }, help: { en: 'Enter your full name as per Aadhaar.', hi: 'आधार के अनुसार पूरा नाम लिखें।' } },
      { name: { en: 'Bank Account', hi: 'बैंक खाता' }, help: { en: 'Enter your active bank account number.', hi: 'अपना सक्रिय बैंक खाता नंबर लिखें।' } },
      { name: { en: 'Land Details', hi: 'भूमि विवरण' }, help: { en: 'Mention total land area (in hectares).', hi: 'कुल भूमि क्षेत्र (हेक्टेयर में) लिखें।' } },
    ],
  },
  'ration-card': {
    what: {
      en: 'This is an application form to get a new Ration Card. A Ration Card allows you to buy subsidized food grains like rice, wheat, and sugar from government fair price shops.',
      hi: 'यह नया राशन कार्ड प्राप्त करने के लिए आवेदन पत्र है। राशन कार्ड से आप सरकारी उचित मूल्य की दुकानों से सस्ते में चावल, गेहूं और चीनी खरीद सकते हैं।',
    },
    who: {
      en: 'Any family that does not have a Ration Card or needs to update their existing card. You must be a resident of the state and have valid ID proof.',
      hi: 'कोई भी परिवार जिसके पास राशन कार्ड नहीं है या जिसे अपना कार्ड अपडेट करना है। आपको राज्य का निवासी होना चाहिए और वैध पहचान पत्र होना चाहिए।',
    },
    benefits: {
      en: [
        'Buy rice at ₹3/kg instead of market price',
        'Buy wheat at ₹2/kg',
        'Get subsidized kerosene and sugar',
        'Required for many other government schemes',
      ],
      hi: [
        'चावल ₹3/किलो में खरीदें (बाजार भाव से कम)',
        'गेहूं ₹2/किलो में मिलेगा',
        'सस्ते में मिट्टी का तेल और चीनी मिलेगी',
        'कई अन्य सरकारी योजनाओं के लिए जरूरी',
      ],
    },
    warnings: {
      en: [
        'Do not give false information - it is punishable by law',
        'All family members must be listed',
        'Keep your card safe - duplicates take time',
      ],
      hi: [
        'गलत जानकारी न दें - यह कानून द्वारा दंडनीय है',
        'सभी परिवार के सदस्यों को सूचीबद्ध करें',
        'अपना कार्ड सुरक्षित रखें - डुप्लीकेट में समय लगता है',
      ],
    },
    fields: [
      { name: { en: 'Applicant Name', hi: 'आवेदक का नाम' }, help: { en: 'Write your full name as per Aadhaar card', hi: 'आधार कार्ड के अनुसार पूरा नाम लिखें' } },
      { name: { en: 'Father/Husband Name', hi: 'पिता/पति का नाम' }, help: { en: "Write father's name (or husband's if married woman)", hi: 'पिता का नाम लिखें (विवाहित महिला हो तो पति का)' } },
      { name: { en: 'Date of Birth', hi: 'जन्म तिथि' }, help: { en: 'Write as DD/MM/YYYY (e.g., 15/08/1960)', hi: 'DD/MM/YYYY के रूप में लिखें (जैसे 15/08/1960)' } },
      { name: { en: 'Address', hi: 'पता' }, help: { en: 'Write complete address with village, block, district', hi: 'गांव, ब्लॉक, जिले के साथ पूरा पता लिखें' } },
      { name: { en: 'Aadhaar Number', hi: 'आधार नंबर' }, help: { en: 'Write 12-digit Aadhaar number', hi: '12 अंकों का आधार नंबर लिखें' } },
      { name: { en: 'Mobile Number', hi: 'मोबाइल नंबर' }, help: { en: 'Write 10-digit mobile number', hi: '10 अंकों का मोबाइल नंबर लिखें' } },
      { name: { en: 'Annual Income', hi: 'वार्षिक आय' }, help: { en: 'Write total family income per year in rupees', hi: 'परिवार की कुल वार्षिक आय रुपये में लिखें' } },
      { name: { en: 'Number of Family Members', hi: 'परिवार के सदस्यों की संख्या' }, help: { en: 'Count all people living and eating together', hi: 'साथ रहने और खाने वाले सभी लोगों की गिनती करें' } },
    ],
  },
};