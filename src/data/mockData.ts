import { Product, AdviceArticle } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  // --- Sex Toys ---
  {
    id: 'st-1',
    name: 'ÙØ¬ÙÙØ¹Ø© Ø§ÙØªØ¯ÙÙÙ Ø§ÙØ²ÙØ¬ÙØ© Ø§ÙÙØ§Ø®Ø±Ø©',
    nameEn: 'Luxury Couple Massage Set',
    link: 'https://www.vexatoys.com/product/luxury-couple-massage-set',
    description: 'ÙØ¬ÙÙØ¹Ø© ÙØ§Ø®Ø±Ø© ØªØ­ØªÙÙ Ø¹ÙÙ Ø²ÙÙØª Ø·Ø¨ÙØ¹ÙØ© ÙØ£Ø¯ÙØ§Øª ØªØ¯ÙÙÙ ÙØµÙÙØ© ÙØ²ÙØ§Ø¯Ø© Ø§ÙÙØ±Ø¨ ÙØªØ­Ø³ÙÙ ØªØ¬Ø±Ø¨Ø© Ø§ÙØ§Ø³ØªØ±Ø®Ø§Ø¡ Ø¨ÙÙ Ø§ÙØ²ÙØ¬ÙÙ. Ø¢ÙÙØ© ØªÙØ§ÙØ§Ù Ø¹ÙÙ Ø§ÙØ¨Ø´Ø±Ø© ÙØªØ¯ÙÙ Ø·ÙÙÙØ§Ù.',
    descriptionEn: 'A luxury set containing natural oils and massage tools designed to enhance intimacy and relaxation. 100% body-safe and long-lasting.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1601924991987-3976334a1d5d?q=80&w=500&auto=format&fit=crop',
    category: 'Sex Toys',
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    isNew: true
  },
  {
    id: 'st-2',
    name: 'Ø¬ÙØ§Ø² Ø§ÙØªØ­ÙÙØ² Ø§ÙÙØ¨Ø¶Ù Ø§ÙÙØ²Ø¯ÙØ¬',
    nameEn: 'Dual Pulse Stimulation Device',
    link: 'https://www.vexatoys.com/product/dual-pulse-stimulation-device',
    description: 'Ø¬ÙØ§Ø² ØªØ­ÙÙØ² Ø«ÙØ§Ø¦Ù Ø§ÙÙÙØ¹ÙÙ Ø¨ØªÙÙÙØ© Ø§ÙÙØ¨Ø¶Ø§Øª Ø§ÙÙØ·ÙÙØ©Ø ÙØ±ÙØ­ ÙÙØµÙÙØ¹ ÙÙ Ø§ÙØ³ÙÙÙÙÙÙ Ø§ÙØ·Ø¨Ù Ø¹Ø§ÙÙ Ø§ÙØ¬ÙØ¯Ø©. ÙÙØ§ÙÙ ÙÙÙØ§Ø¡ ÙÙØ§Ø¨Ù ÙØ¥Ø¹Ø§Ø¯Ø© Ø§ÙØ´Ø­Ù Ø¹Ø¨Ø± USB.',
    descriptionEn: 'Dual-action stimulation device with gentle pulse technology, made of high-quality medical silicone. Waterproof and USB rechargeable.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop',
    category: 'Sex Toys',
    rating: 4.5,
    reviewsCount: 89,
    stock: 8
  },
  {
    id: 'st-3',
    name: 'Ø¬Ù ÙØ§Ø¦Ù ÙØ±Ø·Ø¨ ÙØ§Ø¦Ù Ø§ÙÙØ¹ÙÙØ© 200 ÙÙ',
    nameEn: 'Ultra-Smooth Water-Based Lubricant 200ml',
    link: 'https://www.vexatoys.com/product/ultra-smooth-water-based-lubricant-200ml',
    description: 'ÙØ²ÙÙ Ø·Ø¨ÙØ¹Ù Ø°Ù Ø£Ø³Ø§Ø³ ÙØ§Ø¦ÙØ ÙØ§ ÙØ³Ø¨Ø¨ Ø§ÙØ­Ø³Ø§Ø³ÙØ©Ø Ø³ÙÙ Ø§ÙØªÙØ¸ÙÙ ÙÙÙÙØ± ÙØ¹ÙÙØ© ÙØ§Ø¦ÙØ© ØªØ¯ÙÙ Ø·ÙÙÙØ§Ù Ø¨Ø¯ÙÙ Ø£Ù ÙØ²ÙØ¬Ø©. ÙØªÙØ§ÙÙ ÙØ¹ Ø¬ÙÙØ¹ Ø§ÙØ£ÙØ¹Ø§Ø¨ ÙØ§ÙÙØ§ÙÙØ§Øª.',
    descriptionEn: 'Natural water-based lubricant, hypoallergenic, easy to clean, and provides long-lasting smoothness. Compatible with all toys and condoms.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1556228578-8c7c2e43809f?q=80&w=500&auto=format&fit=crop',
    category: 'Sex Toys',
    rating: 4.9,
    reviewsCount: 312,
    stock: 45
  },

  // --- Vibrators ---
  {
    id: 'vib-1',
    name: 'ÙØ²Ø§Ø² Ø§ÙÙØ±Ø¯Ø© Ø§ÙØ°ÙÙ Ø§ÙÙØ·ÙØ±',
    nameEn: 'Upgraded Smart Rose Vibrator',
    link: 'https://www.vexatoys.com/product/upgraded-smart-rose-vibrator',
    description: 'Ø§ÙÙØ²Ø§Ø² Ø§ÙØ£ÙØ«Ø± Ø´ÙØ±Ø© Ø¨ØªØµÙÙÙ Ø§ÙÙØ±Ø¯Ø© Ø§ÙØ£ÙÙÙØ ÙØ¹ÙÙ Ø¨ØªÙÙÙØ© Ø´ÙØ· Ø§ÙÙÙØ§Ø¡ Ø§ÙÙØ·ÙÙØ© ÙÙØ¨Ø¶Ø§Øª ÙØªØ¹Ø¯Ø¯Ø© Ø§ÙØ³Ø±Ø¹Ø§Øª ÙØªØ¬Ø±Ø¨Ø© ÙØ±ÙØ¯Ø© ÙÙÙØªØ¹Ø© ÙÙØºØ§ÙØ©. ÙØ§Ø¯Ø¦ ØªÙØ§ÙØ§Ù.',
    descriptionEn: 'The famous rose vibrator, using gentle air suction technology and multi-speed pulses for a unique and enjoyable experience. Ultra-quiet.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?q=80&w=500&auto=format&fit=crop',
    category: 'Vibrators',
    rating: 4.7,
    reviewsCount: 215,
    stock: 22,
    isNew: true
  },
  {
    id: 'vib-2',
    name: 'Ø¬ÙØ§Ø² Ø§ÙÙØ³Ø§Ø¬ Ø§ÙØ§ÙØªØ²Ø§Ø²Ù ÙÙØ¹Ø¶ÙØ§Øª ÙØ§ÙÙÙØ§Ø·Ù Ø§ÙØ­Ø³Ø§Ø³Ø©',
    nameEn: 'Wand Massager for Muscle and Intimate Use',
    link: 'https://www.vexatoys.com/product/wand-massager-for-muscle-and-intimate-use',
    description: 'Ø¬ÙØ§Ø² ØªØ¯ÙÙÙ ÙØ§Ø³ÙÙÙ ÙÙÙ Ø¨Ø±Ø£Ø³ ÙØ±Ù ÙØµÙÙØ¹ ÙÙ Ø§ÙØ³ÙÙÙÙÙÙ Ø§ÙÙØ§Ø¹ÙØ ÙÙÙØ± 10 ÙØ³ØªÙÙØ§Øª ÙÙ Ø§ÙØ§ÙØªØ²Ø§Ø² Ø§ÙØ¹ÙÙÙ ÙÙØªØ®ÙÙÙ ÙÙ Ø§ÙØªÙØªØ± ÙØªØ­ÙÙØ² Ø§ÙØ§Ø³ØªØ±Ø®Ø§Ø¡ Ø§ÙØªØ§Ù.',
    descriptionEn: 'Powerful wireless wand massager with a flexible medical silicone head, offering 10 deep vibration levels for stress relief and relaxation.',
    price: 410,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500&auto=format&fit=crop',
    category: 'Vibrators',
    rating: 4.6,
    reviewsCount: 142,
    stock: 10
  },
  {
    id: 'vib-3',
    name: 'ÙØ²Ø§Ø² Ø§ÙØ±ØµØ§ØµØ© Ø§ÙÙØ§Ø³ÙÙÙ Ø§ÙØµØºÙØ±',
    nameEn: 'Mini Wireless Bullet Vibrator',
    link: 'https://www.vexatoys.com/product/mini-wireless-bullet-vibrator',
    description: 'ÙØ²Ø§Ø² ØµØºÙØ± Ø§ÙØ­Ø¬Ù ÙØ³Ø±Ù ÙÙØºØ§ÙØ© ÙÙÙÙÙ ÙÙÙØ ÙÙÙÙ Ø§ÙØªØ­ÙÙ Ø¨Ù Ø¹Ù Ø¨Ø¹Ø¯ ÙÙÙ ÙØ«Ø§ÙÙ ÙÙØ§Ø³ØªØ®Ø¯Ø§Ù Ø§ÙÙØ±Ø¯Ù Ø£Ù ÙØ¹ Ø§ÙØ´Ø±ÙÙ. ÙØºØ·Ù Ø¨Ø³ÙÙÙÙÙÙ ÙØ§Ø¹Ù ÙØ§ÙØ­Ø±ÙØ±.',
    descriptionEn: 'Compact and discreet yet powerful bullet vibrator, remote controllable, ideal for solo or couples play. Covered in silky-smooth silicone.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop',
    category: 'Vibrators',
    rating: 4.3,
    reviewsCount: 76,
    stock: 30
  },

  // --- Male Toys ---
  {
    id: 'male-1',
    name: 'Ø¬ÙØ§Ø² Ø§ÙØ§ÙØ¯ÙØ§Ø¬ ÙØ§ÙØªØ­ÙÙØ² Ø§ÙØ°ÙÙ ÙÙØ±Ø¬Ø§Ù',
    nameEn: 'Smart Male Masturbator & Stimulator',
    link: 'https://www.vexatoys.com/product/smart-male-masturbator-stimulator',
    description: 'Ø¬ÙØ§Ø² Ø¢ÙÙ ÙØªØ·ÙØ± ÙÙØ±Ø¬Ø§Ù Ø¨ØªØµÙÙÙ ÙÙØ¯Ø³Ù Ø¯Ø§Ø®ÙÙ ÙØ¨ØªÙØ± ÙÙÙØ­ Ø´Ø¹ÙØ±Ø§Ù Ø·Ø¨ÙØ¹ÙØ§Ù Ø¨Ø§ÙÙØ§ÙÙ. ÙØªÙÙØ² Ø¨Ø®Ø§ØµÙØ© Ø§ÙØªØ³Ø®ÙÙ Ø§ÙØªÙÙØ§Ø¦Ù ÙØ§ÙØ§ÙØªØ²Ø§Ø² ÙØªØ¹Ø¯Ø¯ Ø§ÙØ³Ø±Ø¹Ø§Øª.',
    descriptionEn: 'Advanced automatic male device with innovative internal textures. Features automatic warming and multi-speed vibration.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500&auto=format&fit=crop',
    category: 'Male Toys',
    rating: 4.4,
    reviewsCount: 94,
    stock: 6,
    isNew: true
  },
  {
    id: 'male-2',
    name: 'Ø­ÙÙØ§Øª Ø§ÙØ³ÙÙÙÙÙÙ Ø§ÙÙØ±ÙØ© ÙÙØ±Ø¬Ø§Ù (Ø·ÙÙ 3 ÙØ·Ø¹)',
    nameEn: 'Flexible Silicone Men Rings (Set of 3)',
    link: 'https://www.vexatoys.com/product/flexible-silicone-men-rings-set-of-3',
    description: 'ÙØ¬ÙÙØ¹Ø© ÙÙ 3 Ø­ÙÙØ§Øª Ø¨Ø£Ø­Ø¬Ø§Ù ÙØ®ØªÙÙØ© ÙØµÙÙØ¹Ø© ÙÙ Ø§ÙØ³ÙÙÙÙÙÙ Ø§ÙØ·Ø¨Ù Ø¹Ø§ÙÙ Ø§ÙÙØ±ÙÙØ©. ÙØµÙÙØ© ÙØ²ÙØ§Ø¯Ø© Ø§ÙÙØ¯Ø±Ø© ÙØ§ÙØªØ­ÙÙ ÙØªØ­Ø³ÙÙ Ø§ÙØ£Ø¯Ø§Ø¡ ÙÙØªØ±Ø§Øª Ø£Ø·ÙÙ Ø¨Ø£ÙØ§Ù.',
    descriptionEn: 'Set of 3 different sized rings made of high-stretch medical silicone. Designed to increase stamina and enhance performance safely.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop',
    category: 'Male Toys',
    rating: 4.2,
    reviewsCount: 118,
    stock: 25
  },
  {
    id: 'male-3',
    name: 'ÙÙ Ø§ÙØªØ­ÙÙØ² Ø§ÙØªÙÙØ§Ø¦Ù Ø§ÙÙØ¶ÙØ¹',
    nameEn: 'Ribbed Automatic Stimulation Sleeve',
    link: 'https://www.vexatoys.com/product/ribbed-automatic-stimulation-sleeve',
    description: 'ÙÙ ÙØµÙÙØ¹ ÙÙ ÙØ§Ø¯Ø© TPE ÙØ§Ø¦ÙØ© Ø§ÙÙØ¹ÙÙØ© ÙØ§ÙÙØ±ÙÙØ©Ø ÙØªÙÙØ² Ø¨ØªØµÙÙÙ ÙØ¶ÙØ¹ Ø¯Ø§Ø®ÙÙ ÙØ²ÙØ§Ø¯Ø© Ø§ÙØªØ­ÙÙØ². Ø³ÙÙ Ø§ÙØªÙØ¸ÙÙ ÙØ¥Ø¹Ø§Ø¯Ø© Ø§ÙØ§Ø³ØªØ®Ø¯Ø§Ù ÙÙØ±ÙØ­ ÙÙØºØ§ÙØ©.',
    descriptionEn: 'Sleeve made of ultra-soft and stretchy TPE, featuring ribbed internal textures for stimulation. Easy to clean, reusable, and comfortable.',
    price: 195,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    category: 'Male Toys',
    rating: 4.5,
    reviewsCount: 63,
    stock: 14
  },

  // --- Dildos ---
  {
    id: 'dil-1',
    name: 'Ø¯ÙÙØ¯Ù Ø§ÙØ³ÙÙÙÙÙÙ Ø§ÙÙØ§ÙØ¹Ù ÙØ¹ ÙØ§Ø¹Ø¯Ø© ØªØ«Ø¨ÙØª',
    nameEn: 'Realistic Silicone Dildo with Suction Cup',
    link: 'https://www.vexatoys.com/product/realistic-silicone-dildo-with-suction-cup',
    description: 'Ø¯ÙÙØ¯Ù ÙØ§ÙØ¹Ù ÙÙØºØ§ÙØ© ÙØµÙÙØ¹ ÙÙ Ø³ÙÙÙÙÙÙ ÙØ²Ø¯ÙØ¬ Ø§ÙÙØ«Ø§ÙØ© (ÙÙØ¨ ØµÙØ¨ ÙØ·Ø¨ÙØ© Ø®Ø§Ø±Ø¬ÙØ© ÙØ§Ø¹ÙØ© ÙØ§ÙØ¨Ø´Ø±Ø©). ÙØ²ÙØ¯ Ø¨ÙØ§Ø¹Ø¯Ø© Ø´ÙØ· ÙÙÙØ© ÙÙØªØ«Ø¨ÙØª Ø¹ÙÙ Ø£Ù Ø³Ø·Ø­ ÙØ§Ø¹Ù.',
    descriptionEn: 'Highly realistic dildo made of dual-density silicone (firm core, soft skin-like outer layer). Equipped with a strong suction cup base.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1600857062141-984d9902f3cb?q=80&w=500&auto=format&fit=crop',
    category: 'Dildos',
    rating: 4.6,
    reviewsCount: 52,
    stock: 5
  },
  {
    id: 'dil-2',
    name: 'Ø¯ÙÙØ¯Ù Ø²Ø¬Ø§Ø¬Ù ÙØ§Ø®Ø± ÙÙØ¹ÙØ§Ø¬ Ø¨Ø§ÙØ­Ø±Ø§Ø±Ø© ÙØ§ÙØ¨Ø±ÙØ¯Ø©',
    nameEn: 'Luxury Glass Dildo for Temperature Play',
    link: 'https://www.vexatoys.com/product/luxury-glass-dildo-for-temperature-play',
    description: 'ÙØµÙÙØ¹ ÙØ¯ÙÙØ§Ù ÙÙ Ø²Ø¬Ø§Ø¬ Ø§ÙØ¨ÙØ±Ø³ÙÙÙØ§Øª Ø§ÙÙÙØ§ÙÙ ÙÙØµØ¯ÙØ§Øª ÙØ§ÙØ¢ÙÙ ØªÙØ§ÙØ§Ù. ÙÙÙÙ ÙØ¶Ø¹Ù ÙÙ ÙØ§Ø¡ Ø¯Ø§ÙØ¦ Ø£Ù Ø¨Ø§Ø±Ø¯ ÙØªØ¬Ø±Ø¨Ø© Ø£Ø­Ø§Ø³ÙØ³ Ø­Ø±Ø§Ø±ÙØ© ÙØ«ÙØ±Ø© ÙÙÙÙØ²Ø©.',
    descriptionEn: 'Handmade from shatterproof and body-safe borosilicate glass. Can be placed in warm or cold water for exciting temperature play.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop',
    category: 'Dildos',
    rating: 4.8,
    reviewsCount: 41,
    stock: 7
  },
  {
    id: 'dil-3',
    name: 'Ø¯ÙÙØ¯Ù Ø¬Ù-Ø³Ø¨ÙØª Ø§ÙÙØ±Ù Ø§ÙÙÙØ­ÙÙ',
    nameEn: 'Flexible Curved G-Spot Dildo',
    link: 'https://www.vexatoys.com/product/flexible-curved-g-spot-dildo',
    description: 'ØªØµÙÙÙ ÙØ±ÙØ­ Ø¨Ø§ÙØ­ÙØ§Ø¡Ø© ÙØ¯Ø±ÙØ³Ø© Ø¨Ø¯ÙØ© ÙÙÙØµÙÙ Ø§ÙÙØ¨Ø§Ø´Ø± ÙÙÙÙØ³ Ø­Ø±ÙØ±Ù ÙØ§Ø¹Ù ÙÙ Ø§ÙØ³ÙÙÙÙÙÙ. ÙØ±Ù Ø¨ÙØ§ ÙÙÙÙ ÙÙØªÙÙÙ ÙØ¹ Ø´ÙÙ Ø§ÙØ¬Ø³Ù ÙÙÙÙØ± Ø±Ø§Ø­Ø© ØªØ§ÙØ©.',
    descriptionEn: 'Ergonomic design with a precisely engineered curve for direct reach and silky-smooth silicone. Flexible enough to adapt to the body.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop',
    category: 'Dildos',
    rating: 4.5,
    reviewsCount: 88,
    stock: 18
  },

  // --- Lingerie ---
  {
    id: 'ling-1',
    name: 'Ø¨ÙØ¨Ù Ø¯ÙÙ Ø§ÙØ¯Ø§ÙØªÙÙ Ø§ÙØ£Ø³ÙØ¯ Ø§ÙÙØ§Ø®Ø±',
    nameEn: 'Luxury Black Lace Babydoll',
    link: 'https://www.vexatoys.com/product/luxury-black-lace-babydoll',
    description: 'ÙØ·Ø¹Ø© ÙØ§ÙØ¬Ø±Ù ÙÙØ§Ø³ÙÙÙØ© ÙØ§Ø®Ø±Ø© ÙÙ Ø§ÙØ¯Ø§ÙØªÙÙ Ø§ÙÙØ§Ø¹Ù ÙØ§ÙØ´ÙÙÙÙ Ø§ÙØ´ÙØ§ÙØ ØªØ£ØªÙ ÙØ¹ Ø³Ø±ÙØ§Ù Ø¯Ø§Ø®ÙÙ ÙØ·Ø§Ø¨Ù. ØªØ¨Ø±Ø² Ø¬ÙØ§Ù Ø§ÙØ¬Ø³Ù ÙØªÙÙØ­ Ø´Ø¹ÙØ±Ø§Ù Ø¨Ø§ÙØ«ÙØ© ÙØ§ÙØ£ÙÙØ«Ø©.',
    descriptionEn: 'Classic luxury babydoll in soft lace and sheer chiffon, comes with a matching thong. Accents body beauty and gives a feeling of confidence.',
    price: 210,
    image: 'https://images.unsplash.com/photo-1618333244973-f8e43420a16e?q=80&w=500&auto=format&fit=crop',
    category: 'Lingerie',
    rating: 4.8,
    reviewsCount: 167,
    stock: 20,
    isNew: true
  },
  {
    id: 'ling-2',
    name: 'Ø·ÙÙ Ø¨ÙØ¯Ù Ø³ÙØª Ø³Ø§ØªØ§Ù Ø£Ø­ÙØ± ÙØ±ÙØ²Ù',
    nameEn: 'Crimson Red Satin Bodysuit',
    link: 'https://www.vexatoys.com/product/crimson-red-satin-bodysuit',
    description: 'Ø¨ÙØ¯Ù Ø³ÙØª Ø¬Ø°Ø§Ø¨ ÙØµÙÙØ¹ ÙÙ Ø§ÙØ³Ø§ØªØ§Ù Ø§ÙÙØ§Ø®Ø± Ø§ÙÙØ§ÙØ¹ ÙØ§ÙØ¯Ø§ÙØªÙÙ Ø§ÙÙØ²Ø®Ø±Ù. Ø£Ø­Ø²ÙØ© ÙØ§Ø¨ÙØ© ÙÙØªØ¹Ø¯ÙÙ ÙÙÙØ§Ø³ ÙØ«Ø§ÙÙØ ÙØªØµÙÙÙ ÙÙØªÙØ­ ÙÙ Ø§ÙØ¸ÙØ± ÙØ¥Ø·ÙØ§ÙØ© Ø³Ø§Ø­Ø±Ø©.',
    descriptionEn: 'Attractive bodysuit made of premium glossy satin and ornate lace. Adjustable straps for a perfect fit, and open back design.',
    price: 185,
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=500&auto=format&fit=crop',
    category: 'Lingerie',
    rating: 4.6,
    reviewsCount: 95,
    stock: 12
  },
  {
    id: 'ling-3',
    name: 'Ø±Ø¯Ø§Ø¡ ÙÙÙÙÙÙ ÙÙ Ø§ÙØ­Ø±ÙØ± Ø§ÙÙØ§Ø¹Ù',
    nameEn: 'Soft Silk Kimono Robe',
    link: 'https://www.vexatoys.com/product/soft-silk-kimono-robe',
    description: 'Ø±Ø¯Ø§Ø¡ Ø·ÙÙÙ ÙÙØ¶ÙØ§Ø¶ ÙÙ Ø§ÙØ­Ø±ÙØ± Ø§ÙØµÙØ§Ø¹Ù ÙØ§Ø¦Ù Ø§ÙÙØ¹ÙÙØ©Ø ÙØ²ÙÙ Ø¨Ø£Ø·Ø±Ø§Ù ÙÙ Ø§ÙØ¯Ø§ÙØªÙÙ Ø¹ÙÙ Ø§ÙØ£ÙÙØ§Ù ÙØ­Ø²Ø§Ù Ø®ØµØ± Ø¹Ø±ÙØ¶. Ø£ÙÙÙ ÙÙØ±ÙØ­ ÙÙØºØ§ÙØ© ÙÙØ£ÙØ³ÙØ§Øª Ø§ÙØ®Ø§ØµØ©.',
    descriptionEn: 'Long, loose robe in ultra-soft faux silk, adorned with lace trim on sleeves and a wide waist belt. Elegant and comfortable.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=500&auto=format&fit=crop',
    category: 'Lingerie',
    rating: 4.7,
    reviewsCount: 134,
    stock: 16
  },

  // --- BDSM ---
  {
    id: 'bdsm-1',
    name: 'Ø·ÙÙ Ø§ÙÙÙÙØ¯ Ø§ÙØ¬ÙØ¯ÙØ© Ø§ÙÙØ§Ø¹ÙØ© ÙÙÙØ¨ØªØ¯Ø¦ÙÙ',
    nameEn: 'Soft Leather Restraints Starter Kit',
    link: 'https://www.vexatoys.com/product/soft-leather-restraints-starter-kit',
    description: 'ÙØ¬ÙÙØ¹Ø© ÙÙÙØ¯ ÙÙÙØ¹ØµÙ ÙØ§ÙÙØ§Ø­Ù ÙØµÙÙØ¹Ø© ÙÙ Ø§ÙØ¬ÙØ¯ Ø§ÙØµÙØ§Ø¹Ù Ø§ÙÙØ¨Ø·Ù Ø¨Ø§ÙÙÙÙØ¨Ø±ÙÙ Ø§ÙÙØ§Ø¹Ù ÙØ­ÙØ§ÙØ© Ø§ÙØ¨Ø´Ø±Ø©. Ø³ÙÙØ© Ø§ÙØªØ¹Ø¯ÙÙ ÙØ§ÙØªØ±ÙÙØ¨ ÙØ¢ÙÙØ© ØªÙØ§ÙØ§Ù.',
    descriptionEn: 'Wrist and ankle restraints set made of faux leather lined with soft neoprene to protect the skin. Easy to adjust and completely safe.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1602810318383-e55f89a3df12?q=80&w=500&auto=format&fit=crop',
    category: 'BDSM',
    rating: 4.4,
    reviewsCount: 58,
    stock: 9
  },
  {
    id: 'bdsm-2',
    name: 'Ø¹ØµØ§Ø¨Ø© Ø§ÙØ¹ÙÙÙÙ Ø§ÙØ­Ø±ÙØ±ÙØ© Ø§ÙÙØ§Ø®Ø±Ø© ÙØ¹ Ø±ÙØ´Ø© ÙØ¯Ø§Ø¹Ø¨Ø©',
    nameEn: 'Luxury Silk Blindfold with Tickler Feather',
    link: 'https://www.vexatoys.com/product/luxury-silk-blindfold-with-tickler-feather',
    description: 'Ø¹ØµØ§Ø¨Ø© Ø¹ÙÙ ÙÙ Ø§ÙØ­Ø±ÙØ± Ø§ÙØ·Ø¨ÙØ¹Ù ÙØ­Ø¬Ø¨ Ø§ÙØ¶ÙØ¡ ØªÙØ§ÙØ§Ù ÙØ²ÙØ§Ø¯Ø© Ø§ÙØ­Ø³Ø§Ø³ÙØ© ÙÙÙØ³Ø ØªØ£ØªÙ ÙØ¹ Ø±ÙØ´Ø© ÙØ¯Ø§Ø¹Ø¨Ø© ÙØ§Ø¹ÙØ© ÙØªØ¬Ø±Ø¨Ø© Ø­Ø³ÙØ© ÙØ´ÙÙØ© ÙÙØ«ÙØ±Ø©.',
    descriptionEn: 'Natural silk blindfold to completely block light and heighten touch sensitivity, comes with a soft tickler feather for sensory play.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1520006403993-47400cad67c5?q=80&w=500&auto=format&fit=crop',
    category: 'BDSM',
    rating: 4.7,
    reviewsCount: 112,
    stock: 35
  },
  {
    id: 'bdsm-3',
    name: 'Ø³ÙØ· Ø§ÙÙØ¯Ø§Ø¹Ø¨Ø© Ø§ÙØ¬ÙØ¯Ù Ø§ÙÙØµÙØ±',
    nameEn: 'Short Leather Flogger / Crop',
    link: 'https://www.vexatoys.com/product/short-leather-flogger-crop',
    description: 'Ø³ÙØ· ÙÙØ§Ø³ÙÙÙ ÙØµÙÙØ¹ ÙÙ Ø´Ø±Ø§Ø¦Ø­ Ø§ÙØ¬ÙØ¯ Ø§ÙÙØ§Ø¹Ù Ø¨ÙÙØ¨Ø¶ ÙØ±ÙØ­ ÙÙØ¶ÙØ±. ÙØµÙÙ ÙØªÙØ¯ÙÙ Ø¶Ø±Ø¨Ø§Øª Ø®ÙÙÙØ© ÙÙØ«ÙØ±Ø© ØªØ²ÙØ¯ ÙÙ Ø§ÙØ£Ø¯Ø±ÙÙØ§ÙÙÙ ÙØ§ÙØ¥Ø«Ø§Ø±Ø©.',
    descriptionEn: 'Classic flogger made of soft leather falls with a comfortable braided handle. Designed to deliver light, thrilling sensations.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop',
    category: 'BDSM',
    rating: 4.5,
    reviewsCount: 47,
    stock: 11
  },

  // --- Holiday Collection ---
  {
    id: 'hol-1',
    name: 'ØªÙÙÙÙ Ø§ÙÙÙØ§Ø¬Ø¢Øª Ø§ÙØ±ÙÙØ§ÙØ³ÙØ© (24 ÙÙÙØ§Ù)',
    nameEn: '24 Days of Romance Advent Calendar',
    link: 'https://www.vexatoys.com/product/24-days-of-romance-advent-calendar',
    description: 'ØµÙØ¯ÙÙ ÙØ¯Ø§ÙØ§ ÙØ§Ø®Ø± ÙØ­ØªÙÙ Ø¹ÙÙ 24 ÙÙØ§Ø¬Ø£Ø© ÙÙÙØ²Ø© ÙÙØ£Ø²ÙØ§Ø¬Ø ØªØªÙÙØ¹ Ø¨ÙÙ Ø£ÙØ¹Ø§Ø¨ ØµØºÙØ±Ø©Ø Ø²ÙÙØª Ø¹Ø·Ø±ÙØ©Ø Ø£Ø±Ø¨Ø·Ø©Ø ÙØ¥ÙØ³Ø³ÙØ§Ø±Ø§Øª Ø±ÙÙØ§ÙØ³ÙØ© ØªØ¬Ø¹Ù ÙÙ ÙÙÙ Ø§Ø­ØªÙØ§ÙØ§Ù.',
    descriptionEn: 'Luxury gift box containing 24 special surprises for couples, ranging from mini toys, aromatic oils, ties, and romantic accessories.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop',
    category: 'Holiday Collection',
    rating: 4.9,
    reviewsCount: 34,
    stock: 4,
    isNew: true
  },
  {
    id: 'hol-2',
    name: 'Ø·ÙÙ ÙØ§ÙØ¬Ø±Ù Ø¨Ø§Ø¨Ø§ ÙÙÙÙ Ø§ÙØªÙÙØ±Ù Ø§ÙÙØ«ÙØ±',
    nameEn: 'Sexy Santa Cosplay Lingerie Set',
    link: 'https://www.vexatoys.com/product/sexy-santa-cosplay-lingerie-set',
    description: 'Ø·ÙÙ ØªÙÙØ±Ù ÙØ®ÙÙÙ Ø£Ø­ÙØ± Ø¨Ø£Ø·Ø±Ø§Ù ÙØ±Ù Ø¨ÙØ¶Ø§Ø¡ ÙØ§Ø¹ÙØ© ÙØªÙØ§ØµÙÙ Ø¬Ø°Ø§Ø¨Ø©. ÙØªØ¶ÙÙ Ø§ÙÙØ³ØªØ§Ù Ø§ÙØµØºÙØ±Ø ÙØ¨Ø¹Ø© Ø§ÙØ¹ÙØ¯Ø ÙØ­Ø²Ø§Ù Ø§ÙØ®ØµØ± Ø§ÙØ£Ø³ÙØ¯ Ø§ÙØ¹Ø±ÙØ¶ ÙØ¥Ø·ÙØ§ÙØ© Ø§Ø­ØªÙØ§ÙÙØ© Ø¨Ø§ÙØªÙØ§Ø².',
    descriptionEn: 'Red velvet cosplay set with soft white faux fur trim. Includes mini dress, holiday hat, and wide black waist belt for a festive look.',
    price: 225,
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=500&auto=format&fit=crop',
    category: 'Holiday Collection',
    rating: 4.5,
    reviewsCount: 78,
    stock: 14
  },
  {
    id: 'hol-3',
    name: 'Ø´ÙØ¹Ø© Ø§ÙÙØ³Ø§Ø¬ Ø§ÙØ¹Ø·Ø±ÙØ© Ø§ÙÙØ§Ø®Ø±Ø© - Ø¨Ø±Ø§Ø¦Ø­Ø© Ø§ÙÙØ§ÙÙÙÙØ§ ÙØ§ÙØ¹ÙØ¯',
    nameEn: 'Luxury Massage Candle - Vanilla & Oud',
    link: 'https://www.vexatoys.com/product/luxury-massage-candle-vanilla-oud',
    description: 'Ø´ÙØ¹Ø© ÙØµÙÙØ¹Ø© ÙÙ Ø²Ø¨Ø¯Ø© Ø§ÙØ´ÙØ§ ÙØ²ÙØª Ø¬ÙØ² Ø§ÙÙÙØ¯ Ø§ÙØ·Ø¨ÙØ¹Ù. Ø¹ÙØ¯ Ø°ÙØ¨Ø§ÙÙØ§ ØªØªØ­ÙÙ Ø¥ÙÙ Ø²ÙØª Ø¯Ø§ÙØ¦ ÙÙØºØ°Ù ÙÙØ¨Ø´Ø±Ø©Ø ÙØ«Ø§ÙÙ ÙØ¹ÙÙ ÙØ³Ø§Ø¬ Ø±ÙÙØ§ÙØ³Ù Ø¯Ø§ÙØ¦ Ø¨Ø±Ø§Ø¦Ø­Ø© Ø³Ø§Ø­Ø±Ø©.',
    descriptionEn: 'Candle made from shea butter and natural coconut oil. Melts into a warm, nourishing massage oil with an enchanting vanilla and oud scent.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=500&auto=format&fit=crop',
    category: 'Holiday Collection',
    rating: 4.8,
    reviewsCount: 143,
    stock: 28
  },

  // --- New Arrivals ---
  {
    id: 'new-1',
    name: 'Ø¬ÙØ§Ø² Ø§ÙÙØ³Ø§Ø¬ Ø§ÙØµÙØªÙ Ø§ÙØªÙØ§Ø¹ÙÙ Ø§ÙØ°ÙÙ',
    nameEn: 'Smart Interactive Audio Massager',
    link: 'https://www.vexatoys.com/product/smart-interactive-audio-massager',
    description: 'Ø£Ø­Ø¯Ø« ØµÙØ­Ø© ÙÙ Ø¹Ø§ÙÙ Ø§ÙØ£ÙØ¹Ø§Ø¨ Ø§ÙØ²ÙØ¬ÙØ©! Ø¬ÙØ§Ø² Ø§ÙØªØ²Ø§Ø²Ù Ø°ÙÙ ÙØªÙØ§Ø¹Ù ÙØ¹ Ø§ÙÙÙØ³ÙÙÙ Ø£Ù ØµÙØª Ø§ÙØ´Ø±ÙÙ Ø¹Ø¨Ø± Ø§ÙØ¨ÙÙØªÙØ« ÙØªØ·Ø¨ÙÙ Ø§ÙÙØ§ØªÙ ÙØªØ¬Ø±Ø¨Ø© ÙØ§ ÙØ«ÙÙ ÙÙØ§.',
    descriptionEn: 'The latest trend! Smart vibrator that interacts with music or your partner\'s voice via Bluetooth and mobile app for an unmatched experience.',
    price: 620,
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=500&auto=format&fit=crop',
    category: 'New Arrivals',
    rating: 5.0,
    reviewsCount: 12,
    stock: 6,
    isNew: true
  },
  {
    id: 'new-2',
    name: 'ÙØ§ÙØ¬Ø±Ù Ø§ÙØ¯Ø§ÙØªÙÙ Ø§ÙØ°ÙØ¨Ù Ø§ÙÙØ§Ø®Ø± ÙØ·Ø¹ØªÙÙ',
    nameEn: 'Luxury Gold Lace Lingerie 2-Piece Set',
    link: 'https://www.vexatoys.com/product/luxury-gold-lace-lingerie-2-piece-set',
    description: 'Ø·ÙÙ ÙØ§ÙØ¬Ø±Ù ÙØ°ÙÙ ÙØ¯ÙØ¬ Ø¨ÙÙ Ø§ÙØ´ÙÙÙÙ Ø§ÙØ£Ø³ÙØ¯ Ø§ÙÙØ§Ø¹Ù ÙØ®ÙÙØ· Ø§ÙØ¯Ø§ÙØªÙÙ Ø§ÙØ°ÙØ¨ÙØ© Ø§ÙÙØ§ÙØ¹Ø©. ØªØµÙÙÙ Ø¹ØµØ±Ù ÙØ¬Ø±ÙØ¡ ÙØ¹Ø·Ù Ø±ÙÙÙØ§Ù ÙÙÙÙØ§Ù Ø¬Ø°Ø§Ø¨Ø§Ù ÙØ§Ø³ØªØ«ÙØ§Ø¦ÙØ§Ù.',
    descriptionEn: 'Stunning lingerie set merging soft black chiffon with shiny golden lace threads. Modern and bold design giving a royal, attractive look.',
    price: 270,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500&auto=format&fit=crop',
    category: 'New Arrivals',
    rating: 4.9,
    reviewsCount: 18,
    stock: 8,
    isNew: true
  },
  {
    id: 'new-3',
    name: 'Ø·ÙÙ Ø§ÙØ²ÙÙØª Ø§ÙØ¹Ø·Ø±ÙØ© Ø§ÙØ¹Ø¶ÙÙØ© (Ø¥Ø«Ø§Ø±Ø© ÙÙÙÙ Ø¹ÙÙÙ)',
    nameEn: 'Organic Essential Oils Set (Arousal & Deep Sleep)',
    link: 'https://www.vexatoys.com/product/organic-essential-oils-set-arousal-deep-sleep',
    description: 'ÙØ¬ÙÙØ¹Ø© ÙØ±ÙØ²Ø© ÙÙ Ø§ÙØ²ÙÙØª Ø§ÙØ¹Ø·Ø±ÙØ© Ø§ÙØ¹Ø¶ÙÙØ© Ø§ÙØ·Ø¨ÙØ¹ÙØ© 100%. ØªØ´ÙÙ Ø²ÙØª Ø§ÙÙØ§ÙÙØ¯Ø± ÙÙØ§Ø³ØªØ±Ø®Ø§Ø¡ ÙØ²ÙØª Ø§ÙÙÙØ§ÙØº ÙÙØ§ÙØº ÙØ§ÙÙØ§Ø³ÙÙÙ ÙØ²ÙØ§Ø¯Ø© Ø§ÙØ±ØºØ¨Ø© ÙØªØ­Ø³ÙÙ Ø§ÙÙØ²Ø§Ø¬.',
    descriptionEn: 'Concentrated set of 100% natural organic essential oils. Includes lavender for relaxation, and ylang-ylang and jasmine to enhance mood.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500&auto=format&fit=crop',
    category: 'New Arrivals',
    rating: 4.7,
    reviewsCount: 22,
    stock: 20,
    isNew: true
  }
];

