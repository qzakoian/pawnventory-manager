
export interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  phone_number: string | null;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  county: string | null;
}

export interface Product {
  id: number;
  model: string | null;
  product_category: string | null;
  scheme: string | null;
  purchase_date: string | null;
  sale_date: string | null;
  purchase_price_including_VAT: number | null;
  sale_price_including_VAT: number | null;
  in_stock: boolean | null;
}

export interface NewProduct {
  model: string;
  product_category: string;
  scheme: string;
  purchase_price_including_VAT: number;
  purchase_date: string;
}

export interface EditCustomer {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  county: string;
}
