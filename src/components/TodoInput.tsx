import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="새로운 할일을 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 h-12 bg-white shadow-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
      />
      <Button
        type="submit"
        className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700"
      >
        <Plus className="w-5 h-5 mr-2" />
        추가
      </Button>
    </form>
  );
}
