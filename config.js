const state = {
  supabase: null,
  session: null,
  profile: null,
  profiles: [],
  attendance: [],
  leaveRequests: [],
  demoMode: false,
  currentLat: null,
  currentLng: null,
};

const demoProfiles = [
  { id: 'staff-1', full_name: 'Aiman Staff', email: 'staff@demo.com', role: 'staff' },
  { id: 'admin-1', full_name: 'Nadia Admin', email: 'admin@demo.com', role: 'admin' },
  { id: 'super-admin-1', full_name: 'Zulkifli Super Admin', email: 'superadmin@demo.com', role: 'super_admin' },
];

const demoAttendance = [
  {
    id: 'att-1',
    user_id: 'staff-1',
    created_at: new Date().toISOString(),
    check_in_at: new Date().toISOString(),
    check_out_at: null,
    check_in_lat: 3.139,
    check_in_lng: 101.686,
    check_out_lat: null,
    check_out_lng: null,
    work_minutes: 0,
  },
  {
    id: 'att-2',
    user_id: 'staff-1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    check_in_at: new Date(Date.now() - 86400000 + 9 * 60 * 60 * 1000).toISOString(),
    check_out_at: new Date(Date.now() - 86400000 + 17 * 60 * 60 * 1000).toISOString(),
    check_in_lat: 3.139,
    check_in_lng: 101.686,
    check_out_lat: 3.139,
    check_out_lng: 101.686,
    work_minutes: 480,
  },
];

const demoLeaveRequests = [
  { id: 'leave-1', user_id: 'staff-1', full_name: 'Aiman Staff', start_date: '2026-11-10', end_date: '2026-11-12', reason: 'Kehadiran keluarga', status: 'pending' },
  { id: 'leave-2', user_id: 'admin-1', full_name: 'Nadia Admin', start_date: '2026-11-09', end_date: '2026-11-09', reason: 'Lawatan klinik', status: 'approved' },
];

const demoSessions = {
  'admin@demo.com': { password: 'demo123', profile: demoProfiles[1] },
  'staff@demo.com': { password: 'demo123', profile: demoProfiles[0] },
  'superadmin@demo.com': { password: 'demo123', profile: demoProfiles[2] },
};

const elements = {
  authView: document.getElementById('auth-view'),
  dashboardView: document.getElementById('dashboard-view'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  logoutButton: document.getElementById('logout-button'),
  checkInButton: document.getElementById('check-in-button'),
  checkOutButton: document.getElementById('check-out-button'),
  leaveForm: document.getElementById('leave-form'),
  locationStatus: document.getElementById('location-status'),
  currentRoleBadge: document.getElementById('current-role-badge'),
  statusPill: document.getElementById('status-pill'),
  statHours: document.getElementById('stat-hours'),
  statLeaves: document.getElementById('stat-leaves'),
  statStaff: document.getElementById('stat-staff'),
  adminPanel: document.getElementById('admin-panel'),
  leaveReviewPanel: document.getElementById('leave-review-panel'),
  staffList: document.getElementById('staff-list'),
  leaveList: document.getElementById('leave-list'),
  attendanceList: document.getElementById('attendance-list'),
};

function init() {
  bindEvents();
  initSupabase();
  updateDemoState();
  renderDashboard();
}

function bindEvents() {
  document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;
      const isLogin = target === 'login';
      document.querySelectorAll('.tab-btn').forEach((tab) => tab.classList.toggle('active', tab === button));
      document.getElementById('login-form').classList.toggle('hidden', !isLogin);
      document.getElementById('register-form').classList.toggle('hidden', isLogin);
    });
  });

  elements.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    await login({ email, password });
  });

  elements.registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const full_name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    await registerUser({ full_name, email, password, role });
  });

  elements.logoutButton.addEventListener('click', logout);
  elements.checkInButton.addEventListener('click', handleCheckIn);
  elements.checkOutButton.addEventListener('click', handleCheckOut);
  elements.leaveForm.addEventListener('submit', handleLeaveRequest);
}

