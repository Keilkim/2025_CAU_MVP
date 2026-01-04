import { NavItem, SidebarItem, FooterLinkGroup, HeroSlide, PlatformStats } from '@/types';

export const mainNavItems: NavItem[] = [
  { href: '/tools', label: 'Tools', labelKo: '툴' },
  { href: '#server', label: 'Servers', labelKo: '서버' },
  { href: '#', label: 'Apps', labelKo: '앱' },
  { href: '#pricing', label: 'Pricing', labelKo: '가격' },
  { href: '#', label: 'Tutorials', labelKo: '튜토리얼' },
  { href: '#', label: 'Contact', labelKo: '콘택트' },
];

export const sidebarItems: SidebarItem[] = [
  { href: '/mypage', label: 'Overview', labelKo: '오버뷰', icon: 'LayoutDashboard' },
  { href: '/mypage/pipeline', label: 'Pipeline', labelKo: '파이프라인', icon: 'GitBranch', disabled: true },
  { href: '/mypage/teams', label: 'Teams', labelKo: '팀즈', icon: 'Users', disabled: true },
  { href: '/mypage/subscription', label: 'Subscription', labelKo: '구독', icon: 'CreditCard', disabled: true },
  { href: '/mypage/api-keys', label: 'API Keys', labelKo: 'API 키', icon: 'Key', disabled: true },
  { href: '/mypage/jobs', label: 'Jobs', labelKo: 'Jobs', icon: 'Briefcase', disabled: true },
];

export const footerLinks: Record<string, FooterLinkGroup> = {
  product: {
    title: 'Product',
    titleKo: '제품',
    links: [
      { href: '/tools', label: 'Tools', labelKo: '툴' },
      { href: '#server', label: 'Servers', labelKo: '서버' },
      { href: '#pricing', label: 'Pricing', labelKo: '가격' },
    ],
  },
  resources: {
    title: 'Resources',
    titleKo: '리소스',
    links: [
      { href: '#', label: 'Documentation', labelKo: '문서' },
      { href: '#', label: 'Tutorials', labelKo: '튜토리얼' },
      { href: '#', label: 'Blog', labelKo: '블로그' },
    ],
  },
  company: {
    title: 'Company',
    titleKo: '회사',
    links: [
      { href: '#', label: 'About', labelKo: '소개' },
      { href: '#', label: 'Contact', labelKo: '문의' },
      { href: '#', label: 'Careers', labelKo: '채용' },
    ],
  },
  legal: {
    title: 'Legal',
    titleKo: '법적 고지',
    links: [
      { href: '#', label: 'Privacy', labelKo: '개인정보처리방침' },
      { href: '#', label: 'Terms', labelKo: '이용약관' },
    ],
  },
};

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'AI 모델을 더 쉽게, 더 빠르게',
    description: '최신 딥러닝 모델을 클릭 한 번으로 실행하세요. 복잡한 설정 없이 바로 시작할 수 있습니다.',
    imageUrl: '/images/hero/hero-1.png',
  },
  {
    id: 2,
    title: '강력한 GPU 서버 인프라',
    description: 'NVIDIA A100, H100 GPU를 탑재한 고성능 서버에서 모델을 실행하세요.',
    imageUrl: '/images/hero/hero-2.png',
  },
  {
    id: 3,
    title: '실시간 모니터링 & 분석',
    description: '작업 진행 상황을 실시간으로 확인하고, 상세한 분석 리포트를 받아보세요.',
    imageUrl: '/images/hero/hero-3.png',
  },
];

export const platformStats: PlatformStats = {
  users: 10000,
  tools: 50,
  reports: 1000000,
};

export const introText = {
  title: '최첨단 AI를 손쉽게',
  description: `전 세계 개발자들이 만든 최첨단 AI 모델을 손쉽게 활용하세요.
복잡한 인프라 설정이나 코딩 없이도 강력한 딥러닝 모델을 실행할 수 있습니다.
이미지 분류, 텍스트 분석, 음성 인식 등 다양한 AI 기능을 지금 바로 시작하세요.`,
};

export const serverIntroText = {
  title: '엔터프라이즈급 GPU 인프라',
  description: '최신 NVIDIA A100, H100 GPU를 탑재한 데이터센터에서 여러분의 AI 모델을 안정적으로 실행합니다.',
  features: [
    '99.9% 업타임 보장',
    '글로벌 엣지 네트워크',
    '자동 스케일링',
    '실시간 모니터링',
  ],
};
