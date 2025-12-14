import { Request, Response, NextFunction } from 'express';
import { logger } from '../common/logger.js';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message);
  res.status(500).json({ message: 'Unexpected server error', details: err.message });
};
