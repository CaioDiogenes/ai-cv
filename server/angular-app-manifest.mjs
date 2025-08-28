
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/ai-cv/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/ai-cv/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 500, hash: '54b7de55b6350d56de782510fbe53340e09dc69b78035968b7b0f8c2a818f42c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1013, hash: 'f5df4e20f01e9611c1dba9adc188441cfc559590cb54ce52d0ea20ec3f08e1bc', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
