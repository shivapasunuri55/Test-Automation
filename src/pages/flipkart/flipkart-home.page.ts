import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartHomePage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private searchBar(): Locator {
        // Locator provided by test step definition; do not change.
        return this.page.getByLabel('search bar');
    }

    /**
     * Enter a search term in Flipkart search bar and submit with Enter.
     */
    async enterSearchTerm(term: string): Promise<void> {
        this.logStep(`Enter search term: ${term}`);

        await ActionUtils.fill(this.searchBar(), term, { page: this.page });
        await this.searchBar().press('Enter');

        // Wait strategy consistent with project patterns
        await this.page.waitForLoadState('networkidle');
    }
}
