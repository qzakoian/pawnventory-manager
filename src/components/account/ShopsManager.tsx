
import { useState, useEffect } from "react";
import { Store, Plus } from "lucide-react";
import { useShopMembers } from "./shops/hooks/useShopMembers";
import { MemberManagementSheet } from "./shops/MemberManagementSheet";
import { ShopListItem } from "./shops/ShopListItem";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Shop } from "./shops/types";

interface ShopsManagerProps {
  shops: Shop[];
}

export function ShopsManager({ shops }: ShopsManagerProps) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newShopName, setNewShopName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
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

  const handleCreateShop = async () => {
    if (!newShopName.trim() || !user) return;

    setIsCreating(true);
    try {
      // Insert the new shop
      const { data: shopData, error: shopError } = await supabase
        .from('Shops')
        .insert({ name: newShopName.trim() })
        .select()
        .single();

      if (shopError) throw shopError;

      // Create the owner link for the user
      const { error: linkError } = await supabase
        .from('User-Shop links')
        .insert({
          user_id: user.id,
          shop_id: shopData.id,
          access_type: 'owner'
        });

      if (linkError) throw linkError;

      toast({
        title: "Success",
        description: "Shop created successfully",
      });

      setIsCreateDialogOpen(false);
      setNewShopName("");

      // Refresh the page to show the new shop
      window.location.reload();
    } catch (error) {
      console.error('Error creating shop:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create shop",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (shops.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-gray-500">No shops found</p>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="mt-4"
        >
          <Plus className="mr-2" />
          Create Your First Shop
        </Button>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shop</DialogTitle>
              <DialogDescription>
                Enter a name for your new shop. You'll be assigned as the owner.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Shop name"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
              />
              <Button
                onClick={handleCreateShop}
                disabled={!newShopName.trim() || isCreating}
                className="w-full"
              >
                {isCreating ? "Creating..." : "Create Shop"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Shops</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="mr-2" />
          New Shop
        </Button>
      </div>

      <div className="space-y-2">
        {shops.map((shop) => (
          <ShopListItem
            key={shop.id}
            shop={shop}
            isShopOwner={isShopOwner}
            onMemberManage={() => handleMemberManage(shop)}
          />
        ))}
      </div>
      
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Shop</DialogTitle>
            <DialogDescription>
              Enter a name for your new shop. You'll be assigned as the owner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Shop name"
              value={newShopName}
              onChange={(e) => setNewShopName(e.target.value)}
            />
            <Button
              onClick={handleCreateShop}
              disabled={!newShopName.trim() || isCreating}
              className="w-full"
            >
              {isCreating ? "Creating..." : "Create Shop"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
