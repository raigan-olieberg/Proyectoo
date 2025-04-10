import express from 'express';

import {
    getUsersForManager,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    sendActivationMail,
    getSpecificUser
} from '../Controllers/manager/resourceController.js';
import { 
    getUsersForAdmin,
    getAdminsAndManagersForAdmin
} from '../Controllers/admin/resourceController.js';

const router = express.Router();

router.post('/manager/resource/get-users', getUsersForManager);
router.post('/manager/resource/get-specific-user', getSpecificUser);
router.post('/admin/resource/get-users', getUsersForAdmin);
router.post('/admin/resource/get-admins-and-managers', getAdminsAndManagersForAdmin);
router.post('/manager/resource/create-user', createUser);
router.post('/manager/resource/update-user', updateUser);
router.post('/manager/resource/update-user-status', updateUserStatus);
router.post('/manager/resource/send-activation-mail', sendActivationMail);
router.post('/manager/resource/delete-user', deleteUser);

export default router;