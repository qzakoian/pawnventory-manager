
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Success",
            description: "Please check your email to verify your account.",
          });
        }
        // Redirect to dashboard instead of homepage
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 glass-card">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Package className="h-6 w-6 text-[#646ECB]" />
            <h1 className="text-2xl font-bold text-[#111111]">Pawn Systems</h1>
          </div>
          <p className="text-[#2A2A2A]">
            {isSignUp ? "Create an account" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#646ECB] hover:bg-[#3F4BBD]"
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : isSignUp
              ? "Create account"
              : "Sign in"}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            className="text-[#646ECB]"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
