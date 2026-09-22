export default function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12 dw-reveal dw-in">
      {eyebrow && <span className="text-xs tracking-[0.2em] uppercase opacity-60">{eyebrow}</span>}
      <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 dw-gradient-text">{title}</h2>
      {description && <p className="mt-3 opacity-70 text-sm sm:text-base">{description}</p>}
    </div>
  );
}