function initSupabase() {
  const config = window.SUPABASE_CONFIG || {};
  const hasValidConfig = config.url && config.url.includes('supabase.co') && config.anonKey && !config.anonKey.includes('YOUR_');

  if (hasValidConfig && window.supabase) {
    state.supabase = window.supabase.createClient(config.url, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
    state.demoMode = false;
  } else {
    state.demoMode = true;
  }
}

function updateDemoState() {
  if (!state.demoMode) return;
  state.profiles = demoProfiles;
  state.attendance = demoAttendance;
  state.leaveRequests = demoLeaveRequests;
}

async function login({ email, password }) {
  if (state.demoMode) {
    const user = demoSessions[email];
    if (!user || user.password !== password) {
      alert('Maklumat login tidak sah.');
      return;
    }

    state.profile = { ...user.profile, email };
    state.session = { user: { email } };
    showDashboard();
    renderDashboard();
    return;
  }

  const { data, error } = await state.supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message || 'Gagal log masuk');
    return;
  }

  state.session = data;
  await loadProfileFromSupabase();
  showDashboard();
  renderDashboard();
}

async function registerUser({ full_name, email, password, role }) {
  if (state.demoMode) {
    alert('Daftar melalui demo tidak disambungkan ke Supabase. Sila gunakan fail config.js dan sambungan Supabase sebenar.');
    return;
  }

  const { data, error } = await state.supabase.auth.signUp({ email, password });
  if (error) {
    alert(error.message || 'Gagal mendaftar');
    return;
  }

  const { error: profileError } = await state.supabase.from('profiles').insert({
    id: data.user.id,
    full_name,
    email,
    role,
    created_at: new Date().toISOString(),
  });

  if (profileError) {
    alert(profileError.message || 'Gagal menyimpan profil');
    return;
  }

  alert('Akaun berjaya didaftarkan. Sila semak emel anda untuk pengesahan.');
  document.querySelector('.tab-btn[data-tab="login"]').click();
}

async function logout() {
  if (state.demoMode) {
    state.session = null;
    state.profile = null;
    showAuth();
    return;
  }

  const { error } = await state.supabase.auth.signOut();
  if (error) {
    alert(error.message || 'Gagal logout');
    return;
  }

  state.session = null;
  state.profile = null;
  showAuth();
}

async function loadData() {
  if (!state.supabase || state.demoMode) {
    state.profiles = demoProfiles;
    state.attendance = demoAttendance;
    state.leaveRequests = demoLeaveRequests;
    return;
  }

  const [profilesResult, attendanceResult, leaveResult] = await Promise.all([
    state.supabase.from('profiles').select('*').order('full_name'),
    state.supabase.from('attendance').select('*').order('check_in_at', { ascending: false }),
    state.supabase.from('leave_requests').select('*').order('created_at', { ascending: false }),
  ]);

  if (profilesResult.data) state.profiles = profilesResult.data;
  if (attendanceResult.data) state.attendance = attendanceResult.data;
  if (leaveResult.data) state.leaveRequests = leaveResult.data;
}

async function loadProfileFromSupabase() {
  if (!state.supabase) return;

  const { data: profileData } = await state.supabase.from('profiles').select('*').eq('id', state.session.user.id).single();
  state.profile = profileData;
  await loadData();
}

function showAuth() {
  elements.authView.classList.remove('hidden');
  elements.dashboardView.classList.add('hidden');
}

function showDashboard() {
  elements.authView.classList.add('hidden');
  elements.dashboardView.classList.remove('hidden');
}

function renderDashboard() {
  if (!state.profile) {
    showAuth();
    return;
  }

  showDashboard();

  const role = state.profile.role || 'staff';
  elements.currentRoleBadge.textContent = role.replace('_', ' ');

  const visibleStaff = role === 'staff'
    ? state.profiles.filter((person) => person.id === state.profile.id)
    : state.profiles;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const todayHours = (state.attendance || [])
    .filter((record) => {
      const userMatch = role === 'staff' ? record.user_id === state.profile.id : true;
      const recordDate = new Date(record.check_in_at);
      return userMatch && recordDate >= todayStart;
    })
    .reduce((sum, record) => sum + Number(record.work_minutes || 0), 0);

  const totalHoursText = formatMinutes(todayHours);
  elements.statHours.textContent = totalHoursText;
  elements.statLeaves.textContent = (state.leaveRequests || []).filter((leave) => {
    const userMatch = role === 'staff' ? leave.user_id === state.profile.id : true;
    return userMatch && leave.status === 'approved';
  }).length;

  const staffCount = visibleStaff.length;
  elements.statStaff.textContent = String(staffCount);

  const activeAttendance = (state.attendance || []).find((record) => {
    const userMatch = role === 'staff' ? record.user_id === state.profile.id : true;
    return userMatch && !record.check_out_at;
  });

  elements.statusPill.textContent = activeAttendance ? 'Sedang Bekerja' : 'Belum Log Masuk';
  elements.statusPill.style.background = activeAttendance ? 'rgba(22,163,74,0.12)' : 'rgba(148,163,184,0.12)';
  elements.statusPill.style.color = activeAttendance ? '#149c5b' : '#475569';

  elements.adminPanel.classList.toggle('hidden', !(role === 'admin' || role === 'super_admin'));
  elements.leaveReviewPanel.classList.toggle('hidden', !(role === 'admin' || role === 'super_admin'));

  renderStaffList(visibleStaff, role);
  renderLeaveList(role);
  renderAttendanceList(role);
}

