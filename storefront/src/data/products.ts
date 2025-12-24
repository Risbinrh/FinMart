// Dummy product data based on Fish-Catalog.md

export interface Product {
  id: string;
  name: string;
  tamilName: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  freshness: string;
  description: string;
  bestFor: string[];
  nutritionalInfo: {
    calories: string;
    protein: string;
    fat: string;
    omega3: string;
  };
  cleaningOptions: {
    id: string;
    name: string;
    tamilName: string;
    extraPrice: number;
  }[];
  tags: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  tamilName: string;
  slug: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Sea Fish',
    tamilName: 'கடல் மீன்',
    slug: 'sea-fish',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
    productCount: 33,
  },
  {
    id: '2',
    name: 'River Fish',
    tamilName: 'ஆற்று மீன்',
    slug: 'river-fish',
    image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=200&h=200&fit=crop',
    productCount: 15,
  },
  {
    id: '3',
    name: 'Prawns',
    tamilName: 'இறால்',
    slug: 'prawns',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&h=200&fit=crop',
    productCount: 10,
  },
  {
    id: '4',
    name: 'Crabs',
    tamilName: 'நண்டு',
    slug: 'crabs',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=200&h=200&fit=crop',
    productCount: 8,
  },
  {
    id: '5',
    name: 'Squid',
    tamilName: 'கணவாய்',
    slug: 'squid',
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=200&h=200&fit=crop',
    productCount: 4,
  },
  {
    id: '6',
    name: 'Dried Fish',
    tamilName: 'கருவாடு',
    slug: 'dried-fish',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    productCount: 8,
  },
];

