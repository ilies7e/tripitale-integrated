import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* -----------------------------------------------------------
 * CATEGORIES
 * ----------------------------------------------------------- */
const CATEGORIES = [
  {
    name: 'Camping',
    slug: 'camping',
    icon: 'campground',
    description:
      'A nature-based trip where travelers stay outdoors, usually in tents or camper vans, to enjoy a simple and adventurous experience close to nature.',
    coverImage:
      'https://images.unsplash.com/photo-1504280390267-3310452f19d2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Hotel Vacation',
    slug: 'hotel-vacation',
    icon: 'hotel',
    description:
      'A comfort-focused trip centered around staying in hotels or resorts, often with planned activities, spa time, and relaxation.',
    coverImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Hiking',
    slug: 'hiking',
    icon: 'hiking',
    description: 'Scenic trail adventures across mountains, forests and national parks.',
    coverImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Beach',
    slug: 'beach',
    icon: 'umbrella-beach',
    description: 'Algerian Mediterranean coast: Annaba, Jijel, Oran, Bejaïa.',
    coverImage:
      'https://images.unsplash.com/photo-1628025378093-96b9479032b6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'City Tour',
    slug: 'city-tour',
    icon: 'city',
    description: 'Algiers, Constantine, Oran — heritage cities to explore on foot.',
    coverImage:
      'https://images.unsplash.com/photo-1631995872935-d964797502e0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Road Trip',
    slug: 'road-trip',
    icon: 'car',
    description: 'Open highways, scenic routes and freedom on wheels.',
    coverImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Desert',
    slug: 'desert',
    icon: 'sun',
    description: 'Tassili, Hoggar, Taghit, M\'Zab — the Algerian Sahara.',
    coverImage:
      'https://images.unsplash.com/photo-1714313164992-4c33788bd6f7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mountain',
    slug: 'mountain',
    icon: 'mountain',
    description: 'Hoggar, Djurdjura, Atlas Tellien — Algerian summits.',
    coverImage:
      'https://images.unsplash.com/photo-1631995390084-cb82295cd2c0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cultural',
    slug: 'cultural',
    icon: 'landmark',
    description: 'Timgad, Djemila, Tipaza, Tlemcen — Algeria\'s heritage.',
    coverImage:
      'https://images.unsplash.com/photo-1664490283761-ee8376af809b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Food & Wine',
    slug: 'food-wine',
    icon: 'wine-glass',
    description: 'Gastronomic journeys, vineyards, and tasting tours.',
    coverImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Adventure',
    slug: 'adventure',
    icon: 'compass',
    description: 'Adrenaline-fueled trips: rafting, climbing, paragliding and more.',
    coverImage:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Wildlife & Safari',
    slug: 'wildlife',
    icon: 'paw',
    description: 'Up-close encounters with the most iconic animals on Earth.',
    coverImage:
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cruise',
    slug: 'cruise',
    icon: 'ship',
    description: 'Multi-stop voyages by sea — luxury liners and small expedition ships.',
    coverImage:
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Festival',
    slug: 'festival',
    icon: 'music',
    description: 'Music, lights, and cultural festivals across the world.',
    coverImage:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Wellness & Spa',
    slug: 'wellness',
    icon: 'spa',
    description: 'Slow trips to recharge: yoga retreats, hot springs and spa resorts.',
    coverImage:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Winter Sports',
    slug: 'winter-sports',
    icon: 'snowflake',
    description: 'Skiing, snowboarding and snowy mountain weekends.',
    coverImage:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Island Hopping',
    slug: 'island-hopping',
    icon: 'island-tropical',
    description: 'Multi-island routes by ferry or private boat. Endless beaches.',
    coverImage:
      'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Backpacking',
    slug: 'backpacking',
    icon: 'backpack',
    description: 'Long-haul, low-budget trips with one rucksack and an open mind.',
    coverImage:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  },
];

/* -----------------------------------------------------------
 * USERS
 * ----------------------------------------------------------- */
type UserSeed = {
  username: string;
  email: string;
  fullName: string;
  bio: string;
  profilePicture: string;
};

const USERS: UserSeed[] = [
  {
    username: 'karlkeating',
    email: 'demo@triptale.app',
    fullName: 'Karl Keating',
    bio: 'Demo account — passionate traveler exploring Algeria from coast to Sahara. Sharing favorite spots, tips and hidden gems.',
    profilePicture:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'yacine',
    email: 'yacine@triptale.app',
    fullName: 'Yacine Belkacem',
    bio: 'Photographer based in Algiers. Obsessed with the Casbah, blue hours and old doors.',
    profilePicture:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'amina',
    email: 'amina@triptale.app',
    fullName: 'Amina Benhamou',
    bio: 'Constantine native, architect, and proud guide of the city of bridges.',
    profilePicture:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'walid',
    email: 'walid@triptale.app',
    fullName: 'Walid Tahar',
    bio: 'Tassili & Hoggar trekking guide. 12 years in the Sahara, still in love with it.',
    profilePicture:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'lila',
    email: 'lila@triptale.app',
    fullName: 'Lila Mansouri',
    bio: 'Oranaise. Beach, surf, mediterranean food and Raï on repeat 🌊',
    profilePicture:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'rania',
    email: 'rania@triptale.app',
    fullName: 'Rania Cherif',
    bio: 'Food blogger from Algiers — couscous, mhadjeb and the best brik in town.',
    profilePicture:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'karim',
    email: 'karim@triptale.app',
    fullName: 'Karim Bouzid',
    bio: 'Hiker & 4x4 driver. Djurdjura summits, Saharan oases, and everything in between.',
    profilePicture:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  },
  {
    username: 'sara',
    email: 'sara@triptale.app',
    fullName: 'Sara Ait Ali',
    bio: 'Tlemcen / Andalusian heritage nerd. Books, mosques and zelliges.',
    profilePicture:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
  },
];

/* -----------------------------------------------------------
 * TRIPS
 * ----------------------------------------------------------- */
type GuideSeed = {
  type: 'budget' | 'mustvisit' | 'food' | 'warnings' | 'extra';
  label: string;
  icon: string;
  text: string;
  locations?: string[];
};

type CommentSeed = { username: string; content: string };
type RatingSeed = { username: string; value: number };

type TripSeed = {
  ownerUsername: string;
  title: string;
  description: string;
  location: string;
  region: string;
  country: string;
  coverPhoto: string;
  budget: number;
  categorySlug: string;
  media: { mediaUrl: string; caption?: string }[];
  guides: GuideSeed[];
  comments?: CommentSeed[];
  ratings?: RatingSeed[];
};

