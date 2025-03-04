
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddProductButtonProps {
  onClick: () => void;
}

export const AddProductButton = ({ onClick }: AddProductButtonProps) => {
  const isMobile = useIsMobile();
  
  if (isMobile) return null;
  
  return (
    <button 
      onClick={onClick}
      className="text-[#646ECB] hover:text-[#646ECB]/90 hover:underline inline-flex items-center text-sm mt-4 gap-1.5"
    >
      <Plus className="h-4 w-4" />
      Create Product
    </button>
  );
};
