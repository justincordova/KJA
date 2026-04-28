import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import type { PageData } from "@/lib/content/repository";

export function StandardLayout({ page }: { page: PageData }) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <header className="mb-12 border-b border-white/10 pb-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            {page.frontmatter.layout}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            {page.frontmatter.title}
          </h1>
          {page.frontmatter.summary ? (
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/60">
              {page.frontmatter.summary}
            </p>
          ) : null}
        </header>
        <MarkdownRenderer>{page.content}</MarkdownRenderer>
      </article>
    </main>
  );
}
