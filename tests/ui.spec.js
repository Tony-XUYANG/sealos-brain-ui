import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const sections = [
  ['#deploy', 'one production path.'],
  ['#intelligence', 'Sealos fixes it.'],
  ['#ai', 'Multi-model injection'],
  ['#skills', 'Ship through one Skill.'],
  ['#app-store', 'Run it in one click.'],
  ['#scale', 'Running everywhere.']
];

function watchRuntimeErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`);
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
});

test('matches the desktop design canvas geometry', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop'), 'Desktop design baseline');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);

  const geometry = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    details: (() => {
      const hero = document.querySelector('.hero-section');
      const divider = document.querySelector('.hero-section + .section-divider');
      const cloud = document.querySelector('.cloud-card');
      const aiMap = document.querySelector('.ai-map');
      const proxy = document.querySelector('.proxy-card');
      const heroRect = hero.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      const cloudRect = cloud.getBoundingClientRect();
      const aiMapRect = aiMap.getBoundingClientRect();
      const proxyRect = proxy.getBoundingClientRect();
      const cloudBottomNode = document.elementFromPoint(cloudRect.left + cloudRect.width / 2, cloudRect.bottom - 2);
      return {
        heroOverflowY: getComputedStyle(hero).overflowY,
        cloudBottom: Math.round(cloudRect.bottom),
        heroBottom: Math.round(heroRect.bottom),
        dividerBottom: Math.round(dividerRect.bottom),
        cloudBottomVisible: cloudBottomNode?.closest('.cloud-card') === cloud,
        proxyLeft: Math.round(proxyRect.left - aiMapRect.left),
        proxyTop: Math.round(proxyRect.top - aiMapRect.top),
        proxyWidth: Math.round(proxyRect.width),
        proxyHeight: Math.round(proxyRect.height)
      };
    })(),
    blocks: [...document.querySelectorAll('.site-header, main > section, main > .section-divider, .site-footer')]
      .map((element) => ({
        id: element.id || element.className,
        top: Math.round(element.getBoundingClientRect().top + scrollY),
        height: Math.round(element.getBoundingClientRect().height)
      }))
  }));

  expect(geometry.width).toBe(1440);
  expect(geometry.height).toBe(6456);
  expect(geometry.details).toEqual({
    heroOverflowY: 'visible',
    cloudBottom: 834,
    heroBottom: 800,
    dividerBottom: 875,
    cloudBottomVisible: true,
    proxyLeft: 504,
    proxyTop: 198,
    proxyWidth: 188,
    proxyHeight: 155
  });
  expect(geometry.blocks).toEqual([
    { id: 'site-header', top: 0, height: 80 },
    { id: 'deploy', top: 80, height: 720 },
    { id: 'section-divider', top: 800, height: 75 },
    { id: 'intelligence', top: 875, height: 815 },
    { id: 'ai', top: 1690, height: 1070 },
    { id: 'skills', top: 2760, height: 965 },
    { id: 'section-divider divider-two', top: 3725, height: 84 },
    { id: 'app-store', top: 3809, height: 930 },
    { id: 'scale', top: 4739, height: 972 },
    { id: 'footer', top: 5711, height: 745 }
  ]);
});

test('deploy form runs the agent workflow', async ({ page }) => {
  const map = page.locator('.journey-map');
  const button = page.locator('#deploy-form button');

  await page.locator('#repo-url').fill('https://github.com/labring/sealos');
  await button.click();
  await expect(map).toHaveAttribute('data-journey-phase', 'analyze');
  await expect(button).toContainText('Deploying');
  await expect(map).toHaveAttribute('data-journey-phase', 'ready', { timeout: 4_000 });
  await expect(button).toContainText('Deploy');
});

test('issue categories update the highlighted system', async ({ page }) => {
  const theater = page.locator('.ops-theater');
  const network = page.locator('[data-stage-button="network"]');
  await network.click();
  await expect(theater).toHaveAttribute('data-stage', 'network');
  await expect(network).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.network-card')).toHaveClass(/active/);
});

test('AI proxy and Skills expose the animated production graph', async ({ page }) => {
  await expect(page.locator('.provider')).toHaveCount(7);
  await expect(page.locator('.ai-routes animateMotion')).toHaveCount(3);
  await expect(page.locator('.skills-routes animateMotion')).toHaveCount(3);
  await expect(page.locator('[data-skill-stage]')).toHaveCount(4);

  const copy = page.locator('.copy-button');
  await copy.click();
  await expect(copy).toHaveAttribute('aria-label', 'Copied');
});

test('App Store cards and deploy command update state', async ({ page }) => {
  const activeCard = page.locator('.app-card.active');
  await activeCard.locator('button').click();
  await expect(activeCard).toHaveClass(/selected/);
  await expect(page.locator('#store-query')).toHaveValue('Deploy a Dify application');

  await page.locator('.store-form button').click();
  await expect(page.locator('.store-grid')).toHaveAttribute('data-store-phase', 'deploying');
  await expect(page.locator('.store-grid')).toHaveAttribute('data-store-phase', 'complete', { timeout: 3_000 });
});

test('scale counters animate to their published values', async ({ page }) => {
  await page.locator('#scale').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-count="300000"]')).toHaveText('300,000');
  await expect(page.locator('[data-count="18000"]')).toHaveText('18,000');
  await expect(page.locator('[data-count="50000"]')).toHaveText('50,000');
  await expect(page.locator('[data-count="1000"]')).toHaveText('1,000');
});

test('has no page errors, broken assets, serious accessibility violations, or layout overflow', async ({ page }) => {
  const runtimeErrors = watchRuntimeErrors(page);
  await page.reload();
  await page.evaluate(() => document.fonts.ready);

  for (const [selector] of sections) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    brokenImages: [...document.images]
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
    textOverflow: [...document.querySelectorAll('h1,h2,h3,p,a,button,strong,span,b,em,code')]
      .flatMap((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
        if (element.getAttribute('aria-hidden') === 'true') return [];
        if (['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX)) return [];
        if (element.scrollWidth <= element.clientWidth + 1) return [];
        return [`${element.tagName.toLowerCase()}.${element.className || '(no-class)'}`];
      })
  }));

  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.brokenImages).toEqual([]);
  expect(layout.textOverflow).toEqual([]);

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

test('captures acceptance screenshots when requested', async ({ page }, testInfo) => {
  test.skip(process.env.CAPTURE_SCREENSHOTS !== '1', 'Screenshot capture is opt-in');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (testInfo.project.name.startsWith('desktop')) {
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  const filename = testInfo.project.name.startsWith('mobile') ? 'mobile.png' : 'desktop.png';
  await page.screenshot({ path: `docs/screenshots/${filename}`, fullPage: true });
});
