export default function handler(req, res) {
  const locale = req.query.locale || 'en';

  // Verifica se o método é GET, caso contrário, retorna 405 (Método não permitido)
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tools = [
    { name: 'Uppercase Converter', route: `/${locale}/tools/uppercase`, icon: '🔠', createdAt: '2023-01-01' },
    { name: 'Base64 Encoder/Decoder', route: `/${locale}/tools/base64encoder`, icon: '🔐', createdAt: '2023-01-01' },
    { name: 'JSON Formatter Tool', route: `/${locale}/tools/jsonformatter`, icon: '🧾', createdAt: '2023-02-15' },
    { name: 'Password Generator', route: `/${locale}/tools/passwordgenerator`, icon: '🔑', createdAt: '2023-03-10' },
    { name: 'UUID Generator', route: `/${locale}/tools/uuid-generator`, icon: '🆔', createdAt: '2023-04-05' },
    { name: 'Lorem Ipsum Generator', route: `/${locale}/tools/lorem-ipsum`, icon: '📜', createdAt: '2023-05-20' },
    { name: 'Link Generator', route: `/${locale}/tools/linkgenerator`, icon: '🔗', createdAt: '2023-05-20' },
    { name: 'HTML Generator', route: `/${locale}/tools/html-generator`, icon: '📑', createdAt: '2023-05-20' },
    { name: 'HTML to Markdown Converter', route: `/${locale}/tools/html-md-converter`, icon: '📄', createdAt: '2023-05-20' },
    { name: 'Word Counter', route: `/${locale}/tools/word-counter`, icon: '✏️', createdAt: '2023-05-20' },
    { name: 'Binary to Text Converter', route: `/${locale}/tools/binary-to-text`, icon: '🔢', createdAt: '2023-06-30' },
    { name: 'Unix Timestamp Converter', route: `/${locale}/tools/unix-timestamp`, icon: '🕒', createdAt: '2023-06-30' },
    { name: 'Morse Code Translator', route: `/${locale}/tools/morse-code-translator`, icon: '📡', createdAt: '2023-06-30' },
    { name: 'Case Converter', route: `/${locale}/tools/case-converter`, icon: '🇬🇧', createdAt: '2023-06-30' },
    { name: 'Text Reverser', route: `/${locale}/tools/text-reverser`, icon: '🔀', createdAt: '2023-06-30' },
    { name: 'Regex Tester', route: `/${locale}/tools/regex-tester`, icon: '🔍', createdAt: '2023-06-30' },
    { name: 'Color Picker', route: `/${locale}/tools/color-picker`, icon: '🎨', createdAt: '2023-06-30' },
    { name: 'QR Code Generator', route: `/${locale}/tools/qr-code-generator`, icon: '📱', createdAt: '2023-07-15' },
    { name: 'Markdown Editor', route: `/${locale}/tools/markdown-editor`, icon: '📘', createdAt: '2023-08-01' },
  ];

  // Retorna a lista de ferramentas com status 200
  res.status(200).json(tools);
}
