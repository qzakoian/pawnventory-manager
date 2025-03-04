
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, BarChart3, Scale } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Intelligent Tools for Modern Pawn Shops
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform helps you maximize profits, manage inventory efficiently, and build better customer relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1 pb-2">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-1">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Smart Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600">
                AI-powered valuation engine suggests optimal purchase and selling prices based on market trends and item condition.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1 pb-2">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-1">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600">
                Automatically categorize and track items, with AI detection to identify high-risk or potentially stolen merchandise.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1 pb-2">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-1">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Business Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600">
                Get predictive insights about inventory trends, customer behavior, and cashflow to optimize your business decisions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1 pb-2">
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center mb-1">
                <Scale className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Compliance Helper</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600">
                Stay compliant with local regulations with automated record-keeping and reporting tailored to your jurisdiction.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
