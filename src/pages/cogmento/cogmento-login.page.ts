import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { ActionUtils } from '../../utils/action-utils';

export class CogmentoLoginPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private usernameInput(): Locator {
        return this.page.getByLabel('Username');
    }

    private passwordInput(): Locator {
        return this.page.getByLabel('Password');
    }

    private loginButton(): Locator {
        return this.page.getByRole('button', { name: 'Login' });
    }

    async enterUsername(username: string): Promise<void> {
        this.logStep(`Enter username: ${username}`);
        await ActionUtils.fill(this.usernameInput(), username, { page: this.page });
    }

    async enterPassword(password: string): Promise<void> {
        this.logStep('Enter password');
        await ActionUtils.fill(this.passwordInput(), password, { page: this.page });
    }

    async clickLogin(): Promise<void> {
        this.logStep('Click Login button');
        await ActionUtils.click(this.loginButton(), { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }
}
