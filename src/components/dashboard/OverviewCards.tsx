
import { Card } from "@/components/ui/card";

export const OverviewCards = () => {
  return (
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
  );
};
