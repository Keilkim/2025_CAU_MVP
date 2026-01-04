'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Wrench, FileText } from 'lucide-react';
import { platformStats, introText } from '@/data/navigation';
import { formatNumber } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
}

function StatCard({ icon, value, suffix, label, isVisible }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div className="text-center p-6 rounded-xl bg-card/50 backdrop-blur border border-border card-hover">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
        {icon}
      </div>
      <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
        {formatNumber(count)}{suffix}
      </div>
      <div className="text-muted text-sm">{label}</div>
    </div>
  );
}

export default function IntroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container-custom">
        {/* Intro Text */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {introText.title}
            </span>
          </h2>
          <p className="text-muted text-lg whitespace-pre-line">
            {introText.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            value={platformStats.users}
            suffix="+"
            label="활성 사용자"
            isVisible={isVisible}
          />
          <StatCard
            icon={<Wrench className="w-6 h-6" />}
            value={platformStats.tools}
            suffix="+"
            label="AI 모델"
            isVisible={isVisible}
          />
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            value={platformStats.reports}
            suffix="+"
            label="분석 완료"
            isVisible={isVisible}
          />
        </div>
      </div>
    </section>
  );
}
