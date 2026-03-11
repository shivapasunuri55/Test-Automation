import { Browser, BrowserContext, Locator, Page, expect } from '@playwright/test';
import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';

export class FlipkartCartPage extends BasePage {
    // Cart page markers
    private readonly cartHeaderSelector = 'text=My Cart';

    // Cart item title selectors (Flipkart UI varies)
    private readonly cartItemTitleSelectors: string[] = [
        // Common cart item title anchor
        'a._2Kn22P.gBNbID',
        // Alternative title container
        'a:has(div._2-uG6-)',
        // Generic: any link inside cart item container that looks like a title
        'div._1AtVbE a[title]',
        // Fallback: title-like text blocks in cart rows
        'div._1AtVbE div:has-text("Apple")',
    ];

    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    async waitForCartLoaded(): Promise<void> {
        this.logStep('Wait for cart page to load');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');

        const header = this.page.locator(this.cartHeaderSelector).first();
        await header.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        // Best-effort wait for at least one cart item title to appear
        const titleLocator = this.getCartItemTitleLocator();
        await titleLocator
            .first()
            .waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) })
            .catch(() => undefined);
    }

    async verifyProductInCart(expectedProductTitle: string): Promise<void> {
        this.logStep(`Verify product is present in cart: ${expectedProductTitle}`);
        await this.waitForCartLoaded();

        const normalizedExpected = this.normalizeTitle(expectedProductTitle);
        const titleLocator = this.getCartItemTitleLocator();

        const count = await titleLocator.count();
        expect(count, 'Expected at least one cart line item title to be present').toBeGreaterThan(0);

        const titles: string[] = [];
        for (let i = 0; i < count; i++) {
            const raw = await titleLocator
                .nth(i)
                .innerText()
                .catch(async () => {
                    const attr = await titleLocator.nth(i).getAttribute('title');
                    return attr ?? '';
                });
            const t = (raw ?? '').trim();
            if (t) titles.push(t);
        }

        this.addAttachment('cart_item_titles', titles.join('\n'));

        const found = titles.some((t) => this.normalizeTitle(t).includes(normalizedExpected));
        expect(
            found,
            `Expected product title to be present in cart. Expected (normalized): "${normalizedExpected}". Actual titles: ${JSON.stringify(titles)}`
        ).toBeTruthy();
    }

    private getCartItemTitleLocator(): Locator {
        return this.page.locator(this.cartItemTitleSelectors.join(', '));
    }

    private normalizeTitle(title: string): string {
        return title
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/\u00a0/g, ' ')
            .trim();
    }
}
