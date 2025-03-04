
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTASection = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 px-4 md:px-8 bg-[#646ECB] text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Pawn Shop?
        </h2>
        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
          Join hundreds of pawn shop managers who are leveraging AI to increase profits, streamline operations, and stay ahead of the competition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button size="lg" className="bg-white text-[#646ECB] hover:bg-white/90" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" className="bg-white text-[#646ECB] hover:bg-white/90" asChild>
              <Link to="/auth">Start Your Free Trial</Link>
            </Button>
          )}
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Schedule a Demo
          </Button>
        </div>
        <p className="mt-6 text-white/80 text-sm">
          No credit card required. 14-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  );
};
