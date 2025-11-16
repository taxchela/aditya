import React, { useContext } from 'react';
import { AppContext } from '../App';
import { PdfIcon, ChevronRightIcon } from './Icons';

const ResourcesPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { materials, showNotification } = context;
    
    // Group materials by subject and then chapter for a structured view
    const groupedMaterials = materials.reduce((acc, mat) => {
        const { subject, chapter } = mat;
        if (!acc[subject]) {
            acc[subject] = {};
        }
        if (!acc[subject][chapter]) {
            acc[subject][chapter] = [];
        }
        acc[subject][chapter].push(mat);
        return acc;
    }, {} as Record<string, Record<string, typeof materials>>);


    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-4xl font-bold text-slate-100 animate-fade-in-up">Study Resources</h2>
            <div className="space-y-8">
                {Object.entries(groupedMaterials).map(([subject, chapters], s_idx) => (
                    <div key={subject} className="animate-fade-in-up" style={{ animationDelay: `${s_idx * 0.1}s` }}>
                        <h3 className="text-2xl font-semibold text-indigo-400 mb-4">{subject}</h3>
                        <div className="space-y-6">
                            {Object.entries(chapters).map(([chapter, files], c_idx) =>(
                                <div key={chapter}>
                                    <h4 className="font-bold text-slate-200 mb-2">{chapter}</h4>
                                     <div className="bg-slate-800/50 backdrop-blur-lg ring-1 ring-white/10 rounded-xl p-4 space-y-3">
                                         {files.map(mat => (
                                             <a href={mat.fileUrl} download onClick={() => showNotification('Download started...')} key={mat.id} className="flex items-center p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group">
                                                 <PdfIcon className="w-7 h-7 mr-4 text-red-500"/>
                                                 <div className="flex-1">
                                                     <p className="font-semibold text-slate-100">{mat.title}</p>
                                                     <p className="text-xs text-slate-400">Uploaded on: {new Date(mat.createdAt).toLocaleDateString()}</p>
                                                 </div>
                                                 <ChevronRightIcon className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors"/>
                                             </a>
                                         ))}
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourcesPage;