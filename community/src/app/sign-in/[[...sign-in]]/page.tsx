import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAuthAppearance } from "@/lib/clerkAuthAppearance";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-community-bg">
      <Link
        href="/"
        className="mb-8 text-sm text-community-muted hover:text-community-text"
      >
        ← The App Dads home
      </Link>
      <SignIn appearance={clerkAuthAppearance} />
    </div>
  );
}
