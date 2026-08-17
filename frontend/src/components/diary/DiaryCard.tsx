import React from 'react';
import { Link } from 'react-router-dom';
import { DiaryEntry } from '../../types/diary';
import { formatShortDate } from '../../utils/date';
import { truncateText } from '../../utils/formatting';
import { TagBadge } from '../tags/TagBadge';
import { ArrowRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

interface DiaryCardProps {
  entry: DiaryEntry;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const DiaryCard: React.FC<DiaryCardProps> = ({ entry, onEdit, onDelete }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:shadow-md transition-all duration-200 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-main line-clamp-1">{entry.title}</h3>
        {(onEdit || onDelete) && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Dropdown
              align="right"
              trigger={
                <button className="text-secondary hover:text-main p-1 rounded-md hover:bg-gray-100 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              }
            >
              {onEdit && (
                <DropdownItem onClick={() => onEdit(entry.id)} icon={<Pencil size={14} />}>
                  Edit
                </DropdownItem>
              )}
              {onDelete && (
                <DropdownItem onClick={() => onDelete(entry.id)} icon={<Trash2 size={14} />} destructive>
                  Delete
                </DropdownItem>
              )}
            </Dropdown>
          </div>
        )}
      </div>
      
      <p className="text-secondary text-sm mb-4 flex-1 line-clamp-3">
        {truncateText(entry.content, 180)}
      </p>
      
      <div className="flex flex-wrap gap-1.5 mb-4">
        {entry.tags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <span className="text-xs text-secondary font-medium">
          {formatShortDate(entry.date)}
        </span>
        <Link 
          to={`/diary/${entry.id}`}
          className="text-primary hover:text-primary-hover transition-colors flex items-center gap-1 text-sm font-medium"
        >
          Read <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
