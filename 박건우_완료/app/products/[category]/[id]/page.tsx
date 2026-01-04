import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/app/components/Logo";
import {
  CATEGORIES,
  getProductById,
  getProductsByCategory,
  formatPrice,
  type CategoryKey,
} from "@/app/lib/data";

type Props = {
  params: Promise<{ category: string; id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { category: categoryKey, id } = await params;

  const category = CATEGORIES.find((c) => c.key === categoryKey);
  const product = getProductById(id);

  if (!category || !product || product.category !== categoryKey) {
    notFound();
  }

  const relatedProducts = getProductsByCategory(categoryKey as CategoryKey)
    .filter((p) => p.id !== id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Logo />

      {/* Breadcrumb */}
      <nav className="pt-20 px-6 sm:px-12 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-zinc-600 transition">
              홈
            </Link>
            <span>/</span>
            <Link
              href={`/products/${categoryKey}`}
              className="hover:text-zinc-600 transition"
            >
              {category.label}
            </Link>
            <span>/</span>
            <span className="text-zinc-600">{product.name}</span>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <main className="py-8 px-6 sm:px-12 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isBest && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full">
                  BEST
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 mt-2">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-4">
                {formatPrice(product.price)}
              </p>

              <div className="mt-8 pt-8 border-t border-zinc-200">
                <h2 className="text-sm font-semibold text-zinc-800 mb-3">
                  상품 설명
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {/* Contact Info */}
              <div className="mt-8 p-6 bg-zinc-50 rounded-xl">
                <h3 className="text-sm font-semibold text-zinc-800 mb-2">
                  구매 문의
                </h3>
                <p className="text-sm text-zinc-600">
                  상품 구매를 원하시면 아래 연락처로 문의해 주세요.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-zinc-800">
                    <span className="text-zinc-500">전화:</span> 010-0000-0000
                  </p>
                  <p className="text-sm text-zinc-800">
                    <span className="text-zinc-500">이메일:</span> contact@littlefriends.kr
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-block mt-4 px-6 py-3 bg-zinc-800 text-white text-sm rounded-lg hover:bg-zinc-700 transition"
                >
                  문의하기
                </Link>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-8 border-t border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-800 mb-6">
                관련 상품
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.category}/${p.id}`}
                    className="group"
                  >
                    <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden mb-2 group-hover:ring-2 ring-zinc-400 transition">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back Button */}
          <div className="mt-12 text-center">
            <Link
              href={`/products/${categoryKey}`}
              className="inline-block px-6 py-3 border border-zinc-300 text-zinc-600 text-sm rounded-lg hover:bg-zinc-50 transition"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
