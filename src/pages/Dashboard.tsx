
import { useShop } from "@/contexts/ShopContext";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { ProfitsChart } from "@/components/dashboard/ProfitsChart";
import { CashLevels } from "@/components/dashboard/CashLevels";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";

const Dashboard = () => {
  const { selectedShop, isLoading, error } = useShop();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading shop data...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <main className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <WelcomeHeader />
        {selectedShop && <QuickAccess shopId={selectedShop.id} />}
        <OverviewCards />
        <ProfitsChart />
        <CashLevels />
        <TransactionsTable />
      </main>
    </div>
  );
};

export default Dashboard;
