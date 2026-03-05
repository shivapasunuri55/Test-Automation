import { Browser, BrowserContext, Locator, Page } from '@playwright/test';

import { ActionUtils } from '../../utils/action-utils';
import { BasePage } from '../base.page';

export class AmazonProductDetailsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private getProductTitleLocator(): Locator {
        return this.page.locator('#productTitle');
    }

    private getAddToCartButton(): Locator {
        return this.page.locator('#add-to-cart-button');
    }

    private getCartLink(): Locator {
        return this.page.locator('#nav-cart');
    }

    async getProductTitle(): Promise<string> {
        this.logStep('Get product title from product details page');
        const titleLocator = this.getProductTitleLocator();
        await titleLocator.waitFor({ state: 'visible' });
        const title = (await titleLocator.innerText()).trim();
        this.logger.info(`Product title: ${title}`);
        return title;
    }

    async addToCart(): Promise<void> {
        this.logStep('Click Add to Cart');
        const addToCartButton = this.getAddToCartButton();
        await ActionUtils.click(addToCartButton, { page: this.page });

        await this.page.waitForLoadState('networkidle');
        await this.dismissContinueShoppingIfPresent();
    }

    async dismissContinueShoppingIfPresent(): Promise<void> {
        this.logStep("Dismiss optional 'Continue shopping' interstitial if present");

        const candidates: Locator[] = [
            // role-based first
            this.page.getByRole('button', { name: 'Continue shopping' }),
            this.page.getByText('Continue shopping'),
            // css fallbacks
            this.page.locator('css: button[type="submit"].a-button-text'),
            this.page.locator('css: span.a-button.a-button-primary'),
            this.page.locator('css: span.a-button-inner'),
        ];

        for (const candidate of candidates) {
            try {
                if (await candidate.first().isVisible({ timeout: 1500 })) {
                    await ActionUtils.click(candidate.first(), { page: this.page });
                    await this.page.waitForLoadState('networkidle');
                    return;
                }
            } catch {
                // ignore and try next candidate
            }
        }
    }

    async openCart(): Promise<void> {
        this.logStep('Open cart');
        const cartLink = this.getCartLink();
        await ActionUtils.clickAndNavigate(cartLink, { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }
}
