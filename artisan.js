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
    rating: 5.0,
    reviewCount: 0,
    verified: false,
    boosted: false,
    boostDays: 0,
    boostExpires: null,
    status: 'approved',
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
    'Engr. Emeka Obi', 'Blessing Amadi', 'Tamuno George', 'Chidi Okonkwo',
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

  // If not logged in as artisan, attempt to check registered users
  if (!artisanState.currentUser || artisanState.currentUser.role !== 'artisan') {
    try {
      const allUsers = JSON.parse(localStorage.getItem('servhive_users')) || [];
      const realArtisan = allUsers.find(u => u.role === 'artisan' && !dummyNames.has(u.name));
      if (realArtisan) {
        artisanState.currentUser = realArtisan;
        localStorage.setItem('servhive_current_user', JSON.stringify(realArtisan));
      } else {
        // Redirect unauthenticated user to artisan login
        window.location.href = '/login.html#login-artisan';
        return false;
      }
    } catch (e) {
      window.location.href = '/login.html#login-artisan';
      return false;
    }
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
// HEADER & IDENTITY
// ============================================================================
function setupIdentityHeader() {
  const bizEl = document.getElementById('artisanHeaderBizName');
  const nameEl = document.getElementById('artisanHeaderName');
  const avatarEl = document.getElementById('artisanAvatar');
  const welcomeTitle = document.getElementById('proHomeWelcomeTitle');

  if (bizEl && artisanState.provider) {
    bizEl.textContent = artisanState.provider.businessName || 'Master Workshop Services';
  }
  if (nameEl && artisanState.provider) {
    const rawName = artisanState.provider.name || 'Verified Craftsman';
    const cleanName = rawName.replace(/\s*\(Pro\)/gi, '').replace(/\s+/g, ' ').trim();
    nameEl.textContent = cleanName;
  }
  if (welcomeTitle && artisanState.provider) {
    const rawName = artisanState.provider.name || 'Craftsman';
    const cleanName = rawName.replace(/\s*\(Pro\)/gi, '').replace(/\s+/g, ' ').trim();
    welcomeTitle.textContent = `Welcome Back, ${cleanName}`;
  }
  if (avatarEl && artisanState.provider && artisanState.provider.image) {
    avatarEl.src = artisanState.provider.image;
  }
}

// ============================================================================
// SECTION NAVIGATION & HASH ROUTING
// ============================================================================
const VALID_SECTIONS = ['home', 'requests', 'jobs', 'profile', 'verification', 'complaints'];

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
  const activeReqsVal = document.getElementById('proHomeActiveReqsVal');
  const badgeReqs = document.getElementById('badgeRequestsCount');

  // Count requests needing attention
  const activeCount = artisanState.quoteRequests.filter(r => r.status === 'pending' || r.status === 'quoted').length;
  if (activeReqsVal) activeReqsVal.textContent = activeCount;
  if (badgeReqs) badgeReqs.textContent = activeCount;

  // Active jobs count & Escrow balance
  renderEscrowBalance();

  // Complaints count
  const complaintsCount = artisanState.reports.filter(r => r.status !== 'resolved').length;
  const badgeComplaints = document.getElementById('badgeComplaintsCount');
  if (badgeComplaints) badgeComplaints.textContent = complaintsCount;

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
        No pending inquiries. Your profile is active and ready for client bookings.
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
  artisanState.selectedBoostDays = Number(days);

  [1, 3, 7, 14].forEach(d => {
    const chip = document.getElementById(`boostChip-${d}`);
    if (chip) {
      if (d === artisanState.selectedBoostDays) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    }
  });

  const totalCost = artisanState.selectedBoostDays * 500;
  const btn = document.getElementById('activateBoostBtn');
  if (btn) {
    btn.innerHTML = `<span>⚡ Activate Visibility Boost (${artisanState.selectedBoostDays} Day${artisanState.selectedBoostDays > 1 ? 's' : ''} · ₦${totalCost.toLocaleString()})</span>`;
  }
}

