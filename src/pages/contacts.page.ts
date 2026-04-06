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

export type CreateContactLocators = {
    contactsLink: string;
    createContactButton: string;
    firstNameField: string;
    lastNameField: string;
    companyField: string;
    emailField: string;
    phoneNumberField: string;
    addressField: string;
    cityField: string;
    stateField: string;
    zipCodeField: string;
    countryField: string;
    saveContactButton: string;
};

export class ContactsPage extends BasePage {
    constructor(page: Page, context?: BrowserContext, browser?: Browser) {
        super(page, context, browser);
    }

    private getLocator(locator: string): Locator {
        // Note: some provided locators include :contains() which is not valid CSS in Playwright.
        // We still pass them through page.locator() as requested; adjust to text/role locators once validated.
        return this.page.locator(locator);
    }

    private getByExpression(locator: string): Locator {
        // Locator rules: if locator starts with getBy*, use page.getByRole/getByText directly.
        // Provided values look like: getByRole('textbox', { name: 'First Name' })
        // We parse minimal supported patterns.
        const trimmed = locator.trim();

        if (trimmed.startsWith("getByRole(")) {
            const match = trimmed.match(/^getByRole\(\s*'([^']+)'\s*,\s*\{\s*name:\s*'([^']+)'\s*\}\s*\)$/);
            if (!match) {
                throw new Error(`Unsupported getByRole expression: ${locator}`);
            }
            const [, role, name] = match;
            return this.page.getByRole(role as any, { name });
        }

        if (trimmed.startsWith('getByText(')) {
            const match = trimmed.match(/^getByText\(\s*'([^']+)'\s*\)$/);
            if (!match) {
                throw new Error(`Unsupported getByText expression: ${locator}`);
            }
            const [, text] = match;
            return this.page.getByText(text);
        }

        throw new Error(`Unsupported getBy* expression: ${locator}`);
    }

    private resolveLocator(locator: string): Locator {
        const trimmed = locator.trim();
        if (trimmed.startsWith('getBy')) {
            return this.getByExpression(trimmed);
        }
        return this.getLocator(locator);
    }

    async openContacts(locator: string): Promise<void> {
        this.logStep('Open Contacts');
        await ActionUtils.click(this.resolveLocator(locator), { page: this.page });
    }

    async clickCreateContact(locator: string): Promise<void> {
        this.logStep('Click Create Contact');
        await ActionUtils.click(this.resolveLocator(locator), { page: this.page });
    }

    async fillFirstName(locator: string, value: string): Promise<void> {
        this.logStep(`Fill First Name: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillLastName(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Last Name: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillCompany(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Company: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillEmail(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Email: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillPhoneNumber(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Phone Number: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillAddress(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Address: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillCity(locator: string, value: string): Promise<void> {
        this.logStep(`Fill City: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillState(locator: string, value: string): Promise<void> {
        this.logStep(`Fill State: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillZipCode(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Zip Code: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async fillCountry(locator: string, value: string): Promise<void> {
        this.logStep(`Fill Country: ${value}`);
        await ActionUtils.fill(this.resolveLocator(locator), value, { page: this.page });
    }

    async clickSaveContact(locator: string): Promise<void> {
        this.logStep('Click Save Contact');
        await ActionUtils.click(this.resolveLocator(locator), { page: this.page });
    }

    async createContact(
        contact: ContactData,
        locators: Partial<CreateContactLocators>
    ): Promise<void> {
        if (locators.contactsLink) {
            await this.openContacts(locators.contactsLink);
        }

        if (locators.createContactButton) {
            await this.clickCreateContact(locators.createContactButton);
        }

        if (contact.firstName && locators.firstNameField) {
            await this.fillFirstName(locators.firstNameField, contact.firstName);
        }

        if (contact.lastName && locators.lastNameField) {
            await this.fillLastName(locators.lastNameField, contact.lastName);
        }

        if (contact.company && locators.companyField) {
            await this.fillCompany(locators.companyField, contact.company);
        }

        if (contact.email && locators.emailField) {
            await this.fillEmail(locators.emailField, contact.email);
        }

        if (contact.phone && locators.phoneNumberField) {
            await this.fillPhoneNumber(locators.phoneNumberField, contact.phone);
        }

        if (contact.address && locators.addressField) {
            await this.fillAddress(locators.addressField, contact.address);
        }

        if (contact.city && locators.cityField) {
            await this.fillCity(locators.cityField, contact.city);
        }

        if (contact.state && locators.stateField) {
            await this.fillState(locators.stateField, contact.state);
        }

        if (contact.zip && locators.zipCodeField) {
            await this.fillZipCode(locators.zipCodeField, contact.zip);
        }

        if (contact.country && locators.countryField) {
            await this.fillCountry(locators.countryField, contact.country);
        }

        if (locators.saveContactButton) {
            await this.clickSaveContact(locators.saveContactButton);
        }
    }
}
