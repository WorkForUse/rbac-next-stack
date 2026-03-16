import { useDashboardStore } from './useDashboardStore';

export function ViewTabs() {
  const { currentView, setView } = useDashboardStore();

  return (
    <div className="flex gap-3 mt-4">
      <button 
        onClick={() => setView('list')}
        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          currentView === 'list' 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        List
      </button>

      <button 
        onClick={() => setView('kanban')}
        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          currentView === 'kanban' 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Kanban
      </button>

      <button 
        onClick={() => setView('calendar')}
        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          currentView === 'calendar' 
            ? 'bg-blue-500 text-white shadow-sm' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Calendar
      </button>
    </div>
  );
}
