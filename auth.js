const CLERK_PUBLISHABLE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) ||
  'pk_test_cG9zaXRpdmUtd2VyZXdvbGYtNzk3OC5jbGVyay5hY2NvdW50cy5kZXYk';

// Development instance frontend API for Servhive
const CLERK_SCRIPT_URL =
  'https://positive-werewolf-7978.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
const CLERK_FALLBACK_URL =
  'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';

let clerkInitPromise = null;

/**
 * Loads the official standalone Clerk Browser script with full UI components.
 */
function loadClerkBrowserScript() {
  if (window.Clerk) {
    return Promise.resolve(window.Clerk);
  }

  return new Promise((resolve, reject) => {
    // Check if script tag already exists in DOM
    const existing = document.querySelector('script[data-clerk-script="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Clerk));
      existing.addEventListener('error', () => reject(new Error('Failed to load Clerk script')));
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
    script.setAttribute('data-clerk-script', 'true');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = CLERK_SCRIPT_URL;

    script.onload = () => {
      if (window.Clerk) {
        resolve(window.Clerk);
      } else {
        reject(new Error('Clerk script loaded but window.Clerk is undefined'));
      }
    };

    script.onerror = () => {
      console.warn('Primary Clerk script failed. Attempting fallback CDN...');
      const fallback = document.createElement('script');
      fallback.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY);
      fallback.setAttribute('data-clerk-script', 'true');
      fallback.async = true;
      fallback.crossOrigin = 'anonymous';
      fallback.src = CLERK_FALLBACK_URL;
      fallback.onload = () => resolve(window.Clerk);
      fallback.onerror = (e) => reject(new Error('Both Clerk script endpoints failed to load: ' + e));
      document.head.appendChild(fallback);
    };

    document.head.appendChild(script);
  });
}

/**
 * Initializes and returns the shared Clerk instance with UI components ready.
 */
export async function getClerk() {
  if (window.Clerk && window.Clerk.loaded) {
    return window.Clerk;
  }

  if (clerkInitPromise) {
    return clerkInitPromise;
  }

  clerkInitPromise = (async () => {
    try {
      await loadClerkBrowserScript();

      const clerk = window.Clerk;
      if (!clerk) {
        throw new Error('window.Clerk unavailable after script load');
      }

      if (!clerk.loaded) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        await clerk.load({
          appearance: {
            variables: {
              colorPrimary: '#f59e0b',
              colorText: isDark ? '#f8fafc' : '#0f172a',
              colorBackground: isDark ? '#18181b' : '#ffffff',
              colorInputBackground: isDark ? '#09090b' : '#ffffff',
              colorInputText: isDark ? '#f8fafc' : '#0f172a',
              borderRadius: '0.625rem',
              fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            },
            elements: {
              card: 'shadcn-clerk-card',
              headerTitle: 'shadcn-clerk-title',
              headerSubtitle: 'shadcn-clerk-subtitle',
              formButtonPrimary: 'shadcn-clerk-btn-primary',
              footerActionLink: 'shadcn-clerk-link',
              socialButtonsBlockButton: 'shadcn-clerk-social-btn',
              formFieldInput: 'shadcn-clerk-input'
            }
          }
        });
      }

      return clerk;
    } catch (err) {
      console.error('Failed to initialize Clerk SDK:', err);
      clerkInitPromise = null;
      throw err;
    }
  })();

  return clerkInitPromise;
}

/**
 * Synchronizes a Clerk User object into Servhive's localStorage session
 */
