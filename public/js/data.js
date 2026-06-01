/* ============================================================
   TRAVENCIA — Shared Data
============================================================ */

const ADMIN_WHATSAPP = (function(){
  var m = document.querySelector('meta[name="tv-wa"]');
  return m ? m.content : "13082533668";
})();
const ADMIN_EMAIL = "travenciaagency@gmail.com";
const REF_AGENTS = {}; // No agent system in this deployment

const DESTINATIONS = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    tagline: "Island of the Gods",
    desc: "Emerald rice terraces, ancient temples, and world-class surf. Bali enchants with its spiritual culture and breathtaking landscapes.",
    img: "images/Bali.jpeg",
    basePrice: 899,
    pn: 75,
    climate: "Tropical",
    season: "Apr–Oct",
    rating: 4.8,
    featured: true,
  },
  {
    id: 2,
    name: "Dubai",
    country: "UAE",
    continent: "Middle East",
    tagline: "Where the Future Is Built",
    desc: "A skyline that defies imagination. Dubai blends Bedouin heritage with ultra-modern luxury — shopping, desert adventures, and architectural wonders.",
    img: "images/DUBAI.jpeg",
    basePrice: 1299,
    pn: 150,
    climate: "Desert",
    season: "Nov–Mar",
    rating: 4.7,
    featured: true,
  },
  {
    id: 3,
    name: "Hawaii",
    country: "USA",
    continent: "Americas",
    tagline: "Aloha — Life in Full Colour",
    desc: "Volcanic peaks, rainbow valleys, and legendary surf breaks. Hawaii is where paradise meets adventure across six stunning islands.",
    img: "images/Hawai.jpeg",
    basePrice: 2499,
    pn: 185,
    climate: "Tropical",
    season: "Year-round",
    rating: 4.9,
    featured: true,
  },
  {
    id: 4,
    name: "Iceland",
    country: "Iceland",
    continent: "Europe",
    tagline: "Land of Fire and Ice",
    desc: "Chase the Northern Lights over glacier lagoons, soak in geothermal pools, and hike volcanoes. Raw, wild, utterly unforgettable.",
    img: "images/Iceland.jpeg",
    basePrice: 1999,
    pn: 165,
    climate: "Subarctic",
    season: "Jun–Aug / Dec–Feb",
    rating: 4.8,
    featured: false,
  },
  {
    id: 5,
    name: "Maldives",
    country: "Maldives",
    continent: "Asia",
    tagline: "Heaven on the Horizon",
    desc: "Overwater bungalows above crystal-clear turquoise lagoons and infinite horizon sunsets. Pure luxury, zero compromises.",
    img: "images/Maldives.jpeg",
    basePrice: 3499,
    pn: 380,
    climate: "Tropical",
    season: "Nov–Apr",
    rating: 5.0,
    featured: false,
  },
  {
    id: 6,
    name: "Miami",
    country: "USA",
    continent: "Americas",
    tagline: "Neon, Beats & Ocean Breeze",
    desc: "Art Deco glamour, white-sand beaches, world-class nightlife, and a melting pot of cultures. Where every night becomes a story.",
    img: "images/Miami.jpeg",
    basePrice: 1599,
    pn: 165,
    climate: "Subtropical",
    season: "Nov–May",
    rating: 4.6,
    featured: false,
  },
  {
    id: 7,
    name: "Okinawa",
    country: "Japan",
    continent: "Asia",
    tagline: "Japan's Secret Paradise",
    desc: "Crystal-clear waters, ancient Ryukyuan castles, and a culture of longevity. Japan's most beautiful secret, waiting to be discovered.",
    img: "images/Okinawa.jpeg",
    basePrice: 1799,
    pn: 115,
    climate: "Subtropical",
    season: "May–Aug",
    rating: 4.7,
    featured: false,
  },
  {
    id: 8,
    name: "Paris",
    country: "France",
    continent: "Europe",
    tagline: "The City of Eternal Romance",
    desc: "From the Eiffel Tower at golden hour to the finest cuisine on Earth — Paris is not just a destination, it's an emotion.",
    img: "images/Paris.jpeg",
    basePrice: 1199,
    pn: 210,
    climate: "Temperate",
    season: "Apr–Oct",
    rating: 4.9,
    featured: false,
  },
  {
    id: 9,
    name: "Switzerland",
    country: "Switzerland",
    continent: "Europe",
    tagline: "Where the Alps Touch the Sky",
    desc: "Snow-dusted chalets, pristine ski slopes, turquoise lakes. Switzerland is precision, beauty, and adventure in one breathtaking package.",
    img: "images/Switzerland.jpeg",
    basePrice: 2699,
    pn: 265,
    climate: "Alpine",
    season: "Dec–Mar / Jun–Sep",
    rating: 4.8,
    featured: false,
  },
  {
    id: 10,
    name: "Tokyo",
    country: "Japan",
    continent: "Asia",
    tagline: "Tradition Wrapped in Neon Light",
    desc: "Ancient temples beside neon skyscrapers, world-famous ramen, cherry blossoms — Tokyo is every traveler's dream.",
    img: "images/Tokyo.jpeg",
    basePrice: 1899,
    pn: 135,
    climate: "Temperate",
    season: "Mar–May / Sep–Nov",
    rating: 4.9,
    featured: false,
  },
  {
    id: 11,
    name: "Zanzibar",
    country: "Tanzania",
    continent: "Africa",
    tagline: "Spice, Sea & Swahili Soul",
    desc: "White beaches, dhow sailboats at sunset, Stone Town's labyrinthine streets. Africa's most exotic island escape.",
    img: "images/Zanzibar.jpeg",
    basePrice: 1299,
    pn: 100,
    climate: "Tropical",
    season: "Jun–Oct",
    rating: 4.7,
    featured: false,
  },
  {
    id: 12,
    name: "China",
    country: "China",
    continent: "Asia",
    tagline: "5,000 Years of Wonder",
    desc: "From the Great Wall to Shanghai's neon skyline — China is the most layered civilization on Earth, endlessly surprising.",
    img: "images/China.png",
    basePrice: 1699,
    pn: 120,
    climate: "Varied",
    season: "Apr–Jun / Sep–Nov",
    rating: 4.7,
    featured: false,
  },
  {
    id: 13,
    name: "Colombia",
    country: "Colombia",
    continent: "Americas",
    tagline: "The Magic of Diversity",
    desc: "Caribbean beaches, coffee highlands, colonial Cartagena, and Amazon jungle. Colombia is Latin America at its most vibrant.",
    img: "images/Colombia.png",
    basePrice: 1199,
    pn: 85,
    climate: "Tropical",
    season: "Dec–Mar / Jun–Aug",
    rating: 4.6,
    featured: false,
  },
  {
    id: 14,
    name: "Brazil",
    country: "Brazil",
    continent: "Americas",
    tagline: "Carnival, Rainforest & Soul",
    desc: "Copacabana beach, Christ the Redeemer, the Amazon basin, and the world's greatest carnival. Brazil pulses with life.",
    img: "images/Brazil.png",
    basePrice: 1499,
    pn: 105,
    climate: "Tropical",
    season: "May–Sep",
    rating: 4.7,
    featured: false,
  },
  {
    id: 15,
    name: "Egypt",
    country: "Egypt",
    continent: "Africa",
    tagline: "Where Legends Were Born",
    desc: "Pyramids at dawn, Nile River cruises, Red Sea diving, and 7,000 years of history. Egypt is the original wonder of the world.",
    img: "images/Egypt.png",
    basePrice: 999,
    pn: 70,
    climate: "Desert",
    season: "Oct–Apr",
    rating: 4.8,
    featured: false,
  },
  {
    id: 16,
    name: "Germany",
    country: "Germany",
    continent: "Europe",
    tagline: "Castles, Lakes & Engineering",
    desc: "Bavarian castles, Rhine vineyards, Oktoberfest, Black Forest trails, and world-class museums. Europe at its richest.",
    img: "images/Germany.png",
    basePrice: 1399,
    pn: 130,
    climate: "Temperate",
    season: "May–Sep",
    rating: 4.7,
    featured: false,
  },
  {
    id: 17,
    name: "Italy",
    country: "Italy",
    continent: "Europe",
    tagline: "La Dolce Vita",
    desc: "Venice canals, Rome's Colosseum, Amalfi Coast sunsets, and the world's best cuisine and art. Life at its sweetest.",
    img: "images/Italy.png",
    basePrice: 1299,
    pn: 145,
    climate: "Mediterranean",
    season: "Apr–Jun / Sep–Oct",
    rating: 4.9,
    featured: false,
  },
  {
    id: 18,
    name: "Morocco",
    country: "Morocco",
    continent: "Africa",
    tagline: "Where Africa Meets Arabia",
    desc: "Saharan dune camps, blue Chefchaouen alleys, Marrakech souks, and kasbahs at sunset. Unforgettably exotic.",
    img: "images/Morocco.png",
    basePrice: 899,
    pn: 65,
    climate: "Varied",
    season: "Mar–May / Sep–Nov",
    rating: 4.8,
    featured: false,
  },
  {
    id: 19,
    name: "South Africa",
    country: "South Africa",
    continent: "Africa",
    tagline: "Where Safaris Meet the Sea",
    desc: "Safari in Kruger, wine in Stellenbosch, Table Mountain, Cape Town beaches, and the Garden Route. South Africa has it all.",
    img: "images/South_Africa.png",
    basePrice: 1799,
    pn: 140,
    climate: "Mediterranean",
    season: "Oct–Apr",
    rating: 4.8,
    featured: false,
  },
  {
    id: 20,
    name: "Thailand",
    country: "Thailand",
    continent: "Asia",
    tagline: "The Land of Smiles",
    desc: "Golden temples, jungle treks, island paradise, street food heaven, and legendary hospitality. Asia's ultimate destination.",
    img: "images/Thailand.png",
    basePrice: 1099,
    pn: 60,
    climate: "Tropical",
    season: "Nov–Apr",
    rating: 4.8,
    featured: false,
  },
];

