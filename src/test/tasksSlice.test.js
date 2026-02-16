import { describe, it, expect, beforeEach } from 'vitest';
import tasksReducer, {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setSearchQuery,
  setFilterPriority,
  setSortByDueDate,
  resetBoard,
  loadTasks,
} from '../store/tasksSlice';

describe('tasksSlice', () => {
  const initialState = {
    tasks: {
      todo: [],
      doing: [],
      done: [],
    },
    searchQuery: '',
    filterPriority: 'all',
    sortByDueDate: false,
  };

  describe('addTask', () => {
    it('should add a new task to the todo column', () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        dueDate: '2024-12-31',
        tags: ['test'],
        column: 'todo',
      };

      const state = tasksReducer(initialState, addTask(newTask));

      expect(state.tasks.todo).toHaveLength(1);
      expect(state.tasks.todo[0].title).toBe('Test Task');
      expect(state.tasks.todo[0].description).toBe('Test Description');
      expect(state.tasks.todo[0].priority).toBe('high');
    });

    it('should add task with default values when not provided', () => {
      const newTask = {
        title: 'Minimal Task',
        column: 'todo',
      };

      const state = tasksReducer(initialState, addTask(newTask));

      expect(state.tasks.todo).toHaveLength(1);
      expect(state.tasks.todo[0].priority).toBe('medium');
      expect(state.tasks.todo[0].description).toBe('');
      expect(state.tasks.todo[0].tags).toEqual([]);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task from the correct column', () => {
      const stateWithTask = {
        ...initialState,
        tasks: {
          todo: [{ id: 'task-1', title: 'Task to Delete', column: 'todo' }],
          doing: [],
          done: [],
        },
      };

      const state = tasksReducer(stateWithTask, deleteTask({ id: 'task-1' }));

      expect(state.tasks.todo).toHaveLength(0);
    });

    it('should not modify state if task id does not exist', () => {
      const stateWithTask = {
        ...initialState,
        tasks: {
          todo: [{ id: 'task-1', title: 'Existing Task', column: 'todo' }],
          doing: [],
          done: [],
        },
      };

      const state = tasksReducer(stateWithTask, deleteTask({ id: 'non-existent' }));

      expect(state.tasks.todo).toHaveLength(1);
    });
  });

  describe('moveTask', () => {
    it('should move a task from one column to another', () => {
      const stateWithTask = {
        ...initialState,
        tasks: {
          todo: [{ id: 'task-1', title: 'Task to Move', column: 'todo' }],
          doing: [],
          done: [],
        },
      };

      const state = tasksReducer(
        stateWithTask,
        moveTask({
          taskId: 'task-1',
          sourceColumn: 'todo',
          destinationColumn: 'doing',
          destinationIndex: 0,
        })
      );

      expect(state.tasks.todo).toHaveLength(0);
      expect(state.tasks.doing).toHaveLength(1);
      expect(state.tasks.doing[0].title).toBe('Task to Move');
      expect(state.tasks.doing[0].column).toBe('doing');
    });

    it('should move task to end of destination column when no index specified', () => {
      const stateWithTasks = {
        ...initialState,
        tasks: {
          todo: [{ id: 'task-1', title: 'Task to Move', column: 'todo' }],
          doing: [{ id: 'task-2', title: 'Existing Task', column: 'doing' }],
          done: [],
        },
      };

      const state = tasksReducer(
        stateWithTasks,
        moveTask({
          taskId: 'task-1',
          sourceColumn: 'todo',
          destinationColumn: 'doing',
        })
      );

      expect(state.tasks.todo).toHaveLength(0);
      expect(state.tasks.doing).toHaveLength(2);
      expect(state.tasks.doing[1].title).toBe('Task to Move');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const stateWithTask = {
        ...initialState,
        tasks: {
          todo: [{ id: 'task-1', title: 'Original Title', priority: 'low', column: 'todo' }],
          doing: [],
          done: [],
        },
      };

      const state = tasksReducer(
        stateWithTask,
        updateTask({
          id: 'task-1',
          updates: { title: 'Updated Title', priority: 'high' },
        })
      );

      expect(state.tasks.todo[0].title).toBe('Updated Title');
      expect(state.tasks.todo[0].priority).toBe('high');
    });
  });

  describe('setSearchQuery', () => {
    it('should set the search query', () => {
      const state = tasksReducer(initialState, setSearchQuery('test query'));

      expect(state.searchQuery).toBe('test query');
    });
  });

  describe('setFilterPriority', () => {
    it('should set the filter priority', () => {
      const state = tasksReducer(initialState, setFilterPriority('high'));

      expect(state.filterPriority).toBe('high');
    });
  });

  describe('setSortByDueDate', () => {
    it('should toggle sort by due date', () => {
      const state = tasksReducer(initialState, setSortByDueDate(true));

      expect(state.sortByDueDate).toBe(true);
    });
  });

  describe('resetBoard', () => {
    it('should reset all tasks to empty columns', () => {
      const stateWithTasks = {
        ...initialState,
        tasks: {
          todo: [{ id: 'task-1', title: 'Task 1', column: 'todo' }],
          doing: [{ id: 'task-2', title: 'Task 2', column: 'doing' }],
          done: [{ id: 'task-3', title: 'Task 3', column: 'done' }],
        },
      };

      const state = tasksReducer(stateWithTasks, resetBoard());

      expect(state.tasks.todo).toHaveLength(0);
      expect(state.tasks.doing).toHaveLength(0);
      expect(state.tasks.done).toHaveLength(0);
    });
  });

  describe('loadTasks', () => {
    it('should load tasks from payload', () => {
      const tasksToLoad = {
        todo: [{ id: 'task-1', title: 'Loaded Task', column: 'todo' }],
        doing: [],
        done: [],
      };

      const state = tasksReducer(initialState, loadTasks(tasksToLoad));

      expect(state.tasks).toEqual(tasksToLoad);
    });
  });
});
