// export default function handler(req, res) {
//   const { q } = req.query; 

//   const tools = [
//     { name: 'Uppercase Converter', route: '/tools/uppercase', icon: '🔠', rating: 4.8, votes: 1250, createdAt: '2023-01-01', isPopular: true },
//     { name: 'Base64 Encoder/Decoder', route: '/tools/base64-encoder-decoder', icon: '🔐', rating: 4.7, votes: 1230, createdAt: '2023-01-01', isPopular: true },
//     { name: 'JSON Formatter Tool', route: '/tools/json-formatter', icon: '🧾', rating: 4.9, votes: 1500, createdAt: '2023-02-15', isPopular: true },
//     { name: 'Password Generator', route: '/tools/password-generator', icon: '🔑', rating: 4.7, votes: 980, createdAt: '2023-03-10', isPopular: true },
//     { name: 'UUID Generator', route: '/tools/uuid-generator', icon: '🆔', rating: 4.6, votes: 850, createdAt: '2023-04-05', isPopular: true },
//     { name: 'Lorem Ipsum Generator', route: '/tools/lorem-ipsum', icon: '📜', rating: 4.3, votes: 620, createdAt: '2023-05-20', isPopular: false },
//     { name: 'Word Counter', route: '/tools/word-counter', icon: '✏️', rating: 4.3, votes: 620, createdAt: '2023-05-20', isPopular: false },
//     { name: 'Binary to Text Converter', route: '/tools/binary-to-text', icon: '🔢', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'Unix Timestamp Converter', route: '/tools/unix-timestamp-converter', icon: '🕒', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'HTML to Markdown Converter', route: '/tools/html-md-converter', icon: '📝', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'Morse Code Translator', route: '/tools/morse-code-translator', icon: '📡', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'Case Converter ', route: '/tools/case-converter', icon: '🇬🇧', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'Text Reverser', route: '/tools/text-reverser', icon: '🔀', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'Regex Tester', route: '/tools/regex-tester', icon: '🔍', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'Color Picker', route: '/tools/color-picker', icon: '🎨', rating: 4.5, votes: 750, createdAt: '2023-06-30', isPopular: false },
//     { name: 'QR Code Generator', route: '/tools/qr-code', icon: '📱', rating: 4.4, votes: 680, createdAt: '2023-07-15', isPopular: false },
//     { name: 'Markdown Editor', route: '/tools/markdown', icon: '📘', rating: 4.2, votes: 590, createdAt: '2023-08-01', isPopular: false },
//   ];

//   const filteredTools = tools.filter(tool =>
//     tool.name.toLowerCase().includes(q.toLowerCase())
//   );

//   res.status(200).json(filteredTools); 
// }
