/**
 * Shapes returned by the website's /api/v1 endpoints (src/server/api/queries.ts
 * in the web app). Dates arrive as ISO strings.
 */

export type Role = 'CLIENT' | 'ARTISAN' | 'ADMIN';
export type ProviderStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type QuoteStatus = 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
export type JobStatus = 'FUNDED' | 'AWAITING_RELEASE' | 'RELEASED' | 'DISPUTED' | 'REFUNDED';
export type ReportStatus = 'OPEN' | 'ARTISAN_RESPONDED' | 'RESOLVED' | 'DISMISSED';
export type DocStatus = 'NOT_UPLOADED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type PriceType = 'FIXED' | 'STARTING_FROM' | 'PER_UNIT' | 'MILESTONE';

export type ActionResult<T = unknown> = { ok: true; data?: T; message?: string } | { ok: false; error: string };

export type Billing = {
  state: 'trial' | 'paid' | 'due';
  trialActive: boolean;
  trialDaysLeft: number;
  paidActive: boolean;
  paidUntil: string | null;
  coveredUntil: string | null;
  coveredDaysLeft: number;
};
export type Boost = { active: boolean; until: string | null; daysLeft: number };

export type Me = {
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    role: Role;
    area: string | null;
    onboarded: boolean;
  };
  provider: null | {
    id: string;
    slug: string;
    businessName: string;
    status: ProviderStatus;
    rejectionReason: string | null;
    imageUrl: string | null;
    category: { id: string; name: string; requiresLicence: boolean };
    billing: Billing;
    boost: Boost;
  };
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  rateFrom: number;
  requiresLicence: boolean;
  count: number;
};

export type Meta = {
  city: string;
  areas: string[];
  landmarks: { name: string; shortName: string; zone: string; lat: number; lng: number; popular: boolean }[];
  categories: Category[];
  banks: { code: string; name: string }[];
  reportReasons: string[];
  responseTimes: string[];
  priceTypes: { value: PriceType; label: string }[];
  rules: {
    commissionPct: number;
    monthlySubscription: number;
    freeTrialMonths: number;
    freeTrialSlots: number;
    boostPricePerWeek: number;
    autoReleaseHours: number;
    disputeWindowHours: number;
    disputeDecisionDays: number;
    minWorkPhotosForReview: number;
    minStartingPrice: number;
  };
};

export type ProviderCard = {
  id: string;
  slug: string;
  businessName: string;
  subSpecialty: string | null;
  area: string;
  imageUrl: string | null;
  startingPrice: number;
  responseTime: string;
  ratingAvg: number;
  reviewCount: number;
  boosted: boolean;
  category: { id: string; name: string; icon: string };
  distanceKm: number | null;
};

export type Service = { id: string; name: string; price: number; priceType: PriceType; unitLabel: string | null };
export type WorkPhoto = { id: string; url: string; caption: string; area: string | null };

export type ArtisanProfile = {
  provider: {
    id: string;
    slug: string;
    businessName: string;
    ownerName: string;
    subSpecialty: string | null;
    bio: string;
    area: string;
    areasCovered: string[];
    imageUrl: string | null;
    startingPrice: number;
    responseTime: string;
    yearsExperience: number | null;
    ratingAvg: number;
    reviewCount: number;
    status: ProviderStatus;
    boosted: boolean;
    category: { id: string; name: string; icon: string };
    services: Service[];
    workPhotos: WorkPhoto[];
    reviews: { id: string; authorName: string; rating: number; text: string; area: string | null; createdAt: string }[];
  };
  isOwner: boolean;
  isLive: boolean;
  canHire: boolean;
  saved: boolean;
  defaultArea: string;
};

export type Quote = {
  id: string;
  title: string;
  details: string;
  area: string;
  address: string;
  preferredDate: string | null;
  status: QuoteStatus;
  quoteAmount: number | null;
  quoteDuration: string | null;
  quoteNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientJob = {
  id: string;
  ref: string;
  serviceName: string;
  amount: number;
  status: JobStatus;
  area: string;
  address: string;
  scheduledFor: string | null;
  markedCompleteAt: string | null;
  completionPhotos: string[];
  releasedAt: string | null;
  autoReleased: boolean;
  createdAt: string;
  provider: { businessName: string; slug: string; imageUrl: string | null };
  review: { id: string; rating: number } | null;
  hoursLeft: number | null;
};

export type ProJob = Omit<ClientJob, 'provider' | 'review'> & {
  payoutAmount: number;
  updatedAt: string;
  client: { name: string };
};

export type Report = {
  id: string;
  reason: string;
  notes: string;
  status: ReportStatus;
  artisanResponse: string | null;
  resolutionNote: string | null;
  createdAt: string;
};

export type ClientOverview = {
  held: number;
  activeJobs: number;
  savedCount: number;
  quotesReady: { id: string; title: string; quoteAmount: number | null; provider: { businessName: string } }[];
  awaiting: { id: string; serviceName: string; amount: number; status: JobStatus; markedCompleteAt: string | null; provider: { businessName: string }; hoursLeft: number | null }[];
};

export type ChecklistItem = { key: string; label: string; done: boolean; required: boolean; href: string; meta?: string };

export type ProOverview = {
  stats: { earned: number; paidJobs: number; held: number; heldJobs: number; openRequests: number };
  readiness: { items: ChecklistItem[]; canSubmit: boolean; photoCount: number; needsLicence: boolean };
  requests: (Quote & { client: { name: string } })[];
  jobs: ProJob[];
  billing: Billing;
  boost: Boost;
  status: ProviderStatus;
  rejectionReason: string | null;
};

export type ProProfile = {
  profile: {
    slug: string;
    businessName: string;
    subSpecialty: string | null;
    bio: string;
    areasCovered: string[];
    startingPrice: number;
    responseTime: string;
    yearsExperience: number | null;
    phone: string | null;
    imageUrl: string | null;
    status: ProviderStatus;
    category: { id: string; name: string };
  };
  services: Service[];
  photos: WorkPhoto[];
};

export type ProVerification = {
  status: ProviderStatus;
  rejectionReason: string | null;
  needsLicence: boolean;
  canSubmit: boolean;
  photoCount: number;
  items: ChecklistItem[];
  docs: { kind: 'GOVERNMENT_ID' | 'TRADE_LICENCE'; status: DocStatus; fileName: string; licenceNumber: string | null; rejectionReason: string | null; submittedAt: string }[];
};

export type Conversation = {
  id: string;
  updatedAt: string;
  counterpart: { name: string; avatarUrl: string | null; slug: string | null };
  lastMessage: { body: string; mine: boolean; createdAt: string } | null;
};

export type Thread = {
  id: string;
  side: 'client' | 'artisan';
  counterpart: { name: string; avatarUrl: string | null; slug: string | null };
  messages: { id: string; body: string; mine: boolean; createdAt: string; flagged: boolean }[];
};
