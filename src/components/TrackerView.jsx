import React from 'react';
import { Clock, Trash2, Activity } from 'lucide-react';

const TrackerView = ({ logs, onDelete }) => {
    if (!logs || logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh] animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mb-6">
                    <Activity size={32} className="text-teal-300" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">No Entries Yet</h3>
                <p className="text-slate-400 max-w-xs mx-auto">Start logging your baby's activities from the Home tab to see them here.</p>
            </div>
        );
    }

    // Sort logs by timestamp descending
    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800">Activity Log</h2>
                <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-black">{logs.length} Entries</span>
            </div>

            <div className="space-y-4">
                {sortedLogs.map((log, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 flex justify-between items-start group hover:border-teal-100 transition-all">
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-slate-50 font-bold text-slate-400`}>
                                {log.label?.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-800">{log.label}</h4>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {log.value && <p className="text-sm font-bold text-teal-600 mb-0.5">{log.value}</p>}
                                {log.note && <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">{log.note}</p>}
                                <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                    <Clock size={10} />
                                    {new Date(log.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        {onDelete && (
                            <button
                                onClick={() => onDelete(log.id || index)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackerView;
