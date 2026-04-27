"use client";

import type { PageData } from "@/lib/content/repository";
import { splitMarkdownIntoSlides, type ParsedSlide } from "@/lib/content/parser";
import { PresentationSlide } from "@/components/motion/PresentationSlide";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { PresentationProgress } from "@/components/motion/PresentationProgress";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(200,169,126,0.2)",
        borderRadius: "12px",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          color: "#c8a97e",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.875rem",
          color: "rgba(245,245,240,0.6)",
          marginTop: "0.5rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function renderStatGrid(source: string) {
  const rows = source
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^[-|\s]+$/.test(l))
    .map((l) => l.split("|").map((c) => c.trim()));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        gap: "1rem",
        width: "100%",
      }}
    >
      {rows.map(([value, label], i) => (
        <StatCard key={i} value={value} label={label} />
      ))}
    </div>
  );
}

function SlideContent({ slide }: { slide: ParsedSlide }) {
  const lines = slide.markdown.split("\n").filter(Boolean);
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```stat-grid")) {
      const gridLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        gridLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <Reveal key={elements.length} delay={0.2}>
          {renderStatGrid(gridLines.join("\n"))}
        </Reveal>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <Reveal key={elements.length}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {line.slice(2)}
          </h1>
        </Reveal>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <Reveal key={elements.length}>
          <h2
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              fontWeight: 300,
              color: "#c8a97e",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              margin: 0,
            }}
          >
            {line.slice(3)}
          </h2>
        </Reveal>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <Reveal key={elements.length}>
          <h3
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {line.slice(4)}
          </h3>
        </Reveal>,
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <Reveal key={elements.length} delay={0.1}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {items.map((item, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  color: "rgba(245,245,240,0.8)",
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    color: "#c8a97e",
                    marginTop: "0.35em",
                    fontSize: "0.5rem",
                  }}
                >
                  &#9670;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>,
      );
      continue;
    } else if (line.startsWith("> ")) {
      elements.push(
        <Reveal key={elements.length} delay={0.15}>
          <blockquote
            style={{
              borderLeft: "3px solid #c8a97e",
              paddingLeft: "1.25rem",
              margin: "1rem 0",
              fontStyle: "italic",
              color: "rgba(245,245,240,0.7)",
              lineHeight: 1.7,
            }}
          >
            {line.slice(2)}
          </blockquote>
        </Reveal>,
      );
    } else {
      elements.push(
        <Reveal key={elements.length} delay={0.05}>
          <p
            style={{
              color: "rgba(245,245,240,0.75)",
              lineHeight: 1.75,
              margin: 0,
              fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
            }}
          >
            {line}
          </p>
        </Reveal>,
      );
    }
    i++;
  }

  return <>{elements}</>;
}

function Slide({ slide, index }: { slide: ParsedSlide; index: number }) {
  const hasBg = slide.kind === "bg" && slide.imageUrl;
  const height = hasBg ? "200vh" : "170vh";

  return (
    <PresentationSlide index={index} height={height}>
      <div data-slide={index} id={`slide-${index}`} style={{ height: "100%" }}>
        {hasBg && (
          <ParallaxImage src={slide.imageUrl!} alt={`Slide ${index} background`} />
        )}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <SlideContent slide={slide} />
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
}

export function PresentationLayout({ page }: { page: PageData }) {
  const slides = splitMarkdownIntoSlides(page.content);

  return (
    <main>
      <PresentationProgress total={slides.length} />
      {slides.map((slide, index) => (
        <Slide key={index} slide={slide} index={index} />
      ))}
      <footer
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          color: "rgba(245,245,240,0.3)",
          fontSize: "0.875rem",
          borderTop: "1px solid rgba(200,169,126,0.1)",
        }}
      >
        Koenigsegg Jesko Absolut &mdash; A Scrollytelling Experience
      </footer>
    </main>
  );
}
