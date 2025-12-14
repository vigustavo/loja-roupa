import { Router } from 'express';
import { z } from 'zod';
import { db } from '../data/store.js';
import { comparePassword, generateToken, hashPassword } from '../utils/security.js';
import { v4 as uuid } from 'uuid';

const router = Router();

const credentialSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/admin/login', async (req, res) => {
  const parsed = credentialSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email, password } = parsed.data;
  const user = db.users.find((u) => u.email === email && u.role === 'admin');

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/admin/forgot', (req, res) => {
  const emailSchema = z.object({ email: z.string().email() });
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email } = parsed.data;
  const user = db.users.find((u) => u.email === email && u.role === 'admin');
  if (!user) {
    return res.status(404).json({ message: 'Admin não encontrado' });
  }

  res.json({ message: 'Token de recuperação enviado (mock)', token: uuid() });
});

router.post('/client/register', async (req, res) => {
  const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { name, email, password } = parsed.data;
  const exists = db.users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    passwordHash: await hashPassword(password),
    role: 'client' as const,
    status: 'active' as const,
    addresses: [],
    favorites: [],
    createdAt: new Date()
  };

  db.users.push(newUser);
  const token = generateToken(newUser);
  res.status(201).json({ token, user: { id: newUser.id, name, email, role: newUser.role } });
});

router.post('/client/login', async (req, res) => {
  const parsed = credentialSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email, password } = parsed.data;
  const user = db.users.find((u) => u.email === email && u.role === 'client');

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;
