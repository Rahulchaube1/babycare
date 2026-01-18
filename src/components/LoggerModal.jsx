import React, { useState } from 'react';
import { X, Save, Clock, FileText } from 'lucide-react';

const LoggerModal = ({ type, onClose, onSave }) => {
    const [note, setNote] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            type: type.id,
            timestamp: new Date().toISOString(),
            note,
            value,
            label: type.label
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-${type.color || 'teal'}-50 text-${type.color || 'teal'}-600`}>
                            {type.icon && <type.icon size={24} />}
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Log {type.label}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                            {type.id === 'Medical' ? 'Temperature' : type.id === 'Feeding' ? 'Amount (ml)' : 'Duration/Value'}
                        </label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
                            placeholder={type.id === 'Medical' ? '98.6 F' : 'Enter value...'}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Notes</label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all resize-none h-24"
                            placeholder="Add details..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoggerModal;
