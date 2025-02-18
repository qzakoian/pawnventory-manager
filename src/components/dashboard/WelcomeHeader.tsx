
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const WelcomeHeader = () => {
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data: userData, error } = await supabase
          .from('Users')
          .select('first_name')
          .eq('email', user.email)
          .single();

        if (error) throw error;

        if (userData?.first_name) {
          setFirstName(userData.first_name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#454545]">Hi there {firstName || 'Guest'}</h1>
      <p className="text-[#2A2A2A] mt-1">Here is your Dashboard, enjoy!</p>
    </div>
  );
};
