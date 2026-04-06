import { test, expect } from '../../test-setup/fixtures';
import { config } from '@config/env';
import { BasePage } from '@/pages/base.page';
import { LoginPage } from '@/pages/login.page';
import { ContactsPage } from '@/pages/contacts.page';

test.describe('Contacts', () => {
    test('Create contact with most fields and verify created', async ({ page }) => {
        const basePage = new (class extends BasePage { })(page);
        const loginPage = new LoginPage(page);
        const contactsPage = new ContactsPage(page);

        const unique = Date.now();
        const firstName = `AutoFN${unique}`;
        const lastName = `AutoLN${unique}`;
        const fullName = `${firstName} ${lastName}`;

        // (a) Navigate to login
        await basePage.navigateTo(config.baseUrl);

        // (b) Login (steps 1-3)
        await loginPage.fillUsername("getByRole('textbox', { name: 'Username' })", config.credentials.username);
        await loginPage.fillPassword("getByRole('textbox', { name: 'Password' })", config.credentials.password);
        await loginPage.clickLogin("getByRole('button', { name: 'Login' })");

        // (c) Open Contacts and click Create (steps 4-5)
        await contactsPage.openContacts(
            "a[href*='contacts'], a[href='/contacts'], nav a:contains('Contacts'), .nav-link:contains('Contacts'), [role='menuitem']:contains('Contacts')"
        );
        await contactsPage.clickCreateContact(
            "button:contains('Create'), .btn:contains('Create'), [data-testid*='create'], .create-btn, button:contains('New'), .btn:contains('New Contact'), .add-contact-btn, .new-contact-btn"
        );

        // (d) Fill contact fields (steps 6-15)
        await contactsPage.fillFirstName("getByRole('textbox', { name: 'First Name' })", firstName);
        await contactsPage.fillLastName("getByRole('textbox', { name: 'Last Name' })", lastName);
        await contactsPage.fillCompany("getByRole('textbox', { name: 'Company' })", `AutoCompany${unique}`);
        await contactsPage.fillEmail("[placeholder=\"Email address\"]", `auto.${unique}@example.com`);
        await contactsPage.fillPhoneNumber("getByRole('textbox', { name: 'Phone Number' })", `555${unique.toString().slice(-7)}`);
        await contactsPage.fillAddress(
            "input[name='address'], input[placeholder*='address' i], input[id*='address' i], textarea[name='address'], textarea[placeholder*='address' i]",
            `123 Test Street ${unique}`
        );
        await contactsPage.fillCity("getByRole('textbox', { name: 'City' })", 'Test City');
        await contactsPage.fillState("getByRole('textbox', { name: 'State' })", 'Test State');
        await contactsPage.fillZipCode("getByRole('textbox', { name: 'Zip Code' })", '12345');
        await contactsPage.fillCountry("getByRole('textbox', { name: 'Country' })", 'Test Country');

        // (e) Save (step 16)
        await contactsPage.clickSaveContact("button[type='submit'], input[type='submit'], button:contains('Save'), .ui.button:contains('Save')");

        // (f) Verify created
        await expect(page).toHaveURL(/contacts/i);

        const nameCandidate = page.getByText(fullName, { exact: false });
        // TODO: Replace with a stable details header locator once identified in the AUT.
        await expect(nameCandidate.first()).toBeVisible();
    });
});
