import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { HomeIcon, ClipboardDocumentListIcon, BeakerIcon, BookOpenIcon, ChatBubbleLeftRightIcon, AssignmentIcon, CalendarIcon } from './Icons';
import HomePage from './HomePage';
import HomeworkPage from './HomeworkPage';
import TestsPage from './TestsPage';
import ResourcesPage from './ResourcesPage';
import QueriesPage from './QueriesPage';
import AssignmentsPage from './AssignmentsPage';
import CalendarPage from './CalendarPage';

type Tab = 'home' | 'homework' | 'assignments' | 'tests' | 'resources' | 'queries' | 'calendar';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { id: 'homework', label: 'Homework', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <AssignmentIcon className="w-5 h-5" /> },
    { id: 'tests', label: 'Tests', icon: <BeakerIcon className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpenIcon className="w-5 h-5" /> },
    { id: 'queries', label: 'Queries', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
];

const AdityaDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const context = useContext(AppContext);
    
    useEffect(() => {
        if (context) {
            const { crossUserNotifications, setCrossUserNotifications, showNotification } = context;
            const unread = crossUserNotifications.filter(n => n.recipient === 'student' && !n.isRead);

            if (unread.length > 0) {
                // Show notifications in reverse chronological order (newest first) but process them to appear one by one
                const timer = setTimeout(() => {
                    unread.reverse().forEach((n, index) => {
                        setTimeout(() => {
                           showNotification(`🔔 ${n.message}`, 'success');
                        }, index * 500); // Stagger notifications
                    });

                    setCrossUserNotifications(prev =>
                        prev.map(n => unread.find(u => u.id === n.id) ? { ...n, isRead: true } : n)
                    );
                }, 500); // Small delay to ensure view is loaded
                
                return () => clearTimeout(timer);
            }
        }
    }, [context]);

    if (!context) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage />;
            case 'homework':
                return <HomeworkPage />;
            case 'assignments':
                return <AssignmentsPage />;
            case 'tests':
                return <TestsPage />;
            case 'calendar':
                return <CalendarPage />;
            case 'resources':
                return <ResourcesPage />;
            case 'queries':
                return <QueriesPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4 md:p-6 lg:p-8 lg:pl-24">
                <div key={activeTab} className="animate-fade-in">
                    {renderContent()}
                </div>
            </div>

            {/* Bottom Navigation for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-slate-900/80 backdrop-blur-lg border-t border-slate-700 z-50 animate-slide-in-bottom">
                <nav className="flex items-center h-20 px-2 overflow-x-auto no-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 flex flex-col items-center justify-center space-y-1.5 min-w-[80px] h-16 rounded-xl transition-all duration-300 ease-in-out transform
                                ${activeTab === tab.id 
                                    ? 'bg-indigo-500/20 text-indigo-300 scale-105' 
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                }`
                            }
                        >
                            <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                                {tab.icon}
                            </div>
                            <span className="text-xs font-medium tracking-wide">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Side Navigation for Desktop */}
            <div className="hidden lg:flex fixed top-0 left-0 h-full items-center z-40 animate-slide-in-left">
                <nav className="flex flex-col items-start space-y-2 bg-slate-800/50 backdrop-blur-lg border-r border-t border-b border-slate-700 py-4 px-3 rounded-r-2xl">
                     {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-all duration-200 ${activeTab === tab.id ? 'bg-indigo-600/50 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}
                        >
                            {tab.icon}
                            <span className="font-semibold">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default AdityaDashboard;