import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'client';
export type OrderStatus = 'awaiting_payment' | 'paid' | 'shipped' | 'delivered' | 'canceled';
export type ProductStatus = 'active' | 'inactive';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: 'active' | 'blocked';
  addresses: Address[];
  favorites: string[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface ProductVariation {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  brand: string;
  collection: string;
  status: ProductStatus;
  featured: boolean;
  variations: ProductVariation[];
  images: string[];
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  variationId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  clientId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: 'card' | 'pix' | 'boleto';
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'amount';
  value: number;
  expiresAt: Date;
  isActive: boolean;
  maxUses: number;
  used: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  variationId: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  createdAt: Date;
}

const salt = bcrypt.genSaltSync(10);

const categories: Category[] = [
  {
    id: uuid(),
    name: 'Coleção Verão',
    slug: 'colecao-verao',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: uuid(),
    name: 'Streetwear',
    slug: 'streetwear',
    status: 'active',
    createdAt: new Date()
  }
];

const users: User[] = [
  {
    id: uuid(),
    name: 'Admin Master',
    email: 'admin@loja.com',
    passwordHash: bcrypt.hashSync('admin123', salt),
    role: 'admin',
    status: 'active',
    addresses: [],
    favorites: [],
    createdAt: new Date()
  },
  {
    id: uuid(),
    name: 'Cliente Demo',
    email: 'cliente@loja.com',
    passwordHash: bcrypt.hashSync('cliente123', salt),
    role: 'client',
    status: 'active',
    addresses: [
      {
        id: uuid(),
        label: 'Casa',
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000',
        country: 'Brasil'
      }
    ],
    favorites: [],
    createdAt: new Date()
  }
];

const sampleCategory = categories[0];

const products: Product[] = [
  {
    id: uuid(),
    name: 'Jaqueta Aurora',
    description: 'Jaqueta oversized em nylon técnico resistente à água.',
    price: 599.9,
    salePrice: 499.9,
    categoryId: sampleCategory.id,
    brand: 'Pulse',
    collection: 'Luminous 24',
    status: 'active',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
    ],
    variations: [
      { id: uuid(), size: 'P', color: 'Azul Boreal', sku: 'AURORA-P', stock: 8 },
      { id: uuid(), size: 'M', color: 'Azul Boreal', sku: 'AURORA-M', stock: 5 },
      { id: uuid(), size: 'G', color: 'Azul Boreal', sku: 'AURORA-G', stock: 2 }
    ],
    createdAt: new Date()
  },
  {
    id: uuid(),
    name: 'Calça Prisma',
    description: 'Calça cargo com painéis refletivos e bolsos amplos.',
    price: 399.9,
    categoryId: sampleCategory.id,
    brand: 'Axis',
    collection: 'Chromatic',
    status: 'active',
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f'
    ],
    variations: [
      { id: uuid(), size: '36', color: 'Preto Chrome', sku: 'PRISMA-36', stock: 4 },
      { id: uuid(), size: '38', color: 'Preto Chrome', sku: 'PRISMA-38', stock: 6 }
    ],
    createdAt: new Date()
  }
];

const coupons: Coupon[] = [
  {
    id: uuid(),
    code: 'LANÇAMENTO10',
    type: 'percentage',
    value: 10,
    expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
    maxUses: 100,
    used: 0
  }
];

const orders: Order[] = [];
const stockMovements: StockMovement[] = [];

export const db = {
  users,
  categories,
  products,
  coupons,
  orders,
  stockMovements
};
