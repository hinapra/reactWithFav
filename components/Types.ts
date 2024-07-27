export interface ApiItem {
  items_id: number;
  code: string;
  grade: string;
  make?: string | null;
  rate: string;
  size: string;
  category: string;
  created_at: string;
  favorites: boolean;
}

export interface FavoritesItem {
  favorites_id: number;
  code: string;
  grade: string;
  make: string | null;
  rate: string;
  size: string;
  category: string;
  broker_id: number;
  items_id: number;
  created_at: string;
}

export interface orderApi {
  order_lists_id: number;
  status: string;
  order_count: number;
  broker_id: number;
  created_at: string;
  client_name: string;
}

export interface OrderDetailData {
  orders_id: number;
  code: string;
  grade: string;
  make: string;
  rate: string;
  order_lists_id: number;
  qauntity: number;
  total: string;
  status: string;
  category: string;
  broker_id: number;
  item_id: number;
  created_at: string;
}

export type ItemUnion = ApiItem | orderApi | OrderDetailData | FavoritesItem;
