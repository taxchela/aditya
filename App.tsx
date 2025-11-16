import React, { useState, createContext } from 'react';
import type { AppContextType, Homework, Test, StudyMaterial, Query, Assignment, Class, CrossUserNotification } from './types';
import { HomeworkStatus } from './types';
import AdityaDashboard from './components/AdityaDashboard';
import KushDashboard from './components/KushDashboard';
import { INITIAL_HOMEWORKS, INITIAL_TESTS, INITIAL_MATERIALS, INITIAL_QUERIES, INITIAL_ASSIGNMENTS, INITIAL_CLASSES, TEACHER_NAME, STUDENT_NAME } from './constants';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import IntroAnimation from './components/IntroAnimation';
import NotificationContainer from './components/NotificationContainer';

export const AppContext = createContext<AppContextType | null>(null);

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  type View = 'student' | 'teacherLogin' | 'teacherDashboard';
  const [currentView, setCurrentView] = useState<View>('student');
  
  const [homeworks, setHomeworks] = useLocalStorage<Homework[]>('homeworks', INITIAL_HOMEWORKS);
  const [tests, setTests] = useLocalStorage<Test[]>('tests', INITIAL_TESTS);
  const [materials, setMaterials] = useLocalStorage<StudyMaterial[]>('materials', INITIAL_MATERIALS);
  const [queries, setQueries] = useLocalStorage<Query[]>('queries', INITIAL_QUERIES);
  const [assignments, setAssignments] = useLocalStorage<Assignment[]>('assignments', INITIAL_ASSIGNMENTS);
  const [classes, setClasses] = useLocalStorage<Class[]>('classes', INITIAL_CLASSES);
  const [crossUserNotifications, setCrossUserNotifications] = useLocalStorage<CrossUserNotification[]>('crossUserNotifications', []);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('introShown'));

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const createCrossUserNotification = (message: string, recipient: 'student' | 'teacher') => {
    const newNotification: CrossUserNotification = {
      id: `cross-user-notif-${Date.now()}`,
      message,
      recipient,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setCrossUserNotifications(prev => [newNotification, ...prev]);
  };

  const handleIntroEnd = () => {
    sessionStorage.setItem('introShown', 'true');
    setShowIntro(false);
  };

  const submitHomework = (homeworkId: string, file: File) => {
    let hwTitle = '';
    setHomeworks(prev => prev.map(hw => {
        if (hw.id === homeworkId) {
            hwTitle = hw.title;
            return { ...hw, status: HomeworkStatus.Submitted, submittedFile: { name: file.name }, submittedAt: new Date().toISOString() };
        }
        return hw;
    }));
    showNotification('Homework submitted successfully!');
    if(hwTitle) createCrossUserNotification(`${STUDENT_NAME} submitted homework for "${hwTitle}"`, 'teacher');
  };

  const addHomework = (homework: Omit<Homework, 'id' | 'status' | 'submittedFile' | 'submittedAt' | 'createdAt'>) => {
    const newHomework: Homework = {
      ...homework,
      id: `hw-${Date.now()}`,
      status: HomeworkStatus.Pending,
      createdAt: new Date().toISOString(),
    };
    setHomeworks(prev => [newHomework, ...prev]);
    showNotification('Homework assigned successfully!');
    createCrossUserNotification(`New homework assigned: ${newHomework.title}`, 'student');
  };

  const addTest = (test: Omit<Test, 'id' | 'createdAt'>) => {
    const newTest: Test = { ...test, id: `test-${Date.now()}`, createdAt: new Date().toISOString() };
    setTests(prev => [newTest, ...prev]);
    showNotification('Test scheduled successfully!');
    createCrossUserNotification(`New test scheduled: ${newTest.title}`, 'student');
  };

  const addMaterial = (material: Omit<StudyMaterial, 'id' | 'createdAt'>) => {
      const newMaterial: StudyMaterial = { ...material, id: `mat-${Date.now()}`, createdAt: new Date().toISOString() };
      setMaterials(prev => [newMaterial, ...prev]);
      showNotification('Material uploaded successfully!');
      createCrossUserNotification(`New resource uploaded: ${newMaterial.title}`, 'student');
  };

  const submitQuery = (query: Omit<Query, 'id' | 'solution' | 'createdAt' | 'isResolved' | 'resolvedAt'>) => {
      const newQuery: Query = {
          ...query,
          id: `q-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isResolved: false
      };
      setQueries(prev => [newQuery, ...prev]);
      showNotification('Query sent successfully!');
      createCrossUserNotification(`${STUDENT_NAME} has a new query.`, 'teacher');
  };

  const resolveQuery = (queryId: string, solution: string) => {
      let queryText = '';
      setQueries(prev => prev.map(q => {
          if (q.id === queryId) {
              queryText = q.queryText;
              return { ...q, solution, isResolved: true, resolvedAt: new Date().toISOString() }
          }
          return q;
        }));
      showNotification('Solution sent successfully!');
      if(queryText) createCrossUserNotification(`${TEACHER_NAME} resolved your query about "${queryText.substring(0, 30)}..."`, 'student');
  };

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt' | 'isCompleted' | 'completedAt'>) => {
      const newAssignment: Assignment = {
          ...assignment,
          id: `asgn-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isCompleted: false,
      };
      setAssignments(prev => [newAssignment, ...prev]);
      showNotification('Assignment created successfully!');
      createCrossUserNotification(`New assignment created: ${newAssignment.title}`, 'student');
  };

  const completeAssignment = (assignmentId: string) => {
      let asgnTitle = '';
      setAssignments(prev => prev.map(a => {
          if (a.id === assignmentId) {
              asgnTitle = a.title;
              return { ...a, isCompleted: true, completedAt: new Date().toISOString() }
          }
          return a;
        }));
      showNotification('Assignment marked as complete!');
      if (asgnTitle) createCrossUserNotification(`${STUDENT_NAME} completed assignment: "${asgnTitle}"`, 'teacher');
  };

  const addClass = (klass: Omit<Class, 'id' | 'createdAt'>) => {
      const newClass: Class = { ...klass, id: `class-${Date.now()}`, createdAt: new Date().toISOString() };
      setClasses(prev => [...prev, newClass].sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()));
      showNotification('Class scheduled successfully!');
      createCrossUserNotification(`New class scheduled: ${newClass.title}`, 'student');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Priya2002@') {
      setCurrentView('teacherDashboard');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'student':
        return <AdityaDashboard />;
      case 'teacherLogin':
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up">
              <div className="text-center mb-8">
                <UserIcon className="mx-auto h-16 w-16 text-indigo-400"/>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-100">
                  {TEACHER_NAME}'s Portal Login
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Welcome back, {TEACHER_NAME}!
                </p>
              </div>
              <form onSubmit={handleLogin} className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 shadow-2xl rounded-2xl p-8 space-y-6">
                 <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full rounded-md border-0 bg-slate-700 py-3 pl-10 text-slate-100 ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition"
                            placeholder="Password"
                        />
                    </div>
                 </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button type="submit" className="w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all duration-200 transform hover:scale-105">
                  Sign in
                </button>
              </form>
               <button onClick={() => setCurrentView('student')} className="mt-6 text-center w-full text-sm text-indigo-400 hover:text-indigo-300 transition">
                &larr; Back to Aditya's Dashboard
              </button>
            </div>
          </div>
        );
      case 'teacherDashboard':
        return <KushDashboard />;
      default:
        return <AdityaDashboard />;
    }
  };

  const contextValue: AppContextType = {
    homeworks,
    setHomeworks,
    tests,
    setTests,
    materials,
    setMaterials,
    queries,
    setQueries,
    assignments,
    setAssignments,
    classes,
    setClasses,
    crossUserNotifications,
    setCrossUserNotifications,
    submitHomework,
    addHomework,
    addTest,
    addMaterial,
    submitQuery,
    resolveQuery,
    addAssignment,
    completeAssignment,
    addClass,
    showNotification
  };

  return (
    <AppContext.Provider value={contextValue}>
      {showIntro && <IntroAnimation onAnimationEnd={handleIntroEnd} />}
      <div className="antialiased text-slate-300">
        <NotificationContainer notifications={notifications} />
        {!showIntro && (
          <>
            {currentView !== 'teacherLogin' && (
              <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700/50">
                <div className="container mx-auto flex justify-between items-center p-4">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Future CA Aditya's Quant Dashboard</h1>
                  <button
                    onClick={() => setCurrentView(currentView === 'student' ? 'teacherLogin' : 'student')}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    {currentView === 'student' ? `${TEACHER_NAME}'s Portal` : "Aditya's Dashboard"}
                  </button>
                </div>
              </header>
            )}
            <main>{renderContent()}</main>
          </>
        )}
      </div>
    </AppContext.Provider>
  );
};

export default App;