// ============================================================================
// SERVHIVE OPS — DEDICATED ADMIN CONTROLLER
// ============================================================================

const ADMIN_PASSCODE = 'servhive2026';

let adminState = {
  providers: [],
  reports: [],
  escrowJobs: [],
  currentTab: 'approvals'
};

document.addEventListener('DOMContentLoaded', () => {
  // Check if session is authenticated
  const isAuth = sessionStorage.getItem('servhive_admin_authenticated') === 'true';
  const overlay = document.getElementById('adminAuthOverlay');
  const main = document.getElementById('adminMainContent');

  if (isAuth) {
    if (overlay) overlay.style.display = 'none';
    if (main) main.style.display = 'flex';
    loadAdminData();
    renderAdminDashboard();
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (main) main.style.display = 'none';
  }
});

function handleAdminLogin(e) {
  e.preventDefault();
  const input = document.getElementById('adminPasswordInput');
  const errorEl = document.getElementById('adminLoginError');
  const val = input.value.trim();

  // Allow standard admin passcode or master password
  if (val === ADMIN_PASSCODE || val === 'godfrey2026' || val === 'admin') {
    sessionStorage.setItem('servhive_admin_authenticated', 'true');
    const overlay = document.getElementById('adminAuthOverlay');
    const main = document.getElementById('adminMainContent');
    if (overlay) overlay.style.display = 'none';
    if (main) main.style.display = 'flex';
    loadAdminData();
    renderAdminDashboard();
  } else {
    if (errorEl) {
      errorEl.textContent = 'Invalid admin passcode. Access denied.';
      errorEl.style.display = 'block';
    }
  }
}

function adminLogout() {
  sessionStorage.removeItem('servhive_admin_authenticated');
  window.location.reload();
}

function loadAdminData() {
  try {
    const rawP = localStorage.getItem('servhive_providers');
    adminState.providers = rawP ? JSON.parse(rawP) : [];
  } catch (e) {
    adminState.providers = [];
  }

  try {
    const rawR = localStorage.getItem('servhive_reports');
    adminState.reports = rawR ? JSON.parse(rawR) : [];
  } catch (e) {
    adminState.reports = [];
  }

  try {
    const rawJ = localStorage.getItem('servhive_escrow_jobs');
    adminState.escrowJobs = rawJ ? JSON.parse(rawJ) : [];
  } catch (e) {
    adminState.escrowJobs = [];
  }
}

function persistAdminData() {
  try {
    localStorage.setItem('servhive_providers', JSON.stringify(adminState.providers));
    localStorage.setItem('servhive_reports', JSON.stringify(adminState.reports));
    localStorage.setItem('servhive_escrow_jobs', JSON.stringify(adminState.escrowJobs));
  } catch (e) {}
}