function activateProVisibilityBoost() {
  const days = artisanState.selectedBoostDays;
  const cost = days * 500;

  artisanState.provider.boosted = true;
  artisanState.provider.boostDays = days;
  artisanState.provider.boostExpires = 'Nov 5, 2026';
  persistProvider();

  showArtisanNotice(
    'Visibility Boost Activated!',
    `Your craftsman profile is now pinned to the top of Port Harcourt search results and featured in the top ribbon for <strong>${days} days</strong>.<br><br>Cost: <strong>₦${cost.toLocaleString()}</strong> charged to your Pro billing account.`,
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
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-top: 1px solid var(--border); padding-top: 14px;">
          <div style="display: flex; gap: 8px;">
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

  // Active jobs are in_progress or awaiting_release
  const activeJobs = artisanState.escrowJobs.filter(j => j.status === 'in_progress' || j.status === 'awaiting_release');
  const totalHeld = activeJobs.reduce((sum, j) => sum + (j.amount || 0), 0);

  if (display) display.textContent = `₦${totalHeld.toLocaleString()}`;
  if (badgeJobs) badgeJobs.textContent = activeJobs.length;
}

function renderArtisanJobs() {
  const container = document.getElementById('artisanJobsContainer');
  if (!container) return;

  renderEscrowBalance();

  const jobs = artisanState.escrowJobs;
  if (!jobs.length) {
    container.innerHTML = `
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 40px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🛡️</div>
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">No Active Escrow Jobs</h3>
        <p style="font-size: 0.86rem; color: var(--muted-foreground); max-width: 440px; margin: 0 auto 16px;">
          When clients book your workshop or accept your quotes, active jobs and escrow holdings will be tracked here.
        </p>
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
              <span class="badge" style="background: var(--bg-surface-subtle); color: var(--teal); font-weight: 800; font-size: 0.72rem;">ESCROW #${job.id}</span>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0; color: var(--foreground);">${job.serviceName}</h3>
            </div>
            <div style="font-size: 0.82rem; color: var(--muted-foreground); display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span>Client: <strong>${job.customerName || 'Tonye Briggs'}</strong></span>
              <span>📞 ${job.customerPhone || '0803 123 4567'}</span>
              <span>📍 ${job.address || job.area}</span>
              <span>📅 Scheduled: ${job.dateTime}</span>
            </div>
          </div>

          <!-- Status Indicator -->
          <div>
            ${isInProgress ? `
              <span class="badge" style="background: var(--teal-light); color: var(--teal); font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ⚙️ Work In Progress — Escrow Secured
              </span>
            ` : ''}
            ${isAwaitingRelease ? `
              <span class="badge" style="background: var(--amber-light); color: var(--amber-dark); font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ⏳ Work Marked Done — Awaiting Client Release
              </span>
            ` : ''}
            ${isCompleted ? `
              <span class="badge ed-badge-verified" style="font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ✓ Funds Released &amp; Paid
              </span>
            ` : ''}
            ${isDisputed ? `
              <span class="badge" style="background: rgba(220, 38, 38, 0.15); color: #DC2626; font-weight: 800; font-size: 0.82rem; padding: 6px 12px;">
                ⚠️ Under Mediation Review
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Escrow Financial Breakdown Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px; background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px;">
          <div>
            <div style="font-size: 0.72rem; color: var(--muted-foreground); text-transform: uppercase; font-weight: 700;">Client Escrow Deposit</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--foreground); margin-top: 2px;">₦${job.amount.toLocaleString()}</div>
            <div style="font-size: 0.72rem; color: var(--teal);">100% Held in Trust</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--muted-foreground); text-transform: uppercase; font-weight: 700;">Platform Safety Fee (5%)</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--muted-foreground); margin-top: 2px;">₦${job.commissionAmount.toLocaleString()}</div>
            <div style="font-size: 0.72rem; color: var(--muted-foreground);">Inspection &amp; Insurance</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--teal); text-transform: uppercase; font-weight: 800;">Your Net Payout (95%)</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: var(--teal); margin-top: 2px;">₦${job.payoutAmount.toLocaleString()}</div>
            <div style="font-size: 0.72rem; color: var(--teal);">Direct to Bank Account</div>
          </div>
        </div>

        <!-- Job Notes / Instructions -->
        ${job.scopeNotes ? `
          <div style="font-size: 0.82rem; color: var(--muted-foreground); margin-bottom: 18px; line-height: 1.4;">
            <strong>Work Scope Instructions:</strong> ${job.scopeNotes}
          </div>
        ` : ''}

        <!-- Crucial Action Buttons & Workflow -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 16px; flex-wrap: wrap; gap: 10px;">
          
          <div style="display: flex; align-items: center; gap: 10px;">
            ${isInProgress ? `
              <!-- CRUCIAL: Job Completion Trigger -->
              <button class="ed-button ed-button-amber" style="padding: 11px 22px; font-size: 0.92rem; font-weight: 800;" onclick="artisanMarkJobCompleted('${job.id}')">
                <span>✓ Mark Job Completed (Trigger Client Release)</span>
              </button>
            ` : ''}

            ${isAwaitingRelease ? `
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.84rem; color: var(--amber-dark); font-weight: 700;">
                  📢 Client alerted to inspect &amp; authorize ₦${job.payoutAmount.toLocaleString()} release.
                </span>
                <button class="ed-button ed-button-black ed-btn-compact" onclick="simulateClientReleaseNow('${job.id}')" title="Demonstration: Trigger instant release as client">
                  <span>⚡ Fast-Track Release (Demo)</span>
                </button>
              </div>
            ` : ''}

            ${isCompleted ? `
              <div style="font-size: 0.84rem; color: var(--teal); font-weight: 800; display: flex; align-items: center; gap: 6px;">
                ✓ ₦${job.payoutAmount.toLocaleString()} transferred to Access Bank (Rivers State Guild Account).
              </div>
            ` : ''}
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="ed-button ed-button-black ed-btn-compact" onclick="openArtisanChatDrawer('${job.customerName || 'Tonye Briggs'}', '${job.customerPhone || '0803 123 4567'}', '${job.serviceName}')">
              <span>💬 Contact Client</span>
            </button>
            <button class="ed-button ed-button-black ed-btn-compact" onclick="showEscrowTermsModal()">
              <span>Escrow Terms</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }).join('');
}

