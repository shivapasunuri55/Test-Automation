import { Locator, Page } from '@playwright/test';

import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartHomePage extends BasePage {
    private readonly searchInput: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = this.page.getByPlaceholder('Search for Products, Brands and More');
    }

    async openHomePage(): Promise<void> {
        await this.navigateTo(ENV.BASE_URL || 'https://flipkart.com');
    }

    async verifyHomePageLoaded(): Promise<void> {
        await this.searchInput.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        await this.page.waitForLoadState('networkidle');
    }

    async enterSearchTerm(searchTerm: string): Promise<void> {
        await ActionUtils.fill(this.searchInput, searchTerm, {
            page: this.page,
            timeout: parseInt(ENV.TIMEOUTS.DEFAULT),
        });
    }

    async submitSearchWithEnter(): Promise<void> {
        await ActionUtils.pressPageKeyboard('Enter', {
            page: this.page,
        });
        await this.page.waitForLoadState('networkidle');
    }
}
