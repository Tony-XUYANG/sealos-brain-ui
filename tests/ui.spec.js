import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const sections = [
  ['#deploy', 'Deploy any project to the cloud.'],
  ['#intelligence', 'Sealos fixes it.'],
  ['#ai', 'Multi-model injection'],
  ['#skills', 'Keep coding locally.'],
  ['#app-store', 'Run it in one click.'],
  ['#scale', 'Running everywhere.']
];

function watchRuntimeErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
});

test('renders all six product sections and valid in-page anchors', async ({ page }) => {
  for (const [selector, heading] of sections) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section).toContainText(heading);
  }

  const missingAnchors = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links
      .map((link) => link.getAttribute('href'))
      .filter((href) => href && href.length > 1 && !document.querySelector(href))
  );
  expect(missingAnchors).toEqual([]);

  await page.locator('a[href="#scale"]:visible').first().click();
  await expect(page).toHaveURL(/#scale$/);
  await expect(page.locator('#scale')).toBeInViewport();
});

test('journey animation can pause, resume, and enter deployment state', async ({ page }) => {
  const map = page.locator('.journey-map');
  const pause = page.locator('.journey-pause');

  await pause.click();
  await expect(map).toHaveClass(/paused/);
  await expect(pause).toHaveAttribute('aria-label', 'Play journey animation');
  await pause.click();
  await expect(map).not.toHaveClass(/paused/);

  await page.locator('#repo-url').fill('https://github.com/labring/sealos');
  await page.locator('#deploy-form button').click();
  await expect(map).toHaveAttribute('data-journey-phase', 'agent');
  await expect(page.locator('#deploy-form button')).toContainText('Deploying');
});

test('AI Ops supports scenario switching and pause control', async ({ page }) => {
  const theater = page.locator('.ops-theater');
  const containerScenario = page.locator('[data-stage-button="container"]');
  await containerScenario.click();
  await expect(theater).toHaveAttribute('data-stage', 'container');
  await expect(containerScenario).toHaveAttribute('aria-selected', 'true');

  const pause = page.locator('.demo-pause');
  await pause.click();
  await expect(theater).toHaveClass(/paused/);
  await expect(pause).toHaveAttribute('aria-label', 'Play animation');
});

test('App Store selection updates the deployment experience', async ({ page }) => {
  const n8n = page.locator('[data-store-app="n8n"]');
  await n8n.click();
  await expect(n8n).toHaveClass(/active/);
  await expect(page.locator('.store-agent-form input')).toHaveValue('Deploy an n8n workflow service');
  await expect(page.locator('.store-result-name')).toContainText('n8n');
});

test('scale counters animate to their published values', async ({ page }) => {
  await page.locator('#scale').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-count="300000"]')).toHaveText('300,000');
  await expect(page.locator('[data-count="18000"]')).toHaveText('18,000');
  await expect(page.locator('[data-count="50000"]')).toHaveText('50,000');
  await expect(page.locator('[data-count="1000"]')).toHaveText('1,000');
});

test('has no page errors, serious accessibility violations, or layout overflow', async ({ page }) => {
  const runtimeErrors = watchRuntimeErrors(page);
  await page.reload();
  await page.evaluate(() => document.fonts.ready);

  for (const [selector] of sections) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  const horizontalOverflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth
  }));
  expect(horizontalOverflow.documentWidth).toBeLessThanOrEqual(horizontalOverflow.viewport + 1);
  expect(horizontalOverflow.bodyWidth).toBeLessThanOrEqual(horizontalOverflow.viewport + 1);

  const textOverflow = await page.evaluate(() => {
    const selectors = 'h1,h2,h3,p,a,button,strong,span,b,em,code';
    return [...document.querySelectorAll(selectors)].flatMap((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
      if (['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX)) return [];
      if (element.scrollWidth <= element.clientWidth + 1) return [];
      return [`${element.tagName.toLowerCase()}.${element.className || '(no-class)'}`];
    });
  });
  expect(textOverflow).toEqual([]);

  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .disableRules(['color-contrast'])
    .analyze();
  const seriousViolations = accessibility.violations.filter(({ impact }) =>
    ['serious', 'critical'].includes(impact)
  );
  expect(seriousViolations).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test('mobile navigation opens and closes', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile-only behavior');
  const button = page.locator('.menu-button');
  const header = page.locator('.site-header');
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(header).toHaveClass(/menu-open/);
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(header).not.toHaveClass(/menu-open/);
});

test('captures acceptance screenshot when requested', async ({ page }, testInfo) => {
  test.skip(process.env.CAPTURE_SCREENSHOTS !== '1', 'Screenshot capture is opt-in');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  const filename = testInfo.project.name.startsWith('mobile') ? 'mobile.png' : 'desktop.png';
  await page.screenshot({ path: `docs/screenshots/${filename}`, fullPage: true });
});
