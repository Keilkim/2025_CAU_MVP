'use client';

import React, { useState, useMemo } from 'react';
import SearchBar from '@/components/tools/SearchBar';
import CategoryFilter from '@/components/tools/CategoryFilter';
import TagFilter from '@/components/tools/TagFilter';
import ToolGrid from '@/components/tools/ToolGrid';
import { mockTools, getToolsByCategory, searchTools } from '@/data/tools';
import { Tool } from '@/types';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter tools based on search, category, and tags
  const filteredTools = useMemo(() => {
    let tools = mockTools;

    // Filter by category
    if (selectedCategory !== 'all') {
      tools = tools.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      tools = tools.filter((tool) =>
        selectedTags.some((tag) => tool.tags.includes(tag))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.shortDescription.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return tools;
  }, [searchQuery, selectedCategory, selectedTags]);

  const handleToolClick = (tool: Tool) => {
    alert(`툴 선택: ${tool.name}\n\n${tool.description}`);
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            AI 툴 탐색
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            다양한 AI 모델을 검색하고 프로젝트에 적합한 툴을 찾아보세요
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-card/50 border border-border rounded-xl p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => {}}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <CategoryFilter
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          {/* Tag Filter */}
          <TagFilter
            selected={selectedTags}
            onChange={setSelectedTags}
          />
        </div>

        {/* Results Section */}
        <div>
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted">
              검색 결과: <span className="text-foreground font-medium">{filteredTools.length}개</span>의 툴
            </p>
          </div>

          {/* Tools Grid */}
          <ToolGrid
            tools={filteredTools}
            onToolClick={handleToolClick}
          />
        </div>
      </div>
    </div>
  );
}
