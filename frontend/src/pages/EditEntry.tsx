import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDiary } from '../hooks/useDiary';
import { DiaryEditor } from '../components/diary/DiaryEditor';
import { DiaryEntry } from '../types/diary';
import { api } from '../services/api';

export const EditEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { editEntry } = useDiary();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      if (!id) return;
      try {
        const data = await api.getEntryById(id);
        if (data) {
          setEntry(data);
        } else {
          navigate('/diary');
        }
      } catch (error) {
        console.error(error);
        navigate('/diary');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntry();
  }, [id, navigate]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      await editEntry(id, data);
      navigate(`/diary/${id}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-12 bg-gray-200 rounded w-full" />
      <div className="h-64 bg-gray-200 rounded w-full" />
    </div>;
  }

  if (!entry) return null;

  return (
    <DiaryEditor 
      title="Edit Diary Entry"
      initialData={entry}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
