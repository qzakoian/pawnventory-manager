
import { useState, useEffect } from "react";
import { Store } from "lucide-react";
import { useShopMembers } from "./shops/useShopMembers";
import { MemberManagementSheet } from "./shops/MemberManagementSheet";
import { ShopListItem } from "./shops/ShopListItem";
import { Sheet } from "@/components/ui/sheet";
import type { Shop } from "./shops/types";

interface ShopsManagerProps {
  shops: Shop[];
}

export function ShopsManager({ shops }: ShopsManagerProps) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {
    members,
    isShopOwner,
    newMemberEmail,
    setNewMemberEmail,
    newMemberRole,
    setNewMemberRole,
    loadShopMembers,
    handleAddMember,
    handleUpdateRole,
    handleRemoveMember,
    initializeOwnerStatus
  } = useShopMembers();

  useEffect(() => {
    // Initialize owner status for the first shop if available
    if (shops.length > 0) {
      initializeOwnerStatus(shops[0].id);
    }
  }, [shops]);

  const handleMemberManage = (shop: Shop) => {
    setSelectedShop(shop);
    loadShopMembers(shop);
    setIsSheetOpen(true);
  };

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
        <ShopListItem
          key={shop.id}
          shop={shop}
          isShopOwner={isShopOwner}
          onMemberManage={() => handleMemberManage(shop)}
        />
      ))}
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {selectedShop && (
          <MemberManagementSheet
            shop={selectedShop}
            isOpen={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            isShopOwner={isShopOwner}
            members={members}
            newMemberEmail={newMemberEmail}
            setNewMemberEmail={setNewMemberEmail}
            newMemberRole={newMemberRole}
            setNewMemberRole={setNewMemberRole}
            onAddMember={handleAddMember}
            onUpdateRole={handleUpdateRole}
            onRemoveMember={handleRemoveMember}
          />
        )}
      </Sheet>
    </div>
  );
}
