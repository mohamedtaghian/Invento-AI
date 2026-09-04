/**
 * Proxy configuration for invento dev-server.
 * Bypasses proxying for browser navigation requests (Accept: text/html)
 * so that full page refreshes (F5) load the Angular SPA instead of
 * forwarding the document request to the backend API without credentials.
 */
function bypassHtml(req) {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return req.url;
  }
}

const PROXY_CONFIG = {
  '/users': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/stores': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/site': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/products': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/product-attributes': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/categories': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/orders': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/suppliers': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/purchase-requests': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/mailbox': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/faqs': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/advisor': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/chat': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/knowledge': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/chatbot': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
  '/catalog': {
    target: 'https://invento-api-ashy.vercel.app',
    secure: false,
    changeOrigin: true,
    bypass: bypassHtml,
  },
};

module.exports = PROXY_CONFIG;
