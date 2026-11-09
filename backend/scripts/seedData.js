// Sample content so the site looks complete on first run. Everything is editable in the admin panel.
// Images are Unsplash placeholders - replace them with your resort's own photography via the admin panel.
const img = (id, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTOS = {
  beach: 'photo-1507525428034-b723cf961d3e',
  beach2: 'photo-1519046904884-53103b34b206',
  ocean: 'photo-1505118380757-91f5f5632de0',
  resort: 'photo-1571896349842-33c89424de2d',
  pool: 'photo-1540541338287-41700207dee6',
  pool2: 'photo-1520250497591-112f2f40a3f4',
  room: 'photo-1582719508461-905c673771fd',
  room2: 'photo-1445019980597-93fa8acb246c',
  suite: 'photo-1566073771259-6a8506099945',
  villa: 'photo-1602002418082-a4443e081dd1',
  restaurant: 'photo-1414235077428-338989a2e8c0',
  dining: 'photo-1517248135467-4c7edcad34c4',
  dive: 'photo-1544551763-46a013bb70d5',
  kayak: 'photo-1472745942893-4b9f730c7668',
};

const packages = [
  {
    name: 'Deluxe Ocean View Room', category: 'room',
    description: 'A light-filled 45 m² retreat with a private balcony facing the Indian Ocean. Wake to the sound of waves from a king-size bed dressed in organic linens.',
    price: 189, price_note: 'per night', image_url: img(PHOTOS.room),
    features: ['Private ocean-view balcony', 'King or twin beds', 'Daily breakfast for two', 'Rain shower & soaking bath', 'High-speed Wi-Fi', 'Complimentary minibar water & coffee'],
    special_offer: 'Stay 4 nights, pay for 3', is_featured: 1, sort_order: 1,
  },
  {
    name: 'Honeymoon Package', category: 'package',
    description: 'Three romantic nights in a beachfront suite with candlelit dinner on the sand, couples spa treatment and a sunset catamaran cruise.',
    price: 890, price_note: 'per couple / 3 nights', image_url: img(PHOTOS.suite),
    features: ['Beachfront suite with plunge pool', 'Private candlelit beach dinner', '90-minute couples massage', 'Sunset catamaran cruise', 'Flower-petal turndown & champagne', 'Late checkout until 4 PM'],
    special_offer: 'Free photo session for the couple', is_featured: 1, sort_order: 2,
  },
  {
    name: 'Family Vacation Package', category: 'package',
    description: 'Adjoining family rooms, kids club access and guided activities so everyone makes memories. Five nights of sun, sand and shared adventures.',
    price: 1290, price_note: 'family of 4 / 5 nights', image_url: img(PHOTOS.pool),
    features: ['Two connecting family rooms', 'Daily breakfast & dinner buffet', 'Kids club & splash pool', 'Snorkelling & turtle-watching tour', 'Beach games and bonfire night', 'Airport transfers'],
    special_offer: 'Kids under 6 stay & eat free', is_featured: 1, sort_order: 3,
  },
  {
    name: 'Luxury Villa Experience', category: 'package',
    description: 'Our signature two-bedroom villa with infinity pool, personal butler and chef-prepared dining, steps from a secluded stretch of beach.',
    price: 1450, price_note: 'per villa / 2 nights', image_url: img(PHOTOS.villa),
    features: ['Two-bedroom villa, 180 m²', 'Private infinity pool', 'Dedicated butler 24/7', 'In-villa chef dinner', 'Spa treatments for two', 'Private chauffeur transfers'],
    special_offer: 'Complimentary sunset sail', is_featured: 0, sort_order: 4,
  },
  {
    name: 'Beachfront Suite', category: 'room',
    description: 'Open the doors and step onto the sand. A spacious suite with a separate living area, outdoor daybed and uninterrupted horizon views.',
    price: 289, price_note: 'per night', image_url: img(PHOTOS.room2),
    features: ['Direct beach access', 'Separate lounge area', 'Outdoor daybed terrace', 'Daily breakfast for two', 'Nespresso machine', 'Evening canapés'],
    special_offer: null, is_featured: 0, sort_order: 5,
  },
];

const promotions = [
  { title: 'Early Bird Summer Escape', category: 'seasonal', description: 'Book early and save on our sun-soaked summer season. Includes breakfast daily and a complimentary sunset cocktail.', discount_label: '25% OFF', image_url: img(PHOTOS.beach2, 1600), valid_from: '2026-11-01', valid_until: '2027-03-31' },
  { title: 'Festive Season Celebration', category: 'holiday', description: 'Ring in the holidays by the sea with a gala dinner, live music on the beach and fireworks over the bay.', discount_label: '15% OFF', image_url: img(PHOTOS.dining, 1600), valid_from: '2026-12-15', valid_until: '2027-01-05' },
  { title: 'Wedding & Vow Renewal Package', category: 'event', description: 'A beachfront ceremony for up to 40 guests including floral arch, sound system, cake and a night in our bridal suite.', discount_label: 'Free Bridal Suite', image_url: img(PHOTOS.resort, 1600), valid_from: null, valid_until: null },
  { title: 'Midweek Wellness Retreat', category: 'seasonal', description: 'Sunday to Thursday stays include daily yoga at sunrise, one spa treatment and a healthy tasting menu.', discount_label: '3rd Night Free', image_url: img(PHOTOS.pool2, 1600), valid_from: '2026-11-01', valid_until: '2027-02-28' },
];

const gallery = [
  ['Deluxe room with ocean view', 'rooms', PHOTOS.room], ['Beachfront suite', 'rooms', PHOTOS.room2], ['Signature villa', 'rooms', PHOTOS.villa], ['Suite bedroom', 'rooms', PHOTOS.suite],
  ['Golden hour on the beach', 'beach', PHOTOS.beach], ['Secluded cove', 'beach', PHOTOS.beach2], ['Turquoise waters', 'beach', PHOTOS.ocean],
  ['Infinity pool at sunset', 'pool', PHOTOS.pool], ['Poolside loungers', 'pool', PHOTOS.pool2], ['Resort and gardens', 'pool', PHOTOS.resort],
  ['The Tide restaurant', 'restaurant', PHOTOS.restaurant], ['Candlelit dining', 'restaurant', PHOTOS.dining],
  ['Snorkelling excursion', 'activities', PHOTOS.dive], ['Sunrise kayaking', 'activities', PHOTOS.kayak],
].map(([title, category, id]) => ({ title, category, image_url: img(id, 1200) }));

const j = (v) => JSON.stringify(v);

const content = {
  hotel_name: 'Ocean Paradise Resort',
  tagline: 'Where the horizon becomes your home',
  hero_image: img(PHOTOS.beach, 2000),
  hero_subtitle: 'A luxury beachfront sanctuary of golden sand, crystal water and effortless elegance.',
  intro_title: 'A private stretch of paradise',
  intro_text: 'Nestled along a pristine crescent of white sand, Ocean Paradise Resort blends barefoot luxury with warm, personal hospitality. Our 64 rooms, suites and villas open to the sea, and every day offers something new: sunrise yoga, fresh seafood suppers, coral reef snorkelling or simply an unhurried afternoon by the pool.',
  intro_image: img(PHOTOS.resort, 1200),
  stat_1: '64|Rooms, suites & villas', stat_2: '300m|Of private beach', stat_3: '4.9|Guest rating', stat_4: '15+|Years of hospitality',
  highlights: j([
    { icon: '🏖️', title: 'Private Beach', text: 'Three hundred metres of soft white sand reserved for our guests.' },
    { icon: '🌅', title: 'Sunset Views', text: 'Every room faces the sea for front-row seats to golden hour.' },
    { icon: '🍽️', title: 'Seaside Dining', text: 'Fresh-caught seafood and island flavours served by the waves.' },
    { icon: '🧖', title: 'Ocean Spa', text: 'Rejuvenating treatments in open-air pavilions above the water.' },
    { icon: '🤿', title: 'Water Adventures', text: 'Snorkelling, diving, kayaking and sunset cruises on our doorstep.' },
    { icon: '🏊', title: 'Infinity Pool', text: 'A 40-metre pool that melts into the horizon.' },
  ]),
  reviews: j([
    { name: 'Amelia R.', country: 'United Kingdom', rating: 5, text: 'The most beautiful beach I have ever stayed on. Staff remembered our names from day one and the sunset dinners were unforgettable.' },
    { name: 'Hiroshi & Mei T.', country: 'Japan', rating: 5, text: 'We chose the honeymoon package and it was perfect in every detail. Peaceful, romantic and impeccably run.' },
    { name: 'The Fernandez Family', country: 'Spain', rating: 5, text: 'Our kids did not want to leave! The kids club and snorkelling trips were fantastic, and the room was spotless.' },
  ]),
  story_title: 'Our Story',
  story_text: 'Ocean Paradise began in 2009 as a family dream: a handful of beach cottages built by local craftsmen on an empty bay. Guests came for the sea and returned for the welcome. Today we are a 64-key resort, but we have kept the spirit of those first cottages: handmade details, honest hospitality and deep respect for the coastline we call home.',
  about_image: img(PHOTOS.beach2, 1200),
  mission: 'To create restorative, authentic seaside experiences that delight our guests while protecting the coast and supporting the community that welcomes us.',
  vision: 'To be recognised as the most loved beachfront retreat in the region, a place where hospitality, nature and sustainability thrive together.',
  why_choose: j([
    { title: 'Beachfront Location', text: 'Step from your room onto powdery sand in under a minute.' },
    { title: 'Personal Service', text: 'A 1:1 staff-to-room ratio means every guest feels looked after.' },
    { title: 'Sustainable Luxury', text: 'Solar hot water, reef-safe policies and locally sourced menus.' },
    { title: 'Unforgettable Experiences', text: 'From turtle-watching to candlelit beach dinners, we curate moments that last.' },
  ]),
  facilities: j([
    { icon: '🏊', title: 'Infinity Pool', text: 'Heated pool with swim-up bar and kids splash area.' },
    { icon: '🍴', title: '2 Restaurants & Bar', text: 'The Tide (seafood) and Palm Terrace (all-day dining).' },
    { icon: '💆', title: 'Spa & Wellness', text: 'Massage, yoga pavilion and fitness studio.' },
    { icon: '📶', title: 'Free Wi-Fi', text: 'Fast fibre internet throughout the resort.' },
    { icon: '🚤', title: 'Water Sports', text: 'Kayaks, paddleboards, snorkel gear and diving centre.' },
    { icon: '🧒', title: 'Kids Club', text: 'Supervised daily activities for ages 4–12.' },
    { icon: '🚐', title: 'Airport Transfers', text: 'Comfortable private transfers on request.' },
    { icon: '🛎️', title: '24-hour Concierge', text: 'Tours, celebrations and local tips, any time.' },
  ]),
  contact_address: '123 Coastal Road, Mirissa, Southern Province, Sri Lanka',
  contact_phone: '+94 41 222 3344',
  contact_email: 'hello@oceanparadise.example',
  contact_hours: 'Reception & concierge open 24 hours',
  map_query: 'Mirissa Beach, Sri Lanka',
  attractions: j([
    { name: 'Mirissa Whale Watching', distance: '2 km', text: 'Blue whales and dolphins from November to April.' },
    { name: 'Coconut Tree Hill', distance: '3 km', text: 'Iconic sunrise viewpoint over the bay.' },
    { name: 'Galle Fort (UNESCO)', distance: '35 km', text: 'Dutch-era ramparts, cafés and boutiques.' },
    { name: 'Yala National Park', distance: '90 km', text: 'Safari for leopards and elephants.' },
  ]),
  social_facebook: 'https://facebook.com/',
  social_instagram: 'https://instagram.com/',
  social_twitter: 'https://x.com/',
  social_youtube: 'https://youtube.com/',
  currency_symbol: '$',
  footer_text: 'A luxury beachfront retreat where every wave brings calm.',
};

module.exports = { packages, promotions, gallery, content };
