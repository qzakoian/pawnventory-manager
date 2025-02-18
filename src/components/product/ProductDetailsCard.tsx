
import { Card } from "@/components/ui/card";
import { CustomerSelect } from "./CustomerSelect";
import { Product } from "@/types/customer";

interface ProductDetailsCardProps {
  product: Product;
  customers: Array<{ id: number; first_name: string | null; last_name: string | null; }>;
  isLoadingCustomers: boolean;
  onCustomerUpdate: (customerId: number | null) => void;
}

export const ProductDetailsCard = ({
  product,
  customers,
  isLoadingCustomers,
  onCustomerUpdate
}: ProductDetailsCardProps) => {
  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-500">Category</h3>
            <p className="font-medium">{product.product_category}</p>
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

          <CustomerSelect
            customers={customers}
            selectedCustomer={product.customer}
            onCustomerSelect={onCustomerUpdate}
            isLoading={isLoadingCustomers}
          />
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
            <p className="font-medium">£{product.purchase_price_including_VAT?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div>
            <h3 className="text-sm text-gray-500">Status</h3>
            <p className="font-medium">{product.in_stock ? 'In Stock' : 'Not in Stock'}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
