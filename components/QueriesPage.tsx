import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { STUDENT_NAME, TEACHER_NAME, MEET_LINK, PHONE_NUMBER, WHATSAPP_LINK } from '../constants';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { GoogleMeetIcon, WhatsAppIcon } from './Icons';

const QueriesPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { queries, submitQuery } = context;

    const [queryText, setQueryText] = useState('');
    const [queryImage, setQueryImage] = useState<{name: string, data: string} | undefined>();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQueryImage({name: file.name, data: reader.result as string});
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuerySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!queryText.trim()) return;
        submitQuery({ studentName: STUDENT_NAME, queryText, image: queryImage });
        setQueryText('');
        setQueryImage(undefined);
        // Reset the file input visually
        (e.target as HTMLFormElement).reset();
    };
    
    const dateTimeFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };


    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-4xl font-bold text-slate-100 animate-fade-in-up">Ask a Query</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ask Query Form */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl shadow-lg p-6 h-full flex flex-col">
                         <form onSubmit={handleQuerySubmit} className="space-y-4 flex-grow flex flex-col">
                            <textarea
                                value={queryText}
                                onChange={(e) => setQueryText(e.target.value)}
                                placeholder="Describe your doubt here..."
                                rows={6}
                                className="w-full p-3 bg-slate-700 text-slate-200 rounded-md border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition flex-grow"
                                required
                            ></textarea>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300 hover:text-white cursor-pointer transition-colors p-2 rounded-md bg-slate-700/50 hover:bg-slate-700">
                                    <span className={queryImage ? 'text-green-400' : ''}>
                                        {queryImage ? `Selected: ${queryImage.name.substring(0,20)}...` : 'Attach File'}
                                    </span>
                                    <input type="file" className="hidden" onChange={handleImageUpload} />
                                </label>
                                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30">Submit Query</button>
                            </div>
                         </form>
                    </div>
                </div>

                {/* Past Queries */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-2xl font-bold text-slate-100 mb-4">Your Past Queries</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl p-4">
                        {queries.length > 0 ? queries.map((q, index) => (
                            <div key={q.id} className="p-3 bg-slate-700/50 rounded-lg animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <p className="text-sm text-slate-300 font-medium">{q.queryText}</p>
                                <p className="text-xs text-slate-500 mt-1">Sent: {new Date(q.createdAt).toLocaleString(undefined, dateTimeFormatOptions)}</p>
                                {q.isResolved ? (
                                    <div className="mt-2 p-3 bg-green-500/10 rounded-md">
                                        <div className="flex justify-between items-center">
                                          <p className="text-xs font-bold text-green-400">Solution from {TEACHER_NAME}:</p>
                                          {q.resolvedAt && <p className="text-xs text-slate-400">Received: {new Date(q.resolvedAt).toLocaleString(undefined, dateTimeFormatOptions)}</p>}
                                        </div>
                                        <p className="text-sm text-green-300 mt-1">{q.solution}</p>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-xs text-amber-400">Waiting for a solution...</p>
                                )}
                            </div>
                        )) : <p className="text-slate-400 text-center py-4">No queries asked yet.</p>}
                    </div>
                </div>
            </div>

            {/* Quick Contact */}
             <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-2xl font-bold text-slate-100 mb-4 text-center">Need a faster response?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <a href={MEET_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center bg-green-500/20 ring-1 ring-green-400/50 text-green-300 p-4 rounded-xl shadow-lg hover:bg-green-500/30 hover:ring-green-400 transition-all transform hover:-translate-y-1">
                        <GoogleMeetIcon className="h-8 w-8 mb-2"/>
                        <span className="font-semibold">Quick Join</span>
                        <span className="text-xs text-green-400">Google Meet</span>
                    </a>
                    <a href={`tel:${PHONE_NUMBER}`} className="flex flex-col items-center justify-center text-center bg-sky-500/20 ring-1 ring-sky-400/50 text-sky-300 p-4 rounded-xl shadow-lg hover:bg-sky-500/30 hover:ring-sky-400 transition-all transform hover:-translate-y-1">
                        <PhoneIcon className="h-8 w-8 mb-2"/>
                        <span className="font-semibold">Call {TEACHER_NAME} Bhai</span>
                        <span className="text-xs text-sky-400">For Urgent Doubts</span>
                    </a>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-center bg-teal-500/20 ring-1 ring-teal-400/50 text-teal-300 p-4 rounded-xl shadow-lg hover:bg-teal-500/30 hover:ring-teal-400 transition-all transform hover:-translate-y-1">
                        <WhatsAppIcon className="h-8 w-8 mb-2"/>
                        <span className="font-semibold">WhatsApp {TEACHER_NAME} Bhai</span>
                        <span className="text-xs text-teal-400">Send a Message</span>
                    </a>
                </div>
             </div>
        </div>
    );
};

export default QueriesPage;