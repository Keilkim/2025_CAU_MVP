import { Tool, Category } from '@/types';

export const mockTools: Tool[] = [
  {
    id: 'tool-1',
    name: 'Image Classifier Pro',
    description: 'Advanced image classification using state-of-the-art deep learning models. Supports 1000+ categories with 99% accuracy.',
    shortDescription: 'AI 기반 이미지 분류 (1000+ 카테고리)',
    category: 'image',
    tags: ['CNN', 'Classification', 'Deep Learning', 'Computer Vision'],
    imageUrl: '/images/tools/image-classifier.png',
    price: 'paid',
    rating: 4.8,
    usageCount: 15420,
    createdAt: '2024-01-15',
  },
  {
    id: 'tool-2',
    name: 'Text Summarizer',
    description: 'Summarize long documents into concise summaries using transformer-based NLP models.',
    shortDescription: 'GPT 기반 문서 요약',
    category: 'text',
    tags: ['NLP', 'Transformer', 'GPT', 'Summarization'],
    imageUrl: '/images/tools/text-summarizer.png',
    price: 'free',
    rating: 4.5,
    usageCount: 28340,
    createdAt: '2024-02-20',
  },
  {
    id: 'tool-3',
    name: 'Speech-to-Text',
    description: 'Convert audio files to text with support for 50+ languages and real-time transcription.',
    shortDescription: '50+ 언어 지원 음성 인식',
    category: 'audio',
    tags: ['ASR', 'Transcription', 'Multilingual', 'Real-time'],
    imageUrl: '/images/tools/speech-to-text.png',
    price: 'paid',
    rating: 4.7,
    usageCount: 12890,
    createdAt: '2024-03-10',
  },
  {
    id: 'tool-4',
    name: 'Object Detector',
    description: 'Real-time object detection and tracking using YOLO architecture.',
    shortDescription: 'YOLO 기반 실시간 객체 탐지',
    category: 'image',
    tags: ['YOLO', 'Detection', 'Real-time', 'Computer Vision'],
    imageUrl: '/images/tools/object-detector.png',
    price: 'paid',
    rating: 4.9,
    usageCount: 9870,
    createdAt: '2024-01-28',
  },
  {
    id: 'tool-5',
    name: 'Sentiment Analyzer',
    description: 'Analyze text sentiment and emotions with high accuracy.',
    shortDescription: '텍스트 감정 분석',
    category: 'text',
    tags: ['NLP', 'Sentiment', 'Classification', 'Emotion'],
    imageUrl: '/images/tools/sentiment-analyzer.png',
    price: 'free',
    rating: 4.3,
    usageCount: 21450,
    createdAt: '2024-02-05',
  },
  {
    id: 'tool-6',
    name: 'Face Recognition',
    description: 'Face detection, recognition, and analysis with biometric features.',
    shortDescription: '얼굴 인식 및 분석',
    category: 'image',
    tags: ['CV', 'Detection', 'Biometric', 'Recognition'],
    imageUrl: '/images/tools/face-recognition.png',
    price: 'paid',
    rating: 4.6,
    usageCount: 7650,
    createdAt: '2024-03-01',
  },
  {
    id: 'tool-7',
    name: 'Video Summarizer',
    description: 'Extract key scenes and create summaries from long videos.',
    shortDescription: '영상 핵심 장면 추출',
    category: 'video',
    tags: ['Video', 'Summarization', 'Scene Detection'],
    imageUrl: '/images/tools/video-summarizer.png',
    price: 'paid',
    rating: 4.4,
    usageCount: 5430,
    createdAt: '2024-02-15',
  },
  {
    id: 'tool-8',
    name: 'Language Translator',
    description: 'Neural machine translation supporting 100+ languages.',
    shortDescription: '100+ 언어 신경망 번역',
    category: 'text',
    tags: ['Transformer', 'NLP', 'Translation', 'Multilingual'],
    imageUrl: '/images/tools/language-translator.png',
    price: 'free',
    rating: 4.7,
    usageCount: 34560,
    createdAt: '2024-01-10',
  },
  {
    id: 'tool-9',
    name: 'Music Generator',
    description: 'AI-powered music composition and generation.',
    shortDescription: 'AI 음악 생성',
    category: 'audio',
    tags: ['Generation', 'Audio', 'Creative', 'AI Music'],
    imageUrl: '/images/tools/music-generator.png',
    price: 'paid',
    rating: 4.2,
    usageCount: 8920,
    createdAt: '2024-03-05',
  },
  {
    id: 'tool-10',
    name: 'Image Generator',
    description: 'Text-to-image generation using diffusion models.',
    shortDescription: '텍스트→이미지 생성',
    category: 'multimodal',
    tags: ['Diffusion', 'Generation', 'Text-to-Image', 'Creative'],
    imageUrl: '/images/tools/image-generator.png',
    price: 'paid',
    rating: 4.9,
    usageCount: 45670,
    createdAt: '2024-01-20',
  },
  {
    id: 'tool-11',
    name: 'Code Assistant',
    description: 'AI-powered code completion and generation.',
    shortDescription: '코드 자동 완성',
    category: 'text',
    tags: ['GPT', 'Code', 'Generation', 'Programming'],
    imageUrl: '/images/tools/code-assistant.png',
    price: 'paid',
    rating: 4.8,
    usageCount: 23450,
    createdAt: '2024-02-01',
  },
  {
    id: 'tool-12',
    name: 'Data Analyzer',
    description: 'Automated data analysis and visualization.',
    shortDescription: '데이터 시각화 분석',
    category: 'multimodal',
    tags: ['ML', 'Analytics', 'Visualization', 'AutoML'],
    imageUrl: '/images/tools/data-analyzer.png',
    price: 'free',
    rating: 4.4,
    usageCount: 11230,
    createdAt: '2024-02-28',
  },
];

export const categories: Category[] = [
  { id: 'all', label: 'All', labelKo: '전체', icon: 'Grid' },
  { id: 'image', label: 'Image', labelKo: '이미지', icon: 'Image' },
  { id: 'text', label: 'Text', labelKo: '텍스트', icon: 'FileText' },
  { id: 'audio', label: 'Audio', labelKo: '오디오', icon: 'Music' },
  { id: 'video', label: 'Video', labelKo: '비디오', icon: 'Video' },
  { id: 'multimodal', label: 'Multimodal', labelKo: '멀티모달', icon: 'Layers' },
];

export const allTags = [
  'CNN', 'RNN', 'Transformer', 'GPT', 'BERT', 'NLP', 'CV',
  'Deep Learning', 'Machine Learning', 'Classification',
  'Detection', 'Segmentation', 'Generation', 'Real-time',
  'YOLO', 'Diffusion', 'ASR', 'Translation'
];

export function getToolsByCategory(category: string): Tool[] {
  if (category === 'all') return mockTools;
  return mockTools.filter(tool => tool.category === category);
}

export function getToolsByTags(tags: string[]): Tool[] {
  if (tags.length === 0) return mockTools;
  return mockTools.filter(tool =>
    tags.some(tag => tool.tags.includes(tag))
  );
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return mockTools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
