'use client';
import { useDashboardStore } from "./useDashboardStore";
import { DashboardHeader } from "./DashboardHeader";
import { ViewTabs } from "./ViewTabs";
import { TasksTable } from "./TaskTable";
import { KanbanBoard } from "./KanbanBoard";
import Calendar from "../calendar/page";

export default function DashboardPage() {
  const { currentView } = useDashboardStore();
  const groups = [{ id: 'g1', title: 'Group 1' }, { id: 'g2', title: 'Group 2' }];

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      <DashboardHeader />
      <ViewTabs />

      {groups.map((group) => (
        <div key={group.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{group.title}</h3>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          
          {/* Conditional Rendering based on store state */}
          {currentView === 'list' && <TasksTable />}
          {currentView === 'kanban' && <KanbanBoard />}
          {currentView === 'calendar' && <Calendar />}
        </div>
      ))}
    </div>
  );
}