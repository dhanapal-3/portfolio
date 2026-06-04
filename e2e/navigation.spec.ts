import { expect, test } from '@playwright/test';

test.describe('Portfolio navigation', () => {
  test('skip link targets hero content', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute('href', '#hero');
  });

  test('hash navigation scrolls to sections', async ({ page }) => {
    await page.goto('/');
    await page.locator('header nav a[href="#projects"]').first().click();
    await expect(page.locator('#projects')).toBeInViewport();
  });

  test('mobile menu opens, traps escape, and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    await toggle.click();
    await expect(page.locator('#mobile-nav')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#mobile-nav')).toHaveCount(0);
  });

  test('contact form shows aria-live feedback on validation', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('[role="status"][aria-live="polite"]')).toBeAttached();
    await expect(page.getByText('Enter your name')).toBeVisible();
  });

  test('honeypot field is hidden from users', async ({ page }) => {
    await page.goto('/#contact');
    const honeypotWrap = page.locator('.field-honeypot');
    const honeypot = page.locator('#contact-website');
    await expect(honeypotWrap).toHaveAttribute('aria-hidden', 'true');
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
  });
});
