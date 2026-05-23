import type { Category } from "@/types/vocabulary";

/**
 * Color swatch per category so the eye can quickly cluster the list.
 * Civic Poster palette only — green / coral / sage / ink / paper variants.
 * Each tag is a small bordered pill, mono-caps, ink border, tinted fill.
 */
const palette: Record<string, { bg: string; fg: string }> = {
  "Basic Concept":          { bg: "#E8DDC4", fg: "#0E1F2C" },
  "Greenhouse gases":       { bg: "#DCC8C9", fg: "#0E1F2C" },
  "Energy":                 { bg: "#FBD89A", fg: "#0E1F2C" },
  "Natural Environment":    { bg: "#C8DBC4", fg: "#0E1F2C" },
  "Agriculture":            { bg: "#E0D2A7", fg: "#0E1F2C" },
  "Technology":             { bg: "#CFD9E0", fg: "#0E1F2C" },
  "Social Impact":          { bg: "#F8C5BF", fg: "#0E1F2C" },
  "Policies & Cooperation": { bg: "#D9CCDF", fg: "#0E1F2C" },
  "Green Lifestyle":        { bg: "#BCD5BF", fg: "#0E1F2C" },
};

const fallback = { bg: "#E8DDC4", fg: "#0E1F2C" };

export default function CategoryTag({ category }: { category: string }) {
  if (!category) return null;
  const { bg, fg } = palette[category] ?? fallback;
  return (
    <span
      className="inline-block whitespace-nowrap border-2 border-ink px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] leading-none"
      style={{ background: bg, color: fg }}
    >
      {category}
    </span>
  );
}
