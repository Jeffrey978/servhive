/* ===================================================================
   SERVHIVE APPLICATION ENGINE — ESCOLHA DIGITAL AESTHETICS
   Fonts: Montserrat • Brand Colors: Amber #F2A900, Teal #0F5C5C, Ink #1B1B1B
   =================================================================== */

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Trades' },
  { id: 'home-repairs', name: 'Home Repairs' },
  { id: 'interior', name: 'Interior & Tiling' },
  { id: 'beauty', name: 'Beauty & Grooming' },
  { id: 'solar-tech', name: 'Tech & Solar' },
  { id: 'auto', name: 'Vehicle Upkeep' }
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
    category: 'home-repairs',
    categoryName: 'Home Repairs',
    subSpecialty: 'Generator & Inverter Specialist',
    area: 'Trans-Amadi',
    lat: 4.8190,
    lng: 7.0350,
    landmarks: ['Trans-Amadi & Slaughter Bridge', 'Peter Odili Road & Trans-Amadi Gardens', 'Artillery Junction & Okporo', 'Garrison Junction & D-Line'],
    rating: 4.9,
    reviewCount: 46,
    verified: true,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 8000,
    responseTime: '~15 mins',
    bio: 'Over 9 years solving electrical faults and power fluctuations in Port Harcourt. Specialized in Mikano, Perkins, and Firman generator servicing, automatic changeover switches, and industrial load balancing.',
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
    category: 'beauty',
    categoryName: 'Beauty & Grooming',
    subSpecialty: 'Luxury Braids & Hair Treatments',
    area: 'New GRA / Phase 2',
    lat: 4.8180,
    lng: 6.9980,
    landmarks: ['New GRA (Tombia / Birabi)', 'Hotel Presidential & Rumuola', 'Waterlines / Aba Road', 'Old GRA & Government House'],
    rating: 5.0,
    reviewCount: 62,
    verified: true,
    status: 'approved',
    image: '/assets/hairstylist.jpg',
    startingPrice: 7000,
    responseTime: '~10 mins',
    bio: 'Professional cosmetologist and hair architect in New GRA. We deliver neat knotless braids, frontal installations, and restorative scalping in a serene environment or home service.',
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
    category: 'interior',
    categoryName: 'Interior & Tiling',
    subSpecialty: 'POP Ceiling & Italian Tiling',
    area: 'Woji',
    lat: 4.8250,
    lng: 7.0580,
    landmarks: ['Woji & Golf Estate Gate', 'Peter Odili Road & Trans-Amadi Gardens', 'Oil Mill Junction & Elelenwo', 'Trans-Amadi & Slaughter Bridge'],
    rating: 4.8,
    reviewCount: 34,
    verified: true,
    status: 'approved',
    image: '/assets/interior_pop.jpg',
    startingPrice: 15000,
    responseTime: '~30 mins',
    bio: 'Master of modern ceiling acoustics and Italian porcelain tiling. Serving high-end homes and developments in Woji, Peter Odili, and Golf Estate.',
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
    categoryName: 'Tech & Solar',
    subSpecialty: 'Solar Hybrid Systems & CCTV',
    area: 'Peter Odili Road',
    lat: 4.8080,
    lng: 7.0450,
    landmarks: ['Peter Odili Road & Trans-Amadi Gardens', 'Trans-Amadi & Slaughter Bridge', 'Woji & Golf Estate Gate', 'Garrison Junction & D-Line'],
    rating: 4.9,
    reviewCount: 51,
    verified: true,
    status: 'approved',
    image: '/assets/solar_tech.jpg',
    startingPrice: 12000,
    responseTime: '~20 mins',
    bio: 'Certified renewable energy specialist. Helping PH households beat unpredictable grid blackouts with reliable lithium and tubular battery solar setups.',
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
    category: 'auto',
    categoryName: 'Vehicle Upkeep',
    subSpecialty: 'Mobile Mechanic & Scanner',
    area: 'D-Line',
    lat: 4.8055,
    lng: 7.0150,
    landmarks: ['Garrison Junction & D-Line', 'Waterlines / Aba Road', 'Hotel Presidential & Rumuola', 'Mile 1-3 Diobu & Education Bus Stop'],
    rating: 4.7,
    reviewCount: 29,
    verified: true,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 6000,
    responseTime: '~25 mins',
    bio: 'Mobile computerized OBD-2 engine scanning, brake bleeding, suspension troubleshooting, and roadside mechanical assistance across Port Harcourt.',
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
    status: 'pending',
    licenseDoc: 'Rivers State Nursing Council Reg #RN-2024-8842.pdf',
    image: '/assets/hairstylist.jpg',
    startingPrice: 20000,
    responseTime: '~1 hr',
    bio: 'Registered nurse providing licensed in-home elderly companionship, vitals monitoring, and rehabilitation support in Port Harcourt.',
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
    category: 'home-repairs',
    categoryName: 'Home Repairs',
    subSpecialty: 'Air Conditioning & Cold Room Engineer',
    area: 'Choba / Uniport',
    lat: 4.8980,
    lng: 6.9240,
    landmarks: ['Choba & Uniport Delta Park', 'UPTH Gate & Alakahia', 'Rumuokoro Flyover & Roundabout'],
    rating: 4.9,
    reviewCount: 38,
    verified: true,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 10000,
    responseTime: '~20 mins',
    bio: 'Specialist AC installation, gas top-ups, inverter compressor diagnostics, and commercial cold-room servicing in Choba, Uniport, Alakahia, and Ada George.',
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
    name: 'Osaro Idehen',
    businessName: 'Reliable Borehole & Submersible Pump Services',
    category: 'home-repairs',
    categoryName: 'Home Repairs',
    subSpecialty: 'Plumbing & Deep Well Submersible Pumps',
    area: 'Ada George',
    lat: 4.8420,
    lng: 6.9750,
    landmarks: ['Ada George & Wimpey Junction', 'Agip Roundabout & Ikwerre Road', 'Rumuokoro Flyover & Roundabout'],
    rating: 4.8,
    reviewCount: 42,
    verified: true,
    status: 'approved',
    image: '/assets/solar_tech.jpg',
    startingPrice: 12000,
    responseTime: '~25 mins',
    bio: 'Expert borehole drilling maintenance, Italian submersible pump rewinding, automatic float switches, and domestic plumbing piping in Ada George and Rumueme.',
    services: [
      { name: 'Borehole Submersible Pump Extraction & Repair', price: 25000, type: 'Starting from' },
      { name: 'Automated Water Level Controller Installation', price: 14000, type: 'Fixed' }
    ],
    reviews: [
      { author: 'Pastor George', area: 'Ada George', rating: 5, date: '1 week ago', text: 'Restored water in our estate within 2 hours. Very honest craftsman.' }
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
        lat: p.lat || defaultMatch.lat,
        lng: p.lng || defaultMatch.lng,
        landmarks: (p.landmarks && p.landmarks.length) ? p.landmarks : defaultMatch.landmarks
      };
    }
    const landmarkMatch = PH_LANDMARKS.find(l => l.zone.toLowerCase() === (p.area || '').toLowerCase()) || PH_LANDMARKS[0];
    return {
      ...p,
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
      commissionPct: 10,
      commissionAmount: 1500,
      payoutAmount: 13500
    }
  ],
  selectedCategory: 'all',
  selectedArea: 'All Port Harcourt',
  selectedLandmark: null,
  userCoords: null, // { lat: number, lng: number, label: string, distanceToLandmark?: number, isSimulated?: boolean }
  searchQuery: '',
  verifiedOnly: false,
  sortBy: 'featured',
  activeChatProvider: null,
  activeProfileModalProvider: null,
  chatMessages: {},
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
      category: 'home-repairs',
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

