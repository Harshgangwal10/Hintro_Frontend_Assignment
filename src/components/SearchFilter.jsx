import { useDispatch, useSelector } from "react-redux";
import {
  selectSearchQuery,
  selectFilterPriority,
  selectSortByDueDate,
  setSearchQuery,
  setFilterPriority,
  setSortByDueDate,
} from "../store/tasksSlice";
import { Search, Filter, SortAsc } from "lucide-react";

const SearchFilter = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const filterPriority = useSelector(selectFilterPriority);
  const sortByDueDate = useSelector(selectSortByDueDate);

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={filterPriority}
            onChange={(e) => dispatch(setFilterPriority(e.target.value))}
            className="pl-10 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-35"
          >
            <option value="all" className="bg-slate-800">
              All Priorities
            </option>
            <option value="low" className="bg-slate-800">
              Low
            </option>
            <option value="medium" className="bg-slate-800">
              Medium
            </option>
            <option value="high" className="bg-slate-800">
              High
            </option>
          </select>
        </div>

        <button
          onClick={() => dispatch(setSortByDueDate(!sortByDueDate))}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
            sortByDueDate
              ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <SortAsc className="w-5 h-5" />
          <span className="text-sm font-medium">Sort by Due Date</span>
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
