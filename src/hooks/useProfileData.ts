
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "./use-toast";

export interface ProfileFormData {
  full_name: string;
  phone: string;
  email: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile data:", profileError);
          throw profileError;
        }
        
        setProfileData({
          full_name: profile?.full_name || '',
          phone: profile?.phone || '',
          email: profile?.email || user.email || '',
        });
        
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar seu perfil. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const updateProfile = async (data: ProfileFormData): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Update profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          email: data.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
        
      // Update local state
      setProfileData(data);
      
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar seu perfil.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isLoading,
    profileData,
    updateProfile,
  };
};
