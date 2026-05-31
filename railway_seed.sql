-- ============================================================
-- TRAVENCIA — Seed Destinations (matches data.js IDs exactly)
-- Run AFTER travencia_schema.sql
--   mysql -u root -p travencia < seed_destinations.sql
-- ============================================================

-- Clear and reseed so IDs always match data.js (1-20)
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE activities;
TRUNCATE TABLE accommodations;
TRUNCATE TABLE destinations;
SET FOREIGN_KEY_CHECKS=1;

-- Force auto_increment to start at 1 so IDs match data.js
ALTER TABLE destinations AUTO_INCREMENT = 1;

INSERT INTO destinations
  (id, name, country, continent, tagline, description, image_filename,
   base_price, price_per_night, climate, best_season, rating, premium_mult,
   is_featured, is_active)
VALUES
(1,  'Bali',         'Indonesia',    'Asia',
  'Island of the Gods',
  'Emerald rice terraces, ancient temples, and world-class surf. Bali enchants with its spiritual culture and breathtaking landscapes.',
  'Bali.jpeg',          899,   75,  'Tropical',     'Apr–Oct',            4.80, 1.00, TRUE,  TRUE),
(2,  'Dubai',        'UAE',          'Middle East',
  'Where the Future Is Built',
  'A skyline that defies imagination. Dubai blends Bedouin heritage with ultra-modern luxury — shopping, desert adventures, and architectural wonders.',
  'DUBAI.jpeg',        1299,  150,  'Desert',       'Nov–Mar',            4.70, 1.40, TRUE,  TRUE),
(3,  'Hawaii',       'USA',          'Americas',
  'Aloha — Life in Full Colour',
  'Volcanic peaks, rainbow valleys, and legendary surf breaks. Hawaii is where paradise meets adventure across six stunning islands.',
  'Maldives.jpeg',     2499,  185,  'Tropical',     'Year-round',         4.90, 1.60, TRUE,  TRUE),
(4,  'Iceland',      'Iceland',      'Europe',
  'Land of Fire and Ice',
  'Chase the Northern Lights over glacier lagoons, soak in geothermal pools, and hike volcanoes. Raw, wild, utterly unforgettable.',
  'Iceland.jpeg',      1999,  165,  'Subarctic',    'Jun–Aug / Dec–Feb',  4.80, 1.30, FALSE, TRUE),
(5,  'Maldives',     'Maldives',     'Asia',
  'Heaven on the Horizon',
  'Overwater bungalows above crystal-clear turquoise lagoons and infinite horizon sunsets. Pure luxury, zero compromises.',
  'Maldives.jpeg',     3499,  380,  'Tropical',     'Nov–Apr',            5.00, 1.80, FALSE, TRUE),
(6,  'Miami',        'USA',          'Americas',
  'Neon, Beats & Ocean Breeze',
  'Art Deco glamour, white-sand beaches, world-class nightlife, and a melting pot of cultures. Where every night becomes a story.',
  'Miami.jpeg',        1599,  165,  'Subtropical',  'Nov–May',            4.60, 1.10, FALSE, TRUE),
(7,  'Okinawa',      'Japan',        'Asia',
  'Japan''s Secret Paradise',
  'Crystal-clear waters, ancient Ryukyuan castles, and a culture of longevity. Japan''s most beautiful secret, waiting to be discovered.',
  'Okinawa.jpeg',      1799,  115,  'Subtropical',  'May–Aug',            4.70, 1.20, FALSE, TRUE),
(8,  'Paris',        'France',       'Europe',
  'The City of Eternal Romance',
  'From the Eiffel Tower at golden hour to the finest cuisine on Earth — Paris is not just a destination, it''s an emotion.',
  'Paris.jpeg',        1199,  210,  'Temperate',    'Apr–Oct',            4.90, 1.20, FALSE, TRUE),
(9,  'Switzerland',  'Switzerland',  'Europe',
  'Where the Alps Touch the Sky',
  'Snow-dusted chalets, pristine ski slopes, turquoise lakes. Switzerland is precision, beauty, and adventure in one breathtaking package.',
  'Switzerland.jpeg',  2699,  265,  'Alpine',       'Dec–Mar / Jun–Sep',  4.80, 1.50, FALSE, TRUE),
