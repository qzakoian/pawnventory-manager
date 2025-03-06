export interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  phone_number: string | null;
  email: string | null;
  gender: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  county: string | null;
  customer_type: "individual" | "company" | null;
  company_name: string | null;
  vat_number: string | null;
  shop_id: number | null;
}

export interface Product {
  id: number;
  model: string | null;
  brand: string | null;
  product_category: string | null;
  scheme: string | null;
  purchase_date: string | null;
  sale_date: string | null;
  purchase_price_including_VAT: number | null;
  sale_price_including_VAT: number | null;
  in_stock: boolean | null;
  imei: string | null;
  sku: string | null;
  "12-week-buy-back_price"?: number;
  "12-week-buy-back_rate"?: number;
  "28-day-buy-back_price"?: number;
  "28-day-buy-back_rate"?: number;
  creation_date?: string;
  customer_id?: number;
  customer?: Customer | null;
}

export interface NewProduct {
  model: string;
  brand: string;
  product_category: string;
  scheme: string;
  purchase_price_including_VAT: number;
  purchase_date: string;
}

export interface ProductInfo {
  model?: string | null;
  brand?: string | null;
  category?: string | null;
  imei?: string | null;
  sku?: string | null;
}

export interface EditCustomer {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: "Male" | "Female" | "Prefer not to say";
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  county: string;
  customer_type: "individual" | "company";
  company_name: string;
  vat_number: string;
}
