import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiary } from '../hooks/useDiary';
import { DiaryEditor } from '../components/diary/DiaryEditor';

export const NewEntry: React.FC = () => {
  const { addEntry } = useDiary();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
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
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
