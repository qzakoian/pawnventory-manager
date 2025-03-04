
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/customer";

interface ProductsTableProps {
  products: Product[] | undefined;
  isLoading: boolean;
}

export const ProductsTable = ({ products, isLoading }: ProductsTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">IMEI/SKU</TableHead>
            <TableHead className="hidden md:table-cell">Purchase Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Loading products...
              </TableCell>
            </TableRow>
          ) : products?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products?.map((product) => (
              <TableRow 
                key={product.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <TableCell className="font-medium">
                  {product.model}
                </TableCell>
                <TableCell className="hidden md:table-cell">{product.product_category}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.imei && (
                    <div className="text-gray-500">{product.imei}</div>
                  )}
                  {product.sku && (
                    <div className="text-gray-500">{product.sku}</div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.purchase_date ? format(new Date(product.purchase_date), "MMM d, yyyy") : 'N/A'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.in_stock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.in_stock ? 'In Stock' : 'Sold'}
                  </span>
                </TableCell>
                <TableCell>
                  £{product.purchase_price_including_VAT?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell>
                  <ArrowRight className="h-4 w-4 text-[#646ECB]" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
