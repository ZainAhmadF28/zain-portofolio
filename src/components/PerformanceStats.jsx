// Performance Stats Display Component (Development Only)
import { useEffect, useState } from 'react';
import { performanceMonitor } from '../lib/performance-monitor';

const PerformanceStats = () => {
  const [stats, setStats] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.PROD) return;

    performanceMonitor.start();

    const interval = setInterval(() => {
      setStats(performanceMonitor.getStatus());
    }, 100); // Update every 100ms

    return () => {
      clearInterval(interval);
      performanceMonitor.stop();
    };
  }, []);

  // Don't render in production
  if (import.meta.env.PROD || !stats) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-400 border-green-400';
      case 'ok': return 'text-yellow-400 border-yellow-400';
      case 'bad': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getFPSColor = (fps) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setShow(!show)}
        className="mb-2 px-3 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono hover:bg-slate-800 transition-colors"
      >
        {show ? '📊 Hide Stats' : '📊 Show Stats'}
      </button>

      {/* Stats Panel */}
      {show && (
        <div className={`p-4 rounded-lg bg-slate-900/90 backdrop-blur-sm border ${getStatusColor(stats.status)} shadow-lg max-w-xs`}>
          <div className="font-mono text-xs space-y-2">
            {/* FPS */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">FPS:</span>
              <span className={`font-bold ${getFPSColor(stats.fps)}`}>
                {stats.fps} / {stats.avgFps} avg
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status:</span>
              <span className={`font-bold uppercase ${getStatusColor(stats.status).split(' ')[0]}`}>
                {stats.status}
              </span>
            </div>

            {/* Memory */}
            {stats.memory && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Memory:</span>
                  <span className="text-white">{stats.memory.used}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Usage:</span>
                  <span className="text-white">{stats.memory.percentage}</span>
                </div>
              </>
            )}

            {/* Suggestions */}
            {stats.suggestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-slate-400 mb-1">Suggestions:</div>
                <ul className="text-slate-300 space-y-1 text-[10px]">
                  {stats.suggestions.map((suggestion, i) => (
                    <li key={i}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={() => {
                const data = performanceMonitor.exportData();
                console.log('Performance Data:', data);
                // Optionally copy to clipboard
                navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                alert('Performance data copied to clipboard!');
              }}
              className="w-full mt-2 px-2 py-1 rounded bg-slate-800 border border-slate-600 text-slate-300 text-[10px] hover:bg-slate-700 transition-colors"
            >
              📋 Export Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceStats;
