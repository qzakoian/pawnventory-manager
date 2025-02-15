
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface ProfilePictureProps {
  profileUrl: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePicture({ profileUrl, onImageUpload }: ProfilePictureProps) {
  return (
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
          onChange={onImageUpload}
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
  );
}
