
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountTabs } from "@/components/account/AccountTabs";
import { useAccountSettings } from "@/hooks/useAccountSettings";

export default function AccountSettings() {
  const { form, profileUrl, shops, handleSubmit, handleImageUpload } = useAccountSettings();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 max-w-2xl">
        <AccountHeader />
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountTabs
              form={form}
              onSubmit={handleSubmit}
              profileUrl={profileUrl}
              onImageUpload={handleImageUpload}
              shops={shops}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
