import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

const TaskColumn = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isOverlay,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  if (isOverlay) {
    return (
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`bg-white/5 backdrop-blur-lg rounded-2xl p-4 border transition-all duration-200 ${
        isOver ? "border-purple-500/50 bg-purple-500/10" : "border-white/10"
      }`}
    >
    
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${column.color}`} />
          <h2 className="text-lg font-semibold text-white">{column.title}</h2>
          <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-50">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tasks yet. Click + to add one.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default TaskColumn;
