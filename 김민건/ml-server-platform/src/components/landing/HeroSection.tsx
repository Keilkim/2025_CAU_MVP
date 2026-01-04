'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/data/navigation';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-ai">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="container-custom relative">
        <div className="flex items-center justify-between gap-8">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-card/50 backdrop-blur border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary-500 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-foreground via-primary-400 to-accent-400 bg-clip-text text-transparent">
                  {slide.title}
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-muted mb-8 animate-slide-up">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="btn-primary py-3 px-8 text-lg">
                  무료로 시작하기
                </button>
                <button className="btn-secondary py-3 px-8 text-lg">
                  더 알아보기
                </button>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative hidden lg:block">
              <div className="aspect-square max-w-lg mx-auto">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-border flex items-center justify-center glow-primary">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">AI</span>
                    </div>
                    <p className="text-muted">Hero Image {currentSlide + 1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-card/50 backdrop-blur border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-primary-500 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-primary-500'
                  : 'bg-border hover:bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
