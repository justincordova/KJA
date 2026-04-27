import { getHomeRepo } from "@/lib/content/repository";
import { PageLayoutFactory } from "@/components/layouts/PageLayoutFactory";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomeRepo().getPageBySlug("home");
  return {
    title: page.frontmatter.seo?.title ?? page.frontmatter.title,
    description: page.frontmatter.seo?.description ?? page.frontmatter.summary,
  };
}

export default async function Home() {
  const page = await getHomeRepo().getPageBySlug("home");
  return <PageLayoutFactory page={page} />;
}
