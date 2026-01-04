'use client';

import React from 'react';
import { Check, Cpu, Globe, Gauge, Activity } from 'lucide-react';
import { pricingPlans } from '@/data/pricing';
import { serverIntroText } from '@/data/navigation';
import { useAuth } from '@/context/AuthContext';

const featureIcons: Record<string, React.ReactNode> = {
  '99.9% 업타임 보장': <Gauge className="w-5 h-5" />,
  '글로벌 엣지 네트워크': <Globe className="w-5 h-5" />,
  '자동 스케일링': <Cpu className="w-5 h-5" />,
  '실시간 모니터링': <Activity className="w-5 h-5" />,
};

export default function ServerSection() {
  const { openLoginModal } = useAuth();

  return (
    <section id="server" className="py-20 bg-background">
      <div className="container-custom">
        {/* Server Intro */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                {serverIntroText.title}
              </span>
            </h2>
            <p className="text-muted text-lg mb-8">
              {serverIntroText.description}
            </p>

            {/* Feature List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {serverIntroText.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400">
                    {featureIcons[feature] || <Check className="w-5 h-5" />}
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Video Placeholder */}
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-border flex items-center justify-center glow-primary">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Cpu className="w-10 h-10 text-white" />
                </div>
                <p className="text-muted">서버 인프라 이미지</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              요금제 선택
            </h3>
            <p className="text-muted">
              프로젝트 규모에 맞는 플랜을 선택하세요
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${
                  plan.highlighted
                    ? 'border-primary-500 bg-card glow-primary'
                    : 'border-border bg-card/50'
                }`}
              >
                {/* Recommended Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge bg-primary-500 text-white px-3 py-1">
                      추천
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6 pt-2">
                  <h4 className="text-xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h4>
                  <p className="text-muted text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold text-foreground">무료</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-foreground">
                          ${plan.price}
                        </span>
                        <span className="text-muted">/월</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <span className="text-muted text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={openLoginModal}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.highlighted
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
