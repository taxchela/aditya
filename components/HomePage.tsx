import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import type { AppContextType, Homework, Test, Assignment } from '../types';
import { STUDENT_NAME, TEACHER_NAME, MEET_LINK, PHONE_NUMBER, WHATSAPP_LINK, FALLBACK_QUOTES, EXAM_DATE_PAPER_3, EXAM_DATES } from '../constants';
import { fetchMotivationalQuotes } from '../services/geminiService';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { HomeworkStatus } from '../types';
import { GoogleMeetIcon, WhatsAppIcon, AssignmentIcon, CheckCircleIcon, ClipboardDocumentListIcon, VideoCameraIcon } from './Icons';

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +EXAM_DATE_PAPER_3 - +new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return {};
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div className="flex justify-center space-x-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                        {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest">{unit}</span>
                </div>
            ))}
        </div>
    );
};

const UpcomingClass = React.memo(() => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { classes } = context;

    const now = new Date();
    const upcomingClass = classes
        .filter(c => new Date(c.scheduledTime) > now)
        .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0];

    if (!upcomingClass) return null;

    const classTime = new Date(upcomingClass.scheduledTime);
    const formattedTime = classTime.toLocaleString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true });
    const formattedDate = classTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-lg ring-2 ring-indigo-400/50 p-5 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
                <div className="flex items-center mb-4 sm:mb-0">
                    <VideoCameraIcon className="w-10 h-10 text-indigo-300 mr-4 flex-shrink-0" />
                    <div>
                        <p className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">Upcoming Class</p>
                        <p className="text-lg font-bold text-white">{upcomingClass.title}</p>
                        <p className="text-sm text-slate-300">{formattedDate} at {formattedTime}</p>
                    </div>
                </div>
                <a href={upcomingClass.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg transition-all shadow-lg shadow-indigo-600/40 transform hover:scale-105">
                    Join Class
                </a>
            </div>
        </div>
    );
});

const UpcomingTasks = React.memo(() => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { homeworks, tests, assignments, submitHomework, completeAssignment, showNotification } = context;

    const dateFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    const allTasks: ( (Homework & {taskType: 'Homework'}) | (Test & {taskType: 'Test'}) | (Assignment & {taskType: 'Assignment'}) )[] = [
        ...homeworks.filter(h => h.status === HomeworkStatus.Pending).map(h => ({...h, taskType: 'Homework' as const})),
        ...tests.map(t => ({...t, taskType: 'Test' as const})),
        ...assignments.filter(a => !a.isCompleted).map(a => ({...a, taskType: 'Assignment' as const})),
    ];

    const upcoming = allTasks.map(item => {
        let sortDate;
        if ('deadline' in item) sortDate = new Date(item.deadline);
        else if ('scheduledTime' in item) sortDate = new Date(item.scheduledTime);
        else sortDate = new Date(item.createdAt);

        return {
            id: item.id,
            date: sortDate,
            title: item.title,
            type: item.taskType,
            item: item,
        };
    })
    .filter(item => {
        if(item.type === 'Assignment') return true;
        return item.date > new Date();
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);
    
    if (upcoming.length === 0) {
        return (
             <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold text-slate-100 mb-4 text-center lg:text-left">What's Next?</h3>
                <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 p-6 rounded-lg text-center">
                    <p className="font-semibold text-white">All caught up!</p>
                    <p className="text-sm text-slate-400 mt-1">No upcoming tasks for now. Great job!</p>
                </div>
            </div>
        )
    }
    
    const handleFileSubmit = (homeworkId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            submitHomework(homeworkId, file);
        }
    };

    const getTypeStyles = (type: 'Homework' | 'Test' | 'Assignment') => {
        switch(type) {
            case 'Homework': return 'border-l-4 border-amber-500';
            case 'Test': return 'border-l-4 border-purple-500';
            case 'Assignment': return 'border-l-4 border-sky-500';
            default: return '';
        }
    };
    
    const renderActionButton = (task: typeof upcoming[0]) => {
        switch (task.type) {
            case 'Homework':
                return (
                    <label className="cursor-pointer flex items-center justify-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-md transition-colors shadow-md shadow-indigo-600/30">
                        <AssignmentIcon className="w-4 h-4 mr-2"/>
                        Submit Work
                        <input type="file" className="hidden" onChange={(e) => handleFileSubmit(task.id, e)} />
                    </label>
                );
            case 'Assignment':
                return (
                    <button onClick={() => completeAssignment(task.id)} className="flex items-center justify-center text-sm font-semibold text-white bg-green-600 hover:bg-green-500 px-3 py-2 rounded-md transition-colors shadow-lg shadow-green-600/30">
                        <CheckCircleIcon className="w-4 h-4 mr-2"/>
                        Mark as Complete
                    </button>
                );
            case 'Test':
                const isTestTime = new Date() >= task.date;
                const testItem = task.item as Test;
                return isTestTime ? (
                    <a href={testItem.questionPaperUrl} download onClick={() => showNotification('Download started...')} className="flex items-center justify-center text-sm font-semibold text-white bg-green-600 hover:bg-green-500 px-3 py-2 rounded-md transition-colors shadow-lg shadow-green-600/30">
                        <ClipboardDocumentListIcon className="w-4 h-4 mr-2"/>
                        Download Paper
                    </a>
                ) : (
                    <button disabled className="flex items-center justify-center text-sm font-semibold text-slate-400 bg-slate-700 px-3 py-2 rounded-md cursor-not-allowed">
                        <ClipboardDocumentListIcon className="w-4 h-4 mr-2"/>
                        Download Paper
                    </button>
                );
        }
    }

    return (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold text-slate-100 mb-4 text-center lg:text-left">What's Next?</h3>
            <div className="space-y-3">
                {upcoming.map((task, index) => (
                    <div key={index} className={`bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 p-4 rounded-lg flex items-center justify-between ${getTypeStyles(task.type)}`}>
                        <div>
                            <p className="font-semibold text-white">{task.title}</p>
                            <p className="text-xs text-slate-400">
                                {task.type} &bull; {task.type !== 'Assignment' ? `Due ${task.date.toLocaleDateString(undefined, dateFormatOptions)}` : `Assigned ${task.date.toLocaleDateString(undefined, dateFormatOptions)}`}
                            </p>
                        </div>
                        {renderActionButton(task)}
                    </div>
                ))}
            </div>
        </div>
    );
});


