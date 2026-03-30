# Impact analysis note — Cogmento create contact

This repository required the following additions to cover the test case:

**Test case context**
1. Login to Cogmento application
2. Click on Contacts link
3. Click on Create button
4. Create contact with most of the fields
5. Check the contact is created

## Additions introduced (per impact_analysis)

### New page objects
- `src/pages/cogmento-login.page.ts`
  - Purpose: encapsulate login actions (fill username/password, click login, convenience `login()` method).
- `src/pages/contacts.page.ts`
  - Purpose: navigate to Contacts and initiate contact creation.
- `src/pages/contact-create.page.ts`
  - Purpose: fill the create-contact form (most fields), wait for form readiness, and provide basic assertions/debug locator access.

### New spec file (fixtures-based)
- `tests/cogmento-create-contact.spec.ts`
  - Purpose: end-to-end test using the existing Playwright fixtures pattern (`testBase`, `logger`, `allureReporter`) to:
    - login
    - open Contacts
    - click Create
    - fill most contact fields
    - verify the contact creation flow via form/value assertions

## Compatibility / signatures
- No existing exported class names, method signatures, or fixture signatures were changed.
- Only new files were added to implement the required coverage.
