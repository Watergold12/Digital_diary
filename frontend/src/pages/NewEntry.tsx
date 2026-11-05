import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDiary } from '../hooks/useDiary';
import { DiaryEditor } from '../components/diary/DiaryEditor';

export const NewEntry: React.FC = () => {
  const { addEntry } = useDiary();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI generated data
  const initialData = location.state?.aiGenerated ? {
    title: location.state.title,
    content: location.state.content,
    is_ai_generated: true
  } : undefined;

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (initialData?.is_ai_generated) {
        data.is_ai_generated = true;
      }
      const newEntry = await addEntry(data);
      navigate(`/diary/${newEntry.id}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <DiaryEditor 
      title="New Diary Entry"
      initialData={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
