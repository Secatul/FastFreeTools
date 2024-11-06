import { parse } from 'node-html-parser';
import validator from 'validator';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.query;

  if (!url || !validator.isURL(url, { require_protocol: true })) {
    return res.status(400).json({ error: 'Invalid or missing URL parameter' });
  }

  try {
    const urlObj = new URL(url);
    if (['localhost', '127.0.0.1'].includes(urlObj.hostname)) {
      return res.status(400).json({ error: 'Requests to localhost or internal IPs are not allowed' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const root = parse(html);

    const getMetaContent = (name) => {
      const meta = root.querySelector(`meta[name="${name}"]`);
      return meta ? meta.getAttribute('content') : '';
    };

    const getOGContent = (property) => {
      const meta = root.querySelector(`meta[property="og:${property}"]`);
      return meta ? meta.getAttribute('content') : '';
    };

    const getTwitterContent = (name) => {
      const meta = root.querySelector(`meta[name="twitter:${name}"]`);
      return meta ? meta.getAttribute('content') : '';
    };

    const title = root.querySelector('title')?.text || '';
    const description = getMetaContent('description');
    const keywords = getMetaContent('keywords').split(',').map(keyword => keyword.trim());

    const metaTags = {
      title,
      description,
      keywords,
      ogTitle: getOGContent('title'),
      ogDescription: getOGContent('description'),
      ogImage: getOGContent('image'),
      twitterCard: getTwitterContent('card'),
      twitterTitle: getTwitterContent('title'),
      twitterDescription: getTwitterContent('description'),
      twitterImage: getTwitterContent('image'),
    };

    res.status(200).json(metaTags);
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    if (error.name === 'AbortError') {
      res.status(408).json({ error: 'Request timed out' });
    } else {
      res.status(500).json({ error: 'Failed to analyze the website', details: error.message });
    }
  }
}
