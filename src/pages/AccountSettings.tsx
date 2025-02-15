
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Store } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  current_password: z.string().optional(),
  new_password: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirm_password: z.string().optional(),
}).refine((data) => {
  if (data.new_password && !data.current_password) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to change password",
  path: ["current_password"],
}).refine((data) => {
  if (data.new_password !== data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

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

        // Fetch shops
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

      // Update name in Users table
      const { error: updateError } = await supabase
        .from('Users')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
        })
        .eq('email', user.email);

      if (updateError) throw updateError;

      // Update password if provided
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

      // Upload the file
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update the profile picture URL in the database
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
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileUrl || undefined} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-picture"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('profile-picture')?.click()}
                  >
                    Change Picture
                  </Button>
                </div>
              </div>

              {/* Profile Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="current_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="shops" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  {shops.map((shop) => (
                    <div
                      key={shop.id}
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Store className="h-5 w-5 mr-3 text-gray-500" />
                      <span className="font-medium">{shop.name}</span>
                    </div>
                  ))}
                </div>
                {shops.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No shops found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
