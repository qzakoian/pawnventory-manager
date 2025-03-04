
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Brain, ShieldCheck, Zap, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const { user } = useAuth();

  return (
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
              {user ? (
                <Button size="lg" className="bg-[#646ECB] hover:bg-[#3F4BBD] text-white" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button size="lg" className="bg-[#646ECB] hover:bg-[#3F4BBD] text-white" asChild>
                  <Link to="/auth">Get Started Free</Link>
                </Button>
              )}
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
  );
};
