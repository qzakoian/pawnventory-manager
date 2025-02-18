
import { CustomerSearch } from "@/components/customer/CustomerSearch";
import { ProductSearch } from "@/components/product/ProductSearch";

interface QuickAccessProps {
  shopId: number;
}

export const QuickAccess = ({
  shopId
}: QuickAccessProps) => {
  return <section>
      <h2 className="text-xl font-bold mb-4 text-[#454545]">Quick access</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <CustomerSearch shopId={shopId} />
          <a href="/customers/new" className="text-[#646ECB] hover:text-[#646ECB]/90 inline-flex items-center text-sm">
            + Create Customer
          </a>
        </div>
        <div className="space-y-2">
          <ProductSearch shopId={shopId} />
          <a href="/products/new" className="text-[#646ECB] hover:text-[#646ECB]/90 inline-flex items-center text-sm">
            + Create Product
          </a>
        </div>
      </div>
    </section>;
};