function artisanMarkJobCompleted(jobId) {
  const job = artisanState.escrowJobs.find(j => j.id === jobId);
  if (!job) return;

  job.status = 'awaiting_release';
  persistEscrowJobs();
  renderArtisanJobs();
  renderKpis();

  showArtisanNotice(
    'Job Marked as Completed!',
    `Great work! You have flagged <strong>${job.serviceName}</strong> as completed.<br><br>
    The client (<strong>${job.customerName || 'Tonye Briggs'}</strong>) has received an immediate alert on their Servhive Marketplace Portal to inspect your finished installation and authorize the release of your <strong>₦${job.payoutAmount.toLocaleString()} net payout</strong> from the Escrow Vault.<br><br>
    <em>Under Port Harcourt Escrow Rules: If the client does not respond within 48 hours without filing a dispute, our Admin Desk automatically disburses your funds.</em>`,
    '✓',
    'ESCROW RELEASE WORKFLOW TRIGGERED'
  );
}

function simulateClientReleaseNow(jobId) {
  const job = artisanState.escrowJobs.find(j => j.id === jobId);
  if (!job) return;

  job.status = 'completed';
  persistEscrowJobs();
  renderArtisanJobs();
  renderKpis();

  showArtisanNotice(
    'Escrow Funds Disbursed!',
    `The client inspected the job and authorized release.<br><br>
    <strong>₦${job.payoutAmount.toLocaleString()}</strong> has been transferred into your registered bank account.<br><br>
    Receipt ID: <strong>PAY-${job.id.toUpperCase()}-${Date.now().toString().slice(-4)}</strong>.`,
    '🎉',
    'FUNDS RELEASED'
  );
}

