import React, { useContext } from 'react';
import { AppContext } from '../App';
import { CalendarIcon, ClipboardDocumentListIcon } from './Icons';

const TestsPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { tests, showNotification } = context;

    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    const dateFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };


    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-4xl font-bold text-slate-100 animate-fade-in-up">Upcoming Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map((test, index) => {
                    const isTestTime = new Date() >= new Date(test.scheduledTime);
                    return (
                        <div 
                            key={test.id} 
                            className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 p-5 rounded-lg shadow-lg flex flex-col justify-between animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div>
                                <p className="font-bold text-lg text-white">{test.title}</p>
                                <div className="flex items-center text-sm text-purple-400 mt-2">
                                    <CalendarIcon className="w-4 h-4 mr-1.5"/>
                                    {new Date(test.scheduledTime).toLocaleString(undefined, dateTimeFormatOptions)}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Scheduled on: {new Date(test.createdAt).toLocaleString(undefined, dateFormatOptions)}
                                </p>
                            </div>
                            <div className="mt-4">
                                {isTestTime ? (
                                    <a href={test.questionPaperUrl} download onClick={() => showNotification('Download started...')} className="inline-flex items-center text-sm font-semibold text-white bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md transition-colors shadow-lg shadow-green-600/30">
                                        <ClipboardDocumentListIcon className="w-4 h-4 mr-2"/> Download Paper
                                    </a>
                                ) : (
                                    <p className="text-sm font-medium text-red-400">Paper will be available at the scheduled time.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TestsPage;