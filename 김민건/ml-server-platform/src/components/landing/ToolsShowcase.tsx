'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { mockTools } from '@/data/tools';
import { formatNumberShort } from '@/lib/utils';

export default function ToolsShowcase() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleTools = 3;

  const goToPrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - visibleTools));
  };

  const goToNext = () => {
    setStartIndex((prev) =>
      Math.min(mockTools.length - visibleTools, prev + visibleTools)
    );
  };

  const displayedTools = mockTools.slice(startIndex, startIndex + visibleTools);
  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex + visibleTools < mockTools.length;

  return (
    <section className="py-20 bg-card/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            인기 AI 툴
          </h2>
          <p className="text-muted text-lg">
            가장 많이 사용되는 AI 모델을 확인해보세요
          </p>
        </div>

        {/* Tools Carousel */}
        <div className="flex items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              canGoPrevious
                ? 'border-border text-muted hover:text-foreground hover:border-primary-500'
                : 'border-border/50 text-muted/50 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Tools Grid */}
          <div className="flex-1 grid md:grid-cols-3 gap-6">
            {displayedTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden card-hover">
                  {/* Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-400">
                        {tool.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-muted text-sm mb-3 line-clamp-2">
                      {tool.shortDescription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tool.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="badge badge-primary text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rating & Usage */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{tool.rating}</span>
                      </div>
                      <span className="text-muted">
                        {formatNumberShort(tool.usageCount)} 사용
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              canGoNext
                ? 'border-border text-muted hover:text-foreground hover:border-primary-500'
                : 'border-border/50 text-muted/50 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link href="/tools" className="btn-secondary">
            모든 툴 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
