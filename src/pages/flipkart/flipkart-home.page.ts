import { expect, Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartHomePage extends BasePage {
    private readonly flipkartUrl = 'https://flipkart.com/';

    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private get searchInput(): Locator {
        // Flipkart search input
        return this.getLocator('input[name="q"]');
    }

    private get loginModalCloseButton(): Locator {
        // Defensive: close button for login modal (varies by UI)
        return this.getLocator('button._2KpZ6l._2doB4z, button[aria-label="Close"], button:has-text("✕"), span:has-text("✕")');
    }

    async navigateToFlipkart(): Promise<void> {
        this.logStep('Navigate to Flipkart home page');
        await this.navigateTo(this.flipkartUrl);
        await this.page.waitForLoadState('domcontentloaded');
        await this.closeLoginModalIfPresent();
    }

    async verifyHomePageLoaded(): Promise<void> {
        this.logStep('Verify Flipkart home page loaded');

        await expect(this.page).toHaveURL(/flipkart\.com/i);
        await this.closeLoginModalIfPresent();

        await expect(this.searchInput).toBeVisible();
        const title = await this.getPageTitle();
        expect(title.toLowerCase()).toContain('flipkart');
    }

    async enterSearchText(searchText: string): Promise<void> {
        this.logStep(`Enter search text: ${searchText}`);
        await this.closeLoginModalIfPresent();

        await ActionUtils.fill(this.searchInput, searchText, { page: this.page });
    }

    async submitSearchWithEnter(): Promise<void> {
        this.logStep('Submit search with Enter key');
        await this.closeLoginModalIfPresent();

        await this.searchInput.waitFor({ state: 'visible' });
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async closeLoginModalIfPresent(): Promise<void> {
        // Flipkart often shows a login modal on first load.
        // Close it if present; do not fail if it is not.
        const closeBtn = this.loginModalCloseButton;
        try {
            if (await closeBtn.first().isVisible({ timeout: 2000 })) {
                this.logStep('Close Flipkart login modal');
                await closeBtn.first().click({ timeout: 5000 });
            }
        } catch {
            // ignore
        }
    }
}
