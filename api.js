const BASE_URL = "https://glo3102lab4.herokuapp.com";

export const getTasks = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${userId}/tasks`);
        if (!response.data || !Array.isArray(response.data.tasks)) return [];
        return response.data.tasks.map(task => ({ name: task.name, id: task.id }));
    } catch (error) {
        return [];
    }
};

export const postUserId = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/users`);
        return response.data?.id;
    } catch (error) {}
};

export const postTasks = async (userId, taskData) => {
    if (!userId) return;
    try {
        const response = await axios.post(`${BASE_URL}/${userId}/tasks`, taskData);
        return response.data;
    } catch (error) {}
};

export const deleteTasks = async (userId, taskId) => {
    if (!userId || !taskId) return;
    try {
        const response = await axios.delete(`${BASE_URL}/${userId}/tasks/${taskId}`, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {}
};

export const patchTasks = async (userId, taskId, oldTaskName, newTaskName) => {
    if (!userId || !taskId) return;
    const presentTasks = await getTasks(userId);
    if (presentTasks.length === 0) return;
    try {
        const response = await axios.put(`${BASE_URL}/${userId}/tasks/${taskId}`, {
            name: newTaskName,
            id: taskId
        });
        return response.data;
    } catch (error) {}
};

    
    




    