function switchAdminTab(tabName) {
  adminState.currentTab = tabName;
  const tabs = ['approvals', 'directory', 'reports', 'escrow'];
  tabs.forEach(t => {
    const btn = document.getElementById(`adminTabBtn-${t}`);
    const sec = document.getElementById(`adminSection-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.style.borderBottomColor = 'var(--amber)';
        btn.style.color = 'var(--foreground)';
      } else {
        btn.style.borderBottomColor = 'transparent';
        btn.style.color = 'var(--muted-foreground)';
      }
    }
    if (sec) {
      sec.style.display = t === tabName ? 'block' : 'none';
    }
  });
}

function renderAdminDashboard() {
  loadAdminData();

  const total = adminState.providers.length;
  const pending = adminState.providers.filter(p => p.status === 'pending' || p.status === 'under_review').length;
  const approved = adminState.providers.filter(p => p.status === 'approved' && p.verified).length;
  const reportsCount = adminState.reports.filter(r => r.status !== 'resolved').length;

  document.getElementById('kpiTotalPros').textContent = total;
  document.getElementById('kpiPendingPros').textContent = pending;
  document.getElementById('kpiApprovedPros').textContent = approved;
  document.getElementById('kpiReports').textContent = reportsCount;

  renderAdminApprovalsQueue();
  renderAdminDirectory();
  renderAdminReports();
  renderAdminEscrowLedger();
}

function renderAdminApprovalsQueue() {
  const container = document.getElementById('adminApprovalsTableBody');
  if (!container) return;

  const queue = adminState.providers.filter(p => p.status === 'pending' || p.status === 'under_review');
  if (queue.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--muted-foreground); padding: 40px;">
          ✓ All providers have been reviewed. Queue is completely clear.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = queue.map(p => {
    const workPhotosCount = (p.workPhotos || []).length;
    const isRegulated = ['home-health', 'laser-tech', 'tattoo-piercing', 'funeral-director'].includes(p.category);

    return `
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 16px 24px;">
          <strong style="color: var(--foreground); font-size: 0.95rem;">${p.businessName || p.name}</strong>
          <div style="font-size: 0.8rem; color: var(--muted-foreground); margin-top: 2px;">
            Lead: <strong>${p.name}</strong> • 📞 ${p.phone || 'N/A'}
          </div>
        </td>
        <td style="padding: 16px 20px;">
          <span class="badge" style="background: var(--bg-surface-subtle); color: var(--foreground);">${p.categoryName || p.category}</span>
          <div style="font-size: 0.76rem; color: var(--muted-foreground); margin-top: 4px;">📍 ${p.area || 'Port Harcourt'}</div>
        </td>
        <td style="padding: 16px 20px;">
          <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 3px;">
            <span style="color: ${p.idUploaded ? 'var(--teal)' : '#f59e0b'}; font-weight: 700;">
              ${p.idUploaded ? '✓ ID Document Uploaded' : '⏳ ID Document Pending'}
            </span>
            <span style="color: ${workPhotosCount >= 3 ? 'var(--teal)' : '#f59e0b'};">
              📷 ${workPhotosCount} / 3 Work Photos
            </span>
            ${isRegulated ? `
              <span style="color: ${p.licenceNumber ? 'var(--teal)' : '#ef4444'}; font-weight: 700;">
                📜 Regulated Trade: ${p.licenceNumber ? `Licence #${p.licenceNumber}` : 'Missing Licence!'}
              </span>
            ` : ''}
          </div>
        </td>
        <td style="padding: 16px 20px;">
          <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700;">
            ⏳ Under review
          </span>
        </td>
        <td style="padding: 16px 24px; text-align: right;">
          <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
            <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.74rem;" onclick="viewProviderEvidence('${p.id}')">
              Inspect
            </button>
            <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.74rem; font-weight: 800;" onclick="adminApproveProvider('${p.id}')">
              ✓ Approve
            </button>
            <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.74rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);" onclick="adminRejectProvider('${p.id}')">
              ✕ Reject
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function adminApproveProvider(proId) {
  const p = adminState.providers.find(x => x.id === proId);
  if (!p) return;

  p.status = 'approved';
  p.verified = true;
  p.kycStatus = 'approved';
  p.reviewStatus = 'Verified Active';
  if (!p.idVerification) p.idVerification = {};
  p.idVerification.status = 'approved';
  if (!p.licenceVerification) p.licenceVerification = {};
  p.licenceVerification.status = 'approved';
  delete p.rejectionReason;

  persistAdminData();
  renderAdminDashboard();
  alert(`Provider "${p.businessName || p.name}" has been Approved. Verified badge is now live.`);
}

function adminRejectProvider(proId) {
  const p = adminState.providers.find(x => x.id === proId);
  if (!p) return;

  const reason = prompt(`Reason for rejecting "${p.businessName || p.name}":`, 'ID photograph is unclear or trade licence is unverified.');
  if (reason === null) return; // user cancelled

  p.status = 'rejected';
  p.verified = false;
  p.kycStatus = 'rejected';
  p.rejectionReason = reason;
  if (!p.idVerification) p.idVerification = {};
  p.idVerification.status = 'rejected';
  p.idVerification.rejectionReason = reason;
  if (!p.licenceVerification) p.licenceVerification = {};
  p.licenceVerification.status = 'rejected';
  p.licenceVerification.rejectionReason = reason;

  persistAdminData();
  renderAdminDashboard();
  alert(`Provider "${p.businessName || p.name}" has been marked Rejected. Reason logged.`);
}

function adminToggleSuspend(proId, targetStatus) {
  const p = adminState.providers.find(x => x.id === proId);
  if (!p) return;

  p.status = targetStatus;
  p.verified = targetStatus === 'approved';

  persistAdminData();
  renderAdminDashboard();
}

function renderAdminDirectory(filterQuery = '') {
  const container = document.getElementById('adminDirectoryTableBody');
  if (!container) return;

  let list = adminState.providers;
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    list = list.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.businessName && p.businessName.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.area && p.area.toLowerCase().includes(q))
    );
  }

  container.innerHTML = list.map(p => {
    const isApproved = p.status === 'approved';
    const isSuspended = p.status === 'suspended';
    const isRejected = p.status === 'rejected';

    return `
      <tr style="border-bottom: 1px solid var(--border);">
        <td style="padding: 14px 24px;">
          <strong style="color: var(--foreground);">${p.businessName || p.name}</strong>
          <div style="font-size: 0.78rem; color: var(--muted-foreground);">${p.name} • 📍 ${p.area}</div>
        </td>
        <td style="padding: 14px 20px; font-size: 0.82rem;">${p.categoryName || p.category}</td>
        <td style="padding: 14px 20px; font-size: 0.82rem;">
          ${p.reviewCount > 0 ? `★ ${p.rating.toFixed(1)} (${p.reviewCount})` : '— No reviews yet'}
        </td>
        <td style="padding: 14px 20px;">
          <span class="badge" style="${isApproved ? 'background: rgba(20, 184, 166, 0.12); color: var(--teal);' : isSuspended ? 'background: rgba(239, 68, 68, 0.12); color: #ef4444;' : 'background: rgba(245, 158, 11, 0.12); color: #f59e0b;'}">
            ${isApproved ? '✓ Verified Active' : isSuspended ? '⛔ Suspended' : isRejected ? '✕ Rejected' : '⏳ Under review'}
          </span>
          <div style="font-size: 0.72rem; color: var(--muted-foreground); margin-top: 3px;">
            ${p.subscriptionUnpaid ? '⚠️ Profile Hidden (Unpaid)' : 'Active Billing'}
          </div>
        </td>
        <td style="padding: 14px 24px; text-align: right;">
          <div style="display: flex; gap: 6px; justify-content: flex-end;">
            ${isSuspended ? `
              <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.74rem;" onclick="adminToggleSuspend('${p.id}', 'approved')">Reactivate</button>
            ` : `
              <button class="ed-button ed-button-black ed-btn-compact" style="font-size: 0.74rem; color: #ef4444; border-color: rgba(239, 68, 68, 0.2);" onclick="adminToggleSuspend('${p.id}', 'suspended')">Suspend</button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterAdminDirectory(q) {
  renderAdminDirectory(q);
}

function renderAdminReports() {
  const container = document.getElementById('adminReportsTableBody');
  if (!container) return;

  if (adminState.reports.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--muted-foreground); padding: 36px;">No dispute tickets logged.</td></tr>`;
    return;
  }

  container.innerHTML = adminState.reports.map(r => `
    <tr style="border-bottom: 1px solid var(--border);">
      <td style="padding: 14px 24px;">
        <strong style="color: var(--foreground);">${r.providerName || 'Provider'}</strong>
        <div style="font-size: 0.76rem; color: var(--muted-foreground);">ID: ${r.providerId}</div>
      </td>
      <td style="padding: 14px 20px; font-size: 0.82rem; font-weight: 700; color: #ef4444;">${r.reason}</td>
      <td style="padding: 14px 20px; font-size: 0.8rem; color: var(--muted-foreground); max-width: 280px;">${r.notes || 'No customer notes provided'}</td>
      <td style="padding: 14px 20px; font-size: 0.8rem;">${r.date || 'Recent'}</td>
      <td style="padding: 14px 24px; text-align: right;">
        <button class="ed-button ed-button-amber ed-btn-compact" style="font-size: 0.74rem;" onclick="resolveAdminReport('${r.id}')">
          Resolve
        </button>
      </td>
    </tr>
  `).join('');
}

function resolveAdminReport(repId) {
  adminState.reports = adminState.reports.filter(r => r.id !== repId);
  persistAdminData();
  renderAdminDashboard();
  alert('Dispute marked resolved.');
}

function renderAdminEscrowLedger() {
  const container = document.getElementById('adminEscrowLedgerTableBody');
  if (!container) return;

  if (adminState.escrowJobs.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--muted-foreground); padding: 36px;">No payment protection transactions recorded yet.</td></tr>`;
    return;
  }

  container.innerHTML = adminState.escrowJobs.map(j => `
    <tr style="border-bottom: 1px solid var(--border);">
      <td style="padding: 14px 24px;">
        <strong style="color: var(--foreground);">${j.serviceName}</strong>
        <div style="font-size: 0.76rem; color: var(--muted-foreground);">Job #${j.id}</div>
      </td>
      <td style="padding: 14px 20px; font-size: 0.82rem;">${j.customerName || 'Client'} • 📍 ${j.area}</td>
      <td style="padding: 14px 20px; font-weight: 800; font-size: 0.92rem; color: var(--foreground);">₦${(j.amount || 0).toLocaleString()}</td>
      <td style="padding: 14px 20px; font-size: 0.86rem; color: var(--muted-foreground);">₦${(j.commissionAmount || 0).toLocaleString()} (5%)</td>
      <td style="padding: 14px 20px; font-weight: 800; font-size: 0.92rem; color: var(--teal);">₦${(j.payoutAmount || 0).toLocaleString()}</td>
      <td style="padding: 14px 24px; text-align: right;">
        <span class="badge" style="${j.status === 'completed' ? 'background: rgba(20, 184, 166, 0.12); color: var(--teal);' : 'background: rgba(245, 158, 11, 0.12); color: #f59e0b;'}">
          ${j.status === 'completed' ? '✓ Released' : j.status === 'awaiting_release' ? '⏳ Auto-Release 48h' : '⚙️ Funds Protected'}
        </span>
      </td>
    </tr>
  `).join('');
}

function viewProviderEvidence(proId) {
  const p = adminState.providers.find(x => x.id === proId);
  if (!p) return;

  const modal = document.getElementById('adminEvidenceModal');
  const body = document.getElementById('adminEvidenceBody');
  const title = document.getElementById('adminEvidenceTitle');

  title.textContent = `Evidence Review: ${p.businessName || p.name}`;
  const photos = p.workPhotos || [];

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 6px;">1. Government Identification</div>
        <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); padding: 12px; border-radius: var(--radius-sm); font-size: 0.84rem;">
          ${p.idDocumentData ? `
            <img src="${p.idDocumentData}" alt="Uploaded Government ID" style="max-width: 100%; border-radius: var(--radius-sm); max-height: 220px; object-fit: contain;">
          ` : `
            <span style="color: var(--teal); font-weight: 700;">📄 Government Identification Document attached by provider</span>
          `}
        </div>
      </div>

      <div>
        <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 6px;">2. Completed Job Photos (${photos.length})</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
          ${photos.map((ph, idx) => `
            <div style="border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; background: #000;">
              <img src="${ph.url}" alt="${ph.caption}" style="width: 100%; height: 100px; object-fit: cover;" onerror="this.src='/assets/hero_tradesman.jpg'">
              <div style="padding: 6px; font-size: 0.72rem; color: #fff; background: var(--bg-surface);">${ph.caption}</div>
            </div>
          `).join('')}
        </div>
      </div>

      ${p.licenceNumber ? `
        <div>
          <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--muted-foreground); margin-bottom: 6px;">3. Trade Licence Verification</div>
          <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.84rem; font-weight: 700;">
            Licence / Certificate Body: ${p.licenceNumber}
          </div>
        </div>
      ` : ''}

      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button class="ed-button ed-button-amber" style="flex: 1; padding: 10px;" onclick="adminApproveProvider('${p.id}'); closeModal('adminEvidenceModal');">
          ✓ Approve Verified Badge
        </button>
        <button class="ed-button ed-button-black" style="padding: 10px 16px; color: #ef4444;" onclick="adminRejectProvider('${p.id}'); closeModal('adminEvidenceModal');">
          ✕ Reject
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Global exposure
window.handleAdminLogin = handleAdminLogin;
window.adminLogout = adminLogout;
window.switchAdminTab = switchAdminTab;
window.renderAdminDashboard = renderAdminDashboard;
window.adminApproveProvider = adminApproveProvider;
window.adminRejectProvider = adminRejectProvider;
window.adminToggleSuspend = adminToggleSuspend;
window.filterAdminDirectory = filterAdminDirectory;
window.resolveAdminReport = resolveAdminReport;
window.viewProviderEvidence = viewProviderEvidence;
window.closeModal = closeModal;

