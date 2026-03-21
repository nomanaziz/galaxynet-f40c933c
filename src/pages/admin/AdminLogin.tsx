import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading } = useAdminAuth();

  // Auto-redirect if already authenticated as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      setLoginLoading(false);
      return;
    }

    // Check if user has admin role
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      toast({ title: "Login Failed", description: "Unable to verify user.", variant: "destructive" });
      setLoginLoading(false);
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (!roleData || !["super_admin", "admin", "staff"].includes(roleData.role)) {
      await supabase.auth.signOut();
      toast({ title: "Access Denied", description: "You do not have admin privileges.", variant: "destructive" });
      setLoginLoading(false);
      return;
    }

    toast({ title: "Welcome!", description: "Logged in successfully." });
    navigate("/admin");
    setLoginLoading(false);
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src={logo} alt="Galaxy Net" className="h-14 w-auto mx-auto" />
          </div>
          <CardTitle className="text-2xl">Galaxy Net Admin</CardTitle>
          <CardDescription>Sign in to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@galaxynet.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
