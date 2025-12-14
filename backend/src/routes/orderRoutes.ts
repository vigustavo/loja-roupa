import { Router, type Response } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { db, type OrderStatus } from '../data/store.js';
import { authenticate, requireAuth, requireRole, type AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

const orderSchema = z.object({
  clientId: z.string(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variationId: z.string(),
        quantity: z.number().int().positive()
      })
    )
    .min(1),
  shippingAddressId: z.string(),
  paymentMethod: z.enum(['card', 'pix', 'boleto']),
  couponCode: z.string().optional()
});

router.get('/', authenticate, requireAuth, requireRole('admin'), (_req, res) => {
  res.json(db.orders);
});

router.get('/client/:clientId', authenticate, requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role === 'client' && req.user.id !== req.params.clientId) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const orders = db.orders.filter((order) => order.clientId === req.params.clientId);
  res.json(orders);
});

router.post('/', authenticate, requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { clientId, items, shippingAddressId, paymentMethod, couponCode } = parsed.data;
  if (req.user?.role === 'client' && req.user.id !== clientId) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const client = db.users.find((u) => u.id === clientId && u.role === 'client');
  if (!client) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }

  const shippingAddress = client.addresses.find((address) => address.id === shippingAddressId);
  if (!shippingAddress) {
    return res.status(400).json({ message: 'Endereço inválido' });
  }

  const coupon = couponCode ? db.coupons.find((c) => c.code === couponCode && c.isActive) : undefined;
  if (coupon && coupon.used >= coupon.maxUses) {
    return res.status(400).json({ message: 'Cupom expirado' });
  }

  let total = 0;

  const orderItems = items.map((item) => {
    const product = db.products.find((p) => p.id === item.productId && p.status === 'active');
    if (!product) {
      throw new Error(`Produto ${item.productId} indisponível`);
    }
    const variation = product.variations.find((v) => v.id === item.variationId);
    if (!variation) {
      throw new Error(`Variação ${item.variationId} inválida`);
    }
    if (variation.stock < item.quantity) {
      throw new Error(`Estoque insuficiente para SKU ${variation.sku}`);
    }

    variation.stock -= item.quantity;
    const price = product.salePrice ?? product.price;
    total += price * item.quantity;

    return {
      productId: product.id,
      variationId: variation.id,
      quantity: item.quantity,
      unitPrice: price
    };
  });

  if (coupon) {
    const discount = coupon.type === 'percentage' ? (total * coupon.value) / 100 : coupon.value;
    total = Math.max(total - discount, 0);
    coupon.used += 1;
  }

  const order = {
    id: uuid(),
    clientId,
    items: orderItems,
    total,
    status: 'awaiting_payment' as OrderStatus,
    shippingAddress,
    paymentMethod,
    couponCode,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.orders.push(order);
  res.status(201).json(order);
});

router.patch('/:id/status', authenticate, requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const schema = z.object({ status: z.enum(['awaiting_payment', 'paid', 'shipped', 'delivered', 'canceled']) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Pedido não encontrado' });
  }

  order.status = parsed.data.status;
  order.updatedAt = new Date();
  res.json(order);
});

export default router;
