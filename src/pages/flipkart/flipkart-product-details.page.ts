import { expect, Locator, Page } from '@playwright/test';

import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartProductDetailsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async verifyProductDetailsLoaded(): Promise<void> {
        const title = this.getProductTitleLocator();
        await expect(title).toBeVisible({ timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
    }

    async getProductTitle(): Promise<string> {
        await this.verifyProductDetailsLoaded();

        const titleText = (await this.getProductTitleLocator().innerText()).trim();
        if (!titleText) {
            throw new Error('Product title is empty on product details page');
        }

        return titleText;
    }

    async clickAddToCart(): Promise<void> {
        await this.verifyProductDetailsLoaded();

        const candidates: Locator[] = [
            // Prefer role/name based selectors
            this.page.getByRole('button', { name: /add to cart/i }),

            // Some flows show "Go to cart" after adding; allow this as a stable alternative
            this.page.getByRole('button', { name: /go to cart/i }),

            // Fallbacks
            this.page.getByRole('link', { name: /add to cart/i }),
            this.getLocator('button:has-text("Add to cart"), button:has-text("ADD TO CART")'),
            this.getLocator('button._2KpZ6l._2U9uOA._3v1-ww'),
            this.getLocator('xpath=//button[contains(.,"Add to cart") or contains(.,"ADD TO CART")]'),
        ];

        for (const candidate of candidates) {
            try {
                if ((await candidate.count()) > 0 && (await candidate.first().isVisible({ timeout: 1000 }))) {
                    await ActionUtils.click(candidate.first(), { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
                    return;
                }
            } catch {
                // try next candidate
            }
        }

        throw new Error("Unable to find 'Add to Cart' button on product details page");
    }

    private getProductTitleLocator(): Locator {
        return this.page.getByRole('heading').first().or(this.getLocator('span.B_NuCI, h1, h1 span'));
    }
}
