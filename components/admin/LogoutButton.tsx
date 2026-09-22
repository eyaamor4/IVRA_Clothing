"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={logout}>
      Se déconnecter
    </Button>
  );
}