export interface ParsedSlide {
  kind: "plain" | "bg" | "split" | "split-reverse";
  imageUrl?: string;
  objectPosition?: string;
  markdown: string;
  raw: string;
}

function parseDirective(
  markdown: string
): Pick<ParsedSlide, "kind" | "imageUrl" | "objectPosition" | "markdown"> {
  const imageMatch = markdown.match(/^!\[(.*?)\]\((.*?)\)\s*\n?/m);
  if (!imageMatch) {
    return { kind: "plain", markdown };
  }

  const alt = imageMatch[1].trim();
  const imageUrl = imageMatch[2].trim();
  const objectPositionMatch = alt.match(/^bg\s+(.+)$/);
  const kind: ParsedSlide["kind"] =
    alt === "bg" || objectPositionMatch
      ? "bg"
      : alt === "split"
        ? "split"
        : alt === "split-reverse"
          ? "split-reverse"
          : "plain";
  const markdownWithoutImage = markdown.replace(imageMatch[0], "").trim();

  return {
    kind,
    imageUrl,
    objectPosition: objectPositionMatch?.[1],
    markdown: markdownWithoutImage,
  };
}

export function splitMarkdownIntoSlides(body: string): ParsedSlide[] {
  return body
    .split(/^---$/m)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => ({ raw, ...parseDirective(raw) }));
}
