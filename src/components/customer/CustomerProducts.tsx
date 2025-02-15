
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/customer";

interface CustomerProductsProps {
  products: Product[];
}

export const CustomerProducts = ({ products }: CustomerProductsProps) => {
  if (products.length === 0) {
    return (
      <Card className="p-6 bg-white shadow-sm border-0 text-center">
        <p className="text-[#2A2A2A]/70">No products found for this customer</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map((product) => (
        <Card key={product.id} className="p-4 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-semibold text-[#111111]">{product.model}</h3>
              <div className="space-y-1">
                <p className="text-sm text-[#2A2A2A]/70">Category: {product.product_category}</p>
                <p className="text-sm text-[#2A2A2A]/70">Scheme: {product.scheme}</p>
              </div>
              <div className="space-y-1 mt-3">
                <p className="text-sm">
                  Purchase: £{product.purchase_price_including_VAT?.toFixed(2)} 
                  <span className="text-[#2A2A2A]/50 ml-2">
                    ({product.purchase_date ? format(new Date(product.purchase_date), 'MMM d, yyyy') : 'N/A'})
                  </span>
                </p>
                {product.sale_date && (
                  <p className="text-sm">
                    Sale: £{product.sale_price_including_VAT?.toFixed(2)}
                    <span className="text-[#2A2A2A]/50 ml-2">
                      ({format(new Date(product.sale_date), 'MMM d, yyyy')})
                    </span>
                  </p>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs ${
              product.in_stock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.in_stock ? 'In Stock' : 'Sold'}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
