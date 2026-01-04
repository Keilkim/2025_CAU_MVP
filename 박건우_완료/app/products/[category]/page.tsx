"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/app/components/Logo";
import {
  CATEGORIES,
  getProductsByCategory,
  formatPrice,
  type CategoryKey,
} from "@/app/lib/data";

type Props = {
  params: Promise<{ category: string }>;
};

export default function CategoryPage({ params }: Props) {
  const resolvedParams = use(params);
  const categoryKey = resolvedParams.category as CategoryKey;
  const category = CATEGORIES.find((c) => c.key === categoryKey);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(categoryKey);

  return (
    <div className="min-h-screen bg-white">
      <Logo />

      {/* Header */}
      <header className="pt-20 pb-8 px-6 sm:px-12 md:px-16 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-600 transition mb-4 inline-block"
          >
            ← 홈으로
          </Link>
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800">
                {category.label}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="py-8 px-6 sm:px-12 md:px-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-zinc-500 mb-6">
            {products.length}개의 상품
          </p>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-400">상품이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${categoryKey}/${product.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden mb-3 group-hover:ring-2 ring-zinc-400 transition relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isBest && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-1 rounded">
                        BEST
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-zinc-800 mt-1 line-clamp-2 group-hover:text-zinc-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-zinc-900 mt-2">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
