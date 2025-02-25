import {Router} from 'express';
import { login, register } from './auth.controller.js';
import { registerValidator , loginValidator} from '../middlewares/user-validators.js';

const router = Router();

router.post(
    "/register", 
    registerValidator, 
    register
);

router.post(
    "/login",
    loginValidator,
    login
);

export default router;