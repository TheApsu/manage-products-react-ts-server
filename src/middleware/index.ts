import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';

export const handleInputErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validacion
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
