
import Papa from 'papaparse';
import { ALL_COLUMNS, type CSVCustomer } from './types';

export function downloadTemplateCSV() {
  const headers = [
    'last_name',
    'first_name',
    'email',
    'phone_number',
    'address_line1',
    'address_line2',
    'city',
    'postal_code',
    'county'
  ];

  const csvContent = Papa.unparse({
    fields: headers,
    data: [
      {
        last_name: 'Smith',
        first_name: 'John',
        email: 'john.smith@example.com',
        phone_number: '123-456-7890',
        address_line1: '123 Main St',
        address_line2: 'Apt 4B',
        city: 'Springfield',
        postal_code: '12345',
        county: 'Hampshire'
      }
    ]
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'customer_import_template.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function createInitialMapping(headers: string[]) {
  const initialMapping: { [key: string]: string } = {};
  headers.forEach(header => {
    if (ALL_COLUMNS.includes(header)) {
      initialMapping[header] = header;
    }
  });
  return initialMapping;
}

export function validateAndTransformCustomers(
  csvData: any[],
  columnMapping: { [key: string]: string },
  shopId: number
) {
  return csvData.map(row => {
    const transformed: any = { shop_id: shopId };
    Object.entries(columnMapping).forEach(([csvCol, dbCol]) => {
      const value = row[csvCol]?.trim();
      if (value) {
        transformed[dbCol] = value;
      }
    });
    return transformed;
  }).filter(customer => customer.last_name && customer.last_name.trim() !== '');
}
