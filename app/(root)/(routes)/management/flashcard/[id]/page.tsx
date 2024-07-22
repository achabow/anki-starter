'use client';

import React, { useState } from 'react';
import { Flashcard } from '@prisma/client';
import FlashcardList from '@/app/(root)/(routes)/management/components/FlashcardList'
import FlashcardForm from '@/app/(root)/(routes)/management/components/FlashcardForm'
import { useCurrentUser } from '@/hooks/use-current-user'
import NotFound from '@/app/not-found'
import DataManagementLayout from '@/app/(root)/(routes)/management/components/DataManagementLayout'

export default function FlashcardManagement({ params }: { params: { id: string } }) {
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | undefined>(undefined);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const user = useCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    return <NotFound />
  }
  const handleEdit = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setSelectedFlashcard(undefined);
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async (flashcardData: Omit<Flashcard, 'id'>) => {
    try {
      console.log('Received flashcardData in FlashcardManagement:', flashcardData);
      const dataToSend = { ...flashcardData, chapterId: params.id };
      console.log('Data to send to API:', dataToSend);

      if (selectedFlashcard) {
        // Update existing flashcard
        const response = await fetch(`/api/admin/flashcard/${selectedFlashcard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        // Create new flashcard
        const response = await fetch('/api/admin/flashcard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      setSelectedFlashcard(undefined);
      setIsFormVisible(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting flashcard:', error);
    }
  };

  return (
    <DataManagementLayout
      title="Flashcard Management"
      listTitle="Flashcard List"
      onAddNew={handleAddNew}
      isFormVisible={isFormVisible}
      formContent={
        <FlashcardForm
          flashcard={selectedFlashcard}
          onSubmit={handleSubmit}
          chapterId={params.id}
        />
      }
    >
      <FlashcardList
        chapterId={params.id}
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />
    </DataManagementLayout>
  );
}