export const MOCK_ARTICLES: AdviceArticle[] = [
  {
    id: 'art-1',
    title: 'ÙÙÙÙØ© Ø§Ø®ØªÙØ§Ø± Ø§ÙØ£ÙØ¹Ø§Ø¨ Ø§ÙØ²ÙØ¬ÙØ© Ø§ÙÙÙØ§Ø³Ø¨Ø© ÙØ£ÙÙ ÙØ±Ø©',
    titleEn: 'How to Choose the Right Couples Toys for the First Time',
    content: 'Ø§ÙØ¨Ø¯Ø¡ ÙÙ Ø§Ø³ØªØ®Ø¯Ø§Ù Ø§ÙØ£ÙØ¹Ø§Ø¨ Ø§ÙØ²ÙØ¬ÙØ© ÙØ¯ ÙÙÙÙ ØªØ¬Ø±Ø¨Ø© ÙØ´ÙÙØ© ÙÙØºØ§ÙØ© ÙØªÙØªØ­ Ø¢ÙØ§ÙØ§Ù Ø¬Ø¯ÙØ¯Ø© ÙÙ Ø§ÙÙØªØ¹Ø© ÙØ§ÙØªÙØ§ØµÙ Ø¨ÙÙ Ø§ÙØ²ÙØ¬ÙÙ. Ø§ÙØ®Ø·ÙØ© Ø§ÙØ£ÙÙÙ ÙØ§ÙØ£ÙÙ ÙÙ Ø§ÙØ­ÙØ§Ø± Ø§ÙØµØ±ÙØ­ ÙØ§ÙÙÙØªÙØ­. ÙØ¬Ø¨ Ø£Ù ÙØªÙÙ Ø§ÙØ·Ø±ÙØ§Ù Ø¹ÙÙ ØªØ¬Ø±Ø¨Ø© Ø´ÙØ¡ Ø¬Ø¯ÙØ¯ Ø¨Ø±ÙØ­ ÙÙ Ø§ÙÙØ±Ø­ ÙØ§ÙÙØ¶ÙÙ Ø¨Ø¯ÙÙ Ø£Ù Ø¶ØºÙØ·.\n\nØ¹ÙØ¯ Ø§ÙØ§Ø®ØªÙØ§Ø± ÙØ£ÙÙ ÙØ±Ø©Ø ÙÙØ¶Ù Ø§ÙØ¨Ø¯Ø¡ Ø¨Ø£Ø´ÙØ§Ø¡ Ø¨Ø³ÙØ·Ø© ÙØºÙØ± ÙØ®ÙÙØ©. ÙØ«ÙØ§ÙØ ØªØ¹ØªØ¨Ø± Ø²ÙÙØª Ø§ÙÙØ³Ø§Ø¬ Ø§ÙØ¹Ø·Ø±ÙØ© Ø§ÙÙØ§Ø®Ø±Ø© Ø£Ù Ø´ÙÙØ¹ Ø§ÙÙØ³Ø§Ø¬ ÙØ¯Ø®ÙØ§Ù ÙÙØªØ§Ø²Ø§Ù ÙØ£ÙÙØ§ ØªØ±ÙØ² Ø¹ÙÙ Ø§ÙØ§Ø³ØªØ±Ø®Ø§Ø¡ ÙØ§ÙÙÙØ³ Ø§ÙÙØ·ÙÙ. ØªÙÙÙØ§ Ø¹ØµØ§Ø¨Ø§Øª Ø§ÙØ¹ÙÙ Ø§ÙØ­Ø±ÙØ±ÙØ© Ø£Ù Ø§ÙØ±ÙØ´ Ø§ÙÙØ§Ø¹Ù Ø§ÙØªÙ ØªØ¹Ø²Ø² Ø§ÙØ­ÙØ§Ø³ Ø§ÙØ£Ø®Ø±Ù Ø¨Ø´ÙÙ ÙØ°ÙÙ.\n\nØ¥Ø°Ø§ Ø±ØºØ¨ØªÙ ÙÙ ØªØ¬Ø±Ø¨Ø© Ø£Ø¬ÙØ²Ø© Ø§ÙØªØ²Ø§Ø²ÙØ©Ø ÙØ¥Ù ÙØ²Ø§Ø² Ø§ÙØ±ØµØ§ØµØ© Ø§ÙØµØºÙØ± Ø£Ù Ø­ÙÙØ§Øª Ø§ÙØ³ÙÙÙÙÙÙ Ø§ÙÙØ±ÙØ© ÙÙØ±Ø¬Ø§Ù ØªØ¹Ø¯ Ø®ÙØ§Ø±Ø§Øª ÙØ«Ø§ÙÙØ© ÙØ£ÙÙØ§ ØµØºÙØ±Ø© Ø§ÙØ­Ø¬ÙØ Ø³ÙÙØ© Ø§ÙØ§Ø³ØªØ®Ø¯Ø§ÙØ ÙØªØ®Ø¯Ù ÙÙØ§ Ø§ÙØ·Ø±ÙÙÙ. ØªØ°ÙØ±ÙØ§ Ø¯Ø§Ø¦ÙØ§Ù Ø§Ø³ØªØ®Ø¯Ø§Ù ÙØ²ÙÙØ§Øª ÙØ§Ø¦ÙØ© Ø¹Ø§ÙÙØ© Ø§ÙØ¬ÙØ¯Ø© ÙØªÙÙÙØ± Ø£ÙØµÙ Ø¯Ø±Ø¬Ø§Øª Ø§ÙØ±Ø§Ø­Ø© ÙØ§ÙÙØ¹ÙÙØ©Ø ÙØ§Ø­Ø±ØµÙØ§ Ø¹ÙÙ ØªÙØ¸ÙÙ Ø§ÙØ£Ø¯ÙØ§Øª Ø¬ÙØ¯Ø§Ù Ø¨Ø§ÙÙØ§Ø¡ Ø§ÙØ¯Ø§ÙØ¦ ÙØ§ÙØµØ§Ø¨ÙÙ Ø§ÙØ·Ø¨Ù Ø§ÙÙØ®ØµØµ Ø¨Ø¹Ø¯ ÙÙ Ø§Ø³ØªØ®Ø¯Ø§Ù ÙØ¶ÙØ§Ù Ø§ÙØ³ÙØ§ÙØ© Ø§ÙØªØ§ÙØ©.',
    contentEn: 'Starting to use couples toys can be an exciting experience. The first step is open dialogue. Start with simple items like massage oils or silk blindfolds. For devices, small bullets or rings are ideal. Always use high-quality water-based lubricants and clean tools after use.',
    readTime: '5 Ø¯ÙØ§Ø¦Ù',
    category: 'ÙØµØ§Ø¦Ø­ ÙÙÙØ¨ØªØ¯Ø¦ÙÙ',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=500&auto=format&fit=crop',
    date: '2026-02-15'
  },
  {
    id: 'art-2',
    title: 'Ø£ÙÙÙØ© Ø§ÙÙØ²ÙÙØ§Øª Ø§ÙÙØ§Ø¦ÙØ© ÙÙÙÙÙØ© Ø§ÙØ¹ÙØ§ÙØ© Ø¨ÙÙØªØ¬Ø§Øª Ø§ÙØ³ÙÙÙÙÙÙ',
    titleEn: 'The Importance of Water-Based Lubes and Silicone Care',
    content: 'ØªØ¹ØªØ¨Ø± Ø§ÙÙØ²ÙÙØ§Øª Ø°Ø§Øª Ø§ÙØ£Ø³Ø§Ø³ Ø§ÙÙØ§Ø¦Ù Ø­Ø¬Ø± Ø§ÙØ£Ø³Ø§Ø³ ÙÙ Ø£Ù Ø¹ÙØ§ÙØ© Ø­ÙÙÙØ© ØµØ­ÙØ© ÙÙÙØªØ¹Ø©. ÙÙÙ ÙØ§ ØªÙØªØµØ± ÙÙØ· Ø¹ÙÙ Ø­Ù ÙØ´ÙÙØ© Ø§ÙØ¬ÙØ§ÙØ Ø¨Ù ØªØ¶ÙÙ ÙØ¹ÙÙØ© ÙØ§Ø¦ÙØ© ØªÙÙÙ ÙÙ Ø§ÙØ§Ø­ØªÙØ§Ù Ø§ÙÙØ²Ø¹Ø¬ ÙØªØ²ÙØ¯ ÙÙ Ø§ÙØ¥Ø­Ø³Ø§Ø³ Ø¨Ø§ÙÙØªØ¹Ø© ÙÙÙØ§ Ø§ÙØ·Ø±ÙÙÙ.\n\nÙÙØ§Ø°Ø§ ÙØ¤ÙØ¯ Ø¯Ø§Ø¦ÙØ§Ù Ø¹ÙÙ Ø§ÙÙØ²ÙÙØ§Øª Ø§ÙÙØ§Ø¦ÙØ©Ø ÙØ£ÙÙØ§ Ø¨Ø¨Ø³Ø§Ø·Ø© Ø§ÙØ£ÙØ«Ø± Ø£ÙØ§ÙØ§Ù Ø¹ÙÙ Ø§ÙØ¥Ø·ÙØ§Ù. Ø§ÙÙØ²ÙÙØ§Øª Ø§ÙÙØ§Ø¦ÙØ© ÙØªÙØ§ÙÙØ© ØªÙØ§ÙØ§Ù ÙØ¹ Ø§ÙÙØ§ÙÙØ§Øª Ø§ÙØ°ÙØ±ÙØ© Ø¨Ø¬ÙÙØ¹ Ø£ÙÙØ§Ø¹ÙØ§Ø ÙØ§ÙØ£ÙÙ ÙÙ Ø°ÙÙ Ø£ÙÙØ§ Ø§ÙÙØ­ÙØ¯Ø© Ø§ÙØ¢ÙÙØ© ÙÙØ§Ø³ØªØ®Ø¯Ø§Ù ÙØ¹ Ø§ÙØ£ÙØ¹Ø§Ø¨ Ø§ÙÙØµÙÙØ¹Ø© ÙÙ Ø§ÙØ³ÙÙÙÙÙÙ. Ø§ÙÙØ²ÙÙØ§Øª Ø§ÙØ²ÙØªÙØ© Ø£Ù Ø§ÙØªÙ ØªØ­ØªÙÙ Ø¹ÙÙ Ø³ÙÙÙÙÙÙ ØªØ¤Ø¯Ù Ø¥ÙÙ ØªØ¢ÙÙ ÙØªÙÙ Ø§ÙØ£ÙØ¹Ø§Ø¨ Ø§ÙØ³ÙÙÙÙÙÙÙØ© Ø¨Ø³Ø±Ø¹Ø©Ø ÙÙØ§ ÙØ¬Ø¹ÙÙØ§ Ø¨ÙØ¦Ø© ÙØªØ±Ø§ÙÙ Ø§ÙØ¨ÙØªÙØ±ÙØ§.\n\nØ£ÙØ§ Ø¨Ø§ÙÙØ³Ø¨Ø© ÙÙØ¹ÙØ§ÙØ© Ø¨Ø§ÙÙÙØªØ¬Ø§ØªØ ÙØ§ÙØ£ÙØ± ØºØ§ÙØ© ÙÙ Ø§ÙØ¨Ø³Ø§Ø·Ø© ÙÙÙÙÙ ÙØªØ·ÙØ¨ Ø§Ø³ØªÙØ±Ø§Ø±ÙØ©: \n1. Ø§ØºØ³Ù Ø§ÙÙÙØªØ¬ ÙØ¨Ø§Ø´Ø±Ø© Ø¨Ø¹Ø¯ Ø§ÙØ§Ø³ØªØ®Ø¯Ø§Ù Ø¨Ø§ÙÙØ§Ø¡ Ø§ÙØ¯Ø§ÙØ¦ ÙØµØ§Ø¨ÙÙ ÙØ¶Ø§Ø¯ ÙÙØ¨ÙØªÙØ±ÙØ§ ØºÙØ± ÙØ¹Ø·Ø±Ø Ø£Ù Ø§Ø³ØªØ®Ø¯Ù Ø¨Ø®Ø§Ø® ØªÙØ¸ÙÙ Ø§ÙØ£ÙØ¹Ø§Ø¨ Ø§ÙÙØ®ØµØµ.\n2. ØªØ¬ÙØ¨ ØºÙØ± Ø§ÙØ£Ø¬Ø²Ø§Ø¡ Ø§ÙÙÙØ±Ø¨Ø§Ø¦ÙØ© ÙÙ Ø§ÙÙØ§Ø¡ ÙØ§ ÙÙ ÙÙÙ Ø§ÙÙÙØªØ¬ ÙØµÙÙØ§Ù ÙÙÙØ§ÙÙ ÙÙÙØ§Ø¡ Ø¨Ø§ÙÙØ§ÙÙ (Waterproof).\n3. Ø¬ÙÙ Ø§ÙÙÙØªØ¬ Ø¨ÙØ·Ø¹Ø© ÙÙØ§Ø´ ÙØ¸ÙÙØ© ÙØ§ ØªØªØ±Ù ÙØ¨Ø±Ø£Ø ÙØ¯Ø¹Ù ÙØ¬Ù ØªÙØ§ÙØ§Ù ÙÙ Ø§ÙÙÙØ§Ø¡.\n4. Ø§Ø­ÙØ¸ ÙÙ ÙÙØªØ¬ ÙÙ Ø­ÙÙØ¨ØªÙ Ø§ÙØ®Ø§ØµØ© Ø§ÙÙØµÙÙØ¹Ø© ÙÙ Ø§ÙÙÙØ§Ø´ (Ø§ÙÙØ®ÙÙ Ø£Ù Ø§ÙØ³Ø§ØªØ§Ù) Ø¨Ø¹ÙØ¯Ø§Ù Ø¹Ù Ø£Ø´Ø¹Ø© Ø§ÙØ´ÙØ³ Ø§ÙÙØ¨Ø§Ø´Ø±Ø© ÙØ§ÙØ­Ø±Ø§Ø±Ø©Ø ÙÙØ§ ØªØ®Ø²Ù Ø§ÙÙÙØªØ¬Ø§Øª Ø§ÙØ³ÙÙÙÙÙÙÙØ© ÙÙØ§ÙØ³Ø© ÙØ¨Ø¹Ø¶ÙØ§ Ø§ÙØ¨Ø¹Ø¶ ÙØ£ÙÙØ§ ÙØ¯ ØªØªÙØ§Ø¹Ù ÙØªÙØªØµÙ.',
    contentEn: 'Water-based lubes are essential for comfort and safety. They are compatible with condoms and silicone toys. Oil-based lubes destroy silicone. Clean toys immediately with warm water and antibacterial soap, dry with a lint-free cloth, and store in a cool, dry cloth bag.',
    readTime: '4 Ø¯ÙØ§Ø¦Ù',
    category: 'ØµØ­Ø© ÙØ¹ÙØ§ÙØ©',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500&auto=format&fit=crop',
    date: '2026-02-10'
  },
  {
    id: 'art-3',
    title: 'ÙØ³Ø± Ø§ÙØ±ÙØªÙÙ Ø§ÙØ²ÙØ¬Ù: Ø£ÙÙØ§Ø± ÙØ¥Ø¹Ø§Ø¯Ø© Ø§ÙØ­ÙÙÙØ© ÙÙØ¹ÙØ§ÙØ© Ø§ÙØ­ÙÙÙØ©',
    titleEn: 'Breaking the Routine: Ideas to Revitalize Intimacy',
    content: 'Ø§ÙØ±ÙØªÙÙ ÙÙ Ø§ÙØ¹Ø¯Ù Ø§ÙØ£ÙÙ ÙÙØ¹ÙØ§ÙØ§Øª Ø§ÙØ²ÙØ¬ÙØ© Ø·ÙÙÙØ© Ø§ÙØ£ÙØ¯Ø ÙÙÙ Ø§ÙØ·Ø¨ÙØ¹Ù Ø¬Ø¯Ø§Ù Ø£Ù ØªÙØ± Ø§ÙØ¹ÙØ§ÙØ© Ø§ÙØ­ÙÙÙØ© Ø¨ÙØªØ±Ø§Øª ÙÙ Ø§ÙØ±ÙÙØ¯ Ø¨Ø³Ø¨Ø¨ Ø¶ØºÙØ· Ø§ÙØ­ÙØ§Ø©Ø Ø§ÙØ¹ÙÙØ ÙØ§ÙØ£Ø¨ÙØ§Ø¡. ÙÙÙ Ø§ÙØ®Ø¨Ø± Ø§ÙØ³Ø§Ø± ÙÙ Ø£Ù Ø¥Ø¹Ø§Ø¯Ø© Ø§ÙØ´ØºÙ ÙØ§ÙØ­ÙÙÙØ© Ø£ÙØ± ÙÙÙÙ ØªÙØ§ÙØ§Ù ÙÙØ­ØªØ§Ø¬ ÙÙØ· Ø¥ÙÙ Ø§ÙÙÙÙÙ ÙÙ Ø§ÙØªØ®Ø·ÙØ· ÙØ§ÙÙØ¨Ø§Ø¯Ø±Ø©.\n\nØ¥ÙÙÙÙ Ø¨Ø¹Ø¶ Ø§ÙØ£ÙÙØ§Ø± Ø§ÙÙØ¬Ø±Ø¨Ø© ÙØ§ÙÙØ¨ØªÙØ±Ø©:\n1. **ØªØºÙÙØ± Ø§ÙØ¨ÙØ¦Ø© ÙØ§ÙØªÙÙÙØª:** ÙÙØ³ ÙÙ Ø§ÙØ¶Ø±ÙØ±Ù Ø£Ù ØªÙÙÙ Ø§ÙØ¹ÙØ§ÙØ© Ø¯Ø§Ø¦ÙØ§Ù ÙÙ ØºØ±ÙØ© Ø§ÙÙÙÙ ÙÙÙ ÙÙØ§ÙØ© Ø§ÙÙÙÙ Ø¹ÙØ¯ÙØ§ ÙÙÙÙ Ø§ÙØ¥Ø±ÙØ§Ù ÙÙ Ø£ÙØ¬Ù. Ø¬Ø±Ø¨ÙØ§ Ø£ÙÙØ§ØªØ§Ù ÙØ®ØªÙÙØ© ÙØ¹Ø·ÙØ© ÙÙØ§ÙØ© Ø§ÙØ£Ø³Ø¨ÙØ¹ ØµØ¨Ø§Ø­Ø§ÙØ Ø£Ù ÙÙÙÙÙÙ Ø§ÙØ­Ø¬Ø² ÙÙ ÙÙØ¯Ù ÙÙÙÙ ÙØ§Ø­Ø¯ ÙØªØºÙÙØ± Ø§ÙØ£Ø¬ÙØ§Ø¡ ØªÙØ§ÙØ§Ù.\n2. **Ø§ÙØªØ¯ÙÙÙ Ø§ÙØ±ÙÙØ§ÙØ³Ù Ø§ÙÙØªØ¨Ø§Ø¯Ù:** Ø®ØµØµÙØ§ ÙÙÙØ© ÙØ§ÙÙØ© ÙÙØªØ¯ÙÙÙ ÙÙØ· Ø¨Ø¯ÙÙ Ø£Ù ØªÙÙØ¹Ø§Øª Ø£Ø®Ø±Ù. Ø§Ø³ØªØ®Ø¯Ø§Ù Ø´ÙÙØ¹ Ø§ÙÙØ³Ø§Ø¬ Ø§ÙØ¹Ø·Ø±ÙØ© Ø§ÙØ¯Ø§ÙØ¦Ø© ÙØ§ÙÙÙØ³ÙÙÙ Ø§ÙÙØ§Ø¯Ø¦Ø© ÙØ®ÙÙ Ø¬ÙØ§Ù ÙÙ Ø§ÙØ§Ø³ØªØ±Ø®Ø§Ø¡ Ø§ÙØ¹ÙÙÙ ÙÙÙØ±Ø¨ Ø§ÙÙØ³Ø§ÙØ§Øª Ø§ÙØ¬Ø³Ø¯ÙØ© ÙØ§ÙØ¹Ø§Ø·ÙÙØ©.\n3. **Ø§ÙØ£ÙØ¹Ø§Ø¨ Ø§ÙØªÙÙØ±ÙØ© ÙØ§ÙÙØ§ÙØ¬Ø±Ù:** ØªØ¬Ø±Ø¨Ø© Ø£Ø²ÙØ§Ø¡ ØªÙÙØ±ÙØ© Ø£Ù Ø£Ø·ÙÙ ÙØ§ÙØ¬Ø±Ù Ø¬Ø±ÙØ¦Ø© ÙØ¬Ø¯ÙØ¯Ø© ÙÙÙØ§Ù ØªÙØ³Ø± Ø§ÙØµÙØ±Ø© Ø§ÙÙÙØ·ÙØ© Ø§ÙÙØ¹ØªØ§Ø¯Ø© ÙØªØ«ÙØ± Ø§ÙÙØ¶ÙÙ ÙØ§ÙØ¥Ø¹Ø¬Ø§Ø¨ ÙØ¬Ø¯Ø¯Ø§Ù.\n4. **Ø¥Ø¯Ø®Ø§Ù ÙÙØ§Ø¬Ø¢Øª Ø¬Ø¯ÙØ¯Ø©:** ÙØ«Ù Ø§Ø³ØªØ®Ø¯Ø§Ù Ø¹ØµØ§Ø¨Ø© Ø§ÙØ¹ÙÙÙÙ (Ø­Ø¬Ø¨ Ø­Ø§Ø³Ø© Ø§ÙØ¨ØµØ± ÙØ¶Ø§Ø¹Ù Ø§ÙØ´Ø¹ÙØ± Ø¨ÙÙØ³Ø§Øª Ø§ÙØ´Ø±ÙÙ ÙÙØ«ÙØ± Ø§ÙØ­ÙØ§Ø³) Ø£Ù ØªØ¬Ø±Ø¨Ø© Ø¬ÙØ§Ø² Ø§ÙØªØ²Ø§Ø²Ù Ø¬Ø¯ÙØ¯ ÙØªÙ Ø§ÙØªØ­ÙÙ ÙÙÙ Ø¹Ù Ø¨Ø¹Ø¯.\n\nØªØ°ÙØ±ÙØ§ Ø¯ÙÙØ§Ù Ø£Ù Ø§ÙØªÙØ§ØµÙ ÙØ§ÙØªØ¹Ø¨ÙØ± Ø¹Ù Ø§ÙÙØ´Ø§Ø¹Ø± ÙØ§ÙØªÙØ¯ÙØ± Ø§ÙÙØªØ¨Ø§Ø¯Ù ÙÙ Ø§ÙÙÙÙØ¯ Ø§ÙØ­ÙÙÙÙ ÙØ£Ù Ø¹ÙØ§ÙØ© Ø­ÙÙÙØ© ÙØ§Ø¬Ø­Ø©.',
    contentEn: 'Routine can dampen long-term intimacy. Revitalize it by changing environments, booking a hotel, dedicating a night to mutual massage with warm candles, using blindfolds, or trying new lingerie/toys. Open communication is the fuel of intimacy.',
    readTime: '6 Ø¯ÙØ§Ø¦Ù',
    category: 'Ø¹ÙØ§ÙØ§Øª Ø²ÙØ¬ÙØ©',
    image: 'https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?q=80&w=500&auto=format&fit=crop',
    date: '2026-02-05'
  }
];
