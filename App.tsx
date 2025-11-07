import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { RunningDay } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getMotivationalQuote } from './services/geminiService';
import { Header } from './components/Header';
import { DayCard } from './components/DayCard';
import { Leaderboard } from './components/Leaderboard';

function getLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getNextSevenDays(): string[] {
    const days: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(getLocalDateString(date));
    }
    return days;
}


const App: React.FC = () => {
    const [runningDays, setRunningDays] = useLocalStorage<RunningDay[]>('runningDays', []);
    const [isGenerating, setIsGenerating] = useState(false);
    const [motivation, setMotivation] = useState<string | null>(null);
    const [view, setView] = useState<'upcoming' | 'history'>('upcoming');

    useEffect(() => {
        const sevenDays = getNextSevenDays();

        setRunningDays(prevDays => {
            const daysMap = new Map(prevDays.map(day => [day.date, day]));
            for (const dateStr of sevenDays) {
                if (!daysMap.has(dateStr)) {
                    daysMap.set(dateStr, { date: dateStr, runners: [] });
                }
            }
            return Array.from(daysMap.values());
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGetMotivation = useCallback(async () => {
        setIsGenerating(true);
        setMotivation(null);
        try {
            const quote = await getMotivationalQuote();
            setMotivation(quote);
        } catch (error) {
            console.error(error);
            setMotivation("Failed to fetch motivation. Just run!");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const updateRunningDay = (date: string, updateFn: (day: RunningDay) => RunningDay) => {
        setRunningDays(prevDays => 
            prevDays.map(day => day.date === date ? updateFn(day) : day)
        );
    };

    const handleAddRunner = (date: string, name: string) => {
        updateRunningDay(date, day => ({
            ...day,
            runners: [...day.runners, { id: crypto.randomUUID(), name, isJoining: true, miles: 0 }]
        }));
    };

    const handleToggleJoining = (date: string, runnerId: string) => {
        updateRunningDay(date, day => ({
            ...day,
            runners: day.runners.map(r => r.id === runnerId ? { ...r, isJoining: !r.isJoining } : r)
        }));
    };

    const handleUpdateMiles = (date: string, runnerId: string, miles: number) => {
        updateRunningDay(date, day => ({
            ...day,
            runners: day.runners.map(r => r.id === runnerId ? { ...r, miles } : r)
        }));
    };
    
    const handleRemoveRunner = (date: string, runnerId: string) => {
         updateRunningDay(date, day => ({
            ...day,
            runners: day.runners.filter(r => r.id !== runnerId)
        }));
    };
    
    const leaderboardData = useMemo(() => {
        const runnerMiles = new Map<string, number>();

        runningDays.forEach(day => {
            day.runners.forEach(runner => {
                if (runner.isJoining && runner.miles > 0) {
                    const currentMiles = runnerMiles.get(runner.name) || 0;
                    runnerMiles.set(runner.name, currentMiles + runner.miles);
                }
            });
        });

        const data = Array.from(runnerMiles.entries()).map(([name, totalMiles]) => ({
            name,
            totalMiles,
        }));

        data.sort((a, b) => b.totalMiles - a.totalMiles);
        return data;
    }, [runningDays]);

    const todayString = getLocalDateString(new Date());

    const displayedDays = useMemo(() => {
        if (view === 'upcoming') {
             return runningDays
                .filter(day => day.date >= todayString)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 7);
        } else {
            return runningDays
                .filter(day => day.date < todayString)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    }, [runningDays, view, todayString]);

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Header onGetMotivation={handleGetMotivation} isGenerating={isGenerating} />
            
            <main className="container mx-auto p-4 md:p-6">
                {motivation && (
                    <div className="relative bg-cyan-900/50 border border-cyan-700 text-cyan-200 px-4 py-3 rounded-lg mb-6 text-center shadow-lg animate-fade-in">
                        <p className="font-semibold italic">"{motivation}"</p>
                         <button onClick={() => setMotivation(null)} className="absolute top-1 right-1 p-1 text-cyan-400 hover:text-white">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row-reverse gap-8">
                    <aside className="lg:w-1/3 lg:flex-shrink-0">
                        <Leaderboard data={leaderboardData} />
                    </aside>
                    <div className="lg:w-2/3">
                         <div className="mb-6 flex justify-center p-1 rounded-lg bg-slate-800 w-fit mx-auto">
                            <button 
                                onClick={() => setView('upcoming')}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'upcoming' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                            >
                                Upcoming Week
                            </button>
                            <button 
                                onClick={() => setView('history')}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'history' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                            >
                                Past Runs
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {displayedDays.length > 0 ? displayedDays.map(day => (
                                <DayCard 
                                    key={day.date}
                                    day={day}
                                    onAddRunner={handleAddRunner}
                                    onToggleJoining={handleToggleJoining}
                                    onUpdateMiles={handleUpdateMiles}
                                    onRemoveRunner={handleRemoveRunner}
                                    isToday={day.date === todayString}
                                    isReadOnly={day.date < todayString}
                                />
                            )) : (
                                <div className="md:col-span-2 text-center py-16 px-6 bg-slate-800 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-semibold text-white">No Runs Here</h3>
                                    <p className="text-slate-400 mt-2">
                                        {view === 'history' 
                                            ? "You haven't logged any past runs yet." 
                                            : "No upcoming runs scheduled. Time to plan!"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                 <div className="text-center mt-8 text-slate-500 text-sm">
                    <p>
                        This is a demo app. Data is stored locally in your browser.
                    </p>
                    <p>
                        For a real multi-user experience, a backend database would be required.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default App;
