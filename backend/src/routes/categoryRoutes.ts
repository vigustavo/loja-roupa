import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { db } from '../data/store.js';
import { authenticate, requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

const schema = z.object({
  name: z.string(),
  slug: z.string(),
  status: z.enum(['active', 'inactive']).default('active')
});

router.get('/', (_req, res) => {
  res.json(db.categories);
});

router.post('/', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const category = {
    id: uuid(),
    ...parsed.data,
    createdAt: new Date()
  };

  db.categories.push(category);
  res.status(201).json(category);
});

router.put('/:id', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const category = db.categories.find((c) => c.id === req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Categoria não encontrada' });
  }

  Object.assign(category, parsed.data);
  res.json(category);
});

router.delete('/:id', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const index = db.categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Categoria não encontrada' });
  }

  db.categories.splice(index, 1);
  res.status(204).send();
});

export default router;
