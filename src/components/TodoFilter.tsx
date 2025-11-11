import { FilterType } from '../App';
import { Button } from './ui/button';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
}

export function TodoFilter({
  currentFilter,
  onFilterChange,
  onClearCompleted,
  hasCompletedTodos,
}: TodoFilterProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'active', label: '진행중' },
    { value: 'completed', label: '완료' },
  ];

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm border border-gray-100">
      <div className="flex gap-1">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={currentFilter === filter.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={
              currentFilter === filter.value
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : ''
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      {hasCompletedTodos && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCompleted}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          완료된 항목 삭제
        </Button>
      )}
    </div>
  );
}
