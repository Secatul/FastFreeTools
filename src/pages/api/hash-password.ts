import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

interface HashPasswordRequestBody {
  password: string;
  saltRounds?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { password, saltRounds }: HashPasswordRequestBody = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds || 10);
      res.status(200).json({ hashedPassword });
    } catch (error) {
      res.status(500).json({ error: 'Failed to hash the password' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
