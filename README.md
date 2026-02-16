# Task Board

A modern, interactive Task Board application built with React and Vite. Manage your tasks efficiently with drag-and-drop functionality, filtering, search, and activity tracking.

# Live Demo :
[Live Demo](https://taskboard-virid.vercel.app/login)

## Features

- **Authentication** - Secure login system with email/password
- **Drag & Drop** - Intuitive drag-and-drop interface using @dnd-kit
- **Three Columns** - To Do, In Progress, Done
- **Task Management** - Create, edit, and delete tasks
- **Priority Levels** - Low, Medium, High priority with color coding
- **Due Dates** - Set and track task due dates
- **Search & Filter** - Search by title and filter by priority
- **Sort by Due Date** - Automatically sort tasks by due date
- **Activity Log** - Track all board activities and changes
- **Reset Board** - Reset the board to default state
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Routing**: react-router-dom
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint

## Project Structure

```
task-board/
├── public/                
├── src/
│   ├── assets/             
│   ├── components/        
│   │   ├── ActivityLog.jsx    
│   │   ├── SearchFilter.jsx   
│   │   ├── TaskCard.jsx      
│   │   ├── TaskColumn.jsx     
│   │   └── TaskModal.jsx       
│   ├── pages/              
│   │   ├── Login.jsx          
│   │   └── TaskBoard.jsx      
│   ├── store/              
│   │   ├── activitySlice.js   
│   │   ├── authSlice.js       
│   │   ├── index.js          
│   │   └── tasksSlice.js      
│   ├── test/              
│   │   ├── setup.js            
│   │   └── tasksSlice.test.js  
│   ├── App.jsx            
│   ├── index.css           
│   └── main.jsx           
├── index.html              
├── package.json           
├── vite.config.js          
└── eslint.config.js       
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```
bash
git clone <repository-url>
cd task-board
```

2. Install dependencies:
```
bash
npm install
```

3. Start the development server:
```
bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Login Credentials

Email : intern@demo.com
Password: intern123

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run test` | Run tests |


