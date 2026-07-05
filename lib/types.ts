export type Category = {
  id: string;
  name: string;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  price: number;
  is_available: boolean;
  image_url?: string | null;
};

export type PosSession = {
  tableNumber: string;
  waiterName: string;
};

export type Restaurant = {
  id: string;
  name: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};
