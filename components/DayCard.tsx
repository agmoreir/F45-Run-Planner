import React, { useState } from 'react';
import type { RunningDay, Runner } from '../types';
import { RunnerRow } from './RunnerRow';

interface DayCardProps {
  day: RunningDay;
  onAddRunner: (date: string, name: string) => void;
  onToggleJoining: (date: string, runnerId: string) => void;
  onUpdateMiles: (date:string, runnerId: string, miles: number) => void;
  onRemoveRunner: (date: string, runnerId: string) => void;
  isToday: boolean;
  isReadOnly: boolean;
}

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export const DayCard: React.FC<DayCardProps> = ({ day, onAddRunner, onToggleJoining, onUpdateMiles, onRemoveRunner, isToday, isReadOnly }) => {
    const [newRunnerName, setNewRunnerName] = useState('');

    const handleAddRunner = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRunnerName.trim()) {
            onAddRunner(day.date, newRunnerName.trim());
            setNewRunnerName('');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Using 'UTC' timezone to ensure the date displayed matches the date string, avoiding off-by-one errors across timezones.
        return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' });
    };

    const totalMiles = day.runners.reduce((sum, runner) => sum + (runner.isJoining ? runner.miles : 0), 0);
    const joiningCount = day.runners.filter(r => r.isJoining).length;

    return (
        <div className={`flex flex-col bg-slate-800 rounded-xl shadow-lg border ${isToday ? 'border-cyan-500' : 'border-slate-700'} overflow-hidden`}>
            <div className={`p-4 border-b ${isToday ? 'border-cyan-500/30' : 'border-slate-700'}`}>
                <h3 className="text-xl font-bold text-white">{formatDate(day.date)}</h3>
                {isToday && <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Today</span>}
                <div className="flex justify-between items-baseline mt-2 text-sm">
                    <p className="text-slate-400">
                        <span className="font-bold text-green-400">{joiningCount}</span> joining
                    </p>
                    <p className="text-slate-400">
                        Total Miles: <span className="font-bold text-cyan-400">{totalMiles.toFixed(1)}</span>
                    </p>
                </div>
            </div>
            <div className="p-4 space-y-2 flex-grow">
                {day.runners.length > 0 ? (
                    day.runners.map(runner => (
                        <RunnerRow 
                            key={runner.id}
                            runner={runner}
                            onToggle={(runnerId) => onToggleJoining(day.date, runnerId)}
                            onUpdateMiles={(runnerId, miles) => onUpdateMiles(day.date, runnerId, miles)}
                            onRemove={(runnerId) => onRemoveRunner(day.date, runnerId)}
                            isReadOnly={isReadOnly}
                        />
                    ))
                ) : (
                    <p className="text-slate-500 text-center py-4">{isReadOnly ? "No runs were logged for this day." : "No runners yet. Be the first!"}</p>
                )}
            </div>
            {!isReadOnly && (
                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                    <form onSubmit={handleAddRunner} className="flex gap-2">
                        <input
                            type="text"
                            value={newRunnerName}
                            onChange={(e) => setNewRunnerName(e.target.value)}
                            placeholder="Add your name..."
                            className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        />
                        <button
                            type="submit"
                            className="flex-shrink-0 bg-cyan-600 text-white p-2 rounded-md hover:bg-cyan-500 transition-colors duration-200 disabled:bg-slate-600"
                            disabled={!newRunnerName.trim()}
                            aria-label="Add runner"
                        >
                            <AddIcon />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
