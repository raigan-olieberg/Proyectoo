import express from 'express';

import { 
    getCustomersForManager,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from '../Controllers/manager/customerController.js';

const router = express.Router();

router.post('/manager/customer/get-customers', getCustomersForManager);
router.post('/manager/customer/create-customer', createCustomer);
router.post('/manager/customer/update-customer', updateCustomer);
router.post('/manager/customer/delete-customer', deleteCustomer);

export default router;