const ACCOMMODATIONS = {
  1: [
    {
      id: 1,
      n: "Alaya Resort Ubud",
      t: "Resort",
      s: 5,
      ppn: 220,
      am: ["Infinity pool", "Spa", "WiFi", "Restaurant", "Yoga"],
    },
    {
      id: 2,
      n: "The Layar Private Villas",
      t: "Villa",
      s: 5,
      ppn: 420,
      am: ["Private pool", "Butler", "Chef on request", "Beach club"],
    },
    {
      id: 3,
      n: "Katamama Boutique Hotel",
      t: "Boutique",
      s: 5,
      ppn: 310,
      am: ["Pool", "Spa", "Restaurant", "Cultural activities"],
    },
  ],
  2: [
    {
      id: 4,
      n: "Burj Al Arab Jumeirah",
      t: "Hotel",
      s: 5,
      ppn: 1200,
      am: ["Private beach", "Helicopter pad", "Butler", "Spa"],
    },
    {
      id: 5,
      n: "Atlantis The Palm",
      t: "Resort",
      s: 5,
      ppn: 380,
      am: ["Waterpark", "Aquarium", "Multiple restaurants"],
    },
    {
      id: 6,
      n: "Address Downtown Dubai",
      t: "Hotel",
      s: 5,
      ppn: 280,
      am: ["Pool", "Spa", "Rooftop bar", "Burj Khalifa views"],
    },
  ],
  3: [
    {
      id: 7,
      n: "Four Seasons Hualalai",
      t: "Resort",
      s: 5,
      ppn: 780,
      am: ["Private beach", "Golf course", "Spa", "Snorkeling"],
    },
    {
      id: 8,
      n: "Halekulani Waikiki",
      t: "Hotel",
      s: 5,
      ppn: 360,
      am: ["Pool", "Ocean view", "Fine dining", "Spa"],
    },
  ],
  4: [
    {
      id: 9,
      n: "Ion Adventure Hotel",
      t: "Boutique",
      s: 4,
      ppn: 295,
      am: [
        "Northern Lights viewing",
        "Geothermal pool",
        "Restaurant",
        "Adventure tours",
      ],
    },
    {
      id: 10,
      n: "Retreat at Blue Lagoon",
      t: "Resort",
      s: 5,
      ppn: 950,
      am: ["Private lagoon access", "Spa", "Floating breakfast"],
    },
  ],
  5: [
    {
      id: 11,
      n: "Gili Lankanfushi",
      t: "Resort",
      s: 5,
      ppn: 1450,
      am: ["Overwater villa", "House reef", "Butler", "Fine dining"],
    },
    {
      id: 12,
      n: "Soneva Jani",
      t: "Resort",
      s: 5,
      ppn: 1800,
      am: ["Retractable roof", "Observatory", "Private pool", "Chef"],
    },
  ],
  6: [
    {
      id: 13,
      n: "Faena Hotel Miami Beach",
      t: "Hotel",
      s: 5,
      ppn: 520,
      am: ["Beach access", "Spa", "Fine dining", "Nightclub"],
    },
    {
      id: 14,
      n: "The Edition Miami",
      t: "Hotel",
      s: 5,
      ppn: 385,
      am: ["Beach club", "Pool", "Bar", "Concierge"],
    },
  ],
  7: [
    {
      id: 15,
      n: "Halekulani Okinawa",
      t: "Resort",
      s: 5,
      ppn: 340,
      am: ["Ocean views", "Multiple pools", "Spa", "Beach"],
    },
    {
      id: 16,
      n: "Rizzan Sea-Park Hotel",
      t: "Hotel",
      s: 4,
      ppn: 175,
      am: ["Beach", "Pool", "Restaurant", "WiFi"],
    },
  ],
  8: [
    {
      id: 17,
      n: "Hotel Plaza Athénée",
      t: "Hotel",
      s: 5,
      ppn: 880,
      am: ["Dior Spa", "Multiple restaurants", "Butler", "Iconic location"],
    },
    {
      id: 18,
      n: "Le Marais Boutique",
      t: "Boutique",
      s: 4,
      ppn: 220,
      am: [
        "WiFi",
        "Breakfast included",
        "City views",
        "Historic neighbourhood",
      ],
    },
  ],
  9: [
    {
      id: 19,
      n: "The Chedi Andermatt",
      t: "Hotel",
      s: 5,
      ppn: 520,
      am: ["Ski-in/ski-out", "Spa", "Mountain guide", "Multiple restaurants"],
    },
    {
      id: 20,
      n: "Le Grand Bellevue Gstaad",
      t: "Hotel",
      s: 5,
      ppn: 465,
      am: ["Ski access", "Spa", "Fine dining", "Tennis courts"],
    },
  ],
  10: [
    {
      id: 21,
      n: "Aman Tokyo",
      t: "Hotel",
      s: 5,
      ppn: 640,
      am: ["Spa", "Pool", "Fine dining", "Imperial Palace views"],
    },
    {
      id: 22,
      n: "Park Hyatt Tokyo",
      t: "Hotel",
      s: 5,
      ppn: 385,
      am: ["Spa", "New York Bar", "City views", "Multiple restaurants"],
    },
  ],
  11: [
    {
      id: 23,
      n: "Zuri Zanzibar",
      t: "Resort",
      s: 5,
      ppn: 255,
      am: ["Beach access", "Pool", "Dhow cruises", "Water sports"],
    },
    {
      id: 24,
      n: "Matemwe Lodge",
      t: "Boutique",
      s: 4,
      ppn: 175,
      am: ["Ocean views", "Pool", "Snorkeling", "Diving"],
    },
  ],
  12: [
    {
      id: 25,
      n: "The Peninsula Shanghai",
      t: "Hotel",
      s: 5,
      ppn: 440,
      am: ["Rooftop pool", "Spa", "Fine dining", "Bund views"],
    },
    {
      id: 26,
      n: "Aman at Summer Palace",
      t: "Resort",
      s: 5,
      ppn: 720,
      am: ["Palace access", "Spa", "Cultural tours", "Private gardens"],
    },
  ],
  13: [
    {
      id: 27,
      n: "Hotel Santa Clara Cartagena",
      t: "Hotel",
      s: 5,
      ppn: 225,
      am: ["Colonial architecture", "Pool", "Spa", "Restaurant"],
    },
    {
      id: 28,
      n: "Charlee Hotel Medellín",
      t: "Boutique",
      s: 4,
      ppn: 145,
      am: ["Rooftop pool", "Bar", "City views", "WiFi"],
    },
  ],
  14: [
    {
      id: 29,
      n: "Copacabana Palace",
      t: "Hotel",
      s: 5,
      ppn: 545,
      am: ["Pool", "Beach access", "Fine dining", "Spa"],
    },
    {
      id: 30,
      n: "Amazonia Jungle Lodge",
      t: "Resort",
      s: 4,
      ppn: 255,
      am: ["Guided tours", "Canoe trips", "All-inclusive meals"],
    },
  ],
  15: [
    {
      id: 31,
      n: "Sofitel Legend Old Cataract",
      t: "Hotel",
      s: 5,
      ppn: 335,
      am: ["Nile views", "Pool", "Spa", "Colonial heritage"],
    },
    {
      id: 32,
      n: "Four Seasons Cairo",
      t: "Hotel",
      s: 5,
      ppn: 280,
      am: ["Nile views", "Pool", "Spa", "Multiple restaurants"],
    },
  ],
  16: [
    {
      id: 33,
      n: "Hotel Adlon Kempinski Berlin",
      t: "Hotel",
      s: 5,
      ppn: 385,
      am: ["Brandenburg Gate views", "Spa", "Fine dining", "Pool"],
    },
    {
      id: 34,
      n: "Schloss Elmau Retreat",
      t: "Resort",
      s: 5,
      ppn: 595,
      am: ["Mountain spa", "Classical concerts", "Alpine views", "Pool"],
    },
  ],
  17: [
    {
      id: 35,
      n: "Gritti Palace Venice",
      t: "Hotel",
      s: 5,
      ppn: 960,
      am: ["Grand Canal view", "Butler", "Spa", "Fine dining"],
    },
    {
      id: 36,
      n: "Il San Pietro di Positano",
      t: "Hotel",
      s: 5,
      ppn: 680,
      am: ["Cliffside pool", "Amalfi views", "Private beach", "Boat service"],
    },
  ],
  18: [
    {
      id: 37,
      n: "Royal Mansour Marrakech",
      t: "Hotel",
      s: 5,
      ppn: 760,
      am: ["Private riads", "Hammam spa", "Fine dining", "Gardens"],
    },
    {
      id: 38,
      n: "Riad Fes Relais",
      t: "Boutique",
      s: 5,
      ppn: 225,
      am: ["Traditional riad", "Pool", "Rooftop views", "Hammam"],
    },
  ],
  19: [
    {
      id: 39,
      n: "One&Only Cape Town",
      t: "Hotel",
      s: 5,
      ppn: 595,
      am: ["Marina views", "Spa", "Pool", "Fine dining"],
    },
    {
      id: 40,
      n: "Londolozi Private Game Reserve",
      t: "Resort",
      s: 5,
      ppn: 960,
      am: ["Game drives", "Bush spa", "All-inclusive", "Private ranger"],
    },
  ],
  20: [
    {
      id: 41,
      n: "Mandarin Oriental Bangkok",
      t: "Hotel",
      s: 5,
      ppn: 360,
      am: ["Riverside location", "Spa", "Fine dining", "Pool"],
    },
    {
      id: 42,
      n: "Six Senses Yao Noi",
      t: "Resort",
      s: 5,
      ppn: 545,
      am: ["Island resort", "Infinity pool", "Spa", "Kayaking"],
    },
  ],
};