export function syncClerkToServhiveUser(clerkUser, intendedRole = null) {
  if (!clerkUser) return null;

  let localUser = null;
  try {
    localUser = JSON.parse(localStorage.getItem('servhive_current_user'));
  } catch (e) {}

  // Determine role: intendedRole > localUser.role > clerk unsafeMetadata > 'hirer'
  const role = intendedRole || (localUser && localUser.role) || clerkUser.unsafeMetadata?.role || 'hirer';
  const name =
    clerkUser.fullName ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
    clerkUser.username ||
    clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'Servhive User';

  const email = clerkUser.primaryEmailAddress?.emailAddress || (localUser ? localUser.email : '');
  const phone = clerkUser.primaryPhoneNumber?.phoneNumber || (localUser ? localUser.phone : '');

  // Check if there is pending artisan profile setup from signup
  let pendingArtisan = null;
  try {
    pendingArtisan = JSON.parse(sessionStorage.getItem('servhive_pending_artisan_profile'));
  } catch (e) {}

  const businessName =
    role === 'artisan'
      ? (pendingArtisan?.businessName || localUser?.businessName || clerkUser.unsafeMetadata?.businessName || `${name} Pro Services`)
      : null;

  const category =
    role === 'artisan'
      ? (pendingArtisan?.category || localUser?.category || clerkUser.unsafeMetadata?.category || 'power-gen')
      : null;

  const trade =
    role === 'artisan'
      ? (pendingArtisan?.trade || localUser?.trade || clerkUser.unsafeMetadata?.trade || 'Power & Generators')
      : null;

  const area =
    pendingArtisan?.area || localUser?.area || clerkUser.unsafeMetadata?.area || 'Trans-Amadi';

  const startingPrice =
    role === 'artisan'
      ? (pendingArtisan?.startingPrice || localUser?.startingPrice || 10000)
      : null;

  const user = {
    id: clerkUser.id,
    name: name,
    email: email,
    phone: phone,
    role: role,
    avatar: clerkUser.imageUrl || null,
    businessName: businessName,
    trade: trade,
    category: category,
    area: area,
    startingPrice: startingPrice,
    verified: role === 'artisan' ? true : false,
    authProvider: 'clerk'
  };

  localStorage.setItem('servhive_current_user', JSON.stringify(user));

  // If artisan, ensure in servhive_providers list as well
  if (role === 'artisan') {
    try {
      const providers = JSON.parse(localStorage.getItem('servhive_providers')) || [];
      const existingIdx = providers.findIndex(p => p.id === 'pro-' + user.id || p.name === user.name || (p.email && p.email === user.email));
      if (existingIdx === -1) {
        const newPro = {
          id: 'pro-' + user.id,
          name: user.name,
          businessName: businessName,
          category: category,
          categoryName: trade,
          subSpecialty: `${trade} Specialist`,
          area: area,
          rating: 5.0,
          reviewCount: 1,
          reviews: [],
          verified: false,
          status: 'under_review',
          image: user.avatar || '/assets/hero_tradesman.jpg',
          startingPrice: startingPrice || 10000,
          responseTime: '~15 mins',
          bio: `${businessName} is a Port Harcourt workshop located in ${area}. ID checked by Servhive (Under review).`,
          workPhotos: [],
          services: [],
          areasCovered: [area, 'Peter Odili Road', 'Trans-Amadi', 'Old GRA', 'Woji']
        };
        providers.unshift(newPro);
        localStorage.setItem('servhive_providers', JSON.stringify(providers));
      }
    } catch (e) {}
  }

  // Clear pending profile once consumed
  sessionStorage.removeItem('servhive_pending_artisan_profile');

  // Attempt to update clerk user metadata in background
  try {
    if (clerkUser.update && (!clerkUser.unsafeMetadata?.role || clerkUser.unsafeMetadata?.role !== role)) {
      clerkUser.update({
        unsafeMetadata: {
          role: role,
          businessName: businessName,
          trade: trade,
          category: category,
          area: area
        }
      }).catch(() => {});
    }
  } catch (e) {}

  return user;
}

/**
 * Universal sign-out function for Servhive
 */
export async function signOutServhive() {
  localStorage.removeItem('servhive_current_user');
  sessionStorage.removeItem('servhive_pending_artisan_profile');
  try {
    const clerk = await getClerk();
    if (clerk && clerk.user) {
      await clerk.signOut();
    }
  } catch (e) {
    console.warn('Error during Clerk signOut:', e);
  }
}
