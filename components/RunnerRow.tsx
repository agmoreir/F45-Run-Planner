import React, { useState } from 'react';
import type { Runner } from '../types';

interface RunnerRowProps {
  runner: Runner;
  onToggle: (id: string) => void;
  onUpdateMiles: (id: string, miles: number) => void;
  onRemove: (id: string) => void;
  isReadOnly: boolean;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const RunnerRow: React.FC<RunnerRowProps> = ({ runner, onToggle, onUpdateMiles, onRemove, isReadOnly }) => {
    const [miles, setMiles] = useState(runner.miles.toString());

    const handleMilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMiles(e.target.value);
    };

    const handleMilesBlur = () => {
        const newMiles = parseFloat(miles);
        if (!isNaN(newMiles) && newMiles >= 0) {
            onUpdateMiles(runner.id, newMiles);
        } else {
            // Reset to original value if input is invalid
            setMiles(runner.miles.toString());
        }
    };

    return (
        <div className={`flex items-center gap-2 p-2 rounded-md ${!isReadOnly && 'transition-colors duration-200 hover:bg-slate-700/50'}`}>
            <button
                onClick={() => onToggle(runner.id)}
                disabled={isReadOnly}
                className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200 ${
                    runner.isJoining ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'
                } ${!isReadOnly && !runner.isJoining ? 'hover:bg-slate-500' : ''} ${isReadOnly ? 'cursor-default' : ''}`}
            >
                {runner.isJoining ? <CheckIcon /> : <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
            </button>
            <span className="flex-grow font-medium text-slate-200 truncate">{runner.name}</span>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={miles}
                    onChange={handleMilesChange}
                    onBlur={handleMilesBlur}
                    min="0"
                    step="0.1"
                    className="w-16 text-right bg-slate-900 border border-slate-600 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="Miles"
                    disabled={!runner.isJoining || isReadOnly}
                />
                <button 
                    onClick={() => onRemove(runner.id)} 
                    disabled={isReadOnly}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors disabled:text-slate-600 disabled:hover:text-slate-600 disabled:cursor-not-allowed"
                    aria-label={`Remove ${runner.name}`}
                >
                    <XIcon />
                </button>
            </div>
        </div>
    );
};
