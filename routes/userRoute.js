import express from 'express';
import {
    Signup,
    Signin,
    ValidateUser,
    getAllUsers,
    deleteUser,
    getAllAdmins,
    googleSignin,
    verifyEmail
} from '../controllers/userController.js'
import { authenticateUser} from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/google-signin', googleSignin);
router.get('/validate', authenticateUser, ValidateUser);
router.get('/all', getAllUsers);
router.get('/all-admins', getAllAdmins);
router.post('/verify-email',authenticateUser, verifyEmail);
router.delete("/:id", deleteUser);
export default router;