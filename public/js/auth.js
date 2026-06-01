// ═══════════════════════════════════════════════════════════
//  TRAVENCIA — Client Auth  (Railway-ready)
//  Same-origin API — no hardcoded localhost
// ═══════════════════════════════════════════════════════════

// Auto-detects host: works locally AND on Railway
const AUTH_API = window.location.origin;

// ── Token helpers ────────────────────────────────────────
function getToken()   { return localStorage.getItem('tv_token') || ''; }
function setToken(t)  { localStorage.setItem('tv_token', t); }
function clearToken() { localStorage.removeItem('tv_token'); localStorage.removeItem('tv_user'); }

function parseToken(tok) {
  try {
    return JSON.parse(atob(tok.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
  } catch { return null; }
}

function tokenExpiresInDays(tok) {
  const pl = parseToken(tok);
  return pl?.exp ? (pl.exp - Date.now()/1000) / 86400 : 0;
}

async function silentRefresh() {
  const tok = getToken();
  if (!tok) return false;
  try {
    const r = await fetch(AUTH_API + '/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+tok }
    });
    const d = await r.json();
    if (d.success && d.data.token) {
      setToken(d.data.token);
      localStorage.setItem('tv_user', JSON.stringify(d.data));
      return true;
    }
  } catch {}
  return false;
}

// ── Build auth modal HTML ─────────────────────────────────
function buildAuthModal() {
  if (document.getElementById('tvAuthModal')) return;
  const m = document.createElement('div');
  m.innerHTML = `
  <div class="overlay" id="tvAuthModal" style="display:none;z-index:9999">
    <div class="modal" style="max-width:460px;width:94vw">
      <button class="m-close" onclick="closeAuthModal()">&#10005;</button>
      <div style="padding:36px 32px 28px">
        <div style="text-align:center;margin-bottom:24px">
          <div id="tvAuthTitle" style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:.14em;color:var(--white)">Welcome Back</div>
          <div id="tvAuthSub" style="font-size:.76rem;color:var(--muted);letter-spacing:.06em;margin-top:2px">Sign in to your Travencia account</div>
        </div>

        <div style="display:flex;gap:0;border:1px solid rgba(80,144,224,.18);border-radius:9px;overflow:hidden;margin-bottom:22px">
          <button id="tvTabLogin" onclick="switchTab('login')" style="flex:1;padding:10px;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;background:rgba(45,114,210,.18);color:var(--white);border:none;cursor:pointer;transition:all .25s;font-family:inherit">Sign In</button>
          <button id="tvTabReg"   onclick="switchTab('register')" style="flex:1;padding:10px;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;background:transparent;color:var(--muted);border:none;cursor:pointer;transition:all .25s;font-family:inherit">Create Account</button>
        </div>

        <div id="tvAuthErr" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:7px;padding:10px 14px;font-size:.8rem;color:#fca5a5;margin-bottom:14px"></div>
        <div id="tvAuthOk"  style="display:none;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.25);border-radius:7px;padding:10px 14px;font-size:.8rem;color:#86efac;margin-bottom:14px"></div>

        <!-- LOGIN FORM -->
        <div id="tvLoginForm">
          <div class="fg" style="margin-bottom:14px">
            <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">Email Address</label>
            <input type="email" id="tvLoginEmail" placeholder="your@email.com" style="width:100%;box-sizing:border-box" onkeydown="if(event.key==='Enter')doLogin()"/>
          </div>
          <div class="fg" style="margin-bottom:20px">
            <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">Password</label>
            <input type="password" id="tvLoginPass" placeholder="••••••••" style="width:100%;box-sizing:border-box" onkeydown="if(event.key==='Enter')doLogin()"/>
          </div>
          <button onclick="doLogin()" id="tvLoginBtn" style="width:100%;padding:14px;background:linear-gradient(130deg,#2D72D2,#5090E0);color:#fff;font-size:.88rem;letter-spacing:.1em;text-transform:uppercase;border-radius:9px;border:none;cursor:pointer;font-family:inherit;transition:all .25s">Sign In →</button>
          <p style="font-size:.76rem;color:var(--muted);text-align:center;margin-top:14px">
            No account? <a href="#" onclick="switchTab('register');return false" style="color:var(--sky2);text-decoration:none">Create one free</a>
          </p>
        </div>

        <!-- REGISTER FORM -->
        <div id="tvRegForm" style="display:none">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
            <div class="fg">
              <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">First Name *</label>
              <input type="text" id="tvRegFn" placeholder="Jean" style="width:100%;box-sizing:border-box"/>
            </div>
            <div class="fg">
              <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">Last Name *</label>
              <input type="text" id="tvRegLn" placeholder="Dupont" style="width:100%;box-sizing:border-box"/>
            </div>
          </div>
          <div class="fg" style="margin-bottom:14px">
            <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">Email Address *</label>
            <input type="email" id="tvRegEmail" placeholder="your@email.com" style="width:100%;box-sizing:border-box"/>
          </div>
          <div class="fg" style="margin-bottom:14px">
            <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">WhatsApp Number</label>
            <input type="tel" id="tvRegWa" placeholder="+1 (512) XXX-XXXX" value="+1 " style="width:100%;box-sizing:border-box"/>
          </div>
          <div class="fg" style="margin-bottom:14px">
            <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">Country *</label>
            <select id="tvRegCountry" style="width:100%;box-sizing:border-box">
              <option value="">— Select your country —</option>
              <option value="AF">Afghanistan</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AO">Angola</option><option value="AR">Argentina</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="BE">Belgium</option><option value="BJ">Benin</option><option value="BO">Bolivia</option><option value="BR">Brazil</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CO">Colombia</option><option value="CG">Congo</option><option value="CD">DR Congo</option><option value="CR">Costa Rica</option><option value="CI">Côte d'Ivoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DO">Dominican Republic</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="ET">Ethiopia</option><option value="FI">Finland</option><option value="FR">France</option><option value="GA">Gabon</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GR">Greece</option><option value="GT">Guatemala</option><option value="GN">Guinea</option><option value="HT">Haiti</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JO">Jordan</option><option value="KE">Kenya</option><option value="KR">South Korea</option><option value="KW">Kuwait</option><option value="LB">Lebanon</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="ML">Mali</option><option value="MR">Mauritania</option><option value="MX">Mexico</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NL">Netherlands</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PA">Panama</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="QA">Qatar</option><option value="RO">Romania</option><option value="RU">Russia</option><option value="RW">Rwanda</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="ZA">South Africa</option><option value="ES">Spain</option><option value="SD">Sudan</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="TW">Taiwan</option><option value="TZ">Tanzania</option><option value="TH">Thailand</option><option value="TG">Togo</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB">United Kingdom</option><option value="US">United States</option><option value="UY">Uruguay</option><option value="VE">Venezuela</option><option value="VN">Vietnam</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option>
            </select>
          </div>
          <div class="fg" style="margin-bottom:14px">
            <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">Password *</label>
            <input type="password" id="tvRegPass" placeholder="Min. 6 characters" style="width:100%;box-sizing:border-box" onkeydown="if(event.key==='Enter')doRegister()"/>
          </div>
          <div class="fg" style="margin-bottom:20px">
            <label style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:6px">Confirm Password *</label>
            <input type="password" id="tvRegPass2" placeholder="Repeat password" style="width:100%;box-sizing:border-box" onkeydown="if(event.key==='Enter')doRegister()"/>
          </div>
          <button onclick="doRegister()" id="tvRegBtn" style="width:100%;padding:14px;background:linear-gradient(130deg,#2D72D2,#5090E0);color:#fff;font-size:.88rem;letter-spacing:.1em;text-transform:uppercase;border-radius:9px;border:none;cursor:pointer;font-family:inherit;transition:all .25s">Create Account →</button>
          <p style="font-size:.76rem;color:var(--muted);text-align:center;margin-top:14px">
            Already have an account? <a href="#" onclick="switchTab('login');return false" style="color:var(--sky2);text-decoration:none">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(m.firstElementChild);
}

// ── Modal controls ────────────────────────────────────────
function openAuth(tab) {
  buildAuthModal();
  switchTab(tab || 'login');
  document.getElementById('tvAuthModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  clearAuthMsg();
}

function closeAuthModal() {
  const m = document.getElementById('tvAuthModal');
  if (m) m.style.display = 'none';
  document.body.style.overflow = '';
}

function switchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('tvLoginForm').style.display = isLogin ? '' : 'none';
  document.getElementById('tvRegForm').style.display   = isLogin ? 'none' : '';
  document.getElementById('tvAuthTitle').textContent   = isLogin ? 'Welcome Back' : 'Create Account';
  document.getElementById('tvAuthSub').textContent     = isLogin ? 'Sign in to your Travencia account' : 'Join Travencia — free, takes 30 seconds';
  const tl = document.getElementById('tvTabLogin');
  const tr = document.getElementById('tvTabReg');
  tl.style.background = isLogin ? 'rgba(45,114,210,.22)' : 'transparent';
  tl.style.color      = isLogin ? 'var(--white)' : 'var(--muted)';
  tr.style.background = isLogin ? 'transparent' : 'rgba(45,114,210,.22)';
  tr.style.color      = isLogin ? 'var(--muted)' : 'var(--white)';
  clearAuthMsg();
}

function showAuthErr(msg) {
  const e = document.getElementById('tvAuthErr');
  const o = document.getElementById('tvAuthOk');
  if (e) { e.textContent = msg; e.style.display = ''; }
  if (o) o.style.display = 'none';
}
function showAuthOk(msg) {
  const e = document.getElementById('tvAuthErr');
  const o = document.getElementById('tvAuthOk');
  if (o) { o.textContent = msg; o.style.display = ''; }
  if (e) e.style.display = 'none';
}
function clearAuthMsg() {
  const e = document.getElementById('tvAuthErr');
  const o = document.getElementById('tvAuthOk');
  if (e) e.style.display = 'none';
  if (o) o.style.display = 'none';
}
function setAuthLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.style.opacity = loading ? '0.6' : '1';
  btn.textContent = loading ? 'Please wait…' : (btnId === 'tvLoginBtn' ? 'Sign In →' : 'Create Account →');
}

// ── Login ─────────────────────────────────────────────────
async function doLogin() {
  const email = (document.getElementById('tvLoginEmail')?.value || '').trim();
  const pass  = document.getElementById('tvLoginPass')?.value || '';
  if (!email || !pass) return showAuthErr('Please enter your email and password.');
  setAuthLoading('tvLoginBtn', true);
  try {
    const r = await fetch(AUTH_API + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const d = await r.json();
    if (!d.success) {
      if (d.must_register) { showAuthErr('No account found. Please create one.'); setTimeout(() => switchTab('register'), 1200); }
      else showAuthErr(d.error || 'Login failed.');
      setAuthLoading('tvLoginBtn', false);
      return;
    }
    setToken(d.data.token);
    localStorage.setItem('tv_user', JSON.stringify(d.data));
    showAuthOk(`Welcome back, ${d.data.first_name}! ✓`);
    setTimeout(() => { closeAuthModal(); updateNavbar(); if (typeof onAuthSuccess === 'function') onAuthSuccess(d.data); }, 900);
  } catch { showAuthErr('Connection error. Is the server running?'); setAuthLoading('tvLoginBtn', false); }
}

// ── Register ──────────────────────────────────────────────
async function doRegister() {
  const fn      = (document.getElementById('tvRegFn')?.value || '').trim();
  const ln      = (document.getElementById('tvRegLn')?.value || '').trim();
  const email   = (document.getElementById('tvRegEmail')?.value || '').trim();
  const wa      = (document.getElementById('tvRegWa')?.value || '').trim();
  const country = (document.getElementById('tvRegCountry')?.value || '').trim();
  const pass    = document.getElementById('tvRegPass')?.value || '';
  const pass2   = document.getElementById('tvRegPass2')?.value || '';
  if (!fn || !ln || !email || !pass) return showAuthErr('Please fill in all required fields.');
  if (!country) return showAuthErr('Please select your country.');
  if (pass.length < 6) return showAuthErr('Password must be at least 6 characters.');
  if (pass !== pass2)  return showAuthErr('Passwords do not match.');
  setAuthLoading('tvRegBtn', true);
  try {
    const r = await fetch(AUTH_API + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ first_name: fn, last_name: ln, email, password: pass, whatsapp: wa, country })
    });
    const d = await r.json();
    if (!d.success) {
      showAuthErr(d.error || 'Registration failed.');
      setAuthLoading('tvRegBtn', false);
      return;
    }
    setToken(d.data.token);
    localStorage.setItem('tv_user', JSON.stringify(d.data));
    showAuthOk(`Account created! Welcome, ${d.data.first_name}! ✓`);
    setTimeout(() => { closeAuthModal(); updateNavbar(); if (typeof onAuthSuccess === 'function') onAuthSuccess(d.data); }, 900);
  } catch { showAuthErr('Connection error.'); setAuthLoading('tvRegBtn', false); }
}

// ── Logout ────────────────────────────────────────────────
function doLogout() {
  clearToken();
  updateNavbar();
  if (typeof onAuthLogout === 'function') onAuthLogout();
}

// ── Navbar update ─────────────────────────────────────────
function updateNavbar() {
  const tok = getToken();
  const nb  = document.getElementById('nbRight') ||
              document.querySelector('.nb-right') ||
              document.getElementById('wcNbRight');
  if (!nb) return;
  if (!tok) {
    nb.innerHTML = `
      <button class="btn-ghost" onclick="openAuth('login')">Sign In</button>
      <button class="btn-primary" onclick="openAuth('register')">Join Free</button>`;
    return;
  }
  const pl   = parseToken(tok);
  if (!pl) { clearToken(); updateNavbar(); return; }
  const name = pl.first_name || pl.email?.split('@')[0] || 'You';
  nb.innerHTML = `
    <span style="font-size:.78rem;color:rgba(255,255,255,.55);letter-spacing:.04em">
      Hi, <strong style="color:var(--sky2)">${name}</strong>
    </span>
    <button class="btn-ghost" onclick="doLogout()" style="font-size:.76rem;padding:7px 16px">Sign Out</button>`;
}

// ── Hamburger menu ────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('nbHamburger');
  const links = document.getElementById('nbLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('nb-open');
    btn.innerHTML = open ? '&#10005;' : '&#9776;';
    btn.setAttribute('aria-expanded', open);
  });
  // Close on link click
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('nb-open');
    btn.innerHTML = '&#9776;';
  }));
}

// ── Init ──────────────────────────────────────────────────
(async function initAuth() {
  const tok = getToken();
  if (tok) {
    const days = tokenExpiresInDays(tok);
    if (days <= 0) {
      const ok = await silentRefresh();
      if (!ok) clearToken();
    } else if (days < 7) {
      silentRefresh();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { updateNavbar(); initHamburger(); });
  } else {
    updateNavbar();
    initHamburger();
  }
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('tvAuthModal');
    if (modal && e.target === modal) closeAuthModal();
  });
})();
