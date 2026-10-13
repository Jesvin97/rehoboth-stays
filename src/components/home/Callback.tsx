"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

const times = ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–8)"];

/**
 * "Request a callback" (from Voye). For now it opens WhatsApp with the request
 * filled in. TODO(backend): store requests and notify the host instead.
 */
export function Callback() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState(times[0]);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const digits = phone.replace(/\D/g, "").slice(-10);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setErr("Please add your name.");
    if (!/^[6-9]\d{9}$/.test(digits)) return setErr("Enter a valid 10-digit mobile number.");
    setErr("");
    const msg = `Hello! Please call me back about a stay.\nName: ${name.trim()}\nPhone: +91 ${digits}\nBest time: ${time}`;
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="animate-fade-up flex flex-col items-center gap-3 text-center" role="status">
        <p className="font-display text-[28px] text-white">Thank you, {name.trim().split(" ")[0]}.</p>
        <p className="text-white/80">Send the WhatsApp message that just opened and your host will call you in the {time.split(" ")[0].toLowerCase()}.</p>
      </div>
    );
  }

  const input = "min-h-12 w-full border border-white/30 bg-transparent px-4 text-white placeholder:text-white/50 outline-none focus:border-gold-light";
  return (
    <form onSubmit={submit} className="grid w-full grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="sr-only" htmlFor="cb-name">Your name</label>
      <input id="cb-name" className={input} placeholder="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label className="sr-only" htmlFor="cb-phone">Mobile number</label>
      <input id="cb-phone" className={input} type="tel" inputMode="numeric" placeholder="Mobile number" autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <label className="sr-only" htmlFor="cb-time">Best time to call</label>
      <select id="cb-time" className={`${input} [&>option]:text-ink`} value={time} onChange={(e) => setTime(e.target.value)}>
        {times.map((t) => <option key={t}>{t}</option>)}
      </select>
      <button type="submit" className="min-h-12 bg-gold-deep px-7 text-[13px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#744f0b]">
        Request a callback
      </button>
      {err ? <p role="alert" className="text-sm text-[#f3c2ad] md:col-span-4">{err}</p> : null}
    </form>
  );
}
