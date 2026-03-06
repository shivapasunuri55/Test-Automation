import { expect, Page } from '@playwright/test';

import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartHomePage extends BasePage {
    private readonly url = 'https://flipkart.com';

    constructor(page: Page) {
        super(page);
    }

    async navigateToHome(): Promise<void> {
        await this.navigateTo(this.url);
        await this.closeInitialLoginModalIfPresent();
    }

    async closeInitialLoginModalIfPresent(): Promise<void> {
        // Flipkart frequently shows a login modal on first load.
        // Best-effort close: do not fail test if modal is not present.
        const closeButtonSelectors: string[] = [
            'button._2KpZ6l._2doB4z',
            'button:has-text("✕")',
            'button[aria-label="Close"]',
            'button[aria-label="close"]',
            'button:has(svg[aria-label="Close"])',
        ];

        for (const selector of closeButtonSelectors) {
            const closeBtn = this.getLocator(selector).first();
            try {
                if (await closeBtn.isVisible({ timeout: 1500 })) {
                    await ActionUtils.click(closeBtn, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.SHORT) });
                    return;
                }
            } catch {
                // ignore and try next selector
            }
        }

        // Sometimes modal can be dismissed by pressing Escape.
        try {
            await this.page.keyboard.press('Escape');
        } catch {
            // ignore
        }
    }

    async verifyHomePageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/flipkart\.com/i, { timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        const searchInput = this.getSearchInput();
        await expect(searchInput).toBeVisible({ timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async enterSearchTerm(searchTerm: string): Promise<void> {
        const searchInput = this.getSearchInput();
        await ActionUtils.fill(searchInput, searchTerm, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async submitSearch(): Promise<void> {
        const searchInput = this.getSearchInput();

        // Prefer Enter (most stable). If it doesn't navigate, fall back to clicking submit.
        await searchInput.press('Enter');

        const submitButton = this.getSearchSubmitButton();
        try {
            if (await submitButton.isVisible({ timeout: 1500 })) {
                await ActionUtils.click(submitButton, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.SHORT) });
            }
        } catch {
            // ignore
        }
    }

    async searchForProduct(searchTerm: string): Promise<void> {
        await this.enterSearchTerm(searchTerm);
        await this.submitSearch();
    }

    private getSearchInput() {
        return this.getLocator('input[name="q"]');
    }

    private getSearchSubmitButton() {
        return this.getLocator('button[type="submit"]');
    }
}
