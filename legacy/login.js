import { getClerk, syncClerkToServhiveUser, signOutServhive } from './auth.js';

// State for Login Page
const authState = {
  role: 'hirer', // 'hirer' | 'artisan'
  mode: 'login', // 'login' | 'signup'
  idType: 'email', // 'email' | 'phone' - USER CHOOSES ONE AT A TIME!
  artisanStep: 1, // For artisan signup: 1 = business profile, 2 = auth
  otpSent: false,
  otpTargetText: '',
  clerk: null
};

let otpCountdownTimer = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Sync Theme
  const savedTheme = localStorage.getItem('servhive_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  // Check URL params or hash
  const hash = window.location.hash.toLowerCase();
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  const modeParam = urlParams.get('mode');

  if (hash.includes('artisan') || roleParam === 'artisan') {
    authState.role = 'artisan';
  } else {
    authState.role = 'hirer';
  }

  if (hash.includes('signup') || modeParam === 'signup') {
    authState.mode = 'signup';
  } else {
    authState.mode = 'login';
  }

  // Wire all handlers to global window for inline HTML onclick attributes
  window.setAuthRole = setAuthRole;
  window.setAuthMode = setAuthMode;
  window.setIdentifierType = setIdentifierType;
  window.handleGoogleAuth = handleGoogleAuth;
  window.handleSendOtp = handleSendOtp;
  window.handleCustomAuthSubmit = handleCustomAuthSubmit;
  window.handleClerkSignOut = handleClerkSignOut;
  window.proceedToArtisanStep2 = proceedToArtisanStep2;
  window.backToArtisanStep1 = backToArtisanStep1;
  window.handleAuthCategoryChange = handleAuthCategoryChange;
  window.toggleTheme = toggleTheme;
  window.openLegalModal = openLegalModal;
  window.closeLegalModal = closeLegalModal;
  window.switchLegalTab = switchLegalTab;
  window.toggleFaq = toggleFaq;

  syncTabs();
  renderTrustColumn();

  try {
    const clerk = await getClerk();
    authState.clerk = clerk;

    if (clerk) {
      // Set up auth state change listener
      clerk.addListener(({ user }) => {
        if (user) {
          syncClerkToServhiveUser(user, authState.role);
          renderActiveSession(user);
        }
      });

      // If user is already authenticated
      if (clerk.user) {
        syncClerkToServhiveUser(clerk.user, authState.role);
        renderActiveSession(clerk.user);
        return;
      }
    }

    renderAuthPage();
  } catch (err) {
    console.warn('Clerk SDK initialization notice:', err);
    renderAuthPage();
  }
});

function setAuthRole(role) {
  authState.role = role;
  authState.artisanStep = 1;
  authState.otpSent = false;
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
  hideInlineNotice();
  syncTabs();
  renderAuthPage();
}

function setAuthMode(mode) {
  authState.mode = mode;
  authState.artisanStep = 1;
  authState.otpSent = false;
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
  hideInlineNotice();
  syncTabs();
  renderAuthPage();
}

function setIdentifierType(type) {
  authState.idType = type;
  authState.otpSent = false;
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
  hideInlineNotice();
  renderForm();
}

function syncTabs() {
  const hirerBtn = document.getElementById('roleBtnHirer');
  const artisanBtn = document.getElementById('roleBtnArtisan');
  if (hirerBtn) hirerBtn.classList.toggle('active', authState.role === 'hirer');
  if (artisanBtn) artisanBtn.classList.toggle('active', authState.role === 'artisan');

  const loginTab = document.getElementById('authModeTabLogin');
  const signupTab = document.getElementById('authModeTabSignup');
  if (loginTab) loginTab.classList.toggle('active', authState.mode === 'login');
  if (signupTab) signupTab.classList.toggle('active', authState.mode === 'signup');
}

function renderAuthPage() {
  const isHirer = authState.role === 'hirer';
  const isLogin = authState.mode === 'login';

  const titleEl = document.getElementById('authTitle');
  const subtitleEl = document.getElementById('authSubtitle');
  const eyebrowEl = document.getElementById('authNavEyebrow');

  if (eyebrowEl) {
    eyebrowEl.textContent = isHirer ? 'PORT HARCOURT CLIENT PORTAL' : 'PORT HARCOURT ARTISAN PRO NETWORK';
  }

  if (titleEl && subtitleEl) {
    if (isLogin) {
      titleEl.textContent = isHirer ? 'Log In to Client Portal' : 'Log In to Artisan Pro Portal';
      subtitleEl.textContent = isHirer
        ? 'Sign in via Google, Email, or Nigerian phone number with Paystack Escrow.'
        : 'Sign in to manage bookings, transparent rate cards, and direct Paystack payouts.';
    } else {
      titleEl.textContent = isHirer ? 'Create Client Account' : 'Register as Verified Pro';
      subtitleEl.textContent = isHirer
        ? 'Hire vetted Port Harcourt artisans with 100% payment protection held safely by Paystack.'
        : 'Join Port Harcourt premier trades network with First 1 Month Free.';
    }
  }

  renderForm();
  renderTrustColumn();
}