const ACTIVITIES = {
  1: [
    {
      id: 1,
      n: "Sunrise Trek — Mount Batur",
      cat: "Adventure",
      price: 42,
      dur: 6,
    },
    {
      id: 2,
      n: "Ubud Temple & Rice Terrace Tour",
      cat: "Culture",
      price: 32,
      dur: 5,
    },
    {
      id: 3,
      n: "Balinese Cooking Class",
      cat: "Food & Drink",
      price: 50,
      dur: 4,
    },
    {
      id: 4,
      n: "Surf Lesson at Kuta Beach",
      cat: "Adventure",
      price: 38,
      dur: 3,
    },
    {
      id: 5,
      n: "Traditional Spa & Wellness Day",
      cat: "Wellness",
      price: 88,
      dur: 5,
    },
  ],
  2: [
    {
      id: 6,
      n: "Desert Safari & Dune Bashing",
      cat: "Adventure",
      price: 78,
      dur: 7,
    },
    {
      id: 7,
      n: "Burj Khalifa Observation Deck",
      cat: "Sightseeing",
      price: 50,
      dur: 2,
    },
    { id: 8, n: "Helicopter City Tour", cat: "Adventure", price: 255, dur: 1 },
    {
      id: 9,
      n: "Dubai Food & Night Market Tour",
      cat: "Food & Drink",
      price: 68,
      dur: 4,
    },
  ],
  3: [
    {
      id: 10,
      n: "Na Pali Coast Sunset Cruise",
      cat: "Nature",
      price: 158,
      dur: 5,
    },
    {
      id: 11,
      n: "Kilauea Volcano Helicopter Tour",
      cat: "Adventure",
      price: 295,
      dur: 2,
    },
    {
      id: 12,
      n: "Waikiki Surfing Lesson",
      cat: "Adventure",
      price: 78,
      dur: 2,
    },
    { id: 13, n: "Traditional Luau Feast", cat: "Culture", price: 118, dur: 4 },
  ],
  4: [
    {
      id: 14,
      n: "Northern Lights Jeep Excursion",
      cat: "Nature",
      price: 88,
      dur: 4,
    },
    {
      id: 15,
      n: "Blue Lagoon Geothermal Spa",
      cat: "Wellness",
      price: 68,
      dur: 3,
    },
    {
      id: 16,
      n: "Glacier Hike on Vatnajökull",
      cat: "Adventure",
      price: 108,
      dur: 6,
    },
    {
      id: 17,
      n: "Golden Circle Full-Day Tour",
      cat: "Nature",
      price: 72,
      dur: 8,
    },
  ],
  5: [
    {
      id: 18,
      n: "Private Dolphin Sunset Cruise",
      cat: "Nature",
      price: 88,
      dur: 2,
    },
    {
      id: 19,
      n: "House Reef Snorkelling & Diving",
      cat: "Adventure",
      price: 50,
      dur: 3,
    },
    {
      id: 20,
      n: "Underwater Restaurant Experience",
      cat: "Food & Drink",
      price: 318,
      dur: 2,
    },
    {
      id: 21,
      n: "Seaplane Island-Hopping Tour",
      cat: "Adventure",
      price: 255,
      dur: 4,
    },
  ],
  6: [
    {
      id: 22,
      n: "Art Deco Architecture Walking Tour",
      cat: "Culture",
      price: 32,
      dur: 3,
    },
    {
      id: 23,
      n: "Everglades Airboat Adventure",
      cat: "Nature",
      price: 58,
      dur: 4,
    },
    {
      id: 24,
      n: "Miami Nightlife VIP Experience",
      cat: "Nightlife",
      price: 78,
      dur: 5,
    },
  ],
  7: [
    {
      id: 25,
      n: "Ryukyuan Castle & History Tour",
      cat: "Culture",
      price: 40,
      dur: 4,
    },
    {
      id: 26,
      n: "Coral Reef Snorkelling",
      cat: "Adventure",
      price: 50,
      dur: 3,
    },
    {
      id: 27,
      n: "Traditional Okinawan Cooking",
      cat: "Food & Drink",
      price: 55,
      dur: 3,
    },
  ],
  8: [
    {
      id: 28,
      n: "Eiffel Tower Priority Access",
      cat: "Sightseeing",
      price: 40,
      dur: 2,
    },
    { id: 29, n: "Louvre VIP Evening Tour", cat: "Culture", price: 78, dur: 3 },
    {
      id: 30,
      n: "Seine River Gourmet Dinner Cruise",
      cat: "Food & Drink",
      price: 105,
      dur: 3,
    },
    {
      id: 31,
      n: "Versailles Palace Day Trip",
      cat: "Sightseeing",
      price: 58,
      dur: 7,
    },
  ],
  9: [
    {
      id: 32,
      n: "Jungfraujoch — Top of Europe",
      cat: "Adventure",
      price: 162,
      dur: 8,
    },
    {
      id: 33,
      n: "Full-Day Ski & Snowboard Pass",
      cat: "Adventure",
      price: 108,
      dur: 8,
    },
    {
      id: 34,
      n: "Chocolate & Cheese Factory Tour",
      cat: "Food & Drink",
      price: 58,
      dur: 4,
    },
    {
      id: 35,
      n: "Interlaken Tandem Paragliding",
      cat: "Adventure",
      price: 165,
      dur: 2,
    },
  ],
  10: [
    {
      id: 36,
      n: "Tsukiji Morning Sushi Experience",
      cat: "Food & Drink",
      price: 78,
      dur: 3,
    },
    {
      id: 37,
      n: "Traditional Tea Ceremony",
      cat: "Culture",
      price: 40,
      dur: 2,
    },
    {
      id: 38,
      n: "Mount Fuji Day Trip & Onsen",
      cat: "Nature",
      price: 118,
      dur: 10,
    },
  ],
  11: [
    {
      id: 39,
      n: "Stone Town Spice & History Tour",
      cat: "Culture",
      price: 36,
      dur: 4,
    },
    {
      id: 40,
      n: "Mnemba Atoll Snorkelling",
      cat: "Adventure",
      price: 58,
      dur: 4,
    },
    {
      id: 41,
      n: "Traditional Dhow Sunset Cruise",
      cat: "Nature",
      price: 50,
      dur: 2,
    },
    {
      id: 42,
      n: "Swahili Cooking Class",
      cat: "Food & Drink",
      price: 45,
      dur: 3,
    },
  ],
  12: [
    {
      id: 43,
      n: "Great Wall of China Guided Hike",
      cat: "Adventure",
      price: 68,
      dur: 6,
    },
    {
      id: 44,
      n: "Shanghai Food Walking Tour",
      cat: "Food & Drink",
      price: 58,
      dur: 4,
    },
    {
      id: 45,
      n: "Peking Opera Evening Performance",
      cat: "Culture",
      price: 40,
      dur: 3,
    },
  ],
  13: [
    {
      id: 46,
      n: "Cartagena Old City Walking Tour",
      cat: "Culture",
      price: 30,
      dur: 3,
    },
    {
      id: 47,
      n: "Coffee Farm Tour in the Andes",
      cat: "Nature",
      price: 65,
      dur: 6,
    },
    {
      id: 48,
      n: "Caribbean Island Day Trip",
      cat: "Nature",
      price: 88,
      dur: 8,
    },
  ],
  14: [
    {
      id: 49,
      n: "Christ the Redeemer & Sugarloaf",
      cat: "Sightseeing",
      price: 78,
      dur: 5,
    },
    {
      id: 50,
      n: "Amazon Jungle Day Expedition",
      cat: "Nature",
      price: 108,
      dur: 8,
    },
    {
      id: 51,
      n: "Samba School & Carnival Tour",
      cat: "Culture",
      price: 135,
      dur: 5,
    },
  ],
  15: [
    {
      id: 52,
      n: "Pyramids at Sunrise — Camel Ride",
      cat: "Sightseeing",
      price: 55,
      dur: 4,
    },
    {
      id: 53,
      n: "Nile Felucca Dinner Cruise",
      cat: "Food & Drink",
      price: 68,
      dur: 3,
    },
    {
      id: 54,
      n: "Red Sea Coral Reef Dive",
      cat: "Adventure",
      price: 72,
      dur: 5,
    },
  ],
  16: [
    {
      id: 55,
      n: "Neuschwanstein Castle Day Trip",
      cat: "Sightseeing",
      price: 72,
      dur: 8,
    },
    {
      id: 56,
      n: "Rhine Valley Wine Cruise",
      cat: "Food & Drink",
      price: 88,
      dur: 6,
    },
    {
      id: 57,
      n: "Black Forest Hiking & Spa",
      cat: "Nature",
      price: 65,
      dur: 7,
    },
  ],
  17: [
    {
      id: 58,
      n: "Venice Gondola Private Tour",
      cat: "Culture",
      price: 88,
      dur: 1,
    },
    {
      id: 59,
      n: "Colosseum Underground VIP Access",
      cat: "Sightseeing",
      price: 68,
      dur: 3,
    },
    {
      id: 60,
      n: "Amalfi Coast Full-Day Boat Trip",
      cat: "Nature",
      price: 118,
      dur: 7,
    },
  ],
  18: [
    {
      id: 61,
      n: "Sahara Desert Camel Trek & Camp",
      cat: "Adventure",
      price: 108,
      dur: 14,
    },
    {
      id: 62,
      n: "Marrakech Medina Food Tour",
      cat: "Food & Drink",
      price: 50,
      dur: 4,
    },
    {
      id: 63,
      n: "Traditional Hammam Experience",
      cat: "Wellness",
      price: 40,
      dur: 2,
    },
  ],
  19: [
    {
      id: 64,
      n: "Kruger National Park Safari (2 Days)",
      cat: "Nature",
      price: 345,
      dur: 48,
    },
    {
      id: 65,
      n: "Table Mountain Hike & Cable Car",
      cat: "Adventure",
      price: 50,
      dur: 4,
    },
    {
      id: 66,
      n: "Cape Winelands Day Tour",
      cat: "Food & Drink",
      price: 82,
      dur: 8,
    },
  ],
  20: [
    {
      id: 67,
      n: "Grand Palace & Wat Pho Temple Tour",
      cat: "Culture",
      price: 40,
      dur: 4,
    },
    {
      id: 68,
      n: "Chiang Mai Elephant Sanctuary",
      cat: "Nature",
      price: 78,
      dur: 7,
    },
    {
      id: 69,
      n: "Thai Cooking Class & Market Tour",
      cat: "Food & Drink",
      price: 50,
      dur: 5,
    },
  ],
};

