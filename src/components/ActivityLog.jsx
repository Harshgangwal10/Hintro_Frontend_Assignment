import { format } from "date-fns";
import { X, Plus, Edit, ArrowRight, Trash2, RotateCcw } from "lucide-react";

const activityIcons = {
  created: Plus,
  edited: Edit,
  moved: ArrowRight,
  deleted: Trash2,
  reset: RotateCcw,
};

const activityColors = {
  created: "text-green-400 bg-green-500/20",
  edited: "text-blue-400 bg-blue-500/20",
  moved: "text-purple-400 bg-purple-500/20",
  deleted: "text-red-400 bg-red-500/20",
  reset: "text-amber-400 bg-amber-500/20",
};

const activityLabels = {
  created: "Created",
  edited: "Edited",
  moved: "Moved",
  deleted: "Deleted",
  reset: "Reset",
};

const ActivityLog = ({ activities, onClose }) => {
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-slate-800/95 backdrop-blur-lg border-l border-white/10 shadow-2xl z-40 transform transition-transform duration-300">

      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Activity Log</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>


      <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-80px)]">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No activities yet</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type] || Activity;
            const colorClass =
              activityColors[activity.type] || "text-gray-400 bg-gray-500/20";
            const label = activityLabels[activity.type] || activity.type;

            return (
              <div
                key={activity.id}
                className="bg-white/5 rounded-xl p-3 border border-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${colorClass.replace("bg-", "text-").replace("/20", "")}`}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {activity.taskTitle}
                    </p>
                    {activity.details && (
                      <p className="text-gray-400 text-xs mt-1">
                        {activity.details}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {format(
                        new Date(activity.timestamp),
                        "MMM d, yyyy h:mm a",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
