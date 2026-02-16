import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'taskboard_activities';

const getInitialActivities = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading activities from localStorage:', error);
  }
  return [];
};

const initialState = {
  activities: getInitialActivities(),
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity: (state, action) => {
      const newActivity = {
        id: Date.now(),
        type: action.payload.type,
        taskTitle: action.payload.taskTitle,
        timestamp: new Date().toISOString(),
        details: action.payload.details || '',
      };
      state.activities.unshift(newActivity);
      // Keep only the last 50 activities
      if (state.activities.length > 50) {
        state.activities = state.activities.slice(0, 50);
      }
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.activities));
      } catch (error) {
        console.error('Error saving activities to localStorage:', error);
      }
    },
    clearActivities: (state) => {
      state.activities = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing activities from localStorage:', error);
      }
    },
  },
});

export const { addActivity, clearActivities } = activitySlice.actions;

export const selectActivities = (state) => state.activity.activities;

export default activitySlice.reducer;