const COUNTRIES = [
  { c: "CM", n: "Cameroon", r: "West Africa" },
  { c: "NG", n: "Nigeria", r: "West Africa" },
  { c: "GH", n: "Ghana", r: "West Africa" },
  { c: "SN", n: "Senegal", r: "West Africa" },
  { c: "CI", n: "Côte d'Ivoire", r: "West Africa" },
  { c: "GA", n: "Gabon", r: "West Africa" },
  { c: "CD", n: "DR Congo", r: "West Africa" },
  { c: "CF", n: "Central African Republic", r: "West Africa" },
  { c: "KE", n: "Kenya", r: "East Africa" },
  { c: "TZ", n: "Tanzania", r: "East Africa" },
  { c: "ET", n: "Ethiopia", r: "East Africa" },
  { c: "UG", n: "Uganda", r: "East Africa" },
  { c: "RW", n: "Rwanda", r: "East Africa" },
  { c: "MZ", n: "Mozambique", r: "East Africa" },
  { c: "ZA", n: "South Africa", r: "Southern Africa" },
  { c: "NA", n: "Namibia", r: "Southern Africa" },
  { c: "BW", n: "Botswana", r: "Southern Africa" },
  { c: "ZM", n: "Zambia", r: "Southern Africa" },
  { c: "ZW", n: "Zimbabwe", r: "Southern Africa" },
  { c: "MA", n: "Morocco", r: "North Africa" },
  { c: "EG", n: "Egypt", r: "North Africa" },
  { c: "TN", n: "Tunisia", r: "North Africa" },
  { c: "DZ", n: "Algeria", r: "North Africa" },
  { c: "LY", n: "Libya", r: "North Africa" },
  { c: "FR", n: "France", r: "Western Europe" },
  { c: "DE", n: "Germany", r: "Western Europe" },
  { c: "GB", n: "United Kingdom", r: "Western Europe" },
  { c: "IT", n: "Italy", r: "Western Europe" },
  { c: "ES", n: "Spain", r: "Western Europe" },
  { c: "CH", n: "Switzerland", r: "Western Europe" },
  { c: "NL", n: "Netherlands", r: "Western Europe" },
  { c: "BE", n: "Belgium", r: "Western Europe" },
  { c: "PT", n: "Portugal", r: "Western Europe" },
  { c: "SE", n: "Sweden", r: "Western Europe" },
  { c: "NO", n: "Norway", r: "Western Europe" },
  { c: "AT", n: "Austria", r: "Western Europe" },
  { c: "RU", n: "Russia", r: "Eastern Europe" },
  { c: "PL", n: "Poland", r: "Eastern Europe" },
  { c: "CZ", n: "Czech Republic", r: "Eastern Europe" },
  { c: "HU", n: "Hungary", r: "Eastern Europe" },
  { c: "RO", n: "Romania", r: "Eastern Europe" },
  { c: "AE", n: "UAE", r: "Middle East" },
  { c: "SA", n: "Saudi Arabia", r: "Middle East" },
  { c: "QA", n: "Qatar", r: "Middle East" },
  { c: "KW", n: "Kuwait", r: "Middle East" },
  { c: "BH", n: "Bahrain", r: "Middle East" },
  { c: "TR", n: "Turkey", r: "Middle East" },
  { c: "IN", n: "India", r: "South Asia" },
  { c: "PK", n: "Pakistan", r: "South Asia" },
  { c: "BD", n: "Bangladesh", r: "South Asia" },
  { c: "LK", n: "Sri Lanka", r: "South Asia" },
  { c: "NP", n: "Nepal", r: "South Asia" },
  { c: "TH", n: "Thailand", r: "Southeast Asia" },
  { c: "VN", n: "Vietnam", r: "Southeast Asia" },
  { c: "ID", n: "Indonesia", r: "Southeast Asia" },
  { c: "MY", n: "Malaysia", r: "Southeast Asia" },
  { c: "SG", n: "Singapore", r: "Southeast Asia" },
  { c: "PH", n: "Philippines", r: "Southeast Asia" },
  { c: "MM", n: "Myanmar", r: "Southeast Asia" },
  { c: "JP", n: "Japan", r: "East Asia" },
  { c: "CN", n: "China", r: "East Asia" },
  { c: "KR", n: "South Korea", r: "East Asia" },
  { c: "TW", n: "Taiwan", r: "East Asia" },
  { c: "US", n: "United States", r: "North America" },
  { c: "CA", n: "Canada", r: "North America" },
  { c: "MX", n: "Mexico", r: "North America" },
  { c: "BR", n: "Brazil", r: "Latin America" },
  { c: "AR", n: "Argentina", r: "Latin America" },
  { c: "CO", n: "Colombia", r: "Latin America" },
  { c: "CL", n: "Chile", r: "Latin America" },
  { c: "PE", n: "Peru", r: "Latin America" },
  { c: "VE", n: "Venezuela", r: "Latin America" },
  { c: "AU", n: "Australia", r: "Oceania" },
  { c: "NZ", n: "New Zealand", r: "Oceania" },
  { c: "FJ", n: "Fiji", r: "Oceania" },
];

