import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  selectTasks,
  selectSearchQuery,
  selectFilterPriority,
  selectSortByDueDate,
  moveTask,
  resetBoard,
} from "../store/tasksSlice";
import { selectActivities, addActivity } from "../store/activitySlice";
import { logout, selectUser } from "../store/authSlice";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/TaskModal";
import ActivityLog from "../components/ActivityLog";
import SearchFilter from "../components/SearchFilter";
import { LogOut, RotateCcw, Plus, Activity } from "lucide-react";
import { deleteTask } from "../store/tasksSlice";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-slate-500" },
  { id: "doing", title: "In Progress", color: "bg-amber-500" },
  { id: "done", title: "Done", color: "bg-emerald-500" },
];

const TaskBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tasks = useSelector(selectTasks);
  const searchQuery = useSelector(selectSearchQuery);
  const filterPriority = useSelector(selectFilterPriority);
  const sortByDueDate = useSelector(selectSortByDueDate);
  const activities = useSelector(selectActivities);
  const user = useSelector(selectUser);

  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredTasks = useMemo(() => {
    const filtered = {};

    for (const column of COLUMNS) {
      let columnTasks = [...(tasks[column.id] || [])];

      if (searchQuery) {
        columnTasks = columnTasks.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      if (filterPriority !== "all") {
        columnTasks = columnTasks.filter(
          (task) => task.priority === filterPriority,
        );
      }

      if (sortByDueDate) {
        columnTasks.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      }

      filtered[column.id] = columnTasks;
    }

    return filtered;
  }, [tasks, searchQuery, filterPriority, sortByDueDate]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    for (const column of COLUMNS) {
      const task = tasks[column.id]?.find((t) => t.id === active.id);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    let sourceColumn = null;
    for (const column of COLUMNS) {
      if (tasks[column.id]?.find((t) => t.id === activeId)) {
        sourceColumn = column.id;
        break;
      }
    }
    let destinationColumn = null;
    let destinationIndex = null;

    if (COLUMNS.find((c) => c.id === overId)) {
      destinationColumn = overId;
      destinationIndex = tasks[overId]?.length || 0;
    } else {
  
      for (const column of COLUMNS) {
        const taskIndex = tasks[column.id]?.findIndex((t) => t.id === overId);
        if (taskIndex !== undefined && taskIndex !== -1) {
          destinationColumn = column.id;
          destinationIndex = taskIndex;
          break;
        }
      }
    }

    if (sourceColumn && destinationColumn) {
      const sourceTask = tasks[sourceColumn]?.find((t) => t.id === activeId);

      dispatch(
        moveTask({
          taskId: activeId,
          sourceColumn,
          destinationColumn,
          destinationIndex,
        }),
      );

      dispatch(
        addActivity({
          type: "moved",
          taskTitle: sourceTask?.title || "Task",
          details: `Moved from ${sourceColumn} to ${destinationColumn}`,
        }),
      );
    }

    setActiveId(null);
    setActiveTask(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveTask(null);
  };

  const handleAddTask = (column) => {
    setEditingTask({ column });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
   
    let taskToDelete = null;
    for (const column of COLUMNS) {
      const task = tasks[column.id]?.find((t) => t.id === taskId);
      if (task) {
        taskToDelete = task;
        break;
      }
    }

    dispatch(deleteTask({ id: taskId }));
    dispatch(
      addActivity({
        type: "deleted",
        taskTitle: taskToDelete?.title || "Task",
        details: "Task deleted",
      }),
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("taskboard_auth");
    navigate("/login");
  };

  const handleResetBoard = () => {
    dispatch(resetBoard());
    dispatch(
      addActivity({
        type: "reset",
        taskTitle: "Board",
        details: "Board reset to default",
      }),
    );
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">

      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Task Board</h1>
            {user && (
              <span className="text-gray-400 text-sm">
                Welcome, {user.email}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActivityLogOpen(!isActivityLogOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isActivityLogOpen
                  ? "bg-purple-500/30 text-purple-300"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Activity Log"
            >
              <Activity className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              title="Reset Board"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <SearchFilter />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {COLUMNS.map((column) => (
              <SortableContext
                key={column.id}
                items={filteredTasks[column.id]?.map((t) => t.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <TaskColumn
                  column={column}
                  tasks={filteredTasks[column.id] || []}
                  onAddTask={() => handleAddTask(column.id)}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </SortableContext>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-2xl opacity-90 rotate-3">
                <TaskColumn
                  column={{ id: "overlay" }}
                  tasks={[activeTask]}
                  isOverlay
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
      {isActivityLogOpen && (
        <ActivityLog
          activities={activities}
          onClose={() => setIsActivityLogOpen(false)}
        />
      )}

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Reset Board</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to reset the board? This will delete all
              tasks and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-white/5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetBoard}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
