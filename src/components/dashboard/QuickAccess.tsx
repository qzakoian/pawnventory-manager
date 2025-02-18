
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
        <CustomerSearch shopId={shopId} />
        <ProductSearch shopId={shopId} />
      </div>
    </section>;
};
