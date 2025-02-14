import { Task } from "./Task.js";
import { postUserId, postTasks, getTasks, patchTasks, deleteTasks } from "./api.js";

let userId = null;

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".button-add");
    const getButton = document.querySelector(".button-get");
    const modifyButton = document.querySelector(".button-modify");
    const deleteButton = document.querySelector(".button-delete");
    const taskList = document.querySelector(".task-list");
    const taskListContainer = document.querySelector(".task-list-container");
    const taskContainer = document.querySelector(".task-input-container");
    const taskInput = document.querySelector("#taskTitle");
    const submitButton = document.querySelector(".button-submit");

    taskListContainer.style.display = "none";

    addButton.addEventListener("click", function () {
        taskContainer.style.display = "block";
        taskInput.focus();
    });

    getButton.addEventListener("click", async function () {
        if (!userId) {
            alert("You need to create a user before fetching tasks.");
            return;
        }

        taskListContainer.style.display = taskListContainer.style.display === "none" ? "block" : "none";
        if (taskListContainer.style.display === "none") return;

        const tasks = await getTasks(userId);
        taskList.innerHTML = "";

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.classList.add("task-item");
                taskItem.textContent = task.name;
                taskList.appendChild(taskItem);
            });
        } else {
            taskList.innerHTML = "<p>No active tasks available.</p>";
        }
    });

    submitButton.addEventListener("click", async function () {
        const taskTitle = taskInput.value.trim();

        if (!taskTitle) {
            alert("Task title cannot be empty.");
            return;
        }

        if (!userId) {
            userId = await postUserId();
        }

        const newTask = new Task(taskTitle);
        const taskResponse = await postTasks(userId, newTask);

        if (taskResponse) {
            alert("Task successfully added.");
        } else {
            alert("Failed to create a task.");
        }
    });

    modifyButton.addEventListener("click", async function () {
        if (!userId) {
            alert("You need to create a user first.");
            return;
        }

        const tasks = await getTasks(userId);
        taskList.innerHTML = "";
        taskListContainer.style.display = "block";

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.classList.add("task-item");
                taskItem.textContent = task.name;
                taskItem.setAttribute("data-task-id", task.id);
                taskItem.setAttribute("data-task-name", task.name);

                taskItem.addEventListener("click", function () {
                    renameTask(task.name, task.id);
                });

                taskList.appendChild(taskItem);
            });
        } else {
            taskList.innerHTML = "<p>No active tasks available.</p>";
        }
    });

    function renameTask(oldTaskName, taskId) {
        const newTaskName = prompt(`Enter new name for "${oldTaskName}":`);

        if (newTaskName) {
            updateTask(userId, newTaskName, taskId, oldTaskName);
        }
    }

    function updateTask(userId, newTaskName, taskId, oldTaskName) {
        patchTasks(userId, taskId, oldTaskName, newTaskName)
            .then(updatedTask => {
                if (updatedTask) {
                    alert("Task updated successfully.");
                    getButton.click();
                } else {
                    alert("Failed to update task.");
                }
            })
            .catch(error => console.error("Error updating task:", error));
    }

    deleteButton.addEventListener("click", async function () {
        if (!userId) {
            alert("You need to create a user first.");
            return;
        }

        const tasks = await getTasks(userId);
        taskList.innerHTML = "";
        taskListContainer.style.display = "block";

        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.classList.add("task-item");
                taskItem.textContent = task.name;
                taskItem.setAttribute("data-task-id", task.id);

                taskItem.addEventListener("click", async function () {
                    const selectedTaskId = this.getAttribute("data-task-id");
                    const confirmDelete = confirm(`Are you sure you want to delete "${task.name}"?`);

                    if (confirmDelete) {
                        await deleteTasks(userId, selectedTaskId);
                        getButton.click();
                    }
                });

                taskList.appendChild(taskItem);
            });
        } else {
            taskList.innerHTML = "<p>No active tasks available.</p>";
        }
    });
});



