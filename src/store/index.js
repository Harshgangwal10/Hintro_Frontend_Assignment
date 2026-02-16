import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tasksReducer from './tasksSlice';
import activityReducer from './activitySlice';

const STORAGE_KEY = 'taskboard_tasks';

const getDefaultTasksState = () => ({
  tasks: {
    todo: [],
    doing: [],
    done: [],
  },
  searchQuery: '',
  filterPriority: 'all',
  sortByDueDate: false,
});

const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const parsed = JSON.parse(serializedState);

    if (parsed && typeof parsed === 'object') {
 
      if (!parsed.tasks) {

        return { ...getDefaultTasksState(), ...parsed };
      }
  
      if (!parsed.tasks.todo || !parsed.tasks.doing || !parsed.tasks.done) {
        return { 
          ...getDefaultTasksState(), 
          tasks: {
            todo: parsed.tasks.todo || [],
            doing: parsed.tasks.doing || [],
            done: parsed.tasks.done || [],
          },
          searchQuery: parsed.searchQuery || '',
          filterPriority: parsed.filterPriority || 'all',
          sortByDueDate: parsed.sortByDueDate || false,
        };
      }
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Error loading Redux state:', error);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.tasks);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving Redux state:', error);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    activity: activityReducer,
  },
  preloadedState: preloadedState ? { tasks: preloadedState } : undefined,
});

let saveTimeout;
store.subscribe(() => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveState(store.getState());
  }, 1000);
});

export default store;
