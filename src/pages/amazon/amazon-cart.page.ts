import { Browser, BrowserContext, Locator, Page } from '@playwright/test';

import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class AmazonCartPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private getCartContainer(): Locator {
        return this.getLocator('css: #sc-active-cart');
    }

    private getCartItemTitles(): Locator {
        return this.getLocator('css: #sc-active-cart .sc-list-item-content span.a-truncate-cut');
    }

    private getCartItemQuantitySelect(): Locator {
        return this.getLocator('css: #sc-active-cart select[name^="quantity"]');
    }

    private getCartItemQuantityInput(): Locator {
        return this.getLocator('css: #sc-active-cart input[name^="quantity"]');
    }

    async verifyCartLoaded(): Promise<void> {
        this.logStep('Verify cart page loaded');
        await this.page.waitForLoadState('networkidle');
        await this.getCartContainer().waitFor({ state: 'visible' });
    }

    async getCartItemTitlesText(): Promise<string[]> {
        this.logStep('Get all cart item titles');
        await this.getCartItemTitles().first().waitFor({ state: 'visible' });
        const titles = await this.getCartItemTitles().allInnerTexts();
        return titles.map(t => t.trim()).filter(Boolean);
    }

    async getFirstCartItemTitle(): Promise<string> {
        this.logStep('Get first cart item title');
        await this.getCartItemTitles().first().waitFor({ state: 'visible' });
        return (await this.getCartItemTitles().first().innerText()).trim();
    }

    async getFirstCartItemQuantity(): Promise<number> {
        this.logStep('Get first cart item quantity');
        await this.page.waitForLoadState('networkidle');

        const select = this.getCartItemQuantitySelect().first();
        if ((await select.count()) > 0) {
            await select.waitFor({ state: 'visible' });
            const value = await select.inputValue();
            const qty = parseInt(value, 10);
            return Number.isNaN(qty) ? 0 : qty;
        }

        const input = this.getCartItemQuantityInput().first();
        await input.waitFor({ state: 'visible' });
        const value = await input.inputValue();
        const qty = parseInt(value, 10);
        return Number.isNaN(qty) ? 0 : qty;
    }

    async verifyFirstCartItemQuantityIsOne(): Promise<void> {
        this.logStep('Verify first cart item quantity equals 1');
        const qty = await this.getFirstCartItemQuantity();
        if (qty !== 1) {
            throw new Error(`Expected first cart item quantity to be 1, but got ${qty}`);
        }
    }

    async openQuantityDropdownForFirstItem(): Promise<void> {
        this.logStep('Open quantity dropdown for first cart item');
        const select = this.getCartItemQuantitySelect().first();
        if ((await select.count()) > 0) {
            await ActionUtils.click(select, { page: this.page });
        }
    }
}
