import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Package, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ShopsDropdown } from "@/components/ShopsDropdown";
import { useShop } from "@/contexts/ShopContext";
import { CustomerSearch } from "@/components/customer/CustomerSearch";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const profitsData = [
  { date: "12 Jan", freeStock: 2500, buyBack28: 3000, buyBack12: 2000 },
  { date: "16 Jan", freeStock: 3000, buyBack28: 2800, buyBack12: 2200 },
  { date: "20 Jan", freeStock: 2800, buyBack28: 3200, buyBack12: 2400 },
];

const cashData = [
  { date: "12 Jan", value: 2000 },
  { date: "16 Jan", value: 2500 },
  { date: "20 Jan", value: 3000 },
];

const transactions = [
  {
    id: "1",
    date: "22 mar 2024 - 11:34AM",
    type: "Sale",
    scheme: "Free-stock",
    imei: "010928003890233",
    customer: "Sarah Parker",
  },
  {
    id: "2",
    date: "22 mar 2024 - 10:56AM",
    type: "Purchase",
    scheme: "28-day buy back",
    imei: "010965543890233",
    customer: "John Doe",
  },
];

const Index = () => {
  const [firstName, setFirstName] = useState<string>("");

  const { selectedShop } = useShop();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data: userData, error } = await supabase
          .from('Users')
          .select('first_name')
          .eq('email', user.email)
          .single();

        if (error) throw error;

        if (userData?.first_name) {
          setFirstName(userData.first_name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <header className="bg-[#646ECB] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span className="font-medium">Pawn Systems</span>
          </div>
          <ShopsDropdown />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Hi there {firstName || 'Guest'}</h1>
          <p className="text-[#2A2A2A] mt-1">Here is your Dashboard, enjoy!</p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-[#111111] mb-4">Quick access</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedShop && <CustomerSearch shopId={selectedShop.id} />}
            <Card className="p-4 glass-card">
              <h3 className="text-lg font-medium text-[#111111] mb-4">Find a Product</h3>
              <div className="flex space-x-2">
                <Input placeholder="IMEI/SKU/ID" className="flex-1" />
                <Button variant="outline" className="text-[#646ECB]">
                  Find <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button variant="link" className="text-[#646ECB] pl-0 mt-2 gap-1.5">
                <Plus className="h-4 w-4" />
                Create Product
              </Button>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111111] mb-4">Overview</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 glass-card">
              <div className="flex items-center justify-between">
                <span className="text-[#2A2A2A]">Profits this month</span>
                <span className="text-green-500 text-sm">↑ 5.5%</span>
              </div>
              <p className="text-2xl font-bold mt-2">£1,563.55</p>
            </Card>
            <Card className="p-4 glass-card">
              <div className="flex items-center justify-between">
                <span className="text-[#2A2A2A]">Stock Value: Free-stock</span>
                <span className="text-green-500 text-sm">↑ 10.5%</span>
              </div>
              <p className="text-2xl font-bold mt-2">£730.03</p>
            </Card>
            <Card className="p-4 glass-card">
              <div className="flex items-center justify-between">
                <span className="text-[#2A2A2A]">Stock Value: 28-day buy back</span>
                <span className="text-red-500 text-sm">↓ 2.2%</span>
              </div>
              <p className="text-2xl font-bold mt-2">£1,563.55</p>
            </Card>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#111111]">Profits</h2>
            <Button variant="outline" size="sm">View more stats</Button>
          </div>
          <Card className="p-4 glass-card">
            <p className="text-sm text-[#2A2A2A] mb-4">Your daily profits per scheme</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={profitsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="freeStock" stroke="#646ECB" name="Free-stock" />
                  <Line type="monotone" dataKey="buyBack28" stroke="#8A92D8" name="28-day buy back" />
                  <Line type="monotone" dataKey="buyBack12" stroke="#3F4BBD" name="12-week buy back" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#111111]">Cash levels</h2>
            <div className="flex space-x-2">
              <Button>Record Cash entry</Button>
              <Button variant="outline">View all Cash variations</Button>
            </div>
          </div>
          <Card className="p-4 glass-card">
            <p className="text-sm text-[#2A2A2A] mb-4">Cash in till</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={cashData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#646ECB" name="Cash level" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#111111] mb-4">Last transactions</h2>
          <Card className="glass-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#646ECB]/10">
                    <th className="text-left p-4 text-[#2A2A2A]">Date</th>
                    <th className="text-left p-4 text-[#2A2A2A]">Type</th>
                    <th className="text-left p-4 text-[#2A2A2A]">Scheme</th>
                    <th className="text-left p-4 text-[#2A2A2A]">IMEI</th>
                    <th className="text-left p-4 text-[#2A2A2A]">Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-[#646ECB]/10">
                      <td className="p-4">{transaction.date}</td>
                      <td className="p-4">{transaction.type}</td>
                      <td className="p-4 text-[#646ECB]">{transaction.scheme}</td>
                      <td className="p-4">{transaction.imei}</td>
                      <td className="p-4 text-[#646ECB]">{transaction.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
