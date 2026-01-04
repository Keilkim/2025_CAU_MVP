import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Go to home"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50"
    >
      <div className="flex flex-col items-end opacity-90 hover:opacity-100 transition cursor-pointer">
        <span className="text-lg sm:text-xl font-bold text-zinc-800 tracking-tight">
          Little Friends
        </span>
        <span className="text-[10px] sm:text-xs text-zinc-500 tracking-wide">
          리틀프렌즈
        </span>
      </div>
    </Link>
  );
}
