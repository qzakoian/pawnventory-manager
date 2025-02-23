
import { useState } from "react";
import { Store, Pencil, Check, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Shop {
  id: number;
  name: string | null;
  profile_picture?: string | null;
}

interface ShopsListProps {
  shops: Shop[];
}

export function ShopsList({ shops }: ShopsListProps) {
  const [editingShop, setEditingShop] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const { toast } = useToast();

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop.id);
    setNewName(shop.name || "");
  };

  const handleCancel = () => {
    setEditingShop(null);
    setNewName("");
  };

  const handleSave = async (shopId: number) => {
    try {
      const { error } = await supabase
        .from('Shops')
        .update({ name: newName })
        .eq('id', shopId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shop name updated successfully",
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating shop name:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shop name. You might not have permission to edit this shop.",
      });
    }

    setEditingShop(null);
    setNewName("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, shopId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${shopId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('shop-profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('shop-profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('Shops')
        .update({ profile_picture: publicUrl })
        .eq('id', shopId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Shop profile picture updated successfully",
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error uploading shop profile picture:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload shop profile picture",
      });
    }
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
        <div
          key={shop.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="relative group">
              <Avatar className="h-10 w-10 mr-3">
                {shop.profile_picture ? (
                  <AvatarImage 
                    src={shop.profile_picture} 
                    alt={shop.name || 'Shop'}
                    className="object-contain"
                  />
                ) : (
                  <AvatarFallback>
                    <Store className="h-5 w-5 text-gray-500" />
                  </AvatarFallback>
                )}
              </Avatar>
              <label
                htmlFor={`shop-image-${shop.id}`}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Upload className="h-4 w-4 text-white" />
                <input
                  type="file"
                  id={`shop-image-${shop.id}`}
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, shop.id)}
                  className="hidden"
                />
              </label>
            </div>
            {editingShop === shop.id ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="max-w-[200px]"
                autoFocus
              />
            ) : (
              <span className="font-medium">{shop.name}</span>
            )}
          </div>
          <div className="flex gap-2">
            {editingShop === shop.id ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSave(shop.id)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(shop)}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
