import { useState, useEffect } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { CalendarView } from './components/CalendarView';
import { AuthForm } from './components/AuthForm';
import { Button } from './components/ui/button';
import { Calendar as CalendarIcon, CheckCircle2, LogOut } from 'lucide-react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD format
  createdAt: number;
}

interface User {
  email: string;
  name: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load user and todos from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('todomate-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedTodos = localStorage.getItem('todomate-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('todomate-todos', JSON.stringify(todos));
    }
  }, [todos, user]);

  const handleLogin = (email: string, password: string) => {
    // Demo login - in production, this would authenticate with a backend
    const newUser = { email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('todomate-user', JSON.stringify(newUser));
  };

  const handleSignup = (email: string, password: string, name: string) => {
    // Demo signup - in production, this would create an account with a backend
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('todomate-user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('todomate-user');
    // Optionally clear todos on logout
    // setTodos([]);
    // localStorage.removeItem('todomate-todos');
  };

  // If not logged in, show auth form
  if (!user) {
    return <AuthForm onLogin={handleLogin} onSignup={handleSignup} />;
  }

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const selectedDateString = formatDate(selectedDate);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      date: selectedDateString,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, text: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  // Get todos for selected date
  const todosForSelectedDate = todos.filter(todo => todo.date === selectedDateString);
  
  // Get dates that have todos
  const datesWithTodos = new Set(todos.map(todo => todo.date));

  const activeTodosCount = todosForSelectedDate.filter(todo => !todo.completed).length;
  const completedTodosCount = todosForSelectedDate.filter(todo => todo.completed).length;

  const formatSelectedDate = (date: Date) => {
    const options: Intl.DateTimeOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CalendarIcon className="w-10 h-10 text-indigo-600" />
            <h1 className="text-indigo-600">TodoMate Calendar</h1>
          </div>
          <p className="text-gray-600">달력에서 날짜를 선택하고 할일을 관리하세요</p>
          
          {/* User Info and Logout */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="text-gray-600">
              안녕하세요, <span className="text-indigo-600">{user.name}</span>님!
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div>
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              datesWithTodos={datesWithTodos}
            />
          </div>

          {/* Todo Section */}
          <div>
            {/* Selected Date Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                <div>
                  <h2 className="text-gray-800">{formatSelectedDate(selectedDate)}</h2>
                  <p className="text-gray-500">오늘의 할일</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="text-gray-600 mb-1">진행중</div>
                  <div className="text-indigo-600">{activeTodosCount}개</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-gray-600 mb-1">완료</div>
                  <div className="text-green-600">{completedTodosCount}개</div>
                </div>
              </div>
            </div>

            {/* Todo Input */}
            <div className="mb-6">
              <TodoInput onAdd={addTodo} />
            </div>

            {/* Todo List */}
            <div className="max-h-[500px] overflow-y-auto">
              <TodoList
                todos={todosForSelectedDate}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            </div>

            {/* Empty State */}
            {todosForSelectedDate.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">이 날짜에 할일이 없습니다</p>
                <p className="text-gray-400">위에서 할일을 추가해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}