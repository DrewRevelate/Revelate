import { test, expect } from '@playwright/test';

/**
 * E2E Test: Booking Flow with Calendly Integration
 *
 * Tests the booking page functionality and Calendly widget interaction.
 * Note: Full interaction with Calendly widget may be limited due to
 * third-party iframe restrictions.
 *
 * Acceptance Criteria: AC3
 */

test.describe('Booking Flow', () => {
  test('should load booking page and display Calendly widget', async ({ page }) => {
    // Navigate to booking page
    await page.goto('/book');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify page title or heading
    const pageHeading = page.locator('h1, h2').first();
    await expect(pageHeading).toBeVisible();

    // Look for Calendly iframe or widget container
    const calendlyIframe = page.locator('iframe[src*="calendly"], iframe[src*="cal.com"]').first();
    const calendlyContainer = page.locator('[data-calendly], [class*="calendly"], [class*="cal-com"]').first();

    // Check if either Calendly iframe or container exists
    const hasIframe = await calendlyIframe.count() > 0;
    const hasContainer = await calendlyContainer.count() > 0;

    // At least one should be present
    expect(hasIframe || hasContainer).toBeTruthy();

    if (hasIframe) {
      // Verify iframe is visible and loaded
      await expect(calendlyIframe).toBeVisible({ timeout: 10000 });

      // Check iframe has valid src
      const iframeSrc = await calendlyIframe.getAttribute('src');
      expect(iframeSrc).toBeTruthy();
      expect(iframeSrc).toMatch(/calendly\.com|cal\.com/);
    }

    if (hasContainer) {
      // Verify container is visible
      await expect(calendlyContainer).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle Calendly widget loading errors gracefully', async ({ page }) => {
    // Block Calendly requests to simulate loading failure
    await page.route('**/*calendly*/**', route => route.abort());
    await page.route('**/*cal.com*/**', route => route.abort());

    // Navigate to booking page
    await page.goto('/book');
    await page.waitForLoadState('networkidle');

    // Page should still load even if Calendly fails
    const pageHeading = page.locator('h1, h2').first();
    await expect(pageHeading).toBeVisible();

    // Check for error message or fallback content
    // (implementation specific - may not exist yet)
    await page.waitForTimeout(3000);

    // Verify page doesn't crash
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
  });

  test('should have correct page metadata for SEO', async ({ page }) => {
    await page.goto('/book');
    await page.waitForLoadState('networkidle');

    // Check page title
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);

    // Check meta description if present
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
    }
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/book');
    await page.waitForLoadState('networkidle');

    // Verify page loads and is visible on mobile
    const pageHeading = page.locator('h1, h2').first();
    await expect(pageHeading).toBeVisible();

    // Check if Calendly widget adjusts for mobile
    const calendlyIframe = page.locator('iframe[src*="calendly"], iframe[src*="cal.com"]').first();

    if (await calendlyIframe.count() > 0) {
      await expect(calendlyIframe).toBeVisible({ timeout: 10000 });

      // Verify iframe doesn't overflow viewport
      const iframeBox = await calendlyIframe.boundingBox();
      if (iframeBox) {
        expect(iframeBox.width).toBeLessThanOrEqual(375);
      }
    }
  });

  test('should navigate to booking page from home', async ({ page }) => {
    // Start on home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find and click booking link/button
    const bookingLink = page.locator('a[href="/book"], a[href*="book"], button', {
      has: page.locator('text=/book|schedule|calendar/i')
    }).first();

    if (await bookingLink.count() > 0) {
      await bookingLink.click();

      // Wait for navigation
      await page.waitForURL('**/book');

      // Verify we're on the booking page
      expect(page.url()).toContain('/book');

      // Verify booking content loaded
      await page.waitForLoadState('networkidle');
      const pageHeading = page.locator('h1, h2').first();
      await expect(pageHeading).toBeVisible();
    }
  });
});
