export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-20 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <div className="font-display text-4xl">Studio Adeola</div>

        <div className="flex justify-between border-t border-line pt-12 text-sm text-muted">
          <span>Lagos — Working worldwide</span>
          <span>hello@studioadeola.com</span>
        </div>

        <div className="eyebrow flex justify-between border-t border-line pt-12 text-xs text-muted">
          <span>© 2026</span>
          <span>Built in-house</span>
        </div>
      </div>
    </footer>
  );
}
