
import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shop, ShopMember } from './types';

export function useShopMembers() {
  const [members, setMembers] = useState<ShopMember[]>([]);
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'staff'>('staff');
  const { user } = useAuth();
  const { toast } = useToast();

  const checkOwnerStatus = async (shopId: number) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('User-Shop links')
        .select('access_type')
        .eq('shop_id', shopId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return data?.access_type === 'owner';
    } catch (error) {
      console.error('Error checking owner status:', error);
      return false;
    }
  };

  const loadShopMembers = async (shop: Shop) => {
    try {
      const isOwner = await checkOwnerStatus(shop.id);
      setIsShopOwner(isOwner);

      if (!isOwner) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Only shop owners can manage members",
        });
        return;
      }

      const { data: linkData, error: linkError } = await supabase
        .from('User-Shop links')
        .select('id, user_id, access_type')
        .eq('shop_id', shop.id);

      if (linkError) throw linkError;

      if (!linkData) {
        setMembers([]);
        return;
      }

      const memberPromises = linkData.map(async (link) => {
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('email')
          .eq('id', link.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          return {
            id: link.id,
            user_id: link.user_id,
            email: 'Unknown',
            access_type: link.access_type as 'owner' | 'admin' | 'staff'
          };
        }

        return {
          id: link.id,
          user_id: link.user_id,
          email: userData?.email || 'Unknown',
          access_type: link.access_type as 'owner' | 'admin' | 'staff'
        };
      });

      const formattedMembers = await Promise.all(memberPromises);
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading shop members:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load shop members",
      });
      setMembers([]);
    }
  };

  const handleAddMember = async (shopId: number) => {
    if (!isShopOwner) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only shop owners can add members",
      });
      return;
    }

    try {
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

      await loadShopMembers({ id: shopId, name: null });
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

  const handleUpdateRole = async (memberId: number, newRole: 'admin' | 'staff', shop: Shop) => {
    if (!isShopOwner) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only shop owners can update roles",
      });
      return;
    }

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

      await loadShopMembers(shop);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role",
      });
    }
  };

  const handleRemoveMember = async (memberId: number, shop: Shop) => {
    if (!isShopOwner) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only shop owners can remove members",
      });
      return;
    }

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

      await loadShopMembers(shop);
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member",
      });
    }
  };

  return {
    members,
    isShopOwner,
    newMemberEmail,
    setNewMemberEmail,
    newMemberRole,
    setNewMemberRole,
    loadShopMembers,
    handleAddMember,
    handleUpdateRole,
    handleRemoveMember
  };
}
