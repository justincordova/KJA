import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

function renderMarkdownLine(line: string): ReactNode {
  if (line.startsWith("# "))
    return (
      <h1 className="mb-4 text-4xl font-bold tracking-tight">{line.slice(2)}</h1>
    );
  if (line.startsWith("## "))
    return (
      <h2 className="mb-3 mt-10 text-2xl font-semibold tracking-tight">
        {line.slice(3)}
      </h2>
    );
  if (line.startsWith("### "))
    return (
      <h3 className="mb-2 mt-8 text-xl font-semibold">{line.slice(4)}</h3>
    );
  if (line.startsWith("- "))
    return <li className="text-white/75">{line.slice(2)}</li>;
  return <p className="mb-4 leading-7 text-white/70">{line}</p>;
}

export function MarkdownRenderer({
  children,
}: {
  children: string | ReactNode;
}) {
  if (typeof children !== "string") {
    return <div className="prose prose-invert max-w-none">{children}</div>;
  }

  const blocks = children
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const output: ReactNode[] = [];

  blocks.forEach((block, index) => {
    if (block.includes("\n")) {
      const lines = block.split("\n");
      if (lines[0].startsWith("- ")) {
        output.push(
          <Reveal key={index}>
            <ul className="mb-6 ml-6 list-disc space-y-2">
              {lines.map((line, li) => (
                <li key={li}>{line.slice(2)}</li>
              ))}
            </ul>
          </Reveal>,
        );
        return;
      }
    }

    output.push(
      <Reveal key={index}>
        <div>{renderMarkdownLine(block)}</div>
      </Reveal>,
    );
  });

  return (
    <div className="prose prose-invert max-w-none">{output}</div>
  );
}
