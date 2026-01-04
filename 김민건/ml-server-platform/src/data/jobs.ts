import { Job, NewJobTemplate } from '@/types';

export const mockJobs: Job[] = [
  {
    id: 'job-001',
    toolId: 'tool-1',
    toolName: 'Image Classifier Pro',
    status: 'completed',
    progress: 100,
    startedAt: '2024-12-29T08:30:00Z',
    completedAt: '2024-12-29T08:35:00Z',
    result: 'Classification complete: 95.2% accuracy',
  },
  {
    id: 'job-002',
    toolId: 'tool-2',
    toolName: 'Text Summarizer',
    status: 'running',
    progress: 65,
    startedAt: '2024-12-29T09:45:00Z',
  },
  {
    id: 'job-003',
    toolId: 'tool-3',
    toolName: 'Speech-to-Text',
    status: 'pending',
    progress: 0,
    startedAt: '2024-12-29T10:00:00Z',
  },
  {
    id: 'job-004',
    toolId: 'tool-4',
    toolName: 'Object Detector',
    status: 'completed',
    progress: 100,
    startedAt: '2024-12-28T14:20:00Z',
    completedAt: '2024-12-28T14:25:00Z',
    result: 'Detected 15 objects in 3 images',
  },
  {
    id: 'job-005',
    toolId: 'tool-5',
    toolName: 'Sentiment Analyzer',
    status: 'failed',
    progress: 45,
    startedAt: '2024-12-28T11:00:00Z',
    completedAt: '2024-12-28T11:10:00Z',
    error: 'Input text exceeds maximum length',
  },
  {
    id: 'job-006',
    toolId: 'tool-10',
    toolName: 'Image Generator',
    status: 'completed',
    progress: 100,
    startedAt: '2024-12-27T16:30:00Z',
    completedAt: '2024-12-27T16:45:00Z',
    result: 'Generated 4 images from prompt',
  },
];

export const newJobTemplates: NewJobTemplate[] = [
  {
    id: 'template-1',
    name: 'Quick Image Analysis',
    description: '빠른 이미지 분류 및 객체 탐지',
    toolId: 'tool-1',
    icon: 'Image',
  },
  {
    id: 'template-2',
    name: 'Document Processing',
    description: '문서에서 텍스트 추출 및 요약',
    toolId: 'tool-2',
    icon: 'FileText',
  },
  {
    id: 'template-3',
    name: 'Audio Transcription',
    description: '타임스탬프 포함 오디오 변환',
    toolId: 'tool-3',
    icon: 'Mic',
  },
];

export function getJobsByStatus(status: string): Job[] {
  if (status === 'all') return mockJobs;
  return mockJobs.filter(job => job.status === status);
}

export function getCurrentJobs(): Job[] {
  return mockJobs.filter(job => job.status === 'running' || job.status === 'pending');
}

export function getCompletedJobs(): Job[] {
  return mockJobs.filter(job => job.status === 'completed' || job.status === 'failed');
}
