import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export class LoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    // Post-login landing element (used for navigation wait)
    private readonly contactsLink: Locator;

    constructor(page: Page) {
        super(page);

        // Locators (preserve locator_value strings exactly as provided)
        this.usernameInput = this.page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = this.page.getByRole('textbox', { name: 'Password' });
        this.loginButton = this.page.getByRole('button', { name: 'Login' });

        // Best-effort landing element after login
        this.contactsLink = this.page.getByRole('link', { name: 'Contacts' });
    }

    async fillUsername(value: string): Promise<void> {
        this.logStep(`Fill Username: ${value}`);
        await ActionUtils.fill(this.usernameInput, value, { page: this.page });
    }

    async fillPassword(value: string): Promise<void> {
        this.logStep('Fill Password');
        await ActionUtils.fill(this.passwordInput, value, { page: this.page });
    }

    async clickLogin(): Promise<void> {
        this.logStep('Click Login');
        await ActionUtils.click(this.loginButton, { page: this.page });
    }

    async login(username: string, password: string): Promise<void> {
        this.logStep('Login to application');
        await this.fillUsername(username);
        await this.fillPassword(password);

        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            this.clickLogin(),
        ]);

        // Wait for a known post-login element
        await this.contactsLink.waitFor({ state: 'visible' });
    }
}
