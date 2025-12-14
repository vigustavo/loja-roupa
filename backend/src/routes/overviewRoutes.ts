import { Router } from 'express';
import { authenticate, requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { db } from '../data/store.js';

const router = Router();

router.get('/', authenticate, requireAuth, requireRole('admin'), (_req, res) => {
  const totalSales = db.orders.reduce((sum, order) => sum + (order.status !== 'canceled' ? order.total : 0), 0);
  const paidOrders = db.orders.filter((order) => order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered');
  const monthlyRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = db.products
    .map((product) => ({
      id: product.id,
      name: product.name,
      variations: product.variations.filter((variation) => variation.stock <= 3)
    }))
    .filter((product) => product.variations.length > 0);

  const salesByDay = Array.from({ length: 7 }).map((_value, index) => ({
    day: `D-${6 - index}`,
    total: Math.round(Math.random() * 2000)
  }));

  res.json({
    totalSales,
    totalOrders: db.orders.length,
    monthlyRevenue,
    lowStockProducts,
    salesByDay
  });
});

export default router;
