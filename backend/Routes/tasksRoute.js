import express from 'express';

import {
    createMessageActivity
} from '../Controllers/tasksController.js'
import { 
    getTasksForAdmin
} from '../Controllers/admin/tasksController.js';
import { 
    getTasksForManager,
    updateTaskForManager,
    updateStatusForManager,
    deleteTaskForManager,
    getSpecificTask,
    getTasksForSpecificProject,
    getTasksForSpecificPhase
} from '../Controllers/manager/tasksController.js';
import { 
    getTasksForProjectleader 
} from '../Controllers/projectleader/tasksController.js';

const router = express.Router();

router.post('/task/add-message-activity', createMessageActivity);
router.post('/admin/task/get-tasks', getTasksForAdmin);
router.post('/projectleader/task/get-tasks', getTasksForProjectleader);
router.post('/manager/task/get-tasks', getTasksForManager);
router.post('/manager/task/get-specific-task', getSpecificTask);
router.post('/manager/task/get-tasks-for-specific-project', getTasksForSpecificProject);
router.post('/manager/task/get-tasks-for-specific-phase', getTasksForSpecificPhase);
router.post('/manager/task/update-task', updateTaskForManager);
router.post('/manager/task/update-task-status', updateStatusForManager);
router.post('/manager/task/delete-task', deleteTaskForManager);

export default router;