export default function SectionSeparator() {
  return (
    <div className="relative py-1">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
    </div>
  );
}
