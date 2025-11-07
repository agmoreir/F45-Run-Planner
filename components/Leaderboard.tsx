import React from 'react';

interface LeaderboardEntry {
    name: string;
    totalMiles: number;
}

interface LeaderboardProps {
    data: LeaderboardEntry[];
}

const TrophyIcon = ({ rank }: { rank: number }) => {
    const rankClasses: { [key: number]: string } = {
        1: 'text-yellow-400',
        2: 'text-slate-400',
        3: 'text-orange-400',
    };

    if (!rankClasses[rank]) {
        return <span className="font-bold text-slate-500 text-sm w-6 text-center">{rank}</span>;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${rankClasses[rank]}`}>
          <path fillRule="evenodd" d="M15.625 3.375a1.5 1.5 0 0 1 2.25 1.299l.067 1.183c.125.22.285.422.476.591l.978.878c.83.744 1.138 1.9 1.138 2.946v.293c0 1.047-.308 2.202-1.138 2.946l-.978.878a1.688 1.688 0 0 0-.476.591l-.067 1.183a1.5 1.5 0 0 1-2.25 1.299l-1.114-.495a1.688 1.688 0 0 0-.825-.224h-1.922a1.688 1.688 0 0 0-.825.224l-1.114.495a1.5 1.5 0 0 1-2.25-1.299l-.067-1.183a1.688 1.688 0 0 0-.476-.591l-.978-.878C3.308 12.702 3 11.547 3 10.5v-.293c0-1.047.308-2.202 1.138-2.946l.978-.878c.19-.17.351-.37.476-.591l.067-1.183a1.5 1.5 0 0 1 2.25-1.299l1.114.495c.29.129.608.194.925.194h1.922c.317 0 .635-.065.925-.194l1.114-.495ZM8.25 15a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5H9Z" clipRule="evenodd" />
        </svg>
    );
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
    return (
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden sticky top-24">
            <div className="p-4 border-b border-slate-700">
                <h3 className="text-xl font-bold text-white text-center">Weekly Mileage Tracker</h3>
            </div>
            <div className="p-4">
                {data.length > 0 ? (
                    <ol className="space-y-2">
                        {data.map((runner, index) => (
                            <li 
                                key={runner.name} 
                                className="flex items-center gap-4 p-2 rounded-md bg-slate-900/50 border border-slate-700/50"
                            >
                                <div className="flex-shrink-0 w-6 flex items-center justify-center">
                                    <TrophyIcon rank={index + 1} />
                                </div>
                                <span className="flex-grow font-medium text-slate-200 truncate">{runner.name}</span>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="font-bold text-cyan-400 text-lg">{runner.totalMiles.toFixed(1)}</span>
                                    <span className="text-xs text-slate-400">miles</span>
                                </div>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-slate-500 text-center py-8">No mileage logged yet. Let's get running!</p>
                )}
            </div>
        </div>
    );
};
