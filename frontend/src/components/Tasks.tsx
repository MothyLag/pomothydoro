import { useEffect, useState } from "react";
import useTasks from "../hooks/useTasks";
import { tasks } from "../../wailsjs/go/models";

export default () => {
    const {
        getTasks,
        addTask,
        toggleComplete,
        deleteTask,
        setActiveTask,
        getActiveTask,
        saveTasks,
    } = useTasks();
    const [tasks, setTasks] = useState<tasks.Task[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [activeTaskId, setActiveTaskId] = useState<number>(-1);

    const fetchTasks = async () => {
        const t = await getTasks();
        setTasks(t || []);
        const active = await getActiveTask();
        setActiveTaskId(active);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        await addTask(newTitle.trim());
        setNewTitle("");
        await fetchTasks();
    };

    const handleSaveTask = async () => {
        await saveTasks();
    };

    const handleTaskClick = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div
            className="w-full h-full backdrop-blur-2xl bg-indigo-500/80 cursor-default p-2"
            onClick={handleTaskClick}
        >
            <form onSubmit={handleAddTask} className="flex gap-1 mb-2">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Nueva tarea..."
                    className="flex-1 bg-white/10 text-white text-xs px-2 py-1 rounded outline-none placeholder:text-white/40"
                />
                <button
                    type="submit"
                    className="bg-white/20 text-white text-xs px-2 py-1 rounded hover:bg-white/30"
                >
                    +
                </button>
            </form>
            {tasks.length === 0 ? (
                <p className="text-white/60 text-xs">No hay tareas</p>
            ) : (
                <ul className="space-y-1">
                    {tasks.map((task) => (
                        <li
                            key={task.ID}
                            onClick={async () => {
                                await setActiveTask(task.ID);
                                await fetchTasks();
                            }}
                            className={`flex items-center gap-2 text-white text-xs py-1 px-1 rounded cursor-pointer
                                ${task.ID === activeTaskId ? "bg-white/20 border-l-2 border-indigo-300" : "hover:bg-white/10"}`}
                        >
                            <input
                                type="checkbox"
                                checked={task.Completed}
                                onChange={async (e) => {
                                    e.stopPropagation();
                                    await toggleComplete(task.ID);
                                    await fetchTasks();
                                }}
                                className="accent-indigo-300"
                            />
                            <span
                                className={
                                    task.Completed
                                        ? "line-through opacity-50"
                                        : ""
                                }
                            >
                                {task.Title}
                            </span>
                            {(task.WorkSessions > 0 ||
                                task.ShortRestSessions > 0 ||
                                task.LongRestSessions > 0) && (
                                <span className="text-white/40 text-[10px]">
                                    {task.WorkSessions}w{" "}
                                    {task.ShortRestSessions}sr{" "}
                                    {task.LongRestSessions}lr
                                </span>
                            )}
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await deleteTask(task.ID);
                                    await fetchTasks();
                                }}
                                className="text-white/40 hover:text-red-400 text-xs ml-auto"
                            >
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <button
                onClick={async () => {
                    await saveTasks();
                }}
            >
                Save
            </button>
        </div>
    );
};
