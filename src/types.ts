export interface Product {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  description: string;
  origin: string;
  roast: string;
  process: string;
  flavor: string[];
  image: string;
  emoji: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = '全部' | '單品豆' | '調和豆' | '掛耳包';
