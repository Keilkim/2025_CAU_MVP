'use client';

import React from 'react';
import { Grid, Image, FileText, Music, Video, Layers } from 'lucide-react';
import { categories } from '@/data/tools';

const iconMap: Record<string, React.ReactNode> = {
  Grid: <Grid className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Music: <Music className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
};

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted mb-3">카테고리</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selected === category.id
                ? 'bg-primary-500 text-white'
                : 'bg-card border border-border text-muted hover:text-foreground hover:border-primary-500/50'
            }`}
          >
            {iconMap[category.icon]}
            <span>{category.labelKo}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