const FLIGHT_BASE = {
  "West Africa": 820,
  "East Africa": 750,
  "North Africa": 690,
  "Southern Africa": 870,
  "Western Europe": 580,
  "Eastern Europe": 540,
  "Middle East": 380,
  "South Asia": 480,
  "Southeast Asia": 310,
  "East Asia": 720,
  "North America": 380,
  "Latin America": 680,
  Oceania: 1050,
};

const DEST_PREMIUM = {
  5: 1.4,
  9: 1.3,
  3: 1.35,
  2: 1.25,
  8: 1.2,
  10: 1.15,
  4: 1.2,
  17: 1.2,
  1: 1.0,
  11: 0.95,
  18: 0.9,
  15: 0.85,
  13: 0.85,
  20: 0.95,
  12: 1.05,
  14: 0.95,
  16: 1.05,
  19: 1.1,
  6: 1.2,
  7: 1.05,
};

window.TV = {
  DESTINATIONS,
  ACCOMMODATIONS,
  ACTIVITIES,
  COUNTRIES,
  FLIGHT_BASE,
  DEST_PREMIUM,
  ADMIN_WHATSAPP,
  REF_AGENTS,
};

// ── Read ?ref= from URL and persist in localStorage ───────
(function() {
  try {
    const params = new URLSearchParams(window.location.search);
    const refFromURL = params.get('ref');
    // If URL has a valid ref, save it (overrides any previous)
    if (refFromURL && REF_AGENTS[refFromURL]) {
      localStorage.setItem('tv_ref', refFromURL);
    }
  } catch(e) {}
  // Read stored ref (set from URL on any page in this session)
  var storedRef = null;
  try { storedRef = localStorage.getItem('tv_ref'); } catch(e) {}
  // Validate it's still a known agent
  if (storedRef && !REF_AGENTS[storedRef]) storedRef = null;
  window.TV.currentRef   = storedRef || null;
  window.TV.currentAgent = storedRef ? (REF_AGENTS[storedRef] || null) : null;
  if (storedRef) console.log('[Travencia] Agent ref active:', storedRef);

  // ── Propagate ?ref= to all internal page links ──────────
  // Runs after DOM is ready so all <a> tags exist
  if (storedRef) {
    function _addRefToLinks() {
      // Pages to propagate ref through
      var PAGES = ['index.html','destinations.html','activities.html',
                   'services.html','worldcup.html','contact.html'];
      document.querySelectorAll('a[href]').forEach(function(a) {
        var href = a.getAttribute('href');
        if (!href) return;
        // Only process relative internal links to our pages
        var isInternal = PAGES.some(function(p) {
          return href === p || href.startsWith(p + '?') || href.startsWith(p + '#');
        });
        if (!isInternal) return;
        // Don't double-add
        if (href.indexOf('ref=') !== -1) return;
        var sep = href.indexOf('?') !== -1 ? '&' : '?';
        a.setAttribute('href', href + sep + 'ref=' + storedRef);
      });
      // Also rewrite onclick location.href calls on brand logo etc
      document.querySelectorAll('[onclick]').forEach(function(el) {
        var oc = el.getAttribute('onclick') || '';
        PAGES.forEach(function(p) {
          // e.g. location.href='index.html'
          var pattern = "'" + p + "'";
          if (oc.indexOf(pattern) !== -1 && oc.indexOf('ref=') === -1) {
            oc = oc.replace(pattern, "'" + p + "?ref=" + storedRef + "'");
          }
        });
        el.setAttribute('onclick', oc);
      });
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _addRefToLinks);
    } else {
      _addRefToLinks();
      // Also run after a tick in case content rendered late
      setTimeout(_addRefToLinks, 500);
    }
  }
})();

