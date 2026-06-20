export default function Nav() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-ink px-6 py-6 md:px-12">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Studio Adeola</span>
        <div className="flex gap-8 text-sm font-medium">
          <a href="#">Work</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </nav>
  );
}
