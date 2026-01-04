"use client";

import Link from "next/link";

type NavProps = {
  hoverWhite?: boolean;
};

export default function Nav({ hoverWhite = false }: NavProps) {
  const hoverClass = hoverWhite
    ? "hover:text-white hover:font-medium duration-200"
    : "hover:text-black hover:font-medium duration-200";

  return (
    <nav className="fixed top-4 sm:top-6 md:top-8 right-4 sm:right-8 md:right-16 z-50">
      <div className="flex space-x-3 sm:space-x-6 md:space-x-10 text-[8px] sm:text-[9px] md:text-[11px] tracking-wider md:tracking-widest text-zinc-400">
        <Link className={hoverClass} href="/products/insects">곤충</Link>
        <Link className={hoverClass} href="/products/reptiles">파충류</Link>
        <Link className={hoverClass} href="/contact">문의</Link>
      </div>
    </nav>
  );
}