window.TV.fmt = (n) =>
  Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
window.TV.calcPrice = function ({
  destId,
  dep,
  ret,
  country,
  adults,
  children,
  accId,
  actIds,
}) {
  const dest = DESTINATIONS.find((d) => d.id === destId);
  if (!dest || !dep || !ret || dep >= ret) return null;
  const nights = Math.max(
    1,
    Math.ceil((new Date(ret) - new Date(dep)) / 86400000),
  );
  const persons = (adults || 1) + (children || 0);
  const co = COUNTRIES.find((c) => c.c === country) || { r: "West Africa" };
  const baseF = FLIGHT_BASE[co.r] || 820;
  const destMult = DEST_PREMIUM[destId] || 1.0;
  const flightCost = baseF * persons * destMult;
  const month = new Date(dep).getMonth() + 1;
  const peak = [6, 7, 8, 12, 1].includes(month);
  const sMult = peak ? 1.28 : 1.0;
  let accCost = 0;
  if (accId) {
    const ac = (ACCOMMODATIONS[destId] || []).find((a) => a.id === accId);
    if (ac) accCost = ac.ppn * nights * sMult;
  } else {
    accCost = dest.pn * nights * sMult;
  }
  let actCost = 0;
  if (actIds && actIds.length) {
    const acts = ACTIVITIES[destId] || [];
    actIds.forEach((aid) => {
      const a = acts.find((x) => x.id === aid);
      if (a) actCost += a.price * (adults || 1);
    });
  }
  const sub = flightCost + accCost + actCost;
  const taxes = sub * 0.12;
  const total = sub + taxes;
  return {
    nights,
    persons,
    flightCost,
    accCost,
    actCost,
    sub,
    taxes,
    total,
    peak,
    currency: "USD",
  };
};
window.TV.sendWA = function (phone, msg) {
  window.open(
    `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`,
    "_blank",
  );
};
window.TV.genCode = () =>
  "TV-" + Math.random().toString(36).toUpperCase().substr(2, 8);
