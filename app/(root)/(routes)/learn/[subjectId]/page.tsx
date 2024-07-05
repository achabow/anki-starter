// pages/learn/[subjectId].tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';

import { Result, ResultCounts, Chapter, Subject, User } from '@/types/flashcard';
import { ProgressBar } from '@/app/(root)/(routes)/learn/_components/progressbar'

interface LearnDetailsProps {
  params: { subjectId: string };
}

const fetchData = async (
  user: User | null,
  subjectId: string,
  setSubject: React.Dispatch<React.SetStateAction<Subject | null>>,
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  if (user) {
    try {
      const response = await fetch(`/api/subject/${subjectId}`, {
        headers: {
          'X-User-Email': user.email || ''
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setSubject(data.subject);
      setChapters(data.chapters);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  } else {
    setIsLoading(false);
  }
};

const ChapterCard: React.FC<{ chapter: Chapter }> = ({ chapter }) => (
  <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{chapter.name}</h5>
    <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
      <p>Total cards: {chapter.totalFlashcards}</p>
      <p>Answered: {Object.values(chapter.resultCounts).reduce((a, b) => a + b, 0)}</p>
      <p>Progress: {
        chapter.totalFlashcards > 0
          ? ((chapter.answeredFlashcards / chapter.totalFlashcards) * 100).toFixed(2)
          : '0'
      }%</p>
      <ProgressBar resultCounts={chapter.resultCounts} totalAnswered={chapter.answeredFlashcards} />
      <div className="text-xs mt-1">
        <span className="text-red-600">Very Difficult: {chapter.resultCounts[Result.VERY_DIFFICULT]}</span> |
        <span className="text-yellow-400"> Difficult: {chapter.resultCounts[Result.DIFFICULT]}</span> |
        <span className="text-blue-600"> Good: {chapter.resultCounts[Result.GOOD]}</span> |
        <span className="text-green-500"> Very Good: {chapter.resultCounts[Result.VERY_GOOD]}</span>
      </div>
    </div>
    <Link href={`/learn/${chapter.subjectId}/chapter/${chapter.id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Start Learning
      <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
           fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9" />
      </svg>
    </Link>
  </div>
);

const LearnDetails: React.FC<LearnDetailsProps> = ({ params }) => {
  const user = useCurrentUser() as User | null;
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData(user, params.subjectId, setSubject, setChapters, setIsLoading);
  }, [user, params.subjectId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view this page.</div>;
  }

  const isThereNoData = !subject || chapters.length === 0;

  if (isThereNoData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="font-bold text-2xl mb-4">{`Subject: ${subject.name}`}</h1>
      <h2 className="font-bold text-xl mb-4">Chapters list:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default LearnDetails;