
export interface ImportProductsDialogProps {
  shopId: number;
}

export interface CSVProduct {
  model: string;
  brand?: string;
  product_category?: string;
  scheme?: string;
  purchase_date?: string;
  purchase_price_including_VAT?: string;
  imei?: string;
  sku?: string;
  customer_id?: string;
}

export interface ColumnMapping {
  [key: string]: string;
}

export const REQUIRED_COLUMNS = ['model'];
export const OPTIONAL_COLUMNS = [
  'brand',
  'product_category',
  'scheme',
  'purchase_date',
  'purchase_price_including_VAT',
  'imei',
  'sku',
  'customer_id'
];
export const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];
