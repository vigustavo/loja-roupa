import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { db } from '../data/store.js';
import { authenticate, requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

const variationSchema = z.object({
  size: z.string(),
  color: z.string(),
  sku: z.string(),
  stock: z.number().int().nonnegative()
});

const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  categoryId: z.string(),
  brand: z.string(),
  collection: z.string(),
  status: z.enum(['active', 'inactive']).default('active'),
  featured: z.boolean().default(false),
  images: z.array(z.string().url()).default([]),
  variations: z.array(variationSchema).default([])
});

router.get('/', (req, res) => {
  const { featured, categoryId, status } = req.query;
  let result = [...db.products];

  if (featured === 'true') {
    result = result.filter((p) => p.featured);
  }

  if (categoryId && typeof categoryId === 'string') {
    result = result.filter((p) => p.categoryId === categoryId);
  }

  if (status && status === 'active') {
    result = result.filter((p) => p.status === 'active');
  }

  res.json(result);
});

router.get('/:id', (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }
  res.json(product);
});

router.post('/', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const newProduct = {
    id: uuid(),
    ...parsed.data,
    variations: parsed.data.variations.map((variation) => ({
      ...variation,
      id: uuid()
    })),
    createdAt: new Date()
  };

  db.products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

  Object.assign(product, parsed.data);
  res.json(product);
});

router.delete('/:id', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

  db.products.splice(index, 1);
  res.status(204).send();
});

router.post('/:id/variations', authenticate, requireAuth, requireRole('admin'), (req, res) => {
  const parsed = variationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

  const newVariation = { id: uuid(), ...parsed.data };
  product.variations.push(newVariation);
  res.status(201).json(newVariation);
});

export default router;
