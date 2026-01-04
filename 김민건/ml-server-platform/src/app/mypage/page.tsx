'use client';

import React from 'react';
import Sidebar from '@/components/mypage/Sidebar';
import JobCard from '@/components/mypage/JobCard';
import CurrentJobList from '@/components/mypage/CurrentJobList';
import WorkingHistoryTable from '@/components/mypage/WorkingHistoryTable';
import { newJobTemplates, mockJobs, getCurrentJobs } from '@/data/jobs';
import { useAuth } from '@/context/AuthContext';

export default function MyPage() {
  const { isAuthenticated, openLoginModal } = useAuth();
  const currentJobs = getCurrentJobs();

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-muted mb-6">
            마이페이지를 이용하려면 로그인해주세요.
          </p>
          <button onClick={openLoginModal} className="btn-primary">
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Run a New Job Section */}
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-6">Run a new job</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {newJobTemplates.map((template) => (
                  <JobCard
                    key={template.id}
                    template={template}
                    onClick={() => alert(`Starting ${template.name}...`)}
                  />
                ))}
              </div>
            </section>

            {/* Current Jobs Section */}
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-6">Current Jobs</h2>
              <CurrentJobList jobs={currentJobs} />
            </section>

            {/* Working History Section */}
            <section>
              <h2 className="text-xl font-bold mb-6">작업 히스토리</h2>
              <WorkingHistoryTable jobs={mockJobs} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
