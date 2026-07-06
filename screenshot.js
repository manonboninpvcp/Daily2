const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto(
    'https://dub01.online.tableau.com/#/site/kpiroom/views/DailypickupYvsY-1/Dailypickup-Overview?:iid=1',
    { waitUntil: 'domcontentloaded' }
  );

  // Connexion Tableau
  await page.getByLabel(/username/i).fill(process.env.TABLEAU_USERNAME);
  await page.getByRole('button', { name: /sign in|connexion|se connecter/i }).click();

  await page.waitForLoadState('networkidle');

  await page.getByLabel(/password/i).fill(process.env.TABLEAU_PASSWORD);
  await page.getByRole('button', { name: /sign in|connexion|se connecter/i }).click();

  // Attendre le chargement du dashboard
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(20000);

  const date = new Date().toISOString().slice(0, 10);

  await page.screenshot({
    path: `daily-pickup-${date}.png`,
    fullPage: true
  });

  await browser.close();
})();