// Render Filter Tabs
function renderFilterPills() {
  const container = document.getElementById('filterPills');
  if (!container) return;

  container.innerHTML = INITIAL_CATEGORIES.map(cat => `
    <button class="ed-pill-tab ${state.selectedCategory === cat.id ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
      ${cat.name}
    </button>
  `).join('');
}

window.selectCategory = function(catId) {
  state.selectedCategory = state.selectedCategory === catId ? 'all' : catId;
  renderFilterPills();
  renderProviders();
};

// Render Providers with Proximity Auto-Suggest & Landmark Matching
function renderProviders() {
  const grid = document.getElementById('providersGrid');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  let filtered = state.providers.filter(p => p.status === 'approved');

  // Category filter
  if (state.selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === state.selectedCategory);
  }

  // Selected Landmark filter
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
    // If exact landmark is too strict, keep all approved and let proximity sorting order them
  } else if (state.selectedArea !== 'All Port Harcourt') {
    // Area filter from dropdown
    const selArea = state.selectedArea.toLowerCase();
    filtered = filtered.filter(p => 
      p.area.toLowerCase().includes(selArea) ||
      (p.landmarks && p.landmarks.some(lm => lm.toLowerCase().includes(selArea)))
    );
  }

  // Search query filter (matches trade, name, service, keywords, and landmarks)
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

  // Verified only filter
  if (state.verifiedOnly) {
    filtered = filtered.filter(p => p.verified);
  }

  // Calculate distance to each provider if userCoords is active
  if (state.userCoords) {
    filtered.forEach(p => {
      p.distanceKm = getDistanceKm(state.userCoords.lat, state.userCoords.lng, p.lat, p.lng);
    });
  } else {
    filtered.forEach(p => {
      delete p.distanceKm;
    });
  }

  // Sorting
  if (state.sortBy === 'distance' && state.userCoords) {
    filtered.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  } else if (state.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === 'price-low') {
    filtered.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (state.sortBy === 'reviews') {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (state.userCoords) {
    // When location is active and user is on 'featured', sort by closest travel distance!
    filtered.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
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
        <span style="font-size: 1.4rem; line-height: 1;">📍</span>
        <div>
          <div style="font-weight: 800; font-size: 0.95rem; color: var(--canvas);">
            Proximity Auto-Suggest Active: Near <strong>${state.userCoords.label}</strong>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
            ${state.userCoords.isSimulated ? 'Simulated around PH central landmark. ' : 'GPS auto-detected. '}
            Displaying verified businesses sorted by closest travel distance in Port Harcourt.
          </div>
        </div>
      </div>
      <button class="ed-button ed-button-black ed-btn-compact" onclick="clearLocationFilter()" style="padding: 8px 14px; font-size: 0.82rem;">
        <span>✕ Reset Proximity</span>
      </button>
    </div>
  ` : '';

  if (filtered.length === 0) {
    grid.innerHTML = bannerHtml + `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--surface-dark); border-radius: var(--radius-lg); border: 1px solid var(--hairline);">
        <div style="margin-bottom: 16px; color: var(--text-muted);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 style="font-size: 1.4rem; font-weight: 800;">No verified artisans found for this landmark or trade</h3>
        <p style="color: var(--text-muted); margin-top: 6px; font-size: 0.95rem;">Try selecting a different Port Harcourt landmark or resetting filters.</p>
        <button class="ed-button ed-button-amber" style="margin-top: 20px;" onclick="resetFilters()">
          <span>Reset All Filters</span>
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = bannerHtml + filtered.map(pro => `
    <article class="ed-pro-card">
      <div class="ed-pro-header-row">
        <img class="ed-pro-avatar" src="${pro.image}" alt="${pro.name}" loading="lazy" />
        <div class="ed-pro-title-wrap">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
            <span style="font-size: 0.76rem; font-weight: 800; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">${pro.categoryName}</span>
            <span class="ed-badge-rating">
              <span style="color: var(--amber-dark);">★</span> ${pro.rating.toFixed(1)} <small style="color: var(--text-muted); font-weight: 500;">(${pro.reviewCount})</small>
            </span>
          </div>
          <h3 class="ed-pro-name">${pro.businessName}</h3>
          <div class="ed-pro-subtitle">${pro.name} · ${pro.subSpecialty}</div>
          <div class="ed-pro-meta-chips">
            ${pro.verified ? `
              <span class="ed-badge-verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                Rivers Verified Pro
              </span>
            ` : ''}
            <span class="ed-badge-area">📍 ${pro.area}</span>
            ${pro.distanceKm !== undefined ? `
              <span class="ed-badge-distance">📍 ${pro.distanceKm} km away</span>
            ` : ''}
            <span style="font-size: 0.74rem; color: var(--text-muted); font-weight: 600;">⚡ ${pro.responseTime}</span>
          </div>
        </div>
      </div>

      <p class="ed-pro-bio">${pro.bio}</p>

      <div class="ed-services-preview">
        ${pro.services.slice(0, 3).map(s => `
          <span class="ed-service-chip">${s.name} (<strong>${formatNaira(s.price)}</strong>)</span>
        `).join('')}
      </div>

      <div class="ed-card-footer">
        <div class="ed-pro-price-summary">
          <span class="ed-pro-price-label">Starting Rate</span>
          <span class="ed-pro-price-value">${formatNaira(pro.startingPrice)}</span>
        </div>

        <div class="ed-pro-actions">
          <button class="ed-button ed-button-black ed-btn-compact" onclick="openProfileModal('${pro.id}')">
            <span>View Rate Card</span>
          </button>
          <button class="ed-button ed-button-amber ed-btn-compact" onclick="openEscrowBookingModal('${pro.id}', '${pro.services[0].name.replace(/'/g, "\\'")}', ${pro.services[0].price})">
            <span>Book with Escrow</span>
          </button>
          <button class="ed-button ed-button-black ed-btn-compact" style="padding: 8px 10px;" title="In-App Masked Chat" onclick="openChatDrawer('${pro.id}')">
            <span>💬</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

window.resetFilters = function() {
  state.selectedCategory = 'all';
  state.selectedArea = 'All Port Harcourt';
  state.selectedLandmark = null;
  state.userCoords = null;
  state.searchQuery = '';
  state.verifiedOnly = false;
  state.sortBy = 'featured';

  const areaSelect = document.getElementById('heroAreaSelect');
  const searchInput = document.getElementById('heroSearchInput');
  const verifiedCheckbox = document.getElementById('verifiedOnlyCheckbox');
  const sortSelect = document.getElementById('sortSelect');
  const geoBtn = document.getElementById('geoDetectBtn');
  const btnText = geoBtn ? geoBtn.querySelector('.geo-btn-text') : null;

  if (areaSelect) areaSelect.value = 'All Port Harcourt';
  if (searchInput) searchInput.value = '';
  if (verifiedCheckbox) verifiedCheckbox.checked = false;
  if (sortSelect) sortSelect.value = 'featured';
  if (btnText) btnText.textContent = 'Near Me';
  if (geoBtn) geoBtn.classList.remove('active');

  renderFilterPills();
  renderProviders();
};

// Profile Modal
window.openProfileModal = function(proId) {
  const pro = state.providers.find(p => p.id === proId);
  if (!pro) return;

  state.activeProfileModalProvider = pro;
  const modal = document.getElementById('profileModal');
  const modalBody = document.getElementById('profileModalBody');

  modalBody.innerHTML = `
    <div style="height: 200px; position: relative; overflow: hidden; background: #0F141C;">
      <img src="${pro.image}" alt="${pro.name}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.88;" />
      <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);"></div>
      <div style="position: absolute; bottom: 16px; left: 24px; display: flex; gap: 8px; flex-wrap: wrap;">
        <span class="ed-badge-verified" style="background: var(--teal); color: #FFFFFF;">✓ Rivers Verified Pro</span>
        <span style="background: rgba(0,0,0,0.65); color: #FFFFFF; padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.76rem; font-weight: 700;">📍 ${pro.area}, Port Harcourt</span>
      </div>
    </div>

    <div style="padding: 28px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 4px; color: var(--canvas);">${pro.businessName}</h2>
          <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">Lead Pro: ${pro.name} • ${pro.subSpecialty}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--amber-dark);">★ ${pro.rating.toFixed(1)}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${pro.reviewCount} client ratings</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 0.88rem; font-weight: 800; margin-bottom: 6px; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">About the Service</h4>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">${pro.bio}</p>
      </div>

      <!-- Rate Card -->
      <div style="margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 0.88rem; font-weight: 800; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">Transparent Rate Card</h4>
          <span style="font-size: 0.78rem; color: var(--teal); font-weight: 700;">Zero Hidden Fees</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${pro.services.map(s => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: var(--bg-surface-subtle); border: 1px solid var(--hairline); border-radius: var(--radius-sm); gap: 12px; flex-wrap: wrap;">
              <div>
                <div style="font-weight: 800; font-size: 0.92rem; color: var(--canvas);">${s.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${s.type}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-weight: 800; color: var(--amber-dark); font-size: 1.05rem;">
                  ${formatNaira(s.price)}
                </div>
                <button class="ed-button ed-button-amber ed-btn-compact" onclick="openEscrowBookingModal('${pro.id}', '${s.name.replace(/'/g, "\\'")}', ${s.price}); closeModal('profileModal');">
                  <span>Book with Escrow</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Actions -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px;">
        <button class="ed-button ed-button-amber" onclick="openChatDrawer('${pro.id}'); closeModal('profileModal');">
          <span>Message Provider</span>
        </button>
        <button class="ed-button ed-button-black" onclick="showCallMaskModal('${pro.name}')">
          <span>Call Protected Number</span>
        </button>
      </div>

      <!-- Reviews -->
      <div style="border-top: 1px solid var(--hairline); padding-top: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--canvas);">Client Reviews (${pro.reviews.length})</h4>
          <button class="ed-button ed-button-black ed-btn-compact" onclick="showAddReviewPrompt('${pro.id}')"><span>+ Add Review</span></button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${pro.reviews.map(r => `
            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 14px 18px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-weight: 800; font-size: 0.9rem; color: var(--canvas);">${r.author} <small style="color: var(--text-muted); font-weight: 500;">(${r.area})</small></span>
                <span style="color: var(--amber-dark); font-size: 0.85rem; font-weight: 800;">★ ${r.rating}</span>
              </div>
              <p style="font-size: 0.86rem; color: var(--text-muted);">${r.text}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Report link -->
      <div style="margin-top: 24px; text-align: center;">
        <button style="background: none; border: none; color: #DC2626; font-size: 0.8rem; font-weight: 700; cursor: pointer;" onclick="openReportModal('${pro.id}', '${pro.businessName}')">
          ⚠️ Report problem with this provider
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

// Chat Drawer
window.openChatDrawer = function(proId) {
  const pro = state.providers.find(p => p.id === proId);
  if (!pro) return;

  state.activeChatProvider = pro;
  const drawer = document.getElementById('chatDrawer');
  document.getElementById('chatProName').textContent = pro.businessName;
  document.getElementById('chatProAvatar').src = pro.image;

  if (!state.chatMessages[pro.id]) {
    state.chatMessages[pro.id] = [
      { sender: 'provider', text: `Hello! Thanks for reaching out to ${pro.businessName}. How can I assist with your service in Port Harcourt today?` }
    ];
  }

  renderChatMessages();
  drawer.classList.add('open');
};

window.closeChatDrawer = function() {
  document.getElementById('chatDrawer').classList.remove('open');
};

function renderChatMessages() {
  const container = document.getElementById('chatMessages');
  if (!container || !state.activeChatProvider) return;

  const msgs = state.chatMessages[state.activeChatProvider.id] || [];
  container.innerHTML = msgs.map(m => `
    <div style="max-width: 82%; padding: 12px 16px; border-radius: 14px; font-size: 0.88rem; line-height: 1.45; ${m.sender === 'provider' ? 'align-self: flex-start; background: var(--chat-bubble-peer); border: 1px solid var(--hairline); color: var(--canvas);' : 'align-self: flex-end; background: var(--amber); color: var(--ink); font-weight: 700;'}">
      ${m.text}
    </div>
  `).join('');
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
          Early providers get <strong class="text-amber">3 Months Free on Verified Pro</strong> (₦3,000–₦6,000/mo value).
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
          <div style="font-weight: 800; color: var(--amber-dark); font-size: 0.95rem; margin-bottom: 4px;">🎁 3-Month Free Verified Pro Activated</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">As an early Port Harcourt provider, you enjoy 90 days with zero platform fees. Future renewal: ₦3,000/month.</div>
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

  const commissionAmount = Math.round(rawPrice * 0.10); // 10% Servhive platform cut
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
    commissionPct: 10,
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
    message: `Artisan (<strong>${newJob.proName}</strong>) has been scheduled to arrive at <strong>${address}</strong> on <strong>${dateTime}</strong>.\n\nYour funds will remain securely protected in Escrow until you inspect the work and click "Approve & Release".`,
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

  showAppNotice({
    icon: '🔒',
    eyebrow: 'PAYMENT DISBURSEMENT CONFIRMATION',
    title: `Release ${formatNaira(job.amount)} to Artisan?`,
    message: `Are you satisfied with the work done by <strong>${job.proName}</strong>?\n\nThis will instantly release <strong>${formatNaira(job.payoutAmount)}</strong> directly to the artisan's Nigerian bank account (Servhive platform commission: 10% / ${formatNaira(job.commissionAmount)}).`,
    confirmText: `Approve & Release ${formatNaira(job.payoutAmount)}`,
    cancelText: 'Cancel',
    onConfirm: () => {
      job.status = 'completed';
      persistState();
      updateEscrowBadge();
      renderEscrowJobs();

      showAppNotice({
        icon: '🎉',
        eyebrow: 'PAYMENT COMPLETED',
        title: 'Payment Disbursed Successfully!',
        message: `<strong>${formatNaira(job.payoutAmount)}</strong> has been credited to <strong>${job.proName}</strong>.\nServhive commission collected: ${formatNaira(job.commissionAmount)} (10%).\n\nThank you for choosing verified trades on Servhive!`,
        confirmText: 'Done'
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
  if (input.type === 'password') {
    input.type = 'text';
    if (btnEl) btnEl.textContent = '🙈';
  } else {
    input.type = 'password';
    if (btnEl) btnEl.textContent = '👁️';
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
        subtitleEl.textContent = 'Join Port Harcourt’s premier trades network. Enjoy 3 Months Free on Verified Pro (₦0 platform commission).';
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
          <button type="button" class="auth-password-toggle" onclick="togglePasswordVisibility('loginPassword', this)">👁️</button>
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
    // Hirer Sign Up Form
    const phAreas = AREAS.filter(a => a !== 'All Port Harcourt');
    container.innerHTML = `
      <form onsubmit="handleHirerSignupSubmit(event)">
        <div class="auth-input-group">
          <label class="auth-label">Full Name</label>
          <input type="text" id="hirerFullName" required class="auth-input" placeholder="e.g. Tonye Briggs" />
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Email Address</label>
            <input type="email" id="hirerEmail" required class="auth-input" placeholder="tonye@example.com" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Nigerian Phone (+234)</label>
            <input type="tel" id="hirerPhone" required class="auth-input" placeholder="0803 123 4567" />
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
            <button type="button" class="auth-password-toggle" onclick="togglePasswordVisibility('hirerPassword', this)">👁️</button>
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Confirm Password</label>
            <input type="password" id="hirerConfirmPassword" required minlength="6" class="auth-input" placeholder="Repeat password" />
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
    // Artisan / Pro Sign Up Form
    const phAreas = AREAS.filter(a => a !== 'All Port Harcourt');
    container.innerHTML = `
      <form onsubmit="handleArtisanSignupSubmit(event)">
        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Master Craftsman Name</label>
            <input type="text" id="artisanName" required class="auth-input" placeholder="e.g. Engr. Tari Davies" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Trade / Workshop Brand Name</label>
            <input type="text" id="artisanBizName" required class="auth-input" placeholder="e.g. Prime Ceilings & Tiling Works" />
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Primary Trade Category</label>
            <select id="artisanCategory" required class="auth-input ed-select-input" style="height: 46px;">
              <option value="home-repairs:Home Repairs">Home Repairs (Electrician, Generator, AC)</option>
              <option value="solar-tech:Tech & Solar">Tech & Solar (Solar Inverter, CCTV)</option>
              <option value="interior:Interior & Tiling">Interior & Tiling (POP, Tile Laying, Painting)</option>
              <option value="beauty:Beauty & Grooming">Beauty & Grooming (Luxury Braids, Hair Stylist)</option>
              <option value="auto:Vehicle Upkeep">Vehicle Upkeep (Mobile Mechanic, Auto Scan)</option>
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
            <label class="auth-label">Phone / WhatsApp Number (+234)</label>
            <input type="tel" id="artisanPhone" required class="auth-input" placeholder="0802 345 6789" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Years of Trade Experience</label>
            <select id="artisanExp" class="auth-input ed-select-input" style="height: 46px;">
              <option value="3+ years">3+ years in Port Harcourt</option>
              <option value="5+ years" selected>5+ years verified trade experience</option>
              <option value="8+ years">8+ years master craftsman</option>
              <option value="10+ years">10+ years industrial contractor</option>
            </select>
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Email Address (Optional)</label>
            <input type="email" id="artisanEmail" class="auth-input" placeholder="craftsman@workshop.ng" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Starting Service Rate (₦)</label>
            <input type="number" id="artisanStartingPrice" required min="3000" step="500" value="10000" class="auth-input" placeholder="10000" />
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Password</label>
            <input type="password" id="artisanPassword" required minlength="6" class="auth-input" placeholder="Min. 6 characters" />
            <button type="button" class="auth-password-toggle" onclick="togglePasswordVisibility('artisanPassword', this)">👁️</button>
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Confirm Password</label>
            <input type="password" id="artisanConfirmPassword" required minlength="6" class="auth-input" placeholder="Repeat password" />
          </div>
        </div>

        <!-- 3-Month Free Promo callout box -->
        <div style="background: var(--amber-light); border: 1px solid var(--hairline-amber); padding: 14px 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
          <div style="font-weight: 800; font-size: 0.88rem; color: var(--amber-dark); margin-bottom: 4px;">
            🎁 3-Month Free Verified Pro Trial Activated
          </div>
          <div style="font-size: 0.8rem; color: var(--canvas-muted); line-height: 1.45;">
            Zero platform fees for your first 90 days. Keep 100% of your earnings. Standard renewal at ₦3,000/mo after trial period.
          </div>
        </div>

        <label class="auth-checkbox-label">
          <input type="checkbox" id="artisanTerms" required checked />
          <span>I confirm our workshop adheres to Port Harcourt trade quality standards, fixed transparent rates, and safe Escrow delivery.</span>
        </label>

        <button type="submit" class="ed-button ed-button-amber" style="width: 100%; padding: 14px; font-size: 0.95rem;">
          <span>Register as Verified Artisan &rarr;</span>
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
            <div class="auth-feature-title">3-Month Free Trial (₦0 Platform Fees)</div>
            <div class="auth-feature-desc">Join early and enjoy 90 days of unlimited leads with zero subscription costs. Keep 100% of your earnings.</div>
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
      : `Logged in to <strong>Artisan Pro Portal</strong> for <strong>${matchedUser.businessName || matchedUser.name}</strong>. Your 3-Month Free Trial is active.`,
    confirmText: 'Continue to Marketplace'
  });

  switchToMarketplaceView();
};

window.handleHirerSignupSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('hirerFullName').value.trim();
  const email = document.getElementById('hirerEmail').value.trim();
  const phone = document.getElementById('hirerPhone').value.trim();
  const area = document.getElementById('hirerArea').value;
  const password = document.getElementById('hirerPassword').value;
  const confirmPassword = document.getElementById('hirerConfirmPassword').value;

  if (password !== confirmPassword) {
    showAppNotice({
      icon: '⚠️',
      eyebrow: 'PASSWORD MISMATCH',
      title: 'Passwords Do Not Match',
      message: 'Please ensure both password fields match exactly before submitting.',
      confirmText: 'Fix Password'
    });
    return;
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name: name,
    email: email,
    phone: phone,
    role: 'hirer',
    area: area,
    password: password,
    createdAt: new Date().toISOString()
  };

  state.users.push(newUser);
  state.currentUser = newUser;
  persistState();
  updateAuthUI();

  showAppNotice({
    icon: '🎉',
    eyebrow: 'ACCOUNT CREATED',
    title: `Welcome to Servhive, ${name}!`,
    message: `Your Hirer account is active. Preferred location set to <strong>${area}</strong>. All bookings are safeguarded with 100% Escrow protection.`,
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
  const exp = document.getElementById('artisanExp').value;
  const email = document.getElementById('artisanEmail').value.trim() || `${bizName.toLowerCase().replace(/[^a-z0-9]/g, '')}@workshop.ng`;
  const startingPrice = Number(document.getElementById('artisanStartingPrice').value) || 10000;
  const password = document.getElementById('artisanPassword').value;
  const confirmPassword = document.getElementById('artisanConfirmPassword').value;

  if (password !== confirmPassword) {
    showAppNotice({
      icon: '⚠️',
      eyebrow: 'PASSWORD MISMATCH',
      title: 'Passwords Do Not Match',
      message: 'Please ensure both password fields match exactly before submitting.',
      confirmText: 'Fix Password'
    });
    return;
  }

  const [catId, catName] = catVal.split(':');
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
    experience: exp,
    startingPrice: startingPrice,
    password: password,
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
    landmarks: [matchedLm.name],
    rating: 5.0,
    reviewCount: 1,
    verified: true,
    status: 'approved',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: startingPrice,
    responseTime: '~15 mins',
    bio: `${bizName} is a verified service enterprise based in ${area}, Port Harcourt with ${exp} experience. 3-Month Free Pro Member.`,
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
    message: `Your Artisan Pro profile is now live in the Port Harcourt directory with the <strong>Teal Verified Badge</strong>.<br><br>🎁 <strong>3-Month Free Trial</strong> active (₦0 platform commission for 90 days). Direct Escrow payouts configured for your bank account.`,
    confirmText: 'View My Live Listing'
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
      name: state.currentUser.name + ' (Pro)',
      businessName: `${state.currentUser.name.split(' ')[0]} Master Services`,
      email: state.currentUser.email,
      phone: state.currentUser.phone,
      role: 'artisan',
      area: state.currentUser.area || 'Peter Odili Road',
      trade: 'Home Repairs',
      verified: true
    };
  } else {
    state.currentUser = {
      id: 'usr-hirer-' + Date.now(),
      name: state.currentUser.name.replace(' (Pro)', ''),
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
              <button class="auth-dropdown-item" onclick="toggleUserMenu(); location.href='#directory';">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                <span>My Public Rate Card</span>
              </button>
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
          <span>Join as Pro Artisan (3 Mo Free)</span>
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
