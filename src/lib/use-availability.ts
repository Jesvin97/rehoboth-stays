"use client";

import { useEffect, useState } from "react";

/**
 * Which rooms are booked for the chosen dates. Refreshes every minute and whenever the tab is
 * opened again, so dates freed by a cancellation show up without the visitor reloading.
 */
export function useUnavailableRooms(checkIn: string, checkOut: string): { unavailable: string[]; loaded: boolean } {
  const [state, setState] = useState<{ key: string; unavailable: string[] }>({ key: "", unavailable: [] });
  const key = `${checkIn}|${checkOut}`;

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    let stop = false;
    const load = async () => {
      const res = await fetch(`/api/availability?in=${checkIn}&out=${checkOut}`, { cache: "no-store" }).catch(() => null);
      const data = await res?.json().catch(() => null);
      if (!stop && res?.ok && Array.isArray(data?.unavailable)) setState({ key, unavailable: data.unavailable });
    };
    load();
    const timer = setInterval(load, 60_000);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stop = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [checkIn, checkOut, key]);

  return { unavailable: state.key === key ? state.unavailable : [], loaded: state.key === key };
}

/** Date ranges already booked for one room, for showing on the room page. */
export function useBookedRanges(room: string): { from: string; to: string }[] {
  const [ranges, setRanges] = useState<{ from: string; to: string }[]>([]);
  useEffect(() => {
    let stop = false;
    const load = async () => {
      const res = await fetch(`/api/availability?room=${encodeURIComponent(room)}`, { cache: "no-store" }).catch(() => null);
      const data = await res?.json().catch(() => null);
      if (!stop && res?.ok && Array.isArray(data?.booked)) setRanges(data.booked);
    };
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [room]);
  return ranges;
}
