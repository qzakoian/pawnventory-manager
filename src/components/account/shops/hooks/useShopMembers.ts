
import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Shop, ShopMember } from '../types';
import {
  checkUserAccess,
  fetchShopMembers,
  addShopMember,
  updateMemberRole,
  removeMember
} from '../api/shopMembersApi';

export function useShopMembers() {
  const [members, setMembers] = useState<ShopMember[]>([]);
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [isShopAdmin, setIsShopAdmin] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'staff'>('staff');
  const { user } = useAuth();
  const { toast } = useToast();

  const initializeOwnerStatus = async (shopId: number) => {
    const { isOwner, isAdmin } = await checkUserAccess(user?.id, shopId);
    setIsShopOwner(isOwner);
    setIsShopAdmin(isAdmin);
    return isOwner || isAdmin;
  };

  const loadShopMembers = async (shop: Shop) => {
    try {
      await initializeOwnerStatus(shop.id);
      const membersList = await fetchShopMembers(shop.id);
      setMembers(membersList);
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
    if (!isShopOwner && !isShopAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only shop owners and admins can add members",
      });
      return;
    }

    try {
      await addShopMember(newMemberEmail, shopId, newMemberRole);
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
    if (!isShopOwner && !isShopAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only shop owners and admins can update roles",
      });
      return;
    }

    try {
      await updateMemberRole(memberId, newRole);
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
    if (!isShopOwner && !isShopAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only shop owners and admins can remove members",
      });
      return;
    }

    try {
      await removeMember(memberId);
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
    isShopOwner: isShopOwner || isShopAdmin,
    newMemberEmail,
    setNewMemberEmail,
    newMemberRole,
    setNewMemberRole,
    loadShopMembers,
    handleAddMember,
    handleUpdateRole,
    handleRemoveMember,
    initializeOwnerStatus
  };
}
