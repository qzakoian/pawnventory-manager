
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/components/account/ProfileForm";
import type { z } from "zod";

interface Shop {
  id: number;
  name: string | null;
}

interface ShopLink {
  Shops: Shop | null;
}

export function useAccountSettings() {
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('first_name, last_name, profil_picture, id')
          .eq('email', user.email)
          .single();

        if (userError) throw userError;

        form.reset({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
        });
        setProfileUrl(userData.profil_picture);

        const { data: shopLinks, error: shopError } = await supabase
          .from('User-Shop links')
          .select(`
            Shops:Shops (
              id,
              name
            )
          `)
          .eq('user_id', user.id);

        if (shopError) throw shopError;

        if (shopLinks) {
          const userShops = shopLinks
            .map((link: ShopLink) => link.Shops)
            .filter((shop): shop is Shop => 
              shop !== null && 
              'id' in shop &&
              'name' in shop
            );
          setShops(userShops);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data",
        });
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: updateError } = await supabase
        .from('Users')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
        })
        .eq('email', user.email);

      if (updateError) throw updateError;

      if (values.new_password && values.current_password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: values.new_password
        });

        if (passwordError) throw passwordError;
      }

      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('Users')
        .update({ profil_picture: publicUrl })
        .eq('email', user.email);

      if (updateError) throw updateError;

      setProfileUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture",
      });
    }
  };

  return {
    form,
    profileUrl,
    shops,
    handleSubmit,
    handleImageUpload,
  };
}
