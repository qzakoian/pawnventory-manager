
import { Shop, ShopMember } from './types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X } from "lucide-react";
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

interface MemberManagementSheetProps {
  shop: Shop;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isShopOwner: boolean;
  members: ShopMember[];
  newMemberEmail: string;
  setNewMemberEmail: (email: string) => void;
  newMemberRole: 'admin' | 'staff';
  setNewMemberRole: (role: 'admin' | 'staff') => void;
  onAddMember: (shopId: number) => void;
  onUpdateRole: (memberId: number, newRole: 'admin' | 'staff', shop: Shop) => void;
  onRemoveMember: (memberId: number, shop: Shop) => void;
}

export function MemberManagementSheet({
  shop,
  isOpen,
  onOpenChange,
  isShopOwner,
  members,
  newMemberEmail,
  setNewMemberEmail,
  newMemberRole,
  setNewMemberRole,
  onAddMember,
  onUpdateRole,
  onRemoveMember,
}: MemberManagementSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isShopOwner ? "Manage Shop Members" : "Shop Members"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {isShopOwner && (
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
                  onClick={() => onAddMember(shop.id)}
                  disabled={!newMemberEmail}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

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
                  {isShopOwner && member.access_type !== 'owner' && (
                    <div className="flex gap-2">
                      <Select
                        value={member.access_type}
                        onValueChange={(value: 'admin' | 'staff') => 
                          onUpdateRole(member.id, value, shop)
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
                        onClick={() => onRemoveMember(member.id, shop)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
