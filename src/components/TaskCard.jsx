import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Edit2, Trash2, Calendar, Tag } from "lucide-react";

const priorityColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-purple-500/50 shadow-2xl opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
    
      <div className="flex items-center justify-between mb-2">
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium border ${priorityColors[task.priority] || priorityColors.medium}`}
        >
          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      
      <h3 className="text-white font-medium mb-2 line-clamp-2">{task.title}</h3>

   
      {task.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

  
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-white/10 text-gray-400 rounded-full text-xs">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}


      {task.dueDate && (
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
        </div>
      )}


      <div className="mt-2 text-gray-500 text-xs">
        Created {format(new Date(task.createdAt), "MMM d, yyyy")}
      </div>
    </div>
  );
};

export default TaskCard;
