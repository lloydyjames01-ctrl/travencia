-- ============================================================
-- TRAVENCIA — Complete Database Schema
-- Run: mysql -u root -p < travencia_schema.sql
-- ============================================================

-- -------------------------------------------------------
-- USERS (account creation)
-- -------------------------------------------------------
CREATE TABLE users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,       -- bcrypt
    whatsapp    VARCHAR(30),
    country     VARCHAR(5),
    role        ENUM('client','admin') DEFAULT 'client',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login  TIMESTAMP NULL,
    INDEX idx_email (email)
);

-- -------------------------------------------------------
-- DESTINATIONS
-- -------------------------------------------------------
CREATE TABLE destinations (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    country         VARCHAR(100) NOT NULL,
    continent       VARCHAR(50)  NOT NULL,
    tagline         VARCHAR(255),
    description     TEXT,
    image_filename  VARCHAR(255),
    base_price      DECIMAL(10,2) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    climate         VARCHAR(60),
    best_season     VARCHAR(100),
    rating          DECIMAL(3,2)  DEFAULT 4.50,
    premium_mult    DECIMAL(4,2)  DEFAULT 1.00,
    is_featured     BOOLEAN       DEFAULT FALSE,
    is_active       BOOLEAN       DEFAULT TRUE,
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- ACCOMMODATIONS
-- -------------------------------------------------------
CREATE TABLE accommodations (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    destination_id  INT NOT NULL,
    name            VARCHAR(160) NOT NULL,
    type            ENUM('Hotel','Resort','Villa','Boutique','Hostel') NOT NULL,
    stars           TINYINT DEFAULT 4,
    price_per_night DECIMAL(10,2) NOT NULL,
    description     TEXT,
    amenities       JSON,
    image_filename  VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- ACTIVITIES
-- -------------------------------------------------------
CREATE TABLE activities (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    destination_id  INT NOT NULL,
    name            VARCHAR(160) NOT NULL,
    category        ENUM('Adventure','Culture','Food & Drink','Wellness','Nature','Nightlife','Sightseeing') NOT NULL,
    price_per_person DECIMAL(10,2) NOT NULL,
    duration_hours  DECIMAL(4,1),
    description     TEXT,
    image_filename  VARCHAR(255),
    is_active       BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- VEHICLES
-- -------------------------------------------------------
CREATE TABLE vehicles (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    type        VARCHAR(60),
    capacity    TINYINT,
    price_usd   DECIMAL(10,2) NOT NULL,
    unit        VARCHAR(60) DEFAULT 'per transfer',
    description TEXT,
    features    JSON,
    badge       VARCHAR(30),
    is_active   BOOLEAN DEFAULT TRUE
);

-- -------------------------------------------------------
-- PRICING RULES (flight cost by origin region)
-- -------------------------------------------------------
CREATE TABLE pricing_rules (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    region_name         VARCHAR(100) NOT NULL,
    country_codes       JSON NOT NULL,
    base_flight_cost    DECIMAL(10,2) NOT NULL
);

-- -------------------------------------------------------
-- RESERVATIONS
-- -------------------------------------------------------
CREATE TABLE reservations (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    reservation_code    VARCHAR(20) UNIQUE NOT NULL,
    user_id             INT NULL,                    -- NULL = guest booking

    -- What
    destination_id      INT NOT NULL,
    dest_name_override  VARCHAR(160) NULL,
    accommodation_id    INT NULL,

    -- When
    departure_date      DATE NOT NULL,
    return_date         DATE NOT NULL,
    num_nights          INT GENERATED ALWAYS AS (DATEDIFF(return_date, departure_date)) STORED,

    -- Who
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(180) NOT NULL,
    phone               VARCHAR(30),
    country_of_origin   VARCHAR(5),
    num_adults          TINYINT DEFAULT 1,
    num_children        TINYINT DEFAULT 0,

    -- Financials
    flight_cost         DECIMAL(10,2) DEFAULT 0,
    accommodation_cost  DECIMAL(10,2) DEFAULT 0,
    activities_cost     DECIMAL(10,2) DEFAULT 0,
    vehicles_cost       DECIMAL(10,2) DEFAULT 0,
    subtotal            DECIMAL(10,2) NOT NULL,
    taxes               DECIMAL(10,2) DEFAULT 0,
    total_amount        DECIMAL(10,2) NOT NULL,
    currency            VARCHAR(3)    DEFAULT 'USD',
    is_peak_season      BOOLEAN       DEFAULT FALSE,

    -- Payment
    payment_method      ENUM('mastercard','visa','paypal') NOT NULL,
    payment_data_enc    TEXT,           -- AES-256 encrypted card/paypal data
    payment_status      ENUM('pending','authorized','captured','failed','refunded') DEFAULT 'pending',
    transaction_id      VARCHAR(120),

    -- Selected add-ons
    selected_activities JSON,
    selected_vehicles   JSON,
    notes               TEXT,

    -- Admin
    admin_notes         TEXT,
    status              ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
    confirmed_at        TIMESTAMP NULL,
    cancelled_at        TIMESTAMP NULL,
    ip_address          VARCHAR(45),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (destination_id) REFERENCES destinations(id),
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_code (reservation_code),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created (created_at)
);

-- -------------------------------------------------------
-- VEHICLE BOOKINGS
-- -------------------------------------------------------
CREATE TABLE vehicle_bookings (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    booking_code    VARCHAR(20) UNIQUE NOT NULL,
    reservation_id  INT NULL,           -- linked to trip reservation if applicable
    vehicle_id      INT NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(30) NOT NULL,
    destination     VARCHAR(200),
    pickup_date     DATE NOT NULL,
    pickup_time     TIME,
    flight_number   VARCHAR(20),
    num_passengers  TINYINT DEFAULT 1,
    price_usd       DECIMAL(10,2),
    notes           TEXT,
    status          ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

-- -------------------------------------------------------
-- CONTACT INQUIRIES
-- -------------------------------------------------------
CREATE TABLE contact_inquiries (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100),
    email       VARCHAR(180) NOT NULL,
    phone       VARCHAR(30),
    subject     VARCHAR(100),
    destination VARCHAR(200),
    message     TEXT NOT NULL,
    status      ENUM('new','read','replied','closed') DEFAULT 'new',
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- -------------------------------------------------------
-- ADMIN NOTIFICATIONS LOG
-- -------------------------------------------------------
CREATE TABLE admin_notifications (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    type            VARCHAR(60) NOT NULL,           -- 'reservation','vehicle','contact'
    reference_id    INT NOT NULL,
    reference_code  VARCHAR(20),
    wa_sent         BOOLEAN DEFAULT FALSE,
    wa_sent_at      TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- SEED: PRICING RULES
-- -------------------------------------------------------
INSERT INTO pricing_rules (region_name, country_codes, base_flight_cost) VALUES
('West Africa',     '["CM","NG","GH","SN","CI","GA","CG","CD","CF","BJ","TG","BF","ML","NE","GN","SL","LR"]', 820),
('East Africa',     '["KE","TZ","ET","UG","RW","BI","DJ","SO","SD","MZ","MW","ZM"]', 750),
('North Africa',    '["EG","MA","DZ","TN","LY","MR"]', 690),
('Southern Africa', '["ZA","NA","BW","ZW","LS","SZ","AO","MG","MU"]', 870),
('Western Europe',  '["FR","DE","GB","IT","ES","CH","NL","BE","PT","SE","NO","AT","IE","DK","FI","GR","PL","CZ","HU","RO"]', 580),
('Eastern Europe',  '["RU","UA","BY","PL","CZ","HU","RO","BG","HR","SK","EE","LV","LT","MD"]', 540),
('Middle East',     '["AE","SA","QA","KW","BH","OM","JO","LB","IL","TR","IR","IQ"]', 380),
('South Asia',      '["IN","PK","BD","LK","NP","BT","MV","AF"]', 480),
('Southeast Asia',  '["TH","VN","ID","MY","SG","PH","MM","KH","LA","BN"]', 310),
('East Asia',       '["JP","CN","KR","TW","HK","MO","MN"]', 720),
('North America',   '["US","CA","MX"]', 380),
('Latin America',   '["BR","AR","CO","CL","PE","VE","EC","BO","PY","UY","CR","PA","GT","HN","SV","NI","BZ","CU","JM","HT","DO"]', 680),
('Oceania',         '["AU","NZ","FJ","PG","VU","SB","WS","TO"]', 1050);

-- -------------------------------------------------------
-- SEED: VEHICLES
-- -------------------------------------------------------
INSERT INTO vehicles (name, type, capacity, price_usd, unit, description, features, badge) VALUES
('Economy Transfer', 'sedan', 3, 30, 'per transfer', 'Clean, comfortable sedan for airport transfers.', '["Air conditioning","Flight tracking","Meet & greet"]', 'popular'),
('Premium SUV', 'suv', 6, 65, 'per transfer', 'Luxury SUV with WiFi and complimentary water.', '["Air conditioning","WiFi","Water provided","Professional driver"]', 'premium'),
('Minivan Group Transfer', 'van', 9, 90, 'per transfer', 'Comfortable minivan for groups up to 9.', '["Air conditioning","Luggage space","Meet & greet"]', null),
('Luxury Sedan VIP', 'luxury', 3, 120, 'per transfer', 'Premium Mercedes/BMW for executive transfers.', '["Premium leather","Champagne welcome","Discretion guaranteed"]', 'premium'),
('Personal Driver — Half Day', 'driver', 5, 75, '4-5 hours', 'Dedicated driver for 4-5 hours.', '["Flexible itinerary","Local knowledge","Air conditioning"]', 'popular'),
('Personal Driver — Full Day', 'driver', 5, 130, 'full day', 'Your driver for 8-10 hours, multilingual.', '["8-10 hours","Multilingual","Multiple stops","Lunch break"]', 'new'),
('Airport Bus Group', 'bus', 25, 180, 'per transfer', 'Shared airport bus for large groups 10-25.', '["Air conditioning","Luggage compartment","Set times"]', null),
('Scenic Tour Driver', 'driver', 5, 150, 'full day', 'Expert local driver for sightseeing tours.', '["Local guide","Photography help","Curated stops"]', 'new');

-- ============================================================
-- RAILWAY ADDITION: vehicles_cost column
-- ============================================================
-- Run this if you already created the DB without it:
-- ALTER TABLE reservations ADD COLUMN vehicles_cost DECIMAL(10,2) DEFAULT 0 AFTER activities_cost;
