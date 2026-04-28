import Link from "next/link";
import { basePath } from "@/lib/site-config";

export function ContextualLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#c8a97e", textDecoration: "underline" }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={`${basePath}${href}`} style={{ color: "#c8a97e" }}>
      {children}
    </Link>
  );
}
