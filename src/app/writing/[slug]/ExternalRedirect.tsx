"use client";

import { useEffect } from "react";

export default function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <p className="text-ink-500 text-sm">Redirecting…</p>
  );
}
