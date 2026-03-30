import { Locator, Page, BrowserContext, Browser } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class ProductDetailsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    /**
     * Placeholder implementation until a PDP-unique locator is provided.
     */
    async waitForLoaded(): Promise<void> {
        this.logStep('Wait for Product Details Page to load');
        await this.page.waitForLoadState('load');
    }

    /**
     * Requires a product title locator to be provided later.
     */
    async getProductTitle(): Promise<string> {
        throw new Error('Product title locator not provided yet. Please update getProductTitle() with a valid locator.');
    }

    /**
     * Click Add to Cart on PDP.
     * Locator is optional because it is not provided yet.
     */
    async addToCart(addToCartLocator?: string | Locator): Promise<void> {
        if (!addToCartLocator) {
            throw new Error('Add to Cart locator not provided. Pass a locator to addToCart(addToCartLocator).');
        }

        this.logStep('Click Add to Cart');
        // Add-to-cart may navigate to cart or show a side panel; use clickAndNavigate for stability.
        await ActionUtils.clickAndNavigate(addToCartLocator, { page: this.page });
    }
}
