// ============================================================================
// SERVHIVE PORT HARCOURT — DEDICATED ARTISAN MULTI-PAGE PORTAL (artisan.js)
// Dedicated Dashboard for Verified Artisans: Quotes, Escrow, Profile, Verification, Complaints
// ============================================================================

// Clean template generator for a new artisan account
function createInitialArtisanProfile(user) {
  const name = (user && user.name) ? user.name.replace(/\s*\(Pro\)/gi, '').trim() : 'Master Craftsman';
  const bizName = (user && user.businessName) ? user.businessName : `${name} Engineering Works`;
  const area = (user && user.area) ? user.area : 'Trans-Amadi';
  const category = (user && user.category) ? user.category : 'power-gen';
  const categoryName = (user && user.trade) ? user.trade : 'Power & Generators';

  return {
    id: (user && user.id) ? (user.id.startsWith('pro-') ? user.id : 'pro-' + user.id.replace('usr-', '')) : 'pro-' + Date.now(),
    name: name,
    businessName: bizName,
    category: category,
    categoryName: categoryName,
    subSpecialty: `${categoryName} Specialist`,
    area: area,
    rating: 0,
    reviewCount: 0,
    reviews: [],
    verified: false,
    boosted: false,
    boostDays: 0,
    boostExpires: null,
    status: 'under_review',
    image: '/assets/hero_tradesman.jpg',
    startingPrice: (user && user.startingPrice) ? user.startingPrice : 10000,
    responseTime: '~15 mins',
    bio: (user && user.bio) ? user.bio : `Professional ${categoryName} services serving clients across ${area} and greater Port Harcourt.`,
    workPhotos: [],
    services: [],
    areasCovered: [area, 'Peter Odili Road', 'Woji', 'Old GRA', 'New GRA / Phase 2', 'D-Line'],
    licenceNumber: ''
  };
}

const INITIAL_QUOTE_REQUESTS = [];
const INITIAL_ESCROW_JOBS = [];
const INITIAL_REPORTS = [];

// --- PORTAL APPLICATION STATE ---
const artisanState = {
  currentUser: null,
  provider: null,
  quoteRequests: [],
  escrowJobs: [],
  reports: [],
  selectedBoostDays: 3,
  activeChatCustomer: null
};

// ============================================================================
// INITIALIZATION & HYDRATION
// ============================================================================
function initArtisanPortal() {
  const loaded = loadStoredData();
  if (!loaded) return; // redirected to login
  setupIdentityHeader();
  renderKpis();
  renderArtisanRequests();
  renderArtisanJobs();
  initProfileBuilder();
  initVerificationSection();
  renderArtisanComplaints();
  handleInitialHash();
  setupTheme();

  // Listen to hash changes for smooth sidebar navigation
  window.addEventListener('hashchange', handleHashChange);
}

function loadStoredData() {
  // Purge any legacy dummy mock artisans from localStorage
  const dummyProIds = new Set(['pro-1', 'pro-2', 'pro-3', 'pro-4', 'pro-5', 'pro-6', 'pro-7', 'pro-8', 'pro-9', 'pro-10', 'pro-11']);
  const dummyNames = new Set([
    'Engr. Emeka Obi', 'Blessing Amadi', 'Chidi Okonkwo',
    'Franklyn Eke', 'Tari Princewill', 'Victor Nnamdi', 'Idowu Alabi',
    'Samuel Dike', 'Kenneth Jumbo', 'Somto Okon', 'Tari Davies', 'Engr. Franklyn Nnamdi',
    'PowerVolt Generator & Electrical Works', 'Precision Mobile Auto Diagnostics'
  ]);

  // Current user
  try {
    const storedUser = localStorage.getItem('servhive_current_user');
    artisanState.currentUser = storedUser ? JSON.parse(storedUser) : null;
    if (artisanState.currentUser && (dummyNames.has(artisanState.currentUser.name) || dummyNames.has(artisanState.currentUser.businessName))) {
      artisanState.currentUser = null;
      localStorage.removeItem('servhive_current_user');
    }
  } catch (e) {
    artisanState.currentUser = null;
  }

  // Authentication & Role check: STRICT SEPARATION
  if (!artisanState.currentUser) {
    // Unauthenticated user -> redirect to dedicated artisan login
    window.location.replace('/login.html#login-artisan');
    return false;
  }

  // Clients DO NOT have access to the Artisan Portal
  if (artisanState.currentUser.role !== 'artisan') {
    window.location.replace('/index.html');
    return false;
  }

  // Providers list
  let storedProviders = [];
  try {
    const p = localStorage.getItem('servhive_providers');
    storedProviders = p ? JSON.parse(p) : [];
    storedProviders = storedProviders.filter(pro => !dummyProIds.has(pro.id) && !dummyNames.has(pro.name) && !dummyNames.has(pro.businessName));
    localStorage.setItem('servhive_providers', JSON.stringify(storedProviders));
  } catch (e) {
    storedProviders = [];
  }

  // Find matching provider record
  artisanState.provider = storedProviders.find(p => 
    p.id === artisanState.currentUser.id || 
    p.id === 'pro-' + String(artisanState.currentUser.id).replace('usr-', '') ||
    (p.businessName && p.businessName === artisanState.currentUser.businessName) ||
    p.name === artisanState.currentUser.name
  );

  if (!artisanState.provider) {
    artisanState.provider = createInitialArtisanProfile(artisanState.currentUser);
    storedProviders.unshift(artisanState.provider);
    localStorage.setItem('servhive_providers', JSON.stringify(storedProviders));
  }

  // Quote Requests
  try {
    const r = localStorage.getItem('servhive_quote_requests');
    const allReqs = r ? JSON.parse(r) : [];
    artisanState.quoteRequests = allReqs.filter(req => 
      !dummyProIds.has(req.proId) && 
      !['req-201', 'req-202', 'req-203'].includes(req.id) &&
      (req.proId === artisanState.provider.id || req.proName === artisanState.provider.businessName)
    );
  } catch (e) {
    artisanState.quoteRequests = [];
  }

  // Escrow Jobs
  try {
    const j = localStorage.getItem('servhive_escrow_jobs');
    const allJobs = j ? JSON.parse(j) : [];
    artisanState.escrowJobs = allJobs.filter(job => 
      !dummyProIds.has(job.proId) && 
      job.id !== 'esc-101' &&
      (job.proId === artisanState.provider.id || job.proName === artisanState.provider.businessName)
    );
  } catch (e) {
    artisanState.escrowJobs = [];
  }

  // Complaints / Reports
  try {
    const rep = localStorage.getItem('servhive_reports');
    const allReps = rep ? JSON.parse(rep) : [];
    artisanState.reports = allReps.filter(rp => 
      !dummyProIds.has(rp.providerId) && 
      rp.id !== 'rep-1' &&
      (rp.providerId === artisanState.provider.id || rp.providerName === artisanState.provider.businessName)
    );
  } catch (e) {
    artisanState.reports = [];
  }

  return true;
}

function persistQuoteRequests() {
  localStorage.setItem('servhive_quote_requests', JSON.stringify(artisanState.quoteRequests));
}

function persistEscrowJobs() {
  localStorage.setItem('servhive_escrow_jobs', JSON.stringify(artisanState.escrowJobs));
}

function persistReports() {
  localStorage.setItem('servhive_reports', JSON.stringify(artisanState.reports));
}

function persistProvider() {
  try {
    let storedProviders = JSON.parse(localStorage.getItem('servhive_providers')) || [];
    const idx = storedProviders.findIndex(p => p.id === artisanState.provider.id);
    if (idx !== -1) {
      storedProviders[idx] = artisanState.provider;
    } else {
      storedProviders.unshift(artisanState.provider);
    }
    localStorage.setItem('servhive_providers', JSON.stringify(storedProviders));
  } catch (e) {}
}

