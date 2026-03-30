import { test, expect } from '@test-setup/fixtures';
import { ENV } from '@config/env';
import { CogmentoLoginPage } from '@/pages/cogmento-login.page';
import { ContactsPage } from '@/pages/contacts.page';
import { ContactCreatePage } from '@/pages/contact-create.page';

test.describe('Cogmento - Create Contact', () => {
    test('Login → Contacts → Create Contact form → fill most fields → verify (limited)', async ({ page }) => {
        const loginPage = new CogmentoLoginPage(page);
        const contactsPage = new ContactsPage(page);
        const contactCreatePage = new ContactCreatePage(page);

        // (1) Navigate to Cogmento login URL
        await loginPage.navigateTo(ENV.BASE_URL);

        // (2) Login
        const unique = Date.now();
        const username = process.env.COGMENTO_USERNAME ?? process.env.USERNAME ?? '';
        const password = process.env.COGMENTO_PASSWORD ?? process.env.PASSWORD ?? '';

        // NOTE: Credentials must be provided via environment variables.
        expect(username, 'Missing username env var (COGMENTO_USERNAME or USERNAME)').not.toBe('');
        expect(password, 'Missing password env var (COGMENTO_PASSWORD or PASSWORD)').not.toBe('');

        await loginPage.login(username, password);

        // (3) Navigate to Contacts
        await contactsPage.clickContacts();

        // (4) Open Create Contact form
        // NOTE: A Create button locator was not provided in the implementation plan.
        // If the app requires clicking a Create button, implement it in ContactsPage.createContact() once locator is available.
        // For now, we only wait for the create form probe locator to be visible.
        await contactCreatePage.waitForCreateContactForm();

        // (5) Fill most fields with unique data
        const contact = {
            firstName: `AutoFN_${unique}`,
            lastName: `AutoLN_${unique}`,
            company: `AutoCompany_${unique}`,
            email: `auto_${unique}@example.com`,
        };

        await contactCreatePage.fillMostFields(contact);

        // (6) Verify (limited by available locators)
        await contactCreatePage.assertContactFormValues(contact);

        // Additional lightweight verification: URL should reflect contacts/create context.
        // NOTE: This is heuristic and may vary by environment.
        await expect(page).toHaveURL(/contacts/i);

        // IMPORTANT:
        // True "contact is created" verification requires:
        // - Save/Submit button locator
        // - Confirmation locator (toast/message) OR created contact row/details page locator
        // These locators were not provided in the implementation plan, so this test verifies form fill only.
    });
});
