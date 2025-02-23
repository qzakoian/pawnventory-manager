
import { useState } from "react";
import { Shop } from './types';
import { Store, Pencil, Check, X, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ShopListItemProps {
  shop: Shop;
  isShopOwner: boolean;
  onMemberManage: () => void;
}

export function ShopListItem({ shop, isShopOwner, onMemberManage }: ShopListItemProps) {
  const [editingShop, setEditingShop] = useState(false);
  const [newName, setNewName] = useState(shop.name || "");
  const { toast } = useToast();

  const handleEdit = () => {
    setEditingShop(true);
    setNewName(shop.name || "");
  };

  const handleCancel = () => {
    setEditingShop(false);
    setNewName("");
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('Shops')
        .update({ name: newName })
        .eq('id', shop.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shop name updated successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error updating shop name:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shop name",
      });
    }

    setEditingShop(false);
    setNewName("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${shop.id}-${Date.now()}.${fileExt}`;

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
        .eq('id', shop.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Shop profile picture updated successfully",
      });

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

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <div className="relative group">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage 
              src={shop.profile_picture || ''}
              alt={shop.name || 'Shop'}
            />
            <AvatarFallback>
              <Store className="h-5 w-5 text-gray-500" />
            </AvatarFallback>
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
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        {editingShop ? (
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
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onMemberManage}
          >
            <Users className="h-4 w-4 mr-2" />
            {isShopOwner ? "Manage Members" : "View Members"}
          </Button>
        </SheetTrigger>
        {editingShop ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
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
            onClick={handleEdit}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
