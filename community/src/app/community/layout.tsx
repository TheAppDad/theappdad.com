import type { ReactNode } from "react";

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <div className="community-shell font-sans">{children}</div>;
}
