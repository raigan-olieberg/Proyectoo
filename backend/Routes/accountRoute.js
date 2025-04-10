import express from 'express';

import {
  createAccount,
  validateEmail,
  login,
  resetPassword,
  setNewPassword
} from '../Controllers/accountController.js';

const router = express.Router();

router.post('/account/create', createAccount);
router.post('/account/validate-email', validateEmail);
router.post('/account/login', login);
router.post('/account/reset-password', resetPassword);
router.post('/account/set-new-password', setNewPassword);

export default router;