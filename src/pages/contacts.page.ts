import { Page, BrowserContext, Browser, Locator } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

export type ContactData = {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
};

export type ContactLocators = {
    contactsLink: string;
    createButton: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    saveButton: string;
};

export class ContactsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private resolveLocator(locator: string): Locator {
        // Some provided locators include ":contains()" which is not valid CSS in Playwright.
        // We still accept the raw string and let Playwright parse it; if it fails, callers
        // can adjust to a supported selector (e.g., :has-text()).
        return this.page.locator(locator);
    }

    private resolveLocatorOrGetBy(locator: string): Locator {
        if (locator.trim().startsWith('getByRole(')) {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            return new Function('page', `return page.${locator};`)(this.page) as Locator;
        }

        if (locator.trim().startsWith('getByText(')) {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            return new Function('page', `return page.${locator};`)(this.page) as Locator;
        }

        return this.resolveLocator(locator);
    }

    async openContacts(locator: string): Promise<void> {
        this.logStep('Open Contacts');
        const target = this.resolveLocator(locator);
        await ActionUtils.click(target, { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }

    async clickCreateContact(locator: string): Promise<void> {
        this.logStep('Click Create Contact');
        const target = this.resolveLocator(locator);
        await ActionUtils.click(target, { page: this.page });
    }

    async fillFirstName(locator: string, value: string): Promise<void> {
        this.logStep(`Fill First Name: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillLastName(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Last Name: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillCompany(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Company: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillEmail(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Email: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillPhoneNumber(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Phone Number: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillAddress(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Address: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillCity(locator: string, value: string): Promise<void> {
        this.logStep(`Fill City: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillState(locator: string, value: string): Promise<void> {
        this.logStep(`Fill State: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillZipCode(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Zip Code: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async fillCountry(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Country: ${value}`);
        const target = this.resolveLocatorOrGetBy(locator);
        await ActionUtils.fill(target, value, { page: this.page });
    }

    async clickSaveContact(locator: string): Promise<void> {
        this.logStep('Click Save Contact');
        const target = this.resolveLocator(locator);
        await ActionUtils.click(target, { page: this.page });
        await this.page.waitForLoadState('networkidle');
    }

    async createContact(
        contact: ContactData,
        locators: Partial<ContactLocators>
    ): Promise<void> {
        if (contact.firstName !== undefined && locators.firstName) {
            await this.fillFirstName(locators.firstName, contact.firstName);
        }
        if (contact.lastName !== undefined && locators.lastName) {
            await this.fillLastName(locators.lastName, contact.lastName);
        }
        if (contact.company !== undefined && locators.company) {
            await this.fillCompany(locators.company, contact.company);
        }
        if (contact.email !== undefined && locators.email) {
            await this.fillEmail(locators.email, contact.email);
        }
        if (contact.phone !== undefined && locators.phoneNumber) {
            await this.fillPhoneNumber(locators.phoneNumber, contact.phone);
        }
        if (contact.address !== undefined && locators.address) {
            await this.fillAddress(locators.address, contact.address);
        }
        if (contact.city !== undefined && locators.city) {
            await this.fillCity(locators.city, contact.city);
        }
        if (contact.state !== undefined && locators.state) {
            await this.fillState(locators.state, contact.state);
        }
        if (contact.zip !== undefined && locators.zipCode) {
            await this.fillZipCode(locators.zipCode, contact.zip);
        }
        if (contact.country !== undefined && locators.country) {
            await this.fillCountry(locators.country, contact.country);
        }

        if (locators.saveButton) {
            await this.clickSaveContact(locators.saveButton);
        }
    }
}
