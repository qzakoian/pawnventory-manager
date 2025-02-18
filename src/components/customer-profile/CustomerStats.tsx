
import { Product } from "@/types/customer";

interface CustomerStatsProps {
  products: Product[];
}

export const CustomerStats = ({ products }: CustomerStatsProps) => {
  const totalValue = products.reduce((sum, p) => sum + (p.purchase_price_including_VAT || 0), 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-card rounded-xl">
        <div className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Products</h3>
          <p className="text-3xl font-semibold text-[#2A2A2A]">{products.length}</p>
          <p className="text-sm text-gray-400 mt-1">All time</p>
        </div>
      </div>
      <div className="glass-card rounded-xl">
        <div className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">In Stock</h3>
          <p className="text-3xl font-semibold text-[#2A2A2A]">
            {products.filter(p => p.in_stock).length}
          </p>
          <p className="text-sm text-gray-400 mt-1">Current inventory</p>
        </div>
      </div>
      <div className="glass-card rounded-xl">
        <div className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">Sold</h3>
          <p className="text-3xl font-semibold text-[#2A2A2A]">
            {products.filter(p => !p.in_stock).length}
          </p>
          <p className="text-sm text-gray-400 mt-1">All time</p>
        </div>
      </div>
      <div className="glass-card rounded-xl">
        <div className="p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Value</h3>
          <p className="text-3xl font-semibold text-[#2A2A2A]">
            £{totalValue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400 mt-1">Purchase price</p>
        </div>
      </div>
    </div>
  );
};
