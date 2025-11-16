import React, { useContext } from 'react';
import { AppContext } from '../App';
import { AssignmentType } from '../types';
import { CheckCircleIcon } from './Icons';

const AssignmentsPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { assignments, completeAssignment } = context;

    const getIconForType = (type: AssignmentType) => {
        // Simple emoji icons for different types
        switch (type) {
            case AssignmentType.DO: return '✍️';
            case AssignmentType.READ: return '📚';
            case AssignmentType.WATCH_YT: return '📺';
            case AssignmentType.WATCH_GD: return '🎬';
            default: return '📌';
        }
    };
    
    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };


    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-4xl font-bold text-slate-100 animate-fade-in-up">Your Assignments</h2>
            <div className="space-y-4">
                {assignments.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 animate-fade-in-up">
                        <p>No assignments have been given yet.</p>
                    </div>
                ) : (
                    assignments.map((asgn, index) => (
                        <div
                            key={asgn.id}
                            className={`bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 p-5 rounded-lg shadow-lg flex flex-col sm:flex-row sm:items-center justify-between animate-fade-in-up transition-opacity ${asgn.isCompleted ? 'opacity-60' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex-1 mb-4 sm:mb-0">
                                <div className="flex items-center mb-2">
                                    <span className="text-2xl mr-3">{getIconForType(asgn.type)}</span>
                                    <div>
                                        <p className="font-bold text-lg text-white">{asgn.title}</p>
                                        <p className="text-xs text-indigo-300 font-semibold">{asgn.type}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 mt-1 pl-10">{asgn.description}</p>
                                {asgn.link && (
                                    <a href={asgn.link} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:text-sky-300 hover:underline mt-2 inline-block pl-10">
                                        View Resource &rarr;
                                    </a>
                                )}
                                <p className="text-xs text-slate-500 mt-3 pl-10">Assigned: {new Date(asgn.createdAt).toLocaleString(undefined, dateTimeFormatOptions)}</p>
                            </div>
                            <div className="flex items-center">
                                {asgn.isCompleted ? (
                                    <div className="flex flex-col items-center text-sm bg-green-500/20 text-green-300 px-3 py-2.5 rounded-md">
                                        <div className="flex items-center">
                                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                                            <span className="font-semibold">Completed</span>
                                        </div>
                                        {asgn.completedAt && <span className="text-xs mt-1 text-green-400/80">on {new Date(asgn.completedAt).toLocaleDateString()}</span>}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => completeAssignment(asgn.id)}
                                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                                    >
                                        Mark as Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AssignmentsPage;