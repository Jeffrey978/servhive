/* ===================================================================
   SERVHIVE APPLICATION ENGINE — ESCOLHA DIGITAL AESTHETICS
   Fonts: Montserrat • Brand Colors: Amber #F2A900, Teal #0F5C5C, Ink #1B1B1B
   =================================================================== */

import { gsap } from 'gsap';
window.gsap = gsap;

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Trades', icon: 'grid', proCount: '380+' },
  { id: 'cleaning-janitorial', name: 'Cleaning & Janitorial', icon: 'sparkles', proCount: '48+ Verified Pros', rateFrom: '₦8,000', desc: 'Deep home scrubbing, post-construction cleaning, office janitorial & upholstery stain wash.' },
  { id: 'laundry-dryclean', name: 'Laundry & Dry Cleaning', icon: 'wind', proCount: '36+ Verified Pros', rateFrom: '₦4,000', desc: 'Wash, dry & fold, corporate suit dry cleaning, curtain steaming & stain treatment.' },
  { id: 'fumigation-pest', name: 'Fumigation & Pest Control', icon: 'shield', proCount: '28+ Verified Pros', rateFrom: '₦15,000', desc: 'Pest extermination, rodent fumigation, anti-termite wood treatment & snake repellents.' },
  { id: 'tailors-fashion', name: 'Tailors & Fashion Design', icon: 'scissors', proCount: '54+ Verified Pros', rateFrom: '₦10,000', desc: 'Bespoke senator suits, native agbada, luxury dressmaking, alterations & zipper repairs.' },
  { id: 'events-catering', name: 'Events & Catering', icon: 'calendar', proCount: '32+ Verified Pros', rateFrom: '₦25,000', desc: 'Outdoor canopy & chair decor, party catering, event sound systems, lighting & small chops.' },
  { id: 'phone-gadgets', name: 'Phone & Gadget Repair', icon: 'cpu', proCount: '44+ Verified Pros', rateFrom: '₦5,000', desc: 'iPhone & Android screen replacement, charging port repair, micro-soldering & laptop fixes.' },
  { id: 'car-wash', name: 'Car Wash & Auto Detailing', icon: 'droplet', proCount: '30+ Verified Pros', rateFrom: '₦3,500', desc: 'Mobile doorstep car wash, engine bay steam detailing, ceramic polish & interior seat extraction.' },
  { id: 'pets-vet', name: 'Pets & Veterinary Care', icon: 'heart', proCount: '22+ Verified Pros', rateFrom: '₦7,000', desc: 'Dog grooming & tick dipping, routine vet vaccinations, deworming & professional dog training.' },
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

// Purge legacy mock dummy records from browser localStorage
(function purgeDummyArtisansFromStorage() {
  const dummyProIds = new Set(['pro-1', 'pro-2', 'pro-3', 'pro-4', 'pro-5', 'pro-6', 'pro-7', 'pro-8', 'pro-9', 'pro-10', 'pro-11']);
  const dummyUserIds = new Set(['usr-2']);
  const dummyReqIds = new Set(['req-201', 'req-202', 'req-203']);
  const dummyJobIds = new Set(['esc-101']);
  const dummyRepIds = new Set(['rep-1']);
  const dummyNames = new Set([
    'Engr. Emeka Obi', 'Blessing Amadi', 'Chidi Okonkwo',
    'Franklyn Eke', 'Tari Princewill', 'Victor Nnamdi', 'Idowu Alabi',
    'Samuel Dike', 'Kenneth Jumbo', 'Somto Okon', 'Tari Davies', 'Engr. Franklyn Nnamdi',
    'PowerVolt Generator & Electrical Works', 'Precision Mobile Auto Diagnostics'
  ]);

  try {
    const rawPros = localStorage.getItem('servhive_providers');
    if (rawPros) {
      const parsed = JSON.parse(rawPros);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(p => p && !dummyProIds.has(p.id) && !dummyNames.has(p.name) && !dummyNames.has(p.businessName));
        localStorage.setItem('servhive_providers', JSON.stringify(cleaned));
      }
    }
  } catch (e) {}

  try {
    const rawUsers = localStorage.getItem('servhive_users');
    if (rawUsers) {
      const parsed = JSON.parse(rawUsers);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(u => u && !dummyUserIds.has(u.id) && !dummyNames.has(u.name) && !dummyNames.has(u.businessName));
        localStorage.setItem('servhive_users', JSON.stringify(cleaned));
      }
    }
  } catch (e) {}

  try {
    const rawReqs = localStorage.getItem('servhive_quote_requests');
    if (rawReqs) {
      const parsed = JSON.parse(rawReqs);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(r => r && !dummyReqIds.has(r.id) && !dummyProIds.has(r.proId));
        localStorage.setItem('servhive_quote_requests', JSON.stringify(cleaned));
      }
    }
  } catch (e) {}

  try {
    const rawJobs = localStorage.getItem('servhive_escrow_jobs');
    if (rawJobs) {
      const parsed = JSON.parse(rawJobs);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(j => j && !dummyJobIds.has(j.id) && !dummyProIds.has(j.proId));
        localStorage.setItem('servhive_escrow_jobs', JSON.stringify(cleaned));
      }
    }
  } catch (e) {}

  try {
    const rawReps = localStorage.getItem('servhive_reports');
    if (rawReps) {
      const parsed = JSON.parse(rawReps);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(r => r && !dummyRepIds.has(r.id) && !dummyProIds.has(r.providerId));
        localStorage.setItem('servhive_reports', JSON.stringify(cleaned));
      }
    }
  } catch (e) {}

  try {
    const rawSaved = localStorage.getItem('servhive_saved_providers');
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(id => !dummyProIds.has(id));
        localStorage.setItem('servhive_saved_providers', JSON.stringify(cleaned));
      }
    }
  } catch (e) {}

  try {
    const cur = localStorage.getItem('servhive_current_user');
    if (cur) {
      const parsed = JSON.parse(cur);
      if (dummyUserIds.has(parsed.id) || dummyNames.has(parsed.name) || dummyNames.has(parsed.businessName)) {
        localStorage.removeItem('servhive_current_user');
      }
    }
  } catch (e) {}
})();

