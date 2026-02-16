import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../store/tasksSlice";
import { addActivity } from "../store/activitySlice";
import { X, Calendar, Tag, AlertCircle } from "lucide-react";

const TaskModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = task && task.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      if (task.id) {
        setFormData({
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "medium",
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          tags: task.tags ? task.tags.join(", ") : "",
        });
      } else {
        
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
          tags: "",
        });
      }
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      tags: tagsArray,
    };

    if (isEditing) {
      dispatch(
        updateTask({
          id: task.id,
          updates: taskData,
        }),
      );
      dispatch(
        addActivity({
          type: "edited",
          taskTitle: taskData.title,
          details: "Task updated",
        }),
      );
    } else {
      dispatch(
        addTask({
          ...taskData,
          column: task.column || "todo",
        }),
      );
      dispatch(
        addActivity({
          type: "created",
          taskTitle: taskData.title,
          details: `Task created in ${task.column || "todo"}`,
        }),
      );
    }

    setIsSubmitting(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full mx-4 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                errors.title ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

      
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter task description (optional)"
            />
          </div>

      
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="priority-select w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

       
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Tags
            </label>
            <div className="relative">
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-10"
                placeholder="Enter tags (comma separated)"
              />
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas (e.g., frontend, bug, urgent)
            </p>
          </div>

         
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
