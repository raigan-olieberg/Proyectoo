import express from 'express';

import {
    getData
} from '../Controllers/manager/dashboardController.js';

const router = express.Router();

router.post('/manager/dashboard/get-data', getData);

export default router;