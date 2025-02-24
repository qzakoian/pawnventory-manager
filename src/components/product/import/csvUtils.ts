
import Papa from 'papaparse';
import { supabase } from "@/integrations/supabase/client";
import { ALL_COLUMNS } from './types';

export async function downloadCustomersList(shopId: number) {
  const { data: customers } = await supabase
    .from('Customers')
    .select('id, first_name, last_name, email')
    .eq('shop_id', shopId);

  const csvContent = Papa.unparse({
    fields: ['id', 'first_name', 'last_name', 'email'],
    data: customers || []
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'customers_list.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadTemplateCSV() {
  const headers = [
    'model',
    'brand',
    'product_category',
    'scheme',
    'purchase_date',
    'purchase_price_including_VAT',
    'imei',
    'sku',
    'customer_id'
  ];

  const csvContent = Papa.unparse({
    fields: headers,
    data: [
      {
        model: 'iPhone 13',
        brand: 'Apple',
        product_category: 'Phones',
        scheme: 'sale',
        purchase_date: '2024-03-20',
        purchase_price_including_VAT: '499.99',
        imei: '123456789012345',
        sku: 'IP13-001',
        customer_id: '1'
      }
    ]
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'product_import_template.csv';
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

export function validateAndTransformProducts(
  csvData: any[],
  columnMapping: { [key: string]: string },
  shopId: number
) {
  return csvData.map(row => {
    const transformed: any = { 
      shop_id: shopId,
      in_stock: true,
      creation_date: new Date().toISOString()
    };
    
    Object.entries(columnMapping).forEach(([csvCol, dbCol]) => {
      const value = row[csvCol]?.trim();
      if (value) {
        if (dbCol === 'purchase_price_including_VAT') {
          transformed[dbCol] = parseFloat(value);
        } else if (dbCol === 'customer_id') {
          transformed[dbCol] = parseInt(value, 10);
        } else {
          transformed[dbCol] = value;
        }
      }
    });
    return transformed;
  }).filter(product => product.model && product.model.trim() !== '');
}
