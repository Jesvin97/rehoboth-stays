"use client";

import { useState } from "react";

/**
 * Newsletter sign-up.
 * TODO(backend): send the address to a mailing list (Mailchimp, Brevo, etc.).
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  if (done) {
    return <p className="animate-fade-up text-gold-light" role="status">Thank you — we&apos;ll write a few times a year.</p>;
  }

  return (
    <form
      className="flex w-full max-w-[520px] flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Please enter a valid email address.");
        setErr("");
        setDone(true);
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-12 flex-1 border border-white/30 bg-transparent px-4 text-white placeholder:text-white/50 outline-none focus:border-gold-light"
        />
        <button type="submit" className="min-h-12 bg-gold px-7 text-[13px] font-medium uppercase tracking-[0.18em] text-night transition-colors hover:bg-gold-light">
          Subscribe
        </button>
      </div>
      {err ? <span role="alert" className="text-sm text-[#f0b9a4]">{err}</span> : null}
    </form>
  );
}
