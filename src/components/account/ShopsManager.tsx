
import { useState } from "react";
import { Store, Pencil, Check, X, Upload, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Shop {
  id: number;
  name: string | null;
  profile_picture?: string | null;
}

interface ShopMember {
  id: number;
  user_id: string;
  email: string;
  access_type: 'owner' | 'admin' | 'staff';
}

interface ShopsManagerProps {
  shops: Shop[];
}

export function ShopsManager({ shops }: ShopsManagerProps) {
  const [editingShop, setEditingShop] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [members, setMembers] = useState<ShopMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'staff'>('staff');
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

      window.location.reload();
    } catch (error) {
      console.error('Error updating shop name:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shop name",
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

  const loadShopMembers = async (shop: Shop) => {
    try {
      const { data: linkData, error: linkError } = await supabase
        .from('User-Shop links')
        .select('id, user_id, access_type, Users(email)')
        .eq('shop_id', shop.id);

      if (linkError) throw linkError;

      const formattedMembers = linkData.map(link => ({
        id: link.id,
        user_id: link.user_id,
        email: link.Users?.email || 'Unknown',
        access_type: link.access_type,
      }));

      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading shop members:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load shop members",
      });
    }
  };

  const handleAddMember = async (shopId: number) => {
    try {
      // First, check if the user exists
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', newMemberEmail)
        .single();

      if (userError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found",
        });
        return;
      }

      // Add the user to the shop
      const { error: linkError } = await supabase
        .from('User-Shop links')
        .insert({
          user_id: userData.id,
          shop_id: shopId,
          access_type: newMemberRole,
        });

      if (linkError) throw linkError;

      toast({
        title: "Success",
        description: "Member added successfully",
      });

      // Refresh members list
      await loadShopMembers(selectedShop!);
      setNewMemberEmail("");
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add member",
      });
    }
  };

  const handleUpdateRole = async (memberId: number, newRole: 'owner' | 'admin' | 'staff') => {
    try {
      const { error } = await supabase
        .from('User-Shop links')
        .update({ access_type: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role updated successfully",
      });

      // Refresh members list
      await loadShopMembers(selectedShop!);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      const { error } = await supabase
        .from('User-Shop links')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member removed successfully",
      });

      // Refresh members list
      await loadShopMembers(selectedShop!);
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member",
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
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedShop(shop);
                    loadShopMembers(shop);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Manage Shop Members</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Add New Member</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Email address"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                      />
                      <Select
                        value={newMemberRole}
                        onValueChange={(value: 'admin' | 'staff') => setNewMemberRole(value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => handleAddMember(shop.id)}
                        disabled={!newMemberEmail}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Current Members</h3>
                    <div className="space-y-2">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <p className="text-sm font-medium">{member.email}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {member.access_type}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {member.access_type !== 'owner' && (
                              <>
                                <Select
                                  value={member.access_type}
                                  onValueChange={(value: 'admin' | 'staff') => 
                                    handleUpdateRole(member.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