const img = (id: string, opts = 'w=1200&q=80') =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${opts}`;

const TRIPS: TripSeed[] = [
  /* ---- Casbah of Algiers (City Tour) ---- */
  {
    ownerUsername: 'yacine',
    title: 'Casbah of Algiers — Old Town Walk',
    description:
      "A two-day deep dive into the UNESCO-listed Casbah: zigzag alleys, Ottoman palaces, fishermen's mosque, and rooftop sunsets over the bay.",
    location: 'Casbah, Algiers',
    region: 'Algiers',
    country: 'Algeria',
    coverPhoto: img('1631995872935-d964797502e0', 'w=1600&q=80'),
    budget: 120,
    categorySlug: 'city-tour',
    media: [
      { mediaUrl: img('1631995872935-d964797502e0'), caption: 'White walls of the Casbah' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Bay of Algiers at sunset' },
      { mediaUrl: img('1552832230-c0197dd311b5'), caption: 'Ottoman doorway' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Hotels in central Algiers 4500-9000 DZD/night. Local guide ~3000 DZD/day. Coffee 60-100 DZD.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🕌',
        text: "Ketchaoua Mosque, Dar Hassan Pacha, Bastion 23, Place des Martyrs, Notre-Dame d'Afrique.",
        locations: ['Ketchaoua Mosque', 'Dar Hassan Pacha', 'Bastion 23', "Notre-Dame d'Afrique"],
      },
      {
        type: 'food', label: 'Food & Restaurants', icon: '🍽️',
        text: 'Try chorba frik, mhadjeb at Rue Didouche Mourad, fresh seafood at the port.',
        locations: ['Rue Didouche Mourad', 'Port of Algiers'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Casbah alleys are steep and uneven — wear good shoes. Always go with a local guide.' },
    ],
    comments: [
      { username: 'amina', content: 'Best photos of the Casbah I have ever seen — the morning light is unreal.' },
      { username: 'rania', content: 'Add couscous Friday at El Djenina, you will not regret it.' },
      { username: 'sara', content: 'Bastion 23 is a must, the view over the bay is magical.' },
    ],
    ratings: [
      { username: 'amina', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'walid', value: 4 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Tassili n'Ajjer (Desert) ---- */
  {
    ownerUsername: 'walid',
    title: "Tassili n'Ajjer — Prehistoric Sahara Trek",
    description:
      '8-day camel and walking trek across the Tassili plateau near Djanet. Ancient rock art older than the pyramids, sand canyons and starlit camps.',
    location: 'Djanet, Tassili',
    region: "Tassili n'Ajjer",
    country: 'Algeria',
    coverPhoto: img('1714313164992-4c33788bd6f7', 'w=1600&q=80'),
    budget: 1100,
    categorySlug: 'desert',
    media: [
      { mediaUrl: img('1714313164992-4c33788bd6f7'), caption: "Tassili n'Ajjer at sunset" },
      { mediaUrl: img('1672575946268-b07d6719a451'), caption: 'Sandstone formations' },
      { mediaUrl: img('1547036967-23d11aacaee0'), caption: 'Camp under the stars' },
      { mediaUrl: img('1535941339077-2dd1c7963098'), caption: 'Saharan dunes' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Full guided trek 8 days ~120,000 DZD all-inclusive (camels, food, guide, permits).' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏜️',
        text: 'Sefar rock shelters, Tin Tarabine valley, Tikoubaouine arch, Erg Admer dunes.',
        locations: ['Sefar', 'Tin Tarabine', 'Tikoubaouine', 'Erg Admer'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Special tourist permit required for Djanet. Best season Oct-March, avoid June-August (>45°C).' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Pack a head-scarf (cheche), warm jacket for nights, sunscreen SPF50+. Cash only.' },
    ],
    comments: [
      { username: 'karim', content: 'Hands down the most magical place in Africa.' },
      { username: 'yacine', content: 'The light at golden hour over the rocks is insane.' },
      { username: 'karlkeating', content: 'Saving for next October. Already booked!' },
    ],
    ratings: [
      { username: 'karim', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'karlkeating', value: 5 },
      { username: 'amina', value: 5 },
      { username: 'lila', value: 5 },
    ],
  },

  /* ---- Hoggar / Assekrem (Mountain) ---- */
  {
    ownerUsername: 'walid',
    title: 'Hoggar Mountains & Assekrem Sunrise',
    description:
      'Tamanrasset to Assekrem 4x4 expedition. Volcanic peaks, the hermitage of Père de Foucauld, and the most famous sunrise in the Sahara.',
    location: 'Tamanrasset, Hoggar',
    region: 'Hoggar',
    country: 'Algeria',
    coverPhoto: img('1631995390084-cb82295cd2c0', 'w=1600&q=80'),
    budget: 950,
    categorySlug: 'mountain',
    media: [
      { mediaUrl: img('1631995390084-cb82295cd2c0'), caption: 'Hoggar volcanic peaks' },
      { mediaUrl: img('1672575946268-b07d6719a451'), caption: 'Assekrem plateau' },
      { mediaUrl: img('1535941339077-2dd1c7963098'), caption: 'Sunrise at Assekrem' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: '4x4 + guide ~25,000 DZD/day. Tamanrasset hotels 5000-10000 DZD/night.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '⛰️',
        text: 'Assekrem hermitage, Atakor plateau, Tahat peak (2918m), Tamanrasset Tuareg market.',
        locations: ['Assekrem', 'Atakor', 'Mount Tahat', 'Tamanrasset Market'],
      },
      { type: 'warnings', label: 'Warnings', icon: '🥶', text: 'Cold nights at altitude (-5°C in winter). Always travel with a registered local guide.' },
    ],
    comments: [
      { username: 'karim', content: 'The sunrise at Assekrem changed me. No words.' },
      { username: 'amina', content: 'The Tuareg silver jewelry in Tamanrasset is incredible too.' },
    ],
    ratings: [
      { username: 'karim', value: 5 },
      { username: 'amina', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Constantine (City of Bridges) ---- */
  {
    ownerUsername: 'amina',
    title: 'Constantine — The City of Bridges',
    description:
      'A 3-day walk through Algeria\'s oldest city: gorges, suspension bridges, the Rummel canyon, palaces, and Cirta heritage.',
    location: 'Constantine',
    region: 'Constantine',
    country: 'Algeria',
    coverPhoto: img('1664490283761-ee8376af809b', 'w=1600&q=80'),
    budget: 280,
    categorySlug: 'city-tour',
    media: [
      { mediaUrl: img('1664490283761-ee8376af809b'), caption: 'Constantine cliffs and bridges' },
      { mediaUrl: img('1552832230-c0197dd311b5'), caption: 'Palace courtyard' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Old town overlook' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Hotels 4000-7500 DZD/night, taxi 200-500 DZD around the city.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🌉',
        text: "Sidi M'Cid bridge, Mellah Slimane footbridge, Palace of Ahmed Bey, Emir Abdelkader Mosque, the gorges.",
        locations: ["Sidi M'Cid Bridge", 'Mellah Slimane Footbridge', 'Ahmed Bey Palace', 'Emir Abdelkader Mosque'],
      },
      {
        type: 'food', label: 'Food & Restaurants', icon: '🍽️',
        text: 'Try chakhchoukha and Constantinois pastries. Café El Khroub for the view.',
      },
    ],
    comments: [
      { username: 'sara', content: 'The bridges at night are spectacular. Bring a tripod!' },
      { username: 'yacine', content: 'Underrated city. Architects will lose their minds.' },
    ],
    ratings: [
      { username: 'sara', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'karlkeating', value: 4 },
    ],
  },

  /* ---- Timgad (Cultural / Roman ruins) ---- */
  {
    ownerUsername: 'amina',
    title: 'Timgad — The Pompeii of North Africa',
    description:
      'A day trip from Batna to the perfectly preserved Roman city of Thamugadi. Cardo, decumanus, theater, and Trajan\'s arch in one of the most complete Roman grids in the world.',
    location: 'Timgad, Batna',
    region: 'Aurès',
    country: 'Algeria',
    coverPhoto: img('1552832230-c0197dd311b5', 'w=1600&q=80'),
    budget: 80,
    categorySlug: 'cultural',
    media: [
      { mediaUrl: img('1552832230-c0197dd311b5'), caption: 'Roman columns standing' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Theater of Timgad' },
      { mediaUrl: img('1414235077428-338989a2e8c0'), caption: 'Mosaics museum' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Site entry ~200 DZD. Day trip from Batna ~5000 DZD with driver.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏛️',
        text: "Trajan's Arch, the theater, the library, mosaics museum on site.",
        locations: ["Trajan's Arch", 'Timgad Theater', 'Timgad Museum'],
      },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Combine with Djemila in 2-day Aurès loop. Hat & water — almost no shade.' },
    ],
    comments: [
      { username: 'sara', content: 'Easily one of the best preserved Roman cities I have ever seen.' },
      { username: 'karlkeating', content: 'The mosaics are unbelievable. World class.' },
    ],
    ratings: [
      { username: 'sara', value: 5 },
      { username: 'karlkeating', value: 5 },
      { username: 'yacine', value: 5 },
    ],
  },

  /* ---- Djemila (Cultural) ---- */
  {
    ownerUsername: 'sara',
    title: "Djemila — Cuicul's Forgotten Roman Forum",
    description:
      "An afternoon among the columns of ancient Cuicul: temples of Septimius Severus, the forum, the Christian quarter — and barely any tourists.",
    location: 'Djemila, Sétif',
    region: 'Sétif',
    country: 'Algeria',
    coverPhoto: img('1414235077428-338989a2e8c0', 'w=1600&q=80'),
    budget: 90,
    categorySlug: 'cultural',
    media: [
      { mediaUrl: img('1414235077428-338989a2e8c0'), caption: 'Forum of Cuicul' },
      { mediaUrl: img('1552832230-c0197dd311b5'), caption: 'Temple of Septimius Severus' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Roman columns' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Site entry ~200 DZD. From Sétif ~3500 DZD round-trip taxi.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏛️',
        text: 'Forum, Capitol, Temple of Septimius Severus, Christian quarter, on-site museum mosaics.',
        locations: ['Djemila Forum', 'Temple of Septimius Severus', 'Djemila Museum'],
      },
    ],
    comments: [
      { username: 'amina', content: 'Even more atmospheric than Timgad in my opinion.' },
    ],
    ratings: [
      { username: 'amina', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'karlkeating', value: 4 },
    ],
  },

  /* ---- Tipaza (Cultural / Beach) ---- */
  {
    ownerUsername: 'yacine',
    title: 'Tipaza — Roman Ruins by the Sea',
    description:
      "Day-trip 70km west of Algiers: walk through Roman ruins overlooking the Mediterranean, then a long lunch of grilled fish on the beach.",
    location: 'Tipaza',
    region: 'Tipaza',
    country: 'Algeria',
    coverPhoto: img('1499678329028-101435549a4e', 'w=1600&q=80'),
    budget: 100,
    categorySlug: 'cultural',
    media: [
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Tipaza basilica by the sea' },
      { mediaUrl: img('1628025378093-96b9479032b6'), caption: 'Mediterranean coast' },
      { mediaUrl: img('1414235077428-338989a2e8c0'), caption: 'Roman ruins detail' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Site ticket ~200 DZD. Lunch by the beach ~1500-2500 DZD/person.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏖️',
        text: 'Christian basilica, the forum, royal mausoleum of Mauretania, beach restaurants on rue de la République.',
        locations: ['Tipaza Basilica', 'Royal Mausoleum of Mauretania', 'Tipaza Beach'],
      },
      { type: 'food', label: 'Food & Restaurants', icon: '🐟', text: 'Le Dauphin and La Corne d\'Or — both excellent for fresh fish and rouget.' },
    ],
    comments: [
      { username: 'lila', content: 'Best Sunday escape from Algiers. Bring sunscreen.' },
      { username: 'rania', content: 'The fish at La Corne d\'Or — incredible.' },
    ],
    ratings: [
      { username: 'lila', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'amina', value: 4 },
    ],
  },

  /* ---- Ghardaïa / M'Zab Valley (Cultural / Desert) ---- */
  {
    ownerUsername: 'walid',
    title: "Ghardaïa & the M'Zab Valley",
    description:
      "5 ksour built around 1000 years ago by the Mozabites. UNESCO heritage, ochre architecture, and the most photogenic market in Algeria.",
    location: 'Ghardaïa',
    region: "M'Zab Valley",
    country: 'Algeria',
    coverPhoto: img('1547036967-23d11aacaee0', 'w=1600&q=80'),
    budget: 350,
    categorySlug: 'cultural',
    media: [
      { mediaUrl: img('1547036967-23d11aacaee0'), caption: "M'Zab valley overview" },
      { mediaUrl: img('1672575946268-b07d6719a451'), caption: 'Pink ksar walls' },
      { mediaUrl: img('1552832230-c0197dd311b5'), caption: 'Old market' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Local guesthouse 3500 DZD, dinner 1200 DZD, mandatory local guide 2000 DZD per ksar visit.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏘️',
        text: 'Beni Isguen old town, Ghardaïa market, El Atteuf, Bou Noura, Melika.',
        locations: ['Beni Isguen', 'Ghardaïa Market', 'El Atteuf', 'Bou Noura', 'Melika'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Beni Isguen requires a local guide — closes at sunset, no photos of women, dress modestly.' },
    ],
    comments: [
      { username: 'sara', content: 'Surreal architecture. Like nowhere else.' },
      { username: 'karim', content: 'Beni Isguen tour is mandatory — book the night-market visit.' },
    ],
    ratings: [
      { username: 'sara', value: 5 },
      { username: 'karim', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'amina', value: 5 },
    ],
  },

  /* ---- Tlemcen (Cultural) ---- */
  {
    ownerUsername: 'sara',
    title: 'Tlemcen — Andalusian Algeria',
    description:
      "Three days exploring the old capital of the Zayyanid kingdom: Mansourah ruins, Great Mosque, El Mechouar, and the famous cable car to Lalla Setti.",
    location: 'Tlemcen',
    region: 'Tlemcen',
    country: 'Algeria',
    coverPhoto: img('1552832230-c0197dd311b5', 'w=1600&q=80'),
    budget: 220,
    categorySlug: 'cultural',
    media: [
      { mediaUrl: img('1552832230-c0197dd311b5'), caption: 'Great Mosque of Tlemcen' },
      { mediaUrl: img('1414235077428-338989a2e8c0'), caption: 'Mansourah minaret' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'El Mechouar palace' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Hotels 4500-8000 DZD. Cable car ~200 DZD. Mansourah free.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🕌',
        text: 'Great Mosque (1136), El Mechouar Palace, Mansourah ruins, Sidi Boumediene complex, Lalla Setti plateau.',
        locations: ['Great Mosque of Tlemcen', 'El Mechouar', 'Mansourah', 'Sidi Boumediene', 'Lalla Setti'],
      },
      { type: 'food', label: 'Food & Restaurants', icon: '🍽️', text: 'Tlemcen cherries season (May), kalb el louz pastries, couscous tlemceni.' },
    ],
    comments: [
      { username: 'amina', content: 'The Great Mosque is one of the finest in the Maghreb.' },
      { username: 'rania', content: 'Cherry season in May — book early.' },
    ],
    ratings: [
      { username: 'amina', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'karlkeating', value: 4 },
    ],
  },

  /* ---- Annaba (Beach) ---- */
  {
    ownerUsername: 'lila',
    title: 'Annaba — Saint Augustine and the Coast',
    description:
      "4 days on Algeria's eastern coast: Basilica Saint Augustine, ancient Hippo Regius ruins, and the spectacular beaches of Seraïdi and Cap de Garde.",
    location: 'Annaba',
    region: 'Annaba',
    country: 'Algeria',
    coverPhoto: img('1628025378093-96b9479032b6', 'w=1600&q=80'),
    budget: 380,
    categorySlug: 'beach',
    media: [
      { mediaUrl: img('1628025378093-96b9479032b6'), caption: 'Annaba beach aerial' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Hippo Regius ruins' },
      { mediaUrl: img('1505228395891-9a51e7e86bf6'), caption: 'Cap de Garde coast' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Hotels 5000-10000 DZD. Cape de Garde taxi 800 DZD round-trip.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏖️',
        text: 'Saint Augustine Basilica, Hippo Regius, Seraïdi mountain village, Cap de Garde lighthouse.',
        locations: ['Saint Augustine Basilica', 'Hippo Regius', 'Seraïdi', 'Cap de Garde'],
      },
      { type: 'food', label: 'Food & Restaurants', icon: '🐟', text: 'Try fresh octopus and grilled sardines on the corniche.' },
    ],
    comments: [
      { username: 'karim', content: 'Seraïdi has the best mountain-meets-sea view in Algeria.' },
      { username: 'sara', content: 'Saint Augustine basilica at golden hour is unreal.' },
    ],
    ratings: [
      { username: 'karim', value: 5 },
      { username: 'sara', value: 4 },
      { username: 'yacine', value: 5 },
    ],
  },

  /* ---- Jijel Corniche (Beach) ---- */
  {
    ownerUsername: 'karim',
    title: 'Jijel Corniche — Turquoise Coast',
    description:
      "Algeria's hidden Mediterranean gem: 100km of pine-forested cliffs, hidden coves, sea caves and white-sand beaches between Bejaïa and Skikda.",
    location: 'Jijel',
    region: 'Jijel',
    country: 'Algeria',
    coverPhoto: img('1505228395891-9a51e7e86bf6', 'w=1600&q=80'),
    budget: 320,
    categorySlug: 'beach',
    media: [
      { mediaUrl: img('1505228395891-9a51e7e86bf6'), caption: 'Jijel turquoise water' },
      { mediaUrl: img('1628025378093-96b9479032b6'), caption: 'Hidden cove' },
      { mediaUrl: img('1530841377377-3ff06c0ca713'), caption: 'Coastal road' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Beach hotels 5000-9000 DZD/night July-August. Half that in shoulder season.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🌊',
        text: 'Plage des Aftis, Grottes Merveilleuses sea caves, Andalusian beach, Ras El Afia lighthouse.',
        locations: ['Plage des Aftis', 'Grottes Merveilleuses', 'Andalouses Beach', 'Ras El Afia'],
      },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Avoid August (packed). Best in June or September.' },
    ],
    comments: [
      { username: 'lila', content: 'The water is unreal. Like Croatia but empty.' },
      { username: 'rania', content: 'Don\'t miss the seafood at Plage du Rocher.' },
    ],
    ratings: [
      { username: 'lila', value: 5 },
      { username: 'rania', value: 4 },
      { username: 'yacine', value: 5 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Oran / Santa Cruz (City Tour) ---- */
  {
    ownerUsername: 'lila',
    title: 'Oran — Santa Cruz and the Wahran Spirit',
    description:
      "Birthplace of Raï music. 3 days: Santa Cruz fort overlook, Le Front de Mer, the Spanish quarter and a night out to the rhythm of Cheb Khaled's hometown.",
    location: 'Oran',
    region: 'Oran',
    country: 'Algeria',
    coverPhoto: img('1499678329028-101435549a4e', 'w=1600&q=80'),
    budget: 250,
    categorySlug: 'city-tour',
    media: [
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Santa Cruz fort and bay' },
      { mediaUrl: img('1628025378093-96b9479032b6'), caption: 'Oran beach' },
      { mediaUrl: img('1505228395891-9a51e7e86bf6'), caption: 'Mediterranean coast' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Hotels 4500-9000 DZD. Taxi to Santa Cruz 600 DZD round-trip.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏛️',
        text: 'Santa Cruz fort, Place du 1er Novembre, Pasha Mosque, the corniche, Sidi M\'Houcine Lighthouse.',
        locations: ['Santa Cruz Fort', 'Place du 1er Novembre', 'Pasha Mosque', 'Sidi M\'Houcine Lighthouse'],
      },
      { type: 'food', label: 'Food & Restaurants', icon: '🥘', text: 'Karantita (chickpea pancake) at the port — Oran specialty. Best calamari at Restaurant Le Méditerranée.' },
    ],
    comments: [
      { username: 'rania', content: 'Oran nights — best in Algeria.' },
      { username: 'yacine', content: 'Santa Cruz at sunset is magic.' },
    ],
    ratings: [
      { username: 'rania', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'karim', value: 4 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Bejaïa / Yemma Gouraya (Hiking) ---- */
  {
    ownerUsername: 'karim',
    title: 'Bejaïa & Yemma Gouraya National Park',
    description:
      "Hike up the iconic Yemma Gouraya peak above the bay, then descend to the wild Cap Carbon and the secret beaches of the Kabyle coast.",
    location: 'Bejaïa',
    region: 'Kabylie',
    country: 'Algeria',
    coverPhoto: img('1530841377377-3ff06c0ca713', 'w=1600&q=80'),
    budget: 290,
    categorySlug: 'hiking',
    media: [
      { mediaUrl: img('1530841377377-3ff06c0ca713'), caption: 'Bay of Bejaïa' },
      { mediaUrl: img('1505228395891-9a51e7e86bf6'), caption: 'Cap Carbon cliffs' },
      { mediaUrl: img('1628025378093-96b9479032b6'), caption: 'Hidden beach' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Hotels 5000-8000 DZD. Park entry free. Local guide ~3000 DZD/day.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🥾',
        text: 'Yemma Gouraya summit (672m), Cap Carbon lighthouse, Pic des Singes, Aiguades Bay.',
        locations: ['Yemma Gouraya', 'Cap Carbon', 'Pic des Singes', 'Aiguades Bay'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Hike to Yemma Gouraya is steep — start early to avoid heat. Watch for monkeys at Pic des Singes.' },
    ],
    comments: [
      { username: 'lila', content: 'View from Yemma Gouraya is the best in northern Algeria.' },
      { username: 'sara', content: 'Aiguades Bay is paradise.' },
    ],
    ratings: [
      { username: 'lila', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'yacine', value: 5 },
    ],
  },

  /* ---- Chréa (Winter Sports) ---- */
  {
    ownerUsername: 'karim',
    title: 'Chréa National Park — Skiing in the Atlas',
    description:
      "Algeria's surprise ski resort, 1h30 from Algiers. Cedar forests, monkeys, and snow at 1500m from late December to March.",
    location: 'Chréa, Blida',
    region: 'Atlas Blidéen',
    country: 'Algeria',
    coverPhoto: img('1551698618-1dfe5d97d256', 'w=1600&q=80'),
    budget: 180,
    categorySlug: 'winter-sports',
    media: [
      { mediaUrl: img('1551698618-1dfe5d97d256'), caption: 'Snow over the cedars' },
      { mediaUrl: img('1517825738774-7de9363ef735'), caption: 'Atlas peaks' },
      { mediaUrl: img('1483728642387-6c3bdd6c93e5'), caption: 'Cable car station' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Cable car ~600 DZD round-trip. Ski rental ~2500 DZD/day. Lift ticket ~1500 DZD.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '⛷️',
        text: 'Téléphérique de Blida, Glacières summit, Chréa cedar forest, Barbary macaque viewpoint.',
        locations: ['Téléphérique de Blida', 'Glacières', 'Chréa Cedar Forest'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Snow window is narrow (mid-Jan to end-Feb). Check forecast — drive up only with chains/4x4.' },
    ],
    comments: [
      { username: 'amina', content: 'You can ski 1h30 from Algiers. Still surprises my foreign friends!' },
    ],
    ratings: [
      { username: 'amina', value: 4 },
      { username: 'lila', value: 4 },
      { username: 'yacine', value: 5 },
    ],
  },

  /* ---- Tikjda / Djurdjura (Hiking / Mountain) ---- */
  {
    ownerUsername: 'karim',
    title: 'Tikjda & Djurdjura — Lalla Khadidja Summit',
    description:
      "3 days hiking in the Djurdjura: Tikjda forests, Tighzert peak, and the climb to Lalla Khadidja (2308m), Algeria's most accessible high summit.",
    location: 'Tikjda, Bouïra',
    region: 'Djurdjura',
    country: 'Algeria',
    coverPhoto: img('1517825738774-7de9363ef735', 'w=1600&q=80'),
    budget: 240,
    categorySlug: 'hiking',
    media: [
      { mediaUrl: img('1517825738774-7de9363ef735'), caption: 'Djurdjura ridges' },
      { mediaUrl: img('1483728642387-6c3bdd6c93e5'), caption: 'Lalla Khadidja summit' },
      { mediaUrl: img('1551698618-1dfe5d97d256'), caption: 'Tikjda cedars' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'CNS lodge in Tikjda 3500 DZD/night. Local guide ~5000 DZD/day.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '⛰️',
        text: 'Lalla Khadidja peak, Tighzert pass, Akouker forest, Talhmama refuge.',
        locations: ['Lalla Khadidja', 'Tighzert', 'Akouker', 'Talhmama Refuge'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Snow on summits Dec-March. Always go with a local guide — weather changes fast.' },
    ],
    comments: [
      { username: 'walid', content: 'Best hike in the Tell. Underrated.' },
      { username: 'sara', content: 'The cedars in autumn are something else.' },
    ],
    ratings: [
      { username: 'walid', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'lila', value: 4 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Taghit (Desert) ---- */
  {
    ownerUsername: 'walid',
    title: 'Taghit — The Pearl of the Saoura',
    description:
      "Sand boarding on Erg Occidental dunes by day, ksar visit by night. The most beautiful red dunes in the Algerian west.",
    location: 'Taghit, Béchar',
    region: 'Saoura',
    country: 'Algeria',
    coverPhoto: img('1672575946268-b07d6719a451', 'w=1600&q=80'),
    budget: 420,
    categorySlug: 'desert',
    media: [
      { mediaUrl: img('1672575946268-b07d6719a451'), caption: 'Taghit at sunrise' },
      { mediaUrl: img('1714313164992-4c33788bd6f7'), caption: 'Red dunes' },
      { mediaUrl: img('1547036967-23d11aacaee0'), caption: 'Old ksar' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Caravansérail Taghit ~9000 DZD/night. 4x4 dune tour ~6000 DZD.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏜️',
        text: 'Erg Occidental dunes, Taghit ksar, prehistoric rock engravings of Beni Ounif.',
        locations: ['Erg Occidental', 'Ksar of Taghit', 'Beni Ounif'],
      },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Best Oct-March. Date palms harvest in October — great atmosphere.' },
    ],
    comments: [
      { username: 'karim', content: 'The light at sunrise on the dunes — chef\'s kiss.' },
      { username: 'rania', content: 'Buy fresh dates from the locals — best in Algeria.' },
    ],
    ratings: [
      { username: 'karim', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'yacine', value: 5 },
    ],
  },

  /* ---- Algiers Food Tour (Food & Wine) ---- */
  {
    ownerUsername: 'rania',
    title: 'Algiers Food Tour — From Mhadjeb to Makroud',
    description:
      "A 1-day eating marathon through Algiers: street food in Bab El Oued, hotel-restaurant lunch in El Biar, and pastries on rue Didouche.",
    location: 'Algiers',
    region: 'Algiers',
    country: 'Algeria',
    coverPhoto: img('1414235077428-338989a2e8c0', 'w=1600&q=80'),
    budget: 70,
    categorySlug: 'food-wine',
    media: [
      { mediaUrl: img('1414235077428-338989a2e8c0'), caption: 'Mint tea & makroud' },
      { mediaUrl: img('1631995872935-d964797502e0'), caption: 'Mhadjeb stall' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Algiers cafe' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Whole day eating ~5000 DZD/person. Mhadjeb 100 DZD, makroud 50 DZD/piece.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🍽️',
        text: 'Mhadjeb at Mhadjebli (Bab El Oued), brik aux œufs at El Bahdja, El Hadji pastries.',
        locations: ['Bab El Oued', 'Rue Didouche Mourad', 'El Biar'],
      },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Friday couscous is a national tradition — book in advance.' },
    ],
    comments: [
      { username: 'lila', content: 'Algerian pastries are SO underrated worldwide.' },
      { username: 'sara', content: 'Add Hocine Pastry on rue Larbi Ben Mhidi — life-changing kalb el louz.' },
      { username: 'amina', content: 'Best brik with egg I had was at El Bahdja. Unbeatable.' },
      { username: 'walid', content: 'When you are done, try the Saharan dates from Biskra at the Hadj Tahar shop.' },
    ],
    ratings: [
      { username: 'lila', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'amina', value: 5 },
      { username: 'karlkeating', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'walid', value: 4 },
    ],
  },

  /* ---- Camping at Tikjda Cedars (Camping) ---- */
  {
    ownerUsername: 'karim',
    title: 'Camping in Tikjda Cedar Forests',
    description:
      "3 nights camping under the giant Atlas cedars of Tikjda. Cool nights, mountain stars, and morning hikes to Lalla Khadidja's foothills.",
    location: 'Tikjda, Bouïra',
    region: 'Djurdjura',
    country: 'Algeria',
    coverPhoto: img('1504280390267-3310452f19d2', 'w=1600&q=80'),
    budget: 90,
    categorySlug: 'camping',
    media: [
      { mediaUrl: img('1504280390267-3310452f19d2'), caption: 'Tent under cedars' },
      { mediaUrl: img('1517825738774-7de9363ef735'), caption: 'Djurdjura ridges' },
      { mediaUrl: img('1551698618-1dfe5d97d256'), caption: 'Camp morning' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Camping fees ~500 DZD/night. Bring own gear or rent in Algiers (~3000 DZD/3 days).' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏕️',
        text: 'Tikjda CNS area, Tighzert pass, Tala Rana waterfall, Akouker forest.',
        locations: ['Tikjda CNS', 'Tighzert', 'Tala Rana Waterfall', 'Akouker'],
      },
      { type: 'food', label: 'Food & Restaurants', icon: '🍲', text: 'Bring supplies — only one small shop in Tikjda. Try kabyle galette at the village.' },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Nights drop to 5°C even in summer. No fires outside designated zones.' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Cellular coverage is patchy. Download offline maps. Best season May-October.' },
    ],
    comments: [
      { username: 'walid', content: 'My favorite spot to disconnect. Bring marshmallows.' },
      { username: 'sara', content: 'The cedars are giants. Hug them.' },
      { username: 'lila', content: 'Did this last summer — fell asleep counting shooting stars.' },
    ],
    ratings: [
      { username: 'walid', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'lila', value: 5 },
      { username: 'amina', value: 4 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- El Aurassi & Sheraton Club des Pins (Hotel Vacation) ---- */
  {
    ownerUsername: 'rania',
    title: 'Algiers Luxury Weekend — Club des Pins',
    description:
      "A weekend at the Sheraton Club des Pins: private beach, infinity pool, sunset cocktails over the bay of Algiers, and a spa massage to finish.",
    location: 'Club des Pins, Algiers',
    region: 'Algiers',
    country: 'Algeria',
    coverPhoto: img('1542314831-068cd1dbfeeb', 'w=1600&q=80'),
    budget: 480,
    categorySlug: 'hotel-vacation',
    media: [
      { mediaUrl: img('1542314831-068cd1dbfeeb'), caption: 'Pool overlooking the sea' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Bay of Algiers from the rooftop' },
      { mediaUrl: img('1540555700478-4be289fbecef'), caption: 'Spa interior' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Sheraton room from 32,000 DZD/night, half-board ~45,000 DZD. El Aurassi cheaper at ~22,000.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏨',
        text: 'Sheraton Club des Pins, Hôtel El Aurassi rooftop bar, Hammam Sidi Yahia, Memorial Maqam Echahid view.',
        locations: ['Sheraton Club des Pins', 'El Aurassi', 'Hammam Sidi Yahia', 'Maqam Echahid'],
      },
      { type: 'food', label: 'Food & Restaurants', icon: '🍽️', text: 'Lobster lunch at Le Méditerranée. Sunday brunch at El Djazaïr Hotel — legendary.' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Book the seaview rooms — totally worth +20%. Ramadan menus are exceptional.' },
    ],
    comments: [
      { username: 'lila', content: 'Anniversary trip — the room balcony view is unbeatable.' },
      { username: 'amina', content: 'Best brunch in Algiers, hands down.' },
      { username: 'yacine', content: 'Sunset from the El Aurassi pool deck — pure magic.' },
    ],
    ratings: [
      { username: 'lila', value: 5 },
      { username: 'amina', value: 5 },
      { username: 'yacine', value: 4 },
      { username: 'karlkeating', value: 5 },
      { username: 'sara', value: 4 },
    ],
  },

  /* ---- Saharan Loop Road Trip (Road Trip) ---- */
  {
    ownerUsername: 'walid',
    title: 'Saharan Loop — Béchar, Adrar, Timimoun',
    description:
      "10-day 4x4 road trip across the western Sahara: red dunes of Taghit, Adrar's foggara irrigation, and the red ksars of Timimoun.",
    location: 'Béchar → Adrar → Timimoun',
    region: 'Sahara',
    country: 'Algeria',
    coverPhoto: img('1469854523086-cc02fe5d8800', 'w=1600&q=80'),
    budget: 850,
    categorySlug: 'road-trip',
    media: [
      { mediaUrl: img('1469854523086-cc02fe5d8800'), caption: 'Saharan road' },
      { mediaUrl: img('1672575946268-b07d6719a451'), caption: 'Red dunes of Taghit' },
      { mediaUrl: img('1547036967-23d11aacaee0'), caption: 'Timimoun ksar' },
      { mediaUrl: img('1714313164992-4c33788bd6f7'), caption: 'Long sahara highway' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: '4x4 rental ~12,000 DZD/day. Fuel cheap (~45 DZD/L). Auberge Saharienne ~7000 DZD/night.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🛣️',
        text: 'Taghit dunes, Béchar Mémorial, Adrar foggara system, Timimoun red town, Ksar of Beni Abbès.',
        locations: ['Taghit', 'Béchar', 'Adrar', 'Timimoun', 'Beni Abbès'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'You need a tourism permit for some segments. Travel in convoy. Carry 2x water reserves and a satellite phone.' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'October to March only. Avoid summer (>50°C). Tank up at every station.' },
    ],
    comments: [
      { username: 'karim', content: 'Bucket list trip done. The colors of Timimoun are unreal.' },
      { username: 'amina', content: 'The foggara of Adrar are an engineering wonder. Centuries old!' },
      { username: 'yacine', content: 'My photographs from this trip won an award. Magic light.' },
    ],
    ratings: [
      { username: 'karim', value: 5 },
      { username: 'amina', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Adventure: Sandboarding & Climbing (Adventure) ---- */
  {
    ownerUsername: 'karim',
    title: 'Sandboarding Taghit & Climbing the Hoggar',
    description:
      "Adrenaline 7-day trip: sandboard down 60m red dunes in Taghit, then helicopter to Tamanrasset and climb volcanic peaks of the Hoggar.",
    location: 'Taghit & Hoggar',
    region: 'Sahara',
    country: 'Algeria',
    coverPhoto: img('1551632811-561732d1e306', 'w=1600&q=80'),
    budget: 920,
    categorySlug: 'adventure',
    media: [
      { mediaUrl: img('1551632811-561732d1e306'), caption: 'Adventure mode' },
      { mediaUrl: img('1672575946268-b07d6719a451'), caption: 'Sandboard slope' },
      { mediaUrl: img('1631995390084-cb82295cd2c0'), caption: 'Hoggar climb' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Sandboard rental 1500 DZD/day. Climbing guide for Hoggar 15,000 DZD/day.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏂',
        text: 'Erg Occidental dunes, Mont Tahat (2918m), Hoggar volcanic plugs, Atakor plateau.',
        locations: ['Erg Occidental', 'Mont Tahat', 'Atakor', 'Assekrem'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Climbing requires good fitness — altitude + heat. Bring crash pad for sandboarding.' },
    ],
    comments: [
      { username: 'walid', content: 'Best mix of action + scenery. Recommended.' },
      { username: 'lila', content: 'Sandboarding in Taghit is so much fun. Falling never hurt so good.' },
      { username: 'yacine', content: 'Tahat at sunrise — speechless.' },
    ],
    ratings: [
      { username: 'walid', value: 5 },
      { username: 'lila', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'amina', value: 4 },
    ],
  },

  /* ---- El Kala National Park (Wildlife & Safari) ---- */
  {
    ownerUsername: 'sara',
    title: 'El Kala National Park — Lakes & Flamingos',
    description:
      "On the Tunisian border: cork oak forests, four lakes, pink flamingos, otters, and the Mediterranean wetlands UNESCO biosphere.",
    location: 'El Kala, El Tarf',
    region: 'El Tarf',
    country: 'Algeria',
    coverPhoto: img('1547036967-23d11aacaee0', 'w=1600&q=80'),
    budget: 280,
    categorySlug: 'wildlife',
    media: [
      { mediaUrl: img('1547036967-23d11aacaee0'), caption: 'Wetland panorama' },
      { mediaUrl: img('1535941339077-2dd1c7963098'), caption: 'Pink flamingos' },
      { mediaUrl: img('1505228395891-9a51e7e86bf6'), caption: 'Cork oak coastal forest' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Park entry 200 DZD. Birdwatching guide 4000 DZD/half-day.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🦩',
        text: 'Lake Oubeira, Lake Tonga (flamingos), Cap Roux cliffs, Brabtia natural reserve.',
        locations: ['Lake Oubeira', 'Lake Tonga', 'Cap Roux', 'Brabtia Reserve'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Mosquitoes near lakes — bring repellent. Some zones require a permit.' },
      { type: 'extra', label: 'Extra Tips', icon: '🦆', text: 'Best birdwatching season Nov-March (migration peak).' },
    ],
    comments: [
      { username: 'amina', content: 'Saw 2000+ flamingos in one morning at Lake Tonga. Insane.' },
      { username: 'karim', content: 'Underrated park. Algeria\'s answer to the Camargue.' },
      { username: 'walid', content: 'Bring binoculars — you\'ll thank me.' },
    ],
    ratings: [
      { username: 'amina', value: 5 },
      { username: 'karim', value: 5 },
      { username: 'walid', value: 5 },
      { username: 'lila', value: 4 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Algiers→Marseille ferry (Cruise) ---- */
  {
    ownerUsername: 'lila',
    title: 'Algiers → Marseille — Mediterranean Ferry',
    description:
      "Slow travel with Algérie Ferries: 22h crossing from Algiers harbor to Marseille. Cabins, sunset on deck, the white walls of Algiers fading at dawn.",
    location: 'Port of Algiers',
    region: 'Mediterranean',
    country: 'Algeria',
    coverPhoto: img('1548574505-5e239809ee19', 'w=1600&q=80'),
    budget: 350,
    categorySlug: 'cruise',
    media: [
      { mediaUrl: img('1548574505-5e239809ee19'), caption: 'Ferry deck' },
      { mediaUrl: img('1499678329028-101435549a4e'), caption: 'Bay of Algiers leaving' },
      { mediaUrl: img('1530841377377-3ff06c0ca713'), caption: 'Mediterranean blue' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Pullman seat ~28,000 DZD return, cabin 4-berth ~52,000 DZD. Vehicle +30,000 DZD.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '⛴️',
        text: 'Top deck for departure, Pacha Mosque view leaving, Cagliari sunrise stop sometimes.',
        locations: ['Algiers Port', 'Marseille Port', 'Top Deck'],
      },
      { type: 'food', label: 'Food & Restaurants', icon: '🍽️', text: 'On-board buffet OK but bring snacks — long crossing. Coffee is acceptable.' },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Book 2 months early for summer. Sea can get rough Nov-Feb.' },
    ],
    comments: [
      { username: 'rania', content: 'The slow approach to Marseille at sunrise made me cry — felt like Camus.' },
      { username: 'yacine', content: 'Best of both worlds. Took my car to Provence.' },
    ],
    ratings: [
      { username: 'rania', value: 5 },
      { username: 'yacine', value: 4 },
      { username: 'amina', value: 4 },
      { username: 'karlkeating', value: 4 },
    ],
  },

  /* ---- Timgad International Festival (Festival) ---- */
  {
    ownerUsername: 'amina',
    title: 'Timgad International Festival — Music in the Roman Theater',
    description:
      "Every July: 5 nights of music in the 2000-year-old theater of Thamugadi. Algerian Raï, Andalusian malouf, and big international names under the stars.",
    location: 'Timgad, Batna',
    region: 'Aurès',
    country: 'Algeria',
    coverPhoto: img('1492684223066-81342ee5ff30', 'w=1600&q=80'),
    budget: 200,
    categorySlug: 'festival',
    media: [
      { mediaUrl: img('1492684223066-81342ee5ff30'), caption: 'Festival lights' },
      { mediaUrl: img('1414235077428-338989a2e8c0'), caption: 'Concert crowd' },
      { mediaUrl: img('1552832230-c0197dd311b5'), caption: 'Roman theater stage' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Festival pass 5 nights ~3000 DZD. Hotels in Batna 6000-12,000 DZD/night during festival.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🎶',
        text: 'Opening night ceremony, Cheb Khaled night, Souad Massi Andalusian set, closing fireworks.',
        locations: ['Timgad Theater', 'Festival village', 'Mosaics museum'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Theater seats are stone — bring a cushion. Cool at night even in July.' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Combine with Djemila day-trip. Book hotels in Sétif or Batna 3+ months ahead.' },
    ],
    comments: [
      { username: 'sara', content: 'The acoustics in the Roman theater are unreal. Listening to Raï there is goosebumps.' },
      { username: 'rania', content: 'Worth the trip from Algiers, even just for one night.' },
      { username: 'yacine', content: 'My yearly tradition. Closing fireworks over the ruins — magic.' },
    ],
    ratings: [
      { username: 'sara', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'karim', value: 5 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Hammam Meskhoutine Thermal Springs (Wellness & Spa) ---- */
  {
    ownerUsername: 'rania',
    title: 'Hammam Meskhoutine — Algeria\'s Hot Springs',
    description:
      "The hottest spring in Africa (98°C) cascading down travertine terraces. Thermal baths, mineral pools and a wellness retreat in the Guelma countryside.",
    location: 'Hammam Meskhoutine, Guelma',
    region: 'Guelma',
    country: 'Algeria',
    coverPhoto: img('1540555700478-4be289fbecef', 'w=1600&q=80'),
    budget: 180,
    categorySlug: 'wellness',
    media: [
      { mediaUrl: img('1540555700478-4be289fbecef'), caption: 'Thermal pool' },
      { mediaUrl: img('1505228395891-9a51e7e86bf6'), caption: 'Travertine cascades' },
      { mediaUrl: img('1414235077428-338989a2e8c0'), caption: 'Spa massage room' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Day pass ~1500 DZD. Spa hotel 5000-8500 DZD/night. Massage 2500 DZD.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '♨️',
        text: 'Travertine cascades, family hammam pools, mineral mud bath, the petrified wedding rocks.',
        locations: ['Travertine Cascades', 'Hammam baths', 'Wedding Rocks'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Water source is 98°C — DO NOT touch directly. Stay in the cooled pools.' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Combine with Djemila visit (1h drive). Book the hammam early Friday afternoons.' },
    ],
    comments: [
      { username: 'sara', content: 'My back never felt better. Skip the European spa — come here.' },
      { username: 'amina', content: 'The colored travertines are surreal. Like nowhere else.' },
      { username: 'lila', content: 'My mother took me here as a kid. Magic place.' },
    ],
    ratings: [
      { username: 'sara', value: 5 },
      { username: 'amina', value: 5 },
      { username: 'lila', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Habibas Islands (Island Hopping) ---- */
  {
    ownerUsername: 'lila',
    title: 'Habibas Islands — Oran\'s Hidden Reserve',
    description:
      "A boat day trip from the port of Oran to the protected Habibas Islands: black volcanic rocks, turquoise water, snorkeling and the famous lighthouse.",
    location: 'Habibas Islands, Oran',
    region: 'Oran',
    country: 'Algeria',
    coverPhoto: img('1505228395891-9a51e7e86bf6', 'w=1600&q=80'),
    budget: 150,
    categorySlug: 'island-hopping',
    media: [
      { mediaUrl: img('1505228395891-9a51e7e86bf6'), caption: 'Habibas approach' },
      { mediaUrl: img('1530841377377-3ff06c0ca713'), caption: 'Black volcanic cliffs' },
      { mediaUrl: img('1628025378093-96b9479032b6'), caption: 'Turquoise lagoon' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: 'Boat day-trip from Oran ~6000 DZD/person. Snorkel rental 800 DZD.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🏝️',
        text: 'Habibas lighthouse, north cliffs snorkeling, Île Plane day-stop, Cap Falcon panorama.',
        locations: ['Habibas Lighthouse', 'Île Plane', 'Cap Falcon'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Marine reserve — no touching, no fishing, no sunscreen with oxybenzone. Strong sun.' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Best months: May, June, September. July-August boats are packed.' },
    ],
    comments: [
      { username: 'rania', content: 'Like a piece of Greece dropped in Oran. Stunning.' },
      { username: 'karim', content: 'Snorkeling here is incredible — saw barracudas and grouper.' },
      { username: 'yacine', content: 'The light on the black rocks at golden hour 🤌' },
    ],
    ratings: [
      { username: 'rania', value: 5 },
      { username: 'karim', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'karlkeating', value: 5 },
    ],
  },

  /* ---- Algeria Grand Tour 3 weeks (Backpacking) ---- */
  {
    ownerUsername: 'walid',
    title: 'Algeria Grand Tour — 3-Week Backpacker Loop',
    description:
      "From Algiers to the deep Sahara and back: 21 days hostels, trains, louages and a 4x4. The complete Algerian experience for the budget traveler.",
    location: 'Algeria nationwide',
    region: 'Multiple regions',
    country: 'Algeria',
    coverPhoto: img('1488646953014-85cb44e25828', 'w=1600&q=80'),
    budget: 1200,
    categorySlug: 'backpacking',
    media: [
      { mediaUrl: img('1488646953014-85cb44e25828'), caption: 'Backpack ready' },
      { mediaUrl: img('1631995872935-d964797502e0'), caption: 'Casbah stop' },
      { mediaUrl: img('1664490283761-ee8376af809b'), caption: 'Constantine bridges' },
      { mediaUrl: img('1714313164992-4c33788bd6f7'), caption: 'Tassili end of route' },
    ],
    guides: [
      { type: 'budget', label: 'Budget Info', icon: '💰', text: '~6000 DZD/day all-in (hostel + 3 meals + transport). Train Algiers→Constantine 1200 DZD.' },
      {
        type: 'mustvisit', label: 'Must-Visit', icon: '🎒',
        text: 'Casbah → Tipaza → Tlemcen → Oran → Béchar → Taghit → Ghardaïa → Tamanrasset → Djanet → Constantine → Annaba → Algiers.',
        locations: ['Algiers', 'Tipaza', 'Tlemcen', 'Oran', 'Taghit', 'Ghardaïa', 'Tamanrasset', 'Djanet', 'Constantine', 'Annaba'],
      },
      { type: 'warnings', label: 'Warnings', icon: '⚠️', text: 'Tourist visa + Sahara permits required. Plan permits for Tassili 6 weeks ahead.' },
      { type: 'extra', label: 'Extra Tips', icon: '💡', text: 'Best season Oct-March. Learn 20 words of Arabic — locals love it.' },
      { type: 'food', label: 'Food & Restaurants', icon: '🍽️', text: 'Eat at small local cafés (gargottes) — best value. Try chorba in winter, brik year-round.' },
    ],
    comments: [
      { username: 'karim', content: 'This is THE itinerary for first-time visitors. Saved!' },
      { username: 'amina', content: 'Add a side trip to Béni Abbès oasis if you have an extra day.' },
      { username: 'sara', content: 'Did this in 2024. Best month of my life. Do not skip Tlemcen.' },
      { username: 'rania', content: 'Don\'t miss the train Algiers→Oran — old colonial line, beautiful coast.' },
    ],
    ratings: [
      { username: 'karim', value: 5 },
      { username: 'amina', value: 5 },
      { username: 'sara', value: 5 },
      { username: 'rania', value: 5 },
      { username: 'lila', value: 5 },
      { username: 'yacine', value: 5 },
      { username: 'karlkeating', value: 5 },
    ],
  },
];

/* -----------------------------------------------------------
 * MAIN
 * ----------------------------------------------------------- */
async function main() {
  console.log('→ Seeding categories…');
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
  }

  console.log('→ Seeding users…');
  const password = await bcrypt.hash('password123', 10);
  const userMap = new Map<string, number>();
  for (const u of USERS) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        fullName: u.fullName,
        bio: u.bio,
        profilePicture: u.profilePicture,
        username: u.username,
      },
      create: {
        email: u.email,
        username: u.username,
        password,
        fullName: u.fullName,
        bio: u.bio,
        profilePicture: u.profilePicture,
      },
    });
    userMap.set(u.username, created.id);
  }

  console.log('→ Seeding follows…');
  const followPairs: [string, string][] = [
    ['karlkeating', 'yacine'],
    ['karlkeating', 'amina'],
    ['karlkeating', 'walid'],
    ['karlkeating', 'rania'],
    ['yacine', 'karlkeating'],
    ['yacine', 'amina'],
    ['yacine', 'rania'],
    ['amina', 'sara'],
    ['amina', 'karim'],
    ['amina', 'yacine'],
    ['walid', 'karim'],
    ['walid', 'yacine'],
    ['lila', 'rania'],
    ['lila', 'karim'],
    ['rania', 'lila'],
    ['rania', 'amina'],
    ['karim', 'walid'],
    ['karim', 'amina'],
    ['sara', 'amina'],
    ['sara', 'yacine'],
    // Make demo user (karlkeating) more popular
    ['amina', 'karlkeating'],
    ['walid', 'karlkeating'],
    ['lila', 'karlkeating'],
    ['rania', 'karlkeating'],
    ['karim', 'karlkeating'],
    ['sara', 'karlkeating'],
    // A couple more cross-follows
    ['lila', 'sara'],
    ['rania', 'walid'],
    ['karim', 'lila'],
  ];
  for (const [f, t] of followPairs) {
    const followerId = userMap.get(f);
    const followingId = userMap.get(t);
    if (!followerId || !followingId) continue;
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });
  }

  console.log('→ Seeding trips, guides, media, comments, ratings…');
  for (const seed of TRIPS) {
    const category = await prisma.category.findUnique({ where: { slug: seed.categorySlug } });
    if (!category) continue;
    const ownerId = userMap.get(seed.ownerUsername);
    if (!ownerId) continue;

    const existing = await prisma.trip.findFirst({
      where: { title: seed.title, userId: ownerId },
    });

    const tripData = {
      description: seed.description,
      location: seed.location,
      region: seed.region,
      country: seed.country,
      coverPhoto: seed.coverPhoto,
      budget: seed.budget,
      categoryId: category.id,
    };

    const trip = existing
      ? await prisma.trip.update({ where: { id: existing.id }, data: tripData })
      : await prisma.trip.create({ data: { ...tripData, title: seed.title, userId: ownerId } });
    const tripId = trip.id;

    // media
    await prisma.tripMedia.deleteMany({ where: { tripId } });
    for (const m of seed.media) {
      await prisma.tripMedia.create({
        data: { tripId, mediaUrl: m.mediaUrl, mediaType: 'image', caption: m.caption },
      });
    }

    // guides
    await prisma.tripGuide.deleteMany({ where: { tripId } });
    for (const g of seed.guides) {
      await prisma.tripGuide.create({
        data: {
          tripId,
          type: g.type,
          label: g.label,
          icon: g.icon,
          text: g.text,
          locations: JSON.stringify(g.locations ?? []),
        },
      });
    }

    // comments
    if (seed.comments?.length) {
      await prisma.comment.deleteMany({ where: { tripId } });
      for (const c of seed.comments) {
        const uid = userMap.get(c.username);
        if (!uid) continue;
        await prisma.comment.create({ data: { tripId, userId: uid, content: c.content } });
      }
    }

    // ratings
    if (seed.ratings?.length) {
      for (const r of seed.ratings) {
        const uid = userMap.get(r.username);
        if (!uid) continue;
        await prisma.rating.upsert({
          where: { userId_tripId: { userId: uid, tripId } },
          create: { tripId, userId: uid, value: r.value },
          update: { value: r.value },
        });
      }
    }
  }

  console.log('→ Filling comments (every trip gets at least 4 comments)…');
  const FALLBACK_COMMENTS = [
    "Saving this for my next trip — looks unreal!",
    "I went last year, totally agree with the guide.",
    "Algeria really is a hidden gem. More travelers should know about this.",
    "The photos do not do it justice. So much better in person.",
    "Bookmarking. Need to add this to my itinerary.",
    "Beautiful spot. The locals make it even better.",
    "One of the best places I have visited recently.",
  ];
  const tripsForComments = await prisma.trip.findMany({});
  const usersForComments = Array.from(userMap.entries());
  for (const t of tripsForComments) {
    const have = await prisma.comment.count({ where: { tripId: t.id } });
    if (have >= 4) continue;
    let added = have;
    let i = 0;
    for (const [, uid] of usersForComments) {
      if (added >= 4) break;
      if (uid === t.userId) continue;
      // Skip if this user already commented on this trip.
      const exists = await prisma.comment.findFirst({ where: { tripId: t.id, userId: uid } });
      if (exists) continue;
      const content = FALLBACK_COMMENTS[(t.id + i) % FALLBACK_COMMENTS.length];
      await prisma.comment.create({ data: { tripId: t.id, userId: uid, content } });
      added += 1;
      i += 1;
    }
  }

  console.log('→ Filling ratings (every trip gets ratings from at least 5 users)…');
  const allTrips = await prisma.trip.findMany({});
  const allUsers = Array.from(userMap.entries()); // [username, id]
  const FILLER_VALUES = [5, 5, 5, 4, 5, 4, 5, 4, 3, 5];
  for (const t of allTrips) {
    const existing = await prisma.rating.findMany({ where: { tripId: t.id }, select: { userId: true } });
    const existingIds = new Set(existing.map((r) => r.userId));
    let i = 0;
    for (const [, uid] of allUsers) {
      if (existingIds.has(uid)) continue;
      // Skip the trip owner — owners shouldn't rate their own trip.
      if (uid === t.userId) continue;
      // Stop once we reach 6 total ratings.
      if (existingIds.size >= 6) break;
      const value = FILLER_VALUES[(t.id + i) % FILLER_VALUES.length] ?? 5;
      await prisma.rating.upsert({
        where: { userId_tripId: { userId: uid, tripId: t.id } },
        create: { tripId: t.id, userId: uid, value },
        update: {},
      });
      existingIds.add(uid);
      i += 1;
    }
  }

  console.log('→ Seeding saved trips for demo user…');
  const demoUserId = userMap.get('karlkeating')!;
  const sampleTrips = await prisma.trip.findMany({ where: { NOT: { userId: demoUserId } }, take: 10 });
  const visitedComments = [
    'Amazing trip, already planning a return!',
    'Did this last summer — loved every minute.',
    'Better than I expected. Highly recommend.',
    'A real eye-opener — Algeria is unbelievable.',
  ];
  for (let i = 0; i < sampleTrips.length; i += 1) {
    const t = sampleTrips[i];
    const visited = i % 3 === 1;
    await prisma.savedTrip.upsert({
      where: { userId_tripId: { userId: demoUserId, tripId: t.id } },
      create: {
        userId: demoUserId,
        tripId: t.id,
        pinned: i < 2,
        visited,
        visitDate: visited ? new Date(2025, (i % 11), 5 + (i % 20)) : null,
        comment: visited ? visitedComments[i % visitedComments.length] : '',
      },
      update: {},
    });
  }

  const counts = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    trips: await prisma.trip.count(),
    media: await prisma.tripMedia.count(),
    guides: await prisma.tripGuide.count(),
    comments: await prisma.comment.count(),
    ratings: await prisma.rating.count(),
    follows: await prisma.follow.count(),
    saved: await prisma.savedTrip.count(),
  };
  console.log('✓ Seed complete:', counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
