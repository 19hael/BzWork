"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setForm((state) => ({ ...state, [field]: event.target.value }));
  };

  const handleAuth = async (mode: "signin" | "signup") => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast.success("Sesión iniciada");
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.fullName },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Revisa tu email para confirmar la cuenta");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl shadow-cyan-500/10 backdrop-blur">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="signin">Inicia sesión</TabsTrigger>
          <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-signin">Email</Label>
              <Input
                id="email-signin"
                type="email"
                placeholder="ops@team.com"
                value={form.email}
                onChange={(event) => handleChange(event, "email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signin">Password</Label>
              <Input
                id="password-signin"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => handleChange(event, "password")}
              />
            </div>
            <Button
              onClick={() => handleAuth("signin")}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Verificando..." : "Entrar al workspace"}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="signup">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                placeholder="Alex Vega"
                value={form.fullName}
                onChange={(event) => handleChange(event, "fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-signup">Email de trabajo</Label>
              <Input
                id="email-signup"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(event) => handleChange(event, "email")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signup">Password</Label>
              <Input
                id="password-signup"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(event) => handleChange(event, "password")}
              />
            </div>
            <Button
              onClick={() => handleAuth("signup")}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creando..." : "Solicitar acceso"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      <p className="mt-6 text-center text-xs text-white/60">
        Al continuar aceptas la política de datos de BzWork.
      </p>
    </div>
  );
}
