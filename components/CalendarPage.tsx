import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { EXAM_DATES, FALLBACK_QUOTES } from '../constants';
import { fetchMotivationalQuotes } from '../services/geminiService';

const CalendarPage: React.FC = () => {
    const context = useContext(AppContext);
    
    // Motivational Quote Logic
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
        if (quotes.length > 0) {
            setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            const interval = setInterval(() => {
                setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [quotes]);

    // Calendar Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    const endDate = EXAM_DATES[EXAM_DATES.length - 1].date;

    // This function correctly generates a 'YYYY-MM-DD' string from a local date's components,
    // ensuring the calendar grid aligns with the UTC-based event dates.
    const getUTCDateKey = (date: Date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];

    const allEvents = new Map<string, { type: string; title: string }[]>();

    if (context) {
        const { homeworks, tests, classes } = context;
        homeworks.forEach(hw => {
            const dateStr = new Date(hw.deadline).toISOString().split('T')[0];
            if (!allEvents.has(dateStr)) allEvents.set(dateStr, []);
            allEvents.get(dateStr)!.push({ type: 'homework', title: hw.title });
        });
        tests.forEach(t => {
            const dateStr = new Date(t.scheduledTime).toISOString().split('T')[0];
            if (!allEvents.has(dateStr)) allEvents.set(dateStr, []);
            allEvents.get(dateStr)!.push({ type: 'test', title: t.title });
        });
        classes.forEach(c => {
            const dateStr = new Date(c.scheduledTime).toISOString().split('T')[0];
            if (!allEvents.has(dateStr)) allEvents.set(dateStr, []);
            allEvents.get(dateStr)!.push({ type: 'class', title: c.title });
        });
    }
    
    EXAM_DATES.forEach(exam => {
        const dateStr = exam.date.toISOString().split('T')[0];
        if (!allEvents.has(dateStr)) allEvents.set(dateStr, []);
        allEvents.get(dateStr)!.push({ type: 'exam', title: exam.name });
    });
    
    // FIX: Explicitly type `days` as `Date[]` to prevent type inference issues downstream.
    const days: Date[] = [];
    let currentDate = new Date(startDate);
    // Ensure endDate is included in the loop
    while (currentDate <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const months = days.reduce((acc, date) => {
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(date);
        return acc;
    }, {} as Record<string, Date[]>);

    const getEventTypeIndicator = (events: { type: string }[] | undefined) => {
        if (!events || events.length === 0) return null;
        
        const indicators = [];
        if (events.some(e => e.type === 'exam')) indicators.push(<div key="exam" className="w-1.5 h-1.5 rounded-full bg-red-400"></div>);
        if (events.some(e => e.type === 'test')) indicators.push(<div key="test" className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>);
        if (events.some(e => e.type === 'homework')) indicators.push(<div key="homework" className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>);
        if (events.some(e => e.type === 'class')) indicators.push(<div key="class" className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>);
        
        return <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-1">{indicators}</div>
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="animate-fade-in-up">
                <h2 className="text-4xl font-bold text-slate-100">Schedule & Calendar</h2>
                 <p className="mt-4 text-center text-slate-400 italic text-sm transition-opacity duration-1000 h-5">
                    "{motivationalQuote}"
                </p>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs mb-4">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div> Exam Day</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div> Test Day</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div> Homework Deadline</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-sky-400 mr-2"></div> Class</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-indigo-500 ring-2 ring-indigo-300 mr-2"></div> Today</div>
                </div>
                {Object.entries(months).map(([monthYear, monthDays]) => {
                    const firstDayOfMonth = monthDays[0].getDay();
                    return (
                        <div key={monthYear} className="mb-8">
                            <h4 className="text-xl font-bold text-indigo-400 mb-4">{monthYear}</h4>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                                {monthDays.map(day => {
                                    const dateStr = getUTCDateKey(day);
                                    const isToday = dateStr === getUTCDateKey(today);
                                    const dayEvents = allEvents.get(dateStr);
                                    
                                    let eventsTooltip: string | undefined;
                                    if (Array.isArray(dayEvents)) {
                                        eventsTooltip = dayEvents.map(e => `${e.type.charAt(0).toUpperCase() + e.type.slice(1)}: ${e.title}`).join('\n');
                                    }
                                    
                                    return (
                                        <div key={dateStr} title={eventsTooltip} className={`relative flex items-center justify-center h-12 rounded-lg transition-colors
                                            ${isToday ? 'bg-indigo-500/50 ring-2 ring-indigo-400' : 'bg-slate-800/40'}
                                            ${dayEvents ? 'hover:bg-slate-700' : ''}
                                        `}>
                                            <span className={`font-semibold ${isToday ? 'text-white' : 'text-slate-300'}`}>{day.getDate()}</span>
                                            {getEventTypeIndicator(dayEvents)}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default CalendarPage;