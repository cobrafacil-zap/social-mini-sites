"use client";

import { useEffect, useRef } from "react";
import type { Site, EventType } from "@/lib/types";
import { MiniSitePublic } from "@/components/public/MiniSitePublic";

export function PublicSiteView({ site }: { site: Site }) {
  const recordedView = useRef(false);

  function track(type: EventType) {
    const payload = JSON.stringify({ siteId: site.id, type });
    try {
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        navigator.sendBeacon("/api/event", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/event", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (recordedView.current) return;
    recordedView.current = true;
    track("view");
  }, [site.id]);

  return <MiniSitePublic site={site} interactive onEvent={track} />;
}