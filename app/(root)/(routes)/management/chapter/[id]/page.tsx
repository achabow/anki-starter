'use client';

import React, { useState, useEffect } from 'react';
import { Chapter } from '@prisma/client';
import ChapterList from '@/app/(root)/(routes)/management/components/ChapterList'
import ChapterForm from '@/app/(root)/(routes)/management/components/ChapterForm'
import { useCurrentUser } from '@/hooks/use-current-user'
import NotFound from '@/app/not-found'
import DataManagementLayout from '@/app/(root)/(routes)/management/components/DataManagementLayout'


export default function ChapterManagement({ params }: { params: { id: string } }) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | undefined>(undefined);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const user = useCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return <NotFound />
  }

  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setSelectedChapter(undefined);
    setIsFormVisible(!isFormVisible);
  };
  const handleSubmit = async (chapterData: Omit<Chapter, 'id'>) => {
    try {
      console.log('Received chapterData in ChapterManagement:', chapterData);
      const dataToSend = { ...chapterData, subjectId: params.id };
      console.log('Data to send to API:', dataToSend);

      if (selectedChapter) {
        // Update existing chapter
        const response = await fetch(`/api/admin/chapter/${selectedChapter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        // Create new chapter
        const response = await fetch('/api/admin/chapter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      setSelectedChapter(undefined);
      setIsFormVisible(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting chapter:', error);
    }
  };

  return (
    <DataManagementLayout
      title="Chapter Management"
      listTitle="Chapter List"
      onAddNew={handleAddNew}
      isFormVisible={isFormVisible}
      formContent={
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedChapter ? 'Edit Chapter' : 'Add New Chapter'}
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <ChapterForm chapter={selectedChapter} onSubmit={handleSubmit} subjectId={params.id} />
          </div>
        </div>
      }
    >
      <ChapterList
        subjectId={params.id}
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />
    </DataManagementLayout>
  );
}