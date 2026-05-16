import Link from "next/link";

export function BackLink() {
  return (
    <Link
      href="/"
      className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-accent-glow"
    >
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-pitch-800 transition group-hover:border-accent/40 group-hover:bg-pitch-700"
      >
        ←
      </span>
      Back to Database
    </Link>
  );
}
