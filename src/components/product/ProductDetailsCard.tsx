
import { Card } from "@/components/ui/card";
import { Product } from "@/types/customer";

interface ProductDetailsCardProps {
  product: Product;
}

export const ProductDetailsCard = ({
  product
}: ProductDetailsCardProps) => {
  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '£0.00';
    return `£${value.toFixed(2)}`;
  };

  const isBuybackScheme = product.scheme?.includes('buy-back');

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Product Information</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-500">Category</h3>
            <p className="font-medium">{product.product_category}</p>
          </div>
          
          <div>
            <h3 className="text-sm text-gray-500">Scheme</h3>
            <p className="font-medium">{product.scheme}</p>
          </div>
          
          {product.imei && (
            <div>
              <h3 className="text-sm text-gray-500">IMEI</h3>
              <p className="font-medium">{product.imei}</p>
            </div>
          )}
          
          {product.sku && (
            <div>
              <h3 className="text-sm text-gray-500">SKU</h3>
              <p className="font-medium">{product.sku}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-500">Purchase Date</h3>
            <p className="font-medium">
              {product.purchase_date ? new Date(product.purchase_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm text-gray-500">Purchase Price (inc. VAT)</h3>
            <p className="font-medium">{formatCurrency(product.purchase_price_including_VAT)}</p>
          </div>

          {isBuybackScheme && (
            <>
              <div>
                <h3 className="text-sm text-gray-500">Buy-back Rate</h3>
                <p className="font-medium">
                  {product[`${product.scheme}_rate`] ? 
                    `${product[`${product.scheme}_rate`].toFixed(2)}%` : 
                    'N/A'
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Buy-back Price</h3>
                <p className="font-medium">
                  {formatCurrency(product[`${product.scheme}_price`])}
                </p>
              </div>
            </>
          )}
          
          <div>
            <h3 className="text-sm text-gray-500">Status</h3>
            <p className="font-medium">{product.in_stock ? 'In Stock' : 'Not in Stock'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
