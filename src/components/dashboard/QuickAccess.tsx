
import { CustomerSearch } from "@/components/customer/CustomerSearch";
import { ProductSearch } from "@/components/product/ProductSearch";

interface QuickAccessProps {
  shopId: number;
}

export const QuickAccess = ({ shopId }: QuickAccessProps) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-[#111111] mb-4">Quick access</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <CustomerSearch shopId={shopId} />
        <ProductSearch shopId={shopId} />
      </div>
    </section>
  );
};
