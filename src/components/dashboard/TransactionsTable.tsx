
import { Card } from "@/components/ui/card";

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

export const TransactionsTable = () => {
  return (
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
  );
};
