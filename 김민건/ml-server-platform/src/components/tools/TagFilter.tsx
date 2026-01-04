'use client';

import React from 'react';
import { allTags } from '@/data/tools';

interface TagFilterProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagFilter({ selected, onChange }: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted">태그</h3>
        {selected.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-primary-400 hover:text-primary-300"
          >
            초기화
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selected.includes(tag)
                ? 'bg-accent-500 text-white'
                : 'bg-card border border-border text-muted hover:text-foreground hover:border-accent-500/50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
