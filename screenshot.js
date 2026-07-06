const { chromium } = require('playwright');

const URL = 'https://dub01.online.tableau.com/#/site/kpiroom/views/DailypickupYvsY-1/Dailypickup-Overview?:iid=1';

(async () => {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto(URL, {
    waitUntil: 'networkidle',
    timeout: 120000
  });

  // Attendre que le dashboard soit chargé
  await page.waitForTimeout(15000);

  const date = new Date().toISOString().slice(0, 10);

  await page.screenshot({
    path: `daily-pickup-${date}.png`,
    fullPage: true
  });

  await browser.close();
})();
