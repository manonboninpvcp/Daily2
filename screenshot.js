const { chromium } = require('playwright');

const URL = 'https://dub01.online.tableau.com/#/site/kpiroom/views/DailypickupYvsY-1/Dailypickup-Overview?:iid=1';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });

  await page.locator('input[type="email"], input[name="username"], input[id*="username"], input').first()
    .fill(process.env.TABLEAU_USERNAME);

  await page.locator('button:has-text("Sign In"), button:has-text("Continue"), button:has-text("Connexion"), button:has-text("Se connecter")')
    .first()
    .click();

  await page.waitForTimeout(5000);

  await page.locator('input[type="password"], input[name="password"], input[id*="password"]')
    .first()
    .fill(process.env.TABLEAU_PASSWORD);

  await page.locator('button:has-text("Sign In"), button:has-text("Connexion"), button:has-text("Se connecter"), button[type="submit"]')
    .first()
    .click();

  await page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(25000);

  const date = new Date().toISOString().slice(0, 10);

  await page.screenshot({
    path: `daily-pickup-${date}.png`,
    fullPage: true
  });

  await browser.close();
})();
