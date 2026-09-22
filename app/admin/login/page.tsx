"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Erreur de connexion.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Connexion impossible.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-24">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-accent flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Espace propriétaire</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Connectez-vous pour gérer vos commandes
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && (
              <p role="alert" className="text-sm text-red-600 text-center">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}