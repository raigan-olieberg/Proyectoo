import express from 'express';

import {
    getResourcesAnalyticsForManager,
    getResourcesWorkedHoursForManager,
} from '../Controllers/manager/workedHoursController.js';
import { 
    getResourcesAnalyticsForAdmin,
    getResourcesWorkedHoursForAdmin
} from '../Controllers/admin/workedHoursController.js';
import { 
    updateWorkedHourStatus,
    updateWorkedHour
} from '../Controllers/workedHoursController.js';

const router = express.Router();

router.post('/manager/workedhour/get-resources-analytics', getResourcesAnalyticsForManager);
router.post('/manager/workedhour/get-resources-workedhours', getResourcesWorkedHoursForManager);
router.post('/admin/workedhour/get-resources-analytics', getResourcesAnalyticsForAdmin);
router.post('/admin/workedhour/get-resources-workedhours', getResourcesWorkedHoursForAdmin);
router.post('/workedhour/update-workedhour-status', updateWorkedHourStatus);
router.post('/workedhour/update-workedhour', updateWorkedHour);

export default router;