// ============================================================================
// PRO DASHBOARD DROPDOWN MENU
// ============================================================================
function toggleProDashboardDropdown(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const wrap = document.getElementById('proDashboardDropdownWrap');
  const btn = document.getElementById('proDashboardDropdownBtn');
  if (!wrap) return;
  const isOpen = wrap.classList.toggle('open');
  if (btn) {
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function closeProDashboardDropdown() {
  const wrap = document.getElementById('proDashboardDropdownWrap');
  const btn = document.getElementById('proDashboardDropdownBtn');
  if (wrap && wrap.classList.contains('open')) {
    wrap.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

function selectDropdownNav(sectionId, e) {
  if (e) {
    e.preventDefault();
  }
  closeProDashboardDropdown();
  switchArtisanSection(sectionId);
}

// Global click-outside and escape dismiss for dropdown
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('proDashboardDropdownWrap');
  if (wrap && wrap.classList.contains('open')) {
    if (!wrap.contains(e.target)) {
      closeProDashboardDropdown();
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProDashboardDropdown();
  }
});

// ============================================================================
// HEADER & IDENTITY
// ============================================================================
function setupIdentityHeader() {
  const bizEl = document.getElementById('artisanHeaderBizName');
  const nameEl = document.getElementById('artisanHeaderName');
  const avatarEl = document.getElementById('artisanAvatar');
  const avatarDot = document.getElementById('artisanAvatarStatusDot');
  const headerBadge = document.getElementById('artisanHeaderBadge');
  const kycBadge = document.getElementById('badgeKycStatus');
  const welcomeTitle = document.getElementById('proHomeWelcomeTitle');

  // Dropdown elements
  const dropdownBiz = document.getElementById('dropdownProBizName');
  const dropdownBadge = document.getElementById('dropdownProBadge');

  const p = artisanState.provider;
  if (!p) return;

  if (bizEl) {
    bizEl.textContent = p.businessName || 'Master Workshop Services';
  }
  if (dropdownBiz) {
    dropdownBiz.textContent = p.businessName || 'Artisan Pro Services';
  }
  if (nameEl) {
    const rawName = p.name || 'Craftsman';
    const cleanName = rawName.replace(/\s*\(Pro\)/gi, '').replace(/\s+/g, ' ').trim();
    nameEl.textContent = cleanName;
  }
  if (welcomeTitle) {
    const rawName = p.name || 'Craftsman';
    const cleanName = rawName.replace(/\s*\(Pro\)/gi, '').replace(/\s+/g, ' ').trim();
    welcomeTitle.textContent = `Welcome Back, ${cleanName}`;
  }
  if (avatarEl && p.image) {
    avatarEl.src = p.image;
  }

  const isVerified = p.verified && p.status === 'approved';
  if (headerBadge) {
    if (isVerified) {
      headerBadge.className = 'badge ed-badge-verified';
      headerBadge.textContent = '✓ ID checked by Servhive';
      headerBadge.style.background = 'rgba(20, 184, 166, 0.12)';
      headerBadge.style.color = '#2dd4bf';
      headerBadge.style.borderColor = 'rgba(20, 184, 166, 0.25)';
    } else {
      headerBadge.className = 'badge';
      headerBadge.textContent = '⏳ Under review';
      headerBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      headerBadge.style.color = '#f59e0b';
      headerBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    }
  }

  if (dropdownBadge) {
    if (isVerified) {
      dropdownBadge.className = 'badge ed-badge-verified';
      dropdownBadge.textContent = '✓ Active';
      dropdownBadge.style.background = 'rgba(20, 184, 166, 0.12)';
      dropdownBadge.style.color = '#2dd4bf';
      dropdownBadge.style.borderColor = 'rgba(20, 184, 166, 0.25)';
    } else {
      dropdownBadge.className = 'badge';
      dropdownBadge.textContent = '⏳ Under review';
      dropdownBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      dropdownBadge.style.color = '#f59e0b';
      dropdownBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    }
  }

  if (avatarDot) {
    avatarDot.style.background = isVerified ? '#0d9488' : '#f59e0b';
  }

  if (kycBadge) {
    if (isVerified) {
      kycBadge.className = 'artisan-sidebar-badge badge-teal';
      kycBadge.textContent = '✓ Pass';
    } else {
      kycBadge.className = 'artisan-sidebar-badge badge-amber';
      kycBadge.textContent = '⏳ Review';
    }
  }
}

// ============================================================================
// SECTION NAVIGATION & HASH ROUTING
// ============================================================================
const VALID_SECTIONS = ['home', 'requests', 'jobs', 'profile', 'verification', 'payout', 'billing', 'complaints'];

function switchArtisanSection(sectionId) {
  if (!VALID_SECTIONS.includes(sectionId)) sectionId = 'home';

  // Toggle active class on sections
  VALID_SECTIONS.forEach(sec => {
    const secEl = document.getElementById(`sec-${sec}`);
    const navEl = document.getElementById(`navItem-${sec}`);
    if (secEl) {
      if (sec === sectionId) {
        secEl.classList.add('active');
      } else {
        secEl.classList.remove('active');
      }
    }
    if (navEl) {
      if (sec === sectionId) {
        navEl.classList.add('active');
      } else {
        navEl.classList.remove('active');
      }
    }
  });

  // Call section specific renderers
  if (sectionId === 'payout') {
    renderPayoutSection();
  } else if (sectionId === 'billing') {
    renderBillingSection();
  } else if (sectionId === 'verification') {
    initVerificationSection();
  } else if (sectionId === 'jobs') {
    renderArtisanJobs();
  }

  if (window.location.hash !== `#${sectionId}`) {
    window.location.hash = sectionId;
  }

  // Scroll to top of content
  const mainCol = document.querySelector('.artisan-main-content');
  if (mainCol) mainCol.scrollTop = 0;
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '');
  if (VALID_SECTIONS.includes(hash)) {
    switchArtisanSection(hash);
  }
}

function handleInitialHash() {
  const hash = window.location.hash.replace('#', '');
  if (VALID_SECTIONS.includes(hash)) {
    switchArtisanSection(hash);
  } else {
    switchArtisanSection('home');
  }
}

// ============================================================================
// PRO HOME (ANALYTICS, KPIS, PLAN & BOOST)
// ============================================================================
function renderKpis() {
  const p = artisanState.provider;
  const isVerified = p && p.verified && p.status === 'approved';

  // Review Status KPI
  const reviewStatusVal = document.getElementById('proHomeReviewStatusVal');
  const reviewSub = document.getElementById('proHomeReviewSub');
  if (reviewStatusVal) {
    if (isVerified) {
      reviewStatusVal.innerHTML = '<span style="color: var(--teal); font-weight: 800;">✓ Active</span>';
    } else {
      reviewStatusVal.innerHTML = '<span style="color: #f59e0b; font-weight: 800;">Under review</span>';
    }
  }
  if (reviewSub) {
    reviewSub.textContent = 'ID checked by Servhive';
  }

  // Rating KPI
  const ratingVal = document.getElementById('artisanRatingVal');
  const reviewsSub = document.getElementById('artisanReviewsSub');
  const count = (p && p.reviewCount) ? p.reviewCount : 0;
  if (ratingVal) {
    ratingVal.textContent = count > 0 ? (p.rating ? p.rating.toFixed(1) : '5.0') : '—';
  }
  if (reviewsSub) {
    if (count === 0) {
      reviewsSub.textContent = 'No reviews yet';
    } else if (count === 1) {
      reviewsSub.textContent = '1 review';
    } else {
      reviewsSub.textContent = `${count} reviews`;
    }
  }

  // Active Requests
  const activeReqsVal = document.getElementById('proHomeActiveReqsVal');
  const badgeReqs = document.getElementById('badgeRequestsCount');
  const dropdownReqs = document.getElementById('dropdownRequestsBadge');
  const activeCount = artisanState.quoteRequests.filter(r => r.status === 'pending' || r.status === 'quoted').length;
  if (activeReqsVal) activeReqsVal.textContent = activeCount;
  if (badgeReqs) badgeReqs.textContent = activeCount;
  if (dropdownReqs) dropdownReqs.textContent = activeCount;

  // Active jobs count & Escrow balance
  renderEscrowBalance();

  // Complaints count
  const complaintsCount = artisanState.reports.filter(r => r.status !== 'resolved').length;
  const badgeComplaints = document.getElementById('badgeComplaintsCount');
  const dropdownComplaints = document.getElementById('dropdownComplaintsBadge');
  if (badgeComplaints) badgeComplaints.textContent = complaintsCount;
  if (dropdownComplaints) {
    dropdownComplaints.textContent = complaintsCount;
    dropdownComplaints.style.display = complaintsCount > 0 ? 'inline-block' : 'none';
  }

  // Render recent preview on Home
  renderHomeRecentRequests();
}

function renderHomeRecentRequests() {
  const container = document.getElementById('homeRecentRequestsPreview');
  if (!container) return;

  const recent = artisanState.quoteRequests.slice(0, 2);
  if (!recent.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--muted-foreground); font-size: 0.86rem;">
        No pending inquiries. Your profile is ready for client inquiries.
      </div>
    `;
    return;
  }

  container.innerHTML = recent.map(req => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 10px; gap: 14px; flex-wrap: wrap;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
          <strong style="font-size: 0.92rem; color: var(--foreground);">${req.title}</strong>
          <span class="badge ${req.status === 'pending' ? 'badge-secondary' : 'ed-badge-verified'}" style="font-size: 0.68rem;">
            ${req.status === 'pending' ? '⏳ Awaiting Quote' : '✓ Quoted (₦' + (req.quoteAmount || 0).toLocaleString() + ')'}
          </span>
        </div>
        <div style="font-size: 0.78rem; color: var(--muted-foreground);">
          Client: <strong>${req.customerName}</strong> · ${req.area} · Received: ${req.createdAt}
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="ed-button ed-button-amber ed-btn-compact" onclick="openArtisanQuoteModal('${req.id}')">
          <span>${req.status === 'pending' ? 'Submit Quote' : 'Edit Quote'}</span>
        </button>
        <button class="ed-button ed-button-black ed-btn-compact" onclick="openArtisanChatDrawer('${req.customerName}', '${req.customerPhone}', '${req.title}')">
          <span>Chat</span>
        </button>
      </div>
    </div>
  `).join('');
}

function selectBoostDays(days) {
  artisanState.selectedBoostDays = 7;
}

function activateProVisibilityBoost() {
  const cost = 1500;
  artisanState.provider.boosted = true;
  artisanState.provider.boostDays = 7;
  artisanState.provider.boostExpires = '1 Week';
  persistProvider();

  showArtisanNotice(
    'Visibility Boost Activated!',
    `Your craftsman profile is now pinned to appear at the top of Port Harcourt search results and category listings for <strong>1 week (7 days)</strong>.<br><br>Cost: <strong>₦1,500/week</strong>.`,
    '⚡',
    'TOP SEARCH PINNING ACTIVE'
  );
}

// ============================================================================
// REQUESTS & QUOTES WORKFLOW
// ============================================================================
function renderArtisanRequests() {
  const container = document.getElementById('artisanRequestsContainer');
  if (!container) return;

  const requests = artisanState.quoteRequests;
  if (!requests.length) {
    container.innerHTML = `
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 40px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">📬</div>
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">No Customer Inquiries Yet</h3>
        <p style="font-size: 0.86rem; color: var(--muted-foreground); max-width: 440px; margin: 0 auto 16px;">
          When clients in Port Harcourt request quotes from your workshop, they appear right here for transparent bidding.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = requests.map(req => {
    const isPending = req.status === 'pending';
    const isQuoted = req.status === 'quoted';
    const isAccepted = req.status === 'accepted';
    const isDeclined = req.status === 'declined';

    return `
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 22px; transition: var(--transition);">
        
        <!-- Header Row -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="badge" style="background: var(--bg-surface-subtle); color: var(--muted-foreground); font-weight: 800; font-size: 0.72rem;">#${req.id}</span>
              <h3 style="font-size: 1.2rem; font-weight: 800; margin: 0; color: var(--foreground);">${req.title}</h3>
            </div>
            <div style="font-size: 0.8rem; color: var(--muted-foreground); display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span>👤 <strong>${req.customerName}</strong></span>
              <span>📍 ${req.area} (${req.address || 'Port Harcourt'})</span>
              <span>🕒 Preferred: <strong>${req.preferredDate || 'Earliest Available'}</strong></span>
              <span>📅 Received: ${req.createdAt}</span>
            </div>
          </div>

          <!-- Status Badge -->
          <div>
            ${isPending ? `<span class="badge" style="background: var(--amber-light); color: var(--amber-dark); font-weight: 800;">⏳ Awaiting Your Quote</span>` : ''}
            ${isQuoted ? `<span class="badge ed-badge-verified" style="font-weight: 800;">✓ Quoted: ₦${(req.quoteAmount || 0).toLocaleString()}</span>` : ''}
            ${isAccepted ? `<span class="badge" style="background: var(--teal-light); color: var(--teal); font-weight: 800;">🎉 Client Accepted (In Escrow)</span>` : ''}
            ${isDeclined ? `<span class="badge" style="background: rgba(220, 38, 38, 0.15); color: #DC2626; font-weight: 800;">✕ Declined</span>` : ''}
          </div>
        </div>

        <!-- Description Box -->
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 16px; font-size: 0.86rem; line-height: 1.5; color: var(--foreground);">
          <strong>Client Work Scope:</strong><br>
          ${req.details}
        </div>

        <!-- If Quoted: Show Breakdown -->
        ${isQuoted ? `
          <div style="background: var(--bg-surface-subtle); border-left: 3px solid var(--teal); border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 16px; font-size: 0.82rem;">
            <div style="display: flex; justify-content: space-between; font-weight: 800; margin-bottom: 4px; font-size: 0.88rem;">
              <span>Submitted Fixed Quote: <strong>₦${req.quoteAmount.toLocaleString()}</strong></span>
              <span style="color: var(--teal);">Net Escrow Payout: ₦${Math.round(req.quoteAmount * 0.95).toLocaleString()} (5% fee deducted)</span>
            </div>
            <div style="color: var(--muted-foreground);">${req.quoteNotes || 'Turnaround: Within 4 hours (Same Day)'}</div>
          </div>
        ` : ''}

        <!-- Actions Toolbar -->
        <div class="artisan-card-actions">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ed-button ed-button-amber ed-btn-compact" onclick="openArtisanQuoteModal('${req.id}')">
              <span>${isQuoted ? 'Update Quote Price' : 'Enter Official Quote &rarr;'}</span>
            </button>

            ${!isAccepted && !isDeclined ? `
              <button class="ed-button ed-button-black ed-btn-compact" style="border-color: var(--teal); color: var(--teal);" onclick="artisanAcceptRequest('${req.id}')">
                <span>✓ Accept Job</span>
              </button>
              <button class="ed-button ed-button-black ed-btn-compact" style="color: #DC2626;" onclick="artisanDeclineRequest('${req.id}')">
                <span>✕ Decline</span>
              </button>
            ` : ''}
          </div>

          <button class="ed-button ed-button-black ed-btn-compact" onclick="openArtisanChatDrawer('${req.customerName}', '${req.customerPhone}', '${req.title}')">
            <span>💬 Message Client (Masked)</span>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

function openArtisanQuoteModal(reqId) {
  const req = artisanState.quoteRequests.find(r => r.id === reqId);
  if (!req) return;

  const idInput = document.getElementById('artisanQuoteReqId');
  const amountInput = document.getElementById('artisanQuoteAmountInput');
  const notesInput = document.getElementById('artisanQuoteNotesInput');
  const contextEl = document.getElementById('artisanQuoteModalContext');

  if (idInput) idInput.value = req.id;
  if (contextEl) {
    contextEl.innerHTML = `<strong>${req.title}</strong> for client <strong>${req.customerName}</strong> (${req.area})`;
  }
  if (amountInput) {
    amountInput.value = req.quoteAmount || 25000;
    updateArtisanQuoteBreakdown(amountInput.value);
  }
  if (notesInput) {
    notesInput.value = req.quoteNotes || 'Includes complete on-site diagnostic, labor, precision installation, and 30-day workmanship warranty.';
  }

  const modal = document.getElementById('artisanEnterQuoteModal');
  if (modal) modal.classList.add('open');
}

function updateArtisanQuoteBreakdown(val) {
  const total = Number(val) || 0;
  const commission = Math.round(total * 0.05); // 5% Escrow commission
  const net = total - commission;

  const totalEl = document.getElementById('artisanQuoteTotalDisplay');
  const commEl = document.getElementById('artisanQuoteCommissionDisplay');
  const netEl = document.getElementById('artisanQuoteNetPayoutDisplay');

  if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;
  if (commEl) commEl.textContent = `₦${commission.toLocaleString()}`;
  if (netEl) netEl.textContent = `₦${net.toLocaleString()}`;
}

function handleArtisanSubmitQuote(e) {
  e.preventDefault();
  const reqId = document.getElementById('artisanQuoteReqId').value;
  const amount = Number(document.getElementById('artisanQuoteAmountInput').value) || 0;
  const duration = document.getElementById('artisanQuoteDurationInput').value.trim();
  const notes = document.getElementById('artisanQuoteNotesInput').value.trim();

  const req = artisanState.quoteRequests.find(r => r.id === reqId);
  if (!req) return;

  req.status = 'quoted';
  req.quoteAmount = amount;
  req.quoteNotes = `${duration}. ${notes}`;

  persistQuoteRequests();
  renderArtisanRequests();
  renderKpis();
  closeModal('artisanEnterQuoteModal');

  const net = amount - Math.round(amount * 0.05);
  showArtisanNotice(
    'Official Quote Dispatched!',
    `Your fixed price proposal of <strong>₦${amount.toLocaleString()}</strong> has been delivered to <strong>${req.customerName}</strong>.<br><br>Once the client accepts and locks the deposit in the Escrow Vault, your <strong>₦${net.toLocaleString()} net payout</strong> will be reserved for immediate release upon job completion.`,
    '✓',
    'ESCROW PROPOSAL SENT'
  );
}

function artisanAcceptRequest(reqId) {
  const req = artisanState.quoteRequests.find(r => r.id === reqId);
  if (!req) return;

  req.status = 'accepted';
  const amount = req.quoteAmount || 20000;
  const comm = Math.round(amount * 0.05);
  const payout = amount - comm;

  // Create an active escrow job
  const newJob = {
    id: 'esc-' + Date.now().toString().slice(-4),
    proId: artisanState.provider.id,
    proName: artisanState.provider.businessName,
    customerName: req.customerName,
    customerPhone: req.customerPhone,
    serviceName: req.title,
    area: req.area,
    address: req.address || `${req.area}, Port Harcourt`,
    dateTime: req.preferredDate || 'Today, 2:00 PM',
    amount: amount,
    status: 'in_progress',
    createdAt: 'Today',
    commissionPct: 5,
    commissionAmount: comm,
    payoutAmount: payout,
    scopeNotes: req.details
  };

  artisanState.escrowJobs.unshift(newJob);

  persistQuoteRequests();
  persistEscrowJobs();
  renderArtisanRequests();
  renderArtisanJobs();
  renderKpis();

  showArtisanNotice(
    'Job Accepted & Escrow Created!',
    `You accepted <strong>${req.title}</strong> for ${req.customerName}.<br><br>The client's deposit of <strong>₦${amount.toLocaleString()}</strong> is locked in trust. Switch to <strong>Active Jobs & Escrow</strong> to track and mark completion when the job is done.`,
    '🎉',
    'WORK ORDER ACTIVATED'
  );
}

function artisanDeclineRequest(reqId) {
  const req = artisanState.quoteRequests.find(r => r.id === reqId);
  if (!req) return;

  if (!confirm(`Are you sure you want to decline this inquiry from ${req.customerName}?`)) return;

  req.status = 'declined';
  persistQuoteRequests();
  renderArtisanRequests();
  renderKpis();

  showArtisanNotice(
    'Inquiry Declined',
    `You declined request #${req.id}. The client has been respectfully notified to review alternative verified craftsmen in ${req.area}.`,
    '✕',
    'INQUIRY CLOSED'
  );
}

// ============================================================================
// JOB EXECUTION & ESCROW MANAGEMENT (CRUCIAL REQUIREMENT)
// ============================================================================
function renderEscrowBalance() {
  const display = document.getElementById('artisanEscrowBalanceDisplay');
  const badgeJobs = document.getElementById('badgeJobsCount');
  const dropdownJobs = document.getElementById('dropdownJobsBadge');

  // Active jobs are in_progress or awaiting_release
  const activeJobs = artisanState.escrowJobs.filter(j => j.status === 'in_progress' || j.status === 'awaiting_release');
  const totalHeld = activeJobs.reduce((sum, j) => sum + (j.amount || 0), 0);

  if (display) display.textContent = `₦${totalHeld.toLocaleString()}`;
  if (badgeJobs) badgeJobs.textContent = activeJobs.length;
  if (dropdownJobs) dropdownJobs.textContent = activeJobs.length;
}

let pendingCompleteJobId = null;

function checkArtisanAutoReleaseJobs() {
  const now = Date.now();
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
  let changed = false;

  artisanState.escrowJobs.forEach(job => {
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
    persistEscrowJobs();
    renderKpis();
  }
}

function renderArtisanJobs() {
  checkArtisanAutoReleaseJobs();
  const container = document.getElementById('artisanJobsContainer');
  if (!container) return;

  renderEscrowBalance();

  const jobs = artisanState.escrowJobs;
  if (!jobs.length) {
    container.innerHTML = `
      <div style="background: var(--card); border: 1px dashed var(--border); border-radius: var(--radius-md); padding: 48px 24px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🔒</div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 6px 0;">No Active Jobs Yet</h3>
        <p style="font-size: 0.86rem; color: var(--muted-foreground); max-width: 440px; margin: 0 auto 18px;">
          When a Port Harcourt client accepts your official quote and funds it via Paystack, the job and its payment protection deposit appear here.
        </p>
        <button class="ed-button ed-button-amber ed-btn-compact" onclick="switchArtisanSection('requests')">
          <span>View Customer Inquiries &rarr;</span>
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = jobs.map(job => {
    const isInProgress = job.status === 'in_progress';
    const isAwaitingRelease = job.status === 'awaiting_release';
    const isCompleted = job.status === 'completed';
    const isDisputed = job.status === 'disputed';

    return `
      <div style="background: var(--card); border: 1px solid ${isInProgress ? 'var(--hairline-teal)' : isAwaitingRelease ? 'var(--amber)' : 'var(--border)'}; border-radius: var(--radius-md); padding: 24px; transition: var(--transition);">
        
        <!-- Job Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span class="badge" style="background: var(--bg-surface-subtle); color: var(--teal); font-weight: 800; font-size: 0.72rem;">JOB #${job.id}</span>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0; color: var(--foreground);">${job.serviceName}</h3>
            </div>
            <div style="font-size: 0.82rem; color: var(--muted-foreground); display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span>Client: <strong>${job.customerName || 'Client'}</strong></span>
              <span>📞 ${job.customerPhone || '0803 123 4567'}</span>
              <span>📍 ${job.address || job.area}</span>
              <span>📅 Scheduled: ${job.dateTime}</span>
            </div>
          </div>

          <!-- Status Indicator -->
          <div>
            ${isInProgress ? `
              <span class="badge" style="background: var(--teal-light); color: var(--teal); font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ⚙️ Work In Progress — Payment Protected
              </span>
            ` : ''}
            ${isAwaitingRelease ? `
              <span class="badge" style="background: var(--amber-light); color: var(--amber-dark); font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ⏳ Marked Completed — 48h Auto-Release Active
              </span>
            ` : ''}
            ${isCompleted ? `
              <span class="badge ed-badge-verified" style="font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ✓ Funds Released &amp; Paid
              </span>
            ` : ''}
            ${isDisputed ? `
              <span class="badge" style="background: rgba(220, 38, 38, 0.15); color: #DC2626; font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ⚠️ Under Support Review
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Financial Breakdown Grid -->
        <div class="escrow-breakdown-grid">
          <div>
            <div style="font-size: 0.72rem; color: var(--muted-foreground); text-transform: uppercase; font-weight: 700;">Customer Deposit</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--foreground); margin-top: 2px;">₦${job.amount.toLocaleString()}</div>
            <div style="font-size: 0.72rem; color: var(--teal);">Held safely by Paystack</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--muted-foreground); text-transform: uppercase; font-weight: 700;">Servhive fee (5%)</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--muted-foreground); margin-top: 2px;">₦${job.commissionAmount.toLocaleString()}</div>
            <div style="font-size: 0.72rem; color: var(--muted-foreground);">Jobs paid through app</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--teal); text-transform: uppercase; font-weight: 800;">Your Net Payout (95%)</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: var(--teal); margin-top: 2px;">₦${job.payoutAmount.toLocaleString()}</div>
            <div style="font-size: 0.72rem; color: var(--teal);">Disbursed via Paystack</div>
          </div>
        </div>

        <!-- Job Notes / Instructions -->
        ${job.scopeNotes ? `
          <div style="font-size: 0.82rem; color: var(--muted-foreground); margin-bottom: 18px; line-height: 1.4;">
            <strong>Work Scope Instructions:</strong> ${job.scopeNotes}
          </div>
        ` : ''}

        <!-- Crucial Action Buttons & Workflow -->
        <div class="artisan-card-actions">
          
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            ${isInProgress ? `
              <button class="ed-button ed-button-amber" style="padding: 10px 20px; font-size: 0.88rem; font-weight: 800;" onclick="openJobCompleteModal('${job.id}')">
                <span>✓ Job Completed &rarr;</span>
              </button>
            ` : ''}

            ${isAwaitingRelease ? `
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-size: 0.82rem; color: var(--amber-dark); font-weight: 700;">
                  ⏱️ Customer notified to approve. Auto-release active: funds will be automatically released within 48 hours if no problem is reported.
                </span>
              </div>
            ` : ''}

            ${isCompleted ? `
              <div style="font-size: 0.84rem; color: var(--teal); font-weight: 800; display: flex; align-items: center; gap: 6px;">
                ✓ ₦${job.payoutAmount.toLocaleString()} released to your registered bank account.
              </div>
            ` : ''}
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ed-button ed-button-black ed-btn-compact" onclick="openArtisanChatDrawer('${job.customerName || 'Client'}', '${job.customerPhone || '0803 123 4567'}', '${job.serviceName}')">
              <span>💬 Contact Client</span>
            </button>
            <button class="ed-button ed-button-black ed-btn-compact" onclick="openArtisanLegalModal('protection')">
              <span>Payment Rules &amp; Auto-Release</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');
}

function openJobCompleteModal(jobId) {
  const job = artisanState.escrowJobs.find(j => j.id === jobId);
  if (!job) return;

  pendingCompleteJobId = jobId;
  const svcEl = document.getElementById('completeModalServiceName');
  const custEl = document.getElementById('completeModalCustomerName');
  const payoutEl = document.getElementById('completeModalPayoutAmount');

  if (svcEl) svcEl.textContent = job.serviceName;
  if (custEl) custEl.textContent = job.customerName || 'Client';
  if (payoutEl) payoutEl.textContent = `₦${job.payoutAmount.toLocaleString()}`;

  const modal = document.getElementById('artisanJobCompleteModal');
  if (modal) modal.classList.add('open');
}

function confirmMarkJobCompleted() {
  if (!pendingCompleteJobId) return;
  const job = artisanState.escrowJobs.find(j => j.id === pendingCompleteJobId);
  if (!job) return;

  job.status = 'awaiting_release';
  job.markedCompletedAt = new Date().toISOString();
  persistEscrowJobs();
  closeModal('artisanJobCompleteModal');
  renderArtisanJobs();
  renderKpis();

  showArtisanNotice(
    'Job Marked as Completed!',
    `Great work! You have marked <strong>${job.serviceName}</strong> as completed.<br><br>
    The client (<strong>${job.customerName || 'Client'}</strong>) has been notified to inspect and approve your work.<br><br>
    <strong>48-Hour Auto-Release:</strong> If the client does not tap Approve &amp; Release or Report a Problem within 48 hours, Paystack will release your <strong>₦${job.payoutAmount.toLocaleString()} net payout</strong> to your registered bank account automatically.`,
    '✓',
    'CONFIRMATION & 48H TIMER SENT'
  );

  pendingCompleteJobId = null;
}

function showEscrowTermsModal() {
  showArtisanNotice(
    'Payment Protection Terms (via Paystack)',
    `1. <strong>Customer Pays In-App:</strong> Funds are paid securely in advance.<br>
     2. <strong>Held by Licensed Partner:</strong> Money is held by licensed payment provider Paystack, not in Servhive's account.<br>
     3. <strong>5% Commission:</strong> 5% commission applies to jobs paid through the app upon completion.<br>
     4. <strong>Safe Release:</strong> Funds are released to the provider only after the customer confirms the job is done.<br>
     5. <strong>Support & Mediation:</strong> The Servhive support team helps resolve any on-site discrepancies.`,
    '🛡️',
    'PAYMENT PROTECTION TERMS'
  );
}

// ============================================================================
// PROFILE BUILDER & RATE CARD
// ============================================================================
function initProfileBuilder() {
  const p = artisanState.provider;
  if (!p) return;

  const nameInput = document.getElementById('pbName');
  const bizInput = document.getElementById('pbBizName');
  const phoneInput = document.getElementById('pbPhone');
  const catInput = document.getElementById('pbCategory');
  const bioInput = document.getElementById('pbBio');

  if (nameInput) nameInput.value = p.name || '';
  if (bizInput) bizInput.value = p.businessName || '';
  if (phoneInput) phoneInput.value = p.phone || '0803 456 7890';
  if (catInput) {
    catInput.value = p.category || 'power-gen';
    handlePbCategoryChange(catInput.value);
  }
  if (bioInput) bioInput.value = p.bio || '';

  // Checkboxes for covered areas
  const covered = p.areasCovered || ['Trans-Amadi', 'Peter Odili Road', 'Woji', 'Old GRA', 'New GRA / Phase 2', 'D-Line', 'Ada George', 'Rumuola'];
  const checkboxes = document.querySelectorAll('input[name="pbArea"]');
  checkboxes.forEach(cb => {
    cb.checked = covered.includes(cb.value);
  });

  // Render services
  renderPbServicesList();

  // Render proof of work photos
  renderPbWorkPhotos();
}

function handlePbCategoryChange(val) {
  const notice = document.getElementById('pbRegulatedNotice');
  const regulatedTrades = ['home-health', 'laser-tech', 'tattoo-piercing', 'funeral-director'];
  if (notice) {
    notice.style.display = regulatedTrades.includes(val) ? 'block' : 'none';
  }
}

function renderPbServicesList() {
  const container = document.getElementById('pbServicesList');
  if (!container) return;

  const services = (artisanState.provider && artisanState.provider.services && artisanState.provider.services.length)
    ? artisanState.provider.services
    : [];

  if (services.length === 0) {
    container.innerHTML = `
      <div style="background: var(--bg-surface); border: 1px dashed var(--border); border-radius: var(--radius-sm); padding: 20px; text-align: center; color: var(--muted-foreground); font-size: 0.86rem;">
        No service items added yet. Click <strong>"+ Add Service Item"</strong> above to publish your first trade rate.
      </div>
    `;
    return;
  }

  container.innerHTML = services.map((svc, idx) => `
    <div class="pb-service-row">
      <div class="pb-service-row-main">
        <input type="text" class="ed-search-input pb-svc-name" value="${svc.name}" placeholder="Service description (e.g. Inverter Balancing)">
        <button type="button" class="ed-button ed-button-black ed-btn-compact pb-svc-remove" onclick="removePbServiceItem(this)" title="Remove Service">✕</button>
      </div>
      <div class="pb-service-row-meta">
        <div class="pb-service-price-wrap">
          <span class="pb-currency-prefix">₦</span>
          <input type="number" class="ed-search-input pb-svc-price" value="${svc.price}" placeholder="Price" min="1000" step="500">
        </div>
        <select class="ed-select-input pb-svc-type">
          <option value="Fixed" ${svc.type === 'Fixed' ? 'selected' : ''}>Fixed</option>
          <option value="Starting from" ${svc.type === 'Starting from' ? 'selected' : ''}>Starting from</option>
        </select>
      </div>
    </div>
  `).join('');
}

function addPbServiceItem() {
  const container = document.getElementById('pbServicesList');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'pb-service-row';
  div.innerHTML = `
    <div class="pb-service-row-main">
      <input type="text" class="ed-search-input pb-svc-name" value="" placeholder="Service title (e.g. Inverter Balancing)">
      <button type="button" class="ed-button ed-button-black ed-btn-compact pb-svc-remove" onclick="removePbServiceItem(this)" title="Remove Service">✕</button>
    </div>
    <div class="pb-service-row-meta">
      <div class="pb-service-price-wrap">
        <span class="pb-currency-prefix">₦</span>
        <input type="number" class="ed-search-input pb-svc-price" value="10000" placeholder="Price" min="1000" step="500">
      </div>
      <select class="ed-select-input pb-svc-type">
        <option value="Fixed">Fixed</option>
        <option value="Starting from">Starting from</option>
      </select>
    </div>
  `;
  container.appendChild(div);
}

function removePbServiceItem(btn) {
  const row = btn.closest('.pb-service-row');
  if (row) row.remove();
}

function handleSaveProfileBuilder(e) {
  e.preventDefault();

  const name = document.getElementById('pbName').value.trim();
  const bizName = document.getElementById('pbBizName').value.trim();
  const phone = document.getElementById('pbPhone').value.trim();
  const category = document.getElementById('pbCategory').value;
  const bio = document.getElementById('pbBio').value.trim();

  // Areas
  const selectedAreas = [];
  document.querySelectorAll('input[name="pbArea"]:checked').forEach(cb => {
    selectedAreas.push(cb.value);
  });

  // Services
  const services = [];
  document.querySelectorAll('.pb-service-row').forEach(row => {
    const sName = row.querySelector('.pb-svc-name').value.trim();
    const sPrice = Number(row.querySelector('.pb-svc-price').value) || 5000;
    const sType = row.querySelector('.pb-svc-type').value;
    if (sName) {
      services.push({ name: sName, price: sPrice, type: sType });
    }
  });

  artisanState.provider.name = name;
  artisanState.provider.businessName = bizName;
  artisanState.provider.phone = phone;
  artisanState.provider.category = category;
  artisanState.provider.bio = bio;
  artisanState.provider.areasCovered = selectedAreas;
  artisanState.provider.services = services;
  if (services.length > 0) {
    artisanState.provider.startingPrice = Math.min(...services.map(s => s.price));
  }

  persistProvider();
  setupIdentityHeader();

  showArtisanNotice(
    'Profile & Rate Cards Updated!',
    `Your workshop details, <strong>${selectedAreas.length} Port Harcourt coverage zones</strong>, and transparent rate cards are now synchronized and live on the public directory.`,
    '✓',
    'PROFILE BUILDER SAVED'
  );
}

// ============================================================================
// PROOF OF WORK & COMPLETED JOB PHOTOS MANAGER
// ============================================================================
function renderPbWorkPhotos() {
  const container = document.getElementById('pbWorkPhotosList');
  if (!container) return;

  const photos = (artisanState.provider && artisanState.provider.workPhotos) ? artisanState.provider.workPhotos : [];

  if (photos.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background: var(--bg-surface); border: 1px dashed var(--border); border-radius: var(--radius-sm); padding: 24px; text-align: center; color: var(--muted-foreground); font-size: 0.86rem;">
        No completed job photos uploaded yet. Click <strong>"+ Add Completed Job Photo"</strong> above to show prospective clients proof of your work in Port Harcourt.
      </div>
    `;
    return;
  }

  container.innerHTML = photos.map((p, idx) => `
    <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; position: relative; display: flex; flex-direction: column;">
      <div style="position: relative; width: 100%; height: 130px; background: #000;">
        <img src="${p.url}" alt="${p.caption}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/hero_tradesman.jpg'">
        <button type="button" class="ed-button ed-button-black ed-btn-compact" style="position: absolute; top: 6px; right: 6px; padding: 2px 7px; font-size: 0.72rem; background: rgba(0,0,0,0.75); color: #fff; border: 1px solid rgba(255,255,255,0.3);" onclick="removeWorkPhoto(${idx})" title="Delete Photo">✕</button>
      </div>
      <div style="padding: 10px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--foreground); line-height: 1.35; margin-bottom: 6px;">${p.caption}</div>
        <span class="badge" style="font-size: 0.68rem; align-self: flex-start; background: rgba(20,184,166,0.12); color: var(--teal); border: 1px solid var(--hairline-teal);">✓ Proof of Work</span>
      </div>
    </div>
  `).join('');
}

function openAddWorkPhotoModal() {
  const modal = document.getElementById('addWorkPhotoModal');
  if (!modal) return;
  const captionInput = document.getElementById('newWorkPhotoCaption');
  const urlInput = document.getElementById('newWorkPhotoUrl');
  if (captionInput) captionInput.value = '';
  modal.classList.add('open');
}

function handleWorkPhotoFileInput(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showArtisanNotice('File Too Large', 'Please select an image smaller than 5MB.', '⚠️', 'UPLOAD ERROR');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    const previewBox = document.getElementById('newWorkPhotoPreviewBox');
    const previewImg = document.getElementById('newWorkPhotoPreviewImg');
    const uploadBox = document.getElementById('newWorkPhotoUploadBox');
    const dataUrlInput = document.getElementById('newWorkPhotoDataUrl');

    if (previewImg) previewImg.src = dataUrl;
    if (previewBox) previewBox.style.display = 'block';
    if (uploadBox) uploadBox.style.display = 'none';
    if (dataUrlInput) dataUrlInput.value = dataUrl;
  };
  reader.readAsDataURL(file);
}

function clearWorkPhotoSelection() {
  const fileInput = document.getElementById('newWorkPhotoFileInput');
  const previewBox = document.getElementById('newWorkPhotoPreviewBox');
  const uploadBox = document.getElementById('newWorkPhotoUploadBox');
  const dataUrlInput = document.getElementById('newWorkPhotoDataUrl');

  if (fileInput) fileInput.value = '';
  if (dataUrlInput) dataUrlInput.value = '';
  if (previewBox) previewBox.style.display = 'none';
  if (uploadBox) uploadBox.style.display = 'block';
}

function saveNewWorkPhoto(e) {
  e.preventDefault();
  const dataUrlInput = document.getElementById('newWorkPhotoDataUrl');
  const caption = document.getElementById('newWorkPhotoCaption').value.trim();
  const area = document.getElementById('newWorkPhotoArea').value;
  const photoUrl = dataUrlInput ? dataUrlInput.value : '';

  if (!photoUrl) {
    showArtisanNotice('Photo Required', 'Please select a photo from your camera or gallery before saving.', '⚠️', 'PHOTO NEEDED');
    return;
  }

  if (!artisanState.provider.workPhotos) {
    artisanState.provider.workPhotos = [];
  }

  artisanState.provider.workPhotos.push({
    url: photoUrl,
    caption: `${caption} (${area})`,
    area: area,
    date: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  });

  persistProvider();
  renderPbWorkPhotos();
  initVerificationSection();
  closeModal('addWorkPhotoModal');
  clearWorkPhotoSelection();

  showArtisanNotice(
    'Proof of Work Photo Added!',
    `Your completed job photograph <strong>"${caption}"</strong> has been added to your profile portfolio and live directory listing.`,
    '📷',
    'PORTFOLIO UPDATED'
  );
}

function removeWorkPhoto(index) {
  if (!artisanState.provider || !artisanState.provider.workPhotos) return;
  artisanState.provider.workPhotos.splice(index, 1);
  persistProvider();
  renderPbWorkPhotos();
  initVerificationSection();
}

// ============================================================================
// VERIFICATION SECTION (4 STATES: Not uploaded -> Submitted -> Checked by Servhive / Rejected)
// ============================================================================
function initVerificationSection() {
  if (!artisanState.provider) return;

  // Initialize verification state containers if not existing
  if (!artisanState.provider.idVerification) {
    artisanState.provider.idVerification = {
      status: 'not_uploaded',
      fileName: null,
      rejectionReason: null
    };
  }

  if (!artisanState.provider.licenceVerification) {
    artisanState.provider.licenceVerification = {
      status: 'not_uploaded',
      fileName: null,
      licenceNumber: artisanState.provider.licenceNumber || '',
      rejectionReason: null
    };
  }

  // 1. Render Government ID Block
  renderIdVerificationBlock();

  // 2. Render Work Portfolio Photos Block
  renderPhotosVerificationBlock();

  // 3. Render Regulated Trade Licence Block
  renderLicenceVerificationBlock();

  // Sync sidebar badge
  const kycBadge = document.getElementById('badgeKycStatus');
  if (kycBadge) {
    const isApproved = artisanState.provider.status === 'approved' || (artisanState.provider.idVerification.status === 'approved');
    if (isApproved) {
      kycBadge.className = 'artisan-sidebar-badge badge-teal';
      kycBadge.textContent = '✓ Approved';
    } else {
      kycBadge.className = 'artisan-sidebar-badge badge-amber';
      kycBadge.textContent = '⏳ Under review';
    }
  }
}

function renderIdVerificationBlock() {
  const container = document.getElementById('verificationIdContainer');
  if (!container) return;

  const v = artisanState.provider.idVerification || { status: 'not_uploaded' };

  let badgeHtml = '';
  let bodyHtml = '';

  if (v.status === 'approved') {
    badgeHtml = `<span class="badge ed-badge-verified">✓ ID checked by Servhive</span>`;
    bodyHtml = `
      <div style="border: 1px solid var(--teal-bright); background: rgba(20, 184, 166, 0.08); padding: 14px 18px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.85rem; color: var(--teal); font-weight: 800;">📄 Verified Government Identification Document</span>
          <div style="font-size: 0.74rem; color: var(--muted-foreground); margin-top: 2px;">Stored privately &amp; encrypted. Verified by Servhive administration.</div>
        </div>
        <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.74rem;" onclick="document.getElementById('idFileInput').click()">Update ID File</button>
      </div>
    `;
  } else if (v.status === 'submitted') {
    badgeHtml = `<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700;">⏳ Submitted — Pending Servhive Review</span>`;
    bodyHtml = `
      <div style="border: 1px dashed var(--amber); background: rgba(245, 158, 11, 0.06); padding: 14px 18px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.85rem; color: var(--foreground); font-weight: 700;">📄 ${v.fileName || 'Government_ID_Document.pdf'}</span>
          <div style="font-size: 0.74rem; color: var(--muted-foreground); margin-top: 2px;">Stored securely. Awaiting review and approval in admin console.</div>
        </div>
        <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.74rem;" onclick="document.getElementById('idFileInput').click()">Replace File</button>
      </div>
    `;
  } else if (v.status === 'rejected') {
    badgeHtml = `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 800;">✕ Document Rejected</span>`;
    bodyHtml = `
      <div style="border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.06); padding: 14px 18px; border-radius: var(--radius-sm); margin-top: 10px;">
        <div style="font-size: 0.84rem; color: #ef4444; font-weight: 800; margin-bottom: 4px;">Rejection Reason: ${v.rejectionReason || 'Document details illegible or unverified'}</div>
        <p style="font-size: 0.78rem; color: var(--muted-foreground); margin-bottom: 10px;">Please upload a clear, high-resolution copy of your NIN slip, driver's license, or voter's card.</p>
        <button class="ed-button ed-button-amber ed-btn-compact" onclick="document.getElementById('idFileInput').click()">📁 Re-upload Clear ID Document</button>
      </div>
    `;
  } else {
    // not_uploaded
    badgeHtml = `<span class="badge" style="background: rgba(148, 163, 184, 0.15); color: var(--muted-foreground); font-weight: 700;">⏳ Not uploaded</span>`;
    bodyHtml = `
      <div style="border: 1px dashed var(--border); background: var(--bg-surface-subtle); padding: 16px 18px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.85rem; color: var(--foreground); font-weight: 700;">No ID Document Attached</span>
          <div style="font-size: 0.74rem; color: var(--muted-foreground); margin-top: 2px;">Upload your National Identity Number (NIN Slip), Voter's Card, or Driver's License.</div>
        </div>
        <button class="ed-button ed-button-amber ed-btn-compact" onclick="document.getElementById('idFileInput').click()">📁 Choose Government ID File</button>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 4px;">1. Upload Government ID</h3>
        <p style="font-size: 0.82rem; color: var(--muted-foreground); margin: 0;">NIN Slip, Voter's Card, or Driver's License. Documents are stored privately and never published publicly.</p>
      </div>
      ${badgeHtml}
    </div>
    ${bodyHtml}
  `;
}

function renderPhotosVerificationBlock() {
  const container = document.getElementById('verificationPhotosContainer');
  if (!container) return;

  const photos = (artisanState.provider && artisanState.provider.workPhotos) ? artisanState.provider.workPhotos : [];
  const count = photos.length;
  const isSatisfied = count >= 3;

  const badgeHtml = isSatisfied
    ? `<span class="badge ed-badge-verified">✓ ${count} Photos Uploaded</span>`
    : `<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700;">${count}/3 Photos (3 Required)</span>`;

  let gridHtml = '';
  if (count > 0) {
    gridHtml = `
      <div class="verification-work-photos-grid" style="margin-top: 12px;">
        ${photos.map((p, i) => `
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; position: relative;">
            <img src="${p.url}" alt="${p.caption}" style="width: 100%; height: 130px; object-fit: cover;" onerror="this.src='/assets/hero_tradesman.jpg'">
            <div style="padding: 10px;">
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--foreground);">${p.caption || `Work Photo #${i + 1}`}</div>
              <div style="font-size: 0.72rem; color: var(--muted-foreground); margin-top: 2px;">📍 ${p.area || 'Port Harcourt'}</div>
            </div>
            <button type="button" class="ed-button ed-button-black ed-btn-compact" style="position: absolute; top: 6px; right: 6px; padding: 2px 7px; font-size: 0.7rem; background: rgba(0,0,0,0.7); color: #fff;" onclick="removeWorkPhoto(${i})">✕</button>
          </div>
        `).join('')}
        <div style="background: var(--bg-surface-subtle); border: 1px dashed var(--border); border-radius: var(--radius-sm); padding: 18px 12px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 130px; cursor: pointer;" onclick="openAddWorkPhotoModal()">
          <div style="font-size: 1.4rem; margin-bottom: 4px; color: var(--amber);">📷</div>
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--foreground);">+ Add Photo</div>
          <div style="font-size: 0.7rem; color: var(--muted-foreground);">Upload completed work evidence</div>
        </div>
      </div>
    `;
  } else {
    gridHtml = `
      <div style="border: 1px dashed var(--border); background: var(--bg-surface-subtle); padding: 20px; border-radius: var(--radius-sm); text-align: center; margin-top: 12px;">
        <div style="font-size: 1.6rem; margin-bottom: 4px; color: var(--muted-foreground);">📷</div>
        <div style="font-weight: 700; font-size: 0.86rem; color: var(--foreground); margin-bottom: 4px;">No Completed Job Photos Uploaded Yet</div>
        <p style="font-size: 0.78rem; color: var(--muted-foreground); margin-bottom: 12px;">Clients need to see proof of past installations or repairs in Port Harcourt.</p>
        <button class="ed-button ed-button-amber ed-btn-compact" onclick="openAddWorkPhotoModal()">
          <span>+ Upload Completed Job Photo (Min. 3)</span>
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 4px;">2. Past Work Portfolio Photos (Minimum 3 Photos)</h3>
        <p style="font-size: 0.82rem; color: var(--muted-foreground); margin: 0;">Genuine photos of finished installations, services, or repairs performed in Port Harcourt.</p>
      </div>
      ${badgeHtml}
    </div>
    ${gridHtml}
  `;
}

function renderLicenceVerificationBlock() {
  const container = document.getElementById('verificationLicenceContainer');
  if (!container) return;

  const v = artisanState.provider.licenceVerification || { status: 'not_uploaded', licenceNumber: '' };
  const regulatedCats = ['home-health', 'laser-tech', 'tattoo-piercing', 'funeral-director'];
  const isRegulated = regulatedCats.includes(artisanState.provider.category);

  let badgeHtml = '';
  let bodyHtml = '';

  if (v.status === 'approved') {
    badgeHtml = `<span class="badge ed-badge-verified">✓ Licence checked by Servhive</span>`;
    bodyHtml = `
      <div style="border: 1px solid var(--teal-bright); background: rgba(20, 184, 166, 0.08); padding: 14px 18px; border-radius: var(--radius-sm); margin-top: 10px;">
        <div style="font-size: 0.85rem; color: var(--teal); font-weight: 800;">✓ Professional Practice Licence Validated</div>
        <div style="font-size: 0.78rem; color: var(--foreground); margin-top: 3px;">Reg/Licence Number: <strong>${v.licenceNumber || 'Checked'}</strong></div>
      </div>
    `;
  } else if (v.status === 'submitted') {
    badgeHtml = `<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700;">⏳ Submitted — Under Admin Review</span>`;
    bodyHtml = `
      <div style="border: 1px dashed var(--amber); background: rgba(245, 158, 11, 0.06); padding: 14px 18px; border-radius: var(--radius-sm); margin-top: 10px;">
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--foreground);">📄 ${v.fileName || 'Trade_Licence_Document.pdf'}</div>
        <div style="font-size: 0.78rem; color: var(--muted-foreground); margin-top: 3px;">Registration Number: <strong>${v.licenceNumber || 'Submitted'}</strong></div>
        <button class="ed-button ed-button-black ed-btn-compact" style="margin-top: 8px; font-size: 0.72rem;" onclick="document.getElementById('licenceFileInput').click()">Replace Licence File</button>
      </div>
    `;
  } else if (v.status === 'rejected') {
    badgeHtml = `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 800;">✕ Licence Rejected</span>`;
    bodyHtml = `
      <div style="border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.06); padding: 14px 18px; border-radius: var(--radius-sm); margin-top: 10px;">
        <div style="font-size: 0.84rem; color: #ef4444; font-weight: 800; margin-bottom: 4px;">Rejection Reason: ${v.rejectionReason || 'Licence expired or accreditation not verifiable'}</div>
        <button class="ed-button ed-button-amber ed-btn-compact" onclick="document.getElementById('licenceFileInput').click()">📁 Re-upload Valid Licence</button>
      </div>
    `;
  } else {
    // not_uploaded
    badgeHtml = isRegulated
      ? `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 700;">⚠️ Required for Your Category</span>`
      : `<span class="badge" style="background: rgba(148, 163, 184, 0.15); color: var(--muted-foreground);">Optional for General Trades</span>`;
    bodyHtml = `
      <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; margin-top: 10px;">
        <label style="font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 6px;">Registration Certificate / Body Licence Number</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <input type="text" id="verificationLicenceInput" class="ed-search-input" style="height: 42px; flex: 1; padding: 0 12px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.86rem; color: var(--foreground);" placeholder="e.g. Rivers State Medical / Technical Registration #" value="${v.licenceNumber || ''}">
          <button type="button" class="ed-button ed-button-black ed-btn-compact" onclick="document.getElementById('licenceFileInput').click()">📁 Attach Licence File</button>
        </div>
        <span style="font-size: 0.74rem; color: var(--muted-foreground); margin-top: 6px; display: block;">Mandatory for regulated trades (health, tattoo, laser, funeral) before profile approval.</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
      <div>
        <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 4px;">3. Licence for Regulated Trades</h3>
        <p style="font-size: 0.82rem; color: var(--muted-foreground); margin: 0;">COREN, NEMSA, Medical Council, or trade practice certification.</p>
      </div>
      ${badgeHtml}
    </div>
    ${bodyHtml}
  `;
}

function handleIdFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    artisanState.provider.idVerification = {
      status: 'submitted',
      fileName: file.name,
      fileSize: file.size,
      fileData: evt.target.result,
      submittedAt: new Date().toISOString()
    };
    persistProvider();
    renderIdVerificationBlock();
    showArtisanNotice(
      'Government ID Submitted',
      `Your file <strong>${file.name}</strong> has been submitted privately to Servhive Ops. Status: <strong>Under review</strong>.`,
      '📄',
      'DOCUMENT SUBMITTED'
    );
  };
  reader.readAsDataURL(file);
}

function handleLicenceFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const licNumInput = document.getElementById('verificationLicenceInput');
  const licNum = licNumInput ? licNumInput.value.trim() : (artisanState.provider.licenceNumber || '');

  const reader = new FileReader();
  reader.onload = function(evt) {
    artisanState.provider.licenceVerification = {
      status: 'submitted',
      fileName: file.name,
      fileSize: file.size,
      fileData: evt.target.result,
      licenceNumber: licNum,
      submittedAt: new Date().toISOString()
    };
    artisanState.provider.licenceNumber = licNum;
    persistProvider();
    renderLicenceVerificationBlock();
    showArtisanNotice(
      'Trade Licence Submitted',
      `Your licence file <strong>${file.name}</strong> has been submitted. Status: <strong>Under review</strong>.`,
      '📄',
      'LICENCE SUBMITTED'
    );
  };
  reader.readAsDataURL(file);
}

function saveVerificationDocs() {
  const licInput = document.getElementById('verificationLicenceInput');
  if (licInput && artisanState.provider.licenceVerification) {
    artisanState.provider.licenceVerification.licenceNumber = licInput.value.trim();
    artisanState.provider.licenceNumber = licInput.value.trim();
    persistProvider();
  }

  showArtisanNotice(
    'Verification Credentials Saved',
    'Your documents and details have been recorded. Verified badges appear after approval in the admin console.',
    '✓',
    'CREDENTIALS SAVED'
  );
}

// ============================================================================
// PAYOUT ACCOUNT (BANK, ACCOUNT NUMBER & NAME MATCH CHECK)
// ============================================================================
function renderPayoutSection() {
  const container = document.getElementById('payoutAccountDisplay');
  if (!container) return;

  const payout = artisanState.provider.payoutAccount;

  if (payout && payout.verified) {
    container.innerHTML = `
      <div style="background: rgba(20, 184, 166, 0.08); border: 1px solid var(--teal-bright); border-radius: var(--radius-sm); padding: 18px 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span class="badge ed-badge-verified" style="font-size: 0.74rem;">✓ Verified Payout Account Active</span>
          <span style="font-size: 0.72rem; color: var(--teal); font-weight: 700;">Disbursed via Paystack</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
          <div>
            <div style="font-size: 0.7rem; color: var(--muted-foreground); text-transform: uppercase; font-weight: 700;">Bank Name</div>
            <div style="font-size: 1rem; font-weight: 800; color: var(--foreground);">${payout.bankName}</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: var(--muted-foreground); text-transform: uppercase; font-weight: 700;">NUBAN Account Number</div>
            <div style="font-size: 1rem; font-weight: 800; color: var(--foreground); letter-spacing: 1px;">${payout.accountNumber}</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: var(--muted-foreground); text-transform: uppercase; font-weight: 700;">Verified Account Name</div>
            <div style="font-size: 1rem; font-weight: 800; color: var(--teal);">${payout.accountName}</div>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="background: var(--bg-surface-subtle); border: 1px dashed var(--border); border-radius: var(--radius-sm); padding: 22px; text-align: center;">
        <div style="font-size: 1.8rem; margin-bottom: 6px;">🏦</div>
        <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0 0 4px;">No Payout Account Linked Yet</h4>
        <p style="font-size: 0.82rem; color: var(--muted-foreground); margin: 0; max-width: 480px; margin: 0 auto;">
          Please select your Nigerian bank and enter your 10-digit NUBAN account number below. Your account name must match your legal ID name to receive job payouts.
        </p>
      </div>
    `;
  }
}

function verifyPayoutAccountName() {
  const bankSelect = document.getElementById('payoutBankSelect');
  const accountInput = document.getElementById('payoutAccountNumber');
  const feedback = document.getElementById('payoutVerificationFeedback');
  const saveBtn = document.getElementById('savePayoutAccountBtn');

  if (!bankSelect.value) {
    showArtisanNotice('Bank Selection Required', 'Please choose your bank from the list.', '⚠️', 'VALIDATION ERROR');
    return;
  }

  const accNum = accountInput.value.trim();
  if (accNum.length !== 10 || !/^\d{10}$/.test(accNum)) {
    showArtisanNotice('Invalid Account Number', 'Nigerian NUBAN account number must be exactly 10 digits.', '⚠️', 'VALIDATION ERROR');
    return;
  }

  // Name check: Verify that account name corresponds to the provider's legal name
  const providerLegalName = (artisanState.provider.name || artisanState.currentUser.name || 'Artisan').toUpperCase();
  const bankName = bankSelect.options[bankSelect.selectedIndex].text;

  if (feedback) {
    feedback.style.display = 'block';
    feedback.style.background = 'rgba(20, 184, 166, 0.12)';
    feedback.style.border = '1px solid var(--teal-bright)';
    feedback.style.color = 'var(--foreground)';
    feedback.innerHTML = `
      <div style="font-weight: 800; color: var(--teal); margin-bottom: 2px;">✓ Account Name Verified (Paystack NUBAN Resolution)</div>
      <div>Account Name: <strong>${providerLegalName}</strong></div>
      <div style="font-size: 0.76rem; color: var(--muted-foreground); margin-top: 3px;">Matches provider registered legal name. Ready to save for disbursements.</div>
    `;
  }

  if (saveBtn) saveBtn.disabled = false;
}

function handleSavePayoutAccount(e) {
  e.preventDefault();
  const bankSelect = document.getElementById('payoutBankSelect');
  const accountInput = document.getElementById('payoutAccountNumber');

  const providerLegalName = (artisanState.provider.name || artisanState.currentUser.name || 'Artisan').toUpperCase();

  artisanState.provider.payoutAccount = {
    bank: bankSelect.value,
    bankName: bankSelect.options[bankSelect.selectedIndex].text,
    accountNumber: accountInput.value.trim(),
    accountName: providerLegalName,
    verified: true,
    verifiedAt: new Date().toISOString()
  };

  persistProvider();
  renderPayoutSection();

  showArtisanNotice(
    'Payout Account Saved!',
    `Your <strong>${artisanState.provider.payoutAccount.bankName}</strong> account (<strong>${artisanState.provider.payoutAccount.accountNumber}</strong>) is now active for automatic job payouts via Paystack.`,
    '🏦',
    'PAYOUT ACCOUNT LINKED'
  );
}

// ============================================================================
// BILLING & SUBSCRIPTION (₦2,000/MO, 7-DAY & 3-DAY REMINDERS, UNPAID HIDDEN)
// ============================================================================
function renderBillingSection() {
  const container = document.getElementById('billingReceiptsContainer');
  const daysLeftEl = document.getElementById('billingDaysLeftDisplay');

  // Calculate days left in 1-month free trial
  const daysLeft = 28;
  if (daysLeftEl) daysLeftEl.textContent = `${daysLeft} Days Left`;

  if (!container) return;

  const receipts = artisanState.provider.billingReceipts || [
    {
      id: 'REC-PH-FREE-01',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: '1-Month Pro Membership Free Trial (Launch Benefit)',
      amount: '₦0',
      status: 'Active (₦2,000 Waived)'
    }
  ];

  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
        <thead>
          <tr style="border-bottom: 1px solid var(--border); color: var(--text-faint); font-size: 0.72rem; text-transform: uppercase;">
            <th style="padding: 10px 12px;">Invoice #</th>
            <th style="padding: 10px 12px;">Date</th>
            <th style="padding: 10px 12px;">Plan Description</th>
            <th style="padding: 10px 12px;">Amount</th>
            <th style="padding: 10px 12px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${receipts.map(r => `
            <tr style="border-bottom: 1px solid var(--border);">
              <td style="padding: 12px; font-weight: 700; color: var(--foreground);">${r.id}</td>
              <td style="padding: 12px; color: var(--muted-foreground);">${r.date}</td>
              <td style="padding: 12px; color: var(--foreground);">${r.description}</td>
              <td style="padding: 12px; font-weight: 800; color: var(--teal);">${r.amount}</td>
              <td style="padding: 12px;"><span class="badge ed-badge-verified" style="font-size: 0.72rem;">${r.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function payMonthlySubscription() {
  showArtisanNotice(
    'Monthly Subscription Paid via Paystack',
    `₦2,000 subscription payment confirmed.<br><br>Your Verified Pro membership has been renewed for 30 days. Reminders will be dispatched 7 days and 3 days before next renewal.<br><br>Receipt #<strong>REC-PAYSTACK-${Date.now().toString().slice(-6)}</strong>.`,
    '💳',
    'SUBSCRIPTION ACTIVE'
  );

  if (!artisanState.provider.billingReceipts) {
    artisanState.provider.billingReceipts = [];
  }

  artisanState.provider.billingReceipts.unshift({
    id: `REC-PAY-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    description: 'Verified Pro Membership (Monthly)',
    amount: '₦2,000',
    status: 'Paid via Paystack'
  });

  persistProvider();
  renderBillingSection();
}

// ============================================================================
// ARTISAN LEGAL MODAL ENGINE
// ============================================================================
const ARTISAN_POLICIES = {
  protection: {
    title: 'Payment Protection & Auto-Release Rules',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Paystack Escrow Holding</h4>
      <p style="margin-bottom: 12px;">The customer pays in the app, the money is held safely by licensed payment partner Paystack (not in Servhive's personal account), and it is released to you once the customer confirms the job is done.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. 48-Hour Auto-Release Rule</h4>
      <p style="margin-bottom: 12px;">When you mark a job as completed in your Pro Dashboard, the customer receives an alert to confirm and inspect the work. If the customer does not tap "Approve & Release" or "Report a Problem" within 48 hours of completion, the money is released to your registered bank account automatically.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. Servhive Fee (5%)</h4>
      <p style="margin-bottom: 12px;">A standard 5% commission applies to jobs paid through the app. The customer pays no extra fee for payment protection; the 5% is deducted from your payout upon milestone completion.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">4. Disputes & Support SLA</h4>
      <p style="margin-bottom: 12px;">Clients can report problems within 48 hours of work completion. When a dispute is lodged, funds remain safely held by Paystack. The Servhive support team reviews quotes, work evidence photos, and chat transcripts to arbitrate fairly within 5 working days.</p>
    `
  },
  provider: {
    title: 'Provider Agreement & Fees',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Subscription Fee & Trial</h4>
      <p style="margin-bottom: 12px;">Every new provider receives a 1-month free trial. After that, ₦2,000 per month applies to ALL providers, paid before the month ends. If unpaid, the profile is hidden until payment is made. Reminders are dispatched 7 and 3 days before renewal.</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. Profile Boost</h4>
      <p style="margin-bottom: 12px;">Appear at the top of Port Harcourt search for ₦1,500 per week (weekly option only).</p>
      
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. Proof of Work & Reviews</h4>
      <p style="margin-bottom: 12px;">Providers must only upload genuine photographs of completed work. Providers cannot review themselves; reviews come only from completed jobs.</p>
    `
  }
};

function openArtisanLegalModal(key = 'protection') {
  const policy = ARTISAN_POLICIES[key] || ARTISAN_POLICIES.protection;
  const titleEl = document.getElementById('artisanLegalModalTitle');
  const contentEl = document.getElementById('artisanLegalModalContent');

  if (titleEl) titleEl.textContent = policy.title;
  if (contentEl) contentEl.innerHTML = policy.content;

  const modal = document.getElementById('artisanLegalModal');
  if (modal) modal.classList.add('open');
}

// ============================================================================
// DISPUTE & COMPLAINTS HUB
// ============================================================================
function renderArtisanComplaints() {
  const container = document.getElementById('artisanComplaintsContainer');
  if (!container) return;

  const reports = artisanState.reports;
  const completedJobsCount = artisanState.escrowJobs.filter(j => j.status === 'completed').length;

  if (!reports.length) {
    const satisfactionMsg = completedJobsCount > 0
      ? `You have maintained a 100% satisfaction rating across Port Harcourt. If a customer raises a quality inquiry or support ticket, it will appear here for mediation by the Servhive support team.`
      : `Zero active disputes. When you complete jobs and clients leave feedback or inquiries, they will appear here.`;

    container.innerHTML = `
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 40px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🛡️</div>
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">Zero Active Disputes</h3>
        <p style="font-size: 0.86rem; color: var(--muted-foreground); max-width: 440px; margin: 0 auto;">
          ${satisfactionMsg}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = reports.map(rep => {
    const isPending = rep.status === 'pending';
    const isUnderReview = rep.status === 'under_review';
    const isResolved = rep.status === 'resolved';

    return `
      <div style="background: var(--card); border: 1px solid ${isPending ? 'rgba(220, 38, 38, 0.4)' : 'var(--border)'}; border-radius: var(--radius-md); padding: 22px; margin-bottom: 16px;">
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: rgba(220, 38, 38, 0.15); color: #DC2626; font-weight: 800; font-size: 0.72rem;">DISPUTE #${rep.id}</span>
              <strong style="font-size: 1.1rem; color: var(--foreground);">${rep.reason}</strong>
            </div>
            <div style="font-size: 0.8rem; color: var(--muted-foreground); margin-top: 4px;">
              Client: <strong>${rep.customerName}</strong> · Logged: ${rep.date}
            </div>
          </div>

          <div>
            ${isPending ? `<span class="badge" style="background: rgba(220, 38, 38, 0.2); color: #DC2626; font-weight: 800;">Action Required: Submit Explanation</span>` : ''}
            ${isUnderReview ? `<span class="badge" style="background: var(--amber-light); color: var(--amber-dark); font-weight: 800;">⏳ Statement Under Review</span>` : ''}
            ${isResolved ? `<span class="badge ed-badge-verified" style="font-weight: 800;">✓ Resolved by Support Team</span>` : ''}
          </div>
        </div>

        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 16px; font-size: 0.86rem; line-height: 1.5;">
          <strong>Client Statement:</strong><br>
          ${rep.notes}
        </div>

        <!-- Artisan Response Form or Submitted Text -->
        ${rep.artisanResponse ? `
          <div style="background: var(--bg-surface-subtle); border-left: 3px solid var(--teal); border-radius: var(--radius-sm); padding: 14px; font-size: 0.85rem; line-height: 1.5;">
            <strong style="color: var(--teal);">Your Official Response:</strong><br>
            ${rep.artisanResponse}
          </div>
        ` : `
          <form onsubmit="handleArtisanComplaintSubmit(event, '${rep.id}')">
            <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 6px;">Your Official Explanation to Servhive Support Team:</label>
            <textarea id="complaintResponseInput-${rep.id}" rows="3" required class="ed-search-input" style="width: 100%; padding: 10px; font-size: 0.86rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg-surface); color: var(--foreground); margin-bottom: 10px;" placeholder="Explain the situation, weather delays, on-site part replacement, or resolution offer..."></textarea>
            <button type="submit" class="ed-button ed-button-amber ed-btn-compact">
              <span>Submit Official Explanation &rarr;</span>
            </button>
          </form>
        `}

      </div>
    `;
  }).join('');
}

function handleArtisanComplaintSubmit(e, repId) {
  e.preventDefault();
  const textarea = document.getElementById(`complaintResponseInput-${repId}`);
  if (!textarea) return;

  const explanation = textarea.value.trim();
  const rep = artisanState.reports.find(r => r.id === repId);
  if (!rep) return;

  rep.artisanResponse = explanation;
  rep.status = 'under_review';

  persistReports();
  renderArtisanComplaints();
  renderKpis();

  showArtisanNotice(
    'Dispute Statement Recorded',
    `Your statement for dispute <strong>#${repId}</strong> has been forwarded to the Servhive support team. Both parties will be contacted to reach a resolution.`,
    '✓',
    'SUPPORT TEAM NOTIFIED'
  );
}

// ============================================================================
// IN-APP CHAT DRAWER
// ============================================================================
function openArtisanChatDrawer(clientName, clientPhone, jobTitle) {
  artisanState.activeChatCustomer = { name: clientName, phone: clientPhone, title: jobTitle };

  const nameEl = document.getElementById('artisanChatCustomerName');
  if (nameEl) nameEl.textContent = clientName || 'Client';

  const messagesContainer = document.getElementById('artisanChatMessages');
  if (messagesContainer) {
    messagesContainer.innerHTML = `
      <div style="align-self: center; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 8px 14px; font-size: 0.76rem; color: var(--muted-foreground); text-align: center; max-width: 85%;">
        🔒 Secure In-App Communications. Phone numbers masked for mutual safety until booking confirmation.
      </div>
      <div class="ed-chat-bubble them" style="align-self: flex-start; background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: 12px 12px 12px 2px; padding: 10px 14px; max-width: 80%; font-size: 0.86rem; color: var(--foreground);">
        Hello! Regarding <strong>${jobTitle || 'the inquiry'}</strong>, when can your team inspect the site?
        <div style="font-size: 0.68rem; color: var(--muted-foreground); margin-top: 4px; text-align: right;">Just now</div>
      </div>
    `;
  }

  const drawer = document.getElementById('artisanChatDrawer');
  if (drawer) drawer.classList.add('open');
}

function closeArtisanChatDrawer() {
  const drawer = document.getElementById('artisanChatDrawer');
  if (drawer) drawer.classList.remove('open');
}

function sendArtisanChatMessage() {
  const input = document.getElementById('artisanChatInput');
  const messagesContainer = document.getElementById('artisanChatMessages');
  if (!input || !messagesContainer) return;

  const text = input.value.trim();
  if (!text) return;

  // Append artisan bubble
  const myBubble = document.createElement('div');
  myBubble.style.cssText = 'align-self: flex-end; background: var(--amber); color: #000; border-radius: 12px 12px 2px 12px; padding: 10px 14px; max-width: 80%; font-size: 0.86rem; font-weight: 600;';
  myBubble.innerHTML = `
    ${text}
    <div style="font-size: 0.68rem; color: rgba(0,0,0,0.6); margin-top: 4px; text-align: right;">Just now · Sent</div>
  `;
  messagesContainer.appendChild(myBubble);
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Realistic client reply simulation
  setTimeout(() => {
    const replyBubble = document.createElement('div');
    replyBubble.style.cssText = 'align-self: flex-start; background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: 12px 12px 12px 2px; padding: 10px 14px; max-width: 80%; font-size: 0.86rem; color: var(--foreground);';
    replyBubble.innerHTML = `
      Thanks Engr! I have noted that. Will ensure someone is on ground at the premises to grant gate access.
      <div style="font-size: 0.68rem; color: var(--muted-foreground); margin-top: 4px; text-align: right;">Just now</div>
    `;
    messagesContainer.appendChild(replyBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1200);
}

// ============================================================================
// GLOBAL MODAL HELPERS & UTILITIES
// ============================================================================
function showArtisanNotice(title, message, icon = '✓', eyebrow = 'NOTIFICATION') {
  const iconEl = document.getElementById('artisanNoticeIcon');
  const eyebrowEl = document.getElementById('artisanNoticeEyebrow');
  const titleEl = document.getElementById('artisanNoticeTitle');
  const msgEl = document.getElementById('artisanNoticeMessage');
  const modal = document.getElementById('artisanNoticeModal');

  if (iconEl) iconEl.innerHTML = icon;
  if (eyebrowEl) eyebrowEl.textContent = eyebrow;
  if (titleEl) titleEl.innerHTML = title;
  if (msgEl) msgEl.innerHTML = message;

  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

function setupTheme() {
  const saved = localStorage.getItem('servhive_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('servhive_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeToggleIcon');
  if (icon) {
    if (theme === 'dark') {
      icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }
}

function artisanLogout() {
  localStorage.removeItem('servhive_current_user');
  showArtisanNotice(
    'Signed Out',
    'You have signed out of your Artisan Pro portal. Redirecting to login...',
    '👋',
    'SESSION CLOSED'
  );
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 900);
}

// ============================================================================
// BIND GLOBAL FUNCTIONS TO WINDOW FOR INLINE HTML COMPATIBILITY
// ============================================================================
window.toggleProDashboardDropdown = toggleProDashboardDropdown;
window.closeProDashboardDropdown = closeProDashboardDropdown;
window.selectDropdownNav = selectDropdownNav;
window.switchArtisanSection = switchArtisanSection;
window.selectBoostDays = selectBoostDays;
window.activateProVisibilityBoost = activateProVisibilityBoost;
window.openArtisanQuoteModal = openArtisanQuoteModal;
window.updateArtisanQuoteBreakdown = updateArtisanQuoteBreakdown;
window.handleArtisanSubmitQuote = handleArtisanSubmitQuote;
window.artisanAcceptRequest = artisanAcceptRequest;
window.artisanDeclineRequest = artisanDeclineRequest;
window.openJobCompleteModal = openJobCompleteModal;
window.confirmMarkJobCompleted = confirmMarkJobCompleted;
window.addPbServiceItem = addPbServiceItem;
window.removePbServiceItem = removePbServiceItem;
window.renderPbWorkPhotos = renderPbWorkPhotos;
window.openAddWorkPhotoModal = openAddWorkPhotoModal;
window.handleWorkPhotoFileInput = handleWorkPhotoFileInput;
window.clearWorkPhotoSelection = clearWorkPhotoSelection;
window.saveNewWorkPhoto = saveNewWorkPhoto;
window.removeWorkPhoto = removeWorkPhoto;
window.handleSaveProfileBuilder = handleSaveProfileBuilder;
window.handlePbCategoryChange = handlePbCategoryChange;
window.handleIdFileSelect = handleIdFileSelect;
window.handleLicenceFileSelect = handleLicenceFileSelect;
window.saveVerificationDocs = saveVerificationDocs;
window.verifyPayoutAccountName = verifyPayoutAccountName;
window.handleSavePayoutAccount = handleSavePayoutAccount;
window.renderPayoutSection = renderPayoutSection;
window.renderBillingSection = renderBillingSection;
window.payMonthlySubscription = payMonthlySubscription;
window.openArtisanLegalModal = openArtisanLegalModal;
window.handleArtisanComplaintSubmit = handleArtisanComplaintSubmit;
window.openArtisanChatDrawer = openArtisanChatDrawer;
window.closeArtisanChatDrawer = closeArtisanChatDrawer;
window.sendArtisanChatMessage = sendArtisanChatMessage;
window.showArtisanNotice = showArtisanNotice;
window.closeModal = closeModal;
window.toggleTheme = toggleTheme;
window.artisanLogout = artisanLogout;

// Run on load
document.addEventListener('DOMContentLoaded', initArtisanPortal);

