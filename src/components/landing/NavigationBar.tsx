
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export const NavigationBar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-sm py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/6d264df4-586e-42c3-86be-1d1e9ba01ddb.png" 
            alt="Logo" 
            className="h-8 w-8"
          />
          <span className="font-semibold text-gray-900">PawnventoryAI</span>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Dashboard
              </Link>
              <Link
                to="/account-settings"
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Account Settings
              </Link>
            </>
          ) : (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              asChild
            >
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                Connexion / Sign up
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