(10, 'Tokyo',        'Japan',        'Asia',
  'Tradition Wrapped in Neon Light',
  'Ancient temples beside neon skyscrapers, world-famous ramen, cherry blossoms — Tokyo is every traveler''s dream.',
  'Tokyo.jpeg',        1899,  135,  'Temperate',    'Mar–May / Sep–Nov',  4.90, 1.25, FALSE, TRUE),
(11, 'Zanzibar',     'Tanzania',     'Africa',
  'Spice, Sea & Swahili Soul',
  'White beaches, dhow sailboats at sunset, Stone Town''s labyrinthine streets. Africa''s most exotic island escape.',
  'Zanzibar.jpeg',     1299,  100,  'Tropical',     'Jun–Oct',            4.70, 1.00, FALSE, TRUE),
(12, 'China',        'China',        'Asia',
  '5,000 Years of Wonder',
  'From the Great Wall to Shanghai''s neon skyline — China is the most layered civilization on Earth, endlessly surprising.',
  'China.png',         1699,  120,  'Varied',       'Apr–Jun / Sep–Nov',  4.70, 1.15, FALSE, TRUE),
(13, 'Colombia',     'Colombia',     'Americas',
  'The Magic of Diversity',
  'Caribbean beaches, coffee highlands, colonial Cartagena, and Amazon jungle. Colombia is Latin America at its most vibrant.',
  'Colombia.png',      1199,   85,  'Tropical',     'Dec–Mar / Jun–Aug',  4.60, 1.00, FALSE, TRUE),
(14, 'Brazil',       'Brazil',       'Americas',
  'Carnival, Rainforest & Soul',
  'Copacabana beach, Christ the Redeemer, the Amazon basin, and the world''s greatest carnival. Brazil pulses with life.',
  'Brazil.png',        1499,  105,  'Tropical',     'May–Sep',            4.70, 1.05, FALSE, TRUE),
(15, 'Egypt',        'Egypt',        'Africa',
  'Where Legends Were Born',
  'Pyramids at dawn, Nile River cruises, Red Sea diving, and 7,000 years of history. Egypt is the original wonder of the world.',
  'Egypt.png',          999,   70,  'Desert',       'Oct–Apr',            4.80, 0.95, FALSE, TRUE),
(16, 'Germany',      'Germany',      'Europe',
  'Castles, Lakes & Engineering',
  'Bavarian castles, Rhine vineyards, Oktoberfest, Black Forest trails, and world-class museums. Europe at its richest.',
  'Germany.png',       1399,  130,  'Temperate',    'May–Sep',            4.70, 1.10, FALSE, TRUE),
(17, 'Italy',        'Italy',        'Europe',
  'La Dolce Vita',
  'Venice canals, Rome''s Colosseum, Amalfi Coast sunsets, and the world''s best cuisine and art. Life at its sweetest.',
  'Italy.png',         1299,  145,  'Mediterranean','Apr–Jun / Sep–Oct',  4.90, 1.15, FALSE, TRUE),
(18, 'Morocco',      'Morocco',      'Africa',
  'Where Africa Meets Arabia',
  'Saharan dune camps, blue Chefchaouen alleys, Marrakech souks, and kasbahs at sunset. Unforgettably exotic.',
  'Morocco.png',        899,   65,  'Varied',       'Mar–May / Sep–Nov',  4.80, 0.90, FALSE, TRUE),
(19, 'South Africa', 'South Africa', 'Africa',
  'Where Safaris Meet the Sea',
  'Safari in Kruger, wine in Stellenbosch, Table Mountain, Cape Town beaches, and the Garden Route. South Africa has it all.',
  'South_Africa.png',  1799,  140,  'Mediterranean','Oct–Apr',            4.80, 1.20, FALSE, TRUE),
(20, 'Thailand',     'Thailand',     'Asia',
  'The Land of Smiles',
  'Golden temples, jungle treks, island paradise, street food heaven, and legendary hospitality. Asia''s ultimate destination.',
  'Thailand.png',      1099,   60,  'Tropical',     'Nov–Apr',            4.80, 0.95, FALSE, TRUE);

-- Confirm
SELECT id, name, country FROM destinations ORDER BY id;
SELECT COUNT(*) AS total_destinations FROM destinations;
