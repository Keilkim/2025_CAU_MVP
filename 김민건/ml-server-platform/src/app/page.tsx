import HeroSection from '@/components/landing/HeroSection';
import IntroSection from '@/components/landing/IntroSection';
import ToolsShowcase from '@/components/landing/ToolsShowcase';
import ServerSection from '@/components/landing/ServerSection';

export default function Home() {
  return (
    <>
      {/* Hero Section - 툴 설명 갤러리 */}
      <HeroSection />

      {/* Intro Section - 플랫폼 소개 + 통계 */}
      <IntroSection />

      {/* Tools Showcase - 인기 AI 툴 갤러리 */}
      <ToolsShowcase />

      {/* Server Section - 서버 소개 + 요금제 */}
      <ServerSection />
    </>
  );
}
