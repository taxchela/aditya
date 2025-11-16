import React, { useContext } from 'react';
import { AppContext } from '../App';
import type { AppContextType } from '../types';
import { HomeworkStatus } from '../types';
import { ClockIcon, PdfIcon, AssignmentIcon, CheckCircleIcon } from './Icons';

const HomeworkPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { homeworks, submitHomework, showNotification } = context;

    const handleHomeworkSubmit = (homeworkId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            submitHomework(homeworkId, file);
        }
    };

    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    const dateFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-4xl font-bold text-slate-100 animate-fade-in-up">Your Homework</h2>
            <div className="space-y-4">
                {homeworks.map((hw, index) => (
                    <div 
                        key={hw.id} 
                        className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 p-5 rounded-lg shadow-lg flex flex-col sm:flex-row sm:items-center justify-between animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex-1 mb-4 sm:mb-0">
                            <p className="font-bold text-lg text-white">{hw.title}</p>
                            <p className="text-sm text-slate-400 mt-1">{hw.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center text-xs mt-3 space-y-1 sm:space-y-0 sm:space-x-4">
                                <p className="text-slate-400"><span className="font-semibold">Assigned:</span> {new Date(hw.createdAt).toLocaleString(undefined, dateFormatOptions)}</p>
                                <div className="flex items-center text-amber-400">
                                    <ClockIcon className="w-4 h-4 mr-1.5" />
                                    <span className="font-semibold">Deadline:</span>&nbsp;{new Date(hw.deadline).toLocaleString(undefined, dateTimeFormatOptions)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                             <a href={hw.fileUrl} download onClick={() => showNotification('Download started...')} className="inline-flex items-center justify-center text-sm font-semibold text-slate-300 bg-slate-700/70 hover:bg-slate-700 px-4 py-2 rounded-md transition-colors" title="Download Homework">
                                <PdfIcon className="w-4 h-4 mr-2"/>
                                Download PDF
                            </a>
                            {hw.status === HomeworkStatus.Pending && (
                                <label className="cursor-pointer inline-flex items-center justify-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors shadow-md shadow-indigo-600/30" title="Submit Homework">
                                    <AssignmentIcon className="w-4 h-4 mr-2"/>
                                    Submit Work
                                    <input type="file" className="hidden" onChange={(e) => handleHomeworkSubmit(hw.id, e)} />
                                </label>
                            )}
                            {hw.status === HomeworkStatus.Submitted && (
                                <div className="flex flex-col items-center text-sm bg-green-500/20 text-green-300 px-3 py-2.5 rounded-md">
                                    <div className="flex items-center">
                                        <CheckCircleIcon className="w-5 h-5 mr-2"/>
                                        <span className="font-semibold">Submitted</span>
                                    </div>
                                    {hw.submittedAt && <span className="text-xs mt-1 text-green-400/80">on {new Date(hw.submittedAt).toLocaleDateString()}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeworkPage;