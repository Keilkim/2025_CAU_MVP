'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Download, AlertCircle } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface WorkingHistoryTableProps {
  jobs: Job[];
}

const statusBadge: Record<JobStatus, string> = {
  pending: 'badge-gray',
  running: 'badge bg-blue-500/20 text-blue-400',
  completed: 'badge-success',
  failed: 'badge-error',
};

const statusLabel: Record<JobStatus, string> = {
  pending: '대기',
  running: '실행 중',
  completed: '완료',
  failed: '실패',
};

export default function WorkingHistoryTable({ jobs }: WorkingHistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>상태</th>
              <th>툴 이름</th>
              <th>시작 시간</th>
              <th>완료 시간</th>
              <th>결과</th>
            </tr>
          </thead>
          <tbody>
            {displayedJobs.map((job) => (
              <tr key={job.id} className="hover:bg-card/50">
                <td className="font-mono text-muted">{job.id}</td>
                <td>
                  <span className={`badge ${statusBadge[job.status]}`}>
                    {statusLabel[job.status]}
                  </span>
                </td>
                <td className="font-medium text-foreground">{job.toolName}</td>
                <td className="text-muted">{formatRelativeTime(job.startedAt)}</td>
                <td className="text-muted">
                  {job.completedAt ? formatRelativeTime(job.completedAt) : '-'}
                </td>
                <td>
                  {job.status === 'completed' && (
                    <button className="flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm">
                      <Eye className="w-4 h-4" />
                      보기
                    </button>
                  )}
                  {job.status === 'failed' && (
                    <button className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      로그
                    </button>
                  )}
                  {(job.status === 'pending' || job.status === 'running') && (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-sm text-muted">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, jobs.length)} / {jobs.length}개
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  page === currentPage
                    ? 'bg-primary-500 text-white'
                    : 'hover:bg-card text-muted'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
