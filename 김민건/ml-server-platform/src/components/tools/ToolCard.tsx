import React from 'react';
import { Star } from 'lucide-react';
import { Tool } from '@/types';
import { formatNumberShort } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
}

export default function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-card border border-border rounded-xl overflow-hidden card-hover cursor-pointer"
    >
      {/* Image Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 70%)`
          }} />
        </div>

        {/* Icon */}
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-2xl font-bold text-primary-400">
            {tool.name.charAt(0)}
          </span>
        </div>

        {/* Price Badge */}
        {tool.price === 'free' && (
          <span className="absolute top-2 right-2 badge bg-green-500/20 text-green-400 text-xs">
            무료
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary-400 transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
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
          {tool.tags.length > 2 && (
            <span className="badge badge-gray text-xs">
              +{tool.tags.length - 2}
            </span>
          )}
        </div>

        {/* Footer */}
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
  );
}
