import Link from "next/link";

const navItems = [
  { href: "/app", label: "Checker" },
  { href: "/pricing", label: "Pricing" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-950">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-sm font-black text-white">
            SF
          </span>
          SafeFrameCheck
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/app"
            className="ml-1 rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Try it free
          </Link>
        </nav>
      </div>
    </header>
  );
}
