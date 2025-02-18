
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export const ProfitsChart = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#454545]">Profits</h2>
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
  );
};
