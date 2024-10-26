import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { password, saltRounds } = req.body;

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