export const cleaningOptions = [
  { id: 'whole', name: 'Whole', tamilName: 'முழுமையாக', extraPrice: 0 },
  { id: 'cleaned', name: 'Cleaned', tamilName: 'சுத்தம்', extraPrice: 20 },
  { id: 'cut', name: 'Cut Pieces', tamilName: 'துண்டுகள்', extraPrice: 30 },
  { id: 'fillet', name: 'Fillet', tamilName: 'எலும்பு நீக்கம்', extraPrice: 50 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Seer Fish',
    tamilName: 'வஞ்சிரம்',
    category: 'Sea Fish',
    categorySlug: 'sea-fish',
    price: 750,
    originalPrice: 850,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=600&h=400&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 234,
    availability: 'in-stock',
    freshness: 'Caught today at 4:00 AM',
    description: 'Premium Seer Fish caught fresh from the Bay of Bengal. Known for its firm texture and rich taste, perfect for frying and grilling.',
    bestFor: ['Fry', 'Grill', 'Curry', 'Tandoori'],
    nutritionalInfo: {
      calories: '109 kcal',
      protein: '21g',
      fat: '2.5g',
      omega3: '0.9g',
    },
    cleaningOptions: cleaningOptions,
    tags: ['Premium', 'Best Seller', 'High Protein'],
    isBestSeller: true,
  },
  {
    id: '2',
    name: 'King Fish',
    tamilName: 'நெய்மீன்',
    category: 'Sea Fish',
    categorySlug: 'sea-fish',
    price: 820,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&h=400&fit=crop',
    ],
    rating: 4.7,
    reviewCount: 189,
    availability: 'in-stock',
    freshness: 'Caught today at 5:00 AM',
    description: 'Premium King Fish with excellent taste and texture. A favorite for special occasions.',
    bestFor: ['Fry', 'Steak', 'Grill'],
    nutritionalInfo: {
      calories: '134 kcal',
      protein: '23g',
      fat: '4.5g',
      omega3: '1.2g',
    },
    cleaningOptions: cleaningOptions,
    tags: ['Premium', 'High Protein'],
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Pomfret (White)',
    tamilName: 'வெள்ளை வாவல்',
    category: 'Sea Fish',
    categorySlug: 'sea-fish',
    price: 650,
    originalPrice: 720,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=600&h=400&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 312,
    availability: 'limited',
    freshness: 'Caught today at 4:30 AM',
    description: 'White Pomfret is one of the most sought-after fish for its delicate flavor and tender meat.',
    bestFor: ['Fry', 'Grill', 'Steam'],
    nutritionalInfo: {
      calories: '96 kcal',
      protein: '19g',
      fat: '2g',
      omega3: '0.7g',
    },
    cleaningOptions: cleaningOptions,
    tags: ['Premium', 'Best Seller'],
    isBestSeller: true,
  },
  {
    id: '4',
    name: 'Red Snapper',
    tamilName: 'சங்கரா மீன்',
    category: 'Sea Fish',
    categorySlug: 'sea-fish',
    price: 520,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1559628376-1f9f4a8b3b0a?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559628376-1f9f4a8b3b0a?w=600&h=400&fit=crop',
    ],
    rating: 4.6,
    reviewCount: 156,
    availability: 'in-stock',
    freshness: 'Caught today at 5:30 AM',
    description: 'Fresh Red Snapper with beautiful red skin and sweet, nutty flavor.',
    bestFor: ['Curry', 'Fry', 'Grill'],
    nutritionalInfo: {
      calories: '100 kcal',
      protein: '20g',
      fat: '1.5g',
      omega3: '0.6g',
    },
    cleaningOptions: cleaningOptions,
    tags: ['Popular'],
  },
  {
    id: '5',
    name: 'Mackerel',
    tamilName: 'அயிலா',
    category: 'Sea Fish',
    categorySlug: 'sea-fish',
    price: 180,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&h=400&fit=crop',
    ],
    rating: 4.5,
    reviewCount: 423,
    availability: 'in-stock',
    freshness: 'Caught today at 3:00 AM',
    description: 'Fresh Mackerel, a staple in South Indian cuisine. Rich in omega-3 and perfect for everyday cooking.',
    bestFor: ['Fry', 'Curry', 'Roast'],
    nutritionalInfo: {
      calories: '205 kcal',
      protein: '19g',
      fat: '13g',
      omega3: '2.6g',
    },
    cleaningOptions: cleaningOptions,
    tags: ['Budget Friendly', 'High Omega-3'],
    isBestSeller: true,
  },
  {
    id: '6',
    name: 'Sardine',
    tamilName: 'மத்தி',
    category: 'Sea Fish',
    categorySlug: 'sea-fish',
    price: 120,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
    ],
    rating: 4.4,
    reviewCount: 567,
    availability: 'in-stock',
    freshness: 'Caught today at 4:00 AM',
    description: 'Fresh Sardines, packed with nutrition. A budget-friendly option with great taste.',
    bestFor: ['Fry', 'Curry'],
    nutritionalInfo: {
      calories: '208 kcal',
      protein: '25g',
      fat: '11g',
      omega3: '1.5g',
    },
    cleaningOptions: cleaningOptions.slice(0, 2),
    tags: ['Budget Friendly', 'High Protein'],
  },
  {
    id: '7',
    name: 'Tiger Prawns',
    tamilName: 'புலி இறால்',
    category: 'Prawns',
    categorySlug: 'prawns',
    price: 780,
    originalPrice: 850,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=400&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 289,
    availability: 'in-stock',
    freshness: 'Caught today at 5:00 AM',
    description: 'Large Tiger Prawns with firm texture and sweet taste. Perfect for grilling and special dishes.',
    bestFor: ['Grill', 'Fry', 'Curry', 'Butter Garlic'],
    nutritionalInfo: {
      calories: '99 kcal',
      protein: '24g',
      fat: '0.3g',
      omega3: '0.5g',
    },
    cleaningOptions: [
      { id: 'whole', name: 'Whole', tamilName: 'முழுமையாக', extraPrice: 0 },
      { id: 'cleaned', name: 'Cleaned & Deveined', tamilName: 'சுத்தம்', extraPrice: 30 },
    ],
    tags: ['Premium', 'Best Seller'],
    isBestSeller: true,
  },
  {
    id: '8',
    name: 'White Prawns',
    tamilName: 'வெள்ளை இறால்',
    category: 'Prawns',
    categorySlug: 'prawns',
    price: 480,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=600&h=400&fit=crop',
    ],
    rating: 4.6,
    reviewCount: 198,
    availability: 'in-stock',
    freshness: 'Caught today at 4:00 AM',
    description: 'Medium-sized white prawns, perfect for everyday cooking and curries.',
    bestFor: ['Curry', 'Fry', 'Biryani'],
    nutritionalInfo: {
      calories: '85 kcal',
      protein: '20g',
      fat: '0.5g',
      omega3: '0.4g',
    },
    cleaningOptions: [
      { id: 'whole', name: 'Whole', tamilName: 'முழுமையாக', extraPrice: 0 },
      { id: 'cleaned', name: 'Cleaned & Deveined', tamilName: 'சுத்தம்', extraPrice: 25 },
    ],
    tags: ['Popular'],
  },
  {
    id: '9',
    name: 'Mud Crab',
    tamilName: 'சதுப்பு நண்டு',
    category: 'Crabs',
    categorySlug: 'crabs',
    price: 650,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&h=400&fit=crop',
    ],
    rating: 4.7,
    reviewCount: 145,
    availability: 'limited',
    freshness: 'Caught today',
    description: 'Large Mud Crabs with sweet, succulent meat. A delicacy for crab lovers.',
    bestFor: ['Curry', 'Pepper Fry', 'Roast'],
    nutritionalInfo: {
      calories: '97 kcal',
      protein: '19g',
      fat: '1.5g',
      omega3: '0.4g',
    },
    cleaningOptions: [
      { id: 'live', name: 'Live', tamilName: 'உயிருடன்', extraPrice: 0 },
      { id: 'cleaned', name: 'Cleaned', tamilName: 'சுத்தம்', extraPrice: 40 },
    ],
    tags: ['Premium', 'Limited'],
  },
  {
    id: '10',
    name: 'Squid',
    tamilName: 'கணவாய்',
    category: 'Squid',
    categorySlug: 'squid',
    price: 380,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=600&h=400&fit=crop',
    ],
    rating: 4.5,
    reviewCount: 123,
    availability: 'in-stock',
    freshness: 'Caught today at 5:30 AM',
    description: 'Fresh Squid with tender texture. Perfect for stir-fries and grilling.',
    bestFor: ['Fry', 'Grill', 'Curry', 'Stir Fry'],
    nutritionalInfo: {
      calories: '92 kcal',
      protein: '18g',
      fat: '1.4g',
      omega3: '0.5g',
    },
    cleaningOptions: [
      { id: 'whole', name: 'Whole', tamilName: 'முழுமையாக', extraPrice: 0 },
      { id: 'cleaned', name: 'Cleaned & Rings', tamilName: 'வளையங்கள்', extraPrice: 30 },
    ],
    tags: ['Popular'],
  },
  {
    id: '11',
    name: 'Rohu',
    tamilName: 'கெண்டை',
    category: 'River Fish',
    categorySlug: 'river-fish',
    price: 220,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=600&h=400&fit=crop',
    ],
    rating: 4.4,
    reviewCount: 234,
    availability: 'in-stock',
    freshness: 'Farm Fresh',
    description: 'Fresh Rohu from local farms. A popular choice for traditional fish curry.',
    bestFor: ['Curry', 'Fry'],
    nutritionalInfo: {
      calories: '97 kcal',
      protein: '17g',
      fat: '2g',
      omega3: '0.3g',
    },
    cleaningOptions: cleaningOptions,
    tags: ['Farm Fresh', 'Budget Friendly'],
  },
  {
    id: '12',
    name: 'Anchovy',
    tamilName: 'நெத்திலி',
    category: 'Sea Fish',
    categorySlug: 'sea-fish',
    price: 150,
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
    ],
    rating: 4.3,
    reviewCount: 345,
    availability: 'in-stock',
    freshness: 'Caught today at 3:30 AM',
    description: 'Small, flavorful anchovies. A staple for South Indian households.',
    bestFor: ['Fry', 'Curry', 'Dry'],
    nutritionalInfo: {
      calories: '131 kcal',
      protein: '20g',
      fat: '5g',
      omega3: '1.4g',
    },
    cleaningOptions: cleaningOptions.slice(0, 2),
    tags: ['Budget Friendly', 'High Calcium'],
    isNewArrival: true,
  },
];

export const featuredProducts = products.filter(p => p.isBestSeller);
export const newArrivals = products.filter(p => p.isNewArrival);
