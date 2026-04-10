import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: t("Passwords do not match", "পাসওয়ার্ড মিলছে না"), variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: t("Password must be at least 6 characters", "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"), variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: t("Registration successful! Check your email to confirm.", "রেজিস্ট্রেশন সফল! নিশ্চিত করতে আপনার ইমেইল চেক করুন।") });
      navigate("/login");
    }
  };

  return (
    <>
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Galaxy Net" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl">{t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}</CardTitle>
            <CardDescription>{t("Sign up to get started with Galaxy Net", "Galaxy Net এ শুরু করতে সাইন আপ করুন")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email", "ইমেইল")}</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password", "পাসওয়ার্ড")}</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("Confirm Password", "পাসওয়ার্ড নিশ্চিত করুন")}</Label>
                <Input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("Sign Up", "সাইন আপ")}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                {t("Already have an account?", "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{" "}
                <Link to="/login" className="text-accent hover:underline font-medium">{t("Login", "লগইন")}</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </>
  );
};

export default Register;
