import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';

const MILESTONES_DATA = {
    '1-3 Months': [
        'Smiles at people',
        'Can briefly hold head up',
        'Follows objects with eyes',
        'Coos and makes gurgling sounds'
    ],
    '4-6 Months': [
        'Rolls over from tummy to back',
        'Begins to sit without support',
        'Responds to own name',
        'Babbles with expression'
    ],
    '7-9 Months': [
        'Crawls or scoots',
        'Passes objects from hand to hand',
        'Plays peek-a-boo',
        'Stands while holding on'
    ]
};

const MilestonesView = () => {
    const [completed, setCompleted] = useState(() => {
        const saved = localStorage.getItem('babysarthi_milestones');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('babysarthi_milestones', JSON.stringify(completed));
    }, [completed]);

    const toggleMilestone = (milestone) => {
        setCompleted(prev =>
            prev.includes(milestone)
                ? prev.filter(m => m !== milestone)
                : [...prev, milestone]
        );
    };

    const getProgress = (range) => {
        const total = MILESTONES_DATA[range].length;
        const done = MILESTONES_DATA[range].filter(m => completed.includes(m)).length;
        return Math.round((done / total) * 100);
    };

    return (
        <div className="pb-24 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                    <Trophy size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Development Milestones</h2>
                <p className="text-slate-400 text-sm">Track your baby's growth journey</p>
            </div>

            <div className="space-y-6">
                {Object.entries(MILESTONES_DATA).map(([range, items]) => (
                    <div key={range} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="font-bold text-lg text-slate-800">{range}</h3>
                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                                {getProgress(range)}% Complete
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                            <div
                                className="bg-teal-500 h-full transition-all duration-1000 ease-out"
                                style={{ width: `${getProgress(range)}%` }}
                            ></div>
                        </div>

                        <div className="space-y-3">
                            {items.map(item => (
                                <button
                                    key={item}
                                    onClick={() => toggleMilestone(item)}
                                    className="w-full text-left flex items-start gap-3 group"
                                >
                                    <div className={`mt-0.5 transition-colors ${completed.includes(item) ? 'text-teal-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                                        {completed.includes(item) ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                    </div>
                                    <span className={`font-medium transition-all ${completed.includes(item) ? 'text-slate-600' : 'text-slate-500'}`}>
                                        {item}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MilestonesView;
