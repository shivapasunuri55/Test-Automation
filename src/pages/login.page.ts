import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class LoginPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private resolveGetByLocator(locator: string): Locator {
        if (locator.startsWith("getByRole(")) {
            const match = locator.match(/getByRole\('([^']+)'\s*,\s*\{\s*name:\s*'([^']+)'\s*\}\)/);
            if (match) {
                const role = match[1] as any;
                const name = match[2];
                return this.page.getByRole(role, { name });
            }
        }

        return this.page.locator(locator);
    }

    async fillUsername(locator: string, value: string): Promise<void> {
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.page.locator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async fillPassword(locator: string, value: string): Promise<void> {
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.page.locator(locator);
        await ActionUtils.fill(resolved, value, { page: this.page });
    }

    async clickLogin(locator: string): Promise<void> {
        const resolved = locator.startsWith('getBy') ? this.resolveGetByLocator(locator) : this.page.locator(locator);
        await ActionUtils.click(resolved, { page: this.page });
    }
}
