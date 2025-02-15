
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/customer";

interface CustomerProductsProps {
  products: Product[];
}

export const CustomerProducts = ({ products }: CustomerProductsProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No products found for this customer</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">#{product.id}</TableCell>
              <TableCell>{product.model}</TableCell>
              <TableCell>{product.product_category}</TableCell>
              <TableCell>
                {product.purchase_date ? format(new Date(product.purchase_date), 'dd MMM yyyy') : 'N/A'}
              </TableCell>
              <TableCell>£{product.purchase_price_including_VAT?.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.in_stock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.in_stock ? 'In Stock' : 'Sold'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
