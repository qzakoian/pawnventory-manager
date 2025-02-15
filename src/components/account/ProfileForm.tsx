
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export const formSchema = z.object({
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

interface ProfileFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

export function ProfileForm({ form, onSubmit }: ProfileFormProps) {
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = form.getValues();
    await onSubmit({
      ...values,
      current_password: undefined,
      new_password: undefined,
      confirm_password: undefined,
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.getValues('new_password')) {
      await onSubmit({
        ...form.getValues(),
        first_name: form.getValues('first_name'),
        last_name: form.getValues('last_name'),
      });
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Profile Information Form */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
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

          <Button type="submit" className="w-full">
            Update Profile
          </Button>
        </form>

        {/* Password Change Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
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

            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
}
