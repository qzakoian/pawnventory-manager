
import { Store } from "lucide-react";

interface Shop {
  id: number;
  name: string | null;
}

interface ShopsListProps {
  shops: Shop[];
}

export function ShopsList({ shops }: ShopsListProps) {
  if (shops.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No shops found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {shops.map((shop) => (
        <div
          key={shop.id}
          className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Store className="h-5 w-5 mr-3 text-gray-500" />
          <span className="font-medium">{shop.name}</span>
        </div>
      ))}
    </div>
  );
}
