import { Router } from 'express';
import { authenticate, requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { db } from '../data/store.js';

const router = Router();

router.get('/', authenticate, requireAuth, requireRole('admin'), (_req, res) => {
  const clients = db.users
    .filter((user) => user.role === 'client')
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      totalOrders: db.orders.filter((order) => order.clientId === user.id).length,
      createdAt: user.createdAt
    }));

  res.json(clients);
});

router.post('/:id/block', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id && u.role === 'client');
  if (!user) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }

  user.status = 'blocked';
  res.json({ message: 'Cliente bloqueado' });
});

router.post('/:id/unblock', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id && u.role === 'client');
  if (!user) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }

  user.status = 'active';
  res.json({ message: 'Cliente desbloqueado' });
});

export default router;
