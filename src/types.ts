
export interface ProductVariant {
  name: string;
  nameEn: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  image: string;
  images?: string[];
  category: 'Sex Toys' | 'Vibrators' | 'Male Toys' | 'Dildos' | 'Lingerie' | 'BDSM' | 'Holiday Collection' | 'New Arrivals';
  rating: number;
  reviewsCount: number;
  stock: number;
  isNew?: boolean;
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  date: string;
  dateKey?: string;
  status: 'pending' | 'shipping' | 'delivered' | 'cancelled';
}

export interface AdviceArticle {
  id: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  readTime: string;
  category: string;
  image: string;
  date: string;
}
