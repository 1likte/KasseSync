export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category_id?: string;
  portion?: number;
  subtitle?: string;
  note?: string;
}

export interface Session {
  id: string; // e.g. "table-12", "takeaway-1"
  type: 'table' | 'takeaway';
  name: string; // Customer name or Table name
  pax?: number;
  phone?: string;
  address?: string;
  items: CartItem[];
  createdAt: Date;
  note?: string;
  discount?: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  pax: number;
  tableId?: string;
  note?: string;
  email?: string;
}
