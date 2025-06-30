
import express from 'express';
import { authenticateUser} from '../middlewares/auth.js';
import upload from "../middlewares/multer.js";
import {
   createOrder,

} from '../controllers/orderController.js'

const router = express.Router();

router.post('/create', authenticateUser, upload.array("documents", 10),  createOrder);

export default router;