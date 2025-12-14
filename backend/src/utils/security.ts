import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { User } from '../data/store.js';

export const hashPassword = async (plain: string) => bcrypt.hash(plain, 10);
export const comparePassword = async (plain: string, hashed: string) => bcrypt.compare(plain, hashed);

export const generateToken = (user: User) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    env.jwtSecret,
    { expiresIn: '8h' }
  );
