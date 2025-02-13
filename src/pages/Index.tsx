
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Package, DollarSign, Users, AlertCircle } from "lucide-react";
import { InventoryItem } from "@/components/InventoryItem";
import { useState } from "react";

const mockItems = [
  {
    id: 1,
    name: "Vintage Watch",
    category: "Jewelry",
    condition: "Good",
    dateReceived: "2024-03-20",
    value: 299.99,
    status: "In Stock",
  },
  {
    id: 2,
    name: "MacBook Pro 2019",
    category: "Electronics",
    condition: "Fair",
    dateReceived: "2024-03-19",
    value: 799.99,
    status: "In Stock",
  },
  {
    id: 3,
    name: "Diamond Ring",
    category: "Jewelry",
    condition: "Excellent",
    dateReceived: "2024-03-18",
    value: 1299.99,
    status: "On Hold",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 animate-enter">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold">Pawnshop Inventory</h1>
          <Button className="hover-transform">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4 glass-card hover-transform">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Items</span>
            </div>
            <p className="text-2xl font-bold mt-2">247</p>
          </Card>
          <Card className="p-4 glass-card hover-transform">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <p className="text-2xl font-bold mt-2">$45,299</p>
          </Card>
          <Card className="p-4 glass-card hover-transform">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Active Loans</span>
            </div>
            <p className="text-2xl font-bold mt-2">38</p>
          </Card>
          <Card className="p-4 glass-card hover-transform">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Due Today</span>
            </div>
            <p className="text-2xl font-bold mt-2">5</p>
          </Card>
        </div>
      </header>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <InventoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Index;
