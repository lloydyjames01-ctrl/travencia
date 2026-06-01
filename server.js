/**
 * TRAVENCIA V2 — Server (Railway Edition)
 * Clean deployment: no agents, no card payments
 * Contact: travenciaagency@gmail.com
 */

const express    = require('express');
const mysql      = require('mysql2/promise');
const cors       = require('cors');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const path       = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ── Email transporter ──────────────────────────────────────
// Set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS in .env
// e.g. Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER=yourmail@gmail.com, SMTP_PASS=app_password
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'travenciaagency@gmail.com';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+1 (308) 253-3668';
const SITE_NAME   = 'Travencia';

async function sendMail({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[email] SMTP not configured — skipping. Would send to:', to, '|', subject);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"${SITE_NAME}" <${process.env.SMTP_USER}>`,
      to, subject, html,
    });
    console.log('[email] Sent to', to);
  } catch (e) {
    console.error('[email] Failed:', e.message);
  }
}

// ── Email templates ────────────────────────────────────────
function emailBase(body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>
    body{font-family:Arial,sans-serif;background:#04080F;color:#D8E4F8;margin:0;padding:0}
    .wrap{max-width:600px;margin:0 auto;padding:32px 24px}
    .logo{font-size:2rem;font-weight:900;letter-spacing:.1em;color:#E8B030;margin-bottom:4px}
    .logo span{color:#5090E0}
    .card{background:#0C1628;border:1px solid rgba(45,114,210,.25);border-radius:14px;padding:28px 32px;margin-top:20px}
    h2{color:#fff;margin:0 0 16px;font-size:1.3rem}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(45,114,210,.1);font-size:.9rem}
    .row:last-child{border:none}
    .lbl{color:#7A90B8}.val{color:#fff;font-weight:600;text-align:right}
    .total{background:rgba(200,149,32,.08);border:1px solid rgba(200,149,32,.25);border-radius:8px;padding:14px 18px;margin-top:14px;text-align:center}
    .total-lbl{font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:#7A90B8;margin-bottom:4px}
    .total-val{font-size:1.8rem;font-weight:900;color:#E8B030}
    .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:18px}
    .badge-pend{background:rgba(217,119,6,.15);color:#fbbf24;border:1px solid rgba(217,119,6,.3)}
    .badge-conf{background:rgba(24,160,88,.15);color:#40c878;border:1px solid rgba(24,160,88,.3)}
    .badge-canc{background:rgba(224,48,48,.15);color:#f06060;border:1px solid rgba(224,48,48,.3)}
    .cta{display:inline-block;padding:13px 28px;border-radius:8px;font-weight:700;font-size:.88rem;text-decoration:none;letter-spacing:.06em;text-transform:uppercase;margin-top:18px}
    .cta-green{background:linear-gradient(135deg,#25D366,#1ab854);color:#fff}
    .cta-blue{background:linear-gradient(135deg,#2D72D2,#1340A0);color:#fff}
    .ft{text-align:center;font-size:.76rem;color:#3A4F72;margin-top:28px;line-height:1.7}
  </style></head><body><div class="wrap">
    <div class="logo">TRAV<span>ENCIA</span></div>
    <div style="font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:#7A90B8;margin-bottom:18px">Explore · Dream · Discover</div>
    ${body}
    <div class="ft">&copy; ${new Date().getFullYear()} Travencia &bull; travenciaagency@gmail.com &bull; ${ADMIN_PHONE}</div>
  </div></body></html>`;
}

function emailBookingReceived(res) {
  const rows = [
    ['Booking Code',  res.reservation_code],
    ['Destination',   res.dest_name || res.dest_name_override || '—'],
    ['Departure',     res.departure_date],
    ['Return',        res.return_date],
    ['Guests',        `${res.num_adults} adult(s)${res.num_children ? ' + ' + res.num_children + ' child(ren)' : ''}`],
    ['Payment',       res.payment_method],
  ].map(([l,v]) => `<div class="row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join('');
  return emailBase(`
    <div class="card">
      <span class="badge badge-pend">Received</span>
      <h2>✈️ Your Booking is Received!</h2>
      <p style="margin-bottom:16px;line-height:1.7">Hi <strong style="color:#E8B030">${res.first_name}</strong>, we've received your booking request. Our team will review it and confirm within <strong>2 hours</strong>.</p>
      ${rows}
      <div class="total"><div class="total-lbl">Total Amount</div><div class="total-val">$${Number(res.total_amount||0).toLocaleString()} USD</div></div>
      <p style="margin-top:16px;font-size:.82rem;color:#7A90B8">📸 Please send your payment screenshot to us on WhatsApp to speed up confirmation.</p>
      <a class="cta cta-green" href="https://wa.me/${(ADMIN_PHONE||'').replace(/\D/g,'')}">Send Payment Screenshot</a>
    </div>`);
}

function emailNewBooking(res) {
  const rows = [
    ['Code',          res.reservation_code],
    ['Destination',   res.dest_name || res.dest_name_override || '—'],
    ['Guest',         `${res.first_name} ${res.last_name}`],
    ['Email',         res.email],
    ['WhatsApp',      res.phone || '—'],
    ['Dates',         `${res.departure_date} → ${res.return_date}`],
    ['Guests',        `${res.num_adults} adult(s)${res.num_children ? ' + ' + res.num_children + ' child(ren)' : ''}`],
    ['Payment',       res.payment_method],
  ].map(([l,v]) => `<div class="row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join('');
  return emailBase(`
    <div class="card">
      <span class="badge badge-pend">New Booking</span>
      <h2>✈️ New Reservation Received</h2>
      ${rows}
      <div class="total"><div class="total-lbl">Total Due</div><div class="total-val">$${Number(res.total_amount||0).toLocaleString()} USD</div></div>
      <p style="font-size:.82rem;color:#7A90B8;margin-top:16px">Log in to the admin panel to review, confirm, or reject this reservation.</p>
    </div>`);
}

function emailBookingStatus(res, status, adminNote) {
  const isConf = status === 'confirmed';
  const isCanc = status === 'cancelled';
  const badge  = isConf ? 'badge-conf' : isCanc ? 'badge-canc' : 'badge-pend';
  const label  = isConf ? 'Confirmed ✅' : isCanc ? 'Cancelled ❌' : status;
  const msg    = isConf
    ? `<p>Great news! Your reservation <strong style="color:#E8B030">${res.reservation_code}</strong> has been <strong style="color:#40c878">confirmed</strong> by our team. We will be in touch to finalise payment and travel details.</p>`
    : isCanc
    ? `<p>Your reservation <strong style="color:#E8B030">${res.reservation_code}</strong> has been <strong style="color:#f06060">cancelled</strong>. If you have questions, please contact us.</p>`
    : `<p>Your reservation <strong style="color:#E8B030">${res.reservation_code}</strong> status has been updated to: <strong>${status}</strong>.</p>`;
  const noteBlock = adminNote ? `<div style="background:rgba(45,114,210,.1);border:1px solid rgba(45,114,210,.2);border-radius:8px;padding:12px 16px;margin-top:14px;font-size:.85rem;color:#D8E4F8"><strong style="color:#5090E0">Note from Travencia:</strong><br/>${adminNote}</div>` : '';
  return emailBase(`
    <div class="card">
      <span class="badge ${badge}">${label}</span>
      <h2>Your Reservation Update</h2>
      ${msg}
      ${noteBlock}
      <div class="total"><div class="total-lbl">Total Amount</div><div class="total-val">$${Number(res.total_amount||0).toLocaleString()} USD</div></div>
      <p style="margin-top:18px;font-size:.82rem;color:#7A90B8">For any questions, reach us on WhatsApp or email — we respond within 2 hours.</p>
      <a class="cta cta-green" href="https://wa.me/${(ADMIN_PHONE||'').replace(/\D/g,'')}">Contact on WhatsApp</a>
    </div>`);
}

function emailContactAdmin({ first_name, last_name, email, phone, subject, destination, message }) {
  return emailBase(`
    <div class="card">
      <span class="badge badge-pend">New Inquiry</span>
      <h2>📩 New Contact Form Submission</h2>
      ${[
        ['Name',        `${first_name} ${last_name||''}`],
        ['Email',       email],
        ['Phone',       phone||'—'],
        ['Subject',     subject||'—'],
        ['Destination', destination||'—'],
      ].map(([l,v])=>`<div class="row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join('')}
      <div style="margin-top:16px;background:rgba(45,114,210,.08);border:1px solid rgba(45,114,210,.15);border-radius:8px;padding:14px 16px;font-size:.88rem;line-height:1.7">${message.replace(/\n/g,'<br/>')}</div>
    </div>`);
}

function emailContactReply({ name, email }) {
  return emailBase(`
    <div class="card">
      <h2>Message Received!</h2>
      <p>Hi <strong style="color:#E8B030">${name}</strong>,</p>
      <p style="line-height:1.75">Thank you for reaching out to Travencia. Our travel specialists have received your message and will respond within <strong>2 hours</strong>.</p>
      <p style="line-height:1.75">For faster assistance you can also reach us directly:</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:14px">
        <a class="cta cta-green" href="https://wa.me/${(ADMIN_PHONE||'').replace(/\D/g,'')}">WhatsApp Us</a>
        <a class="cta cta-blue" href="mailto:${ADMIN_EMAIL}">Email Us</a>
      </div>
    </div>`);
}

const app  = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'travencia_dev_secret';

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Database ───────────────────────────────────────────────
const db = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASS,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

async function ensureSchema() {
  const migrations = [
    `ALTER TABLE reservations ADD COLUMN IF NOT EXISTS dest_name_override VARCHAR(160) NULL AFTER destination_id`,
    `CREATE TABLE IF NOT EXISTS site_visits (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      page       VARCHAR(120) NOT NULL DEFAULT '/',
      ip_address VARCHAR(45),
      user_agent VARCHAR(255),
      visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_page (page),
      INDEX idx_visited (visited_at)
    )`,
  ];
  for (const sql of migrations) {
    try { await db.query(sql); }
    catch (e) {
      if (!String(e.message).includes('Duplicate column') && !String(e.message).includes('IF NOT EXISTS')) {
        console.warn('[schema]', e.message);
      }
    }
  }
}

function genCode(prefix = 'TV') {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = prefix + '-';
  for (let i = 0; i < 8; i++) code += c[Math.floor(Math.random() * c.length)];
  return code;
}

function authMiddleware(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'You must be logged in to book.', must_login: true });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ success: false, error: 'Session expired. Please log in again.' }); }
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
app.post('/api/auth/register', async (req, res) => {
  try {
    const { first_name, last_name, password, whatsapp, country } = req.body;
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!first_name || !email || !password)
      return res.status(400).json({ success: false, error: 'First name, email and password required.' });
    const [[ex]] = await db.query('SELECT id FROM users WHERE LOWER(email)=?', [email]);
    if (ex) return res.status(409).json({ success: false, error: 'Account already exists. Please log in.', must_login: true });
    const hash = await bcrypt.hash(password, 12);
    const [r]  = await db.query(
      'INSERT INTO users (first_name,last_name,email,password_hash,whatsapp,country,is_verified) VALUES (?,?,?,?,?,?,1)',
      [first_name, last_name || '', email, hash, whatsapp || null, country || null]
    );
    const token = jwt.sign({ id: r.insertId, email, first_name, role: 'client' }, JWT_SECRET, { expiresIn: '365d' });
    res.json({ success: true, data: { id: r.insertId, email, first_name, role: 'client', token } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email    = String(req.body.email || '').trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required.' });
    const [[user]] = await db.query('SELECT * FROM users WHERE LOWER(email)=?', [email]);
    if (!user)
      return res.status(401).json({ success: false, error: 'No account found. Please register first.', must_register: true });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, error: 'Incorrect password.' });
    await db.query('UPDATE users SET last_login=NOW() WHERE id=?', [user.id]);
    const token = jwt.sign({ id: user.id, email: user.email, first_name: user.first_name, role: user.role }, JWT_SECRET, { expiresIn: '365d' });
    res.json({ success: true, data: { id: user.id, email: user.email, first_name: user.first_name, role: user.role, token } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const [[user]] = await db.query(
      'SELECT id,first_name,last_name,email,whatsapp,country,role FROM users WHERE id=?', [req.user.id]
    );
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: user });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const incoming = (req.headers.authorization || '').split(' ')[1] || (req.body && req.body.token) || '';
    if (!incoming) return res.status(401).json({ success: false, error: 'No token.' });
    let payload;
    try { payload = jwt.verify(incoming, JWT_SECRET, { ignoreExpiration: true }); }
    catch { return res.status(401).json({ success: false, error: 'Invalid token.' }); }
    const [[user]] = await db.query('SELECT id,first_name,email,role FROM users WHERE id=?', [payload.id]);
    if (!user) return res.status(401).json({ success: false, error: 'Account not found.' });
    const newToken = jwt.sign(
      { id: user.id, email: user.email, first_name: user.first_name, role: user.role },
      JWT_SECRET, { expiresIn: '365d' }
    );
    res.json({ success: true, data: { token: newToken, first_name: user.first_name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ═══════════════════════════════════════════════════════════
// DESTINATIONS / VEHICLES / PRICING
// ═══════════════════════════════════════════════════════════
app.get('/api/destinations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM destinations WHERE is_active=1 ORDER BY is_featured DESC, rating DESC');
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/destinations/:id', async (req, res) => {
  try {
    const [[d]] = await db.query('SELECT * FROM destinations WHERE id=? AND is_active=1', [req.params.id]);
    if (!d) return res.status(404).json({ success: false, error: 'Not found' });
    const [accs] = await db.query('SELECT * FROM accommodations WHERE destination_id=? AND is_active=1 ORDER BY stars DESC', [req.params.id]);
    const [acts] = await db.query('SELECT * FROM activities WHERE destination_id=? AND is_active=1', [req.params.id]);
    res.json({ success: true, data: { ...d, accommodations: accs, activities: acts } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/vehicles', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vehicles WHERE is_active=1 ORDER BY price_usd ASC');
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/pricing', async (req, res) => {
  try {
    const { destination_id, departure_date, return_date, country_code, num_adults, num_children, accommodation_id, activity_ids } = req.body;
    const nights  = Math.max(1, Math.ceil((new Date(return_date) - new Date(departure_date)) / 86400000));
    const persons = (num_adults || 1) + (num_children || 0);
    const [[dest]] = await db.query('SELECT price_per_night, premium_mult FROM destinations WHERE id=?', [destination_id]);
    const [rules]  = await db.query('SELECT * FROM pricing_rules');
    const rule = rules.find(r => {
      const codes = typeof r.country_codes === 'string' ? JSON.parse(r.country_codes) : r.country_codes;
      return codes.includes(country_code || 'CM');
    }) || { base_flight_cost: 820 };
    const flightCost = Number(rule.base_flight_cost) * (num_adults || 1) * Number(dest?.premium_mult || 1);
    const month = new Date(departure_date).getMonth() + 1;
    const peak  = [6,7,8,12,1].includes(month);
    const sMult = peak ? 1.28 : 1.0;
    let accCost = 0;
    if (accommodation_id) {
      const [[acc]] = await db.query('SELECT price_per_night FROM accommodations WHERE id=?', [accommodation_id]);
      accCost = Number(acc?.price_per_night || 0) * nights * sMult;
    } else {
      accCost = Number(dest?.price_per_night || 0) * nights * sMult;
    }
    let actCost = 0;
    if (activity_ids?.length) {
      const ph = activity_ids.map(() => '?').join(',');
      const [[tot]] = await db.query(`SELECT COALESCE(SUM(price_per_person),0) as t FROM activities WHERE id IN (${ph})`, activity_ids);
      actCost = Number(tot.t) * (num_adults || 1);
    }
    const sub   = flightCost + accCost + actCost;
    const taxes = sub * 0.12;
    res.json({ success: true, data: {
      nights, persons, peak,
      flight_cost: Math.round(flightCost), accommodation_cost: Math.round(accCost),
      activities_cost: Math.round(actCost), subtotal: Math.round(sub),
      taxes: Math.round(taxes), total: Math.round(sub + taxes), currency: 'USD'
    }});
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ═══════════════════════════════════════════════════════════
// RESERVATIONS — login required, screenshot-payment model
// Payment method stored is just the label (paypal/bank/cashapp/other)
// No card data collected — user screenshots and sends to admin via WA
// ═══════════════════════════════════════════════════════════
app.post('/api/reservations', authMiddleware, async (req, res) => {
  try {
    const [[user]] = await db.query(
      'SELECT id,first_name,last_name,email,whatsapp,country FROM users WHERE id=?', [req.user.id]
    );
    if (!user) return res.status(401).json({ success: false, error: 'Account not found. Please register.', must_register: true });

    const {
      destination_id, accommodation_id, dest_name_override,
      phone, country_of_origin, num_adults, num_children,
      departure_date, return_date,
      payment_method,        // paypal | bank | cashapp | other
      selected_activities,
      flight_cost, accommodation_cost, activities_cost, vehicles_cost,
      subtotal, taxes, total_amount, is_peak_season, notes,
    } = req.body;

    if (!destination_id || !departure_date || !return_date || !payment_method)
      return res.status(400).json({ success: false, error: 'Missing required fields.' });

    const code = genCode('TV');
    const [result] = await db.query(
      `INSERT INTO reservations
       (reservation_code, user_id, destination_id, dest_name_override, accommodation_id,
        first_name, last_name, email, phone, country_of_origin,
        num_adults, num_children, departure_date, return_date,
        flight_cost, accommodation_cost, activities_cost, vehicles_cost,
        subtotal, taxes, total_amount, is_peak_season,
        payment_method, payment_data_enc,
        selected_activities, notes, status, ip_address)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        code, user.id, destination_id, dest_name_override || null, accommodation_id || null,
        user.first_name, user.last_name, user.email,
        phone || user.whatsapp || null,
        country_of_origin || user.country || null,
        num_adults || 1, num_children || 0,
        departure_date, return_date,
        flight_cost || 0, accommodation_cost || 0, activities_cost || 0, vehicles_cost || 0,
        subtotal || 0, taxes || 0, total_amount || 0,
        is_peak_season ? 1 : 0,
        payment_method,
        JSON.stringify({ method: payment_method }),
        JSON.stringify(selected_activities || []),
        notes || null, 'pending', req.ip
      ]
    );

    res.json({ success: true, data: { id: result.insertId, reservation_code: code, status: 'pending' } });

    // Notify admin by email (non-blocking)
    try {
      const [[resRow]] = await db.query(
        `SELECT r.*, COALESCE(r.dest_name_override, d.name, 'Unknown') AS dest_name
         FROM reservations r LEFT JOIN destinations d ON r.destination_id=d.id
         WHERE r.id=?`, [result.insertId]
      );
      if (resRow) {
        // Email admin
        sendMail({
          to: ADMIN_EMAIL,
          subject: `[Travencia] New Booking ${code} — ${resRow.dest_name} — $${resRow.total_amount}`,
          html: emailNewBooking(resRow)
        });
        // Email customer confirmation
        sendMail({
          to: resRow.email,
          subject: `Travencia — Booking Received: ${code}`,
          html: emailBookingReceived(resRow)
        });
      }
    } catch(e){ console.warn('[notify]', e.message); }
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// My reservations
app.get('/api/reservations/mine', authMiddleware, async (req, res) => {
  try {
    const [[me]] = await db.query('SELECT id, email FROM users WHERE id=?', [req.user.id]);
    if (!me) return res.status(401).json({ success: false, error: 'User not found.' });
    const [rows] = await db.query(
      `SELECT r.reservation_code, r.status, r.created_at,
              r.departure_date, r.return_date, r.total_amount,
              r.num_adults, r.num_children, r.payment_method,
              COALESCE(r.dest_name_override, d.name, 'Unknown') AS dest_name,
              COALESCE(d.country,'') AS dest_country
       FROM reservations r
       LEFT JOIN destinations d ON r.destination_id = d.id
       WHERE r.user_id = ? OR LOWER(r.email) = LOWER(?)
       ORDER BY r.created_at DESC`,
      [me.id, me.email]
    );
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Status poll by code (public)
app.get('/api/reservations/status/:code', async (req, res) => {
  try {
    const [[row]] = await db.query(
      'SELECT reservation_code, status, updated_at, confirmed_at FROM reservations WHERE reservation_code=?',
      [req.params.code]
    );
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: row });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Site visit tracking (called from each page on load)
app.post('/api/track/visit', async (req, res) => {
  try {
    const page = String(req.body.page || '/').substring(0, 120);
    await db.query(
      'INSERT INTO site_visits (page, ip_address, user_agent) VALUES (?,?,?)',
      [page, req.ip, (req.headers['user-agent'] || '').substring(0, 255)]
    );
    res.json({ success: true });
  } catch (e) { res.json({ success: false }); } // silent fail
});

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, subject, destination, message } = req.body;
    if (!first_name || !email || !message)
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    const [result] = await db.query(
      'INSERT INTO contact_inquiries (first_name,last_name,email,phone,subject,destination,message,ip_address) VALUES (?,?,?,?,?,?,?,?)',
      [first_name, last_name || '', email, phone || null, subject || null, destination || null, message, req.ip]
    );
    // Send emails in background
    const data = { first_name, last_name, email, phone, subject, destination, message };
    sendMail({ to: ADMIN_EMAIL, subject: `[Travencia] New Contact: ${subject || 'Inquiry'} — ${first_name} ${last_name||''}`, html: emailContactAdmin(data) });
    sendMail({ to: email, subject: 'Travencia — We received your message', html: emailContactReply({ name: first_name, email }) });
    res.json({ success: true, data: { id: result.insertId } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Vehicle booking
app.post('/api/vehicles/book', authMiddleware, async (req, res) => {
  try {
    const [[user]] = await db.query('SELECT id,first_name,last_name,whatsapp FROM users WHERE id=?', [req.user.id]);
    if (!user) return res.status(401).json({ success: false, error: 'Account not found.', must_register: true });
    const { vehicle_id, phone, destination, pickup_date, pickup_time, flight_number, num_passengers, notes } = req.body;
    if (!vehicle_id || !destination || !pickup_date)
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    const [[veh]] = await db.query('SELECT price_usd FROM vehicles WHERE id=?', [vehicle_id]);
    const code = genCode('VH');
    const [result] = await db.query(
      `INSERT INTO vehicle_bookings
       (booking_code,vehicle_id,first_name,last_name,phone,destination,
        pickup_date,pickup_time,flight_number,num_passengers,price_usd,notes)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [code, vehicle_id, user.first_name, user.last_name,
       phone || user.whatsapp || '', destination,
       pickup_date, pickup_time || null, flight_number || null,
       num_passengers || 1, veh?.price_usd || 0, notes || null]
    );
    res.json({ success: true, data: { id: result.insertId, booking_code: code, status: 'pending' } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});


// ═══════════════════════════════════════════════════════════
// ADMIN ROUTES — role:admin required
// ═══════════════════════════════════════════════════════════
function adminOnly(req, res, next) {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    const u = jwt.verify(token, JWT_SECRET);
    if (u.role !== 'admin') return res.status(403).json({ success: false, error: 'Admins only.' });
    req.user = u; next();
  } catch { res.status(401).json({ success: false, error: 'Invalid token.' }); }
}

// GET all reservations (paginated)
app.get('/api/admin/reservations', adminOnly, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 50;
    const status = req.query.status || '';
    const search = req.query.search || '';
    const offset = (page - 1) * limit;
    let where = '1=1';
    const params = [];
    if (status) { where += ' AND r.status=?'; params.push(status); }
    if (search) {
      where += ' AND (r.reservation_code LIKE ? OR r.email LIKE ? OR r.first_name LIKE ? OR r.last_name LIKE ?)';
      const s = `%${search}%`;
      params.push(s,s,s,s);
    }
    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM reservations r WHERE ${where}`, params);
    const [rows] = await db.query(
      `SELECT r.*, COALESCE(r.dest_name_override, d.name, 'Unknown') AS dest_name,
              COALESCE(d.country,'') AS dest_country
       FROM reservations r LEFT JOIN destinations d ON r.destination_id=d.id
       WHERE ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json({ success: true, data: rows, total, page, pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET single reservation detail
app.get('/api/admin/reservations/:id', adminOnly, async (req, res) => {
  try {
    const [[row]] = await db.query(
      `SELECT r.*, COALESCE(r.dest_name_override, d.name, 'Unknown') AS dest_name,
              COALESCE(d.country,'') AS dest_country,
              a.name AS accommodation_name
       FROM reservations r
       LEFT JOIN destinations d ON r.destination_id=d.id
       LEFT JOIN accommodations a ON r.accommodation_id=a.id
       WHERE r.id=?`, [req.params.id]
    );
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: row });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PATCH status (confirm / cancel / complete)
app.patch('/api/admin/reservations/:id/status', adminOnly, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const valid = ['pending','confirmed','cancelled','completed'];
    if (!valid.includes(status)) return res.status(400).json({ success: false, error: 'Invalid status.' });
    const extra = status === 'confirmed' ? ', confirmed_at=NOW()' : status === 'cancelled' ? ', cancelled_at=NOW()' : '';
    await db.query(
      `UPDATE reservations SET status=?, admin_notes=COALESCE(?,admin_notes)${extra}, updated_at=NOW() WHERE id=?`,
      [status, admin_notes || null, req.params.id]
    );
    // Email client
    if (status === 'confirmed' || status === 'cancelled') {
      try {
        const [[resRow]] = await db.query(
          `SELECT r.*, COALESCE(r.dest_name_override, d.name, 'Unknown') AS dest_name
           FROM reservations r LEFT JOIN destinations d ON r.destination_id=d.id
           WHERE r.id=?`, [req.params.id]
        );
        if (resRow && resRow.email) {
          const subjLabel = status === 'confirmed' ? 'Confirmed ✅' : 'Cancelled ❌';
          sendMail({
            to: resRow.email,
            subject: `Travencia — Reservation ${resRow.reservation_code} ${subjLabel}`,
            html: emailBookingStatus(resRow, status, admin_notes)
          });
        }
      } catch(e){ console.warn('[status-email]', e.message); }
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE reservation
app.delete('/api/admin/reservations/:id', adminOnly, async (req, res) => {
  try {
    const [[row]] = await db.query('SELECT id FROM reservations WHERE id=?', [req.params.id]);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    await db.query('DELETE FROM reservations WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET contact inquiries
app.get('/api/admin/contacts', adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 200');
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PATCH contact status
app.patch('/api/admin/contacts/:id/status', adminOnly, async (req, res) => {
  try {
    await db.query('UPDATE contact_inquiries SET status=? WHERE id=?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE contact
app.delete('/api/admin/contacts/:id', adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM contact_inquiries WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET vehicle bookings
app.get('/api/admin/vehicles', adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT vb.*, v.name AS vehicle_name, v.type AS vehicle_type, v.price_usd
       FROM vehicle_bookings vb LEFT JOIN vehicles v ON vb.vehicle_id=v.id
       ORDER BY vb.created_at DESC LIMIT 200`
    );
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// PATCH vehicle booking status
app.patch('/api/admin/vehicles/:id/status', adminOnly, async (req, res) => {
  try {
    await db.query('UPDATE vehicle_bookings SET status=? WHERE id=?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// DELETE vehicle booking
app.delete('/api/admin/vehicles/:id', adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM vehicle_bookings WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET dashboard stats
app.get('/api/admin/stats', adminOnly, async (req, res) => {
  try {
    const [[totals]] = await db.query(
      `SELECT COUNT(*) AS total_reservations,
              SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending,
              SUM(CASE WHEN status='confirmed' THEN 1 ELSE 0 END) AS confirmed,
              SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END) AS cancelled,
              SUM(CASE WHEN status='confirmed' THEN total_amount ELSE 0 END) AS confirmed_revenue,
              SUM(total_amount) AS total_revenue
       FROM reservations`
    );
    const [[contacts]] = await db.query("SELECT COUNT(*) AS total FROM contact_inquiries WHERE status='new'");
    const [[vehicles]] = await db.query("SELECT COUNT(*) AS total FROM vehicle_bookings WHERE status='pending'");
    // Site visit stats
    let visits_today = 0, visits_total = 0;
    try {
      const [[vt]] = await db.query("SELECT COUNT(*) AS total FROM site_visits WHERE DATE(visited_at)=CURDATE()");
      const [[va]] = await db.query("SELECT COUNT(*) AS total FROM site_visits");
      visits_today = vt.total; visits_total = va.total;
    } catch(e) { /* table may not exist yet */ }
    res.json({ success: true, data: { ...totals, new_contacts: contacts.total, pending_vehicles: vehicles.total, visits_today, visits_total } });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// GET all users (admin)
app.get('/api/admin/users', adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id,first_name,last_name,email,whatsapp,country,role,is_verified,created_at,last_login FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Promote user to admin
app.patch('/api/admin/users/:id/role', adminOnly, async (req, res) => {
  try {
    await db.query('UPDATE users SET role=? WHERE id=?', [req.body.role, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});


// Health check for Railway
app.get('/health', (_, res) => res.json({ ok: true }));

// SPA fallback — only for routes without a file extension
app.get('*', (req, res) => {
  if (path.extname(req.path)) return res.status(404).send('Not found');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────
ensureSchema().catch(console.warn);
app.listen(PORT, () => {
  console.log(`✔  TRAVENCIA  →  http://localhost:${PORT}`);
});
