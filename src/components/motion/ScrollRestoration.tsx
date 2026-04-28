"use client";

export function ScrollRestoration() {
  if (typeof window !== "undefined") {
    window.history.scrollRestoration = "manual";
  }
  return null;
}