function renderStaffList(staff, role) {
  if (role === 'staff') {
    elements.staffList.innerHTML = '<div class="empty-state">Tiada maklumat tambahan untuk paparan staff.</div>';
    return;
  }

  if (!staff.length) {
    elements.staffList.innerHTML = '<div class="empty-state">Tiada rekod staff.</div>';
    return;
  }

  const rows = staff
    .map((person) => {
      const totalWorked = (state.attendance || [])
        .filter((record) => record.user_id === person.id)
        .reduce((sum, record) => sum + Number(record.work_minutes || 0), 0);

      return `
        <div class="table-row">
          <div class="table-row-header">
            <div>
              <div class="row-name">${person.full_name || person.email}</div>
              <div class="meta">${person.email} · ${person.role}</div>
            </div>
            <span class="status-tag approved">${formatMinutes(totalWorked)}</span>
          </div>
        </div>
      `;
    })
    .join('');

  elements.staffList.innerHTML = rows;
}

function renderLeaveList(role) {
  const items = (state.leaveRequests || []).filter((leave) => {
    if (role === 'staff') {
      return leave.user_id === state.profile.id;
    }
    return true;
  });

  if (!items.length) {
    elements.leaveList.innerHTML = '<div class="empty-state">Tiada permohonan cuti.</div>';
    return;
  }

  const rows = items
    .map((leave) => {
      const actions = role === 'staff'
        ? ''
        : `
          <div class="row-actions">
            <button class="primary-btn" data-leave-action="approved" data-leave-id="${leave.id}">Lulus</button>
            <button class="danger-btn" data-leave-action="rejected" data-leave-id="${leave.id}">Tolak</button>
          </div>
        `;

      return `
        <div class="table-row">
          <div class="table-row-header">
            <div>
              <div class="row-name">${leave.full_name || 'Pemohon'}</div>
              <div class="meta">${leave.start_date} - ${leave.end_date}</div>
            </div>
            <span class="status-tag ${leave.status || 'pending'}">${leave.status || 'pending'}</span>
          </div>
          <div class="meta">Sebab: ${leave.reason}</div>
          ${actions}
        </div>
      `;
    })
    .join('');

  elements.leaveList.innerHTML = rows;
  attachLeaveActionHandlers();
}

function renderAttendanceList(role) {
  const items = (state.attendance || []).filter((record) => {
    if (role === 'staff') {
      return record.user_id === state.profile.id;
    }
    return true;
  });

  if (!items.length) {
    elements.attendanceList.innerHTML = '<div class="empty-state">Tiada rekod kehadiran.</div>';
    return;
  }

  const rows = items
    .map((record) => {
      const fullName = (state.profiles || []).find((person) => person.id === record.user_id)?.full_name || 'Staff';
      return `
        <div class="table-row">
          <div class="table-row-header">
            <div>
              <div class="row-name">${fullName}</div>
              <div class="meta">Check in: ${formatDate(record.check_in_at)} · Check out: ${record.check_out_at ? formatDate(record.check_out_at) : 'Masih aktif'}</div>
            </div>
            <span class="status-tag approved">${formatMinutes(Number(record.work_minutes || 0))}</span>
          </div>
        </div>
      `;
    })
    .join('');

  elements.attendanceList.innerHTML = rows;
}

function attachLeaveActionHandlers() {
  document.querySelectorAll('[data-leave-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.dataset.leaveAction;
      const id = button.dataset.leaveId;
      await updateLeaveStatus(id, action);
    });
  });
}

async function updateLeaveStatus(leaveId, status) {
  if (state.demoMode) {
    state.leaveRequests = state.leaveRequests.map((leave) => leave.id === leaveId ? { ...leave, status } : leave);
    renderDashboard();
    return;
  }

  const { error } = await state.supabase.from('leave_requests').update({ status }).eq('id', leaveId);
  if (error) {
    alert(error.message || 'Gagal kemaskini cuti');
    return;
  }

  await loadData();
  renderDashboard();
}

