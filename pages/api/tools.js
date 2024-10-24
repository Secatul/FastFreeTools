// export default function handler(req, res) {
//   // Verifica se o método é GET, caso contrário, retorna 405 (Método não permitido)
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const tools = [
//     { name: 'Uppercase Converter', route: '/tools/uppercase', icon: '🔠', createdAt: '2023-01-01' },
//     { name: 'Base64 Encoder/Decoder', route: '/tools/base64encoder', icon: '🔐', createdAt: '2023-01-01' },
//     { name: 'JSON Formatter Tool', route: '/tools/jsonformatter', icon: '🧾', createdAt: '2023-02-15' },
//     { name: 'Password Generator', route: '/tools/passwordgenerator', icon: '🔑', createdAt: '2023-03-10' },
//     { name: 'UUID Generator', route: '/tools/uuid-generator', icon: '🆔', createdAt: '2023-04-05' },
//     { name: 'Lorem Ipsum Generator', route: '/tools/lorem-ipsum', icon: '📜', createdAt: '2023-05-20' },
//     { name: 'Link Generator', route: '/tools/linkgenerator', icon: '🔗', createdAt: '2023-05-20' },
//     { name: 'HTML Generator', route: '/tools/html-generator', icon: '📑', createdAt: '2023-05-20' },
//     { name: 'HTML to Markdown Converter', route: '/tools/html-md-converter', icon: '📄', createdAt: '2023-05-20' },
//     { name: 'Word Counter', route: '/tools/word-counter', icon: '✏️', createdAt: '2023-05-20' },
//     { name: 'Binary to Text Converter', route: '/tools/binary-to-text', icon: '🔢', createdAt: '2023-06-30' },
//     { name: 'Unix Timestamp Converter', route: '/tools/unix-timestamp', icon: '🕒', createdAt: '2023-06-30' },
//     { name: 'Morse Code Translator', route: '/tools/morse-code-translator', icon: '📡', createdAt: '2023-06-30' },
//     { name: 'Case Converter', route: '/tools/case-converter', icon: '🇬🇧', createdAt: '2023-06-30' },
//     { name: 'Text Reverser', route: '/tools/text-reverser', icon: '🔀', createdAt: '2023-06-30' },
//     { name: 'Regex Tester', route: '/tools/regex-tester', icon: '🔍', createdAt: '2023-06-30' },
//     { name: 'Color Picker', route: '/tools/color-picker', icon: '🎨', createdAt: '2023-06-30' },
//     { name: 'QR Code Generator', route: '/tools/qr-code-generator', icon: '📱', createdAt: '2023-07-15' },
//     { name: 'Markdown Editor', route: '/tools/markdown-editor', icon: '📘', createdAt: '2023-08-01' },
//   ];

//   res.status(200).json(tools);
// }


export default function handler(req, res) {
  const locale = req.query.locale || 'en';

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tools = [
    { name: 'Uppercase Converter', route: `/${locale}/tools/uppercase`, icon: '🔠', description: 'Convert text to uppercase letters.', createdAt: '2023-01-01' },
    { name: 'Base64 Encoder/Decoder', route: `/${locale}/tools/base64encoder`, icon: '🔐', description: 'Encode and decode Base64 strings.', createdAt: '2023-01-01' },
    { name: 'JSON Formatter Tool', route: `/${locale}/tools/jsonformatter`, icon: '🧾', description: 'Format and beautify JSON data.', createdAt: '2023-02-15' },
    { name: 'Password Generator', route: `/${locale}/tools/passwordgenerator`, icon: '🔑', description: 'Generate strong and secure passwords.', createdAt: '2023-03-10' },
    { name: 'UUID Generator', route: `/${locale}/tools/uuid-generator`, icon: '🆔', description: 'Generate unique UUIDs.', createdAt: '2023-04-05' },
    { name: 'Lorem Ipsum Generator', route: `/${locale}/tools/lorem-ipsum`, icon: '📜', description: 'Generate placeholder Lorem Ipsum text.', createdAt: '2023-05-20' },
    { name: 'Link Generator', route: `/${locale}/tools/linkgenerator`, icon: '🔗', description: 'Create URL-friendly links.', createdAt: '2023-05-20' },
    { name: 'HTML Generator', route: `/${locale}/tools/html-generator`, icon: '📑', description: 'Generate HTML templates.', createdAt: '2023-05-20' },
    { name: 'HTML to Markdown Converter', route: `/${locale}/tools/html-md-converter`, icon: '📄', description: 'Convert HTML to Markdown format.', createdAt: '2023-05-20' },
    { name: 'Word Counter', route: `/${locale}/tools/word-counter`, icon: '✏️', description: 'Count words, characters, and spaces.', createdAt: '2023-05-20' },
    { name: 'Binary to Text Converter', route: `/${locale}/tools/binary-to-text`, icon: '🔢', description: 'Convert binary data to text and vice versa.', createdAt: '2023-06-30' },
    { name: 'Morse Code Translator', route: `/${locale}/tools/morse-code-translator`, icon: '📡', description: 'Translate text to Morse code and vice versa.', createdAt: '2023-06-30' },
    { name: 'Case Converter', route: `/${locale}/tools/case-converter`, icon: 'Aa', description: 'Convert text between various cases.', createdAt: '2023-06-30' },
    { name: 'Text Reverser', route: `/${locale}/tools/text-reverser`, icon: '🔀', description: 'Reverse the order of characters in text.', createdAt: '2023-06-30' },
    { name: 'Regex Tester', route: `/${locale}/tools/regex-tester`, icon: '🔍', description: 'Test regular expressions.', createdAt: '2023-06-30' },
    { name: 'Color Picker', route: `/${locale}/tools/color-picker`, icon: '🎨', description: 'Select and manage colors.', createdAt: '2023-06-30' },
    { name: 'QR Code Generator', route: `/${locale}/tools/qr-code-generator`, icon: '📱', description: 'Generate QR codes.', createdAt: '2023-07-15' },
    { name: 'Markdown Editor', route: `/${locale}/tools/markdown-editor`, icon: '📘', description: 'Edit and preview Markdown text.', createdAt: '2023-08-01' },
  ];

  res.status(200).json(tools);
}
