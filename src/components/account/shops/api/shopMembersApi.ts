
import { supabase } from "@/integrations/supabase/client";
import type { Shop, ShopMember } from '../types';

export const checkUserAccess = async (userId: string | undefined, shopId: number) => {
  if (!userId) return { isOwner: false, isAdmin: false };
  
  try {
    const { data, error } = await supabase
      .from('User-Shop links')
      .select('access_type')
      .eq('shop_id', shopId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      isOwner: data?.access_type === 'owner',
      isAdmin: data?.access_type === 'admin'
    };
  } catch (error) {
    console.error('Error checking user access:', error);
    return { isOwner: false, isAdmin: false };
  }
};

export const fetchShopMembers = async (shopId: number) => {
  const { data: linkData, error: linkError } = await supabase
    .from('User-Shop links')
    .select('id, user_id, access_type')
    .eq('shop_id', shopId);

  if (linkError) throw linkError;

  if (!linkData) {
    return [];
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

  return Promise.all(memberPromises);
};

export const addShopMember = async (email: string, shopId: number, role: 'admin' | 'staff') => {
  const { data: userData, error: userError } = await supabase
    .from('Users')
    .select('id')
    .eq('email', email)
    .single();

  if (userError) throw userError;

  const { error: linkError } = await supabase
    .from('User-Shop links')
    .insert({
      user_id: userData.id,
      shop_id: shopId,
      access_type: role,
    });

  if (linkError) throw linkError;
};

export const updateMemberRole = async (memberId: number, newRole: 'admin' | 'staff') => {
  const { error } = await supabase
    .from('User-Shop links')
    .update({ access_type: newRole })
    .eq('id', memberId);

  if (error) throw error;
};

export const removeMember = async (memberId: number) => {
  const { error } = await supabase
    .from('User-Shop links')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
};