// Comprehensive Port Harcourt Initial Verified Providers with Proof of Work Completed Jobs
const INITIAL_PROVIDERS = [
  {
    id: 'pro-ph-clean-1',
    name: 'Godwin Jumbo',
    businessName: 'SparkleClean Facility & Deep Cleaning PH',
    category: 'cleaning-janitorial',
    categoryName: 'Cleaning & Janitorial',
    subSpecialty: 'Post-Construction & Residential Deep Scrub',
    area: 'Trans-Amadi',
    rating: 4.9,
    reviewCount: 38,
    verified: true,
    status: 'approved',
    boosted: true,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80',
    startingPrice: 8000,
    responseTime: '~15 mins',
    bio: 'Specialized deep industrial scrub, post-construction site cleanup, and residential sanitization across Trans-Amadi, Peter Odili, and Old GRA.',
    areasCovered: ['Trans-Amadi', 'Peter Odili Road', 'Old GRA', 'Woji', 'New GRA / Phase 2'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Post-construction deep scrub & tile polish at Peter Odili residential duplex',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Industrial carpet extraction & upholstery steam wash at Trans-Amadi office',
        area: 'Trans-Amadi',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Move-in sanitization and kitchen degreasing at Old GRA flat',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Standard 3-Bedroom Home Deep Scrub', price: 15000, type: 'Fixed Price' },
      { name: 'Post-Construction Site Cleanup', price: 25000, type: 'Milestone' },
      { name: 'Upholstery & Luxury Rug Steam Wash', price: 8000, type: 'Per Room' }
    ]
  },
  {
    id: 'pro-ph-laundry-1',
    name: 'Ibim West',
    businessName: 'CleanPress Executive Laundry & Dry Cleaners',
    category: 'laundry-dryclean',
    categoryName: 'Laundry & Dry Cleaning',
    subSpecialty: 'Corporate Suit Steaming & Express Wash',
    area: 'Old GRA',
    rating: 4.8,
    reviewCount: 29,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=500&q=80',
    startingPrice: 4000,
    responseTime: '~20 mins',
    bio: 'Professional garment care, delicate fabric dry cleaning, corporate senator suit pressing, and same-day express doorstep laundry in Port Harcourt.',
    areasCovered: ['Old GRA', 'New GRA / Phase 2', 'Peter Odili Road', 'Trans-Amadi'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Executive suit steaming, stain removal & crisp cuff starching',
        area: 'Old GRA',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Residential wash, tumble dry & organized fold delivery',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Heavy velvet curtain dry cleaning & restoration',
        area: 'New GRA / Phase 2',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Executive Suit & Agbada Dry Cleaning (2 Pieces)', price: 4000, type: 'Fixed Price' },
      { name: 'Bulk Weekly Laundry (Up to 15kg Wash & Fold)', price: 9500, type: 'Fixed Price' },
      { name: 'Curtains & Heavy Bedding Steaming', price: 6000, type: 'Per Set' }
    ]
  },
  {
    id: 'pro-ph-fumigate-1',
    name: 'Tamuno Pepple',
    businessName: 'Apex Shield Pest Control & Fumigation Services',
    category: 'fumigation-pest',
    categoryName: 'Fumigation & Pest Control',
    subSpecialty: 'Thermal Fogging & Anti-Termite Barriers',
    area: 'Woji',
    rating: 4.9,
    reviewCount: 31,
    verified: true,
    status: 'approved',
    boosted: true,
    image: 'https://images.unsplash.com/photo-1632733711679-529326f6db12?auto=format&fit=crop&w=500&q=80',
    startingPrice: 15000,
    responseTime: '~10 mins',
    bio: 'Government-compliant fumigation, odorless cockroach gel baits, rodent extermination, and wood-boring termite barriers with 6-month guarantees.',
    areasCovered: ['Woji', 'Peter Odili Road', 'Trans-Amadi', 'Ada George'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1632733711679-529326f6db12?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Thermal fogging for mosquito & pest eradication at Woji Estate',
        area: 'Woji',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Anti-termite foundation drill & chemical injection barrier',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Odorless perimeter rodent & crawling insect treatment',
        area: 'Trans-Amadi',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Full 3-Bedroom Flat Fumigation & Gel Baits', price: 15000, type: 'Fixed Price' },
      { name: 'Duplex & Compound Perimeter Fogging', price: 28000, type: 'Fixed Price' },
      { name: 'Anti-Termite Pre/Post-Construction Soil Barrier', price: 45000, type: 'Milestone' }
    ]
  },
  {
    id: 'pro-ph-tailor-1',
    name: 'Diepreye George',
    businessName: 'De-Regal Bespoke Clothiers & Native Tailors',
    category: 'tailors-fashion',
    categoryName: 'Tailors & Fashion Design',
    subSpecialty: 'Senator Native Attires & Bespoke Suits',
    area: 'D-Line',
    rating: 4.9,
    reviewCount: 44,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80',
    startingPrice: 10000,
    responseTime: '~15 mins',
    bio: 'Master tailor specializing in sharp, immaculate Senator suits, bespoke Agbada embroidery, wedding groom attires, and precision corporate alterations.',
    areasCovered: ['D-Line', 'Old GRA', 'New GRA / Phase 2', 'Peter Odili Road'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Bespoke cashmere Senator suit with custom pocket piping',
        area: 'D-Line',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Hand-embroidered 3-piece wedding Agbada completed for groom',
        area: 'Old GRA',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Tailored trousers slimming & waist tapering completed in 24 hrs',
        area: 'New GRA / Phase 2',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Custom Senator Native Attire (Top & Trousers)', price: 12000, type: 'Fixed Price' },
      { name: 'Luxury Agbada with Computer Embroidery', price: 25000, type: 'Fixed Price' },
      { name: 'Express Trousers & Shirt Alterations', price: 3500, type: 'Per Garment' }
    ]
  },
  {
    id: 'pro-ph-events-1',
    name: 'Precious Hart',
    businessName: 'GrandCelebrations Event Decor & Catering PH',
    category: 'events-catering',
    categoryName: 'Events & Catering',
    subSpecialty: 'Canopy Decor, Sound & Wedding Banquets',
    area: 'Peter Odili Road',
    rating: 4.9,
    reviewCount: 36,
    verified: true,
    status: 'approved',
    boosted: true,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80',
    startingPrice: 25000,
    responseTime: '~10 mins',
    bio: 'High-end event styling, banquet table centerpieces, fairy lighting, authentic Rivers Native soup catering, and sound engineering for outdoor celebrations.',
    areasCovered: ['Peter Odili Road', 'Old GRA', 'New GRA / Phase 2', 'Trans-Amadi'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Luxury indoor banquet hall lighting and floral backdrop setup',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Outdoor canopy wedding reception layout with Chiavari seating',
        area: 'Old GRA',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Sound engineering, acoustic balancing and wireless mic setup',
        area: 'Trans-Amadi',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Intimate Event Canopy & Table Styling (50 Guests)', price: 35000, type: 'Fixed Price' },
      { name: 'Cocktail & Small Chops Buffet (Per 50 Guests)', price: 25000, type: 'Fixed Price' },
      { name: 'Sound System + Generator & Operator (6 Hours)', price: 40000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-gadget-1',
    name: 'Kelvin Alabo',
    businessName: 'GadgetLab Precision Micro-Soldering & Phone Repair',
    category: 'phone-gadgets',
    categoryName: 'Phone & Gadget Repair',
    subSpecialty: 'iPhone/Android Screen Swaps & Motherboard Fixes',
    area: 'D-Line',
    rating: 4.8,
    reviewCount: 49,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80',
    startingPrice: 5000,
    responseTime: '~15 mins',
    bio: 'Computerized logic board diagnosis, original OLED screen replacements, water damage recovery, and charging IC micro-soldering with warranty.',
    areasCovered: ['D-Line', 'Old GRA', 'Woji', 'Ada George'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: iPhone motherboard micro-soldering & power IC bridge repair',
        area: 'D-Line',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Samsung Super AMOLED display replacement with true-tone calibration',
        area: 'Old GRA',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: MacBook battery swap & thermal paste cooling overhaul',
        area: 'Woji',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Original Screen Replacement (iPhone/Samsung)', price: 18000, type: 'Fixed Price' },
      { name: 'Charging Port & Speaker Flex Repair', price: 6500, type: 'Fixed Price' },
      { name: 'Motherboard IC Micro-Soldering & Dead Phone Revival', price: 15000, type: 'Milestone' }
    ]
  },
  {
    id: 'pro-ph-carwash-1',
    name: 'Tamunotonye Fubara',
    businessName: 'HydroShine Mobile Detailing & Doorstep Car Wash',
    category: 'car-wash',
    categoryName: 'Car Wash & Auto Detailing',
    subSpecialty: 'Mobile Steam Cleaning & Engine Bay Detailing',
    area: 'Peter Odili Road',
    rating: 4.8,
    reviewCount: 33,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=500&q=80',
    startingPrice: 3500,
    responseTime: '~20 mins',
    bio: 'Mobile doorstep vehicle spa. We bring high-pressure water, foam cannons, leather steam extractors, and ceramic wax directly to your home or office.',
    areasCovered: ['Peter Odili Road', 'Trans-Amadi', 'Old GRA', 'Woji'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Doorstep snow-foam wash & hydrophobic hand wax for SUV',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Steam degreasing and silicone protective coat on engine bay',
        area: 'Trans-Amadi',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Deep fabric seat extraction & leather interior conditioning',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Doorstep Exterior Snow Foam Wash & Tyre Shine', price: 3500, type: 'Fixed Price' },
      { name: 'Full Interior Deep Extraction + Steam Wash', price: 8000, type: 'Fixed Price' },
      { name: 'Engine Bay Steam Detailing + Wax Polish', price: 7500, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-pets-1',
    name: 'Dr. Ovie Dan-Jumbo',
    businessName: 'Port Harcourt K9 & Pet Care Specialists',
    category: 'pets-vet',
    categoryName: 'Pets & Veterinary Care',
    subSpecialty: 'Dog Grooming, Vet Checks & Vaccinations',
    area: 'Trans-Amadi',
    rating: 4.9,
    reviewCount: 24,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=500&q=80',
    startingPrice: 7000,
    responseTime: '~15 mins',
    bio: 'Doorstep mobile pet grooming, medicated tick dipping, routine canine vaccinations, deworming, and professional puppy socialization across Port Harcourt.',
    areasCovered: ['Trans-Amadi', 'Peter Odili Road', 'Old GRA', 'Woji'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Full coat de-matting, shampoo and nail trim for Caucasian dog',
        area: 'Trans-Amadi',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Mobile DHPPi & Anti-Rabies vaccination with official health book',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: On-leash behavioral correction & obedience training session',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Doorstep Full Dog Grooming & Medicated Bath', price: 9000, type: 'Fixed Price' },
      { name: 'Annual DHPPi + Anti-Rabies Vaccination Visit', price: 12000, type: 'Fixed Price' },
      { name: 'Tick & Flea Deep Medicated Immersion Dip', price: 7000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-solar-1',
    name: 'Sotonye Briggs',
    businessName: 'SunVolt Solar & Hybrid Energy Solutions',
    category: 'solar-tech',
    categoryName: 'Solar & Inverters',
    subSpecialty: 'Lithium Battery Banks & Rooftop Solar Arrays',
    area: 'New GRA / Phase 2',
    rating: 4.9,
    reviewCount: 42,
    verified: true,
    status: 'approved',
    boosted: true,
    image: '/assets/solar_tech.jpg',
    startingPrice: 12000,
    responseTime: '~10 mins',
    bio: 'Turnkey 24/7 solar installations. We calculate heavy residential power loads, design surge-protected lithium battery systems, and install CCTV monitoring.',
    areasCovered: ['New GRA / Phase 2', 'Old GRA', 'Peter Odili Road', 'Trans-Amadi'],
    workPhotos: [
      {
        url: '/assets/solar_tech.jpg',
        caption: '✔ Completed: 5kVA Felicity hybrid inverter with 10kWh lithium wall battery',
        area: 'New GRA / Phase 2',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: 16-panel tier-1 monocrystalline rooftop solar installation',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Commercial solar changeover and surge-arrestor panel wiring',
        area: 'Trans-Amadi',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: '5kVA Hybrid Solar Inverter Full Setup', price: 45000, type: 'Milestone' },
      { name: 'Solar Panel Array Maintenance & Cleaning', price: 12000, type: 'Fixed Price' },
      { name: 'Inverter Battery Health Audit & Load Balancing', price: 8000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-pop-1',
    name: 'Chukwuma Eze',
    businessName: 'RoyalFinish POP Ceilings & Italian Porcelain Tiling',
    category: 'interior-pop',
    categoryName: 'POP & Interior',
    subSpecialty: 'Suspended POP Ceilings & 60x120 Tiling',
    area: 'Peter Odili Road',
    rating: 4.9,
    reviewCount: 35,
    verified: true,
    status: 'approved',
    boosted: false,
    image: '/assets/interior_pop.jpg',
    startingPrice: 15000,
    responseTime: '~15 mins',
    bio: 'Luxury interior finishes. We engineer seamless suspended POP ceilings with recessed LED channels, precision Italian porcelain floor tiling, and wall screeding.',
    areasCovered: ['Peter Odili Road', 'Old GRA', 'Woji', 'Trans-Amadi'],
    workPhotos: [
      {
        url: '/assets/interior_pop.jpg',
        caption: '✔ Completed: Suspended recessed POP ceiling with warm hidden LED channels',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: 60x120 Italian porcelain mirror-finish floor tiling in living hall',
        area: 'Old GRA',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: 3-coat luxury wall screeding and Venetian marble plaster',
        area: 'Woji',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Suspended POP Ceiling Installation (Per Room)', price: 35000, type: 'Milestone' },
      { name: 'Italian Porcelain Tile Laying (Per Sq Metre)', price: 2500, type: 'Unit Rate' },
      { name: 'Luxury Wall Screeding & Satin Touch Prep', price: 15000, type: 'Per Room' }
    ]
  },
  {
    id: 'pro-ph-power-1',
    name: 'Tamuno Briggs',
    businessName: 'PowerVolt Generator Engineering & Electrical Works',
    category: 'power-gen',
    categoryName: 'Power & Generators',
    subSpecialty: 'Mikano, Perkins & Industrial ATS Panels',
    area: 'Trans-Amadi',
    rating: 4.9,
    reviewCount: 46,
    verified: true,
    status: 'approved',
    boosted: true,
    image: '/assets/hero_tradesman.jpg',
    startingPrice: 8000,
    responseTime: '~10 mins',
    bio: 'Heavy diesel generator repairs, Perkins injector overhaul, automatic ATS changeover switchboard fabrication, and zero-flicker commercial electrical wiring.',
    areasCovered: ['Trans-Amadi', 'Peter Odili Road', 'Old GRA', 'Woji'],
    workPhotos: [
      {
        url: '/assets/hero_tradesman.jpg',
        caption: '✔ Completed: 60kVA Mikano soundproof generator full top-end overhaul',
        area: 'Trans-Amadi',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Automatic Transfer Switch (ATS) installation with phase failure protection',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Heavy industrial load bank testing and governor calibration',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Diesel Generator Complete Routine Service', price: 18000, type: 'Fixed Price' },
      { name: 'ATS Automatic Changeover Switch Installation', price: 28000, type: 'Milestone' },
      { name: 'Emergency Generator Troubleshooting & Breakdown Repair', price: 8000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-beauty-1',
    name: 'Blessing Dike',
    businessName: 'GlamStudio Luxury Braids & Natural Hair Spa',
    category: 'beauty-hair',
    categoryName: 'Beauty & Grooming',
    subSpecialty: 'Knotless Box Braids & Lace Frontal Customization',
    area: 'Peter Odili Road',
    rating: 4.9,
    reviewCount: 52,
    verified: true,
    status: 'approved',
    boosted: false,
    image: '/assets/hairstylist.jpg',
    startingPrice: 7000,
    responseTime: '~15 mins',
    bio: 'Master braider with pain-free technique. Specializing in neat waist-length French curl braids, human hair wig revivals, and scalp steaming therapy.',
    areasCovered: ['Peter Odili Road', 'New GRA / Phase 2', 'Old GRA', 'Woji'],
    workPhotos: [
      {
        url: '/assets/hairstylist.jpg',
        caption: '✔ Completed: Waist-length butt-length knotless box braids with clean parts',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Human hair HD lace frontal customization, bleaching & styling',
        area: 'New GRA / Phase 2',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Natural hair deep moisture therapy, scalp detox & silk press',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Medium Knotless Braids (Back Length)', price: 12000, type: 'Fixed Price' },
      { name: 'HD Lace Frontal Install & Styling', price: 15000, type: 'Fixed Price' },
      { name: 'Scalp Detox & Deep Conditioning Spa', price: 7000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-plumbing-1',
    name: 'Engr. Nnamdi Amadi',
    businessName: 'Amadi Borehole & Industrial Plumbing Works',
    category: 'plumbing',
    categoryName: 'Plumbing & Pumps',
    subSpecialty: 'Submersible Borehole Pumps & PPR Piping Repairs',
    area: 'Trans-Amadi',
    rating: 4.9,
    reviewCount: 38,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80',
    startingPrice: 10000,
    responseTime: '~20 mins',
    bio: 'Registered commercial and residential plumber in Trans-Amadi. Specialized in submersible borehole pumps, automatic float switches, booster pumps, and leak-free PPR pipe installations.',
    areasCovered: ['Trans-Amadi', 'Peter Odili Road', 'Old GRA', 'Woji'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: 2HP Sumoto borehole pump replacement with control box in Trans-Amadi',
        area: 'Trans-Amadi',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Industrial PPR water distribution manifold for 6 flats in Peter Odili',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Overhead 2000L GeePee tank pipe rigging & booster pump installation in Old GRA',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Borehole Submersible Pump Servicing & Wiring', price: 15000, type: 'Fixed Price' },
      { name: 'PPR High-Pressure Pipe Leak Repair', price: 10000, type: 'Fixed Price' },
      { name: 'Automatic Water Float Switch Installation', price: 8000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-electrical-1',
    name: 'Emmanuel Dan-Jumbo',
    businessName: 'Apex Conduit Electrical & Fault Diagnostics PH',
    category: 'electrical',
    categoryName: 'Electrical & Wiring',
    subSpecialty: 'Conduit Piping, Distribution Boards & Fault Detection',
    area: 'Old GRA',
    rating: 4.9,
    reviewCount: 47,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80',
    startingPrice: 7000,
    responseTime: '~10 mins',
    bio: 'Licensed electrical engineer handling residential distribution boards (DB), conduit rewiring, surge protectors, earth pit grounding, and emergency short-circuit fault finding across Port Harcourt.',
    areasCovered: ['Old GRA', 'New GRA / Phase 2', 'D-Line', 'Rumuola'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: 3-Phase Schneider distribution board re-termination & labeling in Old GRA',
        area: 'Old GRA',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Concealed ceiling conduit LED track lighting in New GRA',
        area: 'New GRA / Phase 2',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Heavy copper earth rod grounding & surge arrester setup in D-Line',
        area: 'D-Line',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Single/3-Phase Distribution Board Wiring & Breakers', price: 18000, type: 'Fixed Price' },
      { name: 'Emergency Short-Circuit Fault Detection', price: 7000, type: 'Fixed Price' },
      { name: 'Whole-Home Copper Earth Rod Grounding', price: 22000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-ac-1',
    name: 'Chidi Ogar',
    businessName: 'ArcticCool HVAC & Industrial Refrigeration PH',
    category: 'ac-chillers',
    categoryName: 'AC & Refrigeration',
    subSpecialty: 'Inverter AC Chemical Servicing & Compressor Overhaul',
    area: 'D-Line',
    rating: 4.8,
    reviewCount: 39,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80',
    startingPrice: 8000,
    responseTime: '~15 mins',
    bio: 'Certified HVAC master technician specializing in R410a/R32 gas charging, chemical deep pressure washing of coils, compressor diagnostics, and inverter board micro-repairs in D-Line and surrounding estates.',
    areasCovered: ['D-Line', 'Old GRA', 'Trans-Amadi', 'Peter Odili Road'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Complete chemical dismantling & coil pressure wash on 2HP LG Inverter in D-Line',
        area: 'D-Line',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: R410a refrigerant leak vacuuming & recharge in Peter Odili Road',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Panasonic ceiling cassette AC repair & blower fan replacement in Old GRA',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Full Unit Chemical Pressure Servicing (Split AC)', price: 8000, type: 'Per Unit' },
      { name: 'R410a / R22 Pure Refrigerant Gas Top-Up', price: 12000, type: 'Fixed Price' },
      { name: 'Inverter AC Motherboard & Sensor Diagnostics', price: 10000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-mechanic-1',
    name: 'Engr. Kenneth Lawson',
    businessName: 'Precision Auto Diagnostics & Mobile Workshop',
    category: 'auto-mechanic',
    categoryName: 'Auto Diagnostics',
    subSpecialty: 'OBD-2 Scanning, Japanese/German Transmissions & Brakes',
    area: 'Ada George',
    rating: 4.9,
    reviewCount: 42,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=500&q=80',
    startingPrice: 6000,
    responseTime: '~20 mins',
    bio: 'Modern computerized automobile technician with mobile dispatch van. Specializing in Autel MaxiSys ECU scanning, transmission fluid flushing, brake caliper rebuilds, and electrical wiring troubleshooting across Port Harcourt.',
    areasCovered: ['Ada George', 'Rumuola', 'Old GRA', 'Trans-Amadi'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Toyota Camry check-engine light OBD-2 scan & O2 sensor replacement in Ada George',
        area: 'Ada George',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Mercedes C300 complete ceramic brake disc & pad replacement in Old GRA',
        area: 'Old GRA',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Lexus RX350 alternator overhaul & battery charging test in Rumuola',
        area: 'Rumuola',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Comprehensive OBD-2 Computer Diagnostic Scan & Report', price: 6000, type: 'Fixed Price' },
      { name: 'Front & Rear Brake Pads Installation & Fluid Bleed', price: 8000, type: 'Fixed Price' },
      { name: 'Mobile Roadside Breakdown Inspection & Battery Jump', price: 7000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-carpentry-1',
    name: 'Felix Ibiwari',
    businessName: 'Heritage Cabinetry & Custom Woodworks PH',
    category: 'carpentry',
    categoryName: 'Carpentry & Furniture',
    subSpecialty: 'Modern Kitchen Cabinets, Wardrobes & Wood Restoration',
    area: 'Woji',
    rating: 4.8,
    reviewCount: 31,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=500&q=80',
    startingPrice: 10000,
    responseTime: '~25 mins',
    bio: 'Master carpenter and joiner in Woji. Specialized in HDF and marine board kitchen cabinets, soft-close sliding wardrobes, wooden door hanging, and luxury furniture restoration with polyurethane finish.',
    areasCovered: ['Woji', 'Peter Odili Road', 'Trans-Amadi', 'Old GRA'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: High-gloss grey acrylic kitchen cabinet with hydraulic hinges in Woji',
        area: 'Woji',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: 4-Door floor-to-ceiling master bedroom wardrobe in Peter Odili',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Solid hardwood panel door trimming, lock installation & polish in Old GRA',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Custom Modular Kitchen Cabinet Design & Installation', price: 35000, type: 'Milestone' },
      { name: 'Internal Wooden Door Hanging & Lock Fitting', price: 10000, type: 'Per Door' },
      { name: 'Wardrobe Drawer Slide & Hinge Repair / Realignment', price: 7000, type: 'Fixed Price' }
    ]
  },
  {
    id: 'pro-ph-painting-1',
    name: 'Donald Briggs',
    businessName: 'PrimeShield Painting & Luxury Screeding PH',
    category: 'painting',
    categoryName: 'Painting & Screeding',
    subSpecialty: 'Weather-Shield Exterior Paint, Stucco & Smooth Screeding',
    area: 'Peter Odili Road',
    rating: 4.9,
    reviewCount: 36,
    verified: true,
    status: 'approved',
    boosted: false,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=500&q=80',
    startingPrice: 12000,
    responseTime: '~15 mins',
    bio: 'Professional painting contractor in Peter Odili Road. Expert in water-resistant exterior texture coatings, POP wall putty screeding, marble effect stucco, and Dulux/Berger premium interior painting.',
    areasCovered: ['Peter Odili Road', 'Old GRA', 'New GRA / Phase 2', 'Woji'],
    workPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: 2-Storey duplex exterior weather-shield silicone painting in Peter Odili',
        area: 'Peter Odili Road',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Silk emulsion interior screeding & geometric accent wall in New GRA',
        area: 'New GRA / Phase 2',
        date: 'Oct 2026'
      },
      {
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        caption: '✔ Completed: Italian stucco marble effect feature wall in living room in Old GRA',
        area: 'Old GRA',
        date: 'Sep 2026'
      }
    ],
    services: [
      { name: 'Interior Room Painting (Walls & Ceiling - 2 Coats)', price: 15000, type: 'Per Room' },
      { name: 'Full Wall Putty Screeding & Sanding (Mirror Finish)', price: 12000, type: 'Fixed Price' },
      { name: 'Exterior Weather-Proof Texture Coating', price: 25000, type: 'Milestone' }
    ]
  }
];

// Fallback & Hydration to ensure coordinates and landmarks exist even on previously cached local storage
function hydrateProvidersWithCoordinates(providers) {
  const dummyProIds = new Set(['pro-1', 'pro-2', 'pro-3', 'pro-4', 'pro-5', 'pro-6', 'pro-7', 'pro-8', 'pro-9', 'pro-10', 'pro-11']);
  const dummyNames = new Set([
    'Engr. Emeka Obi', 'Blessing Amadi', 'Chidi Okonkwo',
    'Franklyn Eke', 'Tari Princewill', 'Victor Nnamdi', 'Idowu Alabi',
    'Samuel Dike', 'Kenneth Jumbo', 'Somto Okon', 'Tari Davies', 'Engr. Franklyn Nnamdi',
    'Precision Mobile Auto Diagnostics'
  ]);

  const map = new Map();
  // Guarantee all 18 authentic verified providers are always present
  if (Array.isArray(INITIAL_PROVIDERS)) {
    INITIAL_PROVIDERS.forEach(p => {
      if (p && p.id) map.set(p.id, { ...p });
    });
  }

  // Merge any stored providers from localStorage (e.g. newly registered providers or status updates)
  if (Array.isArray(providers) && providers.length > 0) {
    providers.forEach(p => {
      if (p && p.id) {
        const existing = map.get(p.id) || {};
        map.set(p.id, { ...existing, ...p });
      }
    });
  }

  const realProviders = Array.from(map.values()).filter(p => {
    if (!p) return false;
    if (dummyProIds.has(p.id)) return false;
    if (dummyNames.has(p.name)) return false;
    return true;
  });

  return realProviders.map(p => {
    const landmarkMatch = PH_LANDMARKS.find(l => (l.zone || '').toLowerCase() === (p.area || '').toLowerCase()) || PH_LANDMARKS[0];
    return {
      ...p,
      category: p.category || 'cleaning-janitorial',
      categoryName: p.categoryName || 'Cleaning & Janitorial',
      workPhotos: (p.workPhotos && p.workPhotos.length) ? p.workPhotos : [],
      boosted: p.boosted || false,
      lat: p.lat || landmarkMatch.lat,
      lng: p.lng || landmarkMatch.lng,
      landmarks: (p.landmarks && p.landmarks.length) ? p.landmarks : [landmarkMatch.name]
    };
  });
}

const SHOWCASE_ITEMS = [];

// State
const state = {
  currentView: 'marketplace',
  providers: hydrateProvidersWithCoordinates(JSON.parse(localStorage.getItem('servhive_providers'))),
  reports: JSON.parse(localStorage.getItem('servhive_reports')) || [],
  escrowJobs: JSON.parse(localStorage.getItem('servhive_escrow_jobs')) || [],
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
  savedProviderIds: JSON.parse(localStorage.getItem('servhive_saved_providers')) || [],
  quoteRequests: JSON.parse(localStorage.getItem('servhive_quote_requests')) || [],
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

function formatReviewCount(count) {
  if (!count || count === 0) return 'No reviews yet';
  if (count === 1) return '1 review';
  return `${count} reviews`;
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
  if (!state.currentUser) {
    return window.handleFindArtisansClick();
  }
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
  if (!state.currentUser) {
    return window.handleFindArtisansClick();
  }
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

// Unified "Find Artisans" Gate Handler: Guests must create a client account before finding artisans
window.handleFindArtisansClick = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  
  if (!state.currentUser) {
    if (typeof showAppNotice === 'function') {
      showAppNotice({
        icon: '🔒',
        eyebrow: 'CLIENT ACCOUNT REQUIRED',
        title: 'Create an Account to Find Artisans',
        message: 'To protect vetted Port Harcourt technicians and guarantee 100% Escrow security, artisan directories, rate cards, and on-site proof of work are available exclusively to registered clients.\n\nCreate your free client account in 30 seconds or log in.',
        confirmText: 'Create Free Account',
        cancelText: 'Log In',
        onConfirm: () => {
          window.location.href = '/login.html#signup';
        },
        onCancel: () => {
          window.location.href = '/login.html';
        }
      });
    }
    const dirEl = document.getElementById('directory');
    if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });
    return false;
  }

  const dirEl = document.getElementById('directory');
  if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });
  return false;
};

// Quick Search from Hero Chips
window.quickSearch = function(query) {
  if (!state.currentUser) {
    return window.handleFindArtisansClick();
  }
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
  if (!state.currentUser) {
    return window.handleFindArtisansClick();
  }
  state.selectedCategory = catId || 'all';
  const select = document.getElementById('categoryFilterSelect');
  if (select && select.value !== state.selectedCategory) {
    select.value = state.selectedCategory;
  }
  renderProviders();
  const dirEl = document.getElementById('directory');
  if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });
};

// Dynamic Spotlight on Homepage
function renderSpotlight() {
  const container = document.getElementById('spotlightGridWrap');
  if (!container) return;

  const validPros = (state.providers || []).filter(p => p.status === 'approved');
  if (validPros.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background: var(--card); border: 1px dashed var(--border); border-radius: var(--radius-md); padding: 48px 24px; text-align: center;">
        <div style="font-size: 2.4rem; margin-bottom: 12px;">🏆</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--foreground); margin-bottom: 6px;">Spotlight Reserved for Verified Port Harcourt Artisans</h3>
        <p style="font-size: 0.9rem; color: var(--muted-foreground); max-width: 540px; margin: 0 auto 20px; line-height: 1.55;">
          Join Servhive as an approved master technician. Get <strong>1 Month Free</strong>, 100% Escrow payment security, and direct customer leads from Trans-Amadi, Old GRA, Woji, and Peter Odili.
        </p>
        <button class="ed-button ed-button-amber" onclick="openProviderRegisterModal()" style="padding: 12px 28px; font-weight: 800;">
          <span>Register as a Pro (1 Month Free) &rarr;</span>
        </button>
      </div>
    `;
    return;
  }

  const spotlightPros = [...validPros].sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0) || (b.rating * b.reviewCount) - (a.rating * a.reviewCount)).slice(0, 4);

  container.innerHTML = spotlightPros.map(pro => `
    <div class="spotlight-card">
      <div class="spotlight-img-wrap">
        <img src="${pro.image || '/assets/hero_tradesman.jpg'}" alt="${pro.name}" loading="lazy">
        <span class="ed-badge-verified" style="position: absolute; bottom: 10px; left: 10px;">✓ ${pro.verified ? 'Verified Pro' : 'Rivers Registered'}</span>
      </div>
      <div style="padding: 18px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 0.76rem; font-weight: 800; color: var(--teal); text-transform: uppercase;">${pro.categoryName}</div>
          <h4 style="font-size: 1.05rem; font-weight: 800; margin: 4px 0 2px;">${pro.businessName}</h4>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">${pro.name} · ${pro.area}</div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--amber-dark); margin-bottom: 14px;">${pro.reviewCount > 0 ? `★ ${(pro.rating || 5.0).toFixed(1)} (${formatReviewCount(pro.reviewCount)})` : '★ — (No reviews yet)'}</div>
        </div>
        <div style="border-top: 1px solid var(--hairline); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: 800;">From ${formatNaira(pro.startingPrice || 10000)}</span>
          <button class="ed-button ed-button-black ed-btn-compact" onclick="openProfileModal('${pro.id}')">View Rates</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Providers with Proximity Auto-Suggest, Boost Prioritization & Filters
function renderProviders() {
  const grid = document.getElementById('providersGrid');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  renderSpotlight();

  // AUTHENTICATION GATE: Clients must have created an account to search or browse artisans
  if (!state.currentUser) {
    const filterRow = document.querySelector('.ed-filter-row');
    if (filterRow) filterRow.style.display = 'none';

    const ribbonEl = document.getElementById('boostedTopRibbon');
    if (ribbonEl) ribbonEl.style.display = 'none';

    if (countEl) {
      countEl.innerHTML = '<span style="color: var(--teal); font-weight: 700;">🔒 Client Account Required</span> — Create a free client account to search, view rate cards & hire verified artisans across Port Harcourt.';
    }

    grid.innerHTML = `
      <div class="ed-client-gate-card" style="grid-column: 1 / -1; background: var(--card); border: 2px solid var(--hairline-amber); border-radius: var(--radius-lg); padding: 56px 28px; text-align: center; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(242, 169, 0, 0.12); color: var(--amber-dark); border: 1px solid var(--amber); border-radius: var(--radius-full); padding: 6px 16px; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;">
          <span>🔒 Exclusive Client Access</span>
        </div>
        <h3 style="font-size: 1.85rem; font-weight: 800; color: var(--foreground); margin-bottom: 12px; letter-spacing: -0.5px;">
          Create a Free Client Account to Find Artisans
        </h3>
        <p style="color: var(--muted-foreground); max-width: 620px; margin: 0 auto 28px; font-size: 0.98rem; line-height: 1.6;">
          Servhive PH connects verified Port Harcourt homeowners and businesses with vetted master craftsmen. Sign up or log in to view artisan profiles, real proof of work photos, transparent rate cards, and book with 100% Escrow payment protection.
        </p>

        <!-- Value Perks Strip -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; max-width: 820px; margin: 0 auto 36px; text-align: left;">
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px;">
            <div style="font-size: 1.05rem; margin-bottom: 6px; font-weight: 700; color: var(--foreground);">🛡️ 100% Escrow Safe Pay</div>
            <div style="font-size: 0.82rem; color: var(--muted-foreground); line-height: 1.45;">Funds held safely with Paystack until you inspect and approve the completed job.</div>
          </div>
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px;">
            <div style="font-size: 1.05rem; margin-bottom: 6px; font-weight: 700; color: var(--foreground);">🛠️ 18 Launch Sectors</div>
            <div style="font-size: 0.82rem; color: var(--muted-foreground); line-height: 1.45;">Mikano generators, solar inverters, plumbing, tiling, tailoring & more across Port Harcourt.</div>
          </div>
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px;">
            <div style="font-size: 1.05rem; margin-bottom: 6px; font-weight: 700; color: var(--foreground);">📸 Real Proof of Work</div>
            <div style="font-size: 0.82rem; color: var(--muted-foreground); line-height: 1.45;">Actual on-site project photos & standardized rates with zero roadside haggling.</div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px;">
          <a href="/login.html#signup" class="ed-button ed-button-amber" style="padding: 14px 32px; font-size: 0.95rem; font-weight: 800; text-decoration: none;">
            <span>Create Free Client Account &rarr;</span>
          </a>
          <a href="/login.html" class="ed-button ed-button-black" style="padding: 14px 28px; font-size: 0.95rem; font-weight: 700; text-decoration: none;">
            <span>Log In to Existing Account</span>
          </a>
        </div>
        <div style="font-size: 0.82rem; color: var(--muted-foreground);">
          ⚡ Takes 30 seconds · No credit card required · Free forever for clients
        </div>
      </div>
    `;
    return;
  }

  // Restore filter row when client is logged in
  const filterRow = document.querySelector('.ed-filter-row');
  if (filterRow) filterRow.style.display = 'flex';

  let filtered = state.providers.filter(p => p.status === 'approved');

  // 1. Category filter (18 launch sectors or 'all')
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

  if (state.providers.length === 0) {
    grid.innerHTML = bannerHtml + `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--card); border-radius: var(--radius-lg); border: 1px dashed var(--border);">
        <div style="margin-bottom: 16px; font-size: 2.6rem;">
          🛠️
        </div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--foreground); margin-bottom: 8px;">No Artisans Listed Yet</h3>
        <p style="color: var(--muted-foreground); max-width: 520px; margin: 0 auto 20px; font-size: 0.9375rem; line-height: 1.55;">
          Be among the first verified master craftsmen in Port Harcourt. Register your workshop today to enjoy <strong>1 Month Free</strong>, 100% Escrow deposit safety, and high-visibility local client leads.
        </p>
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button class="ed-button ed-button-amber" onclick="openProviderRegisterModal()" style="font-weight: 800; padding: 12px 24px;">
            <span>Register as a Pro (1 Mo Free) &rarr;</span>
          </button>
          <button class="ed-button ed-button-black" onclick="openProBenefitsModal()" style="padding: 12px 20px;">
            <span>Learn About Pro Benefits</span>
          </button>
        </div>
      </div>
    `;
    return;
  }

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
              ID checked by Servhive
            </span>
          ` : `
            <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.68rem; font-weight: 700;">
              ⏳ Under review
            </span>
          `}
          <div class="badge badge-outline" style="font-size: 0.75rem; gap: 4px;">
            ${pro.reviewCount > 0 ? `<span style="color: var(--primary);">★</span> ${pro.rating.toFixed(1)} <span style="color: var(--muted-foreground); font-weight: 500;">(${formatReviewCount(pro.reviewCount)})</span>` : `<span style="color: var(--muted-foreground); font-weight: 500;">No reviews yet</span>`}
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

        ${(pro.workPhotos && pro.workPhotos.length > 0) ? `
          <div class="ed-proof-work-strip">
            <div class="ed-proof-work-header">
              <span class="ed-proof-work-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Proof of Work · Completed Jobs (${pro.workPhotos.length})
              </span>
              <span class="ed-proof-work-tag">Escrow Verified</span>
            </div>
            <div class="ed-proof-thumbs-row">
              ${pro.workPhotos.slice(0, 3).map(wp => `
                <div class="ed-proof-thumb" onclick="event.stopPropagation(); openPhotoZoom('${wp.url}', '${wp.caption.replace(/'/g, "\\'")}')" title="${wp.caption}">
                  <img src="${wp.url}" alt="${wp.caption}" loading="lazy">
                  <span class="ed-proof-thumb-area">${wp.area || 'Port Harcourt'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

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

  if (window.gsap) {
    try {
      gsap.from('.ed-pro-card', {
        opacity: 0,
        y: 25,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all'
      });
    } catch (e) {}
  }
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
  if (!state.currentUser) {
    if (typeof showAppNotice === 'function') {
      showAppNotice({
        icon: '🔒',
        eyebrow: 'CLIENT ACCOUNT REQUIRED',
        title: 'Sign In to Save Providers',
        message: 'Create a free client account to bookmark your preferred Port Harcourt technicians and view them in your account anytime.',
        confirmText: 'Create Client Account',
        cancelText: 'Log In',
        onConfirm: () => { window.location.href = '/login.html#signup'; },
        onCancel: () => { window.location.href = '/login.html'; }
      });
    }
    return;
  }
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
  if (!state.currentUser) {
    if (typeof showAppNotice === 'function') {
      showAppNotice({
        icon: '🔒',
        eyebrow: 'CLIENT ACCOUNT REQUIRED',
        title: 'Create an Account to View Profiles & Rates',
        message: 'To view artisan rate cards, proof of past work photos, and direct quotes, please create a free client account or log in.',
        confirmText: 'Create Client Account',
        cancelText: 'Log In',
        onConfirm: () => { window.location.href = '/login.html#signup'; },
        onCancel: () => { window.location.href = '/login.html'; }
      });
    }
    return;
  }
  const pro = state.providers.find(p => p.id === proId);
  if (!pro) return;

  state.activeProfileModalProvider = pro;
  const modal = document.getElementById('profileModal');
  const modalBody = document.getElementById('profileModalBody');
  const isSaved = state.savedProviderIds && state.savedProviderIds.includes(pro.id);
  const primaryService = pro.services && pro.services[0] ? pro.services[0] : { name: 'Standard Service', price: pro.startingPrice };

  modalBody.innerHTML = `
    <div class="profile-modal-cover">
      <img src="${pro.image}" alt="${pro.name}" />
      <div class="profile-modal-cover-overlay"></div>
      <div class="profile-modal-badges">
        ${pro.boosted ? `<span class="badge ed-badge-boosted">⚡ Boosted Pro</span>` : ''}
        <span class="ed-badge-verified" style="background: var(--teal); color: #FFFFFF;">✓ Rivers Verified Pro</span>
        <span style="background: rgba(0,0,0,0.65); color: #FFFFFF; padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.76rem; font-weight: 700;">📍 ${pro.area}, Port Harcourt</span>
      </div>
    </div>

    <div class="profile-modal-body">
      <!-- Title & Rating -->
      <div class="profile-modal-header-row">
        <div>
          <h2 style="font-size: 1.55rem; font-weight: 800; margin-bottom: 4px; color: var(--foreground); line-height: 1.25;">${pro.businessName}</h2>
          <div style="font-size: 0.88rem; color: var(--muted-foreground); font-weight: 600;">Lead Pro: ${pro.name} • ${pro.subSpecialty}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button id="profileSaveBtn" class="ed-button ed-button-black ed-btn-compact" onclick="toggleSaveProvider('${pro.id}')">
            <span>${isSaved ? '♥ Saved Provider' : '♡ Save Provider'}</span>
          </button>
          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--amber-dark); line-height: 1.2;">
              ${pro.reviewCount > 0 ? `★ ${pro.rating.toFixed(1)}` : '—'}
            </div>
            <div style="font-size: 0.74rem; color: var(--muted-foreground);">${formatReviewCount(pro.reviewCount)}</div>
          </div>
        </div>
      </div>

      <!-- About the Service -->
      <div style="margin-bottom: 22px;">
        <h4 style="font-size: 0.82rem; font-weight: 800; margin-bottom: 6px; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">About the Service</h4>
        <p style="color: var(--muted-foreground); font-size: 0.9rem; line-height: 1.55;">${pro.bio}</p>
      </div>

      <!-- Photos of Past Work (Specification Requirement) -->
      <div style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
          <h4 style="font-size: 0.82rem; font-weight: 800; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">
            Photos of Past Work (${(pro.workPhotos || []).length})
          </h4>
          <span style="font-size: 0.74rem; color: var(--muted-foreground);">Verified Port Harcourt Projects</span>
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
      <div style="margin-bottom: 26px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
          <h4 style="font-size: 0.82rem; font-weight: 800; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">Services and Transparent Prices</h4>
          <span style="font-size: 0.74rem; color: var(--teal); font-weight: 700;">100% Escrow Protected</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${pro.services.map(s => `
            <div class="profile-service-card">
              <div>
                <div style="font-weight: 800; font-size: 0.92rem; color: var(--foreground);">${s.name}</div>
                <div style="font-size: 0.74rem; color: var(--muted-foreground);">${s.type}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-weight: 800; color: var(--amber-dark); font-size: 1.05rem; font-variant-numeric: tabular-nums;">
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

      <!-- Action Buttons: Chat or Request / Book (Mobile Stacked, Desktop Side-by-side) -->
      <div class="profile-modal-actions">
        <button class="ed-button ed-button-black" onclick="openChatDrawer('${pro.id}', true); closeModal('profileModal');">
          <span>💬 Chat &amp; Describe Job</span>
        </button>
        <button class="ed-button ed-button-amber" onclick="openEscrowBookingModal('${pro.id}', '${primaryService.name.replace(/'/g, "\\'")}', ${primaryService.price}); closeModal('profileModal');">
          <span>🛡️ Request / Book with Escrow</span>
        </button>
      </div>

      <!-- Reviews -->
      <div style="border-top: 1px solid var(--border); padding-top: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--foreground);">Client Reviews (${formatReviewCount(pro.reviews ? pro.reviews.length : 0)})</h4>
          <button class="ed-button ed-button-black ed-btn-compact" onclick="showAddReviewPrompt('${pro.id}')">
            <span>+ Add Review</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${(!pro.reviews || pro.reviews.length === 0) ? `
            <div style="text-align: center; padding: 22px 14px; background: var(--bg-surface-subtle); border: 1px dashed var(--border); border-radius: var(--radius-sm); color: var(--muted-foreground); font-size: 0.86rem;">
              No reviews yet. Reviews come only from completed jobs.
            </div>
          ` : pro.reviews.map(r => `
            <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; align-items: center;">
                <span style="font-weight: 800; font-size: 0.88rem; color: var(--foreground);">${r.author} <small style="color: var(--muted-foreground); font-weight: 500;">(${r.area})</small></span>
                <span style="color: var(--amber-dark); font-size: 0.82rem; font-weight: 800;">★ ${r.rating}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--muted-foreground); line-height: 1.45; margin: 0;">${r.text}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Report problem link -->
      <div style="margin-top: 22px; text-align: center;">
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

  // 1. A provider cannot review themselves
  if (state.currentUser && (
    state.currentUser.id === proId ||
    state.currentUser.id === pro.id ||
    state.currentUser.name === pro.name ||
    (state.currentUser.businessName && state.currentUser.businessName === pro.businessName)
  )) {
    showAppNotice({
      icon: '⚠️',
      eyebrow: 'RESTRICTED ACTION',
      title: 'Self-Reviews Not Permitted',
      message: 'Providers cannot write reviews for their own business. Reviews must come directly from real completed client jobs.',
      confirmText: 'Understood'
    });
    return;
  }

  // 2. Reviews come only from completed jobs
  const userCompletedJob = state.escrowJobs.some(j =>
    (j.proId === proId || j.proId === pro.id || j.proName === pro.businessName) &&
    j.status === 'completed' &&
    state.currentUser &&
    (j.customerName === state.currentUser.name || j.customerPhone === state.currentUser.phone)
  );

  if (!userCompletedJob && state.escrowJobs.length > 0) {
    showAppNotice({
      icon: '🛡️',
      eyebrow: 'VERIFIED REVIEW POLICY',
      title: 'Completed Job Required',
      message: `Reviews come only from completed jobs. You must have a confirmed completed job with <strong>${pro.businessName}</strong> to leave a review.`,
      confirmText: 'Understood'
    });
    return;
  }

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
  if (!state.currentUser) {
    if (typeof showAppNotice === 'function') {
      showAppNotice({
        icon: '🔒',
        eyebrow: 'CLIENT ACCOUNT REQUIRED',
        title: 'Sign In to Chat with Artisans',
        message: 'To request quotes and communicate directly with vetted Port Harcourt artisans, please create a free client account or log in.',
        confirmText: 'Create Client Account',
        cancelText: 'Log In',
        onConfirm: () => { window.location.href = '/login.html#signup'; },
        onCancel: () => { window.location.href = '/login.html'; }
      });
    }
    return;
  }
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
          Your profile has been routed to the Servhive verification team.
        </p>

        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--hairline-amber); padding: 18px; border-radius: 12px; margin-bottom: 24px; text-align: left;">
          <div style="font-weight: 800; color: var(--amber-dark); font-size: 0.95rem; margin-bottom: 4px;">🎁 1 Month Free Trial for New Providers</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">1 month free trial for every new provider. After that, ₦2,000 per month for ALL providers, paid before the month ends. If unpaid, the profile is hidden until payment is made. 5% commission applies to jobs paid through the app.</div>
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
        <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 4px;">⚠️ Professional Licence Required</div>
        <div style="font-size: 0.82rem; line-height: 1.5;">${item ? item.reason : ''} In the next step, upload your professional registration licence. Profile requires Admin sign-off before going live.</div>
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
  if (!state.currentUser) {
    if (typeof showAppNotice === 'function') {
      showAppNotice({
        icon: '🔒',
        eyebrow: 'CLIENT ACCOUNT REQUIRED',
        title: 'Sign In to Book an Artisan',
        message: 'To book a verified artisan and fund an Escrow milestone, please create a free client account or log in.',
        confirmText: 'Create Client Account',
        cancelText: 'Log In',
        onConfirm: () => { window.location.href = '/login.html#signup'; },
        onCancel: () => { window.location.href = '/login.html'; }
      });
    }
    return;
  }
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
  const activeCount = state.escrowJobs.filter(j => j.status !== 'completed').length;
  const badge = document.getElementById('navEscrowBadge');
  if (badge) {
    badge.textContent = activeCount;
    badge.style.display = activeCount > 0 ? 'inline-block' : 'none';
  }
  const mobileBadge = document.getElementById('mobileEscrowVaultBadge');
  if (mobileBadge) {
    mobileBadge.textContent = activeCount;
    mobileBadge.style.display = activeCount > 0 ? 'inline-block' : 'none';
  }
};

window.checkAutoReleaseEscrowJobs = function() {
  const now = Date.now();
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
  let changed = false;

  state.escrowJobs.forEach(job => {
    if (job.status === 'awaiting_release' && job.markedCompletedAt) {
      const completedTime = new Date(job.markedCompletedAt).getTime();
      if (now - completedTime >= FORTY_EIGHT_HOURS_MS) {
        job.status = 'completed';
        job.autoReleased = true;
        job.autoReleasedAt = new Date().toISOString();
        changed = true;
      }
    }
  });

  if (changed) {
    persistState();
    updateEscrowBadge();
  }
};

window.renderEscrowJobs = function() {
  checkAutoReleaseEscrowJobs();
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
        <h4 style="font-size: 1.2rem; font-weight: 800;">No active payment protected bookings</h4>
        <p style="color: var(--text-muted); font-size: 0.88rem; margin: 6px 0 16px;">Browse verified artisans in Port Harcourt and book with payment protection held safely by Paystack.</p>
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
              ${isDone ? (job.autoReleased ? '✓ Auto-Released (48h)' : '✓ Paid to Provider') : isAwaiting ? '⏳ Awaiting Client Approval' : '🔒 Held by Paystack'}
            </div>
          </div>
        </div>

        ${isAwaiting ? `
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 12px; font-size: 0.82rem; color: var(--amber-dark); line-height: 1.45;">
            ⏱️ <strong>48-Hour Auto-Release Active:</strong> Work has been marked complete. If you do not approve or report a problem within 48 hours, payment is automatically released to the provider.
          </div>
        ` : ''}

        <!-- 4 Step Escrow Tracker (Monochrome Vector Logos) -->
        <div class="ed-escrow-steps">
          <div class="ed-escrow-step done">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span>1. Funded via Paystack</span>
          </div>
          <div class="ed-escrow-step ${isInProgress ? 'active' : 'done'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>2. Provider Active</span>
          </div>
          <div class="ed-escrow-step ${isAwaiting ? 'active' : isDone ? 'done' : ''}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>3. Client Inspection</span>
          </div>
          <div class="ed-escrow-step ${isDone ? 'done' : ''}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>4. Disbursed</span>
          </div>
        </div>

        <!-- Escrow Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--hairline); flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            No extra fee for you. Payment protection is included. (Provider fee: 5%)
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            ${isInProgress ? `
              <button class="ed-button ed-button-black" style="padding: 6px 14px; font-size: 0.78rem;" onclick="simulateArtisanDone('${job.id}')">
                <span>Simulate: Provider Finished Work &rarr;</span>
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
                <span>Report a Problem / Hold Funds</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.gsap) {
    try {
      gsap.from('.ed-pro-card', {
        opacity: 0,
        y: 25,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all'
      });
    } catch (e) {}
  }
};

window.simulateArtisanDone = function(jobId) {
  const job = state.escrowJobs.find(j => j.id === jobId);
  if (job) {
    job.status = 'awaiting_release';
    job.markedCompletedAt = new Date().toISOString();
    persistState();
    renderEscrowJobs();
    showAppNotice({
      icon: '🔨',
      eyebrow: 'PROVIDER JOB UPDATE',
      title: 'Work Marked as Completed',
      message: `<strong>${job.proName}</strong> has indicated that the job at <strong>${job.address}</strong> is finished.\n\nPlease inspect the quality of work. If satisfied, click "Approve & Release ${formatNaira(job.amount)}" in the Payment Protection Hub.\n\n<strong>Note:</strong> If no problem is reported within 48 hours, the funds will be automatically released to the provider.`,
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
    title: `Release ${formatNaira(job.amount)} to Provider?`,
    message: `Are you satisfied with the work done by <strong>${job.proName}</strong>?\n\nThis will disburse <strong>${formatNaira(payout)}</strong> directly to the provider's verified Nigerian bank account via Paystack (Servhive fee: 5% / ${formatNaira(commission)}).`,
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
        message: `<strong>${formatNaira(payout)}</strong> has been disbursed to <strong>${job.proName}</strong>.\n\nPlease leave a quick review to help fellow Port Harcourt clients!`,
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
  window.location.href = '/admin.html';
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
    const hirer = state.users.find(u => u.role === 'hirer');
    if (contactInput) contactInput.value = hirer ? hirer.email : 'tonye@example.com';
    if (passwordInput) passwordInput.value = hirer ? hirer.password : 'password123';
  } else {
    const artisan = state.users.find(u => u.role === 'artisan');
    if (artisan) {
      if (contactInput) contactInput.value = artisan.email || artisan.phone;
      if (passwordInput) passwordInput.value = artisan.password || 'password123';
    } else {
      switchAuthTab('signup', 'artisan');
      showAppNotice({
        icon: '🛠️',
        eyebrow: 'REGISTER AS ARTISAN',
        title: 'No Dummy Artisans Exist',
        message: 'Register your real workshop on Servhive to access the Artisan Pro Portal with 1 month free!',
        confirmText: 'Register Now'
      });
      return;
    }
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
          <input type="text" id="loginContact" required class="auth-input" placeholder="${isHirer ? 'e.g. tonye@example.com or 0803 123 4567' : 'e.g. workshop@servhive.ng or 0802 345 6789'}" />
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
            🎁 1 Month Free Trial for New Providers
          </div>
          <div style="font-size: 0.8rem; color: var(--canvas-muted); line-height: 1.45;">
            1 month free trial for every new provider. After that, ₦2,000 per month for ALL providers, paid before the month ends. If unpaid, the profile is hidden until payment is made. 5% commission applies to jobs paid through the app.
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Your Name</label>
            <input type="text" id="artisanName" required class="auth-input" placeholder="e.g. Master Craftsman Full Name" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Business Name</label>
            <input type="text" id="artisanBizName" required class="auth-input" placeholder="e.g. Precision Engineering & Repair" />
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
            <label class="auth-label">Primary Trade Category</label>
            <select id="artisanCategory" required class="auth-input ed-select-input" style="height: 46px;">
              <optgroup label="Standard Trade Categories">
                <option value="power-gen">Power &amp; Generators</option>
                <option value="solar-tech">Solar, Inverters &amp; CCTV</option>
                <option value="interior-pop">Interior POP Ceilings &amp; Tiling</option>
                <option value="plumbing">Plumbing &amp; Water Pumps</option>
                <option value="electrical">Electrical Wiring &amp; Conduit</option>
                <option value="ac-chillers">AC &amp; Refrigeration</option>
                <option value="auto-mechanic">Auto Mechanics &amp; Diagnostics</option>
                <option value="beauty-hair">Beauty, Hair &amp; Luxury Braids</option>
                <option value="carpentry">Carpentry &amp; Cabinetry</option>
                <option value="painting">Painting &amp; Wall Screeding</option>
              </optgroup>
              <optgroup label="Regulated Trades (Licence Required Before Approval)">
                <option value="home-health">Home Health Aide (Licence Required)</option>
                <option value="laser-tech">Laser Tech &amp; Electrologist (Licence Required)</option>
                <option value="tattoo-piercing">Tattoo &amp; Body Piercer (Licence Required)</option>
                <option value="funeral-director">Funeral Director (Licence Required)</option>
              </optgroup>
              <optgroup label="Unavailable Categories (Not Permitted)">
                <option value="nanny" disabled>Nanny / Babysitter (Not selectable)</option>
                <option value="childcare" disabled>Childcare / Daycare (Not selectable)</option>
                <option value="tutor" disabled>Private Tutor (Not selectable)</option>
              </optgroup>
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
          <span>I confirm our workshop adheres to Port Harcourt trade quality standards and 5% commission on jobs paid through the app.</span>
        </label>

        <button type="submit" class="ed-button ed-button-amber" style="width: 100%; padding: 14px; font-size: 0.95rem;">
          <span>Register as Provider &rarr;</span>
        </button>

        <div style="text-align: center; margin-top: 20px; font-size: 0.86rem; color: var(--text-muted);">
          Already registered as a Provider? 
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
          "I needed an emergency generator technician in Peter Odili Rd. The verified artisan arrived promptly and my money was totally protected in Escrow until the test run passed."
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
            <div class="auth-feature-title">Servhive Support Team</div>
            <div class="auth-feature-desc">Dedicated Port Harcourt administrative support to mediate disputes fairly and protect artisans.</div>
          </div>
        </div>
      </div>

      <!-- Artisan Testimonial Card -->
      <div class="auth-trust-card" style="background: var(--bg-surface-subtle); border-left: 4px solid var(--teal);">
        <div style="font-size: 0.95rem; line-height: 1.55; color: var(--canvas); font-style: italic; margin-bottom: 14px;">
          "Before Servhive, customers in PH would delay payments for weeks after jobs. Now the money is locked in Escrow before I buy spare parts. Guaranteed peace of mind."
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-weight: 800; font-size: 0.88rem; color: var(--canvas);">Verified Craftsman</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">Master Technical Guild · Port Harcourt</div>
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
  const targetRole = state.authRole || 'hirer';

  const cleanContact = contact.replace(/\s+/g, '').toLowerCase();

  // Find in state.users
  let matchedUser = state.users.find(u => {
    const uEmail = (u.email || '').toLowerCase();
    const uPhone = (u.phone || '').replace(/\s+/g, '');
    return uEmail === cleanContact || (uPhone && (uPhone.includes(cleanContact) || cleanContact.includes(uPhone)));
  });

  // Find in state.providers
  let matchedProvider = state.providers.find(p => {
    const pEmail = (p.email || '').toLowerCase();
    const pPhone = (p.phone || '').replace(/\s+/g, '');
    const pName = (p.name || '').toLowerCase();
    return (pEmail && pEmail === cleanContact) ||
           (pPhone && (pPhone.includes(cleanContact) || cleanContact.includes(pPhone))) ||
           (cleanContact.length > 3 && pName.includes(cleanContact));
  });

  let isArtisan = false;

  if (targetRole === 'artisan') {
    // Explicit artisan login
    isArtisan = true;

    if (matchedUser && matchedUser.role === 'artisan') {
      if (matchedUser.password && password && matchedUser.password !== password) {
        showAppNotice({ icon: '⚠️', eyebrow: 'AUTH ERROR', title: 'Incorrect Password', message: 'The password entered does not match this artisan account.' });
        return;
      }
    } else if (matchedUser && matchedUser.role !== 'artisan') {
      if (matchedUser.password && password && matchedUser.password !== password) {
        showAppNotice({ icon: '⚠️', eyebrow: 'AUTH ERROR', title: 'Incorrect Password', message: 'The password entered does not match this account.' });
        return;
      }
      matchedUser.role = 'artisan';
      if (!matchedUser.businessName) {
        matchedUser.businessName = matchedProvider ? matchedProvider.businessName : `${matchedUser.name.replace(/\s*\(Pro\)/gi, '').split(' ')[0]} Master Services`;
      }
      if (!matchedUser.trade) {
        matchedUser.trade = matchedProvider ? matchedProvider.categoryName : 'Power & Generators';
        matchedUser.category = matchedProvider ? matchedProvider.category : 'power-gen';
      }
      if (!matchedUser.area) {
        matchedUser.area = matchedProvider ? matchedProvider.area : 'Trans-Amadi';
      }
    } else if (!matchedUser && matchedProvider) {
      matchedUser = {
        id: 'usr-' + String(matchedProvider.id).replace('pro-', ''),
        name: matchedProvider.name,
        businessName: matchedProvider.businessName,
        email: matchedProvider.email || (cleanContact.includes('@') ? cleanContact : 'artisan@servhive.ng'),
        phone: matchedProvider.phone || cleanContact,
        role: 'artisan',
        trade: matchedProvider.categoryName || 'Power & Generators',
        category: matchedProvider.category || 'power-gen',
        area: matchedProvider.area || 'Trans-Amadi',
        verified: matchedProvider.verified || false,
        password: password || 'password123'
      };
      state.users.push(matchedUser);
    } else {
      const defaultName = cleanContact.includes('@') ? cleanContact.split('@')[0] : 'Artisan ' + cleanContact.slice(-4);
      matchedUser = {
        id: 'usr-' + Date.now(),
        name: defaultName,
        businessName: `${defaultName} Workshop`,
        email: cleanContact.includes('@') ? cleanContact : 'artisan@servhive.ng',
        phone: cleanContact.includes('@') ? '08023456789' : cleanContact,
        role: 'artisan',
        trade: 'Power & Generators',
        category: 'power-gen',
        area: 'Trans-Amadi',
        verified: false,
        password: password || 'password123'
      };
      state.users.push(matchedUser);
    }

    // Ensure provider entry exists
    const provExists = state.providers.some(p => 
      p.id === matchedUser.id || 
      p.id === 'pro-' + String(matchedUser.id).replace('usr-', '') ||
      (p.businessName && p.businessName === matchedUser.businessName) ||
      p.name === matchedUser.name
    );
    if (!provExists) {
      state.providers.unshift({
        id: 'pro-' + String(matchedUser.id).replace('usr-', ''),
        name: matchedUser.name,
        businessName: matchedUser.businessName || `${matchedUser.name} Workshop`,
        category: matchedUser.category || 'power-gen',
        categoryName: matchedUser.trade || 'Power & Generators',
        subSpecialty: `${matchedUser.trade || 'Power & Generators'} Specialist`,
        area: matchedUser.area || 'Trans-Amadi',
        rating: 0,
        reviewCount: 0,
        reviews: [],
        verified: false,
        status: 'under_review',
        image: '/assets/hero_tradesman.jpg',
        startingPrice: 10000,
        responseTime: '~15 mins',
        bio: `${matchedUser.businessName || matchedUser.name} provides verified artisan services across Port Harcourt.`,
        workPhotos: [],
        services: [],
        areasCovered: [matchedUser.area || 'Trans-Amadi', 'Peter Odili Road', 'Woji', 'Old GRA']
      });
    }

  } else {
    // Hirer login
    if (matchedUser && matchedUser.role === 'artisan') {
      if (matchedUser.password && password && matchedUser.password !== password) {
        showAppNotice({ icon: '⚠️', eyebrow: 'AUTH ERROR', title: 'Incorrect Password', message: 'The password entered does not match this account.' });
        return;
      }
      isArtisan = true;
    } else if (!matchedUser && matchedProvider) {
      isArtisan = true;
      matchedUser = {
        id: 'usr-' + String(matchedProvider.id).replace('pro-', ''),
        name: matchedProvider.name,
        businessName: matchedProvider.businessName,
        email: matchedProvider.email || (cleanContact.includes('@') ? cleanContact : 'artisan@servhive.ng'),
        phone: matchedProvider.phone || cleanContact,
        role: 'artisan',
        trade: matchedProvider.categoryName || 'Power & Generators',
        category: matchedProvider.category || 'power-gen',
        area: matchedProvider.area || 'Trans-Amadi',
        verified: matchedProvider.verified || false,
        password: password || 'password123'
      };
      state.users.push(matchedUser);
    } else {
      isArtisan = false;
      if (matchedUser) {
        if (matchedUser.password && password && matchedUser.password !== password) {
          showAppNotice({ icon: '⚠️', eyebrow: 'AUTH ERROR', title: 'Incorrect Password', message: 'The password entered does not match this client account.' });
          return;
        }
      } else {
        const defaultName = cleanContact.includes('@') ? cleanContact.split('@')[0] : 'Tonye Briggs';
        matchedUser = {
          id: 'usr-' + Date.now(),
          name: defaultName,
          email: cleanContact.includes('@') ? cleanContact : 'client@servhive.ng',
          phone: cleanContact.includes('@') ? '08034567890' : cleanContact,
          role: 'hirer',
          area: 'Peter Odili Road',
          verified: true,
          password: password || 'password123'
        };
        state.users.push(matchedUser);
      }
    }
  }

  state.currentUser = matchedUser;
  persistState();
  updateAuthUI();

  if (isArtisan) {
    showAppNotice({
      icon: '🔨',
      eyebrow: 'ARTISAN PORTAL ACCESS',
      title: `Welcome, ${matchedUser.name}!`,
      message: `Entering your <strong>Artisan Pro Dashboard</strong> directly...`,
      confirmText: 'Go to Dashboard',
      onConfirm: () => {
        window.location.href = '/artisan.html';
      }
    });
    setTimeout(() => {
      window.location.href = '/artisan.html';
    }, 500);
    return;
  }

  showAppNotice({
    icon: '👋',
    eyebrow: 'LOGIN SUCCESSFUL',
    title: `Welcome, ${matchedUser.name}!`,
    message: `Logged in as <strong>Hirer (Client)</strong>. You can now book Port Harcourt artisans with 100% Escrow protection.`,
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
    rating: 0,
    reviewCount: 0,
    verified: false,
    boosted: false,
    status: 'under_review',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: startingPrice,
    responseTime: '~15 mins',
    bio: `${bizName} is a Port Harcourt workshop based in ${area}. ID checked by Servhive (Under review).`,
    workPhotos: [],
    services: [
      { name: `Standard ${catName} Consultation & Service`, price: startingPrice, type: 'Starting from' }
    ],
    reviews: []
  };

  state.users.push(newUser);
  state.providers.unshift(newPro);
  state.currentUser = newUser;
  persistState();
  updateAuthUI();

  showAppNotice({
    icon: '✨',
    eyebrow: 'PRO APPLICATION SUBMITTED',
    title: `Welcome, ${bizName}!`,
    message: `Your provider account has been registered and is currently <strong>Under review</strong>.<br><br>🎁 <strong>1 Month Free Trial</strong> active (₦2,000/month after trial for all providers). 5% commission applies to jobs paid through the app. Verified badges appear after admin review.<br><br>Redirecting you to your Pro Dashboard...`,
    confirmText: 'Go to Pro Dashboard',
    onConfirm: () => {
      window.location.href = '/artisan.html';
    }
  });

  setTimeout(() => {
    window.location.href = '/artisan.html';
  }, 1200);
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
    message: `A 6-digit verification PIN has been dispatched to <strong>${contact}</strong> via SMS / Email.<br><br>For instant assistance, the Servhive support team can be reached at <strong>+234 800-SERVHIVE</strong>.`,
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
        <a href="/login.html#signup" class="ed-button ed-button-amber ed-btn-compact" style="text-decoration: none; font-weight: 700;">
          <span>Sign Up</span>
        </a>
      `;
      if (proCtaBtn) {
        proCtaBtn.style.display = 'none';
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
            <span class="auth-role-tag client">
              Client
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
              <span>Payment Protection Vault</span>
            </button>

            <button class="auth-dropdown-item" onclick="toggleUserMenu(); openMyAccountModal();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>My Account &amp; Past Jobs</span>
            </button>

            <div class="auth-dropdown-divider"></div>

            <button class="auth-dropdown-item" onclick="toggleUserMenu(); handleLogout();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;

      if (proCtaBtn) {
        proCtaBtn.style.display = 'none';
      }
    }
  }

  if (mobileContainer) {
    if (!user) {
      mobileContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <a href="/login.html" class="ed-button ed-button-black" style="width: 100%; padding: 11px; font-size: 0.88rem; text-decoration: none; text-align: center;">
            <span>Log In</span>
          </a>
          <a href="/login.html#signup" class="ed-button ed-button-amber" style="width: 100%; padding: 11px; font-size: 0.88rem; font-weight: 800; text-decoration: none; text-align: center;">
            <span>Create Client Account</span>
          </a>
        </div>
      `;
    } else {
      const isHirer = user.role === 'hirer';
      mobileContainer.innerHTML = `
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--hairline); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <div style="font-weight: 800; font-size: 0.92rem; color: var(--canvas);">${user.name}</div>
            <span class="auth-role-tag client">Client</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${user.area || 'Port Harcourt'}</span>
          </div>
        </div>

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
      <td style="padding: 14px 16px; font-weight: 800; color: var(--teal-bright);">${formatNaira(job.commissionAmount)} (5%)</td>
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
    message: 'Your report has been routed to the Servhive dispute mediation team. We will review the details and reach out.',
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
            Need help with an artisan, rate inquiry, or payment protection release? The Servhive support team resolves queries within 2 hours.
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
                  <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.76rem;" onclick="closeModal('proHomeModal'); openChatDrawer('${req.proId || ''}');">
                    💬 Message Client
                  </button>
                  <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.76rem; color: #DC2626;" onclick="declineProRequest('${req.id}')">
                    Decline
                  </button>
                ` : isQuoted ? `
                  <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.76rem;" onclick="closeModal('proHomeModal'); openChatDrawer('${req.proId || ''}');">
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

  const proId = req.proId || (state.currentUser && state.currentUser.role === 'artisan' ? state.currentUser.id : (state.providers[0] ? state.providers[0].id : ''));
  if (proId && !state.chatMessages[proId]) state.chatMessages[proId] = [];

  if (proId) {
    state.chatMessages[proId].push({
      sender: 'provider',
      isQuote: true,
      quoteId: 'quot-' + Date.now().toString().slice(-4),
      serviceName: req.title,
      amount: amount,
      duration: duration,
      notes: notes
    });
  }

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
  proSelectedBoostDays = 7;
};

window.activateProVisibilityBoost = function() {
  const cost = 1500;
  const days = 7;

  const targetPro = (state.currentUser && state.currentUser.role === 'artisan' && state.providers.find(p => p.id === state.currentUser.id || p.name === state.currentUser.name)) || state.providers[0];
  if (targetPro) {
    targetPro.boosted = true;
    targetPro.boostDaysRemaining = 7;
    persistState();
    renderProviders();

    showAppNotice({
      icon: '⚡',
      eyebrow: 'PROFILE BOOST ACTIVATED',
      title: 'Appear at the top (1 Week)!',
      message: `Your profile (<strong>${targetPro.businessName}</strong>) has been boosted to appear at the top of Port Harcourt search results for 1 week (${formatNaira(cost)}).`,
      confirmText: 'View Directory →',
      onConfirm: () => {
        closeModal('proHomeModal');
        location.href = '#directory';
      }
    });
  } else {
    showAppNotice({
      icon: '⚡',
      eyebrow: 'BOOST YOUR PROFILE',
      title: 'No Active Artisan Profile',
      message: 'Please register your artisan workshop to activate search pinning.',
      confirmText: 'Register Now',
      onConfirm: () => {
        closeModal('proHomeModal');
        openProviderRegisterModal();
      }
    });
  }
};

// ==================== PROFILE BUILDER & VERIFICATION ====================
let pbCurrentTab = 'about';
let pbCurrentProId = '';
let pbRateCardItems = [];

window.openProfileBuilderModal = function(proId) {
  pbCurrentProId = proId || (state.currentUser && state.currentUser.id) || (state.providers[0] ? state.providers[0].id : '');
  const pro = state.providers.find(p => p.id === pbCurrentProId) || state.providers[0];
  if (!pro) return;

  const nameEl = document.getElementById('pbName');
  const bizEl = document.getElementById('pbBizName');
  const phoneEl = document.getElementById('pbPhone');
  const catEl = document.getElementById('pbCategory');
  const bioEl = document.getElementById('pbBio');

  if (nameEl) nameEl.value = pro.name || '';
  if (bizEl) bizEl.value = pro.businessName || '';
  if (phoneEl) phoneEl.value = pro.phone || '';
  if (catEl) catEl.value = pro.category || 'power-gen';
  if (bioEl) bioEl.value = pro.bio || '';

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
    window.location.replace('/artisan.html');
    return;
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
      if (!state.currentUser) {
        e.target.value = '';
        state.searchQuery = '';
        window.handleFindArtisansClick();
        return;
      }
      state.searchQuery = e.target.value;
      renderProviders();
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.handleFindArtisansClick();
      }
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
      if (!state.currentUser) {
        areaSelect.value = 'All Port Harcourt';
        window.handleFindArtisansClick();
        return;
      }
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
      if (!state.currentUser) {
        sortSelect.value = 'featured';
        window.handleFindArtisansClick();
        return;
      }
      state.sortBy = e.target.value;
      if (state.sortBy === 'distance' && !state.userCoords) {
        detectClientLocation();
      } else {
        renderProviders();
      }
    });
  }

  // GSAP Entrance Animations
  if (window.gsap) {
    try {
      gsap.from('.ed-header', { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' });
      gsap.from('.hero-eyebrow', { opacity: 0, y: 10, duration: 0.5, delay: 0.1, ease: 'power2.out' });
      gsap.from('.ed-hero-title', { opacity: 0, y: 20, duration: 0.7, delay: 0.2, ease: 'power3.out' });
      gsap.from('.ed-hero-desc', { opacity: 0, y: 15, duration: 0.6, delay: 0.35, ease: 'power2.out' });
      gsap.from('.ed-search-bar-wrap', { opacity: 0, scale: 0.96, y: 20, duration: 0.7, delay: 0.45, ease: 'power3.out' });
      gsap.from('.hero-quick-chips', { opacity: 0, y: 10, duration: 0.5, delay: 0.6, ease: 'power2.out' });
      gsap.from('.category-icon-tile', {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.5,
        stagger: 0.04,
        delay: 0.5,
        ease: 'power2.out'
      });
    } catch (err) {
      console.warn('GSAP animation skipped:', err);
    }
  }
});

// Global window exposure for inline onclick attributes
window.state = state;
window.PH_LANDMARKS = PH_LANDMARKS;
window.handleFindArtisansClick = handleFindArtisansClick;
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
// ==================== LEGAL & COMPLIANCE MODAL ENGINE ====================
const LEGAL_DOCS = {
  terms: {
    title: 'Terms of Use',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Agreement to Terms</h4>
      <p style="margin-bottom: 12px;">By accessing or using the Servhive platform, whether as a customer seeking services or as a registered provider, you agree to comply with and be bound by these Terms of Use.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. Port Harcourt Service Marketplace</h4>
      <p style="margin-bottom: 12px;">Servhive connects residents and commercial facilities across Port Harcourt with verified, independent artisans and technicians. We provide transparent rate discovery, communication privacy, and licensed payment protection via Paystack.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. Agree Price in the App Before Work</h4>
      <p style="margin-bottom: 12px;">All project scopes, diagnostics, and final prices must be agreed between the customer and provider within the app before the job starts. Arbitrary roadside or on-site price changes after arrival are prohibited.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">4. Payment Protection &amp; Release</h4>
      <p style="margin-bottom: 12px;">Payment is held safely by our licensed payment partner Paystack and released only after you confirm the job is done, or automatically 48 hours after completion if no problem is reported.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">5. Dispute Resolution &amp; Support</h4>
      <p style="margin-bottom: 12px;">Problems must be reported within 48 hours of work completion. Servhive support will review the submitted evidence, quote details, and chat records, and issue a fair decision within 5 working days.</p>
    `
  },
  provider: {
    title: 'Provider Agreement',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Provider Eligibility &amp; Review</h4>
      <p style="margin-bottom: 12px;">All newly registered providers enter the directory under "Under review" status. Verified badges appear on public listings only after approval in the admin console following identity checks.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. Subscription Fees &amp; 1-Month Free Trial</h4>
      <p style="margin-bottom: 12px;">Every new provider receives a 1-month free trial. After that, an ongoing membership fee of ₦2,000 per month applies to ALL providers, paid before the month ends. If unpaid, the profile is hidden from Port Harcourt search until payment is made. Payment reminder notices are sent 7 days and 3 days before renewal.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. Platform Commission (5%)</h4>
      <p style="margin-bottom: 12px;">A 5% commission applies to jobs paid through the app. The customer pays no extra fee for payment protection (the 5% is deducted from the provider's payout upon job confirmation).</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">4. Profile Boost (₦1,500 / Week)</h4>
      <p style="margin-bottom: 12px;">Providers may optionally boost their profile visibility to appear at the top of Port Harcourt search results and category listings at a flat rate of ₦1,500 per week.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">5. Authentic Proof of Work &amp; Customer Reviews</h4>
      <p style="margin-bottom: 12px;">Providers must only upload genuine photographs of completed work performed by their own team. Providers cannot review themselves; reviews and ratings come only from confirmed completed customer jobs.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">6. Mandatory Licences for Regulated Trades</h4>
      <p style="margin-bottom: 12px;">Providers operating in regulated sectors (health, laser aesthetics, tattooing, and mortuary services) must upload valid professional licences before account approval.</p>
    `
  },
  protection: {
    title: 'Payment Protection Terms',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Paystack Escrow Holding</h4>
      <p style="margin-bottom: 12px;">Payment is held safely by our licensed payment partner Paystack and released after you confirm the job is done. Funds are not deposited into personal accounts.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. 48-Hour Auto-Release</h4>
      <p style="margin-bottom: 12px;">If the customer does not tap "Approve &amp; Release" or "Report a Problem" within 48 hours of the provider marking the job complete, the held payment is released to the provider automatically.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. No Extra Fee for Customers</h4>
      <p style="margin-bottom: 12px;">No extra fee for you. Payment protection is fully included. The 5% platform fee is paid by the provider.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">4. Dispute Protocol &amp; Timelines</h4>
      <p style="margin-bottom: 12px;">If work is unsatisfactory or incomplete, the customer must report the problem within 48 hours to freeze disbursement. Servhive support will review the case and communicate a binding decision within 5 working days.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Contact &amp; Identity Privacy</h4>
      <p style="margin-bottom: 12px;">Servhive masks direct telephone numbers in search results and initial inquiries to protect customers and artisans from unsolicited spam and harassment.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. Private Document Storage</h4>
      <p style="margin-bottom: 12px;">Government ID documents (NIN slips, voter cards, driver's licences) and trade practice licences uploaded by providers are stored privately for internal compliance and safety verification. They are never published as public links.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. Payment Data Security</h4>
      <p style="margin-bottom: 12px;">All card payments and bank transfers are processed directly through Paystack's PCI-DSS compliant infrastructure. Servhive does not store debit card details, CVVs, or banking PINs.</p>
    `
  }
};

window.openLegalModal = function(tabKey = 'terms') {
  window.switchLegalTab(tabKey);
  const modal = document.getElementById('legalModal');
  if (modal) modal.classList.add('open');
};

window.switchLegalTab = function(tabKey) {
  const doc = LEGAL_DOCS[tabKey] || LEGAL_DOCS.terms;
  const contentEl = document.getElementById('legalModalContent');
  const titleEl = document.getElementById('legalModalTitle');
  if (titleEl) titleEl.textContent = doc.title;
  if (contentEl) contentEl.innerHTML = doc.content;

  ['terms', 'provider', 'protection', 'privacy'].forEach(k => {
    const btn = document.getElementById(`legalTabBtn-${k}`);
    if (btn) {
      if (k === tabKey) {
        btn.classList.add('ed-button-amber');
        btn.classList.remove('ed-button-black');
      } else {
        btn.classList.remove('ed-button-amber');
        btn.classList.add('ed-button-black');
      }
    }
  });
};

window.openPhotoZoom = openPhotoZoom;
window.toggleSaveProvider = toggleSaveProvider;
