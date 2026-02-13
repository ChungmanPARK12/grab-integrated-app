import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/signup/phone', (_req, res) => res.json({ message: 'TODO' }));
authRouter.post('/signup/otp', (_req, res) => res.json({ message: 'TODO' }));
authRouter.post('/signup/username', (_req, res) => res.json({ message: 'TODO' }));
