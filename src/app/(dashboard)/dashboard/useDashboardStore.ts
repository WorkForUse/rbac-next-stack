import { create } from 'zustand';

type ViewType = 'list' | 'kanban' | 'calendar';

interface DashboardStore {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const useDashboardStore = create<DashboardStore>((set: (arg0: { currentView: any; }) => any) => ({
  currentView: 'list',
  setView: (view: any) => set({ currentView: view }),
}));