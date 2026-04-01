
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_blocked: boolean;
  created_at: string;
}

export type ItemStatus = 'available' | 'reserved' | 'sold';

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  pickup_location: string;
  available_till: string;
  category_id: number;
  status: ItemStatus;
  seller_id: number;
  seller: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at: string;
  };
  image_url: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export type ReservationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface Reservation {
  id: number;
  item_id: number;
  buyer_id: number;
  status: ReservationStatus;
  created_at: string;
  item?: Item;
  buyer?: User;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
