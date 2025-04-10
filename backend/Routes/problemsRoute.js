import express from 'express';

import {
    getProblemsForManager,
    updateProblemStatusForManager,
    getProblemsForSpecificProject,
    getSpecificProblem
} from '../Controllers/manager/problemsController.js';
import { 
    getProblemsForAdmin
} from '../Controllers/admin/problemsController.js';
import { 
    getProblemsForProjectleader 
} from '../Controllers/projectleader/problemsController.js';
import { 
    updateProblem,
    deleteProblem,
    createProblem
} from '../Controllers/problemsController.js';

const router = express.Router();

router.post('/manager/problem/get-problems', getProblemsForManager);
router.post('/manager/problem/get-specific-problem', getSpecificProblem);
router.post('/manager/problem/get-problems-for-specific-project', getProblemsForSpecificProject);
router.post('/admin/problem/get-problems', getProblemsForAdmin);
router.post('/projectleader/problem/get-problems', getProblemsForProjectleader);
router.post('/manager/problem/update-problem-status', updateProblemStatusForManager);
router.post('/problem/create-problem', createProblem);
router.post('/problem/update-problem', updateProblem);
router.post('/problem/delete-problem', deleteProblem);

export default router;