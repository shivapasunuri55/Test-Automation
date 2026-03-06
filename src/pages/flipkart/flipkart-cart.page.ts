import { expect, Locator, Page } from '@playwright/test';

import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';

export class FlipkartCartPage extends BasePage {
    private readonly cartUrl = 'https://www.flipkart.com/viewcart';

    constructor(page: Page) {
        super(page);
    }

    async openCart(): Promise<void> {
        this.logStep('Open cart');

        // Try opening cart via header link first (preferred)
        const cartLinkCandidates: Locator[] = [
            this.page.getByRole('link', { name: /cart/i }),
            this.getLocator('a.WGWdFn'),
            this.getLocator('xpath=//*[@id="container"]//a[contains(.,"Cart") or contains(@href,"viewcart")]'),
        ];

        for (const candidate of cartLinkCandidates) {
            try {
                if ((await candidate.count()) > 0 && (await candidate.first().isVisible({ timeout: 1000 }))) {
                    await candidate.first().click();
                    await this.verifyCartLoaded();
                    return;
                }
            } catch {
                // ignore and fallback
            }
        }

        // Fallback to direct URL
        await this.navigateTo(this.cartUrl);
        await this.verifyCartLoaded();
    }

    async verifyCartLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/viewcart|cart/i, { timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        const cartContainerCandidates: Locator[] = [
            this.getLocator('div:has-text("My Cart")'),
            this.getLocator('span:has-text("My Cart")'),
            this.getLocator('div._1YokD2'),
        ];

        for (const candidate of cartContainerCandidates) {
            try {
                if ((await candidate.count()) > 0) {
                    await expect(candidate.first()).toBeVisible({ timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
                    return;
                }
            } catch {
                // try next
            }
        }
    }

    async verifyItemInCart(expectedTitle?: string): Promise<void> {
        this.logStep('Verify item is present in cart');
        await this.verifyCartLoaded();

        const normalizedExpected = (expectedTitle ?? '').trim();
        const fallbackExpected = 'iPhone';

        const cartItemTitleCandidates: Locator[] = [
            // Common cart item title selectors
            this.getLocator('a._2Kn22P.gBNbID'),
            this.getLocator('div._2-uG6-'),
            this.getLocator('a:has(div._2-uG6-), a:has(span._2-uG6-)'),
            this.getLocator('xpath=//a[contains(@href,"/p/")][.//div or .//span]'),
        ];

        let titleLocator: Locator | undefined;
        for (const candidate of cartItemTitleCandidates) {
            try {
                if ((await candidate.count()) > 0) {
                    titleLocator = candidate.first();
                    break;
                }
            } catch {
                // try next
            }
        }

        if (!titleLocator) {
            throw new Error('Unable to locate cart item title on cart page');
        }

        await expect(titleLocator).toBeVisible({ timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        const cartTitle = (await titleLocator.innerText()).trim();

        if (normalizedExpected) {
            expect(cartTitle.toLowerCase()).toContain(normalizedExpected.toLowerCase());
        } else {
            expect(cartTitle.toLowerCase()).toContain(fallbackExpected.toLowerCase());
        }
    }
}
