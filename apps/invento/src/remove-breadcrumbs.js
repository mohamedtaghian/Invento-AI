const fs = require('fs');
const path = require('path');
const files = [
  'suppliers/suppliers.html',
  'products/products.html',
  'orders/orders.html',
  'home/home.html',
  'categories/categories.html',
  'faq-management/faq-management.page.html',
  'attributes/attributes.html',
  'analytics/analytics.html'
];
files.forEach(f => {
  const fp = path.join('c:/Users/COMPUMARTS/Desktop/Invento-AI/apps/invento/src/pages', f);
  if(fs.existsSync(fp)) {
    let c = fs.readFileSync(fp, 'utf8');
    c = c.replace(/<nav class="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">[\s\S]*?<\/nav>/, '');
    fs.writeFileSync(fp, c);
  }
});
