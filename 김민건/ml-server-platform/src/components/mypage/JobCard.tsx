import React from 'react';
import { Image, FileText, Mic, Plus } from 'lucide-react';
import { NewJobTemplate } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  Image: <Image className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />,
  Mic: <Mic className="w-8 h-8" />,
};

interface JobCardProps {
  template: NewJobTemplate;
  onClick?: () => void;
}

export default function JobCard({ template, onClick }: JobCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-card border border-border rounded-xl p-6 card-hover"
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 mb-4 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-all">
        {iconMap[template.icon] || <Plus className="w-8 h-8" />}
      </div>

      {/* Content */}
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary-400 transition-colors">
        {template.name}
      </h3>
      <p className="text-muted text-sm">
        {template.description}
      </p>

      {/* Start Button */}
      <div className="mt-4 flex items-center gap-2 text-primary-400 text-sm font-medium">
        <Plus className="w-4 h-4" />
        <span>시작하기</span>
      </div>
    </button>
  );
}