const HomePage: React.FC = () => {
    const [motivationalQuote, setMotivationalQuote] = useState('');
    const [quotes, setQuotes] = useState<string[]>(FALLBACK_QUOTES);

    useEffect(() => {
        const getQuotes = async () => {
            const fetchedQuotes = await fetchMotivationalQuotes();
            if (fetchedQuotes.length > 0) setQuotes(fetchedQuotes);
        };
        getQuotes();
    }, []);

    useEffect(() => {
        setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        const interval = setInterval(() => {
            setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        }, 15000);
        return () => clearInterval(interval);
    }, [quotes]);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8 pb-20">
            {/* Welcome & Countdown */}
            <div className="relative bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-center overflow-hidden animate-fade-in-down">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                <p className="text-lg text-indigo-300 font-medium">{formattedDate}</p>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 text-transparent bg-clip-text mt-2">
                    Hey future CA {STUDENT_NAME}!
                </h2>
                <p className="mt-2 text-slate-400">Ready to conquer your goals today?</p>
                <div className="mt-8">
                    <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-4">Countdown to Paper 3 Exam</h3>
                    <CountdownTimer />
                    <p className="mt-8 text-slate-300 italic text-sm transition-opacity duration-1000 h-5">
                        "{motivationalQuote}"
                    </p>
                </div>
            </div>

            {/* Upcoming Class */}
            <UpcomingClass />

            {/* Upcoming Tasks */}
            <UpcomingTasks />

            {/* Main Exam Schedule */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-2xl font-bold text-slate-100 mb-4 text-center lg:text-left">CA Foundation Exams (Jan 2026)</h3>
                <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 p-5 rounded-lg shadow-lg text-slate-300 space-y-3">
                   {EXAM_DATES.map(exam => (
                       <p key={exam.name} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${exam.name.includes("Quantitative Aptitude") ? 'font-bold text-indigo-300' : ''}`}>
                           <span>{exam.name}</span>
                           <span className="font-mono text-slate-400 text-sm mt-1 sm:mt-0">{new Date(exam.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                       </p>
                   ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                 <h3 className="text-2xl font-bold text-slate-100 mb-4 text-center">Need a faster response?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <a href={MEET_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center bg-green-500/20 ring-1 ring-green-400/50 text-green-300 p-4 rounded-xl shadow-lg hover:bg-green-500/30 hover:ring-green-400 transition-all transform hover:-translate-y-1 animate-scale-in-pop" style={{ animationDelay: '0.5s' }}>
                        <GoogleMeetIcon className="h-8 w-8 mb-2"/>
                        <span className="font-semibold">Quick Join</span>
                        <span className="text-xs text-green-400">Google Meet</span>
                    </a>
                    <a href={`tel:${PHONE_NUMBER}`} className="flex flex-col items-center justify-center text-center bg-sky-500/20 ring-1 ring-sky-400/50 text-sky-300 p-4 rounded-xl shadow-lg hover:bg-sky-500/30 hover:ring-sky-400 transition-all transform hover:-translate-y-1 animate-scale-in-pop" style={{ animationDelay: '0.6s' }}>
                        <PhoneIcon className="h-8 w-8 mb-2"/>
                        <span className="font-semibold">Call {TEACHER_NAME} Bhai</span>
                        <span className="text-xs text-sky-400">For Quick Doubts</span>
                    </a>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center bg-teal-500/20 ring-1 ring-teal-400/50 text-teal-300 p-4 rounded-xl shadow-lg hover:bg-teal-500/30 hover:ring-teal-400 transition-all transform hover:-translate-y-1 animate-scale-in-pop" style={{ animationDelay: '0.7s' }}>
                        <WhatsAppIcon className="h-8 w-8 mb-2"/>
                        <span className="font-semibold">WhatsApp {TEACHER_NAME} Bhai</span>
                        <span className="text-xs text-teal-400">Send a Message</span>
                    </a>
                </div>
            </div>

        </div>
    );
};

export default HomePage;