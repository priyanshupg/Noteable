import React, { useState, useEffect } from 'react';
import TaskList from './Components/TaskList';
import TaskForm from './Components/TaskForm';
import TaskFilter from './Components/TaskFilter';

function App() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [editingTask, setEditingTask] = useState(null); // New state for editing task

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (task) => {
        if (editingTask) {
            setTasks(tasks.map(t => (t.id === editingTask.id ? { ...task, id: editingTask.id } : t)));
            setEditingTask(null); // Reset editing task after update
        } else {
            setTasks([...tasks, { ...task, id: Date.now(), completed: false }]);
        }
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const updateTask = (updatedTask) => {
        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingTasks = tasks.filter(task => new Date(task.dueDate) > today && !task.completed);
    const overdueTasks = tasks.filter(task => new Date(task.dueDate) < today && !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Task Form */}
            <TaskForm addTask={addTask} editingTask={editingTask} setEditingTask={setEditingTask} />

            {/* Task Filter and Search Box */}
            <div className="mt-6">
                <TaskFilter filterTasks={(priority) => {/* filter logic here */}} searchTasks={(term) => {/* search logic here */}} />
            </div>

            {/* Task Categories */}
            <div className="flex gap-6 mt-6">
                {/* Upcoming Tasks */}
                <div className="flex-1 bg-blue-100 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold text-blue-700 mb-4">Upcoming Tasks</h2>
                    <TaskList tasks={upcomingTasks} deleteTask={deleteTask} updateTask={updateTask} setEditingTask={setEditingTask} />
                </div>

                {/* Overdue Tasks */}
                <div className="flex-1 bg-red-100 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold text-red-700 mb-4">Overdue Tasks</h2>
                    <TaskList tasks={overdueTasks} deleteTask={deleteTask} updateTask={updateTask} setEditingTask={setEditingTask} />
                </div>

                {/* Completed Tasks */}
                <div className="flex-1 bg-green-100 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold text-green-700 mb-4">Completed Tasks</h2>
                    <TaskList tasks={completedTasks} deleteTask={deleteTask} updateTask={updateTask} setEditingTask={setEditingTask} />
                </div>
            </div>
        </div>
    );
}

export default App;
