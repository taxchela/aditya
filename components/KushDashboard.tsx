import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import type { AppContextType, AssignmentType } from '../types';
import { HomeworkStatus, AssignmentType as AssignmentTypeEnum } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';
import { MEET_LINK } from '../constants';

const KushDashboard: React.FC = () => {
    const context = useContext(AppContext);

    useEffect(() => {
        if (context) {
            const { crossUserNotifications, setCrossUserNotifications, showNotification } = context;
            const unread = crossUserNotifications.filter(n => n.recipient === 'teacher' && !n.isRead);

            if (unread.length > 0) {
                 const timer = setTimeout(() => {
                    unread.reverse().forEach((n, index) => {
                       setTimeout(() => {
                           showNotification(`🔔 ${n.message}`, 'success');
                        }, index * 500);
                    });

                    setCrossUserNotifications(prev =>
                        prev.map(n => unread.find(u => u.id === n.id) ? { ...n, isRead: true } : n)
                    );
                }, 500);
                
                return () => clearTimeout(timer);
            }
        }
    }, [context]);
    
    if (!context) return null;

    const { homeworks, tests, materials, queries, assignments, classes, addHomework, addTest, addMaterial, addAssignment, resolveQuery, addClass } = context;

    // State for forms
    const [hwTitle, setHwTitle] = useState('');
    const [hwDesc, setHwDesc] = useState('');
    const [hwDeadline, setHwDeadline] = useState('');
    const [hwFile, setHwFile] = useState<File | null>(null);

    const [testTitle, setTestTitle] = useState('');
    const [testTime, setTestTime] = useState('');
    const [testFile, setTestFile] = useState<File | null>(null);
    
    const [matSubject, setMatSubject] = useState('Paper-3: Quantitative Aptitude');
    const [matChapter, setMatChapter] = useState('');
    const [matTitle, setMatTitle] = useState('');
    const [matFile, setMatFile] = useState<File | null>(null);
    
    const [asgnTitle, setAsgnTitle] = useState('');
    const [asgnDesc, setAsgnDesc] = useState('');
    const [asgnType, setAsgnType] = useState<AssignmentType>(AssignmentTypeEnum.DO);
    const [asgnLink, setAsgnLink] = useState('');
    
    const [classTitle, setClassTitle] = useState('');
    const [classTime, setClassTime] = useState('');

    const [solutionText, setSolutionText] = useState('');
    const [resolvingQueryId, setResolvingQueryId] = useState<string | null>(null);

    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    const dateFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    const handleAddHomework = (e: React.FormEvent) => {
        e.preventDefault();
        if (hwTitle && hwDesc && hwDeadline && hwFile) {
            addHomework({ title: hwTitle, description: hwDesc, deadline: new Date(hwDeadline).toISOString(), fileUrl: `/homework/${hwFile.name}` });
            setHwTitle(''); setHwDesc(''); setHwDeadline(''); setHwFile(null);
            (e.target as HTMLFormElement).reset();
        }
    };
    
    const handleAddTest = (e: React.FormEvent) => {
        e.preventDefault();
        if (testTitle && testTime && testFile) {
            addTest({ title: testTitle, scheduledTime: new Date(testTime).toISOString(), questionPaperUrl: `/tests/${testFile.name}` });
            setTestTitle(''); setTestTime(''); setTestFile(null);
            (e.target as HTMLFormElement).reset();
        }
    };

    const handleAddMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        if(matSubject && matChapter && matTitle && matFile) {
            addMaterial({ subject: matSubject, chapter: matChapter, title: matTitle, fileUrl: `/materials/${matFile.name}` });
            setMatSubject('Paper-3: Quantitative Aptitude'); setMatChapter(''); setMatTitle(''); setMatFile(null);
            (e.target as HTMLFormElement).reset();
        }
    };

    const handleAddAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (asgnTitle && asgnDesc) {
            addAssignment({ title: asgnTitle, description: asgnDesc, type: asgnType, link: asgnLink });
            setAsgnTitle(''); setAsgnDesc(''); setAsgnType(AssignmentTypeEnum.DO); setAsgnLink('');
            (e.target as HTMLFormElement).reset();
        }
    };
    
    const handleAddClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (classTitle && classTime) {
            addClass({ title: classTitle, scheduledTime: new Date(classTime).toISOString(), meetLink: MEET_LINK });
            setClassTitle(''); setClassTime('');
            (e.target as HTMLFormElement).reset();
        }
    };

    const handleResolveQuery = (queryId: string) => {
        if (solutionText) {
            resolveQuery(queryId, solutionText);
            setSolutionText('');
            setResolvingQueryId(null);
        }
    };

    const inputClasses = "w-full p-3 bg-slate-700 text-slate-200 rounded-md border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
    const buttonClasses = "w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/30";
    const fileInputClasses = "w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 transition";

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-slate-100 animate-fade-in-down">Teacher's Dashboard</h2>

                {/* Grid for Management Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Add Content Panel */}
                    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {/* Add Homework */}
                        <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Add New Homework</h3>
                            <form onSubmit={handleAddHomework} className="space-y-4">
                                <input type="text" placeholder="Title" value={hwTitle} onChange={e => setHwTitle(e.target.value)} className={inputClasses} required />
                                <textarea placeholder="Description" value={hwDesc} onChange={e => setHwDesc(e.target.value)} className={inputClasses} required />
                                <div>
                                    <label htmlFor="hw-deadline" className="block text-sm font-medium text-slate-300 mb-1">Set Homework Due Date</label>
                                    <input id="hw-deadline" type="datetime-local" value={hwDeadline} onChange={e => setHwDeadline(e.target.value)} className={inputClasses} required />
                                </div>
                                <input type="file" onChange={e => setHwFile(e.target.files ? e.target.files[0] : null)} className={fileInputClasses} required />
                                <button type="submit" className={buttonClasses}>Add Homework</button>
                            </form>
                        </div>
                        
                        {/* Schedule Test */}
                         <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                             <h3 className="text-xl font-bold text-white mb-4">Schedule a Test</h3>
                            <form onSubmit={handleAddTest} className="space-y-4">
                                <input type="text" placeholder="Test Title" value={testTitle} onChange={e => setTestTitle(e.target.value)} className={inputClasses} required />
                                <div>
                                    <label htmlFor="test-time" className="block text-sm font-medium text-slate-300 mb-1">Set Test Date & Time</label>
                                    <input id="test-time" type="datetime-local" value={testTime} onChange={e => setTestTime(e.target.value)} className={inputClasses} required />
                                </div>
                                <input type="file" onChange={e => setTestFile(e.target.files ? e.target.files[0] : null)} className={fileInputClasses} required />
                                <button type="submit" className={buttonClasses}>Schedule Test</button>
                            </form>
                        </div>
                        
                        {/* Schedule Class */}
                         <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                             <h3 className="text-xl font-bold text-white mb-4">Schedule a Class</h3>
                            <form onSubmit={handleAddClass} className="space-y-4">
                                <input type="text" placeholder="Class Title (e.g., Doubt Solving Session)" value={classTitle} onChange={e => setClassTitle(e.target.value)} className={inputClasses} required />
                                <div>
                                    <label htmlFor="class-time" className="block text-sm font-medium text-slate-300 mb-1">Set Class Date & Time</label>
                                    <input id="class-time" type="datetime-local" value={classTime} onChange={e => setClassTime(e.target.value)} className={inputClasses} required />
                                </div>
                                <input type="text" value={`Link: ${MEET_LINK}`} className={`${inputClasses} bg-slate-800 cursor-not-allowed`} readOnly />
                                <button type="submit" className={buttonClasses}>Schedule Class</button>
                            </form>
                        </div>

                        {/* Create Assignment */}
                        <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Create New Assignment</h3>
                            <form onSubmit={handleAddAssignment} className="space-y-4">
                                <input type="text" placeholder="Title" value={asgnTitle} onChange={e => setAsgnTitle(e.target.value)} className={inputClasses} required />
                                <textarea placeholder="Description" value={asgnDesc} onChange={e => setAsgnDesc(e.target.value)} className={inputClasses} required />
                                <select value={asgnType} onChange={e => setAsgnType(e.target.value as AssignmentType)} className={inputClasses}>
                                    {Object.values(AssignmentTypeEnum).map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                                { (asgnType === AssignmentTypeEnum.READ || asgnType === AssignmentTypeEnum.WATCH_GD || asgnType === AssignmentTypeEnum.WATCH_YT) &&
                                    <input type="url" placeholder="Link (YouTube, Drive, etc.)" value={asgnLink} onChange={e => setAsgnLink(e.target.value)} className={inputClasses} />
                                }
                                <button type="submit" className={buttonClasses}>Add Assignment</button>
                            </form>
                        </div>
                        
                        {/* Upload Material */}
                         <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                             <h3 className="text-xl font-bold text-white mb-4">Upload Study Material</h3>
                             <form onSubmit={handleAddMaterial} className="space-y-4">
                                 <input type="text" placeholder="Chapter" value={matChapter} onChange={e => setMatChapter(e.target.value)} className={inputClasses} required/>
                                 <input type="text" placeholder="Title (e.g., ICAI Module, Revision Notes)" value={matTitle} onChange={e => setMatTitle(e.target.value)} className={inputClasses} required />
                                 <input type="file" onChange={e => setMatFile(e.target.files ? e.target.files[0] : null)} className={fileInputClasses} required />
                                 <button type="submit" className={buttonClasses}>Upload Material</button>
                             </form>
                        </div>
                    </div>

                    {/* View/Manage Panel */}
                    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {/* Homework Status */}
                        <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Homework Submissions</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {homeworks.map(hw => (
                                    <div key={hw.id} className="p-3 bg-slate-700/50 rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-slate-100">{hw.title}</p>
                                            <p className="text-xs text-slate-400">Assigned: {new Date(hw.createdAt).toLocaleString(undefined, dateFormatOptions)}</p>
                                            <p className="text-xs text-slate-400">Due: {new Date(hw.deadline).toLocaleString(undefined, dateFormatOptions)}</p>
                                        </div>
                                        {hw.status === HomeworkStatus.Submitted ? 
                                            <div className="flex flex-col items-end text-sm text-green-400" title={`Submitted: ${hw.submittedFile?.name}`}>
                                                <div className="flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2"/> Submitted</div>
                                                {hw.submittedAt && <p className="text-xs text-slate-400 mt-1">On: {new Date(hw.submittedAt).toLocaleString(undefined, dateTimeFormatOptions)}</p>}
                                            </div> :
                                            <div className="flex items-center text-sm text-amber-400">
                                                <XCircleIcon className="w-5 h-5 mr-2"/> Pending
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assignment Status */}
                        <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Assignment Status</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {assignments.length > 0 ? assignments.map(asgn => (
                                    <div key={asgn.id} className="p-3 bg-slate-700/50 rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-slate-100">{asgn.title}</p>
                                            <p className="text-xs text-slate-400">Assigned: {new Date(asgn.createdAt).toLocaleString(undefined, dateFormatOptions)}</p>
                                        </div>
                                        {asgn.isCompleted ? 
                                            <div className="flex flex-col items-end text-sm text-green-400">
                                                <div className="flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2"/> Completed</div>
                                                {asgn.completedAt && <p className="text-xs text-slate-400 mt-1">On: {new Date(asgn.completedAt).toLocaleString(undefined, dateTimeFormatOptions)}</p>}
                                            </div> :
                                            <div className="flex items-center text-sm text-amber-400">
                                                <XCircleIcon className="w-5 h-5 mr-2"/> Pending
                                            </div>
                                        }
                                    </div>
                                )) : <p className="text-center text-slate-400 py-4">No assignments given yet.</p>}
                            </div>
                        </div>
                        
                        {/* Scheduled Classes */}
                        <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Scheduled Classes</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {classes.length > 0 ? classes.map(c => (
                                    <div key={c.id} className="p-3 bg-slate-700/50 rounded-md">
                                        <p className="font-semibold text-slate-100">{c.title}</p>
                                        <p className="text-xs text-slate-400">On: {new Date(c.scheduledTime).toLocaleString(undefined, dateTimeFormatOptions)}</p>
                                        <p className="text-xs text-slate-500">Scheduled: {new Date(c.createdAt).toLocaleString(undefined, dateFormatOptions)}</p>
                                    </div>
                                )) : <p className="text-center text-slate-400 py-4">No classes scheduled yet.</p>}
                            </div>
                        </div>

                        {/* Queries from Aditya */}
                         <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Queries from Aditya</h3>
                            <div className="space-y-4 max-h-[40rem] overflow-y-auto pr-2">
                                {queries.map(q => (
                                    <div key={q.id} className="p-4 bg-slate-700/50 rounded-lg">
                                        <p className="text-xs text-slate-400">Received: {new Date(q.createdAt).toLocaleString(undefined, dateTimeFormatOptions)}</p>
                                        <p className="mt-1 font-medium text-slate-100">{q.queryText}</p>
                                        {q.image && <a href={q.image.data} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline">View attached image</a>}
                                        
                                        {q.isResolved ? (
                                            <div className="mt-3 p-3 bg-green-500/10 rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-bold text-green-400">Your Solution:</p>
                                                    {q.resolvedAt && <p className="text-xs text-slate-400">Sent: {new Date(q.resolvedAt).toLocaleString(undefined, dateTimeFormatOptions)}</p>}
                                                </div>
                                                <p className="text-sm text-green-300 mt-1">{q.solution}</p>
                                            </div>
                                        ) : (
                                            resolvingQueryId === q.id ? (
                                                <div className="mt-3 space-y-2">
                                                    <textarea value={solutionText} onChange={e => setSolutionText(e.target.value)} placeholder="Type your solution..." className="w-full p-2 text-sm bg-slate-600 rounded-md" />
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleResolveQuery(q.id)} className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600">Send</button>
                                                        <button onClick={() => setResolvingQueryId(null)} className="px-3 py-1 bg-slate-500 text-xs font-semibold rounded-md hover:bg-slate-600">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button onClick={() => { setResolvingQueryId(q.id); setSolutionText(''); }} className="mt-3 text-sm px-3 py-1.5 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600">Reply</button>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KushDashboard;