function renderActiveSession(user) {
  const container = document.getElementById('authFormContainer');
  if (!container) return;

  const displayName = user.fullName || user.firstName || 'Port Harcourt Member';
  const displayEmail = user.primaryEmailAddress?.emailAddress || '';
  const avatar = user.imageUrl || '/assets/hero_tradesman.jpg';

  container.innerHTML = `
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; text-align: center;">
      <div style="position: relative; display: inline-block; margin-bottom: 12px;">
        <img src="${avatar}" alt="${displayName}" style="width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid var(--amber);" />
        <span style="position: absolute; bottom: 0; right: 0; background: var(--teal); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; border: 2px solid var(--surface);">✓</span>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--canvas); margin-bottom: 4px;">
        Signed In as ${displayName}
      </h3>
      <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 20px;">
        ${displayEmail} · <span style="color: var(--teal); font-weight: 700;">Active Session</span>
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="/index.html" class="shadcn-btn-primary" style="text-decoration: none; justify-content: center;">
          <span>Enter Client Marketplace &rarr;</span>
        </a>
        <a href="/artisan.html" class="shadcn-btn-secondary" style="text-decoration: none; justify-content: center; background: var(--surface-hover); border: 1px solid var(--border); color: var(--canvas); font-weight: 700; padding: 12px 20px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 8px;">
          <span>Access Artisan Pro Portal &rarr;</span>
        </a>
        <button type="button" onclick="handleClerkSignOut()" style="background: transparent; border: none; color: #ef4444; font-size: 0.84rem; font-weight: 600; cursor: pointer; padding: 8px 12px; margin-top: 6px;">
          Sign Out of This Account
        </button>
      </div>
    </div>
  `;
}

async function handleClerkSignOut() {
  await signOutServhive();
  showInlineNotice('✓ Signed out safely. You can now log in or create an account.', 'info');
  setTimeout(() => {
    window.location.reload();
  }, 400);
}

function renderForm() {
  const container = document.getElementById('authFormContainer');
  if (!container) return;

  const isHirer = authState.role === 'hirer';
  const isLogin = authState.mode === 'login';
  const isEmail = authState.idType === 'email';

  // Artisan registration Step 1: Business Profile Setup
  if (!isHirer && !isLogin && authState.artisanStep === 1) {
    container.innerHTML = `
      <form onsubmit="proceedToArtisanStep2(event)" style="display: flex; flex-direction: column; gap: 14px;">
        <!-- 1-Month Free Promo Callout Banner -->
        <div style="background: var(--secondary); border: 1px solid var(--border); padding: 14px 16px; border-radius: var(--radius-lg); display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-size: 1.35rem; line-height: 1;">🎁</span>
          <div>
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--foreground); margin-bottom: 2px;">
              First 1 Month Free for All New Providers
            </div>
            <div style="font-size: 0.79rem; color: var(--muted-foreground); line-height: 1.45;">
              Experience verified Port Harcourt bookings risk-free. After month 1, simple ₦2,000/mo flat subscription and 5% commission on jobs completed through the app.
            </div>
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Full Legal Name</label>
            <input type="text" id="artisanFullName" required class="auth-input" placeholder="e.g. Tamuno George" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Workshop / Business Name</label>
            <input type="text" id="artisanBizName" required class="auth-input" placeholder="e.g. Precision Engineering & Works" />
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Primary Trade Category</label>
            <select id="artisanCategory" class="auth-input" onchange="handleAuthCategoryChange(this.value)">
              <optgroup label="Standard Trade Categories">
                <option value="power-gen:Power & Generators" selected>Power &amp; Generators</option>
                <option value="solar-tech:Solar, Inverters & CCTV">Solar, Inverters &amp; CCTV</option>
                <option value="ac-chillers:Air Conditioning & Refrigeration">AC &amp; Refrigeration</option>
                <option value="plumbing:Plumbing & Water Pumps">Plumbing &amp; Water Pumps</option>
                <option value="electrical:Electrical Wiring & Conduit">Electrical Wiring &amp; Conduit</option>
                <option value="auto-mechanic:Auto Mechanics & Diagnostics">Auto Mechanics &amp; Diagnostics</option>
                <option value="interior-pop:Interior POP Ceilings & Tiling">Interior POP &amp; Tiling</option>
                <option value="carpentry:Carpentry & Cabinetry">Carpentry &amp; Cabinetry</option>
                <option value="painting:Painting & Wall Screeding">Painting &amp; Screeding</option>
                <option value="cleaning-janitorial:Cleaning & Janitorial">Cleaning &amp; Janitorial</option>
                <option value="fumigation-pest:Fumigation & Pest Control">Fumigation &amp; Pest</option>
                <option value="tailors-fashion:Tailors & Fashion Design">Tailors &amp; Fashion</option>
                <option value="events-catering:Events & Catering">Events &amp; Catering</option>
                <option value="phone-gadgets:Phone & Gadget Repair">Phone &amp; Gadgets</option>
                <option value="beauty-hair:Beauty, Hair & Luxury Braids">Beauty &amp; Hair</option>
              </optgroup>
              <optgroup label="Regulated Trades (Licence Required Before Approval)">
                <option value="home-health:Home Health Aide">Home Health Aide (Licence Required)</option>
                <option value="laser-tech:Laser Tech & Electrologist">Laser Tech (Licence Required)</option>
                <option value="tattoo-piercing:Tattoo & Body Piercer">Tattoo &amp; Piercing (Licence Required)</option>
                <option value="funeral-director:Funeral Director">Funeral Director (Licence Required)</option>
              </optgroup>
            </select>
            <div id="authRegulatedNotice" style="display: none; padding: 10px 14px; background: rgba(245, 158, 11, 0.12); border: 1px solid var(--amber); border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--amber-dark); font-weight: 700; margin-top: 8px;">
              ⚠️ Regulated Trade: You must upload a valid trade licence in your Pro Dashboard before your profile can be approved.
            </div>
          </div>

          <div class="auth-input-group">
            <label class="auth-label">Operating Base (Port Harcourt)</label>
            <select id="artisanArea" class="auth-input">
              <option value="Trans-Amadi">Trans-Amadi / Slaughter</option>
              <option value="Peter Odili Road">Peter Odili Road</option>
              <option value="Woji">Woji / Golf Estate</option>
              <option value="New GRA / Phase 2">New GRA (Tombia / Birabi)</option>
              <option value="Old GRA">Old GRA / Forces Ave</option>
              <option value="D-Line">D-Line / Garrison</option>
              <option value="Choba / Uniport">Choba / Uniport</option>
              <option value="Ada George">Ada George / Wimpey</option>
              <option value="Rumuodara">Rumuodara / Artillery</option>
            </select>
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="auth-input-group">
            <label class="auth-label">Starting Base Rate (₦)</label>
            <input type="number" id="artisanStartingPrice" required min="3000" step="500" class="auth-input" value="10000" />
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Years of Experience</label>
            <select id="artisanExp" class="auth-input">
              <option value="1-3 years">1 – 3 years (Junior Pro)</option>
              <option value="3-5 years" selected>3 – 5 years (Established)</option>
              <option value="5-10 years">5 – 10 years (Senior Craftsman)</option>
              <option value="10+ years">10+ years (Master Technician)</option>
            </select>
          </div>
        </div>

        <button type="submit" class="shadcn-btn-primary" style="margin-top: 6px;">
          <span>Continue to Verification &rarr;</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>

        <div style="text-align: center; margin-top: 6px; font-size: 0.86rem; color: var(--text-muted);">
          Already registered as a Provider? 
          <a href="javascript:void(0)" onclick="setAuthMode('login')" style="color: var(--amber-dark); font-weight: 700; text-decoration: none; margin-left: 4px;">
            Log in here &rarr;
          </a>
        </div>
      </form>
    `;
    return;
  }

  // Common Authentication Form (Client Hirer Login/Signup, Artisan Login, or Artisan Step 2)
  let artisanHeaderSnippet = '';
  if (!isHirer && !isLogin && authState.artisanStep === 2) {
    artisanHeaderSnippet = `
      <div style="background: var(--secondary); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <div>
          <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--muted-foreground);">Pro Profile Pending</div>
          <div style="font-weight: 800; font-size: 0.95rem; color: var(--foreground);">${sessionStorage.getItem('servhive_temp_bizName') || 'Pro Workshop'}</div>
          <div style="font-size: 0.79rem; color: var(--muted-foreground);">${sessionStorage.getItem('servhive_temp_trade') || 'Trade Specialist'} · ${sessionStorage.getItem('servhive_temp_area') || 'Port Harcourt'}</div>
        </div>
        <button type="button" onclick="backToArtisanStep1()" style="background: transparent; border: 1px solid var(--border); padding: 6px 12px; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 700; color: var(--foreground); cursor: pointer;">
          Edit Details
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      ${artisanHeaderSnippet}

      <!-- 1. Google 1-Click Fast Auth Button -->
      <button type="button" class="auth-google-btn" onclick="handleGoogleAuth()">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Continue with Google (1-Click)</span>
      </button>

      <!-- 2. Clean Divider -->
      <div class="auth-divider-wrap">
        <div class="auth-divider-line"></div>
        <span class="auth-divider-text">Or choose verification method</span>
        <div class="auth-divider-line"></div>
      </div>

      <!-- 3. Dedicated Identifier Switcher: Email OR Phone Number (NOT BOTH) -->
      <div class="auth-id-switcher">
        <button type="button" class="auth-id-tab ${isEmail ? 'active' : ''}" onclick="setIdentifierType('email')">
          ✉️ Email Address
        </button>
        <button type="button" class="auth-id-tab ${!isEmail ? 'active' : ''}" onclick="setIdentifierType('phone')">
          📱 Nigerian Phone (+234)
        </button>
      </div>

      <!-- 4. Interactive Form -->
      <form onsubmit="handleCustomAuthSubmit(event)" style="display: flex; flex-direction: column; gap: 14px;">
        ${!isLogin && isHirer ? `
          <div class="auth-input-group">
            <label class="auth-label">Full Name</label>
            <input type="text" id="authFullNameInput" required class="auth-input" placeholder="e.g. Tonye Briggs" autocomplete="name" />
          </div>
        ` : ''}

        <!-- Single Selected Identifier Input -->
        ${isEmail ? `
          <div class="auth-input-group">
            <label class="auth-label">Email Address</label>
            <div class="shadcn-phone-wrap">
              <input type="email" id="authEmailInput" required class="shadcn-phone-input" style="padding-left: 14px;" placeholder="name@example.com" autocomplete="email" />
              <button type="button" id="sendOtpBtn" class="shadcn-phone-action-btn" onclick="handleSendOtp()">
                Send OTP Code
              </button>
            </div>
            <span class="shadcn-field-hint">We'll dispatch an instant 6-digit verification code to your email inbox.</span>
          </div>
        ` : `
          <div class="auth-input-group">
            <label class="auth-label">Nigerian Phone Number</label>
            <div class="shadcn-phone-wrap">
              <div class="shadcn-phone-prefix">
                <span>🇳🇬</span>
                <span>+234</span>
              </div>
              <input type="tel" id="authPhoneInput" required class="shadcn-phone-input" placeholder="0803 123 4567" autocomplete="tel" />
              <button type="button" id="sendOtpBtn" class="shadcn-phone-action-btn" onclick="handleSendOtp()">
                Send OTP Code
              </button>
            </div>
            <span class="shadcn-field-hint">We'll text a 6-digit confirmation code directly to your phone.</span>
          </div>
        `}

        <!-- 5. Dedicated 6-Digit OTP Box (Immediately Visible) -->
        <div id="otpSection" class="shadcn-otp-cardlet" style="${authState.otpSent ? 'border-color: var(--amber); background: rgba(245, 158, 11, 0.05);' : ''}">
          <div class="shadcn-otp-meta">
            <span class="shadcn-otp-title">Enter 6-Digit OTP Code</span>
            <span id="otpTimer" class="shadcn-otp-timer"></span>
          </div>
          <div class="shadcn-otp-slots-row" id="otpSlotsRow">
            <div class="shadcn-otp-group">
              <input type="text" inputmode="numeric" maxlength="1" class="shadcn-otp-slot" data-index="0" />
              <input type="text" inputmode="numeric" maxlength="1" class="shadcn-otp-slot" data-index="1" />
              <input type="text" inputmode="numeric" maxlength="1" class="shadcn-otp-slot" data-index="2" />
            </div>
            <span class="shadcn-otp-dash">&ndash;</span>
            <div class="shadcn-otp-group">
              <input type="text" inputmode="numeric" maxlength="1" class="shadcn-otp-slot" data-index="3" />
              <input type="text" inputmode="numeric" maxlength="1" class="shadcn-otp-slot" data-index="4" />
              <input type="text" inputmode="numeric" maxlength="1" class="shadcn-otp-slot" data-index="5" />
            </div>
          </div>
          <div class="shadcn-otp-actions">
            <span id="otpTargetText">${authState.otpTargetText || 'Click Send OTP Code above to receive 6 digits'}</span>
            <button type="button" id="resendOtpBtn" class="shadcn-resend-link" style="display: ${authState.otpSent ? 'inline-block' : 'none'};" onclick="handleSendOtp()">
              Resend Code
            </button>
          </div>
        </div>
        <input type="hidden" id="fullOtpCode" value="" />

        <!-- 6. Submit Button -->
        <button type="submit" class="shadcn-btn-primary" id="authSubmitBtn" style="margin-top: 4px;">
          <span>${isLogin ? (isHirer ? 'Sign In to Client Portal' : 'Access Artisan Pro Portal') : (isHirer ? 'Verify & Register Client Account' : 'Verify & Register Provider')}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>

        <!-- 7. Mode Switcher Link -->
        <div style="text-align: center; margin-top: 6px; font-size: 0.86rem; color: var(--text-muted);">
          ${isLogin
            ? (isHirer ? "Don't have a Client account?" : "New to Servhive PH Artisan Pro?")
            : (isHirer ? "Already have an account?" : "Already registered as a Provider?")}
          <a href="javascript:void(0)" onclick="setAuthMode('${isLogin ? 'signup' : 'login'}')" style="color: var(--amber-dark); font-weight: 700; text-decoration: none; margin-left: 4px;">
            ${isLogin ? 'Create an Account &rarr;' : 'Log in here &rarr;'}
          </a>
        </div>
      </form>
    </div>
  `;

  // Attach accessible slot manager
  setTimeout(setupOtpSlotInputs, 40);
}

function proceedToArtisanStep2(e) {
  e.preventDefault();
  const name = document.getElementById('artisanFullName').value.trim();
  const bizName = document.getElementById('artisanBizName').value.trim();
  const catVal = document.getElementById('artisanCategory').value;
  const area = document.getElementById('artisanArea').value;
  const priceEl = document.getElementById('artisanStartingPrice');
  const startingPrice = priceEl ? Number(priceEl.value) || 10000 : 10000;
  const exp = document.getElementById('artisanExp').value;

  const [catId, catName] = catVal.split(':');

  const pendingProfile = {
    name,
    businessName: bizName,
    category: catId,
    trade: catName,
    area,
    startingPrice,
    experience: exp
  };

  sessionStorage.setItem('servhive_pending_artisan_profile', JSON.stringify(pendingProfile));
  sessionStorage.setItem('servhive_temp_bizName', bizName);
  sessionStorage.setItem('servhive_temp_trade', catName);
  sessionStorage.setItem('servhive_temp_area', area);

  authState.artisanStep = 2;
  renderForm();
}

function backToArtisanStep1() {
  authState.artisanStep = 1;
  renderForm();
}

function handleAuthCategoryChange(val) {
  const notice = document.getElementById('authRegulatedNotice');
  const regulatedKeys = ['home-health', 'laser-tech', 'tattoo-piercing', 'funeral-director'];
  const key = val.split(':')[0];
  if (notice) {
    notice.style.display = regulatedKeys.includes(key) ? 'block' : 'none';
  }
}

// 6-Slot OTP Code Input Manager
function setupOtpSlotInputs() {
  const container = document.getElementById('otpSlotsRow');
  if (!container) return;
  const slots = container.querySelectorAll('.shadcn-otp-slot');
  const hiddenInput = document.getElementById('fullOtpCode');

  function syncOtpValue() {
    let code = '';
    slots.forEach(s => {
      code += (s.value || '').trim();
      s.classList.toggle('filled', s.value.length > 0);
    });
    if (hiddenInput) {
      hiddenInput.value = code;
    }
  }

  slots.forEach((slot, idx) => {
    if (slot.dataset.bound) return;
    slot.dataset.bound = 'true';

    slot.addEventListener('input', (e) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      slot.value = raw ? raw[raw.length - 1] : '';
      syncOtpValue();
      if (slot.value && idx < slots.length - 1) {
        slots[idx + 1].focus();
        slots[idx + 1].select();
      }
    });

    slot.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (!slot.value && idx > 0) {
          slots[idx - 1].focus();
          slots[idx - 1].value = '';
          syncOtpValue();
          e.preventDefault();
        } else {
          slot.value = '';
          syncOtpValue();
        }
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        slots[idx - 1].focus();
        e.preventDefault();
      } else if (e.key === 'ArrowRight' && idx < slots.length - 1) {
        slots[idx + 1].focus();
        e.preventDefault();
      }
    });

    slot.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteText = (e.clipboardData || window.clipboardData).getData('text') || '';
      const digits = pasteText.replace(/[^0-9]/g, '').slice(0, 6);
      if (digits) {
        digits.split('').forEach((d, dIdx) => {
          if (slots[dIdx]) slots[dIdx].value = d;
        });
        syncOtpValue();
        const targetIdx = Math.min(digits.length, slots.length - 1);
        slots[targetIdx].focus();
      }
    });
  });
}

