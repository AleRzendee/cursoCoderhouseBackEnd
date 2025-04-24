let tasks = [];

export const getAllTasks = () => tasks;

export const addTask = (title) => {
  tasks.push({ title });
};