function showEscrowTermsModal() {
  showArtisanNotice(
    'Port Harcourt Escrow Protection Terms',
    `1. <strong>100% Upfront Deposit:</strong> Client funds are deposited before work commences.<br>
     2. <strong>Protection Guarantee:</strong> Zero risk of client refusing to pay after labor is delivered.<br>
     3. <strong>5% Platform Fee:</strong> Deducted solely upon successful milestone completion.<br>
     4. <strong>Mediation Support:</strong> Godfrey & the dispute desk handle any on-site discrepancies within 24 hours.`,
    '🛡️',
    'STATUTORY ESCROW TERMS'
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
  if (catInput) catInput.value = p.category || 'power-gen';
  if (bioInput) bioInput.value = p.bio || '';

  // Checkboxes for covered areas
  const covered = p.areasCovered || ['Trans-Amadi', 'Peter Odili Road', 'Woji', 'Old GRA', 'New GRA / Phase 2', 'D-Line', 'Ada George', 'Rumuola'];
  const checkboxes = document.querySelectorAll('input[name="pbArea"]');
  checkboxes.forEach(cb => {
    cb.checked = covered.includes(cb.value);
  });

  // Render services
  renderPbServicesList();
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
    <div class="pb-service-row" style="display: flex; gap: 10px; align-items: center; background: var(--bg-surface-subtle); border: 1px solid var(--border); padding: 10px 14px; border-radius: var(--radius-sm);">
      <input type="text" class="ed-search-input pb-svc-name" value="${svc.name}" placeholder="Service description" style="flex: 2; height: 38px; padding: 0 10px; font-size: 0.85rem; background: var(--bg-surface); border: 1px solid var(--border); color: var(--foreground); border-radius: var(--radius-sm);">
      <input type="number" class="ed-search-input pb-svc-price" value="${svc.price}" placeholder="₦ Price" min="1000" step="500" style="flex: 1; height: 38px; padding: 0 10px; font-size: 0.88rem; font-weight: 700; background: var(--bg-surface); border: 1px solid var(--border); color: var(--foreground); border-radius: var(--radius-sm);">
      <select class="ed-select-input pb-svc-type" style="flex: 1; height: 38px; padding: 0 10px; font-size: 0.82rem; background: var(--bg-surface); border: 1px solid var(--border); color: var(--foreground); border-radius: var(--radius-sm);">
        <option value="Fixed" ${svc.type === 'Fixed' ? 'selected' : ''}>Fixed</option>
        <option value="Starting from" ${svc.type === 'Starting from' ? 'selected' : ''}>Starting from</option>
      </select>
      <button type="button" class="ed-button ed-button-black ed-btn-compact" style="color: #DC2626; height: 38px;" onclick="removePbServiceItem(this)">✕</button>
    </div>
  `).join('');
}

function addPbServiceItem() {
  const container = document.getElementById('pbServicesList');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'pb-service-row';
  div.style.cssText = 'display: flex; gap: 10px; align-items: center; background: var(--bg-surface-subtle); border: 1px solid var(--border); padding: 10px 14px; border-radius: var(--radius-sm);';
  div.innerHTML = `
    <input type="text" class="ed-search-input pb-svc-name" value="" placeholder="Service title (e.g. Inverter Balancing)" style="flex: 2; height: 38px; padding: 0 10px; font-size: 0.85rem; background: var(--bg-surface); border: 1px solid var(--border); color: var(--foreground); border-radius: var(--radius-sm);">
    <input type="number" class="ed-search-input pb-svc-price" value="10000" placeholder="₦ Price" min="1000" step="500" style="flex: 1; height: 38px; padding: 0 10px; font-size: 0.88rem; font-weight: 700; background: var(--bg-surface); border: 1px solid var(--border); color: var(--foreground); border-radius: var(--radius-sm);">
    <select class="ed-select-input pb-svc-type" style="flex: 1; height: 38px; padding: 0 10px; font-size: 0.82rem; background: var(--bg-surface); border: 1px solid var(--border); color: var(--foreground); border-radius: var(--radius-sm);">
      <option value="Fixed">Fixed</option>
      <option value="Starting from">Starting from</option>
    </select>
    <button type="button" class="ed-button ed-button-black ed-btn-compact" style="color: #DC2626; height: 38px;" onclick="removePbServiceItem(this)">✕</button>
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
// VERIFICATION SECTION (KYC, 3 PHOTOS, LICENCE)
// ============================================================================
function initVerificationSection() {
  const licenceInput = document.getElementById('verificationLicenceInput');
  if (licenceInput && artisanState.provider && artisanState.provider.licenceNumber) {
    licenceInput.value = artisanState.provider.licenceNumber;
  }

  // Render dynamic work photos if available
  const photosGrid = document.getElementById('verificationWorkPhotosGrid');
  if (photosGrid && artisanState.provider) {
    const photos = artisanState.provider.workPhotos || [];
    if (photos.length > 0) {
      photosGrid.innerHTML = photos.map((photo, i) => `
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden;">
          <img src="${photo.url || '/assets/hero_tradesman.jpg'}" alt="Work Photo ${i + 1}" style="width: 100%; height: 130px; object-fit: cover;">
          <div style="padding: 10px;">
            <div style="font-size: 0.82rem; font-weight: 700;">Photo ${i + 1}</div>
            <div style="font-size: 0.72rem; color: var(--muted-foreground);">${photo.caption || 'Completed job photo'}</div>
          </div>
        </div>
      `).join('');
    } else {
      photosGrid.innerHTML = [1, 2, 3].map(slot => `
        <div style="background: var(--bg-surface-subtle); border: 1px dashed var(--border); border-radius: var(--radius-sm); padding: 24px 14px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px; cursor: pointer;" onclick="simulateReupload('Portfolio Photo')">
          <div style="font-size: 1.6rem; margin-bottom: 6px; color: var(--muted-foreground);">📷</div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--foreground);">Upload Portfolio Photo ${slot}</div>
          <div style="font-size: 0.72rem; color: var(--muted-foreground); margin-top: 2px;">Click to attach job evidence</div>
        </div>
      `).join('');
    }
  }
}

function simulateReupload(docType) {
  const fileName = docType === 'ID' ? 'NIN_Slip_Rivers_Verified_2026.pdf' : 'Guild_Licence_Renewal.pdf';
  showArtisanNotice(
    `${docType} Re-Uploaded`,
    `A new document <strong>${fileName}</strong> has been encrypted and submitted to the Rivers State Guild Verification Desk. Status remains: <strong>✓ Validated Active</strong>.`,
    '📄',
    'DOCUMENT RE-VERIFIED'
  );
}

function saveVerificationDocs() {
  const licenceInput = document.getElementById('verificationLicenceInput');
  if (licenceInput) {
    artisanState.provider.licenceNumber = licenceInput.value.trim();
    persistProvider();
  }

  showArtisanNotice(
    'Verification Credentials Saved',
    'Your statutory ID, 3 work portfolio photos, and Rivers State technical licence remain in good standing. Your "Rivers Verified Active" badge is visible to all marketplace clients.',
    '✓',
    'KYC CREDENTIALS ACTIVE'
  );
}

// ============================================================================
// DISPUTE & COMPLAINTS HUB
// ============================================================================
function renderArtisanComplaints() {
  const container = document.getElementById('artisanComplaintsContainer');
  if (!container) return;

  const reports = artisanState.reports;
  if (!reports.length) {
    container.innerHTML = `
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 40px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🛡️</div>
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 6px;">Zero Active Disputes</h3>
        <p style="font-size: 0.86rem; color: var(--muted-foreground); max-width: 440px; margin: 0 auto;">
          You have maintained a 100% satisfaction rating across Port Harcourt. If a customer raises an escrow or quality inquiry, it will appear here for mediation.
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
            ${isUnderReview ? `<span class="badge" style="background: var(--amber-light); color: var(--amber-dark); font-weight: 800;">⏳ Statement Under Mediation Review</span>` : ''}
            ${isResolved ? `<span class="badge ed-badge-verified" style="font-weight: 800;">✓ Resolved by Mediation Desk</span>` : ''}
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
            <label style="font-size: 0.82rem; font-weight: 700; display: block; margin-bottom: 6px;">Your Official Explanation to Godfrey &amp; Admin Desk:</label>
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
    `Your statement for dispute <strong>#${repId}</strong> has been forwarded to Godfrey & the Port Harcourt Admin Desk. Both parties will be contacted via WhatsApp/phone to reach mutual settlement.`,
    '✓',
    'ADMIN DESK NOTIFIED'
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
window.switchArtisanSection = switchArtisanSection;
window.selectBoostDays = selectBoostDays;
window.activateProVisibilityBoost = activateProVisibilityBoost;
window.openArtisanQuoteModal = openArtisanQuoteModal;
window.updateArtisanQuoteBreakdown = updateArtisanQuoteBreakdown;
window.handleArtisanSubmitQuote = handleArtisanSubmitQuote;
window.artisanAcceptRequest = artisanAcceptRequest;
window.artisanDeclineRequest = artisanDeclineRequest;
window.artisanMarkJobCompleted = artisanMarkJobCompleted;
window.simulateClientReleaseNow = simulateClientReleaseNow;
window.showEscrowTermsModal = showEscrowTermsModal;
window.addPbServiceItem = addPbServiceItem;
window.removePbServiceItem = removePbServiceItem;
window.handleSaveProfileBuilder = handleSaveProfileBuilder;
window.simulateReupload = simulateReupload;
window.saveVerificationDocs = saveVerificationDocs;
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

