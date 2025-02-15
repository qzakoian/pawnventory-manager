
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfilePicture } from "@/components/account/ProfilePicture";
import { ProfileForm, formSchema } from "@/components/account/ProfileForm";
import { ShopsList } from "@/components/account/ShopsList";
import type { z } from "zod";

interface Shop {
  id: number;
  name: string | null;
}

export default function AccountSettings() {
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
            shop_id,
            Shops (
              id,
              name
            )
          `)
          .eq('user_id', userData.id);

        if (shopError) throw shopError;

        const userShops = shopLinks
          .map(link => link.Shops)
          .filter((shop): shop is Shop => shop !== null);

        setShops(userShops);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="shops">Your Shops</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfilePicture 
                profileUrl={profileUrl} 
                onImageUpload={handleImageUpload} 
              />
              <ProfileForm 
                form={form} 
                onSubmit={onSubmit} 
              />
            </TabsContent>

            <TabsContent value="shops" className="space-y-4">
              <ShopsList shops={shops} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
