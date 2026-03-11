import { Browser, BrowserContext, Locator, Page } from '@playwright/test';
import { ENV } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class FlipkartProductDetailsPage extends BasePage {
    private readonly productTitleSelector = 'span.B_NuCI, h1 span';
    private readonly productPriceSelector = 'div._30jeq3._16Jk6d, div.Nx9bqj';

    // Resilient add-to-cart selectors (Flipkart UI varies)
    private readonly addToCartSelectors: string[] = [
        "button:has-text('Add to cart')",
        "button:has-text('ADD TO CART')",
        "a:has-text('Add to cart')",
        "a:has-text('ADD TO CART')",
        "[data-testid*='add-to-cart' i]",
        "[data-test*='add-to-cart' i]",
        "[aria-label*='add to cart' i]",
        "button[class*='add' i]:has-text('cart')",
    ];

    // Cart/confirmation selectors
    private readonly cartPageMarkerSelector = 'text=My Cart';
    private readonly goToCartSelectors: string[] = [
        "a:has-text('Go to cart')",
        "button:has-text('Go to cart')",
        "a:has-text('GO TO CART')",
        "button:has-text('GO TO CART')",
    ];

    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    async waitForProductDetailsLoaded(): Promise<void> {
        this.logStep('Wait for product details page to load');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');

        const title = this.page.locator(this.productTitleSelector).first();
        await title.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        const price = this.page.locator(this.productPriceSelector).first();
        // Price may be below the fold or lazy-rendered; wait best-effort
        await price.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) }).catch(() => undefined);
    }

    async getProductTitle(): Promise<string> {
        this.logStep('Capture product title from PDP');
        const titleLocator = this.page.locator(this.productTitleSelector).first();
        await titleLocator.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
        const title = (await titleLocator.innerText()).trim();
        this.logger.info(`PDP product title: ${title}`);
        this.addAttachment('pdp_product_title', title);
        return title;
    }

    async addToCart(): Promise<void> {
        this.logStep('Click Add to cart on PDP');

        const addToCartLocator = this.getFirstMatchingLocator(this.addToCartSelectors);
        await ActionUtils.click(addToCartLocator, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });

        await this.waitForCartOrConfirmation();
    }

    private getFirstMatchingLocator(selectors: string[]): Locator {
        // Return a locator that resolves to the first matching element among selectors.
        // We still rely on ActionUtils to wait for visibility before clicking.
        return this.page.locator(selectors.join(', ')).first();
    }

    private async waitForCartOrConfirmation(): Promise<void> {
        this.logStep('Wait for cart page or add-to-cart confirmation');

        // Flipkart sometimes navigates to /viewcart, sometimes shows a "Go to cart" CTA.
        const cartMarker = this.page.locator(this.cartPageMarkerSelector).first();
        const goToCart = this.page.locator(this.goToCartSelectors.join(', ')).first();

        await Promise.race([
            cartMarker.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) }),
            goToCart.waitFor({ state: 'visible', timeout: parseInt(ENV.TIMEOUTS.DEFAULT) }),
            this.page.waitForURL(/cart|viewcart/i, { timeout: parseInt(ENV.TIMEOUTS.DEFAULT) }),
        ]).catch(async () => {
            // As a fallback, wait for network to settle; cart might have updated silently.
            await this.page.waitForLoadState('networkidle');
        });

        // If "Go to cart" is present, click it to ensure we land on cart page for verification.
        if (await goToCart.isVisible().catch(() => false)) {
            await ActionUtils.click(goToCart, { page: this.page, timeout: parseInt(ENV.TIMEOUTS.DEFAULT) });
            await this.page.waitForLoadState('networkidle');
        }
    }
}
