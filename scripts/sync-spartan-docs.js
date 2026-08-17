const fs = require('fs');
const path = require('path');
const https = require('https');

const URLS = {
  Introduction: 'https://spartan.ng/documentation/introduction',
  Components: 'https://spartan.ng/components',
  Typography: 'https://spartan.ng/documentation/typography',
  Blocks: 'https://spartan.ng/blocks/',
};

const INVENTORY_FILE = path.join(__dirname, '../docs/spartan-inventory.md');

// Simple fetch wrapper since Node 18 fetch might not be globally available in all runners
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

async function syncSpartanDocs() {
  console.log('Fetching latest SpartanUI documentations...');
  let inventoryContent = `# SpartanUI Latest Inventory\n_Last synced: ${new Date().toISOString()}_\n\n`;

  inventoryContent += `> **Important for AI Agents:** Always refer to this list to verify SpartanUI official components, typography rules, and block structures before writing UI code.\n\n`;

  for (const [title, url] of Object.entries(URLS)) {
    console.log(`Syncing ${title}...`);
    try {
      const html = await fetchUrl(url);
      // Note: A robust implementation would use Cheerio or JSDOM to extract exact component lists.
      // Here we store the exact URLs and a ping status so the AI knows the URLs are valid
      // and can fetch the live HTML/Markdown if needed during a session.

      inventoryContent += `## ${title}\n`;
      inventoryContent += `- **Source URL**: [${url}](${url})\n`;
      inventoryContent += `- **Status**: Successfully reached (Length: ${html.length} bytes)\n\n`;
    } catch (e) {
      console.error(`Failed to fetch ${url}:`, e);
      inventoryContent += `## ${title}\n- **Source URL**: ${url}\n- **Status**: Fetch Failed (${e.message})\n\n`;
    }
  }

  inventoryContent += `### Developer Instructions\nIf you need the exact typography classes or block structures, use a web scraper tool (like \`fetch-url-tools\` or \`puppeteer\`) directly on the Source URLs above to get the real-time DOM.\n`;

  fs.writeFileSync(INVENTORY_FILE, inventoryContent, 'utf8');
  console.log('Saved to docs/spartan-inventory.md!');
}

syncSpartanDocs();
