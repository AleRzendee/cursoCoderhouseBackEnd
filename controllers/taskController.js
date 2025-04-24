import { getAllTasks, addTask } from '../dao/taskDAO.js';

export const getTasks = (req, res) => {
  const tasks = getAllTasks();
  res.render('index', { tasks });
};

export const createTask = (req, res) => {
  const { title } = req.body;
  if (title) {
    addTask(title);
  }
  res.redirect('/tasks');
};
