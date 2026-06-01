// ═══════════════════════════════════════════════════════════
//  TRAVENCIA — Booking Modal
//  Payment: pick a method → details pop up → WhatsApp proof
//  No card data collected. Ever.
// ═══════════════════════════════════════════════════════════

const API = window.location.origin;

// ── Payment methods ────────────────────────────────────────
const PAY_METHODS = [
  { id: 'paypal',  label: 'PayPal',        color: '#009cde', bg: 'rgba(0,156,222,.12)'   },
  { id: 'bank',    label: 'Bank Transfer', color: '#2D72D2', bg: 'rgba(45,114,210,.14)'  },
  { id: 'cashapp', label: 'Cash App',      color: '#00D632', bg: 'rgba(0,214,50,.12)'    },
  { id: 'other',   label: 'Other',         color: '#a78bfa', bg: 'rgba(167,139,250,.12)' },
];

let _bkState = { step:1, destId:null, accId:null, acts:[], pricing:null, payM:'paypal' };
let _pendRes  = [];

// ── Open booking ───────────────────────────────────────────
function openBooking(destId) {
  _ensureModal();
  _bkState = { step:1, destId:null, accId:null, acts:[], pricing:null, payM:'paypal' };
  _populateBk();
  if (destId) {
    document.getElementById('bk_dest').value = destId;
    _bkState.destId = destId;
    _onDestChange();
  }
  _setBkStep(1);
  _openM('bookModal');
}

