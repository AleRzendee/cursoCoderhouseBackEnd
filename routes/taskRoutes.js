import express from 'express';
import { getTasks, createTask } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasks);
router.post('/add', createTask);

export default router;
