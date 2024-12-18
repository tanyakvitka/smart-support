import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Login = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/chat");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <LanguageSwitcher />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            {t("welcome")}
          </h1>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#666666',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: language === 'en' ? 'Email address' : 'Электронная почта',
                  password_label: language === 'en' ? 'Password' : 'Пароль',
                  button_label: language === 'en' ? 'Sign in' : 'Войти',
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;