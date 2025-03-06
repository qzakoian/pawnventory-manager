
export interface ImportCustomersDialogProps {
  shopId: number;
}

export interface CSVCustomer {
  first_name?: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  county?: string;
}

export interface ColumnMapping {
  [key: string]: string;
}

export const REQUIRED_COLUMNS = ['last_name'];
export const OPTIONAL_COLUMNS = [
  'first_name',
  'email',
  'phone_number',
  'gender',
  'address_line1',
  'address_line2',
  'city',
  'postal_code',
  'county'
];
export const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];
