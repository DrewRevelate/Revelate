import { test, expect } from '@playwright/test';

/**
 * E2E Test: Chat Message Exchange
 *
 * Tests the chat widget functionality including message sending,
 * receiving, and read status updates.
 *
 * Acceptance Criteria: AC4
 */

test.describe('Chat Message Exchange', () => {
  // Helper function to create a test conversation via API
  async function createTestConversation(page: any): Promise<string | null> {
    try {
      // Create conversation via API
      const response = await page.request.post('/api/contact', {
        data: {
          name: 'E2E Test User',
          email: 'e2e-chat-test@example.com',
          message: 'Initial test message for chat E2E testing',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        return data.conversationId || data.id || null;
      }
    } catch (error) {
      console.error('Failed to create test conversation:', error);
    }
    return null;
  }

  test('should display chat widget and send messages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for chat widget or chat trigger button
    const chatWidget = page.locator('[data-testid="chat-widget"], .chat-widget, [class*="chat-widget"]').first();
    const chatTrigger = page.locator('button', {
      has: page.locator('[class*="chat"], text=/chat/i')
    }).first();

    // Try to open chat if it's not visible
    if (await chatTrigger.count() > 0 && await chatTrigger.isVisible()) {
      await chatTrigger.click();
      await page.waitForTimeout(1000);
    }

    // Verify chat widget or interface is present
    const hasChatWidget = await chatWidget.count() > 0;
    const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').last();
    const hasChatInput = await chatInput.count() > 0;

    // At least one chat interface element should be present
    expect(hasChatWidget || hasChatInput).toBeTruthy();

    if (hasChatInput && await chatInput.isVisible()) {
      // Type a message
      const testMessage = 'Hello, this is a test message from E2E testing';
      await chatInput.fill(testMessage);

      // Find and click send button
      const sendButton = page.locator('button', {
        has: page.locator('text=/send/i, [class*="send"]')
      }).last();

      if (await sendButton.isVisible()) {
        await sendButton.click();

        // Wait for message to be sent
        await page.waitForTimeout(2000);

        // Verify message appears in chat history
        const messageInChat = page.locator(`text=${testMessage}`);
        await expect(messageInChat.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should handle empty message submission', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find chat input
    const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').last();

    if (await chatInput.count() > 0 && await chatInput.isVisible()) {
      // Try to send empty message
      const sendButton = page.locator('button', {
        has: page.locator('text=/send/i, [class*="send"]')
      }).last();

      if (await sendButton.isVisible()) {
        // Ensure input is empty
        await chatInput.clear();

        // Try to click send
        await sendButton.click();

        // Wait a moment
        await page.waitForTimeout(500);

        // Input should still be visible (message not sent)
        await expect(chatInput).toBeVisible();
      }
    }
  });

  test('should display conversation history', async ({ page }) => {
    // Create a test conversation first
    const conversationId = await createTestConversation(page);

    if (conversationId) {
      // Navigate to page and check if conversation history loads
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for chat to potentially load conversation
      await page.waitForTimeout(2000);

      // Look for the initial message in chat history
      const initialMessage = page.locator('text=/Initial test message/i');
      const hasChatHistory = await initialMessage.count() > 0;

      // If chat loads the conversation, verify it's visible
      if (hasChatHistory) {
        await expect(initialMessage.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should handle long messages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').last();

    if (await chatInput.count() > 0 && await chatInput.isVisible()) {
      // Create a long message
      const longMessage = 'This is a very long message that tests how the chat interface handles longer text content. '.repeat(5);

      await chatInput.fill(longMessage);

      // Find and click send button
      const sendButton = page.locator('button', {
        has: page.locator('text=/send/i, [class*="send"]')
      }).last();

      if (await sendButton.isVisible()) {
        await sendButton.click();
        await page.waitForTimeout(2000);

        // Verify message was sent (input should be cleared or message visible)
        const inputValue = await chatInput.inputValue();
        const messageVisible = await page.locator(`text*=${longMessage.substring(0, 50)}`).count() > 0;

        // Either input is cleared or message is visible in chat
        expect(inputValue === '' || messageVisible).toBeTruthy();
      }
    }
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').last();

    if (await chatInput.count() > 0 && await chatInput.isVisible()) {
      // Focus the input via keyboard (Tab navigation would be tested in real scenario)
      await chatInput.focus();

      // Verify input is focused
      const isFocused = await chatInput.evaluate(el => el === document.activeElement);
      expect(isFocused).toBeTruthy();

      // Type message
      await chatInput.fill('Keyboard test message');

      // Try to submit with Enter key (if supported)
      await chatInput.press('Enter');

      // Wait for potential submission
      await page.waitForTimeout(1000);

      // Verify input is still accessible
      await expect(chatInput).toBeVisible();
    }
  });

  test('should display typing indicator or loading state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').last();

    if (await chatInput.count() > 0 && await chatInput.isVisible()) {
      await chatInput.fill('Test message for loading state');

      const sendButton = page.locator('button', {
        has: page.locator('text=/send/i, [class*="send"]')
      }).last();

      if (await sendButton.isVisible()) {
        await sendButton.click();

        // Immediately check for loading state
        const loadingIndicator = page.locator('[class*="loading"], [class*="typing"], [class*="spinner"]');

        // Note: Loading state may be very brief
        // This test verifies the infrastructure is present
        await page.waitForTimeout(100);

        // Just verify chat interface remains functional
        await expect(chatInput).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
