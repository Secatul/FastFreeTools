import { NextApiRequest, NextApiResponse } from 'next';

interface Tool {
  name: string;
  route: string;
  icon: string;
  description: string;
  categories: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log('Request received:', req.method, req.query);
  const locale = req.query.locale || 'en';

  if (req.method !== 'GET') {
    // console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  let translations;
  try {
    translations = (await import(`../../../messages/${locale}.json`)).default;
    // console.log('Translations loaded:', translations);
  } catch (error) {
    console.error(`Erro ao carregar traduções para o locale ${locale}:`, error);
    translations = (await import('../../../messages/en.json')).default; 
  }
  
  const tools: Tool[] = [
    {
      name: translations?.Page?.PasswordGenerator?.name ?? 'Password Generator',
      route: `/${locale}/password-generator`,
      icon: '🔑',
      description: translations?.Page?.PasswordGenerator?.description ?? 'Generate strong and secure passwords.',
      categories: [translations?.Page?.Categories?.Security ?? 'Security'],
    },
    {
      name: translations?.Page?.CreditCardValidator?.name ?? 'Credit Card Validator',
      route: `/${locale}/credit-card-validator`,
      icon: '💳',
      description: translations?.Page?.CreditCardValidator?.description ?? 'Validate credit card numbers, expiry dates, and CVV codes securely.',
      categories: [
        translations?.Page?.Categories?.Security ?? 'Security',
        translations?.Page?.Categories?.Utility ?? 'Utility',
      ],
    },
    {
      name: translations?.Page?.RegexTester?.name ?? 'Regex Tester',
      route: `/${locale}/regex-tester`,
      icon: '🔍',
      description: translations?.Page?.RegexTester?.description ?? 'Test regular expressions.',
      categories: [
        translations?.Page?.Categories?.Programming ?? 'Programming',
        translations?.Page?.Categories?.Utility ?? 'Utility',
      ],
    },
    {
      name: translations?.Page?.QRCodeGenerator?.name ?? 'QR Code Generator',
      route: `/${locale}/qr-code-generator`,
      icon: '📱',
      description: translations?.Page?.QRCodeGenerator?.description ?? 'Generate QR codes.',
      categories: [translations?.Page?.Categories?.Utility ?? 'Utility'],
    },
  ];
  

  res.status(200).json(tools);
  res.end(); 
}
