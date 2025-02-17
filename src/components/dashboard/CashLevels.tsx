
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

const cashData = [
  { date: "12 Jan", value: 2000 },
  { date: "16 Jan", value: 2500 },
  { date: "20 Jan", value: 3000 },
];

export const CashLevels = () => {
  return (
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
  );
};