// ── Modal HTML ─────────────────────────────────────────────
function _ensureModal() {
  if (document.getElementById('bookModal')) return;

  // Inject styles
  const st = document.createElement('style');
  st.textContent = `
  /* ── Booking modal layout ── */
  #bookModal .modal { max-width:700px; width:96vw; }
  .bk-steps { display:flex; border-bottom:1px solid rgba(45,114,210,.12); }
  .bk-step { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;
    padding:14px 8px; font-size:.64rem; letter-spacing:.12em; text-transform:uppercase;
    color:var(--faint); transition:all .3s; position:relative; cursor:default; }
  .bk-step::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
    background:transparent; transition:background .3s; }
  .bk-step.active { color:var(--sky2); }
  .bk-step.active::after { background:var(--sky2); }
  .bk-step.done { color:var(--gold2); }
  .bk-step.done::after { background:var(--gold2); }
  .bk-snum { width:28px; height:28px; border-radius:50%; border:1.5px solid currentColor;
    display:flex; align-items:center; justify-content:center; font-family:'Bebas Neue',sans-serif;
    font-size:1rem; letter-spacing:0; }
  .bk-step.done .bk-snum::before { content:'✓'; }
  .bk-step.done .bk-snum span { display:none; }

  /* ── Price breakdown ── */
  .pb { background:rgba(12,22,40,.7); border:1px solid rgba(45,114,210,.14);
    border-radius:10px; padding:14px 18px; }
  .pb-head { font-size:.68rem; letter-spacing:.14em; text-transform:uppercase;
    color:var(--sky2); margin-bottom:10px; }
  .pb-row { display:flex; justify-content:space-between; align-items:center;
    padding:5px 0; border-bottom:1px solid rgba(45,114,210,.07); font-size:.82rem; }
  .pb-row:last-child { border:none; }
  .pb-row.total .pb-l { color:var(--white); font-weight:600; }
  .pb-row.total .pb-v { color:var(--gold2); font-family:'Bebas Neue',sans-serif;
    font-size:1.15rem; letter-spacing:.04em; }
  .pb-l { color:var(--muted); }
  .pb-v { color:var(--white); font-weight:500; }

  /* ── Payment method tiles (hidden, replaced by dropdown) ── */
  .pay-tiles { display:none; }
  .pay-tile { border-radius:12px; border:2px solid rgba(255,255,255,.08);
    padding:16px 10px; text-align:center; cursor:pointer;
    transition:all .3s; background:rgba(255,255,255,.03); }
  .pay-tile:hover { border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.06); transform:translateY(-2px); }
  .pay-tile.active { border-color:var(--gold2); background:rgba(200,149,32,.07); transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(200,149,32,.12); }
  .pay-tile-icon { font-size:1.8rem; margin-bottom:6px; display:block; }
  .pay-tile-label { font-size:.72rem; font-weight:700; letter-spacing:.08em;
    text-transform:uppercase; color:var(--white); }

  /* ── Payment detail popup ── */
  .pay-detail { display:none; background:rgba(4,8,15,.7); border:1px solid rgba(200,149,32,.25);
    border-radius:14px; padding:22px; margin-bottom:18px; animation:slideUp .35s ease; }
  .pay-detail.show { display:block; }
  @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .pay-detail-title { font-family:'Bebas Neue',sans-serif; font-size:1.35rem; letter-spacing:.06em;
    color:var(--gold2); margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .pay-highlight { background:rgba(200,149,32,.1); border:1px solid rgba(200,149,32,.3);
    border-radius:8px; padding:10px 16px; margin-bottom:14px; font-size:.9rem;
    color:var(--white); font-weight:600; text-align:center; letter-spacing:.04em; }
  .pay-steps { list-style:none; padding:0; margin:0 0 10px; }
  .pay-steps li { display:flex; gap:10px; align-items:flex-start; padding:7px 0;
    border-bottom:1px solid rgba(255,255,255,.05); font-size:.82rem; color:var(--muted); line-height:1.5; }
  .pay-steps li:last-child { border:none; }
  .pay-step-num { min-width:22px; height:22px; border-radius:50%; background:rgba(45,114,210,.2);
    border:1px solid rgba(45,114,210,.3); display:flex; align-items:center; justify-content:center;
    font-size:.68rem; color:var(--sky2); font-weight:700; }
  .pay-note { font-size:.74rem; color:var(--faint); line-height:1.6; margin-top:8px; }

  /* ── WA button ── */
  .wa-btn { width:100%; padding:14px; background:linear-gradient(130deg,#25D366,#1ab854);
    color:#fff; font-size:.9rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
    border-radius:10px; border:none; cursor:pointer; display:flex; align-items:center;
    justify-content:center; gap:10px; transition:all .3s; margin-bottom:12px; }
  .wa-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(37,211,102,.25); }
  .email-btn { width:100%; padding:14px; background:linear-gradient(130deg,#2D72D2,#1340A0);
    color:#fff; font-size:.9rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
    border-radius:10px; border:none; cursor:pointer; display:flex; align-items:center;
    justify-content:center; gap:10px; transition:all .3s; margin-bottom:12px; font-family:inherit; }
  .email-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(45,114,210,.3); }
  .email-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .send-divider { display:flex; align-items:center; gap:10px; margin:4px 0 12px; }
  .send-divider::before,.send-divider::after { content:''; flex:1; height:1px; background:rgba(45,114,210,.15); }
  .send-divider span { font-size:.65rem; letter-spacing:.14em; text-transform:uppercase; color:var(--faint,#3A4F72); }

  /* ── Confirm note ── */
  .confirm-note { background:rgba(45,114,210,.06); border:1px solid rgba(45,114,210,.15);
    border-radius:8px; padding:12px 16px; font-size:.78rem; color:var(--muted); line-height:1.7; }

  /* ── Footer bar ── */
  .bk-footer { padding:14px 30px 18px; display:flex; align-items:center;
    justify-content:space-between; gap:12px; border-top:1px solid rgba(45,114,210,.1); flex-wrap:wrap; }
  .bk-total-lbl { font-size:.72rem; color:var(--muted); }
  .bk-total-val { font-family:'Bebas Neue',sans-serif; font-size:1.5rem;
    color:var(--gold2); letter-spacing:.05em; display:block; }
  .bk-footer-btns { display:flex; gap:10px; }

  /* ── Error ── */
  .gerr { display:none; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3);
    border-radius:7px; padding:9px 14px; font-size:.8rem; color:#fca5a5; margin-top:10px; }

  /* ── Confirm modal ── */
  .wc-confirm-modal { position:fixed; inset:0; background:rgba(4,8,15,.88); backdrop-filter:blur(8px);
    z-index:9999; display:none; align-items:center; justify-content:center; padding:16px; }
  .wc-confirm-modal.open { display:flex; }
  .wc-confirm-inner { background:var(--card,#0e1a2e); border:1px solid rgba(45,114,210,.22);
    border-radius:18px; width:100%; max-width:480px; max-height:90vh; overflow-y:auto;
    position:relative; animation:slideUp .3s ease; }
  .wcconf-head { padding:24px 28px 0; }
  .wcconf-title { font-family:'Bebas Neue',sans-serif; font-size:1.8rem; letter-spacing:.06em;
    color:var(--white,#fff); margin-bottom:4px; }
  .wcconf-subtitle { font-size:.8rem; color:var(--muted,#8899aa); margin-bottom:0; }
  .wcconf-body { padding:18px 28px; }
  .wcconf-row { display:flex; justify-content:space-between; align-items:flex-start;
    padding:9px 0; border-bottom:1px solid rgba(45,114,210,.08); gap:12px; }
  .wcconf-row:last-child { border:none; }
  .wcconf-lbl { font-size:.72rem; text-transform:uppercase; letter-spacing:.12em;
    color:var(--muted,#8899aa); flex-shrink:0; padding-top:1px; }
  .wcconf-val { font-size:.86rem; color:var(--white,#fff); font-weight:500; text-align:right; }
  .wcconf-total-row { display:flex; justify-content:space-between; align-items:center;
    margin-top:14px; padding:14px 18px; background:rgba(200,149,32,.08);
    border:1px solid rgba(200,149,32,.2); border-radius:10px; }
  .wcconf-total-lbl { font-size:.72rem; text-transform:uppercase; letter-spacing:.14em; color:var(--muted,#8899aa); }
  .wcconf-total-val { font-family:'Bebas Neue',sans-serif; font-size:1.6rem; color:var(--gold2,#c89520); letter-spacing:.06em; }
  .wcconf-screenshot-box { margin-top:14px; background:rgba(37,211,102,.06);
    border:1px solid rgba(37,211,102,.18); border-radius:10px; padding:14px 18px;
    display:flex; gap:12px; align-items:flex-start; }
  .wcconf-ss-icon { font-size:1.6rem; flex-shrink:0; }
  .wcconf-screenshot-box p { font-size:.8rem; color:var(--muted,#8899aa); line-height:1.65; margin:0; }
  .wcconf-foot { padding:14px 28px 22px; display:flex; gap:12px; }
  .wcconf-foot .btn-outline { flex:1; padding:12px; border-radius:9px;
    border:1.5px solid rgba(45,114,210,.3); background:transparent;
    color:var(--sky2,#5ba4f5); font-size:.85rem; font-weight:600; cursor:pointer; transition:all .3s; font-family:inherit; }
  .wcconf-foot .btn-outline:hover { background:rgba(45,114,210,.1); }
  .wcm-submit { flex:2; padding:14px; background:linear-gradient(130deg,#25D366,#1ab854);
    color:#fff; font-size:.9rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
    border-radius:9px; border:none; cursor:pointer; transition:all .3s; font-family:inherit; }
  .wcm-submit:hover { transform:translateY(-1px); box-shadow:0 8px 22px rgba(37,211,102,.25); }

  /* ── Responsive ── */
  @media(max-width:500px){
    .pay-tiles { grid-template-columns:repeat(2,1fr); }
    #bkBody { padding:16px !important; }
    .bk-footer { padding:12px 16px; }
    .wcconf-head, .wcconf-body, .wcconf-foot { padding-left:18px; padding-right:18px; }
  }
  `;
  document.head.appendChild(st);

  const wrap = document.createElement('div');
  wrap.innerHTML = `
<div class="overlay" id="bookModal">
  <div class="modal">
    <button class="m-close" onclick="_closeM('bookModal')">&#10005;</button>
    <div class="bk-steps">
      <div class="bk-step active" data-s="1"><div class="bk-snum"><span>1</span></div><div class="bk-slbl">Trip</div></div>
      <div class="bk-step" data-s="2"><div class="bk-snum"><span>2</span></div><div class="bk-slbl">Details</div></div>
      <div class="bk-step" data-s="3"><div class="bk-snum"><span>3</span></div><div class="bk-slbl">Payment</div></div>
    </div>
    <div id="bkBody" style="padding:22px 28px 24px;overflow-y:auto;max-height:68vh">

      <!-- STEP 1 -->
      <div id="bs1">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:var(--white);letter-spacing:.05em;margin-bottom:16px">Plan Your <span style="color:var(--gold2)">Trip</span></div>
        <div class="fg"><label>Destination</label><select id="bk_dest" onchange="_onDestChange()"></select></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="fg"><label>Departure</label><input type="date" id="bk_dep" onchange="_recalc()"/></div>
          <div class="fg"><label>Return</label><input type="date" id="bk_ret" onchange="_recalc()"/></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="fg"><label>Adults</label>
            <select id="bk_adults" onchange="_recalc()">
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              <option value="4">4</option><option value="5">5</option><option value="6">6</option>
            </select>
          </div>
          <div class="fg"><label>Children</label>
            <select id="bk_children" onchange="_recalc()">
              <option value="0">None</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
            </select>
          </div>
        </div>
        <div class="fg"><label>Your Country</label><select id="bk_country" onchange="_recalc()"></select></div>
        <div class="fg"><label>Accommodation</label><select id="bk_acc" onchange="_recalc()"><option value="">Standard (included)</option></select></div>
        <div id="bk_acts_wrap" style="display:none;margin-top:4px">
          <label style="display:block;font-size:.65rem;letter-spacing:.16em;text-transform:uppercase;color:var(--sky2);font-weight:600;margin-bottom:10px">Optional Activities</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px" id="bk_acts_list"></div>
        </div>
        <div id="bk_price_wrap" style="display:none;margin-top:16px"></div>
        <div class="gerr" id="bk_err1"></div>
      </div>

      <!-- STEP 2 -->
      <div id="bs2" style="display:none">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:var(--white);letter-spacing:.05em;margin-bottom:4px">Your <span style="color:var(--gold2)">Details</span></div>
        <p style="font-size:.78rem;color:var(--muted);margin-bottom:16px">These details will appear on your booking screenshot.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="fg"><label>First Name *</label><input type="text" id="bk_fn" placeholder="Jean"/></div>
          <div class="fg"><label>Last Name *</label><input type="text" id="bk_ln" placeholder="Dupont"/></div>
        </div>
        <div class="fg"><label>Email Address *</label><input type="email" id="bk_email" placeholder="jean@email.com"/></div>
        <div class="fg"><label>WhatsApp Number *</label><input type="tel" id="bk_phone" placeholder="+1 (512) XXX-XXXX"/></div>
        <div class="fg"><label>Notes (optional)</label><textarea id="bk_notes" placeholder="Special requests, dietary requirements..."></textarea></div>
        <div class="gerr" id="bk_err2"></div>
      </div>

      <!-- STEP 3: PAYMENT -->
      <div id="bs3" style="display:none">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:var(--white);letter-spacing:.05em;margin-bottom:4px">Choose <span style="color:var(--gold2)">Payment</span></div>
        <p style="font-size:.78rem;color:var(--muted);margin-bottom:16px">Select your preferred payment method and confirm your booking.</p>
        <div id="bk_order_sum" style="margin-bottom:18px"></div>
        <div id="bk_payTiles" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px"></div>
        <div id="bk_paySelected" style="display:none;background:rgba(200,149,32,.07);border:1px solid rgba(200,149,32,.3);border-radius:10px;padding:12px 18px;margin-bottom:16px;text-align:center">
          <div style="font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold2);margin-bottom:4px">Selected method</div>
          <div id="bk_paySelectedLabel" style="font-size:1.1rem;font-weight:700;color:var(--white)"></div>
        </div>
        <div class="gerr" id="bk_err3"></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="bk-footer">
      <div>
        <div class="bk-total-lbl">Estimated Total</div>
        <span class="bk-total-val" id="bkAmt">—</span>
      </div>
      <div class="bk-footer-btns">
        <button class="btn-back" id="bkBtnBack" onclick="_bkNav(-1)" style="display:none">Back</button>
        <button class="btn-primary" id="bkBtnNext" onclick="_bkNav(1)">Continue</button>
      </div>
    </div>
  </div>
</div>

<!-- Confirm modal (worldcup-style) -->
<div class="wc-confirm-modal" id="bkConfModal">
  <div class="wc-confirm-inner">
    <button class="m-close" onclick="_closeConfirmModal()" style="z-index:10">&#10005;</button>
    <div class="wcconf-head">
      <div class="wcconf-title">Confirm Your Booking</div>
      <div class="wcconf-subtitle">Review your details before submitting</div>
    </div>
    <div class="wcconf-body">
      <div id="bkConfRows"></div>
      <div class="wcconf-total-row">
        <div class="wcconf-total-lbl">Estimated Total</div>
        <div class="wcconf-total-val" id="bkConfTotal">$0</div>
      </div>
      <div class="wcconf-screenshot-box">
        <div class="wcconf-ss-icon">&#128248;</div>
        <p>After confirming, take a screenshot and send it to our admin via WhatsApp to confirm your payment method.</p>
      </div>
    </div>
    <div class="wcconf-foot" style="flex-direction:column;gap:10px">
      <div style="display:flex;gap:10px;width:100%">
        <button class="btn-outline" onclick="_closeConfirmModal()" style="flex:1;padding:12px;border-radius:9px;border:1.5px solid rgba(45,114,210,.3);background:transparent;color:var(--sky2,#5ba4f5);font-size:.85rem;font-weight:600;cursor:pointer;transition:all .3s;font-family:inherit">&#8592; Back</button>
        <button class="wcm-submit" id="bkConfBtnWA" onclick="_closeConfirmModal();_submitBk('whatsapp');" style="flex:2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Confirm &amp; Send via WhatsApp
        </button>
      </div>
      <div class="send-divider"><span>or send details by</span></div>
      <button class="email-btn" id="bkConfBtnEmail" onclick="_closeConfirmModal();_submitBk('email');">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        Confirm &amp; Send via Email
      </button>
    </div>
  </div>
</div>

<!-- Confirmation overlay -->
<div class="wait-overlay" id="waitOver">
  <div class="wc-success-ball" style="width:72px;height:72px;margin:0 auto 16px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(130deg,#16a34a,#4ade80);overflow:hidden;box-shadow:0 16px 38px rgba(74,222,128,.22)">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  </div>
  <div style="font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:var(--white);letter-spacing:.1em">BOOKING RECEIVED</div>
  <div style="font-family:'Bebas Neue',sans-serif;font-size:2.2rem;color:var(--gold2);letter-spacing:.18em;margin:14px 0" id="waitCode">TV-XXXXXXXX</div>
  <p style="font-size:.86rem;color:var(--muted);max-width:400px;line-height:1.75;margin-bottom:14px;text-align:center">
    Your reservation is saved. Our team will confirm via WhatsApp — typically within 2 hours.
  </p>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:400px;margin:0 auto 14px">
    <div style="padding:9px 8px;border-radius:8px;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.35);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:#86efac;text-align:center">Saved</div>
    <div style="padding:9px 8px;border-radius:8px;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.35);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:#86efac;text-align:center">Payment Review</div>
    <div style="padding:9px 8px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(74,222,128,.14);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);text-align:center">Confirmed</div>
  </div>
  <div style="background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.2);border-radius:10px;padding:14px 18px;font-size:.8rem;color:#86efac;line-height:1.7;margin:0 auto 18px;max-width:400px;text-align:center">
    📋 Your booking is saved. Send the details to our team to confirm your payment method.
  </div>
  <div id="resList" style="width:100%;max-width:520px;margin-bottom:18px"></div>
  <div style="display:flex;flex-direction:column;gap:10px;max-width:400px;width:100%;align-items:center">
    <button class="wa-btn" style="width:100%;padding:13px 28px" onclick="_sendPaymentWA()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Send Details via WhatsApp
    </button>
    <div class="send-divider" style="width:100%"><span>or</span></div>
    <button class="email-btn" id="waitEmailBtn" style="width:100%;margin-bottom:0" onclick="_sendPaymentEmail()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      Send Details via Email
    </button>
    <button class="btn-outline" onclick="document.getElementById('waitOver').classList.remove('open')" style="width:100%">Close</button>
  </div>
</div>`;

  // Append ALL modal elements (bookModal, bkConfModal, waitOver)
  while (wrap.firstElementChild) {
    document.body.appendChild(wrap.firstElementChild);
  }

  document.getElementById('bookModal').addEventListener('click', e => {
    if (e.target === document.getElementById('bookModal')) _closeM('bookModal');
  });
}

