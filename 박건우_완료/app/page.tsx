// app/page.tsx
import Link from "next/link";
import Logo from "@/app/components/Logo";
import { CATEGORIES, getBestProducts, formatPrice } from "@/app/lib/data";

export default function Home() {
  const bestProducts = getBestProducts();

  return (
    <div className="relative min-h-screen bg-white">
      <Logo />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 pt-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-800 tracking-tight text-center">
            Little Friends
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-zinc-500 tracking-wide">
            리틀프렌즈
          </p>
          <p className="mt-6 text-sm sm:text-base text-zinc-600 text-center max-w-md">
            곤충과 파충류를 위한 프리미엄 용품 전문점
          </p>
        </section>

        {/* Category Cards */}
        <section className="flex flex-col sm:flex-row min-h-[50vh]">
          {CATEGORIES.map((category) => (
            <Link
              key={category.key}
              href={`/products/${category.key}`}
              className="relative flex-1 min-h-[25vh] sm:min-h-[50vh] flex flex-col items-center justify-center overflow-hidden group"
            >
              {/* Background Image */}
              <img
                src={category.cover}
                alt={category.label}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {category.label}
                </span>
                <span className="text-xs sm:text-sm tracking-widest text-white/80 uppercase">
                  {category.labelEn}
                </span>
                <p className="mt-2 text-xs sm:text-sm text-white/70 text-center px-4">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </section>

        {/* Best Products Section */}
        <section className="py-16 px-6 sm:px-12 md:px-16 bg-zinc-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 text-center mb-8">
            BEST 상품
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {bestProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.category}/${product.id}`}
                className="group"
              >
                <div className="aspect-square bg-zinc-200 rounded-lg overflow-hidden mb-2 group-hover:ring-2 ring-zinc-400 transition">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2 group-hover:text-zinc-600 transition">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                  {formatPrice(product.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 bg-zinc-100 text-center">
          <p className="text-xs text-zinc-500">
            © 2024 Little Friends. 곤충 & 파충류 용품 전문점
          </p>
          <p className="text-xs text-zinc-400 mt-2">
            문의: contact@littlefriends.kr | 010-0000-0000
          </p>
        </footer>
      </main>
    </div>
  );
}
