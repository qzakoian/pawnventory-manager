
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface InventoryItemProps {
  item: {
    id: number;
    name: string;
    category: string;
    condition: string;
    dateReceived: string;
    value: number;
    status: string;
  };
}

export const InventoryItem = ({ item }: InventoryItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "bg-green-100 text-green-800";
      case "on hold":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-4 glass-card hover-transform">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">{item.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{item.category}</span>
            <span>•</span>
            <span>Condition: {item.condition}</span>
            <span>•</span>
            <span>Added: {new Date(item.dateReceived).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
          <p className="text-lg font-semibold">${item.value.toFixed(2)}</p>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
