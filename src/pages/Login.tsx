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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: t("Login successful!", "লগইন সফল!") });
      navigate("/");
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
            <CardTitle className="text-2xl">{t("Welcome Back", "স্বাগতম")}</CardTitle>
            <CardDescription>{t("Login to your Galaxy Net account", "আপনার Galaxy Net অ্যাকাউন্টে লগইন করুন")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email", "ইমেইল")}</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("Password", "পাসওয়ার্ড")}</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("Login", "লগইন")}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                {t("Don't have an account?", "অ্যাকাউন্ট নেই?")}{" "}
                <Link to="/register" className="text-accent hover:underline font-medium">{t("Sign Up", "সাইন আপ")}</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </>
  );
};

export default Login;
