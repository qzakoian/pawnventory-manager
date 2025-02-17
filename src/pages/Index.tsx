
import { useShop } from "@/contexts/ShopContext";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { ProfitsChart } from "@/components/dashboard/ProfitsChart";
import { CashLevels } from "@/components/dashboard/CashLevels";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";

const Index = () => {
  const { selectedShop } = useShop();

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
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

export default Index;
