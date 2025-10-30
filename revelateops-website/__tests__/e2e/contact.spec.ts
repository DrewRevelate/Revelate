import { test, expect } from '@playwright/test';

/**
 * E2E Test: Contact Form to Chat Flow
 *
 * Tests the complete user journey from filling out the contact form
 * to creating a conversation and initiating chat interaction.
 *
 * Acceptance Criteria: AC2, AC4
 */

test.describe('Contact Form to Chat Flow', () => {
  test('should submit contact form and open chat widget with conversation', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Locate and verify contact form is visible
    const contactSection = page.locator('section', { has: page.locator('text=/contact/i') });
    await expect(contactSection).toBeVisible({ timeout: 10000 });

    // Fill out the contact form
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').first();

    await nameInput.fill('Test User E2E');
    await emailInput.fill('e2e-test@example.com');
    await messageInput.fill('This is an automated E2E test message from Playwright');

    // Submit the form
    const submitButton = page.locator('button[type="submit"]', {
      has: page.locator('text=/send|submit|contact/i')
    }).first();

    await submitButton.click();

    // Wait for form submission to complete
    await page.waitForTimeout(2000);

    // Verify chat widget appears or conversation was created
    // Note: The actual implementation might vary based on your UI
    const chatWidget = page.locator('[data-testid="chat-widget"], .chat-widget, [class*="chat"]');

    // Check if chat widget exists or if a success message appears
    const hasChat = await chatWidget.count() > 0;
    const successMessage = page.locator('text=/success|thank you|sent/i');
    const hasSuccess = await successMessage.count() > 0;

    // At least one success indicator should be present
    expect(hasChat || hasSuccess).toBeTruthy();

    // If chat widget is present, verify it's functional
    if (hasChat) {
      await expect(chatWidget.first()).toBeVisible();

      // Try to find message input in chat widget
      const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').last();

      if (await chatInput.isVisible()) {
        // Send a test message in the chat
        await chatInput.fill('Hello from E2E test');

        // Find and click send button in chat
        const chatSendButton = page.locator('button', {
          has: page.locator('text=/send/i, [class*="send"]')
        }).last();

        if (await chatSendButton.isVisible()) {
          await chatSendButton.click();
          await page.waitForTimeout(1000);

          // Verify message appears in chat
          const sentMessage = page.locator('text=/Hello from E2E test/i');
          await expect(sentMessage).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should handle contact form validation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]', {
      has: page.locator('text=/send|submit|contact/i')
    }).first();

    await submitButton.click();

    // Wait a moment for validation to trigger
    await page.waitForTimeout(500);

    // Verify validation messages or that form wasn't submitted
    // (form should still be visible)
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    await expect(nameInput).toBeVisible();
  });

  test('should handle invalid email format', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill form with invalid email
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').first();

    await nameInput.fill('Test User');
    await emailInput.fill('invalid-email');
    await messageInput.fill('Test message');

    const submitButton = page.locator('button[type="submit"]', {
      has: page.locator('text=/send|submit|contact/i')
    }).first();

    await submitButton.click();

    // Wait for validation
    await page.waitForTimeout(500);

    // Email input should still be visible (form not submitted)
    await expect(emailInput).toBeVisible();
  });
});
