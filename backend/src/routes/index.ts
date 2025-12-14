import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import couponRoutes from './couponRoutes.js';
import customerRoutes from './customerRoutes.js';
import overviewRoutes from './overviewRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/customers', customerRoutes);
router.use('/overview', overviewRoutes);

export default router;
