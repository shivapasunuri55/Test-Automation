import { expect, Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export type ContactMostFields = {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
};

export class ContactCreatePage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    /**
     * Step 5: Wait for Create Contact form readiness.
     * Primary probe locator targets the First Name input.
     */
    async waitForCreateContactForm(): Promise<void> {
        const selector = "input[name='first_name'], input[placeholder*='First'], .form-control[name*='first'], #first_name";
        await this.getLocator(selector).first().waitFor({ state: 'visible' });
    }

    /** Step 6 */
    async fillFirstName(firstName: string): Promise<void> {
        await ActionUtils.fill(this.page.getByLabel('First Name'), firstName, { page: this.page });
    }

    /** Step 7 */
    async fillLastName(lastName: string): Promise<void> {
        await ActionUtils.fill(this.page.getByLabel('Last Name'), lastName, { page: this.page });
    }

    /** Step 8 */
    async fillCompany(company: string): Promise<void> {
        await ActionUtils.fill(this.page.getByLabel('Company'), company, { page: this.page });
    }

    /** Step 9 */
    async fillEmail(email: string): Promise<void> {
        await ActionUtils.fill(this.page.getByLabel('Email'), email, { page: this.page });
    }

    /**
     * Optional composite helper to fill most commonly used fields.
     */
    async fillMostFields(contact: ContactMostFields): Promise<void> {
        if (contact.firstName !== undefined) await this.fillFirstName(contact.firstName);
        if (contact.lastName !== undefined) await this.fillLastName(contact.lastName);
        if (contact.company !== undefined) await this.fillCompany(contact.company);
        if (contact.email !== undefined) await this.fillEmail(contact.email);
    }

    /**
     * Minimal proxy verification: asserts the form inputs contain the expected values.
     *
     * NOTE: This does NOT confirm the contact was actually created/saved.
     * True creation verification requires additional locators (e.g., Save button + success toast/contact row).
     */
    async assertContactFormValues(contact: ContactMostFields): Promise<void> {
        if (contact.firstName !== undefined) {
            await expect(this.page.getByLabel('First Name')).toHaveValue(contact.firstName);
        }

        if (contact.lastName !== undefined) {
            await expect(this.page.getByLabel('Last Name')).toHaveValue(contact.lastName);
        }

        if (contact.company !== undefined) {
            await expect(this.page.getByLabel('Company')).toHaveValue(contact.company);
        }

        if (contact.email !== undefined) {
            await expect(this.page.getByLabel('Email')).toHaveValue(contact.email);
        }
    }

    // Kept for potential future use in this page object.
    // (Avoids unused import linting if project enforces it.)
    private getLocatorForDebug(selector: string): Locator {
        return this.getLocator(selector);
    }
}
