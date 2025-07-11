
import express from 'express';
import { authenticateUser} from '../middlewares/auth.js';
import upload from "../middlewares/multer.js";
import {
   createOrder,
GetAllOrders,
deleteOrder
} from '../controllers/orderController.js'

const router = express.Router();

router.post('/create', authenticateUser, upload.array("documents", 10),  createOrder);
router.get('/all', GetAllOrders);
router.delete("/:id", authenticateUser, deleteOrder);
export default router;