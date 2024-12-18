import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    services: "",
    contactPhone: "",
    redirectInfo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        if (signUpError.message.includes('user_already_exists')) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: (
              <div>
                An account with this email already exists. Please{" "}
                <Link to="/login" className="underline font-semibold">
                  log in
                </Link>{" "}
                or use a different email.
              </div>
            ),
          });
          setLoading(false);
          return;
        }
        throw signUpError;
      }

      const { error: updateError } = await supabase
        .from('service_providers')
        .update({
          company_name: formData.companyName,
          services: [formData.services],
          contact_phone: formData.contactPhone,
          redirect_info: formData.redirectInfo,
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Registration successful!",
        description: "Welcome to SmartSupport. Please check your email to verify your account.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <LanguageSwitcher />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">{t('register')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">{t('companyName')}</Label>
              <Input
                id="companyName"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder={t('companyName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">{t('services')}</Label>
              <Textarea
                id="services"
                name="services"
                required
                value={formData.services}
                onChange={handleChange}
                placeholder={t('serviceDescription')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">{t('contactPhone')}</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="redirectInfo">{t('redirectInfo')}</Label>
              <Textarea
                id="redirectInfo"
                name="redirectInfo"
                required
                value={formData.redirectInfo}
                onChange={handleChange}
                placeholder={t('redirectDescription')}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('registering') : t('register')}
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-4">
              {t('alreadyHaveAccount')}{" "}
              <Link to="/login" className="text-primary hover:underline">
                {t('login')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;