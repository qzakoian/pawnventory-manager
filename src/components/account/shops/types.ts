
export interface Shop {
  id: number;
  name: string | null;
  profile_picture?: string | null;
}

export interface ShopMember {
  id: number;
  user_id: string;
  email: string;
  access_type: 'owner' | 'admin' | 'staff';
}

export interface ShopsManagerProps {
  shops: Shop[];
}
