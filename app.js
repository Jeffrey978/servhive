/* ===================================================================
   SERVHIVE APPLICATION ENGINE — ESCOLHA DIGITAL AESTHETICS
   Fonts: Montserrat • Brand Colors: Amber #F2A900, Teal #0F5C5C, Ink #1B1B1B
   =================================================================== */

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Trades', icon: 'grid', proCount: '240+' },
  { id: 'power-gen', name: 'Power & Generators', icon: 'zap', proCount: '46+ Verified Pros', rateFrom: '₦8,000', desc: 'Generators, ATS changeover switches & industrial load balancing.' },
  { id: 'solar-tech', name: 'Solar & Inverters', icon: 'sun', proCount: '34+ Verified Pros', rateFrom: '₦12,000', desc: 'Hybrid solar inverters, lithium batteries & CCTV networks.' },
  { id: 'interior-pop', name: 'POP & Interior', icon: 'home', proCount: '38+ Verified Pros', rateFrom: '₦15,000', desc: 'Suspended POP ceilings, Italian tiling & luxury screeding.' },
  { id: 'plumbing', name: 'Plumbing & Pumps', icon: 'droplet', proCount: '29+ Verified Pros', rateFrom: '₦10,000', desc: 'Submersible borehole pumps, piping repairs & water storage.' },
  { id: 'electrical', name: 'Electrical & Wiring', icon: 'cpu', proCount: '41+ Verified Pros', rateFrom: '₦7,000', desc: 'Conduit piping, distribution boards & emergency fault finding.' },
  { id: 'ac-chillers', name: 'AC & Refrigeration', icon: 'wind', proCount: '32+ Verified Pros', rateFrom: '₦8,000', desc: 'Split AC servicing, compressor replacements & cold rooms.' },
  { id: 'auto-mechanic', name: 'Auto Diagnostics', icon: 'tool', proCount: '31+ Verified Pros', rateFrom: '₦6,000', desc: 'OBD-2 computerized scanning, brake overhauls & mobile mechanics.' },
  { id: 'beauty-hair', name: 'Beauty & Grooming', icon: 'scissors', proCount: '52+ Verified Pros', rateFrom: '₦7,000', desc: 'Knotless box braids, wig customization & scalp therapy.' },
  { id: 'carpentry', name: 'Carpentry & Furniture', icon: 'box', proCount: '27+ Verified Pros', rateFrom: '₦10,000', desc: 'Kitchen cabinetry, custom wardrobes & wooden furniture restoration.' },
  { id: 'painting', name: 'Painting & Screeding', icon: 'brush', proCount: '35+ Verified Pros', rateFrom: '₦12,000', desc: 'Exterior weather-shield painting & luxury interior wall textures.' }
];

const APPROVAL_REQUIRED_CATEGORIES = [
  { id: 'home-health', name: 'Home Health Aide', reason: 'Medical/health care liability. Requires verified Rivers State Nursing/Health Council license.' },
  { id: 'laser-tech', name: 'Laser Tech & Electrologist', reason: 'Invasive cosmetic procedures. Medical board certification required.' },
  { id: 'tattoo-piercing', name: 'Tattoo & Body Piercer', reason: 'Sanitation and bloodborne pathogen compliance required.' },
  { id: 'funeral-director', name: 'Funeral Director', reason: 'Regulated mortuary and logistics license required.' }
];

const BLOCKED_CATEGORIES = [
  { id: 'nanny', name: 'Nanny / Babysitter', reason: 'Child safeguarding policy strictly prohibits independent nanny sign-ups at this prototype stage.' },
  { id: 'childcare', name: 'Childcare / Daycare Provider', reason: 'Child safeguarding and facility licensing policy.' },
  { id: 'tutor', name: 'Private Tutor', reason: 'Home education listings are blocked in the current marketplace scope.' }
];

const AREAS = [
  'All Port Harcourt',
  'Old GRA',
  'New GRA / Phase 2',
  'Peter Odili Road',
  'Trans-Amadi',
  'Woji',
  'D-Line',
  'Ada George',
  'Choba / Uniport',
  'Rumuodara',
  'Rumuola',
  'Alakahia'
];

// Comprehensive Authentic Port Harcourt Landmark Registry
const PH_LANDMARKS = [
  {
    name: 'Pleasure Park / Bori Camp',
    shortName: 'Pleasure Park',
    zone: 'Rumuola',
    lat: 4.8320,
    lng: 7.0125,
    popular: true,
    keywords: ['pleasure park', 'bori camp', 'aba road', 'airforce', 'rumuola flyover', 'recreation']
  },
  {
    name: 'Garrison Junction & D-Line',
    shortName: 'Garrison',
    zone: 'D-Line',
    lat: 4.8055,
    lng: 7.0150,
    popular: true,
    keywords: ['garrison', 'd-line', 'aba road', 'transit', 'junction', 'flyover']
  },
  {
    name: 'Hotel Presidential & Rumuola',
    shortName: 'Hotel Presidential',
    zone: 'Rumuola',
    lat: 4.8210,
    lng: 7.0090,
    popular: true,
    keywords: ['hotel presidential', 'presidential', 'rumuola', 'aba road', 'gra phase 2']
  },
  {
    name: 'Waterlines / Aba Road',
    shortName: 'Waterlines',
    zone: 'D-Line',
    lat: 4.8140,
    lng: 7.0115,
    popular: true,
    keywords: ['waterlines', 'olu obasanjo', 'aba road', 'junction', 'telecoms']
  },
  {
    name: 'Peter Odili Road & Trans-Amadi Gardens',
    shortName: 'Peter Odili Road',
    zone: 'Peter Odili Road',
    lat: 4.8080,
    lng: 7.0450,
    popular: true,
    keywords: ['peter odili', 'trans-amadi gardens', 'genesis', 'riverpark', 'odili road']
  },
  {
    name: 'Old GRA & Government House',
    shortName: 'Old GRA',
    zone: 'Old GRA',
    lat: 4.7760,
    lng: 7.0100,
    popular: true,
    keywords: ['old gra', 'government house', 'harley street', 'forces avenue', 'secretariat']
  },
  {
    name: 'New GRA (Tombia / Birabi)',
    shortName: 'New GRA',
    zone: 'New GRA / Phase 2',
    lat: 4.8180,
    lng: 6.9980,
    popular: true,
    keywords: ['new gra', 'tombia', 'birabi', 'gra phase 2', 'genesis deluxe', 'lounges']
  },
  {
    name: 'Trans-Amadi & Slaughter Bridge',
    shortName: 'Trans-Amadi',
    zone: 'Trans-Amadi',
    lat: 4.8190,
    lng: 7.0350,
    popular: true,
    keywords: ['trans-amadi', 'slaughter bridge', 'industrial layout', 'ordnance', 'fabrication']
  },
  {
    name: 'Woji & Golf Estate Gate',
    shortName: 'Woji & Golf Estate',
    zone: 'Woji',
    lat: 4.8250,
    lng: 7.0580,
    popular: true,
    keywords: ['woji', 'golf estate', 'woji junction', 'ykc', 'federal housing']
  },
  {
    name: 'Choba & Uniport Delta Park',
    shortName: 'Choba & Uniport',
    zone: 'Choba / Uniport',
    lat: 4.8980,
    lng: 6.9240,
    popular: true,
    keywords: ['choba', 'uniport', 'delta park', 'abuja campus', 'university of port harcourt']
  },
  {
    name: 'UPTH Gate & Alakahia',
    shortName: 'UPTH & Alakahia',
    zone: 'Alakahia',
    lat: 4.8875,
    lng: 6.9360,
    popular: true,
    keywords: ['upth', 'teaching hospital', 'alakahia', 'east-west road', 'medical']
  },
  {
    name: 'RSU / UST Gate & Mile 3 Diobu',
    shortName: 'RSU / UST',
    zone: 'Mile 3 Diobu',
    lat: 4.8000,
    lng: 6.9850,
    popular: true,
    keywords: ['rsu', 'ust', 'rivers state university', 'nkpolu', 'mile 3', 'diobu']
  },
  {
    name: 'Rumuokoro Flyover & Roundabout',
    shortName: 'Rumuokoro',
    zone: 'Rumuokoro',
    lat: 4.8710,
    lng: 6.9940,
    popular: true,
    keywords: ['rumuokoro', 'roundabout', 'flyover', 'east-west road', 'okoro bus stop']
  },
  {
    name: 'Air Force Base & Eliozu Flyover',
    shortName: 'Air Force / Eliozu',
    zone: 'Eliozu',
    lat: 4.8450,
    lng: 7.0250,
    popular: true,
    keywords: ['air force', 'air force base', 'eliozu', 'eliozu flyover', 'gu ake road']
  },
  {
    name: 'Artillery Junction & Okporo',
    shortName: 'Artillery Junction',
    zone: 'Rumuodara',
    lat: 4.8380,
    lng: 7.0320,
    popular: true,
    keywords: ['artillery', 'okporo', 'aba road', 'first artillery', 'second artillery']
  },
  {
    name: 'Oil Mill Junction & Elelenwo',
    shortName: 'Oil Mill Market',
    zone: 'Elelenwo',
    lat: 4.8560,
    lng: 7.0810,
    popular: true,
    keywords: ['oil mill', 'oil mill market', 'eleme junction', 'elelenwo', 'aba expressway']
  },
  {
    name: 'Ada George & Wimpey Junction',
    shortName: 'Ada George / Wimpey',
    zone: 'Ada George',
    lat: 4.8420,
    lng: 6.9750,
    popular: true,
    keywords: ['ada george', 'wimpey', 'ikwerre road', 'location road', 'agip']
  },
  {
    name: 'Mile 1-3 Diobu & Education Bus Stop',
    shortName: 'Diobu Markets',
    zone: 'Diobu',
    lat: 4.7890,
    lng: 6.9980,
    popular: true,
    keywords: ['diobu', 'mile 1', 'mile 2', 'mile 3', 'education bus stop', 'ikwerre road', 'timber market']
  },
  {
    name: 'Port Harcourt Mall / Spar',
    shortName: 'Spar / PH Mall',
    zone: 'Old GRA',
    lat: 4.7675,
    lng: 7.0140,
    popular: true,
    keywords: ['spar', 'port harcourt mall', 'ph mall', 'azikiwe road', 'cinema']
  },
  {
    name: 'Agip Roundabout & Ikwerre Road',
    shortName: 'Agip Roundabout',
    zone: 'Rumueme',
    lat: 4.8290,
    lng: 6.9840,
    popular: false,
    keywords: ['agip', 'agip roundabout', 'rumueme', 'mile 4', 'ikwerre road']
  },
  {
    name: 'Borokiri & Port Harcourt Township',
    shortName: 'Borokiri / Town',
    zone: 'Township',
    lat: 4.7520,
    lng: 7.0280,
    popular: false,
    keywords: ['borokiri', 'town', 'creek road', 'township', 'harbour road', 'wharf']
  },
  {
    name: 'Rukpokwu & Airport Road Roundabout',
    shortName: 'Rukpokwu',
    zone: 'Rukpokwu',
    lat: 4.8990,
    lng: 7.0220,
    popular: false,
    keywords: ['rukpokwu', 'airport road', 'eneka', 'igwuruta', 'international airport']
  },
  {
    name: 'Rumuodara Junction',
    shortName: 'Rumuodara',
    zone: 'Rumuodara',
    lat: 4.8510,
    lng: 7.0420,
    popular: false,
    keywords: ['rumuodara', 'rumuodara junction', 'east-west road', 'tanker park']
  }
];

