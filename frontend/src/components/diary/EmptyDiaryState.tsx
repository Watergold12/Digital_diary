import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const EmptyDiaryState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-secondary-bg p-4 rounded-full mb-6">
        <BookOpen size={32} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-main mb-2">Your diary is still empty.</h3>
      <p className="text-secondary max-w-md mb-8">
        Start capturing your first memory, thought, idea, or moment. A blank page is just waiting to be filled.
      </p>
      <Link to="/diary/new">
        <Button variant="primary">
          Write your first entry
        </Button>
      </Link>
    </div>
  );
};