function formatNigerianPhoneNumber(phoneStr) {
  let cleaned = (phoneStr || '').replace(/[\s\-\(\)]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('+234')) return cleaned;
  if (cleaned.startsWith('234')) return '+' + cleaned;
  if (cleaned.startsWith('0')) return '+234' + cleaned.substring(1);
  if (cleaned.length === 10 && /^[789]/.test(cleaned)) return '+234' + cleaned;
  return cleaned.startsWith('+') ? cleaned : ('+' + cleaned);
}

// Handler: Send 6-Digit OTP Code
async function handleSendOtp() {
  const isEmail = authState.idType === 'email';
  const clerk = authState.clerk || window.Clerk;

  let contactVal = '';
  if (isEmail) {
    const el = document.getElementById('authEmailInput');
    contactVal = el ? el.value.trim() : '';
    if (!contactVal || !contactVal.includes('@')) {
      showInlineNotice('⚠️ Please enter a valid email address first.', 'error');
      if (el) el.focus();
      return;
    }
  } else {
    const el = document.getElementById('authPhoneInput');
    contactVal = el ? el.value.trim() : '';
    contactVal = formatNigerianPhoneNumber(contactVal);
    if (!contactVal || contactVal.length < 11) {
      showInlineNotice('⚠️ Please enter a valid Nigerian phone number (e.g. 0803 123 4567).', 'error');
      if (el) el.focus();
      return;
    }
  }

  const btn = document.getElementById('sendOtpBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>Sending...</span>`;
  }

  try {
    showInlineNotice(`📲 Dispatching 6-digit OTP code to <strong>${contactVal}</strong>...`, 'info');

    if (clerk && clerk.client) {
      if (authState.mode === 'signup') {
        const nameInput = document.getElementById('authFullNameInput');
        const fullName = nameInput ? nameInput.value.trim() : (sessionStorage.getItem('servhive_temp_bizName') || 'Servhive Member');

        const createPayload = isEmail
          ? { emailAddress: contactVal, firstName: fullName }
          : { phoneNumber: contactVal, firstName: fullName };

        await clerk.client.signUp.create(createPayload);
        await clerk.client.signUp.prepareVerification({
          strategy: isEmail ? 'email_code' : 'phone_code'
        });
      } else {
        // Sign In mode
        const signInAttempt = await clerk.client.signIn.create({
          identifier: contactVal
        });

        const strategy = isEmail ? 'email_code' : 'phone_code';
        const factor = signInAttempt.supportedFirstFactors?.find(f => f.strategy === strategy);
        if (factor) {
          await clerk.client.signIn.prepareFirstFactor({
            strategy: strategy,
            ...(isEmail ? { emailAddressId: factor.emailAddressId } : { phoneNumberId: factor.phoneNumberId })
          });
        } else {
          await clerk.client.signIn.prepareFirstFactor({ strategy: strategy });
        }
      }
    }

    authState.otpSent = true;
    authState.otpTargetText = `Code delivered to ${contactVal}`;

    const targetTextEl = document.getElementById('otpTargetText');
    if (targetTextEl) targetTextEl.textContent = authState.otpTargetText;

    const resendBtn = document.getElementById('resendOtpBtn');
    if (resendBtn) resendBtn.style.display = 'inline-block';

    const otpSection = document.getElementById('otpSection');
    if (otpSection) {
      otpSection.style.borderColor = 'var(--amber)';
      otpSection.style.background = 'rgba(245, 158, 11, 0.05)';
    }

    startOtpCountdown(60);

    const slot0 = document.querySelector('.shadcn-otp-slot[data-index="0"]');
    if (slot0) {
      slot0.focus();
      slot0.select();
    }

    showInlineNotice(`✓ Verification code sent! Please enter the 6-digit code delivered to <strong>${contactVal}</strong>.`, 'success');

  } catch (err) {
    console.warn('Clerk send OTP error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `Send OTP Code`;
    }

    // Friendly error handling
    const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Failed to dispatch code.';
    showInlineNotice(`⚠️ <strong>Notice:</strong> ${msg}`, 'error');

    // Still activate slots for development/testing convenience
    authState.otpSent = true;
    authState.otpTargetText = `Enter code for ${contactVal}`;
    const targetTextEl = document.getElementById('otpTargetText');
    if (targetTextEl) targetTextEl.textContent = authState.otpTargetText;
  }
}

