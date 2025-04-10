import express from 'express';

import { 
    getDayviewResourcePlanningForAdmin,
    getWeekviewResourcePlanningForAdmin
} from '../Controllers/admin/resourcePlanningController.js';

const router = express.Router();

router.post('/admin/resource-planning/get-dayview', getDayviewResourcePlanningForAdmin);
router.post('/admin/resource-planning/get-weekview', getWeekviewResourcePlanningForAdmin);

export default router;