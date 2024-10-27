export default function handler(req, res) {
  const locale = req.query.locale || 'en';

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tools = [
    {
      name: 'Base64 Encoder/Decoder',
      route: '/tools/base64encoder',
      icon: '🔐',
      description: 'Encode and decode Base64 strings.',
      createdAt: '2023-01-01',
      categories: ['Data Conversion', 'Security']
    },
    {
      name: 'JSON Formatter Tool',
      route: '/tools/json-formatter',
      icon: '🧾',
      description: 'Format and beautify JSON data.',
      createdAt: '2023-02-15',
      categories: ['Programming', 'Data Conversion']
    },
    {
      name: 'Password Generator',
      route: '/tools/password-generator',
      icon: '🔑',
      description: 'Generate strong and secure passwords.',
      createdAt: '2023-03-10',
      categories: ['Security']
    },
    {
      name: 'UUID Generator',
      route: '/tools/uuid-generator',
      icon: '🆔',
      description: 'Generate unique UUIDs.',
      createdAt: '2023-04-05',
      categories: ['Data Conversion', 'Utility']
    },
    {
      name: 'Lorem Ipsum Generator',
      route: '/tools/lorem-ipsum',
      icon: '📜',
      description: 'Generate placeholder Lorem Ipsum text.',
      createdAt: '2023-05-20',
      categories: ['Text Tools', 'Programming']
    },
    // { 
    //   name: 'Link Generator', 
    //   route: '/tools/link-generator', 
    //   icon: '🔗', 
    //   description: 'Create URL-friendly links.', 
    //   createdAt: '2023-05-20', 
    //   categories: ['Programming', 'Utility'] 
    // },
    {
      name: 'Credit Card Validator',
      route: '/tools/credit-card-validator',
      icon: '💳',
      description: 'Validate credit card numbers, expiry dates, and CVV codes securely.',
      createdAt: '2023-05-20',
      categories: ['Finance', 'Security', 'Utility']
    },
    {
      name: 'HTML Generator',
      route: '/tools/html-generator',
      icon: '📑',
      description: 'Generate HTML templates.',
      createdAt: '2023-05-20',
      categories: ['Programming']
    },
    {
      name: 'HTML to Markdown Converter',
      route: '/tools/html-md-converter',
      icon: '📄',
      description: 'Convert HTML to Markdown format.',
      createdAt: '2023-05-20',
      categories: ['Programming', 'Data Conversion']
    },
    {
      name: 'Word Counter',
      route: '/tools/word-counter',
      icon: '✏️',
      description: 'Count words, characters, and spaces.',
      createdAt: '2023-05-20',
      categories: ['Text Tools']
    },
    // { 
    //   name: 'Grammar Checker', 
    //   route: '/tools/grammar-checker', 
    //   icon: '✍️', 
    //   description: 'Check and correct grammar and punctuation.', 
    //   createdAt: '2023-05-20', 
    //   categories: ['Text Tools', 'Writer'] 
    // },
    {
      name: 'Binary to Text Converter',
      route: '/tools/binary-to-text',
      icon: '🔢',
      description: 'Convert binary data to text and vice versa.',
      createdAt: '2023-06-30',
      categories: ['Data Conversion']
    },
    {
      name: 'Morse Code Translator',
      route: '/tools/morse-code-translator',
      icon: '📡',
      description: 'Translate text to Morse code and vice versa.',
      createdAt: '2023-06-30',
      categories: ['Data Conversion']
    },
    {
      name: 'Case Converter',
      route: '/tools/case-converter',
      icon: 'Aa',
      description: 'Convert text between various cases.',
      createdAt: '2023-06-30',
      categories: ['Text Tools']
    },
    {
      name: 'Text Transformer',
      route: '/tools/text-transformer',
      icon: '🔀',
      description: 'Reverse the order of characters in text.',
      createdAt: '2023-06-30',
      categories: ['Text Tools']
    },
    {
      name: 'Regex Tester',
      route: '/tools/regex-tester',
      icon: '🔍',
      description: 'Test regular expressions.',
      createdAt: '2023-06-30',
      categories: ['Programming', 'Utility']
    },
    {
      name: 'Color Picker',
      route: '/tools/color-picker',
      icon: '🎨',
      description: 'Select and manage colors.',
      createdAt: '2023-06-30',
      categories: ['Design', 'Utility']
    },
    {
      name: 'QR Code Generator',
      route: '/tools/qr-code-generator',
      icon: '📱',
      description: 'Generate QR codes.',
      createdAt: '2023-07-15',
      categories: ['Utility']
    },
    {
      name: 'Markdown Editor',
      route: '/tools/markdown-editor',
      icon: '📘',
      description: 'Edit and preview Markdown text.',
      createdAt: '2023-08-01',
      categories: ['Programming', 'Text Tools']
    },
    // { 
    //   name: 'Uppercase Converter', 
    //   route: '/tools/uppercase', 
    //   icon: '🔠', 
    //   description: 'Convert text to uppercase letters.', 
    //   createdAt: '2023-01-01', 
    //   categories: ['Text Tools'] 
    // },
  ];


  res.status(200).json(tools);
}