const INITIAL_PROVIDERS = [
  {
    id: 'pro-1',
    name: 'Engr. Emeka Obi',
    businessName: 'PowerVolt Generator & Electrical Works',
    category: 'power-gen',
    categoryName: 'Power & Generators',
    subSpecialty: 'Generator & Inverter Specialist',
    area: 'Trans-Amadi',
    lat: 4.8190,
    lng: 7.0350,
    landmarks: ['Trans-Amadi & Slaughter Bridge', 'Peter Odili Road & Trans-Amadi Gardens', 'Artillery Junction & Okporo', 'Garrison Junction & D-Line'],
    rating: 4.9,
    reviewCount: 46,
    verified: true,
    boosted: true,
    boostDays: 7,
    boostExpires: 'Nov 5, 2026',
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 8000,
    responseTime: '~15 mins',
    bio: 'Over 9 years solving electrical faults and power fluctuations in Port Harcourt. Specialized in Mikano, Perkins, and Firman generator servicing, automatic changeover switches, and industrial load balancing.',
    workPhotos: [
      { url: '/assets/hero_tradesman.jpg', caption: 'Mikano 30kVA ATS installation & engine overhaul in Trans-Amadi' },
      { url: '/assets/solar_tech.jpg', caption: 'Automatic changeover load balancing panel for corporate facility' },
      { url: '/assets/interior_pop.jpg', caption: 'Emergency generator re-wiring & control unit setup' }
    ],
    services: [
      { name: 'Generator Diagnostic & Servicing', price: 15000, type: 'Starting from' },
      { name: 'Emergency Fault Finding & Rewiring', price: 8000, type: 'Fixed' },
      { name: 'Automatic Changeover Installation', price: 12000, type: 'Fixed' },
      { name: 'Inverter Backup Integration', price: 25000, type: 'Starting from' }
    ],
    reviews: [
      { author: 'Chukwuma K.', area: 'Peter Odili', rating: 5, date: '2 days ago', text: 'Prompt and very knowledgeable. Fixed my Mikano 30kVA changeover cleanly.' },
      { author: 'Mrs. Briggs', area: 'Trans-Amadi', rating: 5, date: '1 week ago', text: 'Fair pricing and arrived exactly when he promised. Highly recommended.' }
    ]
  },
  {
    id: 'pro-2',
    name: 'Blessing Amadi',
    businessName: 'Crown & Braids Beauty Lounge',
    category: 'beauty-hair',
    categoryName: 'Beauty & Grooming',
    subSpecialty: 'Luxury Braids & Hair Treatments',
    area: 'New GRA / Phase 2',
    lat: 4.8180,
    lng: 6.9980,
    landmarks: ['New GRA (Tombia / Birabi)', 'Hotel Presidential & Rumuola', 'Waterlines / Aba Road', 'Old GRA & Government House'],
    rating: 5.0,
    reviewCount: 62,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/hairstylist.jpg',
    startingPrice: 7000,
    responseTime: '~10 mins',
    bio: 'Professional cosmetologist and hair architect in New GRA. We deliver neat knotless braids, frontal installations, and restorative scalping in a serene environment or home service.',
    workPhotos: [
      { url: '/assets/hairstylist.jpg', caption: 'Signature knotless box braids with seamless parting in New GRA' },
      { url: '/assets/interior_pop.jpg', caption: 'Custom HD lace frontal wig customization & melting' },
      { url: '/assets/hero_tradesman.jpg', caption: 'Scalp therapy treatment & deep steam conditioning' }
    ],
    services: [
      { name: 'Signature Knotless Box Braids', price: 18000, type: 'Starting from' },
      { name: 'Lace Frontal Wig Customization & Install', price: 22000, type: 'Fixed' },
      { name: 'Deep Conditioning & Scalp Therapy', price: 9000, type: 'Fixed' },
      { name: 'Pedicure & Gel Nail Refill', price: 7000, type: 'Fixed' }
    ],
    reviews: [
      { author: 'Amanda T.', area: 'Old GRA', rating: 5, date: '3 days ago', text: 'Her attention to detail is unmatched. Zero pain on edges and very neat.' },
      { author: 'Nkechi W.', area: 'Peter Odili', rating: 5, date: '2 weeks ago', text: 'Clean salon and top tier customer service.' }
    ]
  },
  {
    id: 'pro-3',
    name: 'Tari Davies',
    businessName: 'Prime POP & Architectural Ceilings',
    category: 'interior-pop',
    categoryName: 'POP & Interior',
    subSpecialty: 'POP Ceiling & Italian Tiling',
    area: 'Woji',
    lat: 4.8250,
    lng: 7.0580,
    landmarks: ['Woji & Golf Estate Gate', 'Peter Odili Road & Trans-Amadi Gardens', 'Oil Mill Junction & Elelenwo', 'Trans-Amadi & Slaughter Bridge'],
    rating: 4.8,
    reviewCount: 34,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/interior_pop.jpg',
    startingPrice: 15000,
    responseTime: '~30 mins',
    bio: 'Master of modern ceiling acoustics and Italian porcelain tiling. Serving high-end homes and developments in Woji, Peter Odili, and Golf Estate.',
    workPhotos: [
      { url: '/assets/interior_pop.jpg', caption: 'Suspended POP ceiling with warm hidden LED cove in Golf Estate' },
      { url: '/assets/hero_tradesman.jpg', caption: 'Italian porcelain tile floor alignment (60x120cm) in Woji' },
      { url: '/assets/solar_tech.jpg', caption: 'Drywall partitioning & smooth wall screeding' }
    ],
    services: [
      { name: 'Modern Suspended POP Design (Per Room)', price: 45000, type: 'Starting from' },
      { name: 'Porcelain Tile Laying (Per Sqm)', price: 3500, type: 'Fixed' },
      { name: 'Screeding & Luxury Emulsion Painting', price: 30000, type: 'Starting from' }
    ],
    reviews: [
      { author: 'Arch. Belema D.', area: 'Woji', rating: 5, date: '1 week ago', text: 'Tari did the POP ceilings for our duplex. Laser accurate lines and zero cracks.' }
    ]
  },
  {
    id: 'pro-4',
    name: 'Chinedu Eze',
    businessName: 'SunWave Solar & Clean Energy',
    category: 'solar-tech',
    categoryName: 'Solar & Inverters',
    subSpecialty: 'Solar Hybrid Systems & CCTV',
    area: 'Peter Odili Road',
    lat: 4.8080,
    lng: 7.0450,
    landmarks: ['Peter Odili Road & Trans-Amadi Gardens', 'Trans-Amadi & Slaughter Bridge', 'Woji & Golf Estate Gate', 'Garrison Junction & D-Line'],
    rating: 4.9,
    reviewCount: 51,
    verified: true,
    boosted: true,
    boostDays: 7,
    boostExpires: 'Nov 5, 2026',
    status: 'approved',
    image: '/assets/solar_tech.jpg',
    startingPrice: 12000,
    responseTime: '~20 mins',
    bio: 'Certified renewable energy specialist. Helping PH households beat unpredictable grid blackouts with reliable lithium and tubular battery solar setups.',
    workPhotos: [
      { url: '/assets/solar_tech.jpg', caption: '5kVA Hybrid Inverter installation with 48V 200Ah Lithium Bank' },
      { url: '/assets/hero_tradesman.jpg', caption: 'High efficiency monocrystalline solar array on Peter Odili duplex' },
      { url: '/assets/interior_pop.jpg', caption: '8-Channel HD Night Vision CCTV surveillance network' }
    ],
    services: [
      { name: 'Solar Inverter System Health Audit', price: 12000, type: 'Fixed' },
      { name: '5KVA Hybrid Solar Installation', price: 65000, type: 'Starting from' },
      { name: '8-Channel HD CCTV Security Setup', price: 35000, type: 'Starting from' }
    ],
    reviews: [
      { author: 'Engr. Diri', area: 'Peter Odili', rating: 5, date: '4 days ago', text: 'Installed our 3.5kVA system. Power hasn’t blinked in 2 months. Very professional.' }
    ]
  },
  {
    id: 'pro-5',
    name: 'Ibrahim Aliyu',
    businessName: 'Precision Mobile Auto Diagnostics',
    category: 'auto-mechanic',
    categoryName: 'Auto Diagnostics',
    subSpecialty: 'Mobile Mechanic & Scanner',
    area: 'D-Line',
    lat: 4.8055,
    lng: 7.0150,
    landmarks: ['Garrison Junction & D-Line', 'Waterlines / Aba Road', 'Hotel Presidential & Rumuola', 'Mile 1-3 Diobu & Education Bus Stop'],
    rating: 4.7,
    reviewCount: 29,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 6000,
    responseTime: '~25 mins',
    bio: 'Mobile computerized OBD-2 engine scanning, brake bleeding, suspension troubleshooting, and roadside mechanical assistance across Port Harcourt.',
    workPhotos: [
      { url: '/assets/hero_tradesman.jpg', caption: 'OBD-2 scan & live sensor graph reading in D-Line' },
      { url: '/assets/solar_tech.jpg', caption: 'Brembo brake pad replacement & hydraulic bleeding' },
      { url: '/assets/interior_pop.jpg', caption: 'Roadside alternator diagnostics & battery health test' }
    ],
    services: [
      { name: 'Full OBD-2 Computerized Diagnostics', price: 7000, type: 'Fixed' },
      { name: 'On-Site Brake Pad Replacement', price: 6000, type: 'Fixed' },
      { name: 'Routine Engine Oil & Filter Service', price: 5000, type: 'Fixed' }
    ],
    reviews: [
      { author: 'Ovie S.', area: 'D-Line', rating: 4.5, date: '5 days ago', text: 'Came to my office when my car threw a check engine code. Diagnosed bad sensor in 10 minutes.' }
    ]
  },
  {
    id: 'pro-6',
    name: 'Nurse Joyce Jumbo',
    businessName: 'CarePlus Home Healthcare',
    category: 'approval-required',
    categoryName: 'Home Health Aide',
    subSpecialty: 'Geriatric & Post-Op Care',
    area: 'Old GRA',
    lat: 4.7760,
    lng: 7.0100,
    landmarks: ['Old GRA & Government House', 'Port Harcourt Mall / Spar', 'Garrison Junction & D-Line'],
    rating: 5.0,
    reviewCount: 0,
    verified: false,
    boosted: false,
    status: 'pending',
    licenseDoc: 'Rivers State Nursing Council Reg #RN-2024-8842.pdf',
    image: '/assets/hairstylist.jpg',
    startingPrice: 20000,
    responseTime: '~1 hr',
    bio: 'Registered nurse providing licensed in-home elderly companionship, vitals monitoring, and rehabilitation support in Port Harcourt.',
    workPhotos: [
      { url: '/assets/hairstylist.jpg', caption: 'Licensed post-operative dressing care in Old GRA' }
    ],
    services: [
      { name: 'Daily In-Home Nursing Visit', price: 20000, type: 'Starting from' },
      { name: 'Post-Surgery Vitals & Dressing Care', price: 25000, type: 'Fixed' }
    ],
    reviews: []
  },
  {
    id: 'pro-7',
    name: 'Kelechi Nwosu',
    businessName: 'Apex Refrigeration & AC Chiller Repairs',
    category: 'ac-chillers',
    categoryName: 'AC & Refrigeration',
    subSpecialty: 'Air Conditioning & Cold Room Engineer',
    area: 'Choba / Uniport',
    lat: 4.8980,
    lng: 6.9240,
    landmarks: ['Choba & Uniport Delta Park', 'UPTH Gate & Alakahia', 'Rumuokoro Flyover & Roundabout'],
    rating: 4.9,
    reviewCount: 38,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 10000,
    responseTime: '~20 mins',
    bio: 'Specialist AC installation, gas top-ups, inverter compressor diagnostics, and commercial cold-room servicing in Choba, Uniport, Alakahia, and Ada George.',
    workPhotos: [
      { url: '/assets/hero_tradesman.jpg', caption: 'Inverter split AC compressor repair in Uniport Quarters' },
      { url: '/assets/solar_tech.jpg', caption: 'Commercial cold room temperature calibration in Choba' },
      { url: '/assets/interior_pop.jpg', caption: 'Chemical coil flush & R410A gas vacuum charging' }
    ],
    services: [
      { name: 'Split AC Deep Chemical Wash & Service', price: 10000, type: 'Fixed' },
      { name: 'AC Refrigerant R410A / R22 Re-gas', price: 18000, type: 'Fixed' },
      { name: 'Inverter AC Sensor & PCB Repair', price: 15000, type: 'Fixed' }
    ],
    reviews: [
      { author: 'Dr. Tammy K.', area: 'Uniport', rating: 5, date: '3 days ago', text: 'Fast response to Uniport staff quarters. Fixed two inverter AC units.' }
    ]
  },
  {
    id: 'pro-8',
    name: 'Tamuno George',
    businessName: 'FlowMaster Borehole & Plumbing Works',
    category: 'plumbing',
    categoryName: 'Plumbing & Pumps',
    subSpecialty: 'Plumbing & Deep Well Submersible Pumps',
    area: 'Ada George',
    lat: 4.8420,
    lng: 6.9750,
    landmarks: ['Ada George & Wimpey Junction', 'Agip Roundabout & Ikwerre Road', 'Rumuokoro Flyover & Roundabout'],
    rating: 4.8,
    reviewCount: 42,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/solar_tech.jpg',
    startingPrice: 10000,
    responseTime: '~25 mins',
    bio: 'Expert borehole drilling maintenance, Italian submersible pump rewinding, automatic float switches, and domestic plumbing piping in Ada George and Rumueme.',
    workPhotos: [
      { url: '/assets/solar_tech.jpg', caption: 'Submersible 2HP borehole pump replacement & electrical wiring' },
      { url: '/assets/hero_tradesman.jpg', caption: 'Automatic water level control switch for 5000L tank' },
      { url: '/assets/interior_pop.jpg', caption: 'PPR pipe manifold installation for residential apartment block' }
    ],
    services: [
      { name: 'Borehole Submersible Pump Extraction & Repair', price: 25000, type: 'Starting from' },
      { name: 'Automated Water Level Controller Installation', price: 14000, type: 'Fixed' },
      { name: 'Whole-Home Pressure Piping Inspection', price: 10000, type: 'Fixed' }
    ],
    reviews: [
      { author: 'Pastor George', area: 'Ada George', rating: 5, date: '1 week ago', text: 'Restored water in our estate within 2 hours. Very honest craftsman.' }
    ]
  },
  {
    id: 'pro-9',
    name: 'Osas Ighodaro',
    businessName: 'VoltGuard Industrial Electrical Systems',
    category: 'electrical',
    categoryName: 'Electrical & Wiring',
    subSpecialty: 'Conduit Piping & Distribution Panels',
    area: 'Old GRA',
    lat: 4.7760,
    lng: 7.0100,
    landmarks: ['Old GRA & Government House', 'Port Harcourt Mall / Spar', 'Garrison Junction & D-Line'],
    rating: 4.9,
    reviewCount: 35,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 7000,
    responseTime: '~15 mins',
    bio: 'Certified electrical technician specializing in modern conduit wiring, main distribution board overhauls, earth-pit resistance testing, and architectural lighting in Old GRA.',
    workPhotos: [
      { url: '/assets/hero_tradesman.jpg', caption: 'Main distribution breaker panel overhaul with surge suppressor' },
      { url: '/assets/solar_tech.jpg', caption: 'Earth leakage circuit breaker testing and earthing pit renewal' },
      { url: '/assets/interior_pop.jpg', caption: 'Architectural recessed ceiling spotlight wiring in Old GRA' }
    ],
    services: [
      { name: 'Distribution Board (DB) Troubleshooting', price: 12000, type: 'Fixed' },
      { name: 'Complete Room Conduit Re-wiring', price: 25000, type: 'Starting from' },
      { name: 'Earthing & Lightning Protection Audit', price: 18000, type: 'Fixed' }
    ],
    reviews: [
      { author: 'Sir Jude M.', area: 'Old GRA', rating: 5, date: '5 days ago', text: 'Resolved a tripping breaker issue that 2 previous electricians failed to diagnose. Outstanding skill.' }
    ]
  },
  {
    id: 'pro-10',
    name: 'Bassey Edet',
    businessName: 'Heritage Woodcraft & Kitchen Studio',
    category: 'carpentry',
    categoryName: 'Carpentry & Furniture',
    subSpecialty: 'Custom Cabinetry & Wardrobe Joinery',
    area: 'Rumuodara',
    lat: 4.8510,
    lng: 7.0420,
    landmarks: ['Rumuodara Junction', 'Artillery Junction & Okporo', 'Oil Mill Junction & Elelenwo'],
    rating: 4.8,
    reviewCount: 27,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/interior_pop.jpg',
    startingPrice: 10000,
    responseTime: '~30 mins',
    bio: 'Crafting bespoke modular kitchen cabinets, high-gloss TV consoles, and walk-in wardrobes with imported soft-close hydraulic hardware across Port Harcourt.',
    workPhotos: [
      { url: '/assets/interior_pop.jpg', caption: 'Modular acrylic kitchen cabinets with quartz countertop' },
      { url: '/assets/hero_tradesman.jpg', caption: 'Custom sliding wardrobe with tinted glass doors' },
      { url: '/assets/solar_tech.jpg', caption: 'Floating TV wall console with integrated acoustic wood slats' }
    ],
    services: [
      { name: 'Cabinet Door Hinge & Hydraulic Repair', price: 10000, type: 'Fixed' },
      { name: 'Custom Modular Kitchen Cabinetry (Per Metre)', price: 40000, type: 'Starting from' },
      { name: 'Walk-In Wardrobe Design & Fitting', price: 55000, type: 'Starting from' }
    ],
    reviews: [
      { author: 'Efe O.', area: 'Rumuodara', rating: 5, date: '2 weeks ago', text: 'Solid wood finishing and precision fitting for our kitchen renovation.' }
    ]
  },
  {
    id: 'pro-11',
    name: 'Somto Okon',
    businessName: 'Royal Finish Painting & Luxury Screeding',
    category: 'painting',
    categoryName: 'Painting & Screeding',
    subSpecialty: 'Texture Coating & Interior Velvet Finishes',
    area: 'Peter Odili Road',
    lat: 4.8080,
    lng: 7.0450,
    landmarks: ['Peter Odili Road & Trans-Amadi Gardens', 'Trans-Amadi & Slaughter Bridge', 'Woji & Golf Estate Gate'],
    rating: 4.9,
    reviewCount: 31,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/hairstylist.jpg',
    startingPrice: 12000,
    responseTime: '~20 mins',
    bio: 'Specialist in Venetian plaster, luxury screeding, and weather-shield exterior paint finishes that withstand Port Harcourt humidity and heavy rain.',
    workPhotos: [
      { url: '/assets/hairstylist.jpg', caption: 'Luxury satin velvet wall finish in Peter Odili duplex' },
      { url: '/assets/interior_pop.jpg', caption: 'Venetian marble plaster accent wall in living lounge' },
      { url: '/assets/solar_tech.jpg', caption: 'Weather-shield exterior coating with anti-fungal seal' }
    ],
    services: [
      { name: 'Room Wall Screeding & Premium Emulsion', price: 25000, type: 'Starting from' },
      { name: 'Italian Stucco / Venetian Plaster Accent Wall', price: 35000, type: 'Fixed' },
      { name: 'Exterior Weather-Proof Painting', price: 45000, type: 'Starting from' }
    ],
    reviews: [
      { author: 'Ifeoma A.', area: 'Peter Odili', rating: 5, date: '4 days ago', text: 'Clean painters! They covered our furniture with plastic dropsheets and finished in record time.' }
    ]
  }
];

// Fallback & Hydration to ensure coordinates and landmarks exist even on previously cached local storage
function hydrateProvidersWithCoordinates(providers) {
  if (!Array.isArray(providers) || providers.length === 0) return INITIAL_PROVIDERS;
  
  // Ensure default INITIAL_PROVIDERS exist
  const existingIds = new Set(providers.map(p => p.id));
  const merged = [...providers];
  INITIAL_PROVIDERS.forEach(initP => {
    if (!existingIds.has(initP.id)) {
      merged.push(initP);
    }
  });

  return merged.map(p => {
    const defaultMatch = INITIAL_PROVIDERS.find(ip => ip.id === p.id);
    if (defaultMatch) {
      return {
        ...defaultMatch,
        ...p,
        category: defaultMatch.category,
        categoryName: defaultMatch.categoryName,
        workPhotos: (p.workPhotos && p.workPhotos.length) ? p.workPhotos : defaultMatch.workPhotos,
        boosted: p.boosted !== undefined ? p.boosted : defaultMatch.boosted,
        boostDays: p.boostDays || defaultMatch.boostDays,
        boostExpires: p.boostExpires || defaultMatch.boostExpires,
        lat: p.lat || defaultMatch.lat,
        lng: p.lng || defaultMatch.lng,
        landmarks: (p.landmarks && p.landmarks.length) ? p.landmarks : defaultMatch.landmarks
      };
    }
    const landmarkMatch = PH_LANDMARKS.find(l => l.zone.toLowerCase() === (p.area || '').toLowerCase()) || PH_LANDMARKS[0];
    return {
      ...p,
      category: p.category || 'power-gen',
      categoryName: p.categoryName || 'Power & Generators',
      workPhotos: p.workPhotos || [
        { url: '/assets/hero_tradesman.jpg', caption: 'On-site technical service in Port Harcourt' },
        { url: '/assets/solar_tech.jpg', caption: 'Equipment installation & testing' },
        { url: '/assets/interior_pop.jpg', caption: 'Finishing and handover inspection' }
      ],
      boosted: p.boosted || false,
      lat: p.lat || landmarkMatch.lat,
      lng: p.lng || landmarkMatch.lng,
      landmarks: (p.landmarks && p.landmarks.length) ? p.landmarks : [landmarkMatch.name]
    };
  });
}

const SHOWCASE_ITEMS = [
  {
    proId: 'pro-1',
    image: '/assets/hero_tradesman.jpg',
    title: 'PowerVolt Generator & Electrical Works',
    area: 'Trans-Amadi, Port Harcourt · ★ 4.9 Verified'
  },
  {
    proId: 'pro-3',
    image: '/assets/interior_pop.jpg',
    title: 'Prime POP & Architectural Ceilings',
    area: 'Woji, Port Harcourt · ★ 4.8 Verified'
  },
  {
    proId: 'pro-4',
    image: '/assets/solar_tech.jpg',
    title: 'SunWave Solar & Clean Energy',
    area: 'Peter Odili Road, Port Harcourt · ★ 4.9 Verified'
  },
  {
    proId: 'pro-2',
    image: '/assets/hairstylist.jpg',
    title: 'Crown & Braids Beauty Lounge',
    area: 'New GRA / Phase 2, Port Harcourt · ★ 5.0 Verified'
  }
];

// State
const state = {
  currentView: 'marketplace',
  providers: hydrateProvidersWithCoordinates(JSON.parse(localStorage.getItem('servhive_providers'))),
  reports: JSON.parse(localStorage.getItem('servhive_reports')) || [
    {
      id: 'rep-1',
      providerId: 'pro-5',
      providerName: 'Precision Mobile Auto Diagnostics',
      reason: 'Price discrepancy on site',
      notes: 'Quoted 6000 on app but requested 9000 upon arrival.',
      date: 'Yesterday',
      status: 'pending'
    }
  ],
  escrowJobs: JSON.parse(localStorage.getItem('servhive_escrow_jobs')) || [
    {
      id: 'esc-101',
      proId: 'pro-1',
      proName: 'PowerVolt Generator & Electrical Works',
      serviceName: 'Generator Diagnostic & Servicing',
      amount: 15000,
      area: 'Peter Odili Road',
      address: 'Plot 12, Federal Housing Estate, Peter Odili Rd',
      dateTime: 'Today, 2:00 PM',
      status: 'awaiting_release', // 'in_progress' | 'awaiting_release' | 'completed' | 'disputed'
      createdAt: 'Today',
      commissionPct: 5,
      commissionAmount: 750,
      payoutAmount: 14250
    }
  ],
  selectedCategory: 'all',
  selectedArea: 'All Port Harcourt',
  selectedLandmark: null,
  ratingFilter: 'all', // 'all' | '4.8' | '4.5' | '4.0'
  priceFilter: 'all', // 'all' | 'under-10k' | '10k-25k' | 'above-25k'
  commissionPct: 5,
  monthlySubscriptionRate: 2000,
  boostDailyRate: 500,
  selectedBoostDays: 3,
  userCoords: null, // { lat: number, lng: number, label: string, distanceToLandmark?: number, isSimulated?: boolean }
  searchQuery: '',
  verifiedOnly: false,
  sortBy: 'featured',
  activeChatProvider: null,
  activeProfileModalProvider: null,
  chatMessages: {},
  savedProviderIds: JSON.parse(localStorage.getItem('servhive_saved_providers')) || ['pro-1', 'pro-4'],
  quoteRequests: JSON.parse(localStorage.getItem('servhive_quote_requests')) || [
    {
      id: 'req-201',
      proId: 'pro-1',
      proName: 'PowerVolt Generator & Electrical Works',
      customerName: 'Tonye Briggs',
      customerPhone: '0803 123 4567',
      area: 'Peter Odili Road',
      address: 'Plot 14, Off Peter Odili Rd, Trans-Amadi Gardens',
      title: 'ATS Changeover Switch Malfunction & Generator Servicing',
      details: 'Mikano 27kVA changeover switch fails to switch when grid drops. Needs urgent on-site diagnostics.',
      preferredDate: 'Tomorrow, 10:00 AM',
      status: 'pending', // 'pending' | 'quoted' | 'accepted' | 'declined'
      quoteAmount: null,
      createdAt: 'Today, 9:30 AM'
    },
    {
      id: 'req-202',
      proId: 'pro-4',
      proName: 'SunWave Solar & Clean Energy',
      customerName: 'Arch. Belema D.',
      customerPhone: '0802 987 6543',
      area: 'Woji',
      address: 'Golf Estate Phase 2, Woji',
      title: '5kVA Solar Inverter Setup with Lithium Battery Balancing',
      details: 'Need certified installation for 5kVA Felicity hybrid inverter with 48V 200Ah lithium battery bank.',
      preferredDate: 'Friday, 11:00 AM',
      status: 'quoted',
      quoteAmount: 45000,
      quoteNotes: 'Includes complete DC surge protection, battery cable lugs, and 3-month installation warranty.',
      createdAt: 'Yesterday'
    }
  ],
  // Authentication & Role State
  authMode: 'login', // 'login' | 'signup'
  authRole: 'hirer', // 'hirer' | 'artisan'
  currentUser: JSON.parse(localStorage.getItem('servhive_current_user')) || null,
  users: JSON.parse(localStorage.getItem('servhive_users')) || [
    {
      id: 'usr-1',
      name: 'Tonye Briggs',
      email: 'tonye@example.com',
      phone: '08034567890',
      role: 'hirer',
      area: 'Peter Odili Road',
      password: 'password123',
      createdAt: '2026-09-15'
    },
    {
      id: 'usr-2',
      name: 'Engr. Emeka Obi',
      businessName: 'PowerVolt Generator & Electrical Works',
      email: 'emeka@powervolt.ng',
      phone: '08023456789',
      role: 'artisan',
      trade: 'Generator & Inverter Specialist',
      category: 'power-gen',
      area: 'Trans-Amadi',
      password: 'password123',
      createdAt: '2026-08-10'
    }
  ]
};

function persistState() {
  localStorage.setItem('servhive_providers', JSON.stringify(state.providers));
  localStorage.setItem('servhive_reports', JSON.stringify(state.reports));
  localStorage.setItem('servhive_escrow_jobs', JSON.stringify(state.escrowJobs));
  localStorage.setItem('servhive_users', JSON.stringify(state.users));
  localStorage.setItem('servhive_saved_providers', JSON.stringify(state.savedProviderIds));
  localStorage.setItem('servhive_quote_requests', JSON.stringify(state.quoteRequests));
  if (state.currentUser) {
    localStorage.setItem('servhive_current_user', JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem('servhive_current_user');
  }
}

function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG');
}

// Great-circle Haversine Distance in Kilometers
function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') {
    return 0;
  }
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal place e.g. 1.8
}

// Geolocation Auto-Detection Engine
window.detectClientLocation = function() {
  const geoBtn = document.getElementById('geoDetectBtn');
  const btnText = geoBtn ? geoBtn.querySelector('.geo-btn-text') : null;

  if (btnText) btnText.textContent = 'Detecting...';
  if (geoBtn) geoBtn.classList.add('active');

  const onCoordsResolved = (latitude, longitude, isRealGps = true) => {
    // Port Harcourt geographic center (Pleasure Park / Aba Road corridor)
    const phCenterLat = 4.8156;
    const phCenterLng = 7.0498;
    const distFromPH = getDistanceKm(latitude, longitude, phCenterLat, phCenterLng);

    let clientLat = latitude;
    let clientLng = longitude;
    let isSimulated = false;
    let noticeTitle = 'Location Detected';
    let noticeMessage = '';

    // If client is outside Port Harcourt (> 65km away), e.g. overseas IP or local dev environment
    if (distFromPH > 65) {
      // Gracefully snap to central Port Harcourt landmark
      clientLat = 4.8320;
      clientLng = 7.0125;
      isSimulated = true;
      noticeTitle = 'PH Proximity Preview Mode';
      noticeMessage = 'Your current location is outside Port Harcourt. For this demo, your location has been centered at <strong>Pleasure Park / Bori Camp (Aba Road)</strong> so you can experience proximity sorting and auto-suggestions to local businesses.';
    }

    // Find closest PH landmark to client position
    let closestLandmark = PH_LANDMARKS[0];
    let minDistance = Infinity;
    PH_LANDMARKS.forEach(l => {
      const d = getDistanceKm(clientLat, clientLng, l.lat, l.lng);
      if (d < minDistance) {
        minDistance = d;
        closestLandmark = l;
      }
    });

    state.userCoords = {
      lat: clientLat,
      lng: clientLng,
      label: closestLandmark.name,
      distanceToLandmark: minDistance,
      isSimulated: isSimulated
    };
    state.selectedLandmark = null;
    state.selectedArea = 'All Port Harcourt';

    if (btnText) btnText.textContent = '📍 Active';
    if (geoBtn) geoBtn.classList.add('active');

    const areaSelect = document.getElementById('heroAreaSelect');
    if (areaSelect) areaSelect.value = 'All Port Harcourt';

    renderProviders();

    // Scroll smoothly to directory
    const dirEl = document.getElementById('directory');
    if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });

    if (isSimulated) {
      showAppNotice({
        icon: '📍',
        eyebrow: 'PH GEOLOCATION SIMULATOR',
        title: noticeTitle,
        message: noticeMessage,
        confirmText: 'Explore Closest Artisans'
      });
    } else {
      showAppNotice({
        icon: '📍',
        eyebrow: 'LOCATION DETECTED',
        title: `Near ${closestLandmark.shortName}`,
        message: `Your location in Port Harcourt was successfully detected (~${minDistance} km from <strong>${closestLandmark.name}</strong>). Verified businesses are now sorted with closest travel distance first.`,
        confirmText: 'View Closest Businesses'
      });
    }
  };

  if (!navigator.geolocation) {
    if (btnText) btnText.textContent = 'Near Me';
    if (geoBtn) geoBtn.classList.remove('active');
    // Fallback to Pleasure Park
    onCoordsResolved(4.8320, 7.0125, false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onCoordsResolved(pos.coords.latitude, pos.coords.longitude, true);
    },
    (err) => {
      // Graceful fallback to Pleasure Park if permission denied or unavailable
      onCoordsResolved(4.8320, 7.0125, false);
    },
    { timeout: 7000, enableHighAccuracy: true }
  );
};

