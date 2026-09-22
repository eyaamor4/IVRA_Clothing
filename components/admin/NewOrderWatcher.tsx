"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

// Joue un petit bip sans avoir besoin d'un fichier audio.
function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  } catch {
    /* audio indisponible, tant pis */
  }
}

export default function NewOrderWatcher({
  latestOrderId,
}: {
  latestOrderId: string | null;
}) {
  const router = useRouter();
  const knownIdRef = useRef(latestOrderId);
  const [hasNew, setHasNew] = useState(false);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders/latest", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.id && data.id !== knownIdRef.current) {
        setHasNew(true);
        playBeep();
      }
    } catch {
      /* pas grave, on réessaiera au prochain intervalle */
    }
  }, []);

  useEffect(() => {
    knownIdRef.current = latestOrderId;
    setHasNew(false);
  }, [latestOrderId]);

  useEffect(() => {
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [check]);

  if (!hasNew) return null;

  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-primary bg-accent px-4 py-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Bell className="h-4 w-4 text-primary animate-pulse" />
        Nouvelle commande reçue !
      </div>
      <Button size="sm" onClick={() => router.refresh()}>
        Actualiser
      </Button>
    </div>
  );
}