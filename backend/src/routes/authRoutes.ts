import { Router } from 'express';
import { z } from 'zod';
import { comparePassword, generateToken, hashPassword } from '../utils/security.js';
import { prisma } from '../config/prisma.js';
import crypto from 'crypto';

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
  const user = await prisma.user.findFirst({ where: { email, role: 'admin' } });

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

router.post('/admin/forgot', async (req, res) => {
  const emailSchema = z.object({ email: z.string().email() });
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email } = parsed.data;
  const user = await prisma.user.findFirst({ where: { email, role: 'admin' } });
  if (!user) {
    return res.status(404).json({ message: 'Admin não encontrado' });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await prisma.passwordReset.create({
    data: {
      token,
      userId: user.id,
      expiresAt
    }
  });

  res.json({ message: 'Token de recuperação gerado', token });
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

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      role: 'client',
      status: 'active'
    }
  });

  const token = generateToken(user);
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post('/client/login', async (req, res) => {
  const parsed = credentialSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findFirst({ where: { email, role: 'client' } });

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

router.post('/client/forgot', async (req, res) => {
  const emailSchema = z.object({ email: z.string().email() });
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email } = parsed.data;
  const user = await prisma.user.findFirst({ where: { email, role: 'client' } });
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await prisma.passwordReset.create({
    data: {
      token,
      userId: user.id,
      expiresAt
    }
  });

  res.json({ message: 'Token de recuperação gerado', token });
});

router.post('/client/reset', async (req, res) => {
  const schema = z.object({ token: z.string().min(10), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { token, password } = parsed.data;
  const reset = await prisma.passwordReset.findUnique({ where: { token } });

  if (!reset || reset.used || (reset.expiresAt && reset.expiresAt < new Date())) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash: hashedPassword }
    }),
    prisma.passwordReset.update({ where: { id: reset.id }, data: { used: true } })
  ]);

  res.json({ message: 'Senha redefinida com sucesso' });
});

export default router;