// Reset Location Filter
window.clearLocationFilter = function() {
  state.userCoords = null;
  state.selectedLandmark = null;
  state.selectedArea = 'All Port Harcourt';

  const geoBtn = document.getElementById('geoDetectBtn');
  const btnText = geoBtn ? geoBtn.querySelector('.geo-btn-text') : null;
  if (btnText) btnText.textContent = 'Near Me';
  if (geoBtn) geoBtn.classList.remove('active');

  const areaSelect = document.getElementById('heroAreaSelect');
  if (areaSelect) areaSelect.value = 'All Port Harcourt';

  renderProviders();
};

// Direct Landmark Filtering (Footer, Chips & Dropdown)
window.filterByLandmark = function(landmarkName) {
  const landmark = PH_LANDMARKS.find(l => 
    l.name.toLowerCase() === landmarkName.toLowerCase() ||
    l.shortName.toLowerCase() === landmarkName.toLowerCase() ||
    landmarkName.toLowerCase().includes(l.shortName.toLowerCase()) ||
    l.name.toLowerCase().includes(landmarkName.toLowerCase())
  );

  state.selectedLandmark = landmark ? landmark.name : landmarkName;
  state.selectedCategory = 'all';

  if (landmark) {
    state.userCoords = {
      lat: landmark.lat,
      lng: landmark.lng,
      label: landmark.name,
      distanceToLandmark: 0,
      isSimulated: false
    };
  }

  // Sync dropdown
  const areaSelect = document.getElementById('heroAreaSelect');
  if (areaSelect) {
    areaSelect.value = landmark ? landmark.name : 'All Port Harcourt';
  }

  // Update geo button
  const geoBtn = document.getElementById('geoDetectBtn');
  const btnText = geoBtn ? geoBtn.querySelector('.geo-btn-text') : null;
  if (btnText) btnText.textContent = '📍 ' + (landmark ? landmark.shortName : 'Landmark');
  if (geoBtn) geoBtn.classList.add('active');

  renderFilterPills();
  renderProviders();

  const dirEl = document.getElementById('directory');
  if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });
};

// Quick Search from Hero Chips
window.quickSearch = function(query) {
  state.searchQuery = query;
  const input = document.getElementById('heroSearchInput');
  if (input) input.value = query;
  renderProviders();
  const dirEl = document.getElementById('directory');
  if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });
};

// Escolha Digital Split-Screen Showcase Switcher
window.switchFeaturedShowcase = function(index, el) {
  document.querySelectorAll('.ed-project-item').forEach(item => item.classList.remove('active'));
  if (el) el.classList.add('active');

  const item = SHOWCASE_ITEMS[index];
  if (!item) return;

  const img = document.getElementById('featuredShowcaseImg');
  const title = document.getElementById('featuredShowcaseTitle');
  const area = document.getElementById('featuredShowcaseArea');

  if (img) {
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = item.image;
      img.style.opacity = '1';
    }, 200);
  }

  if (title) title.textContent = item.title;
  if (area) area.textContent = item.area;
};

// Category Filter Synchronization (Dropdown)
function renderFilterPills() {
  const select = document.getElementById('categoryFilterSelect');
  if (select && select.value !== state.selectedCategory) {
    select.value = state.selectedCategory;
  }
}

window.selectCategory = function(catId) {
  state.selectedCategory = catId || 'all';
  const select = document.getElementById('categoryFilterSelect');
  if (select && select.value !== state.selectedCategory) {
    select.value = state.selectedCategory;
  }
  renderProviders();
};

