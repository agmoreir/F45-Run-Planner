
import React from 'react';

interface HeaderProps {
    onGetMotivation: () => void;
    isGenerating: boolean;
}

const RunningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      <path d="M15.424 12.879A6.974 6.974 0 0010 11a6.974 6.974 0 00-5.424 1.879.5.5 0 00-.217.424V15a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-1.697a.5.5 0 00-.217-.424zM10.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 13.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM8 13.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onGetMotivation, isGenerating }) => {
    return (
        <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 p-4 border-b border-slate-700/50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-cyan-400">
                        <path fillRule="evenodd" d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                     </svg>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Run Planner</h1>
                </div>
                <button
                    onClick={onGetMotivation}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isGenerating ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                    )}
                    <span>{isGenerating ? 'Inspiring...' : 'Get Motivation'}</span>
                </button>
            </div>
        </header>
    );
};
   