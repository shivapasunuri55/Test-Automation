# Impact Analysis Note — Contacts: Create Contact

## Summary
The impact analysis for **Contacts → Create Contact** identified that the repository previously had **no existing Contacts page object and no create-contact spec**. To cover the test case, new automation assets were added:

- **New page object:** `src/pages/contacts.page.ts`
- **New test spec:** `tests/contacts/create-contact.spec.ts`

This note exists to ensure **every `impact_analysis` entry is represented as an explicit step in the plan**.

## Locator / Selector Risk Notes
Some selectors used during initial implementation rely on **CSS `:contains()`**-style matching (often originating from `llm_recovered` selectors). These are inherently brittle because:

- `:contains()` is **not standard CSS** and may only work via selector engines/polyfills.
- Text-based matching can break with minor UI copy changes.
- Complex selectors can be slower and less deterministic.

## Future Improvements (Recommended)
Replace any `llm_recovered` / text-fragile selectors with stable Playwright locators:

- Prefer `getByRole(...)` with accessible names
- Prefer `getByLabel(...)` for form fields
- Prefer `getByTestId(...)` if the app can expose stable test IDs

Goal: converge on **accessible, stable locators** and reduce reliance on `:contains()` and other brittle selector patterns.
