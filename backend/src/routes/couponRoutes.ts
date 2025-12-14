import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { db } from '../data/store.js';
import { authenticate, requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

const couponSchema = z.object({
  code: z.string().toUpperCase(),
  type: z.enum(['percentage', 'amount']),
  value: z.number().positive(),
  expiresAt: z.string().transform((value) => new Date(value)),
  isActive: z.boolean().default(true),
  maxUses: z.number().int().positive()
});

router.get('/', authenticate, requireAuth, requireRole('admin'), (_req, res) => {
  res.json(db.coupons);
});

router.post('/', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const parsed = couponSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const coupon = {
    id: uuid(),
    used: 0,
    ...parsed.data
  };

  db.coupons.push(coupon);
  res.status(201).json(coupon);
});

router.put('/:id', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const parsed = couponSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const coupon = db.coupons.find((c) => c.id === req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: 'Cupom não encontrado' });
  }

  Object.assign(coupon, parsed.data);
  res.json(coupon);
});

router.delete('/:id', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const index = db.coupons.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Cupom não encontrado' });
  }

  db.coupons.splice(index, 1);
  res.status(204).send();
});

export default router;
