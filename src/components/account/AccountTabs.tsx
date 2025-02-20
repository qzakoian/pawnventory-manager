
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePicture } from "./ProfilePicture";
import { ProfileForm } from "./ProfileForm";
import { ShopsList } from "./ShopsList";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./ProfileForm";

interface AccountTabsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  profileUrl: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  shops: Array<{
    id: number;
    name: string | null;
  }>;
}

export function AccountTabs({ form, onSubmit, profileUrl, onImageUpload, shops }: AccountTabsProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="shops">Your Shops</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <ProfilePicture 
          profileUrl={profileUrl} 
          onImageUpload={onImageUpload} 
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
  );
}
