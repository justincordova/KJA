"use client";

import { KeyboardScroll } from "@/components/motion/KeyboardScroll";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { PresentationProgress } from "@/components/motion/PresentationProgress";
import { Reveal } from "@/components/motion/Reveal";
import { type ParsedSlide, splitMarkdownIntoSlides } from "@/lib/content/parser";
import type { PageData } from "@/lib/content/repository";
import { url } from "@/lib/site-config";

function parseInlineLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let last = 0;
  const combined = /(\*\*[^*]+\*\*)|(\[.+?\]\(.+?\))/g;
  for (const m of text.matchAll(combined)) {
    if (m.index != null && m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      parts.push(<strong key={m.index}>{m[1].slice(2, -2)}</strong>);
    } else if (m[2]) {
      const linkMatch = m[2].match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={m.index}
            href={linkMatch[2]}
            target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
            rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
            className="slide-link"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    last = (m.index ?? 0) + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(125,211,252,0.15)",
        borderRadius: "12px",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <div
        className="stat-value"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
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
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem",
        width: "100%",
      }}
    >
      {rows.map(([value, label], i) => (
        <StatCard key={value ?? i} value={value} label={label} />
      ))}
    </div>
  );
}

function HeroStats({ text }: { text: string }) {
  const hp = text.match(/([\d,]+)\s*(?:horsepower|hp)/i)?.[1] ?? "";
  const cd = text.match(/([\d.]+)\s*drag\s*coefficient/i)?.[1] ?? "";
  const kg = text.match(/([\d,]+)\s*kilograms?\s*dry/i)?.[1] ?? "";

  const items = [
    hp && { value: hp, label: "horsepower" },
    cd && { value: cd, label: "drag coefficient" },
    kg && { value: `${kg} kg`, label: "dry weight" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <p
      style={{
        color: "rgba(245,245,240,0.45)",
        fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
        fontWeight: 400,
        lineHeight: 1.8,
        letterSpacing: "0.02em",
        margin: 0,
      }}
    >
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 && " · "}
          <span style={{ color: "rgba(245,245,240,0.7)", fontWeight: 500 }}>{item.value}</span>
          {" "}
          <span style={{ color: "rgba(245,245,240,0.35)" }}>{item.label}</span>
        </span>
      ))}
    </p>
  );
}

function SlideContent({ slide, slideIndex }: { slide: ParsedSlide; slideIndex: number }) {
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
        </Reveal>
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
        </Reveal>
      );
    } else if (line.startsWith("## ")) {
      const isHero = slideIndex === 0;
      elements.push(
        <Reveal key={elements.length}>
          <h2
            className={isHero ? "hero-title" : "slide-subtitle"}
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              margin: 0,
            }}
          >
            {line.slice(3)}
          </h2>
        </Reveal>
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
        </Reveal>
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
            {items.map((item, j) => {
              const linkMatch = item.match(/^\[(.+?)\]\((.+?)\)$/);
              return (
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
                      color: "var(--primary)",
                      marginTop: "0.35em",
                      fontSize: "0.5rem",
                    }}
                  >
                    &#9670;
                  </span>
                  {linkMatch ? (
                    <a
                      href={linkMatch[2]}
                      target={linkMatch[2].startsWith("http") ? "_blank" : undefined}
                      rel={linkMatch[2].startsWith("http") ? "noopener noreferrer" : undefined}
                      className="slide-link"
                    >
                      {linkMatch[1]}
                    </a>
                  ) : (
                    parseInlineLinks(item)
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      );
      continue;
    } else if (line.startsWith("> ")) {
      const text = line.slice(2);
      const linkParts = parseInlineLinks(text);
      elements.push(
        <Reveal key={elements.length} delay={0.15}>
          <blockquote
            className="slide-blockquote"
            style={{
              paddingLeft: "1.25rem",
              margin: "1rem 0",
              fontStyle: "italic",
              color: "rgba(245,245,240,0.7)",
              lineHeight: 1.7,
            }}
          >
            {linkParts}
          </blockquote>
        </Reveal>
      );
    } else if (
      /^\d[\d,]*\s*(horsepower|hp)/i.test(line) ||
      /\.\d+\s*drag\s*coefficient/i.test(line) ||
      /\d[\d,]*\s*kilograms?\s*dry/i.test(line)
    ) {
      elements.push(<HeroStats key={elements.length} text={line} />);
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
        </Reveal>
      );
    }
    i++;
  }

  return <>{elements}</>;
}

function Slide({ slide, index }: { slide: ParsedSlide; index: number }) {
  const hasBg = slide.kind === "bg" && slide.imageUrl;

  return (
    <section
      data-slide={index}
      id={`slide-${index}`}
      style={{
        position: "relative",
        zIndex: index,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        scrollSnapAlign: "start",
      }}
    >
      {hasBg && slide.imageUrl && <ParallaxImage src={url(slide.imageUrl)} alt="" />}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          width: "100%",
          padding: "4rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <SlideContent slide={slide} slideIndex={index} />
      </div>
    </section>
  );
}

export function PresentationLayout({ page }: { page: PageData }) {
  const slides = splitMarkdownIntoSlides(page.content);

  return (
    <main>
      <KeyboardScroll total={slides.length} />
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
        Koenigsegg Jesko Absolut
      </footer>
    </main>
  );
}
