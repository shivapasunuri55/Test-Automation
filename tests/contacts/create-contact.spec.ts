import { test, expect } from '../../test-setup/fixtures';
import { LoginPage } from '@/pages/login.page';
import { ContactsPage } from '@/pages/contacts.page';
import { BasePage } from '@/pages/base.page';
import { config } from '@config/env';

test.describe('Contacts', () => {
    test('Create contact with most fields and verify created', async ({ page, context, browser, logger }) => {
        const basePage = new (class extends BasePage { })(page, context, browser);
        const loginPage = new LoginPage(page, context, browser);
        const contactsPage = new ContactsPage(page, context, browser);

        const unique = Date.now();
        const firstName = `AutoFN${unique}`;
        const lastName = `AutoLN${unique}`;
        const fullName = `${firstName} ${lastName}`;
        const company = `AutoCompany${unique}`;
        const email = `auto.${unique}@example.com`;
        const phone = `555${String(unique).slice(-7)}`;
        const address = `123 Test St ${unique}`;
        const city = 'Test City';
        const state = 'Test State';
        const zip = String(unique).slice(-5);
        const country = 'Test Country';

        // (a) Navigate to login
        await basePage.navigateTo(config.baseUrl);

        // (b) Login (steps 1-3)
        await loginPage.fillUsername("getByRole('textbox', { name: 'Username' })", config.credentials.username);
        await loginPage.fillPassword("getByRole('textbox', { name: 'Password' })", config.credentials.password);
        await loginPage.clickLogin("getByRole('button', { name: 'Login' })");

        // (c) Open Contacts and click Create (steps 4-5)
        await contactsPage.openContacts("a[href*='contacts'], a[href='/contacts'], nav a:contains('Contacts'), .nav-link:contains('Contacts'), [role='menuitem']:contains('Contacts')");
        await contactsPage.clickCreateContact("button:contains('Create'), .btn:contains('Create'), [data-testid*='create'], .create-btn, button:contains('New'), .btn:contains('New Contact'), .add-contact-btn, .new-contact-btn");

        // (d) Fill contact fields (steps 6-15)
        await contactsPage.fillFirstName("getByRole('textbox', { name: 'First Name' })", firstName);
        await contactsPage.fillLastName("getByRole('textbox', { name: 'Last Name' })", lastName);
        await contactsPage.fillCompany("getByRole('textbox', { name: 'Company' })", company);
        await contactsPage.fillEmail('[placeholder="Email address"]', email);
        await contactsPage.fillPhoneNumber("getByRole('textbox', { name: 'Phone Number' })", phone);
        await contactsPage.fillAddress("input[name='address'], input[placeholder*='address' i], input[id*='address' i], textarea[name='address'], textarea[placeholder*='address' i]", address);
        await contactsPage.fillCity("getByRole('textbox', { name: 'City' })", city);
        await contactsPage.fillState("getByRole('textbox', { name: 'State' })", state);
        await contactsPage.fillZipCode("getByRole('textbox', { name: 'Zip Code' })", zip);
        await contactsPage.fillCountry("getByRole('textbox', { name: 'Country' })", country);

        // (e) Save (step 16)
        await contactsPage.clickSaveContact("button[type='submit'], input[type='submit'], button:contains('Save'), .ui.button:contains('Save')");

        // (f) Verify created
        await expect(page).toHaveURL(/contacts/);

        // Best-effort assertion; replace with a stable locator once identified.
        // TODO: Add a stable details header locator for the created contact page.
        await expect(page.getByText(fullName)).toBeVisible();

        logger.info(`Created contact: ${fullName} (${email})`);
    });
});
