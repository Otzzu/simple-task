import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';

const taskRouter = Router();

// GET /api/tasks
taskRouter.get('/', getTasks);

// POST /api/tasks
taskRouter.post('/', createTask);

// PUT /api/tasks/:id
taskRouter.put('/:id', updateTask);

// DELETE /api/tasks/:id
taskRouter.delete('/:id', deleteTask);

export default taskRouter;
