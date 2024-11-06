import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fastfreetools.com';

  const tools = [
    'word-counter',
    'credit-card-validator',
    'binary-to-text',
    'base64encoder',
    'html-generator',
    'html-markdown-converter',
    'markdown-editor',
    'case-converter',
    'json-formatter',
    'lorem-ipsum',
    'password-generator',
    'morse-code-translator',
    'qrcode-generator',
    'uuid-generator',
    'text-transformer',
    'data-table-generator',
    'user-agent',
    'seo-meta-tag-analyzer',
  ];

  const locales = ['en', 'es', 'fr', 'pt-br', 'de'];

  const sitemapEntries = [];

  // Adiciona a URL principal para cada idioma
  locales.forEach((locale) => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
    });
  });

  // Adiciona cada ferramenta para cada idioma
  tools.forEach((tool) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/${tool}`,
        lastModified: new Date(),
      });
    });
  });

  return sitemapEntries;
}