// ── Phone formatting helpers ───────────────────────────────
const PHONE_FORMATS = {
  // North America (NANP) +1
  US:{ prefix:'+1', fmt:function(d){ return d.length<=3?'('+d:d.length<=6?'('+d.slice(0,3)+') '+d.slice(3):d.length<=10?'('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6):'('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6,10); }, max:10 },
  CA:{ prefix:'+1', fmt:function(d){ return d.length<=3?'('+d:d.length<=6?'('+d.slice(0,3)+') '+d.slice(3):d.length<=10?'('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6):'('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6,10); }, max:10 },
  MX:{ prefix:'+52', fmt:function(d){ return d.length<=2?d:d.length<=6?d.slice(0,2)+' '+d.slice(2):d.length<=10?d.slice(0,2)+' '+d.slice(2,6)+' '+d.slice(6):d.slice(0,2)+' '+d.slice(2,6)+' '+d.slice(6,10); }, max:10 },
  // Europe
  GB:{ prefix:'+44', fmt:function(d){ return d.length<=4?d:d.length<=7?d.slice(0,4)+' '+d.slice(4):d.slice(0,4)+' '+d.slice(4,7)+' '+d.slice(7,11); }, max:11 },
  FR:{ prefix:'+33', fmt:function(d){ const p=d.slice(0,10); return p.match(/.{1,2}/g)?.join(' ')||p; }, max:10 },
  DE:{ prefix:'+49', fmt:function(d){ return d.length<=3?d:d.length<=7?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,7)+' '+d.slice(7,12); }, max:12 },
  IT:{ prefix:'+39', fmt:function(d){ return d.length<=3?d:d.length<=6?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,10); }, max:10 },
  ES:{ prefix:'+34', fmt:function(d){ return d.length<=3?d:d.length<=6?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,9); }, max:9 },
  PT:{ prefix:'+351', fmt:function(d){ return d.length<=3?d:d.length<=6?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,9); }, max:9 },
  NL:{ prefix:'+31', fmt:function(d){ return d.length<=2?d:d.length<=6?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,6)+' '+d.slice(6,10); }, max:10 },
  BE:{ prefix:'+32', fmt:function(d){ return d.length<=3?d:d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,10); }, max:10 },
  CH:{ prefix:'+41', fmt:function(d){ return d.length<=2?d:d.length<=5?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  // Africa
  CM:{ prefix:'+237', fmt:function(d){ return d.length<=3?d:d.length<=6?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,9); }, max:9 },
  NG:{ prefix:'+234', fmt:function(d){ return d.length<=3?d:d.length<=7?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,7)+' '+d.slice(7,11); }, max:11 },
  ZA:{ prefix:'+27', fmt:function(d){ return d.length<=2?d:d.length<=5?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  GH:{ prefix:'+233', fmt:function(d){ return d.length<=2?d:d.length<=5?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  KE:{ prefix:'+254', fmt:function(d){ return d.length<=3?d:d.length<=6?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,9); }, max:9 },
  TZ:{ prefix:'+255', fmt:function(d){ return d.length<=3?d:d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,9); }, max:9 },
  EG:{ prefix:'+20', fmt:function(d){ return d.length<=2?d:d.length<=6?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,6)+' '+d.slice(6,10); }, max:10 },
  MA:{ prefix:'+212', fmt:function(d){ return d.length<=2?d:d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  CI:{ prefix:'+225', fmt:function(d){ return d.slice(0,2)+' '+d.slice(2,4)+' '+d.slice(4,6)+' '+d.slice(6,8); }, max:8 },
  SN:{ prefix:'+221', fmt:function(d){ return d.length<=2?d:d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  // Middle East
  AE:{ prefix:'+971', fmt:function(d){ return d.length<=2?d:d.length<=5?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  SA:{ prefix:'+966', fmt:function(d){ return d.length<=2?d:d.length<=5?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  // Asia
  JP:{ prefix:'+81', fmt:function(d){ return d.length<=3?d:d.length<=7?d.slice(0,3)+'-'+d.slice(3):d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7,11); }, max:11 },
  IN:{ prefix:'+91', fmt:function(d){ return d.length<=5?d:d.slice(0,5)+' '+d.slice(5,10); }, max:10 },
  CN:{ prefix:'+86', fmt:function(d){ return d.length<=3?d:d.length<=7?d.slice(0,3)+' '+d.slice(3):d.slice(0,3)+' '+d.slice(3,7)+' '+d.slice(7,11); }, max:11 },
  TH:{ prefix:'+66', fmt:function(d){ return d.length<=2?d:d.length<=5?d.slice(0,2)+' '+d.slice(2):d.slice(0,2)+' '+d.slice(2,5)+' '+d.slice(5,9); }, max:9 },
  ID:{ prefix:'+62', fmt:function(d){ return d.length<=3?d:d.length<=7?d.slice(0,3)+'-'+d.slice(3):d.slice(0,3)+'-'+d.slice(3,7)+'-'+d.slice(7,12); }, max:12 },
  // Oceania / Americas
  AU:{ prefix:'+61', fmt:function(d){ return d.length<=1?d:d.length<=5?d.slice(0,1)+' '+d.slice(1):d.slice(0,1)+' '+d.slice(1,5)+' '+d.slice(5,9); }, max:9 },
  BR:{ prefix:'+55', fmt:function(d){ return d.length<=2?d:d.length<=7?'('+d.slice(0,2)+') '+d.slice(2):'('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7,11); }, max:11 },
  CO:{ prefix:'+57', fmt:function(d){ return d.length<=3?d:d.slice(0,3)+' '+d.slice(3,6)+' '+d.slice(6,10); }, max:10 },
};
const _DEFAULT_PHONE = { prefix:'+', fmt:function(d){ return d; }, max:15 };

function _getPhonePrefix(cc) {
  return (PHONE_FORMATS[cc] || _DEFAULT_PHONE).prefix;
}

function _setPhonePrefix(cc) {
  const ph = document.getElementById('bk_phone');
  if (!ph) return;
  const fmt = PHONE_FORMATS[cc] || _DEFAULT_PHONE;
  ph.value = fmt.prefix + ' ';
  ph.placeholder = fmt.prefix + ' ' + (
    cc === 'US' || cc === 'CA' ? '(555) 000-0000' :
    cc === 'GB' ? '7700 900 000' :
    cc === 'FR' ? '06 12 34 56 78' :
    cc === 'CM' ? '6XX XXX XXX' :
    cc === 'NG' ? '803 XXX XXXX' :
    cc === 'AE' ? '50 000 0000' :
    cc === 'AU' ? '4 0000 0000' :
    cc === 'BR' ? '(11) 91234-5678' :
    '000 000 0000'
  );
}

function _formatPhone(input) {
  const cc  = (document.getElementById('bk_country') || {value:'US'}).value || 'US';
  const def = PHONE_FORMATS[cc] || _DEFAULT_PHONE;
  const prefix = def.prefix + ' ';
  let raw = input.value;
  // Keep prefix intact
  if (!raw.startsWith(prefix)) { raw = prefix; }
  // Extract digits only after prefix
  let digits = raw.slice(prefix.length).replace(/\D/g, '').slice(0, def.max);
  input.value = digits.length ? prefix + def.fmt(digits) : prefix;
}

// ── Populate selects ───────────────────────────────────────
function _populateBk() {
  if (!window.TV) return;
  const { DESTINATIONS, COUNTRIES } = window.TV;
  const ds = document.getElementById('bk_dest');
  if (!ds) return;
  ds.innerHTML = '<option value="">— Select destination —</option>';
  DESTINATIONS.forEach(d => ds.add(new Option(`${d.name}, ${d.country}`, d.id)));

  const cs = document.getElementById('bk_country');
  cs.innerHTML = '<option value="">— Your country —</option>';
  const regs = {};
  COUNTRIES.forEach(c => { if (!regs[c.r]) regs[c.r] = []; regs[c.r].push(c); });
  Object.entries(regs).forEach(([r, arr]) => {
    const og = document.createElement('optgroup');
    og.label = r;
    arr.forEach(c => og.appendChild(new Option(c.n, c.c)));
    cs.appendChild(og);
  });
  cs.value = 'US';

  // Phone formatting — set prefix + attach live formatter
  const _ph = document.getElementById('bk_phone');
  if (_ph) {
    _setPhonePrefix('US');
    _ph.addEventListener('input', function() { _formatPhone(this); });
    _ph.addEventListener('keydown', function(e) {
      const prefix = _getPhonePrefix(document.getElementById('bk_country').value || 'US');
      if ((e.key === 'Backspace' || e.key === 'Delete') && this.value.length <= prefix.length) {
        e.preventDefault();
      }
    });
  }
  cs.addEventListener('change', function() { _setPhonePrefix(this.value); });

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bk_dep').min = today;
  document.getElementById('bk_ret').min = today;

  const tok = typeof getToken === 'function' ? getToken() : '';
  if (tok) {
    const pl = typeof parseToken === 'function' ? parseToken(tok) : null;
    if (pl) {
      const ubox = document.getElementById('bk_user_info');
      if (ubox) ubox.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
          <span style="font-size:1.2rem">👤</span>
          <strong style="color:var(--white)">${pl.first_name||''} ${pl.last_name||''}</strong>
        </div>
        <div style="font-size:.76rem;color:var(--muted)">${pl.email||''} · Booking linked to your account.</div>`;
    }
  } else {
    const ubox = document.getElementById('bk_user_info');
    if (ubox) ubox.innerHTML = `<div style="font-size:.82rem;color:var(--muted)">Not signed in — booking will be saved as guest. <a href="#" onclick="closeAuthModal&&closeAuthModal();openAuth('login');return false" style="color:var(--sky2)">Sign in for easier tracking →</a></div>`;
  }
}

// ── Destination change ─────────────────────────────────────
function _onDestChange() {
  if (!window.TV) return;
  const { ACCOMMODATIONS, ACTIVITIES } = window.TV;
  const id = parseInt(document.getElementById('bk_dest').value);
  if (!id) return;
  _bkState.destId = id;
  _bkState.acts   = [];

  const asel = document.getElementById('bk_acc');
  asel.innerHTML = '<option value="">Standard (included)</option>';
  (ACCOMMODATIONS[id] || []).forEach(a => asel.add(new Option(`${a.n} +$${a.ppn}/night`, a.id)));

  const acts = ACTIVITIES[id] || [];
  const wrap = document.getElementById('bk_acts_wrap');
  const list = document.getElementById('bk_acts_list');
  if (acts.length) {
    wrap.style.display = 'block';
    list.innerHTML = acts.map(a => `
      <div id="bka_${a.id}" onclick="_togAct(${a.id})"
           style="background:rgba(12,22,40,.6);border:2px solid rgba(45,114,210,.1);border-radius:8px;padding:12px;display:flex;gap:10px;cursor:pointer;transition:all .3s">
        <div id="bkcb_${a.id}" style="width:17px;height:17px;border:2px solid rgba(45,114,210,.3);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.6rem;color:transparent;transition:all .3s">&#10003;</div>
        <div>
          <div style="font-size:.82rem;font-weight:600;color:var(--white);margin-bottom:2px">${a.n}</div>
          <div style="font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--faint)">${a.cat}</div>
          <div style="font-size:.72rem;color:var(--muted)">+$${a.price}/person · ${a.dur}h</div>
        </div>
      </div>`).join('');
  } else {
    wrap.style.display = 'none';
  }
  _recalc();
}

function _togAct(id) {
  const el = document.getElementById('bka_' + id);
  const cb = document.getElementById('bkcb_' + id);
  const i  = _bkState.acts.indexOf(id);
  if (i === -1) {
    _bkState.acts.push(id);
    el.style.borderColor = 'rgba(200,149,32,.4)';
    el.style.background  = 'rgba(200,149,32,.04)';
    cb.style.cssText = 'width:17px;height:17px;border:2px solid var(--gold);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.6rem;color:var(--navy);background:var(--gold);transition:all .3s';
  } else {
    _bkState.acts.splice(i, 1);
    el.style.borderColor = 'rgba(45,114,210,.1)';
    el.style.background  = 'rgba(12,22,40,.6)';
    cb.style.cssText = 'width:17px;height:17px;border:2px solid rgba(45,114,210,.3);border-radius:4px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.6rem;color:transparent;transition:all .3s';
  }
  _recalc();
}

// ── Price calculation (server-authoritative via /api/pricing) ──
let _recalcTimer = null;
function _recalc() {
  // Debounce rapid changes (e.g. typing)
  clearTimeout(_recalcTimer);
  _recalcTimer = setTimeout(_doRecalc, 300);
}

function _doRecalc() {
  if (!window.TV) return;
  const { fmt, calcPrice } = window.TV;
  const destId   = parseInt(document.getElementById('bk_dest').value) || _bkState.destId;
  const dep      = document.getElementById('bk_dep').value;
  const ret      = document.getElementById('bk_ret').value;
  const country  = document.getElementById('bk_country').value;
  const adults   = parseInt(document.getElementById('bk_adults').value) || 1;
  const children = parseInt(document.getElementById('bk_children').value) || 0;
  const accId    = parseInt(document.getElementById('bk_acc').value) || null;
  const wrap     = document.getElementById('bk_price_wrap');

  if (!destId || !dep || !ret || dep >= ret) { wrap.style.display='none'; _bkState.pricing = null; return; }

  const p = calcPrice({ destId, dep, ret, country: country || 'US', adults, children, accId, actIds: _bkState.acts || [] });

  if (!p) { wrap.style.display='none'; _bkState.pricing = null; return; }

  _bkState.pricing = p;
  document.getElementById('bkAmt').textContent = '$' + fmt(p.total);
  wrap.style.display = 'block';
  wrap.innerHTML = `<div class="pb">
    <div class="pb-head">Breakdown — ${p.nights}n · ${p.persons} guests${p.peak ? ' · 🔥 Peak' : ''}</div>
    <div class="pb-row"><span class="pb-l">✈️ Flights</span><span class="pb-v">$${fmt(p.flightCost)}</span></div>
    <div class="pb-row"><span class="pb-l">🏨 Accommodation</span><span class="pb-v">$${fmt(p.accCost)}</span></div>
    ${p.actCost ? '<div class="pb-row"><span class="pb-l">🎯 Activities</span><span class="pb-v">$' + fmt(p.actCost) + '</span></div>' : ''}
    <div class="pb-row"><span class="pb-l">Taxes (12%)</span><span class="pb-v">$${fmt(p.taxes)}</span></div>
    <div class="pb-row total"><span class="pb-l">Total</span><span class="pb-v">$${fmt(p.total)} USD</span></div>
  </div>`;
}

// ── Step control ───────────────────────────────────────────
function _setBkStep(s) {
  _bkState.step = s;
  ['bs1','bs2','bs3'].forEach((id, i) => {
    document.getElementById(id).style.display = i + 1 === s ? 'block' : 'none';
  });
  document.querySelectorAll('.bk-step').forEach(e => {
    const n = parseInt(e.dataset.s);
    e.classList.remove('active','done');
    if (n === s) e.classList.add('active');
    else if (n < s) e.classList.add('done');
  });
  document.getElementById('bkBtnBack').style.display = s > 1 ? 'inline-flex' : 'none';
  document.getElementById('bkBtnNext').textContent   = s === 3 ? 'Submit Booking' : 'Continue';
  if (s === 3) _buildPaymentStep();
}

// ── Build payment step ─────────────────────────────────────
function _buildPaymentStep() {
  const { fmt, DESTINATIONS } = window.TV || {};
  const p    = _bkState.pricing;
  const dest = DESTINATIONS ? DESTINATIONS.find(x => x.id === _bkState.destId) : null;
  const dep  = document.getElementById('bk_dep').value;
  const ret  = document.getElementById('bk_ret').value;

  // Order summary
  const sum = document.getElementById('bk_order_sum');
  if (p && dest) {
    sum.innerHTML = `<div class="pb">
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">
        <img src="${dest.img}" style="width:48px;height:48px;border-radius:8px;object-fit:cover" onerror="this.style.display='none'"/>
        <div>
          <strong style="color:var(--white);font-size:.92rem">${dest.name}, ${dest.country}</strong>
          <div style="font-size:.72rem;color:var(--muted);margin-top:2px">${dep} → ${ret} · ${p.nights} nights · ${p.persons} guests</div>
        </div>
      </div>
      <div class="pb-row total"><span class="pb-l">Total to Pay</span><span class="pb-v">$${fmt(p.total)} USD</span></div>
    </div>`;
  }

  // Build payment method cards
  const tiles = document.getElementById('bk_payTiles');
  tiles.innerHTML = PAY_METHODS.map(m => `
    <div id="pmt_${m.id}" onclick="_selPayM('${m.id}')" style="
      border-radius:10px;border:2px solid ${_bkState.payM===m.id ? m.color : 'rgba(255,255,255,.08)'};
      padding:12px 6px;text-align:center;cursor:pointer;transition:all .25s;
      background:${_bkState.payM===m.id ? m.bg : 'rgba(255,255,255,.02)'};
    ">
      <div style="font-size:.75rem;font-weight:700;color:${_bkState.payM===m.id ? m.color : 'rgba(255,255,255,.7)'};letter-spacing:.03em">${m.label}</div>
    </div>`).join('');

  _selPayM(_bkState.payM || PAY_METHODS[0].id);
}

// ── Select payment method ──────────────────────────────────
function _selPayM(methodId) {
  _bkState.payM = methodId;
  const method = PAY_METHODS.find(m => m.id === methodId);
  if (!method) return;

  // Rebuild cards to reflect selection
  PAY_METHODS.forEach(m => {
    const el = document.getElementById('pmt_' + m.id);
    if (!el) return;
    const active = m.id === methodId;
    el.style.borderColor = active ? m.color : 'rgba(255,255,255,.08)';
    el.style.background  = active ? m.bg    : 'rgba(255,255,255,.02)';
    el.querySelector('div').style.color = active ? m.color : 'rgba(255,255,255,.7)';
  });

  // Show selected label
  const sel = document.getElementById('bk_paySelected');
  const lbl = document.getElementById('bk_paySelectedLabel');
  if (sel && lbl) { lbl.textContent = method.label; sel.style.display = 'block'; }
}

// ── Navigation ─────────────────────────────────────────────
function _bkNav(dir) {
  if (dir === 1) {
    if (!_validateBk(_bkState.step)) return;
    if (_bkState.step === 3) { _openConfirmModal(); return; }
    _setBkStep(_bkState.step + 1);
  } else {
    _setBkStep(_bkState.step - 1);
  }
}

function _validateBk(s) {
  _clearBkErr();
  if (s === 1) {
    if (!document.getElementById('bk_dest').value)    return _bkErr('bk_err1','Please select a destination.');
    if (!document.getElementById('bk_dep').value)     return _bkErr('bk_err1','Please select departure date.');
    if (!document.getElementById('bk_ret').value)     return _bkErr('bk_err1','Please select return date.');
    if (document.getElementById('bk_dep').value >= document.getElementById('bk_ret').value)
                                                       return _bkErr('bk_err1','Return must be after departure.');
    if (!document.getElementById('bk_country').value) return _bkErr('bk_err1','Please select your country.');
    if (!_bkState.pricing)                             return _bkErr('bk_err1','Price is still calculating — please wait a moment.');
    return true;
  }
  if (s === 2) {
    const fn    = (document.getElementById('bk_fn')?.value || '').trim();
    const ln    = (document.getElementById('bk_ln')?.value || '').trim();
    const email = (document.getElementById('bk_email')?.value || '').trim();
    const phone = (document.getElementById('bk_phone')?.value || '').trim();
    if (!fn || !ln)    return _bkErr('bk_err2', 'Please enter your full name.');
    if (!email)        return _bkErr('bk_err2', 'Please enter your email address.');
    if (!phone)        return _bkErr('bk_err2', 'Please enter your WhatsApp number.');
    return true;
  }
  return true;
}

function _bkErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
  return false;
}
function _clearBkErr() {
  document.querySelectorAll('#bookModal .gerr').forEach(e => { e.style.display='none'; e.textContent=''; });
}

// ── WhatsApp message to admin ──────────────────────────────
function _sendPaymentWA() {
  if (!window.TV) return;
  const { DESTINATIONS, ACCOMMODATIONS, ACTIVITIES, fmt, ADMIN_WHATSAPP } = window.TV;
  const p        = _bkState.pricing;
  const dest     = DESTINATIONS ? DESTINATIONS.find(x => x.id === _bkState.destId) : null;
  const dep      = (document.getElementById('bk_dep')  ||{value:''}).value;
  const ret      = (document.getElementById('bk_ret')  ||{value:''}).value;
  const adults   = parseInt((document.getElementById('bk_adults')  ||{value:1}).value)  || 1;
  const children = parseInt((document.getElementById('bk_children')||{value:0}).value)  || 0;
  const accId    = parseInt((document.getElementById('bk_acc')     ||{value:''}).value) || null;
  const ph       = ((document.getElementById('bk_phone') ||{value:''}).value).trim();
  const fn       = ((document.getElementById('bk_fn')    ||{value:''}).value).trim();
  const ln       = ((document.getElementById('bk_ln')    ||{value:''}).value).trim();
  const email    = ((document.getElementById('bk_email') ||{value:''}).value).trim();
  const notes    = ((document.getElementById('bk_notes') ||{value:''}).value).trim();
  const country  = ((document.getElementById('bk_country')||{value:''}).value).trim();
  const method   = PAY_METHODS.find(m => m.id === _bkState.payM);
  const pendCode = (_pendRes && _pendRes.length) ? _pendRes[_pendRes.length - 1].code : '';

  // Accommodation name
  let accLabel = 'Standard (included)';
  if (accId && ACCOMMODATIONS && dest) {
    const ac = (ACCOMMODATIONS[dest.id] || []).find(a => a.id === accId);
    if (ac) accLabel = ac.n;
  }

  // Activity names
  let actLabel = 'None';
  if (_bkState.acts && _bkState.acts.length && ACTIVITIES && dest) {
    const acts = ACTIVITIES[dest.id] || [];
    actLabel = _bkState.acts.map(function(aid) {
      const a = acts.find(function(x) { return x.id === aid; });
      return a ? a.n : String(aid);
    }).join(', ');
  }

  const parts = [
    '\u270C\uFE0F *TRAVENCIA \u2014 NEW BOOKING*',
    ''
  ];
  if (pendCode) parts.push('\uD83D\uDD16 *Code:* ' + pendCode, '');
  const adminEmail = (window.TV && window.TV.ADMIN_EMAIL) || 'travenciaagency@gmail.com';
  parts.push(
    '\uD83D\uDC64 *GUEST*',
    '   Name: ' + (fn + ' ' + ln).trim(),
    '   Email: ' + email,
    '   WhatsApp: ' + ph,
    '   Country: ' + country,
    '',
    '\uD83C\uDF0D *TRIP DETAILS*',
    '   Destination: ' + (dest ? dest.name + ', ' + dest.country : '\u2014'),
    '   Dates: ' + dep + ' \u2192 ' + ret + (p ? ' (' + p.nights + ' nights)' : ''),
    '   Guests: ' + adults + ' adult' + (adults > 1 ? 's' : '') + (children ? ' + ' + children + ' child' + (children > 1 ? 'ren' : '') : ''),
    '   Accommodation: ' + accLabel,
    '   Activities: ' + actLabel
  );
  if (notes) parts.push('   Notes: ' + notes);
  parts.push('', '\uD83D\uDCB0 *PRICING*');
  if (p) {
    parts.push('   Flights: $' + fmt(p.flightCost));
    parts.push('   Accommodation: $' + fmt(p.accCost));
    if (p.actCost) parts.push('   Activities: $' + fmt(p.actCost));
    parts.push('   Taxes: $' + fmt(p.taxes));
    parts.push('   *TOTAL: $' + fmt(p.total) + ' USD*');
  }
  parts.push(
    '',
    '\uD83D\uDCB3 *Payment method:* ' + (method ? method.label : (_bkState.payM || '\u2014')),
    '',
    '\uD83D\uDCF8 Screenshot sent. Please confirm. \uD83D\uDE4F',
    '\u2709\uFE0F Booking email: ' + adminEmail
  );

  const msg = parts.filter(Boolean).join('\n');
  const wa  = (window.TV && window.TV.ADMIN_WHATSAPP) || '13082533668';
  window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(msg), '_blank');
}

// ── Confirm modal (worldcup-style review before submit) ───
function _openConfirmModal() {
  var fmt  = ((window.TV || {}).fmt) || function(v){ return Number(v).toLocaleString(); };
  var DEST = ((window.TV || {}).DESTINATIONS) || [];
  var p    = _bkState.pricing || {};
  var dest = DEST.find(function(x){ return x.id === _bkState.destId; }) || null;
  var dep    = (document.getElementById('bk_dep')   ||{value:''}).value;
  var ret    = (document.getElementById('bk_ret')   ||{value:''}).value;
  var fn     = ((document.getElementById('bk_fn')   ||{value:''}).value).trim();
  var ln     = ((document.getElementById('bk_ln')   ||{value:''}).value).trim();
  var em     = ((document.getElementById('bk_email')||{value:''}).value).trim();
  var ph     = ((document.getElementById('bk_phone')||{value:''}).value).trim();
  var adults = (document.getElementById('bk_adults')||{value:1}).value || 1;
  var method = PAY_METHODS.find(function(m){ return m.id === _bkState.payM; });

  var rowData = [
    ['Destination', dest ? dest.name + ', ' + dest.country : '\u2014'],
    ['Dates',       dep + ' \u2192 ' + ret + (p.nights ? ' (' + p.nights + ' nights)' : '')],
    ['Guests',      adults + ' adult(s)'],
    ['Name',        (fn + ' ' + ln).trim()],
    ['Email',       em],
    ['WhatsApp',    ph],
    ['Payment',     method ? method.label : (_bkState.payM || '\u2014')]
  ];

  document.getElementById('bkConfRows').innerHTML = rowData.map(function(r){
    return '<div class="wcconf-row"><span class="wcconf-lbl">' + r[0] + '</span><span class="wcconf-val">' + r[1] + '</span></div>';
  }).join('');
  document.getElementById('bkConfTotal').textContent = p.total ? '$' + fmt(p.total) + ' USD' : '\u2014';
  document.getElementById('bkConfModal').classList.add('open');
}
function _closeConfirmModal() {
  document.getElementById('bkConfModal').classList.remove('open');
}

// ── Submit booking to API ──────────────────────────────────
async function _submitBk(mode) {
  // mode: 'whatsapp' | 'email'
  const btn = document.getElementById('bkBtnNext');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

  // If not logged in, show auth modal first
  const tok = typeof getToken === 'function' ? getToken() : '';
  if (!tok) {
    if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Submit'; }
    _closeM('bookModal');
    if (typeof openAuth === 'function') openAuth('login');
    return;
  }

  const dep      = document.getElementById('bk_dep').value;
  const ret      = document.getElementById('bk_ret').value;
  const adults   = parseInt(document.getElementById('bk_adults').value)   || 1;
  const children = parseInt(document.getElementById('bk_children').value) || 0;
  const coCode   = document.getElementById('bk_country').value || 'US';
  const accId    = parseInt(document.getElementById('bk_acc').value)       || null;
  const ph       = document.getElementById('bk_phone').value.trim();
  const notes    = document.getElementById('bk_notes').value.trim();
  const p        = _bkState.pricing || {};
  const { DESTINATIONS } = window.TV || {};
  const dest     = DESTINATIONS ? DESTINATIONS.find(x => x.id === _bkState.destId) : null;

  const PM_MAP = { paypal:'paypal', bank:'paypal', bank_transfer:'paypal',
                   cashapp:'paypal', other:'paypal' };

  const subtotal = (p.flightCost || 0) + (p.accCost || 0) + (p.actCost || 0);

  const payload = {
    destination_id:      _bkState.destId,
    accommodation_id:    accId,
    phone:               ph || null,
    country_of_origin:   coCode,
    num_adults:          adults,
    num_children:        children,
    departure_date:      dep,
    return_date:         ret,
    payment_method:      PM_MAP[_bkState.payM] || 'paypal',
    selected_activities: _bkState.acts || [],
    flight_cost:         p.flightCost || 0,
    accommodation_cost:  p.accCost    || 0,
    activities_cost:     p.actCost    || 0,
    subtotal:            subtotal,
    taxes:               p.taxes      || 0,
    total_amount:        p.total      || 0,
    is_peak_season:      p.peak       || false,
    notes:               notes,
    ref:                 null
  };

  try {
    const r = await fetch(API + '/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tok },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!data.success) {
      if (data.must_login) {
        if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Submit'; }
        _closeM('bookModal');
        if (typeof openAuth === 'function') openAuth('login');
        return;
      }
      if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Submit'; }
      _bkErr('bk_err3', data.error || 'Submission failed. Please try again.');
      return;
    }
    const code = data.data.reservation_code;
    _pendRes.push({ code, dest: dest ? dest.name : '', total: p.total || 0 });
    // Store chosen mode for the success screen
    _bkState._sendMode = mode || 'whatsapp';
    if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Submit'; }
    _closeM('bookModal');
    // Show success overlay
    setTimeout(function() { _showWait(code, mode); }, 400);
    // Auto-trigger chosen send method
    if (mode === 'email') {
      setTimeout(function() { _sendPaymentEmail(); }, 1200);
    } else {
      setTimeout(function() { _sendPaymentWA(); }, 1600);
    }
  } catch (err) {
    console.error('[submitBk]', err);
    if (btn) { btn.disabled = false; btn.textContent = 'Confirm & Submit'; }
    _bkErr('bk_err3', 'Connection error. Please check your internet and try again.');
  }
}

function _showWait(code) {
  const { fmt } = window.TV || {};
  document.getElementById('waitCode').textContent = code;
  const rl = document.getElementById('resList');
  if (rl) rl.innerHTML = _pendRes.map(r => `
    <div class="res-item">
      <div>
        <strong style="color:var(--white);font-size:.87rem">${r.dest}</strong>
        <div style="font-size:.72rem;color:var(--gold2);margin-top:2px">${r.code}</div>
      </div>
      <div>
        <span class="ri-status">Pending Payment</span>
        <div style="font-size:.74rem;color:var(--muted);margin-top:4px">${fmt ? '$'+fmt(r.total) : r.total} USD</div>
      </div>
    </div>`).join('');
  document.getElementById('waitOver').classList.add('open');
}

function _newReservation() {
  document.getElementById('waitOver').classList.remove('open');
  openBooking(null);
}

// ── Modal helpers ──────────────────────────────────────────
function _openM(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function _closeM(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}
window.openM  = _openM;
window.closeM = _closeM;

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(o => _closeM(o.id));
});
