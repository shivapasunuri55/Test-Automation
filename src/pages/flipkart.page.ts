import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private searchField(): Locator {
        return this.page.getByText('Search for Products, Brands and More [text]');
    }

    private firstNonSponsoredItem(): Locator {
        return this.page.getByRole('link', { name: 'Specials/nTop Rated' });
    }

    async navigateToFlipkart(): Promise<void> {
        await this.navigateTo('https://flipkart.com');
    }

    async enterSearchTerm(searchTerm: string): Promise<void> {
        await ActionUtils.fill(this.searchField(), searchTerm, { page: this.page });
    }

    async submitSearchWithEnter(): Promise<void> {
        await this.searchField().press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async openFirstNonSponsoredItem(): Promise<void> {
        await ActionUtils.clickAndNavigate(this.firstNonSponsoredItem(), { page: this.page });
    }
}
