
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomerHeaderProps {
  firstName: string;
  lastName: string;
}

export const CustomerHeader = ({ firstName, lastName }: CustomerHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="text-[#646ECB] hover:bg-[#646ECB]/10 hover:text-[#646ECB]"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="space-y-2">
        <p className="text-gray-500 text-sm">Customer Profile</p>
        <h1 className="text-3xl font-semibold text-[#2A2A2A]">
          {firstName} {lastName}
        </h1>
      </div>
    </div>
  );
};
