
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ShieldCheck, BarChart3, DollarSign, ShoppingCart, Scale, Zap, Clock } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  // Redirect to dashboard if logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Landing page for non-logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
                <Brain className="h-4 w-4 mr-2" />
                AI-Enhanced Pawn Management System
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Transform Your Pawn Shop with Intelligent Management
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                The complete AI-powered solution designed specifically for pawn shops to boost profitability, streamline operations, and make smarter decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-[#646ECB] hover:bg-[#3F4BBD] text-white" onClick={() => window.location.href = '/auth'}>
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline">
                  Book a Demo
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="flex items-center text-sm text-gray-500">
                  <ShieldCheck className="h-5 w-5 text-[#646ECB] mr-2" />
                  <span>Secure & Compliant</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Zap className="h-5 w-5 text-[#646ECB] mr-2" />
                  <span>Setup in Minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-5 w-5 text-[#646ECB] mr-2" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ShieldCheck className="h-5 w-5 text-[#646ECB] mr-2" />
                  <span>No Credit Card</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/56e957f4-6595-4ef3-bebe-5887cbe0bef4.png" 
                  alt="Pawn System Dashboard"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-lg shadow-lg text-sm font-medium text-green-700 flex items-center animate-pulse">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                <span>+27% Profits with AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Pawn Shop Owners Nationwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from managers who have transformed their businesses with our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "The AI pricing system alone increased our profits by 23% in the first quarter. This platform pays for itself many times over."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Robert Johnson</p>
                    <p className="text-sm text-gray-500">Quick Cash Pawn, Chicago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "The inventory tracking and compliance features have saved me countless hours and eliminated the stress of audits. Worth every penny."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah Miller</p>
                    <p className="text-sm text-gray-500">Crown Jewel Pawn, Miami</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "The AI fraud detection has saved us from at least three potentially stolen items in just two months. That feature alone is priceless."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900">Michael Chen</p>
                    <p className="text-sm text-gray-500">Golden Gate Pawn, San Francisco</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-[#646ECB] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Pawn Shop?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Join hundreds of pawn shop managers who are leveraging AI to increase profits, streamline operations, and stay ahead of the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#646ECB] hover:bg-white/90" onClick={() => window.location.href = '/auth'}>
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            No credit card required. 14-day free trial. Cancel anytime.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
