// Tool Types
export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ToolCategory;
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  price: 'free' | 'paid';
  rating: number;
  usageCount: number;
  createdAt: string;
}

export type ToolCategory = 'image' | 'text' | 'audio' | 'video' | 'multimodal';

export interface Category {
  id: string;
  label: string;
  labelKo: string;
  icon: string;
}

// Job Types
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Job {
  id: string;
  toolId: string;
  toolName: string;
  status: JobStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  result?: string;
  error?: string;
}

export interface NewJobTemplate {
  id: string;
  name: string;
  description: string;
  toolId: string;
  icon: string;
}

// Pricing Types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: 'month' | 'year';
  features: string[];
  highlighted: boolean;
  ctaText: string;
}

// Navigation Types
export interface NavItem {
  href: string;
  label: string;
  labelKo: string;
}

export interface SidebarItem extends NavItem {
  icon: string;
  disabled?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  titleKo: string;
  links: NavItem[];
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: 'basic' | 'pro' | 'enterprise';
  createdAt: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Hero Slide Types
export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

// Stats Types
export interface PlatformStats {
  users: number;
  tools: number;
  reports: number;
}