// Render Providers with Proximity Auto-Suggest, Boost Prioritization & Filters
function renderProviders() {
  const grid = document.getElementById('providersGrid');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  let filtered = state.providers.filter(p => p.status === 'approved');

  // 1. Category filter (10 core sectors or 'all')
  if (state.selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === state.selectedCategory);
  }

  // 2. Rating filter (e.g. 4.8+, 4.5+, 4.0+)
  if (state.ratingFilter && state.ratingFilter !== 'all') {
    const minRating = parseFloat(state.ratingFilter);
    filtered = filtered.filter(p => p.rating >= minRating);
  }

  // 3. Price filter (under-10k, 10k-25k, above-25k)
  if (state.priceFilter && state.priceFilter !== 'all') {
    if (state.priceFilter === 'under-10k') {
      filtered = filtered.filter(p => p.startingPrice < 10000);
    } else if (state.priceFilter === '10k-25k') {
      filtered = filtered.filter(p => p.startingPrice >= 10000 && p.startingPrice <= 25000);
    } else if (state.priceFilter === 'above-25k') {
      filtered = filtered.filter(p => p.startingPrice > 25000);
    }
  }

  // 4. Selected Landmark filter
  if (state.selectedLandmark) {
    const targetLm = state.selectedLandmark.toLowerCase();
    const targetObj = PH_LANDMARKS.find(l => l.name.toLowerCase() === targetLm || l.shortName.toLowerCase() === targetLm);
    const targetZone = targetObj ? targetObj.zone.toLowerCase() : '';

    const exactMatches = filtered.filter(p => {
      const matchLm = p.landmarks && p.landmarks.some(lm => lm.toLowerCase().includes(targetLm) || targetLm.includes(lm.toLowerCase()));
      const matchZone = targetZone && p.area.toLowerCase().includes(targetZone);
      return matchLm || matchZone;
    });

    if (exactMatches.length > 0) {
      filtered = exactMatches;
    }
  } else if (state.selectedArea !== 'All Port Harcourt') {
    // Area filter from dropdown
    const selArea = state.selectedArea.toLowerCase();
    filtered = filtered.filter(p => 
      p.area.toLowerCase().includes(selArea) ||
      (p.landmarks && p.landmarks.some(lm => lm.toLowerCase().includes(selArea)))
    );
  }

  // 5. Search query filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    const matchedLandmarks = PH_LANDMARKS.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.shortName.toLowerCase().includes(q) ||
      l.keywords.some(k => k.includes(q) || q.includes(k))
    ).map(l => l.name.toLowerCase());

    filtered = filtered.filter(p => {
      const basicMatch = 
        p.name.toLowerCase().includes(q) ||
        p.businessName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.subSpecialty.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.services.some(s => s.name.toLowerCase().includes(q));

      const landmarkMatch = p.landmarks && p.landmarks.some(lm => 
        lm.toLowerCase().includes(q) ||
        matchedLandmarks.some(ml => lm.toLowerCase().includes(ml))
      );

      return basicMatch || landmarkMatch;
    });
  }

  // 6. Verified only filter
  if (state.verifiedOnly) {
    filtered = filtered.filter(p => p.verified);
  }

  // 7. Calculate distance to each provider if userCoords is active
  if (state.userCoords) {
    filtered.forEach(p => {
      p.distanceKm = getDistanceKm(state.userCoords.lat, state.userCoords.lng, p.lat, p.lng);
    });
  } else {
    filtered.forEach(p => {
      delete p.distanceKm;
    });
  }

  // 8. Sorting: In 'featured' mode, BOOSTED PROVIDERS ARE PLACED NEAR THE TOP!
  if (state.sortBy === 'featured') {
    filtered.sort((a, b) => {
      const boostA = a.boosted ? 1 : 0;
      const boostB = b.boosted ? 1 : 0;
      if (boostA !== boostB) return boostB - boostA; // Boosted pros first!
      if (state.userCoords && a.distanceKm !== undefined && b.distanceKm !== undefined) {
        return a.distanceKm - b.distanceKm;
      }
      return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
    });
  } else if (state.sortBy === 'distance' && state.userCoords) {
    filtered.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  } else if (state.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'price-low') {
    filtered.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (state.sortBy === 'reviews') {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  // 9. Render Boosted Top Ribbon Showcase
  const ribbonEl = document.getElementById('boostedTopRibbon');
  const boostedPros = state.providers.filter(p => p.status === 'approved' && p.boosted);
  if (ribbonEl) {
    if (boostedPros.length > 0 && state.selectedCategory === 'all' && !state.searchQuery) {
      ribbonEl.style.display = 'block';
      ribbonEl.innerHTML = `
        <div class="boosted-ribbon-wrap">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
              <span class="badge ed-badge-boosted">⚡ Boosted Spotlight</span>
              <span style="font-size: 0.76rem; color: var(--muted-foreground);">Verified Port Harcourt Pros</span>
            </div>
            <div style="font-weight: 800; font-size: 0.94rem; color: var(--foreground);">
              Boosted Providers Near the Top
            </div>
          </div>
          <div style="display: flex; gap: 10px; overflow-x: auto; max-width: 100%; padding-bottom: 4px;">
            ${boostedPros.map(bp => `
              <div style="display: flex; align-items: center; gap: 10px; background: var(--bg-surface-subtle); border: 1px solid var(--hairline-amber); border-radius: var(--radius-sm); padding: 8px 12px; cursor: pointer; white-space: nowrap;" onclick="openProfileModal('${bp.id}')">
                <img src="${bp.image}" alt="${bp.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                <div>
                  <div style="font-weight: 800; font-size: 0.84rem; color: var(--foreground);">${bp.businessName}</div>
                  <div style="font-size: 0.72rem; color: var(--muted-foreground);">${bp.area} · ★ ${bp.rating}</div>
                </div>
                <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.72rem; padding: 3px 8px; height: 26px;">
                  Profile
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      ribbonEl.style.display = 'none';
    }
  }

  // Count indicator
  if (countEl) {
    let contextStr = 'Port Harcourt';
    if (state.userCoords) {
      contextStr = `near ${state.userCoords.label} (Closest First)`;
    } else if (state.selectedLandmark) {
      contextStr = `near ${state.selectedLandmark}`;
    } else if (state.selectedArea !== 'All Port Harcourt') {
      contextStr = state.selectedArea;
    }
    countEl.textContent = `Showing ${filtered.length} verified artisans in ${contextStr}`;
  }

  // Active Geolocation Proximity Banner
  const bannerHtml = state.userCoords ? `
    <div class="ed-geo-active-banner" style="grid-column: 1 / -1;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="color: var(--primary); display: flex; align-items: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div>
          <div style="font-weight: 700; font-size: 0.9375rem; color: var(--foreground);">
            Proximity Auto-Suggest Active: Near <strong>${state.userCoords.label}</strong>
          </div>
          <div style="font-size: 0.8125rem; color: var(--muted-foreground); margin-top: 2px;">
            ${state.userCoords.isSimulated ? 'Simulated around PH central landmark. ' : 'GPS auto-detected. '}
            Displaying verified businesses sorted by closest travel distance in Port Harcourt.
          </div>
        </div>
      </div>
      <button class="ed-button ed-button-black ed-btn-compact" onclick="clearLocationFilter()" style="padding: 6px 12px; font-size: 0.8125rem;">
        <span>Reset Proximity</span>
      </button>
    </div>
  ` : '';

  if (filtered.length === 0) {
    grid.innerHTML = bannerHtml + `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
        <div style="margin-bottom: 16px; color: var(--muted-foreground);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--foreground);">No verified artisans found for these filters</h3>
        <p style="color: var(--muted-foreground); margin-top: 6px; font-size: 0.9375rem;">Try adjusting your rating, price range, or Port Harcourt area selection.</p>
        <button class="ed-button ed-button-amber" style="margin-top: 20px;" onclick="resetFilters()">
          <span>Reset All Filters</span>
        </button>
      </div>
    `;
    return;
  }

  // Render provider cards
  grid.innerHTML = bannerHtml + filtered.map(pro => {
    const isSaved = state.savedProviderIds && state.savedProviderIds.includes(pro.id);
    const primaryService = pro.services && pro.services[0] ? pro.services[0] : { name: 'General Trade Service', price: pro.startingPrice };
    
    return `
      <article class="ed-pro-card">
        <div class="ed-pro-header-row">
          <img class="ed-pro-avatar" src="${pro.image}" alt="${pro.name}" loading="lazy" />
          <div class="ed-pro-title-wrap">
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">${pro.categoryName}</div>
            <h3 class="ed-pro-name">${pro.businessName}</h3>
            <div class="ed-pro-subtitle">${pro.name}</div>
          </div>
          <button class="ed-heart-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleSaveProvider('${pro.id}')" title="${isSaved ? 'Remove from Saved' : 'Save Provider'}" aria-label="Save Provider">
            ${isSaved ? '♥' : '♡'}
          </button>
        </div>

        <div class="ed-pro-meta-chips">
          ${pro.boosted ? `
            <span class="badge ed-badge-boosted">
              ⚡ Boosted Pro
            </span>
          ` : ''}
          ${pro.verified ? `
            <span class="badge ed-badge-verified">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Rivers Verified Pro
            </span>
          ` : ''}
          <div class="badge badge-outline" style="font-size: 0.75rem; gap: 4px;">
            <span style="color: var(--primary);">★</span> ${pro.rating.toFixed(1)} <span style="color: var(--muted-foreground); font-weight: 500;">(${pro.reviewCount})</span>
          </div>
          <span class="badge badge-secondary">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${pro.area}
          </span>
          <span class="badge badge-secondary" style="font-weight: 700; color: var(--teal);">
            📍 ${pro.distanceKm !== undefined ? pro.distanceKm + ' km away' : '~1.2 km away'}
          </span>
          <span class="badge badge-secondary" style="font-size: 0.72rem; gap: 4px;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${pro.responseTime}
          </span>
        </div>

        <p class="ed-pro-bio">${pro.bio}</p>

        <div class="ed-card-footer">
          <div class="ed-pro-price-value" style="font-size: 1.05rem; font-weight: 800;">
            <span style="font-size: 0.72rem; font-weight: 600; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.3px; display: block; margin-bottom: 1px;">From</span>${formatNaira(pro.startingPrice)}
          </div>

          <div class="ed-pro-actions">
            <button class="ed-button ed-button-black ed-btn-compact" onclick="openProfileModal('${pro.id}')">
              <span>Profile &amp; Photos</span>
            </button>
            <button class="ed-button ed-button-amber ed-btn-compact" onclick="openEscrowBookingModal('${pro.id}', '${primaryService.name.replace(/'/g, "\\'")}', ${primaryService.price})">
              <span>Request / Book</span>
            </button>
            <button class="ed-button ed-button-black ed-btn-compact" style="width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center;" title="In-App Masked Chat &amp; Quote" onclick="openChatDrawer('${pro.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.resetFilters = function() {
  state.selectedCategory = 'all';
  state.selectedArea = 'All Port Harcourt';
  state.selectedLandmark = null;
  state.userCoords = null;
  state.searchQuery = '';
  state.verifiedOnly = false;
  state.ratingFilter = 'all';
  state.priceFilter = 'all';
  state.sortBy = 'featured';

  const areaSelect = document.getElementById('heroAreaSelect');
  const catFilterSelect = document.getElementById('categoryFilterSelect');
  const filterAreaSelect = document.getElementById('filterAreaSelect');
  const ratingSelect = document.getElementById('ratingFilterSelect');
  const priceSelect = document.getElementById('priceFilterSelect');
  const searchInput = document.getElementById('heroSearchInput');
  const verifiedCheckbox = document.getElementById('verifiedOnlyCheckbox');
  const sortSelect = document.getElementById('sortSelect');
  const geoBtn = document.getElementById('geoDetectBtn');
  const btnText = geoBtn ? geoBtn.querySelector('.geo-btn-text') : null;

  if (areaSelect) areaSelect.value = 'All Port Harcourt';
  if (catFilterSelect) catFilterSelect.value = 'all';
  if (filterAreaSelect) filterAreaSelect.value = 'All Port Harcourt';
  if (ratingSelect) ratingSelect.value = 'all';
  if (priceSelect) priceSelect.value = 'all';
  if (searchInput) searchInput.value = '';
  if (verifiedCheckbox) verifiedCheckbox.checked = false;
  if (sortSelect) sortSelect.value = 'featured';
  if (btnText) btnText.textContent = 'Near Me';
  if (geoBtn) geoBtn.classList.remove('active');

  renderFilterPills();
  renderProviders();
};

// Toggle Save / Bookmark Provider
window.toggleSaveProvider = function(proId) {
  if (!state.savedProviderIds) state.savedProviderIds = [];
  const idx = state.savedProviderIds.indexOf(proId);
  const pro = state.providers.find(p => p.id === proId);

  if (idx > -1) {
    state.savedProviderIds.splice(idx, 1);
  } else {
    state.savedProviderIds.push(proId);
  }

  persistState();
  renderProviders();
  updateAuthUI();

  // If My Account modal is open, re-render it
  const myAccModal = document.getElementById('myAccountModal');
  if (myAccModal && myAccModal.classList.contains('open')) {
    renderMyAccountView();
  }

  // If Profile modal is open, update save button
  const saveBtn = document.getElementById('profileSaveBtn');
  if (saveBtn) {
    const isNowSaved = state.savedProviderIds.includes(proId);
    saveBtn.innerHTML = isNowSaved ? '<span>♥ Saved Provider</span>' : '<span>♡ Save Provider</span>';
  }
};

// Work Photo Zoom Lightbox
window.openPhotoZoom = function(url, caption) {
  const modal = document.getElementById('photoZoomModal');
  const img = document.getElementById('photoZoomImg');
  const cap = document.getElementById('photoZoomCaption');
  if (!modal || !img) return;

  img.src = url;
  if (cap) cap.textContent = caption || 'Verified on-site work sample in Port Harcourt';
  modal.classList.add('open');
};

// Profile Modal with Photos of Past Work, Rate Cards, Reviews, Chat or Book
window.openProfileModal = function(proId) {
  const pro = state.providers.find(p => p.id === proId);
  if (!pro) return;

  state.activeProfileModalProvider = pro;
  const modal = document.getElementById('profileModal');
  const modalBody = document.getElementById('profileModalBody');
  const isSaved = state.savedProviderIds && state.savedProviderIds.includes(pro.id);
  const primaryService = pro.services && pro.services[0] ? pro.services[0] : { name: 'Standard Service', price: pro.startingPrice };

  modalBody.innerHTML = `
    <div style="height: 220px; position: relative; overflow: hidden; background: #0F141C;">
      <img src="${pro.image}" alt="${pro.name}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" />
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);"></div>
      <div style="position: absolute; bottom: 16px; left: 24px; display: flex; gap: 8px; flex-wrap: wrap;">
        ${pro.boosted ? `<span class="badge ed-badge-boosted">⚡ Boosted Pro</span>` : ''}
        <span class="ed-badge-verified" style="background: var(--teal); color: #FFFFFF;">✓ Rivers Verified Pro</span>
        <span style="background: rgba(0,0,0,0.65); color: #FFFFFF; padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.76rem; font-weight: 700;">📍 ${pro.area}, Port Harcourt</span>
      </div>
    </div>

    <div style="padding: 28px;">
      <!-- Title & Rating -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; color: var(--foreground);">${pro.businessName}</h2>
          <div style="font-size: 0.9rem; color: var(--muted-foreground); font-weight: 600;">Lead Pro: ${pro.name} • ${pro.subSpecialty}</div>
        </div>
        <div style="text-align: right; display: flex; align-items: center; gap: 10px;">
          <button id="profileSaveBtn" class="ed-button ed-button-black ed-btn-compact" onclick="toggleSaveProvider('${pro.id}')">
            <span>${isSaved ? '♥ Saved Provider' : '♡ Save Provider'}</span>
          </button>
          <div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--amber-dark);">★ ${pro.rating.toFixed(1)}</div>
            <div style="font-size: 0.76rem; color: var(--muted-foreground);">${pro.reviewCount} client reviews</div>
          </div>
        </div>
      </div>

      <!-- About the Service -->
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.86rem; font-weight: 800; margin-bottom: 6px; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">About the Service</h4>
        <p style="color: var(--muted-foreground); font-size: 0.92rem; line-height: 1.6;">${pro.bio}</p>
      </div>

      <!-- Photos of Past Work (Specification Requirement) -->
      <div style="margin-bottom: 26px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 0.86rem; font-weight: 800; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">
            Photos of Past Work (${(pro.workPhotos || []).length})
          </h4>
          <span style="font-size: 0.76rem; color: var(--muted-foreground);">Verified Port Harcourt Projects</span>
        </div>
        <div class="pro-work-gallery">
          ${(pro.workPhotos || []).map(wp => `
            <div class="pro-work-photo-card" onclick="openPhotoZoom('${wp.url}', '${wp.caption.replace(/'/g, "\\'")}')">
              <img src="${wp.url}" alt="${wp.caption}" loading="lazy" />
              <div class="pro-work-photo-caption">
                ${wp.caption}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Services and Prices (Transparent Rate Card) -->
      <div style="margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 0.86rem; font-weight: 800; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">Services and Transparent Prices</h4>
          <span style="font-size: 0.76rem; color: var(--teal); font-weight: 700;">100% Escrow Protected</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${pro.services.map(s => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); gap: 12px; flex-wrap: wrap;">
              <div>
                <div style="font-weight: 800; font-size: 0.92rem; color: var(--foreground);">${s.name}</div>
                <div style="font-size: 0.75rem; color: var(--muted-foreground);">${s.type}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-weight: 800; color: var(--amber-dark); font-size: 1.05rem;">
                  ${formatNaira(s.price)}
                </div>
                <button class="ed-button ed-button-amber ed-btn-compact" onclick="openEscrowBookingModal('${pro.id}', '${s.name.replace(/'/g, "\\'")}', ${s.price}); closeModal('profileModal');">
                  <span>Book / Request</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Action Buttons: Chat or Request / Book -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px;">
        <button class="ed-button ed-button-black" style="padding: 13px;" onclick="openChatDrawer('${pro.id}', true); closeModal('profileModal');">
          <span>💬 Chat &amp; Describe Job (Get Quote)</span>
        </button>
        <button class="ed-button ed-button-amber" style="padding: 13px;" onclick="openEscrowBookingModal('${pro.id}', '${primaryService.name.replace(/'/g, "\\'")}', ${primaryService.price}); closeModal('profileModal');">
          <span>🛡️ Request / Book with Escrow</span>
        </button>
      </div>

      <!-- Reviews -->
      <div style="border-top: 1px solid var(--border); padding-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground);">Client Reviews (${pro.reviews.length})</h4>
          <button class="ed-button ed-button-black ed-btn-compact" onclick="showAddReviewPrompt('${pro.id}')">
            <span>+ Add Review</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${pro.reviews.map(r => `
            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 18px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 800; font-size: 0.9rem; color: var(--foreground);">${r.author} <small style="color: var(--muted-foreground); font-weight: 500;">(${r.area})</small></span>
                <span style="color: var(--amber-dark); font-size: 0.85rem; font-weight: 800;">★ ${r.rating}</span>
              </div>
              <p style="font-size: 0.86rem; color: var(--muted-foreground); line-height: 1.45;">${r.text}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Report problem link -->
      <div style="margin-top: 24px; text-align: center;">
        <button style="background: none; border: none; color: #DC2626; font-size: 0.8rem; font-weight: 700; cursor: pointer;" onclick="openReportModal('${pro.id}', '${pro.businessName}')">
          ⚠️ Report a problem with this provider
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
};

window.openProBenefitsModal = function() {
  const modal = document.getElementById('proBenefitsModal');
  if (modal) modal.classList.add('open');
};

window.openPrivacyInfoModal = function() {
  const modal = document.getElementById('privacyInfoModal');
  if (modal) modal.classList.add('open');
};

window.showCallMaskModal = function(proName) {
  window.openPrivacyInfoModal();
};

window.showAppNotice = function({
  icon = '🛡️',
  eyebrow = 'PORT HARCOURT ESCROW',
  title = 'Notice',
  message = '',
  confirmText = 'OK',
  cancelText = null,
  onConfirm = null,
  onCancel = null
} = {}) {
  const modal = document.getElementById('appNoticeModal');
  if (!modal) return;

  const iconEl = document.getElementById('noticeModalIcon');
  const eyebrowEl = document.getElementById('noticeModalEyebrow');
  const titleEl = document.getElementById('noticeModalTitle');
  const messageEl = document.getElementById('noticeModalMessage');
  const confirmBtn = document.getElementById('noticeModalConfirmBtn');
  const cancelBtn = document.getElementById('noticeModalCancelBtn');

  if (iconEl) iconEl.textContent = icon;
  if (eyebrowEl) eyebrowEl.textContent = eyebrow;
  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.innerHTML = message.replace(/\n/g, '<br>');

  if (confirmBtn) {
    confirmBtn.textContent = confirmText;
    confirmBtn.onclick = () => {
      closeModal('appNoticeModal');
      if (typeof onConfirm === 'function') onConfirm();
    };
  }

  if (cancelBtn) {
    if (cancelText) {
      cancelBtn.style.display = 'inline-flex';
      cancelBtn.textContent = cancelText;
      cancelBtn.onclick = () => {
        closeModal('appNoticeModal');
        if (typeof onCancel === 'function') onCancel();
      };
    } else {
      cancelBtn.style.display = 'none';
    }
  }

  modal.classList.add('open');
};

window.showAddReviewPrompt = function(proId) {
  const pro = state.providers.find(p => p.id === proId);
  if (!pro) return;

  const reviewModal = document.getElementById('reviewPromptModal');
  if (reviewModal) {
    document.getElementById('reviewProId').value = proId;
    document.getElementById('reviewProTitle').textContent = `Reviewing: ${pro.businessName} (${pro.area})`;
    document.getElementById('reviewComment').value = '';
    document.getElementById('reviewRating').value = '5';
    reviewModal.classList.add('open');
  }
};

window.handleReviewSubmit = function(e) {
  e.preventDefault();
  const proId = document.getElementById('reviewProId').value;
  const rating = Number(document.getElementById('reviewRating').value) || 5;
  const comment = document.getElementById('reviewComment').value.trim();

  const pro = state.providers.find(p => p.id === proId);
  if (!pro || !comment) return;

  pro.reviews.unshift({
    author: 'Verified Customer',
    area: state.selectedArea === 'All Port Harcourt' ? 'Port Harcourt' : state.selectedArea,
    rating: rating,
    date: 'Just now',
    text: comment
  });
  pro.reviewCount += 1;
  persistState();
  closeModal('reviewPromptModal');
  openProfileModal(proId);
  renderProviders();

  showAppNotice({
    icon: '✓',
    eyebrow: 'FEEDBACK RECEIVED',
    title: 'Review Published',
    message: `Thank you for reviewing <strong>${pro.businessName}</strong>. Your feedback helps uphold service standards across Port Harcourt.`,
    confirmText: 'Done'
  });
};

// Chat Drawer & Job Quote Engine
window.openChatDrawer = function(proId, quoteMode = false) {
  const pro = state.providers.find(p => p.id === proId);
  if (!pro) return;

  state.activeChatProvider = pro;
  const drawer = document.getElementById('chatDrawer');
  const proNameEl = document.getElementById('chatProName');
  const proAvatarEl = document.getElementById('chatProAvatar');
  const quoteProNameEl = document.getElementById('chatQuoteProName');

  if (proNameEl) proNameEl.textContent = pro.businessName;
  if (proAvatarEl) proAvatarEl.src = pro.image;
  if (quoteProNameEl) quoteProNameEl.textContent = pro.businessName;

  if (!state.chatMessages[pro.id]) {
    state.chatMessages[pro.id] = [
      { sender: 'provider', text: `Hello! Thanks for reaching out to ${pro.businessName}. How can I assist with your service in Port Harcourt today?` }
    ];
  }

  if (quoteMode) {
    switchChatTab('quote');
  } else {
    switchChatTab('chat');
  }

  renderChatMessages();
  drawer.classList.add('open');
};

window.closeChatDrawer = function() {
  document.getElementById('chatDrawer').classList.remove('open');
};

window.switchChatTab = function(tab) {
  const chatLive = document.getElementById('chatLiveArea');
  const quoteForm = document.getElementById('chatQuoteFormArea');
  const tabChat = document.getElementById('chatTabMessages');
  const tabQuote = document.getElementById('chatTabQuote');

  if (tab === 'quote') {
    if (chatLive) chatLive.style.display = 'none';
    if (quoteForm) quoteForm.style.display = 'flex';
    if (tabChat) tabChat.classList.remove('active');
    if (tabQuote) tabQuote.classList.add('active');
  } else {
    if (chatLive) chatLive.style.display = 'flex';
    if (quoteForm) quoteForm.style.display = 'none';
    if (tabChat) tabChat.classList.add('active');
    if (tabQuote) tabQuote.classList.remove('active');
  }
};

function renderChatMessages() {
  const container = document.getElementById('chatMessages');
  if (!container || !state.activeChatProvider) return;

  const msgs = state.chatMessages[state.activeChatProvider.id] || [];
  container.innerHTML = msgs.map(m => {
    if (m.isQuote) {
      return `
        <div class="quote-proposal-card" style="align-self: flex-start; max-width: 90%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="hero-eyebrow" style="margin: 0; color: var(--amber-dark);">OFFICIAL QUOTE PROPOSAL</span>
            <span class="badge ed-badge-verified" style="font-size: 0.7rem;">5% Escrow Protected</span>
          </div>
          <div style="font-weight: 800; font-size: 1.05rem; color: var(--canvas);">${m.serviceName || 'Requested Trade Service'}</div>
          <div style="font-size: 1.45rem; font-weight: 900; color: var(--amber-dark); margin: 6px 0;">${formatNaira(m.amount)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; line-height: 1.45;">
            <strong>Turnaround:</strong> ${m.duration || 'Same day'}<br>
            <strong>Scope &amp; Notes:</strong> ${m.notes || 'Full diagnostic inspection, specialized tools & guaranteed workmanship.'}
          </div>
          <div style="font-size: 0.74rem; color: var(--teal); margin-bottom: 12px; font-weight: 700;">
            🔒 100% Escrow Protection: Funds held safely until you confirm completion.
          </div>
          <button class="ed-button ed-button-amber" style="width: 100%; padding: 10px; font-size: 0.86rem;" onclick="acceptQuoteAndPayEscrow('${m.quoteId}', '${state.activeChatProvider.id}', '${m.serviceName || 'Requested Trade Service'}', ${m.amount})">
            <span>Accept Quote &amp; Pay into Escrow &rarr;</span>
          </button>
        </div>
      `;
    }

    return `
      <div style="max-width: 82%; padding: 12px 16px; border-radius: 14px; font-size: 0.88rem; line-height: 1.45; ${m.sender === 'provider' ? 'align-self: flex-start; background: var(--chat-bubble-peer); border: 1px solid var(--hairline); color: var(--canvas);' : 'align-self: flex-end; background: var(--amber); color: var(--ink); font-weight: 700;'}">
        ${m.text}
      </div>
    `;
  }).join('');
  container.scrollTop = container.scrollHeight;
}

window.sendChatMessage = function(customText) {
  const input = document.getElementById('chatInput');
  const text = customText || (input ? input.value.trim() : '');
  if (!text || !state.activeChatProvider) return;

  const proId = state.activeChatProvider.id;
  state.chatMessages[proId].push({ sender: 'customer', text: text });
  if (input) input.value = '';
  renderChatMessages();

  setTimeout(() => {
    let reply = "Got it! We cover that neighborhood in Port Harcourt. Can you confirm the exact timing and location?";
    if (text.toLowerCase().includes('quote') || text.toLowerCase().includes('price')) {
      reply = "Our rates are listed on our profile. Is there any custom work required?";
    } else if (text.toLowerCase().includes('peter odili') || text.toLowerCase().includes('gra') || text.toLowerCase().includes('woji')) {
      reply = "Yes, our team can be on site tomorrow morning.";
    }

    state.chatMessages[proId].push({ sender: 'provider', text: reply });
    renderChatMessages();
  }, 1000);
};

window.submitJobQuoteRequest = function(e) {
  e.preventDefault();
  if (!state.activeChatProvider) return;
  const pro = state.activeChatProvider;
  const service = document.getElementById('chatQuoteService').value.trim();
  const area = document.getElementById('chatQuoteArea').value;
  const details = document.getElementById('chatQuoteDetails').value.trim();

  // Add customer request message into chat
  const newMsg = {
    sender: 'customer',
    text: `📋 Requested Official Quote for "${service}" in ${area}.\n\nJob Details: ${details}`
  };
  state.chatMessages[pro.id].push(newMsg);

  // Add into quoteRequests
  const newReq = {
    id: 'req-' + Date.now().toString().slice(-4),
    proId: pro.id,
    proName: pro.businessName,
    customerName: state.currentUser ? state.currentUser.name : 'Tonye Briggs (Client)',
    customerPhone: state.currentUser ? state.currentUser.phone : '0803 123 4567',
    area: area,
    address: `${area}, Port Harcourt`,
    title: service,
    details: details,
    preferredDate: 'Next available dispatch',
    status: 'pending',
    quoteAmount: null,
    createdAt: 'Just now'
  };
  state.quoteRequests.unshift(newReq);
  persistState();

  // Clear inputs and switch back to live chat
  document.getElementById('chatQuoteService').value = '';
  document.getElementById('chatQuoteDetails').value = '';
  switchChatTab('chat');
  renderChatMessages();

  // Simulate automated artisan quote proposal
  setTimeout(() => {
    const defaultQuoteAmount = pro.startingPrice || 15000;
    const quoteMsg = {
      sender: 'provider',
      isQuote: true,
      quoteId: 'quot-' + Date.now().toString().slice(-4),
      serviceName: service,
      amount: defaultQuoteAmount,
      duration: 'Within 3 hours (Same Day)',
      notes: `Diagnostics and professional workmanship for ${service}. 5% platform escrow protection included.`
    };
    newReq.status = 'quoted';
    newReq.quoteAmount = defaultQuoteAmount;
    newReq.quoteNotes = quoteMsg.notes;
    state.chatMessages[pro.id].push(quoteMsg);
    persistState();
    renderChatMessages();
  }, 2000);
};

window.acceptQuoteAndPayEscrow = function(quoteId, proId, serviceName, amount) {
  closeChatDrawer();
  openEscrowBookingModal(proId, serviceName, amount);
};

// Provider Onboarding Wizard
let regState = { step: 1, phone: '', bizName: '', categoryId: '', categoryName: '', isApproval: false };

window.openProviderRegisterModal = function() {
  regState.step = 1;
  document.getElementById('providerRegisterModal').classList.add('open');
  renderRegisterStep();
};

window.renderRegisterStep = function() {
  const body = document.getElementById('registerModalBody');
  if (!body) return;

  if (regState.step === 1) {
    body.innerHTML = `
      <div style="padding: 28px;">
        <div class="hero-eyebrow" style="margin-bottom: 8px;">ARTISAN REGISTRATION</div>
        <h2 style="font-size: 1.7rem; font-weight: 800; margin-bottom: 8px; color: var(--canvas);">Grow Your Service in Port Harcourt</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 24px;">
          Early providers get <strong class="text-amber">1 Month Free on Verified Pro</strong> (₦2,000/mo value).
        </p>

        <form onsubmit="handleRegStep1(event)">
          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 6px;">Phone Number (+234)</label>
            <input type="tel" id="regPhone" placeholder="803 123 4567" required class="ed-search-input" style="height: 48px; border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 0 12px; background: var(--bg-surface);" />
          </div>

          <div style="margin-bottom: 24px;">
            <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 6px;">Business / Trade Name</label>
            <input type="text" id="regBizName" placeholder="e.g. Reliable Generator & AC Repair" required class="ed-search-input" style="height: 48px; border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 0 12px; background: var(--bg-surface);" />
          </div>

          <button type="submit" class="ed-button ed-button-amber" style="width: 100%;">
            <span>Send Verification Code</span>
          </button>
        </form>
      </div>
    `;
  } else if (regState.step === 2) {
    body.innerHTML = `
      <div style="padding: 32px 28px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 12px;">📱</div>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; color: var(--canvas);">Verify Phone</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
          Code sent to <strong>+234 ${regState.phone}</strong> (Simulated: enter 1234)
        </p>

        <form onsubmit="handleRegStep2(event)">
          <input type="text" id="regOtp" maxlength="4" value="1234" required style="font-size: 2rem; letter-spacing: 12px; text-align: center; width: 180px; padding: 10px; background: var(--bg-surface-subtle); border: 2px solid var(--amber); border-radius: 10px; color: var(--canvas); font-family: var(--font-main); font-weight: 800; margin-bottom: 24px;" />
          <button type="submit" class="ed-button ed-button-amber" style="width: 100%;">
            <span>Verify & Continue</span>
          </button>
        </form>
      </div>
    `;
  } else if (regState.step === 3) {
    body.innerHTML = `
      <div style="padding: 28px;">
        <div class="hero-eyebrow" style="margin-bottom: 8px;">TRADE GATING</div>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; color: var(--canvas);">Select Trade Category</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
          Servhive classifies trades to ensure Rivers State trust and safety compliance.
        </p>

        <select id="regCategorySelect" onchange="checkCategoryGating(this.value)" class="ed-select-input" style="width: 100%; height: 50px; border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 0 12px; background: var(--bg-surface); margin-bottom: 18px;">
          <option value="">-- Choose Category --</option>
          <optgroup label="✅ Open Categories (Basic KYC)">
            <option value="open:home-repairs:Home Repairs">Home Repairs (Electrician, Generator, AC)</option>
            <option value="open:interior:Interior & Tiling">Interior Transformation (POP, Tiler, Painter)</option>
            <option value="open:beauty:Beauty & Grooming">Beauty & Grooming (Braids, Stylist)</option>
            <option value="open:solar-tech:Tech & Solar">Tech & Solar (Inverter, CCTV)</option>
            <option value="open:auto:Vehicle Upkeep">Vehicle Upkeep (Mechanic, Panel Beater)</option>
          </optgroup>
          <optgroup label="⚠️ Approval-Required (Licence Mandatory)">
            <option value="approval:home-health:Home Health Aide">Home Health Aide (License Required)</option>
            <option value="approval:laser-tech:Laser Tech & Electrologist">Laser Tech & Electrologist</option>
            <option value="approval:tattoo-piercing:Tattoo & Body Piercer">Tattoo & Body Piercer</option>
            <option value="approval:funeral-director:Funeral Director">Funeral Director</option>
          </optgroup>
          <optgroup label="🚫 Blocked Categories (Prohibited)">
            <option value="blocked:nanny:Nanny / Babysitter">Nanny / Babysitter (Prohibited)</option>
            <option value="blocked:childcare:Childcare / Daycare">Childcare / Daycare (Prohibited)</option>
            <option value="blocked:tutor:Private Tutor">Private Tutor (Prohibited)</option>
          </optgroup>
        </select>

        <div id="gatingFeedbackContainer" style="margin-bottom: 22px;"></div>

        <button id="regStep3Btn" class="ed-button ed-button-amber" style="width: 100%;" onclick="handleRegStep3()" disabled>
          <span>Continue to Verification</span>
        </button>
      </div>
    `;
  } else if (regState.step === 4) {
    body.innerHTML = `
      <div style="padding: 28px;">
        <div class="hero-eyebrow" style="margin-bottom: 8px;">KYC VERIFICATION</div>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; color: var(--canvas);">Upload Credentials</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
          All providers must upload valid government ID and 1 work sample to earn the <strong>Teal Verified Badge</strong>.
        </p>

        <form onsubmit="handleRegStep4(event)">
          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 6px;">Operating Area in Port Harcourt</label>
            <select id="regArea" class="ed-select-input" style="width: 100%; height: 46px; border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 0 12px; background: var(--bg-surface);">
              ${AREAS.filter(a => a !== 'All Port Harcourt').map(a => `<option value="${a}">${a}</option>`).join('')}
            </select>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 6px;">Government ID (NIN / Voter's Card)</label>
            <div style="border: 1px dashed var(--teal-bright); background: var(--bg-surface-subtle); padding: 14px; border-radius: 8px; text-align: center; color: var(--teal); font-size: 0.88rem; font-weight: 700;">
              ✓ NIN_Verification_Uploaded.jpg
            </div>
          </div>

          ${regState.isApproval ? `
            <div style="margin-bottom: 16px; background: var(--bg-surface-subtle); border: 1px solid var(--hairline-amber); padding: 14px; border-radius: 8px;">
              <label style="font-size: 0.85rem; font-weight: 800; color: #D97706; display: block; margin-bottom: 6px;">
                ⚠️ Regulatory License Document (Required for ${regState.categoryName})
              </label>
              <input type="text" id="regLicenseDoc" required value="Rivers State Medical/Practice License #2026-88" class="ed-search-input" style="height: 42px; font-size: 0.84rem; border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 0 12px; background: var(--bg-surface);" />
            </div>
          ` : ''}

          <div style="margin-bottom: 24px;">
            <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 6px;">Sample Work Portfolio Photos</label>
            <div style="border: 1px dashed var(--amber); background: var(--bg-surface-subtle); padding: 14px; border-radius: 8px; text-align: center; color: var(--amber-dark); font-size: 0.88rem; font-weight: 700;">
              ✓ 3 Past Work Photos Attached
            </div>
          </div>

          <button type="submit" class="ed-button ed-button-amber" style="width: 100%;">
            <span>Submit for Admin Review</span>
          </button>
        </form>
      </div>
    `;
  } else if (regState.step === 5) {
    body.innerHTML = `
      <div style="padding: 36px 28px; text-align: center;">
        <div style="font-size: 2.8rem; color: var(--teal); margin-bottom: 12px;">✓</div>
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; color: var(--canvas);">Application Submitted!</h2>
        <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 20px;">
          Your profile has been routed to Godfrey and the Servhive verification team.
        </p>

        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--hairline-amber); padding: 18px; border-radius: 12px; margin-bottom: 24px; text-align: left;">
          <div style="font-weight: 800; color: var(--amber-dark); font-size: 0.95rem; margin-bottom: 4px;">🎁 First 1 Month Free Verified Pro Activated</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">As an early Port Harcourt provider, you enjoy 30 days with zero platform fees. Future renewal: ₦2,000/month (5% escrow commission).</div>
        </div>

        <button class="ed-button ed-button-amber" onclick="closeModal('providerRegisterModal');">
          <span>Return to Marketplace</span>
        </button>
      </div>
    `;
  }
};

window.handleRegStep1 = function(e) {
  e.preventDefault();
  regState.phone = document.getElementById('regPhone').value;
  regState.bizName = document.getElementById('regBizName').value;
  regState.step = 2;
  renderRegisterStep();
};

window.handleRegStep2 = function(e) {
  e.preventDefault();
  regState.step = 3;
  renderRegisterStep();
};

window.checkCategoryGating = function(val) {
  const container = document.getElementById('gatingFeedbackContainer');
  const btn = document.getElementById('regStep3Btn');
  if (!val) {
    container.innerHTML = '';
    btn.disabled = true;
    return;
  }

  const [tier, catId, catName] = val.split(':');
  regState.categoryName = catName;
  regState.categoryId = catId;

  if (tier === 'blocked') {
    const item = BLOCKED_CATEGORIES.find(b => b.id === catId);
    container.innerHTML = `
      <div style="background: rgba(239, 83, 80, 0.12); border: 1px solid rgba(239, 83, 80, 0.4); padding: 14px; border-radius: 8px; color: #EF5350;">
        <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 4px;">🚫 Registration Blocked: ${catName}</div>
        <div style="font-size: 0.82rem; line-height: 1.5;">${item ? item.reason : 'Child safeguarding policy blocks this trade.'}</div>
      </div>
    `;
    btn.disabled = true;
  } else if (tier === 'approval') {
    const item = APPROVAL_REQUIRED_CATEGORIES.find(a => a.id === catId);
    regState.isApproval = true;
    container.innerHTML = `
      <div style="background: rgba(255, 167, 38, 0.12); border: 1px solid rgba(255, 167, 38, 0.4); padding: 14px; border-radius: 8px; color: #FFA726;">
        <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 4px;">⚠️ Statutory Licence Required</div>
        <div style="font-size: 0.82rem; line-height: 1.5;">${item ? item.reason : ''} In the next step, upload your Rivers State registration certificate. Profile requires Admin sign-off before going live.</div>
      </div>
    `;
    btn.disabled = false;
  } else {
    regState.isApproval = false;
    container.innerHTML = `
      <div style="background: rgba(26, 140, 140, 0.12); border: 1px solid var(--teal-bright); padding: 12px; border-radius: 8px; color: var(--teal-bright);">
        <div style="font-weight: 800; font-size: 0.88rem;">✅ Standard Trade Category</div>
        <div style="font-size: 0.82rem;">Basic verification: Government ID + past work samples.</div>
      </div>
    `;
    btn.disabled = false;
  }
};

window.handleRegStep3 = function() {
  regState.step = 4;
  renderRegisterStep();
};

window.handleRegStep4 = function(e) {
  e.preventDefault();
  const area = document.getElementById('regArea').value;
  const licenseNum = regState.isApproval ? document.getElementById('regLicenseDoc').value : null;
  const matchedLm = PH_LANDMARKS.find(l => l.zone.toLowerCase() === area.toLowerCase()) || PH_LANDMARKS[0];

  const newPro = {
    id: 'pro-' + Date.now(),
    name: regState.bizName.split(' ')[0] + ' (Pro)',
    businessName: regState.bizName,
    category: regState.categoryId,
    categoryName: regState.categoryName,
    subSpecialty: regState.categoryName,
    area: area,
    lat: matchedLm.lat,
    lng: matchedLm.lng,
    landmarks: [matchedLm.name],
    rating: 5.0,
    reviewCount: 0,
    verified: false,
    status: 'pending',
    licenseDoc: licenseNum,
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 10000,
    responseTime: '~20 mins',
    bio: `Newly registered service specialist serving ${area} and surrounding Port Harcourt zones. Awaiting admin review.`,
    services: [
      { name: 'Standard Service Consultation', price: 10000, type: 'Starting from' }
    ],
    reviews: []
  };

  state.providers.unshift(newPro);
  persistState();
  regState.step = 5;
  renderRegisterStep();
};

// ==================== ESCROW VAULT & BOOKINGS ENGINE ====================
window.openEscrowBookingModal = function(proId, serviceName, price) {
  const pro = state.providers.find(p => p.id === proId);
  if (!pro) return;

  const modal = document.getElementById('escrowBookingModal');
  document.getElementById('escrowProId').value = pro.id;
  document.getElementById('escrowRawPrice').value = price;
  document.getElementById('escrowProName').textContent = pro.businessName;
  document.getElementById('escrowServiceName').textContent = serviceName;
  document.getElementById('escrowPriceDisplay').textContent = formatNaira(price);

  modal.classList.add('open');
};

window.handleEscrowBookingSubmit = function(e) {
  e.preventDefault();
  const proId = document.getElementById('escrowProId').value;
  const rawPrice = Number(document.getElementById('escrowRawPrice').value) || 10000;
  const pro = state.providers.find(p => p.id === proId);
  const serviceName = document.getElementById('escrowServiceName').textContent;
  const area = document.getElementById('escrowAreaSelect').value;
  const address = document.getElementById('escrowStreetAddress').value;
  const dateTime = document.getElementById('escrowDateTime').value;

  const commissionAmount = Math.round(rawPrice * 0.05); // 5% Servhive platform commission
  const payoutAmount = rawPrice - commissionAmount;

  const newJob = {
    id: 'esc-' + Date.now().toString().slice(-4),
    proId: proId,
    proName: pro ? pro.businessName : 'Provider',
    serviceName: serviceName,
    amount: rawPrice,
    area: area,
    address: address,
    dateTime: dateTime,
    status: 'in_progress',
    createdAt: 'Just now',
    commissionPct: 5,
    commissionAmount: commissionAmount,
    payoutAmount: payoutAmount
  };

  state.escrowJobs.unshift(newJob);
  persistState();
  closeModal('escrowBookingModal');
  updateEscrowBadge();

  showAppNotice({
    icon: '🛡️',
    eyebrow: 'PORT HARCOURT ESCROW VAULT',
    title: `Escrow Deposit of ${formatNaira(rawPrice)} Active!`,
    message: `Artisan (<strong>${newJob.proName}</strong>) has been scheduled to arrive at <strong>${address}</strong> on <strong>${dateTime}</strong>.\n\nYour funds will remain securely protected in Escrow (5% safety commission: ${formatNaira(commissionAmount)}) until you inspect the work and click "Approve & Release".`,
    confirmText: 'View Escrow Vault →',
    cancelText: 'Keep Browsing',
    onConfirm: () => {
      openEscrowHub();
    }
  });
};

window.openEscrowHub = function() {
  renderEscrowJobs();
  document.getElementById('escrowHubModal').classList.add('open');
};

window.updateEscrowBadge = function() {
  const badge = document.getElementById('navEscrowBadge');
  if (badge) {
    const activeCount = state.escrowJobs.filter(j => j.status !== 'completed').length;
    badge.textContent = activeCount;
    badge.style.display = activeCount > 0 ? 'inline-block' : 'none';
  }
};

window.renderEscrowJobs = function() {
  const container = document.getElementById('escrowJobsContainer');
  if (!container) return;

  if (state.escrowJobs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: rgba(255,255,255,0.02); border-radius: var(--radius-md); border: 1px solid var(--hairline);">
        <div style="margin-bottom: 16px; color: var(--text-muted);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <h4 style="font-size: 1.2rem; font-weight: 800;">No active escrow bookings</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin: 6px 0 16px;">Browse verified artisans in Port Harcourt and book with 100% money-back escrow protection.</p>
        <button class="ed-button ed-button-amber" onclick="closeModal('escrowHubModal'); location.href='#directory';">
          <span>Find Artisans Now</span>
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.escrowJobs.map(job => {
    const isDone = job.status === 'completed';
    const isAwaiting = job.status === 'awaiting_release';
    const isInProgress = job.status === 'in_progress';

    return `
      <div class="ed-escrow-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; margin-bottom: 12px; flex-wrap: wrap;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="ed-hero-tag" style="margin: 0; padding: 2px 8px; font-size: 0.7rem;">ID: ${job.id}</span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">📍 ${job.area}</span>
            </div>
            <h4 style="font-size: 1.25rem; font-weight: 900; color: var(--canvas);">${job.proName}</h4>
            <div style="font-size: 0.88rem; color: var(--amber); font-weight: 700;">${job.serviceName}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Scheduled: ${job.dateTime} • Address: ${job.address}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.35rem; font-weight: 900; color: var(--amber);">${formatNaira(job.amount)}</div>
            <div style="font-size: 0.75rem; font-weight: 700; color: ${isDone ? '#10B981' : isAwaiting ? '#FFA726' : 'var(--teal-bright)'};">
              ${isDone ? '✓ Paid to Artisan' : '🔒 Held in Escrow'}
            </div>
          </div>
        </div>

        <!-- 4 Step Escrow Tracker (Monochrome Vector Logos) -->
        <div class="ed-escrow-steps">
          <div class="ed-escrow-step done">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span>1. Funded</span>
          </div>
          <div class="ed-escrow-step ${isInProgress ? 'active' : 'done'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>2. Artisan Active</span>
          </div>
          <div class="ed-escrow-step ${isAwaiting ? 'active' : isDone ? 'done' : ''}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>3. Job Inspected</span>
          </div>
          <div class="ed-escrow-step ${isDone ? 'done' : ''}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>4. Payout</span>
          </div>
        </div>

        <!-- Escrow Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--hairline); flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            Servhive Safety Fee: <strong>₦0</strong> • Platform Commission: <strong>${job.commissionPct}% (${formatNaira(job.commissionAmount)})</strong>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            ${isInProgress ? `
              <button class="ed-button ed-button-black" style="padding: 6px 14px; font-size: 0.78rem;" onclick="simulateArtisanDone('${job.id}')">
                <span>Simulate: Artisan Finished Work &rarr;</span>
              </button>
            ` : ''}

            ${isAwaiting ? `
              <button class="ed-button ed-button-amber" style="padding: 8px 18px; font-size: 0.82rem;" onclick="releaseEscrowPayment('${job.id}')">
                <span>Approve & Release ${formatNaira(job.amount)}</span>
              </button>
            ` : ''}

            ${isDone ? `
              <span style="font-size: 0.82rem; font-weight: 800; color: #10B981; display: inline-flex; align-items: center; gap: 4px;">
                ✓ Transaction Completed & Paid
              </span>
            ` : `
              <button class="ed-button ed-button-black" style="padding: 6px 14px; font-size: 0.78rem; color: #EF5350;" onclick="openReportModal('${job.proId}', '${job.proName}'); closeModal('escrowHubModal');">
                <span>Dispute / Hold Funds</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
};

window.simulateArtisanDone = function(jobId) {
  const job = state.escrowJobs.find(j => j.id === jobId);
  if (job) {
    job.status = 'awaiting_release';
    persistState();
    renderEscrowJobs();
    showAppNotice({
      icon: '🔨',
      eyebrow: 'ARTISAN JOB UPDATE',
      title: 'Work Marked as Completed',
      message: `<strong>${job.proName}</strong> has indicated that the job at <strong>${job.address}</strong> is finished.\n\nPlease inspect the quality of work. If satisfied, click "Approve & Release ${formatNaira(job.amount)}" in the Escrow Hub to release their payment.`,
      confirmText: 'Understood'
    });
  }
};

window.releaseEscrowPayment = function(jobId) {
  const job = state.escrowJobs.find(j => j.id === jobId);
  if (!job) return;

  const commission = job.commissionAmount || Math.round(job.amount * 0.05);
  const payout = job.payoutAmount || (job.amount - commission);

  showAppNotice({
    icon: '🔒',
    eyebrow: 'PAYMENT DISBURSEMENT CONFIRMATION',
    title: `Release ${formatNaira(job.amount)} to Artisan?`,
    message: `Are you satisfied with the work done by <strong>${job.proName}</strong>?\n\nThis will instantly release <strong>${formatNaira(payout)}</strong> directly to the artisan's Nigerian bank account (Servhive platform commission: 5% / ${formatNaira(commission)}).`,
    confirmText: `Approve & Release ${formatNaira(payout)}`,
    cancelText: 'Cancel',
    onConfirm: () => {
      job.status = 'completed';
      persistState();
      updateEscrowBadge();
      renderEscrowJobs();
      if (document.getElementById('myAccountModal')?.classList.contains('open')) {
        renderMyAccountView();
      }

      showAppNotice({
        icon: '🎉',
        eyebrow: 'PAYMENT COMPLETED',
        title: 'Payment Disbursed Successfully!',
        message: `<strong>${formatNaira(payout)}</strong> has been credited to <strong>${job.proName}</strong>.\nServhive commission collected: ${formatNaira(commission)} (5%).\n\nPlease leave a quick review to help fellow Port Harcourt clients!`,
        confirmText: 'Rate & Review Provider ★',
        onConfirm: () => {
          showAddReviewPrompt(job.proId);
        }
      });
    }
  });
};

// ==================== AUTHENTICATION & VIEW MANAGEMENT ====================
window.switchToAdminView = function() {
  state.currentView = 'admin';
  const marketplace = document.getElementById('marketplaceView');
  const authView = document.getElementById('authView');
  const adminView = document.getElementById('adminView');

  if (marketplace) marketplace.style.display = 'none';
  if (authView) authView.classList.remove('active');
  if (adminView) adminView.classList.add('active');
  renderAdminDashboard();
};

window.switchToMarketplaceView = function() {
  state.currentView = 'marketplace';
  const adminView = document.getElementById('adminView');
  const authView = document.getElementById('authView');
  const marketplace = document.getElementById('marketplaceView');

  if (adminView) adminView.classList.remove('active');
  if (authView) authView.classList.remove('active');
  if (marketplace) marketplace.style.display = 'block';

  renderProviders();
  if (window.location.hash.includes('login') || window.location.hash.includes('signup') || window.location.hash.includes('admin')) {
    try {
      history.replaceState(null, '', window.location.pathname);
    } catch (err) {}
  }
};

window.switchToAuthView = function(mode = 'login', role = 'hirer') {
  const hash = mode === 'signup' ? (role === 'artisan' ? '#signup-artisan' : '#signup') : (role === 'artisan' ? '#artisan' : '#login');
  window.location.href = `/login.html${hash}`;
};

window.setAuthRole = function(role) {
  state.authRole = role;
  const hirerBtn = document.getElementById('roleBtnHirer');
  const artisanBtn = document.getElementById('roleBtnArtisan');
  if (hirerBtn) hirerBtn.classList.toggle('active', role === 'hirer');
  if (artisanBtn) artisanBtn.classList.toggle('active', role === 'artisan');
  renderAuthPage();
};

window.setAuthMode = function(mode) {
  state.authMode = mode;
  const loginTab = document.getElementById('authModeTabLogin');
  const signupTab = document.getElementById('authModeTabSignup');
  if (loginTab) loginTab.classList.toggle('active', mode === 'login');
  if (signupTab) signupTab.classList.toggle('active', mode === 'signup');
  renderAuthPage();
  try {
    const hash = mode === 'signup' ? (state.authRole === 'artisan' ? '#signup-artisan' : '#signup') : '#login';
    history.replaceState(null, '', hash);
  } catch (err) {}
};

window.quickFillDemo = function(role) {
  state.authRole = role;
  state.authMode = 'login';

  const hirerBtn = document.getElementById('roleBtnHirer');
  const artisanBtn = document.getElementById('roleBtnArtisan');
  if (hirerBtn) hirerBtn.classList.toggle('active', role === 'hirer');
  if (artisanBtn) artisanBtn.classList.toggle('active', role === 'artisan');

  const loginTab = document.getElementById('authModeTabLogin');
  const signupTab = document.getElementById('authModeTabSignup');
  if (loginTab) loginTab.classList.add('active');
  if (signupTab) signupTab.classList.remove('active');

  renderAuthPage();

  const contactInput = document.getElementById('loginContact');
  const passwordInput = document.getElementById('loginPassword');

  if (role === 'hirer') {
    if (contactInput) contactInput.value = 'tonye@example.com';
    if (passwordInput) passwordInput.value = 'password123';
  } else {
    if (contactInput) contactInput.value = 'emeka@powervolt.ng';
    if (passwordInput) passwordInput.value = 'password123';
  }

  if (contactInput) {
    contactInput.style.borderColor = 'var(--amber)';
    setTimeout(() => {
      contactInput.style.borderColor = 'var(--hairline)';
    }, 1200);
  }
};

window.togglePasswordVisibility = function(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const eyeOpen = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeOff = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  if (input.type === 'password') {
    input.type = 'text';
    if (btnEl) btnEl.innerHTML = eyeOff;
  } else {
    input.type = 'password';
    if (btnEl) btnEl.innerHTML = eyeOpen;
  }
};

window.renderAuthPage = function() {
  const titleEl = document.getElementById('authTitle');
  const subtitleEl = document.getElementById('authSubtitle');
  const eyebrowEl = document.getElementById('authNavEyebrow');

  const isHirer = state.authRole === 'hirer';
  const isLogin = state.authMode === 'login';

  if (eyebrowEl) {
    eyebrowEl.textContent = isHirer 
      ? 'PORT HARCOURT HIRER PORTAL' 
      : 'PORT HARCOURT ARTISAN PRO NETWORK';
  }

  if (titleEl && subtitleEl) {
    if (isLogin) {
      if (isHirer) {
        titleEl.textContent = 'Log In as Hirer';
        subtitleEl.textContent = 'Access vetted Port Harcourt artisans with 100% Escrow payment security and live tracking.';
      } else {
        titleEl.textContent = 'Artisan Pro Portal';
        subtitleEl.textContent = 'Log in to manage bookings, transparent rate cards, and instant bank payouts across Port Harcourt.';
      }
    } else {
      if (isHirer) {
        titleEl.textContent = 'Create Hirer Account';
        subtitleEl.textContent = 'Hire vetted electricians, mechanics, tilers, and stylists in Port Harcourt with zero price gouging.';
      } else {
        titleEl.textContent = 'Register as Verified Pro';
        subtitleEl.textContent = 'Join Port Harcourt’s premier trades network with First 1 Month Free (₦0 subscription).';
      }
    }
  }

  renderAuthForm();
  renderAuthTrust();
};

window.renderAuthForm = function() {
  const container = document.getElementById('authFormContainer');
  if (!container) return;

  const isHirer = state.authRole === 'hirer';
  const isLogin = state.authMode === 'login';

  if (isLogin) {
    container.innerHTML = `
      <form onsubmit="handleLoginSubmit(event)">
        <div class="auth-input-group">
          <label class="auth-label">${isHirer ? 'Email or Mobile Number' : 'Artisan Email or Phone (+234)'}</label>
          <input type="text" id="loginContact" required class="auth-input" placeholder="${isHirer ? 'e.g. tonye@example.com or 0803 123 4567' : 'e.g. emeka@powervolt.ng or 0802 345 6789'}" />
        </div>

        <div class="auth-input-group">
          <label class="auth-label">Password</label>
          <input type="password" id="loginPassword" required class="auth-input" placeholder="••••••••" />
          <button type="button" class="auth-password-toggle" onclick="togglePasswordVisibility('loginPassword', this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 0.84rem;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--canvas);">
            <input type="checkbox" id="loginRemember" checked style="accent-color: var(--amber-dark);" />
            <span>Remember this device</span>
          </label>
          <a href="javascript:void(0)" onclick="openForgotPasswordModal()" style="color: var(--teal); font-weight: 700; text-decoration: none;">
            Forgot Password?
          </a>
        </div>

        <button type="submit" class="ed-button ed-button-amber" style="width: 100%; padding: 14px; font-size: 0.95rem;">
          <span>Log In as ${isHirer ? 'Hirer' : 'Verified Artisan'} &rarr;</span>
        </button>

        <div style="text-align: center; margin-top: 20px; font-size: 0.86rem; color: var(--text-muted);">
          Don't have an account yet? 
          <a href="javascript:void(0)" onclick="setAuthMode('signup')" style="color: var(--amber-dark); font-weight: 800; text-decoration: none; margin-left: 4px;">
            Sign up as ${isHirer ? 'a Hirer' : 'an Artisan'} &rarr;
          </a>
        </div>
      </form>
    `;
  } else if (isHirer) {
    // Hirer Sign Up Form: Phone number plus code (easier than email for most people)
    const phAreas = AREAS.filter(a => a !== 'All Port Harcourt');
    container.innerHTML = `
      <form onsubmit="handleHirerSignupSubmit(event)">
        <div class="auth-input-group">
          <label class="auth-label">Full Name</label>
          <input type="text" id="hirerFullName" required class="auth-input" placeholder="e.g. Tonye Briggs" />
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Phone Number (+234)</label>
            <input type="tel" id="hirerPhone" required class="auth-input" placeholder="0803 123 4567" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">SMS Verification Code</label>
            <input type="text" id="hirerCode" required maxlength="4" class="auth-input" value="1234" placeholder="1234" style="letter-spacing: 4px; font-weight: 800; text-align: center;" />
          </div>
        </div>

        <div class="auth-input-group">
          <label class="auth-label">Primary Neighborhood in Port Harcourt</label>
          <select id="hirerArea" required class="auth-input ed-select-input" style="height: 46px;">
            <option value="">-- Choose your area / landmark --</option>
            ${phAreas.map(a => `<option value="${a}">${a}</option>`).join('')}
          </select>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Password</label>
            <input type="password" id="hirerPassword" required minlength="6" class="auth-input" placeholder="Min. 6 characters" />
            <button type="button" class="auth-password-toggle" onclick="togglePasswordVisibility('hirerPassword', this)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Email Address (Optional)</label>
            <input type="email" id="hirerEmail" class="auth-input" placeholder="tonye@example.com" />
          </div>
        </div>

        <label class="auth-checkbox-label">
          <input type="checkbox" id="hirerTerms" required checked />
          <span>I agree to Servhive's <a href="javascript:void(0)" onclick="openPrivacyInfoModal()" style="color: var(--teal); font-weight: 700;">Terms of Service</a>, Masked Privacy Policy, and Escrow Protection Protocol.</span>
        </label>

        <button type="submit" class="ed-button ed-button-amber" style="width: 100%; padding: 14px; font-size: 0.95rem;">
          <span>Create Free Hirer Account &rarr;</span>
        </button>

        <div style="text-align: center; margin-top: 20px; font-size: 0.86rem; color: var(--text-muted);">
          Already registered as a Hirer? 
          <a href="javascript:void(0)" onclick="setAuthMode('login')" style="color: var(--amber-dark); font-weight: 800; text-decoration: none; margin-left: 4px;">
            Log in here &rarr;
          </a>
        </div>
      </form>
    `;
  } else {
    // Artisan / Pro Sign Up Form: Name, Business Name, Phone, Main Service + "First 1 Month Free"
    const phAreas = AREAS.filter(a => a !== 'All Port Harcourt');
    container.innerHTML = `
      <form onsubmit="handleArtisanSignupSubmit(event)">
        <!-- 1-Month Free Promo Callout Banner -->
        <div style="background: var(--amber-light); border: 1px solid var(--hairline-amber); padding: 14px 16px; border-radius: var(--radius-sm); margin-bottom: 18px;">
          <div style="font-weight: 800; font-size: 0.9rem; color: var(--amber-dark); margin-bottom: 2px;">
            🎁 First 1 Month Free Verified Pro Trial Active
          </div>
          <div style="font-size: 0.8rem; color: var(--canvas-muted); line-height: 1.45;">
            ₦0 subscription fees for your first 30 days. Higher-ticket subscription renewal: ₦2,000/mo. Platform commission: 5% on completed milestones.
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Your Name</label>
            <input type="text" id="artisanName" required class="auth-input" placeholder="e.g. Engr. Tari Davies" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Business Name</label>
            <input type="text" id="artisanBizName" required class="auth-input" placeholder="e.g. Prime Ceilings & Tiling Works" />
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Phone Number (+234)</label>
            <input type="tel" id="artisanPhone" required class="auth-input" placeholder="0802 345 6789" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">SMS Verification Code</label>
            <input type="text" id="artisanCode" required maxlength="4" class="auth-input" value="1234" placeholder="1234" style="letter-spacing: 4px; font-weight: 800; text-align: center;" />
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Main Service</label>
            <select id="artisanCategory" required class="auth-input ed-select-input" style="height: 46px;">
              <option value="power-gen">Power &amp; Generators</option>
              <option value="solar-tech">Solar, Inverters &amp; CCTV</option>
              <option value="interior-pop">Interior POP &amp; Tiling</option>
              <option value="plumbing">Plumbing &amp; Boreholes</option>
              <option value="electrical">Electrical &amp; Conduit</option>
              <option value="ac-chillers">AC &amp; Refrigeration</option>
              <option value="auto-mechanic">Auto Mechanic &amp; Diagnostics</option>
              <option value="beauty-hair">Beauty, Hair &amp; Braids</option>
              <option value="carpentry">Carpentry &amp; Woodwork</option>
              <option value="painting">Painting &amp; Screeding</option>
            </select>
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Workshop Base / Area in PH</label>
            <select id="artisanArea" required class="auth-input ed-select-input" style="height: 46px;">
              ${phAreas.map(a => `<option value="${a}">${a}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Password</label>
            <input type="password" id="artisanPassword" required minlength="6" class="auth-input" placeholder="Min. 6 characters" />
            <button type="button" class="auth-password-toggle" onclick="togglePasswordVisibility('artisanPassword', this)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Starting Service Rate (₦)</label>
            <input type="number" id="artisanStartingPrice" required min="3000" step="500" value="10000" class="auth-input" placeholder="10000" />
          </div>
        </div>

        <label class="auth-checkbox-label">
          <input type="checkbox" id="artisanTerms" required checked />
          <span>I confirm our workshop adheres to Port Harcourt trade quality standards, 5% escrow commission, and verified safety delivery.</span>
        </label>

        <button type="submit" class="ed-button ed-button-amber" style="width: 100%; padding: 14px; font-size: 0.95rem;">
          <span>Register as Verified Pro &rarr;</span>
        </button>

        <div style="text-align: center; margin-top: 20px; font-size: 0.86rem; color: var(--text-muted);">
          Already registered as an Artisan? 
          <a href="javascript:void(0)" onclick="setAuthMode('login')" style="color: var(--amber-dark); font-weight: 800; text-decoration: none; margin-left: 4px;">
            Log in here &rarr;
          </a>
        </div>
      </form>
    `;
  }
};

window.renderAuthTrust = function() {
  const container = document.getElementById('authTrustColumn');
  if (!container) return;

  const isHirer = state.authRole === 'hirer';

  if (isHirer) {
    container.innerHTML = `
      <div class="auth-trust-card">
        <div class="hero-eyebrow" style="margin-bottom: 8px;">HIRER PROTECTION GUARANTEE</div>
        <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 18px; color: var(--canvas);">
          Why Hire on Servhive PH?
        </h3>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">🛡️</div>
          <div>
            <div class="auth-feature-title">100% Escrow Protection</div>
            <div class="auth-feature-desc">Your payment is frozen in trust. The artisan is NOT paid until you personally inspect the completed job.</div>
          </div>
        </div>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">📍</div>
          <div>
            <div class="auth-feature-title">Real PH Proximity</div>
            <div class="auth-feature-desc">Artisans located in your neighborhood — Trans-Amadi, Peter Odili, Woji, Old GRA, and Choba.</div>
          </div>
        </div>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">🔒</div>
          <div>
            <div class="auth-feature-title">Masked Number Privacy</div>
            <div class="auth-feature-desc">Your real phone number remains shielded from unsolicited marketing, off-platform harassment, or scams.</div>
          </div>
        </div>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">₦</div>
          <div>
            <div class="auth-feature-title">Standardized Rate Cards</div>
            <div class="auth-feature-desc">Clear fixed rate cards in Naira so you never deal with unexpected roadside price inflation on arrival.</div>
          </div>
        </div>
      </div>

      <!-- Hirer Testimonial Card -->
      <div class="auth-trust-card" style="background: var(--bg-surface-subtle); border-left: 4px solid var(--amber);">
        <div style="font-size: 0.95rem; line-height: 1.55; color: var(--canvas); font-style: italic; margin-bottom: 14px;">
          "I needed an emergency Mikano generator overhaul in Peter Odili Rd. Engr. Emeka arrived in 25 mins and my money was totally protected in Escrow until the test run passed."
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 800; font-size: 0.88rem; color: var(--canvas);">Mrs. Belema Briggs</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">Peter Odili Road, Port Harcourt</div>
          </div>
          <div style="color: var(--amber-dark); font-size: 0.9rem;">★★★★★</div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="auth-trust-card">
        <div class="hero-eyebrow" style="margin-bottom: 8px;">ARTISAN PRO ADVANTAGE</div>
        <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 18px; color: var(--canvas);">
          Grow Your Trade in Port Harcourt
        </h3>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">💳</div>
          <div>
            <div class="auth-feature-title">Guaranteed Escrow Payouts</div>
            <div class="auth-feature-desc">Client funds are deposited in Escrow before you start work. No more clients disappearing without paying.</div>
          </div>
        </div>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">🎁</div>
          <div>
            <div class="auth-feature-title">First 1 Month Free Trial (30 Days)</div>
            <div class="auth-feature-desc">Join early and enjoy 30 days of unlimited leads with zero subscription costs. Keep 100% of your earnings. Standard renewal at ₦2,000/mo.</div>
          </div>
        </div>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">🏆</div>
          <div>
            <div class="auth-feature-title">Verified Teal Trust Badge</div>
            <div class="auth-feature-desc">Stand out directly to high-ticket estate clients and commercial facilities in Old GRA, Woji, and Trans-Amadi.</div>
          </div>
        </div>

        <div class="auth-feature-row">
          <div class="auth-feature-icon">⚡</div>
          <div>
            <div class="auth-feature-title">Godfrey & Team Concierge Mediation</div>
            <div class="auth-feature-desc">Dedicated Port Harcourt administrative support to mediate disputes fairly and protect artisans.</div>
          </div>
        </div>
      </div>

      <!-- Artisan Testimonial Card -->
      <div class="auth-trust-card" style="background: var(--bg-surface-subtle); border-left: 4px solid var(--teal);">
        <div style="font-size: 0.95rem; line-height: 1.55; color: var(--canvas); font-style: italic; margin-bottom: 14px;">
          "Before Servhive, customers in PH would delay payments for weeks after generator servicing. Now the money is locked in Escrow before I buy spare parts. Guaranteed peace of mind."
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 800; font-size: 0.88rem; color: var(--canvas);">Engr. Emeka Obi</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">PowerVolt Generator Works · Trans-Amadi</div>
          </div>
          <div style="color: var(--teal); font-weight: 800; font-size: 0.8rem;">★ 4.9 Pro</div>
        </div>
      </div>
    `;
  }
};

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const contact = document.getElementById('loginContact').value.trim();
  const password = document.getElementById('loginPassword').value;

  const role = state.authRole;
  // Look for registered user or match demo
  let matchedUser = state.users.find(u => 
    (u.email.toLowerCase() === contact.toLowerCase() || u.phone.includes(contact) || contact.includes(u.phone)) &&
    u.role === role
  );

  if (!matchedUser) {
    // If testing with any valid credentials, create an active session for the role
    matchedUser = {
      id: 'usr-' + Date.now(),
      name: role === 'hirer' ? 'Tonye Briggs' : 'Engr. Emeka Obi',
      businessName: role === 'artisan' ? 'PowerVolt Generator & Electrical Works' : null,
      email: contact.includes('@') ? contact : `${role}@servhive.ng`,
      phone: contact.includes('@') ? '08034567890' : contact,
      role: role,
      area: role === 'hirer' ? 'Peter Odili Road' : 'Trans-Amadi',
      verified: true
    };
    state.users.push(matchedUser);
  }

  state.currentUser = matchedUser;
  persistState();
  updateAuthUI();

  showAppNotice({
    icon: role === 'hirer' ? '👋' : '🔨',
    eyebrow: 'LOGIN SUCCESSFUL',
    title: `Welcome, ${matchedUser.name}!`,
    message: role === 'hirer'
      ? `Logged in as <strong>Hirer (Client)</strong>. You can now book Port Harcourt artisans with 100% Escrow protection.`
      : `Logged in to <strong>Artisan Pro Portal</strong> for <strong>${matchedUser.businessName || matchedUser.name}</strong>. Your First 1 Month Free Trial is active.`,
    confirmText: 'Continue to Marketplace'
  });

  switchToMarketplaceView();
};

window.handleHirerSignupSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('hirerFullName').value.trim();
  const emailInput = document.getElementById('hirerEmail');
  const email = emailInput ? emailInput.value.trim() : '';
  const phone = document.getElementById('hirerPhone').value.trim();
  const code = document.getElementById('hirerCode') ? document.getElementById('hirerCode').value.trim() : '1234';
  const area = document.getElementById('hirerArea').value;
  const password = document.getElementById('hirerPassword').value;

  const newUser = {
    id: 'usr-' + Date.now(),
    name: name,
    email: email || `${phone.replace(/[^0-9]/g, '')}@client.servhive.ng`,
    phone: phone,
    role: 'hirer',
    area: area,
    password: password,
    verifiedPhone: true,
    createdAt: new Date().toISOString()
  };

  state.users.push(newUser);
  state.currentUser = newUser;
  persistState();
  updateAuthUI();

  showAppNotice({
    icon: '🎉',
    eyebrow: 'PHONE VERIFIED & ACCOUNT CREATED',
    title: `Welcome to Servhive, ${name}!`,
    message: `Phone number (<strong>+234 ${phone}</strong>) verified via instant code <strong>${code}</strong>. Preferred location set to <strong>${area}</strong>.<br><br>All bookings are safeguarded with 100% Escrow protection (5% platform safety fee).`,
    confirmText: 'Explore Verified Artisans'
  });

  switchToMarketplaceView();
};

window.handleArtisanSignupSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('artisanName').value.trim();
  const bizName = document.getElementById('artisanBizName').value.trim();
  const catVal = document.getElementById('artisanCategory').value;
  const area = document.getElementById('artisanArea').value;
  const phone = document.getElementById('artisanPhone').value.trim();
  const code = document.getElementById('artisanCode') ? document.getElementById('artisanCode').value.trim() : '1234';
  const email = `${bizName.toLowerCase().replace(/[^a-z0-9]/g, '')}@workshop.ng`;
  const startingPrice = Number(document.getElementById('artisanStartingPrice')?.value) || 10000;
  const password = document.getElementById('artisanPassword').value;

  const catId = catVal.includes(':') ? catVal.split(':')[0] : catVal;
  const foundCat = INITIAL_CATEGORIES.find(c => c.id === catId);
  const catName = foundCat ? foundCat.name : 'Master Trade Specialist';
  const matchedLm = PH_LANDMARKS.find(l => l.zone.toLowerCase() === area.toLowerCase()) || PH_LANDMARKS[0];

  const newUser = {
    id: 'usr-' + Date.now(),
    name: name,
    businessName: bizName,
    email: email,
    phone: phone,
    role: 'artisan',
    trade: catName,
    category: catId,
    area: area,
    experience: '5+ years verified',
    startingPrice: startingPrice,
    password: password,
    trialDaysLeft: 30,
    subscriptionStatus: 'trial',
    createdAt: new Date().toISOString()
  };

  // Automatically register them in the live providers directory
  const newPro = {
    id: 'pro-' + Date.now(),
    name: name,
    businessName: bizName,
    category: catId,
    categoryName: catName,
    subSpecialty: `${catName} Specialist`,
    area: area,
    lat: matchedLm.lat,
    lng: matchedLm.lng,
    landmarks: [matchedLm.name, area],
    rating: 5.0,
    reviewCount: 1,
    verified: true,
    boosted: false,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: startingPrice,
    responseTime: '~15 mins',
    bio: `${bizName} is a verified service enterprise based in ${area}, Port Harcourt. First 1 Month Free Verified Pro Member.`,
    workPhotos: [
      { url: '/assets/hero_tradesman.jpg', caption: 'Live on-site technical inspection in Port Harcourt' },
      { url: '/assets/hero_tradesman.jpg', caption: 'Workshop testing & diagnostic equipment calibration' },
      { url: '/assets/hero_tradesman.jpg', caption: 'Completed installation handover to client' }
    ],
    services: [
      { name: `Standard ${catName} Consultation & Service`, price: startingPrice, type: 'Starting from' },
      { name: 'Comprehensive Diagnostic / Site Inspection', price: Math.round(startingPrice * 0.7), type: 'Fixed' }
    ],
    reviews: [
      { author: 'Servhive Verification Ops', area: 'Port Harcourt', rating: 5, date: 'Today', text: 'Verified Port Harcourt artisan onboarding completed. Phone & workshop KYC approved.' }
    ]
  };

  state.users.push(newUser);
  state.providers.unshift(newPro);
  state.currentUser = newUser;
  persistState();
  updateAuthUI();

  showAppNotice({
    icon: '✨',
    eyebrow: 'PRO MEMBERSHIP ACTIVATED',
    title: `Welcome, ${bizName}!`,
    message: `Your Artisan Pro profile is live with the <strong>Teal Verified Badge</strong>.<br><br>🎁 <strong>First 1 Month Free Trial</strong> active (30 days free, standard renewal: ₦2,000/month). 5% Escrow commission guaranteed on milestone payouts.`,
    confirmText: 'View My Live Listing',
    onConfirm: () => {
      switchToMarketplaceView();
      openProfileModal(newPro.id);
    }
  });

  switchToMarketplaceView();
};

window.handleLogout = function() {
  state.currentUser = null;
  persistState();
  updateAuthUI();

  showAppNotice({
    icon: '👋',
    eyebrow: 'SIGNED OUT',
    title: 'Signed Out Successfully',
    message: 'You have been logged out of Servhive. You can browse the marketplace as a guest or log back in anytime.',
    confirmText: 'OK'
  });
};

window.switchUserRole = function() {
  if (!state.currentUser) {
    switchToAuthView('login', 'hirer');
    return;
  }

  const currentRole = state.currentUser.role;
  const newRole = currentRole === 'hirer' ? 'artisan' : 'hirer';

  if (newRole === 'artisan') {
    state.currentUser = {
      id: 'usr-artisan-' + Date.now(),
      name: state.currentUser.name.replace(/\s*\(Pro\)/gi, '').trim(),
      businessName: `${state.currentUser.name.replace(/\s*\(Pro\)/gi, '').split(' ')[0]} Master Services`,
      email: state.currentUser.email,
      phone: state.currentUser.phone,
      role: 'artisan',
      area: state.currentUser.area || 'Peter Odili Road',
      trade: 'Home Repairs',
      verified: true
    };
    persistState();
    window.location.href = '/artisan.html';
    return;
  } else {
    state.currentUser = {
      id: 'usr-hirer-' + Date.now(),
      name: state.currentUser.name.replace(/\s*\(Pro\)/gi, '').trim(),
      email: state.currentUser.email,
      phone: state.currentUser.phone,
      role: 'hirer',
      area: state.currentUser.area || 'Peter Odili Road',
      verified: true
    };
  }

  persistState();
  updateAuthUI();

  showAppNotice({
    icon: newRole === 'artisan' ? '🔨' : '👤',
    eyebrow: 'ROLE SWITCHED',
    title: `Switched to ${newRole === 'artisan' ? 'Artisan Pro' : 'Hirer'} Mode`,
    message: `You are now interacting with Servhive as a <strong>${newRole === 'artisan' ? 'Verified Artisan (Service Pro)' : 'Hirer (Client)'}</strong>.`,
    confirmText: 'Got It'
  });
};

window.toggleUserMenu = function() {
  const panel = document.getElementById('authUserDropdown');
  if (panel) panel.classList.toggle('open');
};

window.openForgotPasswordModal = function() {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) modal.classList.add('open');
};

window.handleForgotPasswordSubmit = function(e) {
  e.preventDefault();
  const contact = document.getElementById('resetContactInput').value.trim();
  closeModal('forgotPasswordModal');

  showAppNotice({
    icon: '📲',
    eyebrow: 'SECURITY PIN SENT',
    title: 'Reset PIN Dispatched',
    message: `A 6-digit verification PIN has been dispatched to <strong>${contact}</strong> via SMS / Email.<br><br>For instant assistance, Godfrey & the Port Harcourt admin desk can be reached at <strong>+234 800-SERVHIVE</strong>.`,
    confirmText: 'Understood'
  });
};

window.updateAuthUI = function() {
  const desktopContainer = document.getElementById('headerAuthArea');
  const mobileContainer = document.getElementById('mobileAuthArea');
  const proCtaBtn = document.getElementById('headerProCtaBtn');
  const user = state.currentUser;

  const savedBadge = document.getElementById('navSavedBadge');
  if (savedBadge) {
    const count = (state.savedProviderIds || []).length;
    savedBadge.textContent = count;
    savedBadge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  if (desktopContainer) {
    if (!user) {
      desktopContainer.innerHTML = `
        <a href="/login.html" class="ed-button ed-button-black ed-btn-compact" style="text-decoration: none;">
          <span>Log In</span>
        </a>
        <a href="/login.html#signup" class="ed-button ed-button-amber ed-btn-compact" style="text-decoration: none;">
          <span>Sign Up</span>
        </a>
      `;
      if (proCtaBtn) {
        proCtaBtn.style.display = 'inline-flex';
        proCtaBtn.innerHTML = '<span>Pro Sign-up</span>';
        proCtaBtn.setAttribute('href', '/login.html#signup-artisan');
        proCtaBtn.onclick = null;
      }
    } else {
      const isHirer = user.role === 'hirer';
      const initials = (user.name || 'User')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      desktopContainer.innerHTML = `
        <div class="auth-user-menu">
          <button class="auth-user-btn" onclick="toggleUserMenu()">
            <div class="auth-user-avatar" style="background: var(--bg-surface-subtle); color: var(--canvas); border: 1px solid var(--hairline);">
              ${initials}
            </div>
            <span class="auth-user-name">${user.name.split(' ')[0]}</span>
            <span class="auth-role-tag ${user.role}">
              ${isHirer ? 'Client' : 'Pro'}
            </span>
            <span style="font-size: 0.72rem; color: var(--text-muted); line-height: 1;">▾</span>
          </button>

          <!-- Dropdown Panel -->
          <div id="authUserDropdown" class="auth-dropdown-panel">
            <div class="auth-dropdown-header">
              <div style="font-weight: 800; font-size: 0.92rem; color: var(--canvas);">${user.name}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">${user.email || user.phone}</div>
              <div style="font-size: 0.74rem; color: var(--canvas-muted); font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 5px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${user.area || 'Port Harcourt'}</span>
              </div>
            </div>

            <button class="auth-dropdown-item" onclick="toggleUserMenu(); openEscrowHub();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Escrow Protection Vault</span>
            </button>

            <button class="auth-dropdown-item" onclick="toggleUserMenu(); switchUserRole();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 5h18"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 19H3"></path></svg>
              <span>Switch to ${isHirer ? 'Artisan Pro' : 'Client Portal'} Mode</span>
            </button>

            ${!isHirer ? `
              <a href="/artisan.html" class="auth-dropdown-item" style="text-decoration: none;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Artisan Pro Dashboard &rarr;</span>
              </a>
            ` : ''}

            <div class="auth-dropdown-divider"></div>

            <button class="auth-dropdown-item" onclick="toggleUserMenu(); handleLogout();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;

      if (proCtaBtn) {
        if (isHirer) {
          proCtaBtn.style.display = 'inline-flex';
          proCtaBtn.innerHTML = '<span>Switch to Pro</span>';
          proCtaBtn.onclick = () => switchUserRole();
        } else {
          proCtaBtn.style.display = 'inline-flex';
          proCtaBtn.innerHTML = '<span>★ Pro Active</span>';
          proCtaBtn.onclick = () => location.href = '#directory';
        }
      }
    }
  }

  if (mobileContainer) {
    if (!user) {
      mobileContainer.innerHTML = `
        <a href="/login.html" class="ed-button ed-button-black" style="width: 100%; padding: 12px; font-size: 0.88rem; text-decoration: none; text-align: center;">
          <span>Log In (Client Portal / Artisan)</span>
        </a>
        <a href="/login.html#signup" class="ed-button ed-button-amber" style="width: 100%; padding: 12px; font-size: 0.88rem; text-decoration: none; text-align: center;">
          <span>Create Account</span>
        </a>
        <a href="/login.html#signup-artisan" class="ed-button ed-button-black" style="width: 100%; padding: 12px; font-size: 0.88rem; border-color: var(--amber); text-decoration: none; text-align: center;">
          <span>Join as Pro Artisan (1 Mo Free)</span>
        </a>
      `;
    } else {
      const isHirer = user.role === 'hirer';
      mobileContainer.innerHTML = `
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <div style="font-weight: 800; font-size: 0.92rem; color: var(--canvas);">${user.name}</div>
            <span class="auth-role-tag ${user.role}">${isHirer ? 'Client' : 'Pro'}</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${user.area || 'Port Harcourt'}</span>
          </div>
        </div>

        <button class="ed-button ed-button-black" style="width: 100%; padding: 10px; font-size: 0.84rem; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="switchUserRole(); toggleMobileMenu();">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 5h18"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 19H3"></path></svg>
          <span>Switch to ${isHirer ? 'Artisan Pro' : 'Client Portal'} Mode</span>
        </button>

        <button class="ed-button ed-button-black" style="width: 100%; padding: 10px; font-size: 0.84rem; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="handleLogout(); toggleMobileMenu();">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Sign Out</span>
        </button>
      `;
    }
  }
};

window.switchAdminTab = function(tabName) {
  ['approvals', 'directory', 'reports', 'monetization'].forEach(t => {
    const btn = document.getElementById(`tabBtn-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.style.borderBottomColor = 'var(--amber)';
        btn.style.color = 'var(--canvas)';
      } else {
        btn.style.borderBottomColor = 'transparent';
        btn.style.color = 'var(--text-muted)';
      }
    }
  });

  document.getElementById('adminQueueSection').style.display = tabName === 'approvals' ? 'block' : 'none';
  document.getElementById('adminDirectorySection').style.display = tabName === 'directory' ? 'block' : 'none';
  document.getElementById('adminReportsSection').style.display = tabName === 'reports' ? 'block' : 'none';
  document.getElementById('adminMonetizationSection').style.display = tabName === 'monetization' ? 'block' : 'none';
};

function renderAdminDashboard() {
  const total = state.providers.length;
  const pending = state.providers.filter(p => p.status === 'pending').length;
  const approved = state.providers.filter(p => p.status === 'approved').length;
  const reportsCount = state.reports.length;

  document.getElementById('kpiTotalPros').textContent = total;
  document.getElementById('kpiPendingPros').textContent = pending;
  document.getElementById('kpiApprovedPros').textContent = approved;
  document.getElementById('kpiReports').textContent = reportsCount;

  renderAdminApprovalsQueue();
  renderAdminDirectory();
  renderAdminReports();
  renderAdminEscrowLedger();
}

function renderAdminEscrowLedger() {
  const container = document.getElementById('adminEscrowLedgerTableBody');
  const totalVolumeEl = document.getElementById('monetizationTotalVolume');
  const totalRevEl = document.getElementById('monetizationTotalRevenue');
  if (!container) return;

  let totalVolume = 0;
  let totalRevenue = 0;

  state.escrowJobs.forEach(job => {
    totalVolume += job.amount;
    if (job.status === 'completed') {
      totalRevenue += job.commissionAmount;
    }
  });

  if (totalVolumeEl) totalVolumeEl.textContent = formatNaira(totalVolume);
  if (totalRevEl) totalRevEl.textContent = formatNaira(totalRevenue);

  if (state.escrowJobs.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No escrow transactions on record.</td></tr>`;
    return;
  }

  container.innerHTML = state.escrowJobs.map(job => `
    <tr style="border-bottom: 1px solid var(--hairline);">
      <td style="padding: 14px 16px;">
        <strong style="color: var(--canvas);">${job.id}</strong>
        <div style="font-size: 0.78rem; color: var(--amber); font-weight: 700;">${job.serviceName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Pro: ${job.proName}</div>
      </td>
      <td style="padding: 14px 16px; font-size: 0.82rem;">📍 ${job.area}</td>
      <td style="padding: 14px 16px; font-weight: 800; color: var(--canvas);">${formatNaira(job.amount)}</td>
      <td style="padding: 14px 16px; font-weight: 800; color: var(--teal-bright);">${formatNaira(job.commissionAmount)} (10%)</td>
      <td style="padding: 14px 16px; font-weight: 800; color: var(--amber);">${formatNaira(job.payoutAmount)}</td>
      <td style="padding: 14px 16px; text-align: right;">
        <span style="padding: 4px 10px; border-radius: 6px; font-size: 0.74rem; font-weight: 800; ${job.status === 'completed' ? 'background: rgba(16, 185, 129, 0.15); color: #10B981;' : job.status === 'awaiting_release' ? 'background: rgba(255, 167, 38, 0.15); color: #FFA726;' : 'background: rgba(26, 140, 140, 0.15); color: var(--teal-bright);'}">
          ${job.status === 'completed' ? 'RELEASED' : job.status === 'awaiting_release' ? 'AWAITING INSPECTION' : 'FUNDS SECURED'}
        </span>
      </td>
    </tr>
  `).join('');
}

function renderAdminApprovalsQueue() {
  const container = document.getElementById('adminApprovalsTableBody');
  if (!container) return;

  const pendingList = state.providers.filter(p => p.status === 'pending');
  if (pendingList.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px;">Approvals queue is clear! All providers processed.</td></tr>`;
    return;
  }

  container.innerHTML = pendingList.map(p => `
    <tr style="border-bottom: 1px solid var(--hairline);">
      <td style="padding: 16px 24px;">
        <strong style="color: var(--canvas);">${p.businessName}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${p.name} • 📍 ${p.area}</div>
      </td>
      <td style="padding: 16px 20px;">
        <span class="ed-service-chip">${p.categoryName}</span>
      </td>
      <td style="padding: 16px 20px;">
        ${p.licenseDoc ? `
          <span style="color: #FFA726; font-size: 0.8rem; font-weight: 700;">⚠️ ${p.licenseDoc}</span>
        ` : `
          <span style="color: var(--teal-bright); font-size: 0.8rem; font-weight: 700;">✓ ID & Work Samples</span>
        `}
      </td>
      <td style="padding: 16px 20px;">
        <span style="background: rgba(255, 167, 38, 0.15); color: #FFA726; padding: 4px 10px; border-radius: 6px; font-size: 0.74rem; font-weight: 700;">Pending Review</span>
      </td>
      <td style="padding: 16px 24px; text-align: right;">
        <button class="ed-button ed-button-amber" style="padding: 6px 14px; font-size: 0.78rem;" onclick="adminApproveProvider('${p.id}')">Approve</button>
        <button class="ed-button ed-button-black" style="padding: 6px 14px; font-size: 0.78rem; color: #EF5350;" onclick="adminRejectProvider('${p.id}')">Reject</button>
      </td>
    </tr>
  `).join('');
}

function renderAdminDirectory() {
  const container = document.getElementById('adminDirectoryTableBody');
  if (!container) return;

  container.innerHTML = state.providers.map(p => `
    <tr style="border-bottom: 1px solid var(--hairline);">
      <td style="padding: 16px 24px;">
        <strong style="color: var(--canvas);">${p.businessName}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted);">📍 ${p.area}</div>
      </td>
      <td style="padding: 16px 20px;">${p.categoryName}</td>
      <td style="padding: 16px 20px;">
        <span class="${p.verified ? 'ed-badge-verified' : 'ed-service-chip'}" style="position: static; font-size: 0.72rem; padding: 3px 8px;">
          ${p.verified ? '✓ Teal Verified' : 'Unverified'}
        </span>
      </td>
      <td style="padding: 16px 20px;">
        <span style="font-weight: 800; font-size: 0.82rem; color: ${p.status === 'approved' ? 'var(--teal-bright)' : p.status === 'suspended' ? '#EF5350' : '#FFA726'};">
          ${p.status.toUpperCase()}
        </span>
      </td>
      <td style="padding: 16px 24px; text-align: right;">
        ${p.status === 'suspended' ? `
          <button class="ed-button ed-button-black" style="padding: 6px 14px; font-size: 0.78rem;" onclick="adminToggleSuspend('${p.id}', 'approved')">Reactivate</button>
        ` : `
          <button class="ed-button ed-button-black" style="padding: 6px 14px; font-size: 0.78rem; color: #EF5350;" onclick="adminToggleSuspend('${p.id}', 'suspended')">Suspend</button>
        `}
      </td>
    </tr>
  `).join('');
}

function renderAdminReports() {
  const container = document.getElementById('adminReportsTableBody');
  if (!container) return;

  if (state.reports.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px;">No active reports filed.</td></tr>`;
    return;
  }

  container.innerHTML = state.reports.map(r => `
    <tr style="border-bottom: 1px solid var(--hairline);">
      <td style="padding: 16px 24px;"><strong style="color: var(--canvas);">${r.providerName}</strong></td>
      <td style="padding: 16px 20px;"><span style="color: #EF5350; font-weight: 800; font-size: 0.82rem;">${r.reason}</span></td>
      <td style="padding: 16px 20px; font-size: 0.85rem; color: var(--text-muted);">${r.notes}</td>
      <td style="padding: 16px 20px; font-size: 0.8rem;">${r.date}</td>
      <td style="padding: 16px 24px; text-align: right;">
        <button class="ed-button ed-button-black" style="padding: 6px 14px; font-size: 0.78rem; color: #EF5350;" onclick="adminSuspendReported('${r.providerId}', '${r.id}')">Suspend Pro</button>
      </td>
    </tr>
  `).join('');
}

window.adminApproveProvider = function(proId) {
  const p = state.providers.find(x => x.id === proId);
  if (p) {
    p.status = 'approved';
    p.verified = true;
    persistState();
    renderAdminDashboard();
    showAppNotice({
      icon: '✓',
      eyebrow: 'ADMIN CONSOLE',
      title: 'Provider Approved',
      message: `<strong>${p.businessName}</strong> has been approved with the Teal Verified Badge.`,
      confirmText: 'Done'
    });
  }
};

window.adminRejectProvider = function(proId) {
  const p = state.providers.find(x => x.id === proId);
  if (p) {
    p.status = 'rejected';
    persistState();
    renderAdminDashboard();
    showAppNotice({
      icon: '⚠️',
      eyebrow: 'ADMIN CONSOLE',
      title: 'Application Rejected',
      message: `The application for <strong>${p.businessName}</strong> has been moved to rejected status.`,
      confirmText: 'Done'
    });
  }
};

window.adminToggleSuspend = function(proId, newStatus) {
  const p = state.providers.find(x => x.id === proId);
  if (p) {
    p.status = newStatus;
    persistState();
    renderAdminDashboard();
    showAppNotice({
      icon: '⚙️',
      eyebrow: 'ADMIN CONSOLE',
      title: 'Status Updated',
      message: `Status for <strong>${p.businessName}</strong> updated to: <strong>${newStatus}</strong>`,
      confirmText: 'Done'
    });
  }
};

window.adminSuspendReported = function(proId, repId) {
  adminToggleSuspend(proId, 'suspended');
  state.reports = state.reports.filter(r => r.id !== repId);
  persistState();
  renderAdminDashboard();
};

window.openReportModal = function(proId, proName) {
  const modal = document.getElementById('reportModal');
  document.getElementById('reportProName').textContent = proName;
  document.getElementById('reportProId').value = proId;
  modal.classList.add('open');
};

window.submitReport = function(e) {
  e.preventDefault();
  const proId = document.getElementById('reportProId').value;
  const pro = state.providers.find(p => p.id === proId);
  const reason = document.getElementById('reportReason').value;
  const notes = document.getElementById('reportNotes').value;

  state.reports.unshift({
    id: 'rep-' + Date.now(),
    providerId: proId,
    providerName: pro ? pro.businessName : 'Provider',
    reason: reason,
    notes: notes,
    date: 'Just now',
    status: 'pending'
  });

  persistState();
  closeModal('reportModal');
  showAppNotice({
    icon: '🛡️',
    eyebrow: 'REPORT SUBMITTED',
    title: 'Dispute Logged with Admin Ops',
    message: 'Your report has been routed to Godfrey and the Servhive dispute mediation team. We will review the details and reach out.',
    confirmText: 'Understood'
  });
};

// ==================== MY ACCOUNT (PAST JOBS, SAVED PROS, SUPPORT) ====================
let currentMyAccountTab = 'jobs';

window.openMyAccountModal = function() {
  const jobsCountEl = document.getElementById('myAccJobsCount');
  const savedCountEl = document.getElementById('myAccSavedCount');
  if (jobsCountEl) jobsCountEl.textContent = state.escrowJobs.length;
  if (savedCountEl) savedCountEl.textContent = state.savedProviderIds.length;

  switchMyAccountTab(currentMyAccountTab || 'jobs');
  const modal = document.getElementById('myAccountModal');
  if (modal) modal.classList.add('open');
};

window.switchMyAccountTab = function(tab) {
  currentMyAccountTab = tab;
  ['jobs', 'saved', 'support'].forEach(t => {
    const btn = document.getElementById(`myAccTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === tab);
  });
  renderMyAccountView();
};

window.renderMyAccountView = function() {
  const container = document.getElementById('myAccountContentArea');
  if (!container) return;

  const jobsCountEl = document.getElementById('myAccJobsCount');
  const savedCountEl = document.getElementById('myAccSavedCount');
  if (jobsCountEl) jobsCountEl.textContent = state.escrowJobs.length;
  if (savedCountEl) savedCountEl.textContent = state.savedProviderIds.length;

  if (currentMyAccountTab === 'jobs') {
    if (state.escrowJobs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 16px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px dashed var(--border);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🛡️</div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--foreground); margin-bottom: 4px;">No Escrow Jobs Yet</h4>
          <p style="font-size: 0.84rem; color: var(--muted-foreground); max-width: 420px; margin: 0 auto 16px;">
            Book any verified Port Harcourt artisan with 100% Escrow protection. Funds remain locked until you approve the finished work.
          </p>
          <button class="ed-button ed-button-amber ed-btn-compact" onclick="closeModal('myAccountModal'); location.href='#directory';">
            <span>Find Artisans Now</span>
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${state.escrowJobs.map(job => {
          const isDone = job.status === 'completed';
          const isAwaiting = job.status === 'awaiting_release';
          const commission = job.commissionAmount || Math.round(job.amount * 0.05);
          const payout = job.payoutAmount || (job.amount - commission);

          return `
            <div class="ed-escrow-card" style="margin: 0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                    <span class="ed-hero-tag" style="margin: 0; padding: 1px 6px; font-size: 0.68rem;">#${job.id}</span>
                    <span style="font-size: 0.76rem; color: var(--muted-foreground);">📍 ${job.area}</span>
                  </div>
                  <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--foreground); margin: 0 0 2px;">${job.proName}</h4>
                  <div style="font-size: 0.84rem; font-weight: 700; color: var(--amber-dark);">${job.serviceName}</div>
                  <div style="font-size: 0.74rem; color: var(--muted-foreground); margin-top: 2px;">Scheduled: ${job.dateTime || 'Standard Dispatch'} · ${job.address}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 1.25rem; font-weight: 900; color: var(--foreground);">${formatNaira(job.amount)}</div>
                  <span class="badge ${isDone ? 'ed-badge-verified' : isAwaiting ? 'badge-secondary' : 'ed-badge-boosted'}" style="font-size: 0.7rem; margin-top: 4px;">
                    ${isDone ? '✓ Paid to Artisan' : isAwaiting ? '⏳ Inspection Ready' : '🔒 Held in Escrow'}
                  </span>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--border); gap: 8px; flex-wrap: wrap;">
                <div style="font-size: 0.74rem; color: var(--muted-foreground);">
                  Commission (5%): <strong>${formatNaira(commission)}</strong> · Net Payout: <strong>${formatNaira(payout)}</strong>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                  ${!isDone && !isAwaiting ? `
                    <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.75rem;" onclick="simulateArtisanDone('${job.id}')">
                      Simulate Artisan Done &rarr;
                    </button>
                  ` : ''}
                  ${isAwaiting ? `
                    <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.78rem;" onclick="releaseEscrowPayment('${job.id}')">
                      Approve &amp; Release Payout
                    </button>
                  ` : ''}
                  ${isDone ? `
                    <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.75rem;" onclick="closeModal('myAccountModal'); showAddReviewPrompt('${job.proId}');">
                      ★ Rate &amp; Review
                    </button>
                  ` : ''}
                  <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.72rem; color: #DC2626;" onclick="closeModal('myAccountModal'); openReportModal('${job.proId}', '${job.proName}');">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (currentMyAccountTab === 'saved') {
    const savedPros = state.providers.filter(p => state.savedProviderIds.includes(p.id));
    if (savedPros.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 16px; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px dashed var(--border);">
          <div style="font-size: 2rem; margin-bottom: 8px;">❤️</div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--foreground); margin-bottom: 4px;">No Saved Providers Yet</h4>
          <p style="font-size: 0.84rem; color: var(--muted-foreground); max-width: 420px; margin: 0 auto 16px;">
            Click the heart bookmark icon on any provider in the Port Harcourt directory to save them here for quick access.
          </p>
          <button class="ed-button ed-button-amber ed-btn-compact" onclick="closeModal('myAccountModal'); location.href='#directory';">
            <span>Browse Directory</span>
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px;">
        ${savedPros.map(pro => `
          <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                <img src="${pro.image}" alt="${pro.businessName}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;">
                <div style="flex: 1; min-width: 0;">
                  <h5 style="font-size: 0.95rem; font-weight: 800; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--foreground);">${pro.businessName}</h5>
                  <div style="font-size: 0.74rem; color: var(--muted-foreground);">📍 ${pro.area} · ★ ${pro.rating.toFixed(1)}</div>
                </div>
              </div>
              <div style="font-size: 0.82rem; color: var(--muted-foreground); line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${pro.bio}
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 10px;">
              <span style="font-size: 0.86rem; font-weight: 800; color: var(--foreground);">${formatNaira(pro.startingPrice)}</span>
              <div style="display: flex; gap: 6px;">
                <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.72rem; padding: 4px 10px;" onclick="closeModal('myAccountModal'); openProfileModal('${pro.id}');">
                  View Profile
                </button>
                <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.72rem; padding: 4px 8px; color: #DC2626;" onclick="toggleSaveProvider('${pro.id}'); renderMyAccountView();">
                  Remove
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (currentMyAccountTab === 'support') {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px;">
          <div class="hero-eyebrow" style="margin-bottom: 4px;">CONCIERGE &amp; MEDIATION DESK</div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--foreground); margin-bottom: 8px;">Port Harcourt Operations Support</h4>
          <p style="font-size: 0.82rem; color: var(--muted-foreground); line-height: 1.5; margin-bottom: 14px;">
            Need help with an artisan, rate dispute, or escrow milestone release? Godfrey and the Rivers State field concierge team resolve queries within 2 hours.
          </p>
          <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 6px; color: var(--foreground); margin-bottom: 16px;">
            <div>📞 <strong>Hotline:</strong> +234 800-SERVHIVE (Toll Free)</div>
            <div>💬 <strong>WhatsApp Concierge:</strong> +234 803 123 4567</div>
            <div>🏢 <strong>Physical Hub:</strong> Trans-Amadi Industrial Layout, Port Harcourt</div>
          </div>
          <button class="ed-button ed-button-black" style="width: 100%; border-color: rgba(220, 38, 38, 0.4); color: #DC2626; padding: 10px;" onclick="closeModal('myAccountModal'); openReportModal('general', 'General Service Dispute');">
            <span>⚠️ Open a Support Dispute Ticket</span>
          </button>
        </div>

        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px;">
          <div class="hero-eyebrow" style="margin-bottom: 4px;">100% ESCROW PROTECTION POLICY</div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--foreground); margin-bottom: 8px;">How Servhive Protects Clients</h4>
          <ul style="padding-left: 18px; margin: 0 0 16px; font-size: 0.8rem; color: var(--muted-foreground); line-height: 1.55;">
            <li>Funds are deposited before work begins and held securely in trust.</li>
            <li>Artisans cannot charge beyond agreed transparent rate cards.</li>
            <li>Artisan only receives 95% net payout after you personally inspect work and approve release.</li>
            <li>5% Servhive platform safety fee guarantees dispute mediation and satisfaction warranty.</li>
          </ul>
          <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 0.76rem; color: var(--teal); font-weight: 700;">
            ✓ All artisans are vetted via Rivers State Ministry &amp; NIN KYC standards.
          </div>
        </div>
      </div>
    `;
  }
};

// ==================== PRO HOME (ARTISAN DASHBOARD, QUOTES & BOOSTS) ====================
let proSelectedBoostDays = 3;

window.openProHomeModal = function() {
  window.location.href = '/artisan.html';
};

window.renderProHomeRequests = function() {
  const container = document.getElementById('proHomeRequestsList');
  if (!container) return;

  if (state.quoteRequests.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px 14px; color: var(--muted-foreground); font-size: 0.86rem;">
        No active quote requests right now. New customer inquiries from Port Harcourt will show up here.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${state.quoteRequests.map(req => {
        const isPending = req.status === 'pending';
        const isQuoted = req.status === 'quoted';
        const isDeclined = req.status === 'declined';

        return `
          <div class="quote-request-card" style="margin: 0; background: var(--bg-surface-subtle); border: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; flex-wrap: wrap;">
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                  <span class="ed-hero-tag" style="margin: 0; padding: 1px 6px; font-size: 0.68rem;">#${req.id}</span>
                  <span style="font-size: 0.76rem; color: var(--muted-foreground);">📍 ${req.area}</span>
                  <span style="font-size: 0.74rem; color: var(--muted-foreground);">🕒 ${req.createdAt}</span>
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 0 0 2px;">${req.title}</h4>
                <div style="font-size: 0.82rem; color: var(--muted-foreground);">
                  Client: <strong>${req.customerName}</strong> (${req.customerPhone}) · ${req.address || req.area}
                </div>
              </div>
              <div>
                <span class="badge ${isPending ? 'ed-badge-boosted' : isQuoted ? 'ed-badge-verified' : 'badge-secondary'}" style="font-size: 0.74rem;">
                  ${isPending ? '⚡ Pending Quote' : isQuoted ? `✓ Quoted (${formatNaira(req.quoteAmount)})` : 'Declined'}
                </span>
              </div>
            </div>

            <p style="font-size: 0.82rem; color: var(--foreground); line-height: 1.45; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 8px 12px; margin: 6px 0 10px;">
              <strong>Client Description:</strong> "${req.details}"
            </p>

            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
              <div style="font-size: 0.76rem; color: var(--muted-foreground);">
                ${isQuoted ? `Turnaround: ${req.quoteNotes || 'Same day'}` : 'Submit an official quote to win this job.'}
              </div>
              <div style="display: flex; gap: 6px;">
                ${isPending ? `
                  <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.76rem;" onclick="openProEnterQuoteModal('${req.id}')">
                    Enter Quote &rarr;
                  </button>
                  <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.76rem;" onclick="closeModal('proHomeModal'); openChatDrawer('${req.proId || 'pro-1'}');">
                    💬 Message Client
                  </button>
                  <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.76rem; color: #DC2626;" onclick="declineProRequest('${req.id}')">
                    Decline
                  </button>
                ` : isQuoted ? `
                  <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.76rem;" onclick="closeModal('proHomeModal'); openChatDrawer('${req.proId || 'pro-1'}');">
                    💬 Open in Chat
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

window.openProEnterQuoteModal = function(reqId) {
  const req = state.quoteRequests.find(r => r.id === reqId);
  if (!req) return;

  document.getElementById('quoteReqId').value = req.id;
  const ctx = document.getElementById('quoteModalClientContext');
  if (ctx) {
    ctx.innerHTML = `Quoting for <strong>${req.customerName}</strong> in <strong>${req.area}</strong>: <em>${req.title}</em>`;
  }
  const amtInput = document.getElementById('quoteAmountInput');
  if (amtInput) {
    amtInput.value = '25000';
    updateQuoteBreakdown(25000);
  }

  const modal = document.getElementById('proEnterQuoteModal');
  if (modal) modal.classList.add('open');
};

window.updateQuoteBreakdown = function(val) {
  const num = Number(val) || 0;
  const comm = Math.round(num * 0.05);
  const payout = num - comm;

  const totalEl = document.getElementById('quoteTotalDisplay');
  const commEl = document.getElementById('quoteCommissionDisplay');
  const payoutEl = document.getElementById('quoteNetPayoutDisplay');

  if (totalEl) totalEl.textContent = formatNaira(num);
  if (commEl) commEl.textContent = `${formatNaira(comm)} (5%)`;
  if (payoutEl) payoutEl.textContent = formatNaira(payout);
};

window.handleProSubmitQuote = function(e) {
  e.preventDefault();
  const reqId = document.getElementById('quoteReqId').value;
  const amount = Number(document.getElementById('quoteAmountInput').value) || 25000;
  const duration = document.getElementById('quoteDurationInput').value.trim();
  const notes = document.getElementById('quoteNotesInput').value.trim();

  const req = state.quoteRequests.find(r => r.id === reqId);
  if (!req) return;

  req.status = 'quoted';
  req.quoteAmount = amount;
  req.quoteDuration = duration;
  req.quoteNotes = notes;

  const proId = req.proId || 'pro-1';
  if (!state.chatMessages[proId]) state.chatMessages[proId] = [];

  state.chatMessages[proId].push({
    sender: 'provider',
    isQuote: true,
    quoteId: 'quot-' + Date.now().toString().slice(-4),
    serviceName: req.title,
    amount: amount,
    duration: duration,
    notes: notes
  });

  persistState();
  closeModal('proEnterQuoteModal');
  renderProHomeRequests();

  showAppNotice({
    icon: '⚡',
    eyebrow: 'QUOTE SUBMITTED TO CLIENT',
    title: `Official Quote of ${formatNaira(amount)} Sent!`,
    message: `Your quote has been transmitted directly to <strong>${req.customerName}</strong> in chat. When the client approves, the funds will be placed into Escrow before you proceed to site.`,
    confirmText: 'Great!'
  });
};

window.declineProRequest = function(reqId) {
  const req = state.quoteRequests.find(r => r.id === reqId);
  if (req) {
    req.status = 'declined';
    persistState();
    renderProHomeRequests();
  }
};

window.selectBoostDays = function(days) {
  proSelectedBoostDays = days;
  [1, 3, 7, 14].forEach(d => {
    const chip = document.getElementById(`boostChip-${d}`);
    if (chip) chip.classList.toggle('active', d === days);
  });

  const cost = days * (state.boostDailyRate || 500);
  const btn = document.getElementById('activateBoostBtn');
  if (btn) {
    btn.innerHTML = `<span>⚡ Activate Visibility Boost (${days} ${days === 1 ? 'Day' : 'Days'} · ${formatNaira(cost)})</span>`;
  }
};

window.activateProVisibilityBoost = function() {
  const days = proSelectedBoostDays || 3;
  const cost = days * (state.boostDailyRate || 500);

  // Boost pro-1 (and any active artisan)
  const targetPro = state.providers.find(p => p.id === 'pro-1') || state.providers[0];
  if (targetPro) {
    targetPro.boosted = true;
    targetPro.boostDaysRemaining = days;
  }

  persistState();
  renderProviders();

  showAppNotice({
    icon: '⚡',
    eyebrow: 'VISIBILITY BOOST ACTIVATED',
    title: `Pinned to Top of PH Search (${days} Days)!`,
    message: `Your profile (<strong>${targetPro ? targetPro.businessName : 'PowerVolt'}</strong>) has been pinned to the top boosted tier for ${days} days (${formatNaira(cost)}).\n\nExpect significantly increased customer quote inquiries from Port Harcourt residents.`,
    confirmText: 'View Directory →',
    onConfirm: () => {
      closeModal('proHomeModal');
      location.href = '#directory';
    }
  });
};

// ==================== PROFILE BUILDER & VERIFICATION ====================
let pbCurrentTab = 'about';
let pbCurrentProId = 'pro-1';
let pbRateCardItems = [];

window.openProfileBuilderModal = function(proId) {
  pbCurrentProId = proId || 'pro-1';
  const pro = state.providers.find(p => p.id === pbCurrentProId) || state.providers[0];
  if (!pro) return;

  const nameEl = document.getElementById('pbName');
  const bizEl = document.getElementById('pbBizName');
  const phoneEl = document.getElementById('pbPhone');
  const catEl = document.getElementById('pbCategory');
  const bioEl = document.getElementById('pbBio');

  if (nameEl) nameEl.value = pro.name || 'Engr. Emeka Obi';
  if (bizEl) bizEl.value = pro.businessName;
  if (phoneEl) phoneEl.value = '0802 345 6789';
  if (catEl) catEl.value = pro.category;
  if (bioEl) bioEl.value = pro.bio;

  // Set areas checkboxes
  const checkboxes = document.querySelectorAll('#pbAreasCheckboxes input[name="pbArea"]');
  checkboxes.forEach(cb => {
    cb.checked = (pro.landmarks && pro.landmarks.includes(cb.value)) || pro.area.includes(cb.value);
  });

  // Load rate cards
  pbRateCardItems = pro.services && pro.services.length > 0
    ? JSON.parse(JSON.stringify(pro.services))
    : [
        { name: 'Standard Diagnostics', price: 10000, type: 'Fixed' },
        { name: 'Full Service Overhaul', price: 35000, type: 'Starting from' }
      ];
  renderPbServicesList();

  switchProfileBuilderTab('about');
  const modal = document.getElementById('profileBuilderModal');
  if (modal) modal.classList.add('open');
};

window.switchProfileBuilderTab = function(tab) {
  pbCurrentTab = tab;
  ['about', 'areas', 'services', 'verification'].forEach(t => {
    const btn = document.getElementById(`pbTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === tab);
    const sec = document.getElementById(`pbSection${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (sec) sec.style.display = t === tab ? 'block' : 'none';
  });
};

window.renderPbServicesList = function() {
  const container = document.getElementById('pbServicesList');
  if (!container) return;

  container.innerHTML = pbRateCardItems.map((item, idx) => `
    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 8px; align-items: center; background: var(--bg-surface-subtle); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
      <input type="text" class="ed-search-input" style="height: 36px; padding: 0 8px; font-size: 0.82rem; background: var(--card); color: var(--foreground); border: 1px solid var(--border);" value="${item.name}" placeholder="Service Name" oninput="pbRateCardItems[${idx}].name = this.value">
      <input type="number" class="ed-search-input" style="height: 36px; padding: 0 8px; font-size: 0.82rem; background: var(--card); color: var(--foreground); border: 1px solid var(--border);" value="${item.price}" placeholder="Price (₦)" oninput="pbRateCardItems[${idx}].price = Number(this.value)">
      <select class="ed-select-input" style="height: 36px; padding: 0 8px; font-size: 0.78rem; background: var(--card); color: var(--foreground); border: 1px solid var(--border);" onchange="pbRateCardItems[${idx}].type = this.value">
        <option value="Fixed" ${item.type === 'Fixed' ? 'selected' : ''}>Fixed Price</option>
        <option value="Starting from" ${item.type === 'Starting from' ? 'selected' : ''}>Starting from</option>
      </select>
      <button type="button" class="ed-button ed-button-black ed-btn-compact" style="color: #DC2626; height: 36px; padding: 0 8px;" onclick="removePbServiceItem(${idx})">✕</button>
    </div>
  `).join('');
};

window.addPbServiceItem = function() {
  pbRateCardItems.push({ name: 'New Custom Service', price: 15000, type: 'Fixed' });
  renderPbServicesList();
};

window.removePbServiceItem = function(idx) {
  pbRateCardItems.splice(idx, 1);
  renderPbServicesList();
};

window.handleSaveProfileBuilder = function(e) {
  e.preventDefault();
  const pro = state.providers.find(p => p.id === pbCurrentProId) || state.providers[0];
  if (!pro) return;

  const nameVal = document.getElementById('pbName').value.trim();
  const bizVal = document.getElementById('pbBizName').value.trim();
  const catVal = document.getElementById('pbCategory').value;
  const bioVal = document.getElementById('pbBio').value.trim();

  pro.name = nameVal;
  pro.businessName = bizVal;
  pro.category = catVal;
  pro.bio = bioVal;
  pro.services = pbRateCardItems.filter(s => s.name && s.price > 0);
  if (pro.services.length > 0) {
    pro.startingPrice = Math.min(...pro.services.map(s => s.price));
  }

  // Update areas
  const checkedAreas = Array.from(document.querySelectorAll('#pbAreasCheckboxes input[name="pbArea"]:checked')).map(cb => cb.value);
  if (checkedAreas.length > 0) {
    pro.landmarks = checkedAreas;
  }

  persistState();
  renderProviders();
  closeModal('profileBuilderModal');

  showAppNotice({
    icon: '✓',
    eyebrow: 'PROFILE & RATE CARD UPDATED',
    title: 'Listing Refreshed Successfully!',
    message: `Your verified profile (<strong>${pro.businessName}</strong>) and services &amp; prices rate card have been saved and updated across Port Harcourt search results.`,
    confirmText: 'View in Directory →',
    onConfirm: () => {
      openProfileModal(pro.id);
    }
  });
};

// Theme Toggle Engine
window.toggleTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('servhive_theme', newTheme);
  updateThemeIcon(newTheme);
};

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeToggleIcon');
  const btn = document.getElementById('themeToggleBtn');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  if (btn) {
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
}

// Mobile Menu Handler
window.toggleMobileMenu = function() {
  const menu = document.getElementById('edMobileMenu');
  if (menu) {
    menu.classList.toggle('open');
  }
};

// Initialization & Event Binding
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('servhive_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  // Automatic Role-Based Landing: Artisans land directly on their Artisan Dashboard
  const user = state.currentUser;
  if (user && user.role === 'artisan') {
    if (!window.location.search.includes('view=client')) {
      window.location.replace('/artisan.html');
      return;
    } else {
      const banner = document.getElementById('artisanClientPreviewBanner');
      if (banner) banner.style.display = 'flex';
    }
  }

  renderFilterPills();
  renderProviders();
  updateEscrowBadge();
  updateAuthUI();

  // Close user dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('authUserDropdown');
    const userBtn = e.target.closest('.auth-user-btn');
    if (dropdown && dropdown.classList.contains('open') && !userBtn && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // URL Hash routing for auth & views
  const hash = window.location.hash;
  if (hash === '#login') {
    switchToAuthView('login', 'hirer');
  } else if (hash === '#signup') {
    switchToAuthView('signup', 'hirer');
  } else if (hash === '#signup-artisan' || hash === '#signup-pro') {
    switchToAuthView('signup', 'artisan');
  } else if (hash === '#admin') {
    switchToAdminView();
  }

  const searchInput = document.getElementById('heroSearchInput');
  const areaSelect = document.getElementById('heroAreaSelect');
  const sortSelect = document.getElementById('sortSelect');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProviders();
    });
  }

  if (areaSelect) {
    areaSelect.innerHTML = `
      <option value="All Port Harcourt">All Port Harcourt (Any Area)</option>
      <optgroup label="Popular PH Landmarks & Junctions">
        ${PH_LANDMARKS.map(l => `<option value="${l.name}">📍 ${l.name}</option>`).join('')}
      </optgroup>
      <optgroup label="Residential & Commercial Zones">
        ${AREAS.filter(a => a !== 'All Port Harcourt').map(a => `<option value="${a}">${a}</option>`).join('')}
      </optgroup>
    `;

    areaSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'All Port Harcourt') {
        state.selectedLandmark = null;
        state.selectedArea = 'All Port Harcourt';
        renderProviders();
        return;
      }

      const landmark = PH_LANDMARKS.find(l => l.name === val);
      if (landmark) {
        filterByLandmark(landmark.name);
      } else {
        state.selectedLandmark = null;
        state.selectedArea = val;
        renderProviders();
      }
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      if (state.sortBy === 'distance' && !state.userCoords) {
        detectClientLocation();
      } else {
        renderProviders();
      }
    });
  }
});

// Global window exposure for inline onclick attributes
window.state = state;
window.PH_LANDMARKS = PH_LANDMARKS;
window.renderProviders = renderProviders;
window.detectClientLocation = detectClientLocation;
window.clearLocationFilter = clearLocationFilter;
window.filterByLandmark = filterByLandmark;
window.quickSearch = quickSearch;
window.getDistanceKm = getDistanceKm;
window.switchToAuthView = switchToAuthView;
window.setAuthRole = setAuthRole;
window.setAuthMode = setAuthMode;
window.quickFillDemo = quickFillDemo;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleLoginSubmit = handleLoginSubmit;
window.handleHirerSignupSubmit = handleHirerSignupSubmit;
window.handleArtisanSignupSubmit = handleArtisanSignupSubmit;
window.handleLogout = handleLogout;
window.switchUserRole = switchUserRole;
window.toggleUserMenu = toggleUserMenu;
window.openForgotPasswordModal = openForgotPasswordModal;
window.handleForgotPasswordSubmit = handleForgotPasswordSubmit;
window.updateAuthUI = updateAuthUI;
window.openMyAccountModal = openMyAccountModal;
window.switchMyAccountTab = switchMyAccountTab;
window.renderMyAccountView = renderMyAccountView;
window.openProHomeModal = openProHomeModal;
window.renderProHomeRequests = renderProHomeRequests;
window.openProEnterQuoteModal = openProEnterQuoteModal;
window.updateQuoteBreakdown = updateQuoteBreakdown;
window.handleProSubmitQuote = handleProSubmitQuote;
window.declineProRequest = declineProRequest;
window.selectBoostDays = selectBoostDays;
window.activateProVisibilityBoost = activateProVisibilityBoost;
window.openProfileBuilderModal = openProfileBuilderModal;
window.switchProfileBuilderTab = switchProfileBuilderTab;
window.renderPbServicesList = renderPbServicesList;
window.addPbServiceItem = addPbServiceItem;
window.removePbServiceItem = removePbServiceItem;
window.handleSaveProfileBuilder = handleSaveProfileBuilder;
window.switchChatTab = switchChatTab;
window.submitJobQuoteRequest = submitJobQuoteRequest;
window.acceptQuoteAndPayEscrow = acceptQuoteAndPayEscrow;
window.openPhotoZoom = openPhotoZoom;
window.toggleSaveProvider = toggleSaveProvider;
