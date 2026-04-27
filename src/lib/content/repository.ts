import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { PageFrontmatterSchema, type PageFrontmatter } from "./schema";

export interface PageData {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
}

export class ContentValidationError extends Error {
  constructor(
    public filePath: string,
    public issues: string[],
  ) {
    super(`Invalid content in ${filePath}\n${issues.join("\n")}`);
  }
}

export class ContentRepository {
  constructor(private readonly baseDir: string) {}

  async getPageBySlug(slug: string): Promise<PageData> {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new ContentValidationError(
        path.join(this.baseDir, `${slug}.md`),
        ["slug: must be kebab-case"],
      );
    }

    const filePath = path.join(this.baseDir, `${slug}.md`);
    const source = await fs.readFile(filePath, "utf8");
    const parsed = matter(source);
    const result = PageFrontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      throw new ContentValidationError(
        filePath,
        result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
      );
    }
    return { slug, frontmatter: result.data, content: parsed.content };
  }

  async getAllSlugs(): Promise<string[]> {
    const files = await fs.readdir(this.baseDir);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""))
      .filter((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug));
  }

  async getAllPages(): Promise<PageData[]> {
    const slugs = await this.getAllSlugs();
    return Promise.all(slugs.map((slug) => this.getPageBySlug(slug)));
  }
}

export const getHomeRepo = () =>
  new ContentRepository(path.join(process.cwd(), "content"));
export const getPagesRepo = () =>
  new ContentRepository(path.join(process.cwd(), "content/pages"));
