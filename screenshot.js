const { chromium } = require('playwright');

const URL = 'https://dub01.online.tableau.com/#/site/kpiroom/views/DailypickupYvsY-1/Dailypickup-Overview?:iid=1';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 });

  await page.screenshot({ path: 'debug-01-start.png', fullPage: true });

  await page.locator('input').first().fill(process.env.TABLEAU_USERNAME);
  await page.screenshot({ path: 'debug-02-username-filled.png', fullPage: true });

  await page.keyboard.press('Enter');
  await page.waitForTimeout(8000);

  await page.screenshot({ path: 'debug-03-after-enter.png', fullPage: true });

  const passwordInput = page.locator('input[type="password"]');

  if (await passwordInput.count() > 0) {
    await passwordInput.first().fill(process.env.TABLEAU_PASSWORD);
    await page.keyboard.press('Enter');

    await page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {});
    await page.waitForTimeout(25000);

    const date = new Date().toISOString().slice(0, 10);
    await page.screenshot({
      path: `daily-pickup-${date}.png`,
      fullPage: true
    });
  } else {
    await page.screenshot({ path: 'debug-no-password-field.png', fullPage: true });
    throw new Error('Aucun champ mot de passe trouvé après saisie du username.');
  }

  await browser.close();
})();
