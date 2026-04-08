"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

/**
 * Client-only auth shell so the root layout stays a small server chunk.
 * Helps avoid dev ChunkLoadError/timeouts when the layout bundle is huge or HMR is stale.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