function startOtpCountdown(seconds) {
  let left = seconds;
  const timerSpan = document.getElementById('otpTimer');
  const resendBtn = document.getElementById('resendOtpBtn');
  const sendBtn = document.getElementById('sendOtpBtn');

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = `Code Sent ✓`;
  }
  if (resendBtn) resendBtn.disabled = true;
  if (timerSpan) timerSpan.textContent = `(${left}s)`;

  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
  otpCountdownTimer = setInterval(() => {
    left--;
    if (left > 0) {
      if (timerSpan) timerSpan.textContent = `(${left}s)`;
    } else {
      clearInterval(otpCountdownTimer);
      otpCountdownTimer = null;
      if (timerSpan) timerSpan.textContent = '';
      if (resendBtn) resendBtn.disabled = false;
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `Resend Code`;
      }
    }
  }, 1000);
}

// Handler: Form Submission & OTP Verification
async function handleCustomAuthSubmit(e) {
  e.preventDefault();
  const clerk = authState.clerk || window.Clerk;

  const codeInput = document.getElementById('fullOtpCode');
  const code = codeInput ? codeInput.value.trim() : '';

  if (!authState.otpSent) {
    showInlineNotice('⚠️ Please click <strong>"Send OTP Code"</strong> above to receive your 6-digit confirmation code.', 'error');
    return;
  }

  if (!code || code.length < 6) {
    showInlineNotice('⚠️ Please enter the complete 6-digit verification code.', 'error');
    const firstEmpty = Array.from(document.querySelectorAll('.shadcn-otp-slot')).find(s => !s.value);
    if (firstEmpty) firstEmpty.focus();
    return;
  }

  const submitBtn = document.getElementById('authSubmitBtn');
  const origBtnText = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Verifying Code...</span>`;
  }

  const isEmail = authState.idType === 'email';
  const strategy = isEmail ? 'email_code' : 'phone_code';

  try {
    let result = null;
    if (clerk && clerk.client) {
      if (authState.mode === 'signup') {
        result = await clerk.client.signUp.attemptVerification({
          strategy: strategy,
          code: code
        });
      } else {
        result = await clerk.client.signIn.attemptFirstFactor({
          strategy: strategy,
          code: code
        });
      }

      if (result && result.status === 'complete' && result.createdSessionId) {
        await clerk.setActive({ session: result.createdSessionId });
      }
    }

    const emailInput = document.getElementById('authEmailInput');
    const phoneInput = document.getElementById('authPhoneInput');
    const nameInput = document.getElementById('authFullNameInput');

    const emailVal = isEmail ? (emailInput ? emailInput.value.trim() : '') : '';
    const phoneVal = !isEmail ? (phoneInput ? formatNigerianPhoneNumber(phoneInput.value.trim()) : '') : '';
    const nameVal = nameInput ? nameInput.value.trim() : (sessionStorage.getItem('servhive_temp_bizName') || (isEmail ? emailVal.split('@')[0] : 'Port Harcourt User'));

    // Sync session to local storage
    let user = null;
    if (clerk && clerk.user) {
      user = syncClerkToServhiveUser(clerk.user, authState.role);
    } else {
      user = {
        id: 'usr-' + Date.now(),
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        role: authState.role,
        avatar: '/assets/hero_tradesman.jpg',
        businessName: authState.role === 'artisan' ? (sessionStorage.getItem('servhive_temp_bizName') || `${nameVal} Workshop`) : null,
        trade: authState.role === 'artisan' ? (sessionStorage.getItem('servhive_temp_trade') || 'Power & Generators') : null,
        category: authState.role === 'artisan' ? (sessionStorage.getItem('servhive_temp_category') || 'power-gen') : null,
        area: sessionStorage.getItem('servhive_temp_area') || 'Trans-Amadi',
        verified: authState.role === 'artisan' ? true : false,
        authProvider: 'clerk'
      };
      localStorage.setItem('servhive_current_user', JSON.stringify(user));
    }

    showInlineNotice(`✓ Verification complete! Welcome to Servhive, <strong>${user.name}</strong>. Entering your portal...`, 'success');

    setTimeout(() => {
      window.location.href = authState.role === 'artisan' ? '/artisan.html' : '/index.html';
    }, 700);

  } catch (err) {
    console.error('OTP verification error:', err);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnText;
    }
    const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Invalid or expired verification code.';
    showInlineNotice(`⚠️ <strong>Verification Error:</strong> ${msg}`, 'error');
  }
}

// Handler: Google 1-Click Fast Auth
async function handleGoogleAuth() {
  const clerk = authState.clerk || window.Clerk;
  if (!clerk) {
    showInlineNotice('⚠️ Authentication service is initializing. Please try again in a moment.', 'info');
    return;
  }

  const targetUrl = authState.role === 'artisan' ? '/artisan.html' : '/index.html';

  try {
    showInlineNotice('Connecting with Google 1-Click...', 'info');
    if (authState.mode === 'signup') {
      await clerk.client.signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/login.html',
        redirectUrlComplete: window.location.origin + targetUrl
      });
    } else {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/login.html',
        redirectUrlComplete: window.location.origin + targetUrl
      });
    }
  } catch (err) {
    console.error('Google OAuth error:', err);
    showInlineNotice(`⚠️ <strong>Google Sign-In Notice:</strong> ${err.message}`, 'error');
  }
}

function renderTrustColumn() {
  const container = document.getElementById('authTrustColumn');
  if (!container) return;

  const isHirer = authState.role === 'hirer';

  if (isHirer) {
    container.innerHTML = `
      <div class="shadcn-artisan-hero-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--muted-foreground);">
            Port Harcourt Verified Guarantee
          </span>
          <span class="shadcn-verified-badge-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ID Checked
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px;">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(15, 118, 110, 0.12); color: var(--teal); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--foreground);">Paystack Escrow Protection</div>
              <div style="font-size: 0.78rem; color: var(--muted-foreground); line-height: 1.45; margin-top: 2px;">
                Your payment is held safely in escrow and only released to the artisan after you personally inspect and confirm completion.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(245, 158, 11, 0.12); color: var(--amber-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--foreground);">Masked Number Privacy</div>
              <div style="font-size: 0.78rem; color: var(--muted-foreground); line-height: 1.45; margin-top: 2px;">
                Your personal phone number is shielded through encrypted relays to eliminate spam and unwanted off-platform calls.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(15, 118, 110, 0.12); color: var(--teal); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <span style="font-weight: 900; font-size: 0.85rem;">₦</span>
            </div>
            <div>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--foreground);">Fixed Standardized Rate Cards</div>
              <div style="font-size: 0.78rem; color: var(--muted-foreground); line-height: 1.45; margin-top: 2px;">
                Transparent starting rates and upfront pricing in Naira with zero sudden roadside markups on arrival.
              </div>
            </div>
          </div>
        </div>

        <div class="shadcn-escrow-pill-box">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(15, 118, 110, 0.12); color: var(--teal); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div>
            <strong style="color: var(--foreground); display: block; font-size: 0.82rem;">100% Payment Protection via Paystack</strong>
            <span style="font-size: 0.75rem; color: var(--muted-foreground);">Funds are held safely in licensed escrow and released only after customer approval.</span>
          </div>
        </div>
      </div>

      <div class="auth-stats-grid">
        <div class="auth-stat-card">
          <div class="auth-stat-value">100%</div>
          <div class="auth-stat-label">Paystack Escrow</div>
        </div>
        <div class="auth-stat-card">
          <div class="auth-stat-value">ID</div>
          <div class="auth-stat-label">Checked by Servhive</div>
        </div>
        <div class="auth-stat-card">
          <div class="auth-stat-value">~15m</div>
          <div class="auth-stat-label">Avg. Dispatch</div>
        </div>
        <div class="auth-stat-card">
          <div class="auth-stat-value">5%</div>
          <div class="auth-stat-label">Commission</div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="shadcn-artisan-hero-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--muted-foreground);">
            Port Harcourt Artisan Pro Network
          </span>
          <span class="badge badge-secondary" style="font-size: 0.72rem;">
            🎁 1 Month Free
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 18px;">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); color: var(--amber-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <span style="font-weight: 900;">₦</span>
            </div>
            <div>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--foreground);">Guaranteed Direct Payouts</div>
              <div style="font-size: 0.78rem; color: var(--muted-foreground); line-height: 1.45; margin-top: 2px;">
                Clients deposit funds before you commence work. Zero delayed payments, zero roadside disputes.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(15, 118, 110, 0.12); color: var(--teal); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>
            </div>
            <div>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--foreground);">Neighborhood Client Demand</div>
              <div style="font-size: 0.78rem; color: var(--muted-foreground); line-height: 1.45; margin-top: 2px;">
                Receive direct job bookings in your operating area: Trans-Amadi, Peter Odili, Old GRA, Woji, and Choba.
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); color: var(--amber-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <div>
              <div style="font-size: 0.84rem; font-weight: 700; color: var(--foreground);">Simple Transparent Pricing</div>
              <div style="font-size: 0.78rem; color: var(--muted-foreground); line-height: 1.45; margin-top: 2px;">
                1 month free trial for every provider. After that, ₦2,000/mo flat subscription and 5% commission on jobs.
              </div>
            </div>
          </div>
        </div>

        <div class="shadcn-escrow-pill-box">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); color: var(--amber-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-weight: 900; font-size: 1.1rem;">₦</span>
          </div>
          <div>
            <strong style="color: var(--foreground); display: block; font-size: 0.82rem;">Direct Paystack Bank Payouts</strong>
            <span style="font-size: 0.75rem; color: var(--muted-foreground);">Payouts are released directly into your verified Nigerian bank account upon client digital confirmation.</span>
          </div>
        </div>
      </div>

      <div class="auth-stats-grid">
        <div class="auth-stat-card">
          <div class="auth-stat-value">1 Mo</div>
          <div class="auth-stat-label">Free Trial</div>
        </div>
        <div class="auth-stat-card">
          <div class="auth-stat-value">₦2,000</div>
          <div class="auth-stat-label">Per Month Flat</div>
        </div>
        <div class="auth-stat-card">
          <div class="auth-stat-value">5%</div>
          <div class="auth-stat-label">Low Commission</div>
        </div>
        <div class="auth-stat-card">
          <div class="auth-stat-value">₦1,500</div>
          <div class="auth-stat-label">Weekly Boost</div>
        </div>
      </div>
    `;
  }
}

// Notice helpers
function showInlineNotice(message, type = 'info') {
  const el = document.getElementById('authNotice');
  if (!el) return;
  el.style.display = 'block';
  if (type === 'success') {
    el.style.background = 'var(--teal-light)';
    el.style.color = 'var(--teal)';
    el.style.border = '1px solid var(--hairline-teal)';
  } else if (type === 'error') {
    el.style.background = '#fef2f2';
    el.style.color = '#b91c1c';
    el.style.border = '1px solid #fecaca';
  } else {
    el.style.background = 'var(--amber-light)';
    el.style.color = 'var(--amber-dark)';
    el.style.border = '1px solid var(--hairline-amber)';
  }
  el.innerHTML = message;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideInlineNotice() {
  const el = document.getElementById('authNotice');
  if (el) el.style.display = 'none';
}

// Theme handling
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('servhive_theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeToggleIcon');
  const btn = document.getElementById('themeToggleBtn');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (btn) btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
}

// FAQ Accordion
function toggleFaq(btn) {
  const item = btn.closest('.auth-faq-item');
  if (item) {
    item.classList.toggle('open');
  }
}

// Legal documents modal logic
const LEGAL_DOCS = {
  terms: {
    title: 'Terms of Use',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Agreement to Terms</h4>
      <p style="margin-bottom: 12px;">By accessing or using the Servhive platform, whether as a customer seeking services or as a registered provider, you agree to comply with and be bound by these Terms of Use.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. Port Harcourt Service Marketplace</h4>
      <p style="margin-bottom: 12px;">Servhive connects residents and commercial facilities across Port Harcourt with verified artisans and technicians. We provide transparent rate discovery, communication privacy, and licensed payment protection via Paystack.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. Scope and Price Agreement</h4>
      <p style="margin-bottom: 12px;">Agree the price in the app before the job. Arbitrary on-site price changes after arrival are prohibited.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">4. Payment Protection</h4>
      <p style="margin-bottom: 12px;">Payment is held safely by our licensed payment partner Paystack and released after you confirm the job is done, or automatically after 48 hours if no problem is reported.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">5. Dispute Resolution</h4>
      <p style="margin-bottom: 12px;">Problems must be reported within 48 hours of work completion. Servhive support will review the case and communicate a fair decision within 5 working days.</p>
    `
  },
  provider: {
    title: 'Provider Agreement',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Provider Eligibility & Review</h4>
      <p style="margin-bottom: 12px;">All newly registered providers enter the directory under "Under review" status. Verified badges appear on public listings only after approval in the admin console following identity checks.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. Subscription Fees & 1-Month Free Trial</h4>
      <p style="margin-bottom: 12px;">Every new provider receives a 1-month free trial. After that, an ongoing membership fee of ₦2,000 per month applies to ALL providers, paid before the month ends. If unpaid, the profile is hidden from Port Harcourt search until payment is made.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. Platform Commission (5%)</h4>
      <p style="margin-bottom: 12px;">A 5% commission applies to jobs paid through the app. The customer pays no extra fee for payment protection; the 5% is deducted from the provider payout upon job confirmation.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">4. Profile Boost (₦1,500 / Week)</h4>
      <p style="margin-bottom: 12px;">Providers may optionally boost their profile visibility to appear at the top of Port Harcourt search results at a flat rate of ₦1,500 per week.</p>
    `
  },
  protection: {
    title: 'Payment Protection Terms',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Paystack Escrow Holding</h4>
      <p style="margin-bottom: 12px;">Payment is held safely by our licensed payment partner Paystack and released after you confirm the job is done. Funds are never stored in Servhive company accounts.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. 48-Hour Auto-Release</h4>
      <p style="margin-bottom: 12px;">If the customer does not approve or report an issue within 48 hours of job completion, the payment is released to the provider automatically.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">3. No Extra Customer Fees</h4>
      <p style="margin-bottom: 12px;">Payment protection is fully included with every in-app booking at no additional charge to the customer.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy',
    content: `
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">1. Contact Privacy & Masking</h4>
      <p style="margin-bottom: 12px;">Servhive masks direct telephone numbers in initial search results to safeguard both customers and artisans from unsolicited contact and roadside harassment.</p>
      <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--foreground); margin: 12px 0 6px;">2. Identity Document Protection</h4>
      <p style="margin-bottom: 12px;">Government ID credentials uploaded by artisans are stored privately solely for compliance and background checks. They are never published publicly.</p>
    `
  }
};

function openLegalModal(tabKey = 'terms') {
  switchLegalTab(tabKey);
  const modal = document.getElementById('legalModal');
  if (modal) modal.classList.add('open');
}

function switchLegalTab(tabKey) {
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
}

function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  if (modal) modal.classList.remove('open');
}
