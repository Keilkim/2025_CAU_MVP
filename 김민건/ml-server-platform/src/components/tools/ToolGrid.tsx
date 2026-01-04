import React from 'react';
import { Tool } from '@/types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
  onToolClick?: (tool: Tool) => void;
}

export default function ToolGrid({ tools, onToolClick }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card border border-border flex items-center justify-center">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-muted">
          다른 키워드나 필터로 검색해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          onClick={() => onToolClick?.(tool)}
        />
      ))}
    </div>
  );
}
