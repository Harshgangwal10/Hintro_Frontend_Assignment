import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'taskboard_tasks';

const getInitialTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
  }
  return {
    todo: [],
    doing: [],
    done: [],
  };
};

const initialState = {
  tasks: getInitialTasks(),
  searchQuery: '',
  filterPriority: 'all',
  sortByDueDate: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const { title, description, priority, dueDate, tags, column } = action.payload;
      const newTask = {
        id: uuidv4(),
        title,
        description: description || '',
        priority: priority || 'medium',
        dueDate: dueDate || null,
        tags: tags || [],
        createdAt: new Date().toISOString(),
        column: column || 'todo',
      };
      state.tasks[column || 'todo'].push(newTask);
    
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      for (const column in state.tasks) {
        const taskIndex = state.tasks[column].findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          state.tasks[column][taskIndex] = { ...state.tasks[column][taskIndex], ...updates };
          break;
        }
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    },
    deleteTask: (state, action) => {
      const { id } = action.payload;
      for (const column in state.tasks) {
        const taskIndex = state.tasks[column].findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          state.tasks[column].splice(taskIndex, 1);
          break;
        }
      }
  
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    },
    moveTask: (state, action) => {
      const { taskId, sourceColumn, destinationColumn, destinationIndex } = action.payload;

      const taskIndex = state.tasks[sourceColumn].findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return;
      
      const [task] = state.tasks[sourceColumn].splice(taskIndex, 1);
      task.column = destinationColumn;
      
  
      if (destinationIndex !== undefined && destinationIndex !== null) {
        state.tasks[destinationColumn].splice(destinationIndex, 0, task);
      } else {
        state.tasks[destinationColumn].push(task);
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterPriority: (state, action) => {
      state.filterPriority = action.payload;
    },
    setSortByDueDate: (state, action) => {
      state.sortByDueDate = action.payload;
    },
    resetBoard: (state) => {
      state.tasks = {
        todo: [],
        doing: [],
        done: [],
      };
      
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },
    loadTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setSearchQuery,
  setFilterPriority,
  setSortByDueDate,
  resetBoard,
  loadTasks,
} = tasksSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;
export const selectSearchQuery = (state) => state.tasks.searchQuery;
export const selectFilterPriority = (state) => state.tasks.filterPriority;
export const selectSortByDueDate = (state) => state.tasks.sortByDueDate;

export default tasksSlice.reducer;
