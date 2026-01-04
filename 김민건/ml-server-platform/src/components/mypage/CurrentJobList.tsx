'use client';

import React from 'react';
import { Play, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface CurrentJobListProps {
  jobs: Job[];
}

const statusConfig: Record<JobStatus, { icon: React.ReactNode; color: string; label: string }> = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-gray-400 bg-gray-500/20',
    label: '대기 중',
  },
  running: {
    icon: <Play className="w-4 h-4" />,
    color: 'text-blue-400 bg-blue-500/20',
    label: '실행 중',
  },
  completed: {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-400 bg-green-500/20',
    label: '완료',
  },
  failed: {
    icon: <XCircle className="w-4 h-4" />,
    color: 'text-red-400 bg-red-500/20',
    label: '실패',
  },
};

export default function CurrentJobList({ jobs }: CurrentJobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-muted">
        현재 진행 중인 작업이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const status = statusConfig[job.status];

        return (
          <div
            key={job.id}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary-500/50 transition-all cursor-pointer group"
          >
            {/* Status Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.color}`}>
              {status.icon}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground truncate">
                  {job.toolName}
                </h4>
                <span className={`badge ${status.color} text-xs`}>
                  {status.label}
                </span>
              </div>
              <p className="text-muted text-sm">
                {formatRelativeTime(job.startedAt)}에 시작
              </p>
            </div>

            {/* Progress */}
            {job.status === 'running' && (
              <div className="w-32">
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>진행률</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary-400 transition-colors" />
          </div>
        );
      })}
    </div>
  );
}
