import { Calendar } from './ui/calendar';
import { Card } from './ui/card';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  datesWithTodos: Set<string>;
}

export function CalendarView({
  selectedDate,
  onSelectDate,
  datesWithTodos,
}: CalendarViewProps) {
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <Card className="p-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        className="rounded-md"
        modifiers={{
          hasTodos: (date) => datesWithTodos.has(formatDate(date)),
        }}
        modifiersClassNames={{
          hasTodos: 'bg-indigo-100 text-indigo-900 font-bold relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-indigo-600 after:rounded-full',
        }}
      />
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span className="text-gray-600">할일 있음</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              {selectedDate.getDate()}
            </div>
            <span className="text-gray-600">선택된 날짜</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
