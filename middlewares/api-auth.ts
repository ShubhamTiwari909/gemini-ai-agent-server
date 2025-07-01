import { Request, Response, NextFunction } from 'express';
import { decrypt } from '../utils/encrypt-decrypt.js';

export function customAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const encryptedToken = authHeader && authHeader.split(' ')[1];

  if (!encryptedToken) {
    res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    const user = decrypt(encryptedToken);

    if (user !== process.env.API_AUTH_DECRYPTED_TOKEN) {
      res.status(403).json({
        message: 'Forbidden: Invalid or corrupted token',
        token: user,
      });
    }
    next();
  } catch (error) {
    res.status(403).json({ message: `Forbidden: Invalid or corrupted token ${error}` });
  }
}
