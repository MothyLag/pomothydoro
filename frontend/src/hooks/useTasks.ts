import {
    AddTask,
    GetTasks,
    ToggleComplete,
    DeleteTask,
    SetActiveTask,
    GetActiveTask,
    IncrementSession,
} from "../../wailsjs/go/main/Tasks";

const addTask = async (title: string) => {
    return await AddTask(title);
};

const getTasks = async () => {
    return await GetTasks();
};

const toggleComplete = async (id: number) => {
    return await ToggleComplete(id);
};

const deleteTask = async (id: number) => {
    return await DeleteTask(id);
};

const setActiveTask = async (id: number) => {
    return await SetActiveTask(id);
};

const getActiveTask = async () => {
    return await GetActiveTask();
};

const incrementSession = async (id: number, sessionType: string) => {
    return await IncrementSession(id, sessionType);
};

export default () => {
    return {
        addTask,
        getTasks,
        toggleComplete,
        deleteTask,
        setActiveTask,
        getActiveTask,
        incrementSession,
    };
};