async function handleCheckIn() {
  const { lat, lng } = await getLocation();
  if (!lat || !lng) {
    alert('Lokasi tidak dapat ditentukan. Benarkan akses geolokasi untuk check in.');
    return;
  }

  const now = new Date().toISOString();

  if (state.demoMode) {
    const activeRecord = state.attendance.find((record) => record.user_id === state.profile.id && !record.check_out_at);
    if (activeRecord) {
      alert('Anda masih ada sesi check in yang belum ditutup.');
      return;
    }

    state.attendance.unshift({
      id: `demo-${Date.now()}`,
      user_id: state.profile.id,
      created_at: now,
      check_in_at: now,
      check_out_at: null,
      check_in_lat: lat,
      check_in_lng: lng,
      check_out_lat: null,
      check_out_lng: null,
      work_minutes: 0,
    });
    renderDashboard();
    return;
  }

  const { error } = await state.supabase.from('attendance').insert({
    user_id: state.profile.id,
    check_in_at: now,
    check_in_lat: lat,
    check_in_lng: lng,
    work_minutes: 0,
  });

  if (error) {
    alert(error.message || 'Gagal check in');
    return;
  }

  await loadData();
  renderDashboard();
}

async function handleCheckOut() {
  const { lat, lng } = await getLocation();
  if (!lat || !lng) {
    alert('Lokasi tidak dapat ditentukan. Benarkan akses geolokasi untuk check out.');
    return;
  }

  if (state.demoMode) {
    const activeRecord = state.attendance.find((record) => record.user_id === state.profile.id && !record.check_out_at);
    if (!activeRecord) {
      alert('Tiada rekod check in aktif untuk ditutup.');
      return;
    }

    const checkInTime = new Date(activeRecord.check_in_at).getTime();
    const checkOutTime = Date.now();
    const workMinutes = Math.max(0, Math.round((checkOutTime - checkInTime) / 60000));
    activeRecord.check_out_at = new Date(checkOutTime).toISOString();
    activeRecord.check_out_lat = lat;
    activeRecord.check_out_lng = lng;
    activeRecord.work_minutes = workMinutes;
    renderDashboard();
    return;
  }

  const activeRecord = (state.attendance || []).find((record) => record.user_id === state.profile.id && !record.check_out_at);
  if (!activeRecord) {
    alert('Tiada rekod check in aktif untuk ditutup.');
    return;
  }

  const checkOutTime = new Date().toISOString();
  const checkInTime = new Date(activeRecord.check_in_at).getTime();
  const workMinutes = Math.max(0, Math.round((new Date(checkOutTime).getTime() - checkInTime) / 60000));

  const { error } = await state.supabase.from('attendance').update({
    check_out_at: checkOutTime,
    check_out_lat: lat,
    check_out_lng: lng,
    work_minutes: workMinutes,
  }).eq('id', activeRecord.id);

  if (error) {
    alert(error.message || 'Gagal check out');
    return;
  }

  await loadData();
  renderDashboard();
}

async function handleLeaveRequest(event) {
  event.preventDefault();
  const start_date = document.getElementById('leave-start').value;
  const end_date = document.getElementById('leave-end').value;
  const reason = document.getElementById('leave-reason').value.trim();

  if (!start_date || !end_date || !reason) {
    alert('Sila isi semua medan permohonan cuti.');
    return;
  }

  if (state.demoMode) {
    state.leaveRequests.unshift({
      id: `leave-${Date.now()}`,
      user_id: state.profile.id,
      full_name: state.profile.full_name,
      start_date,
      end_date,
      reason,
      status: 'pending',
    });
    event.target.reset();
    renderDashboard();
    return;
  }

  const { error } = await state.supabase.from('leave_requests').insert({
    user_id: state.profile.id,
    start_date,
    end_date,
    reason,
    status: 'pending',
  });

  if (error) {
    alert(error.message || 'Gagal menghantar permohonan cuti');
    return;
  }

  event.target.reset();
  await loadData();
  renderDashboard();
}

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: null, lng: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;
        state.currentLat = coords.latitude;
        state.currentLng = coords.longitude;
        elements.locationStatus.textContent = `Lokasi sah: ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
        resolve({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        resolve({ lat: null, lng: null });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('ms-MY');
}

init();
