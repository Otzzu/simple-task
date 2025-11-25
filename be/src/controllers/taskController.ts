import { Request, Response, NextFunction } from 'express';
import Task from '../models/task';
import { AppError } from '../utils/AppError';

// POST /api/tasks
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const newTask = await Task.create({ title, description });
    res.status(201).json({
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']],
    });

    const groupedTasks = tasks.reduce(
      (acc: Record<string, Task[]>, task: Task) => {
        const status = task.status;

        if (acc[status]) {
          acc[status].push(task);
        }

        return acc;
      },
      {
        'To Do': [] as Task[],
        'In Progress': [] as Task[],
        Done: [] as Task[],
      }
    );

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      data: groupedTasks,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id (partial update)
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findByPk(id);

    if (!task) {
      throw new AppError('Task not found', 404, {});
    }

    await task.update({ title, description, status });
    res.status(200).json({
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);

    if (!task) {
      throw new AppError('Task not found', 404, {});
    }

    await task.destroy();
    res.status(200).json({
      message: 'Task deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
