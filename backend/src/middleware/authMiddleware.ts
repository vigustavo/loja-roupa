import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { User, UserRole } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

const decodeToken = (token: string) => {
  try {
    return jwt.verify(token, env.jwtSecret) as { sub: string };
  } catch {
    return null;
  }
};

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return next();
  }

  const token = header.replace('Bearer ', '');
  const payload = decodeToken(token);

  if (!payload) {
    return next();
  }

  prisma.user
    .findUnique({ where: { id: payload.sub } })
    .then((user) => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(() => next());
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

export const requireRole = (role: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
