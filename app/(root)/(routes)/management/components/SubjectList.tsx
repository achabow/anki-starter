import React, { useState, useEffect } from 'react';
import { Subject } from '@prisma/client';
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/use-current-user'
import NotFound from '@/app/not-found'

interface SubjectListProps {
  onEdit: (subject: Subject) => void;
  refreshTrigger: number;
  className?: string;
}

export default function SubjectList({ onEdit, refreshTrigger }: SubjectListProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const user = useCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return <NotFound />
  }

  useEffect(() => {
    fetchSubjects();
  }, [refreshTrigger]);

  const fetchSubjects = async () => {
    const response = await fetch('/api/admin/subjects');
    const data = await response.json();
    setSubjects(data);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapters</th>
      </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
      {subjects.map((subject) => (
        <tr key={subject.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="group relative">
              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {subject.name}
              </div>
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 bottom-full mb-2">
                {subject.name}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="group relative">
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {subject.value}
              </div>
              <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 bottom-full mb-2">
                {subject.value}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button
              onClick={() => onEdit(subject)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Manage Subject
            </button>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <Link
              href={`/management/chapter/${subject.id}`}
              className="text-green-600 hover:text-green-900"
            >
              Manage Chapters
            </Link>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}