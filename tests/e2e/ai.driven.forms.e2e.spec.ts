import { test, expect, type Page } from '@playwright/test';

/*
    I was using agentic ai driven automation for this suite.

    I ask an agent to parse the webpage contents, generate tests based on context
    of a product and it's behavior. Current page is just a practice page and it
    has built-in test cases page to generate from.
    It might be different with production projects, where you have to be more
    verbose and precise with your commands to ai agent.
    It taken 12m 40s to write these tests

    Input tokens 4.2m
    Cached Input tokens 4.1m
    Output tokens 29k
    Credits 6.7
    Gpt-6-Luna

    It's relatively cheap and fast. But Ai makes mistakes that need to be double-checked.
    I deliberetly leave it as is to show how Ai errors out and goes out the way to write bad tests.
    Validate the code. We are not vibe-testers.
*/

async function fillValidPersonalDetails(page: Page, phone = '9876543210') {
  const firstName = page.getByTestId('input-first-name');
  const lastName = page.getByTestId('input-last-name');
  const phoneInput = page.getByTestId('input-phone');
  const dateOfBirth = page.getByTestId('input-dob');

  await lastName.fill('Doe');
  await expect(lastName).toHaveValue('Doe');
  await lastName.blur();
  await phoneInput.fill(phone);
  await expect(phoneInput).toHaveValue(phone);
  await phoneInput.blur();
  await dateOfBirth.fill('1995-06-15');
  await expect(dateOfBirth).toHaveValue('1995-06-15');
  await dateOfBirth.blur();
  await page.getByTestId('radio-gender-male').check();
  await firstName.pressSequentially('John');
  await expect(firstName).toHaveValue('John');

  /*Ai forgot to fill in the Address form, why?*/

}

async function fillAccountCredentials(page: Page, password: string, confirmation = password) {
  const passwordInput = page.getByTestId('input-password');
  const confirmationInput = page.getByTestId('input-confirm-password');

  await passwordInput.pressSequentially(password);
  await expect(passwordInput).toHaveValue(password);
  await passwordInput.blur();
  await confirmationInput.pressSequentially(confirmation);
  await expect(confirmationInput).toHaveValue(confirmation);
  await confirmationInput.blur();
}

test.describe('Forms practice page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('forms');
  });

  test('submits valid personal details successfully', async ({ page }) => {
    await fillValidPersonalDetails(page);
    await page.getByTestId('btn-personal-submit').click();

    /*
    Ai hardcodes expected values, my best suggestion is to regex,
    but in current case I guess it's ok.
    */
    await expect(page.getByRole('status')).toHaveText('Saved: John Doe');
  });

  test('shows errors for every required personal detail on empty submit', async ({ page }) => {
    await page.getByTestId('btn-personal-submit').click();

    await expect(page.getByTestId('error-first-name')).toHaveText('First name is required.');
    await expect(page.getByTestId('error-last-name')).toHaveText('Last name is required.');
    await expect(page.getByTestId('error-phone')).toHaveText('Phone is required.');
    await expect(page.getByTestId('error-dob')).toHaveText('Date of birth is required.');
    await expect(page.getByTestId('error-gender')).toHaveText('Please select your gender.');
  });

  test('rejects an invalid email address in the login form', async ({ page }) => {
    const email = page.getByTestId('input-login-email');
    await email.pressSequentially('not-an-email');
    await expect(email).toHaveValue('not-an-email');
    await email.blur();
    await page.locator('#login-password').fill('Pass123');
    await page.getByTestId('btn-login-submit').click();

    await expect(page.getByTestId('error-login-email')).toHaveText('Enter a valid email address.');
  });

  test('rejects a phone number that is not 10 digits', async ({ page }) => {
    await fillValidPersonalDetails(page, '123');
    await page.getByTestId('btn-personal-submit').click();

    await expect(page.getByTestId('error-phone')).toHaveText('Phone must be exactly 10 digits.');
  });

  test('rejects a password shorter than six characters', async ({ page }) => {
    await fillAccountCredentials(page, 'abc');
    await page.getByTestId('checkbox-terms').check();
    await page.getByTestId('submit-form-btn').click();

    await expect(page.getByTestId('error-password')).toHaveText('Password must be at least 6 characters.');
  });

  test('shows an error when account passwords do not match', async ({ page }) => {
    await fillAccountCredentials(page, 'StrongPass123', 'DifferentPass123');
    await page.getByTestId('checkbox-terms').check();
    await page.getByTestId('submit-form-btn').click();

    await expect(page.getByTestId('error-confirm-password')).toHaveText('Passwords do not match.');
  });

  test('requires accepting the terms and conditions', async ({ page }) => {
    await fillAccountCredentials(page, 'StrongPass123');
    await page.getByTestId('submit-form-btn').click();

    await expect(page.getByText('You must accept the Terms & Conditions.')).toBeVisible();
  });

  test('includes the submitted first name in the success message', async ({ page }) => {
    await fillValidPersonalDetails(page);
    await page.getByTestId('btn-personal-submit').click();

    await expect(page.getByRole('status')).toContainText('John');
  });

  test('reset buttons clear their respective form fields', async ({ page }) => {
    /*
      This is the best one yet. Test case asked to test reset button on any form,
      verifying fields to be empty, but it thought it have to reset all the forms on the
      page.
    */
    await page.getByTestId('input-login-email').fill('maya@example.com');
    await page.locator('#login-password').fill('Pass123');
    await page.getByTestId('btn-login-reset').click();
    await expect(page.getByTestId('input-login-email')).toHaveValue('');
    await expect(page.locator('#login-password')).toHaveValue('');

    await fillValidPersonalDetails(page);
    await page.getByTestId('btn-personal-reset').click();
    await expect(page.getByTestId('input-first-name')).toHaveValue('');
    await expect(page.getByTestId('input-last-name')).toHaveValue('');
    await expect(page.getByTestId('input-phone')).toHaveValue('');
    await expect(page.getByTestId('input-dob')).toHaveValue('');
    await expect(page.getByTestId('radio-gender-female')).not.toBeChecked();

    await page.getByTestId('select-country').selectOption('CA');
    await page.getByTestId('input-city').fill('Toronto');
    await page.getByLabel(/About You/).fill('QA engineer');
    await page.getByTestId('btn-address-reset').click();
    await expect(page.getByTestId('select-country')).toHaveValue('');
    await expect(page.getByTestId('input-city')).toHaveValue('');
    await expect(page.getByLabel(/About You/)).toHaveValue('');

    await page.getByTestId('checkbox-interest-selenium').check();
    await page.getByTestId('checkbox-interest-playwright').check();
    await page.getByTestId('btn-interests-reset').click();
    await expect(page.getByTestId('checkbox-interest-selenium')).not.toBeChecked();
    await expect(page.getByTestId('checkbox-interest-playwright')).not.toBeChecked();

    await fillAccountCredentials(page, 'StrongPass123');
    await page.getByTestId('checkbox-terms').check();
    await page.getByTestId('reset-form-btn').click();
    await expect(page.getByTestId('input-password')).toHaveValue('');
    await expect(page.getByTestId('input-confirm-password')).toHaveValue('');
    await expect(page.getByTestId('checkbox-terms')).not.toBeChecked();
  });

  test('allows only one gender radio button to be selected', async ({ page }) => {
    const male = page.getByTestId('radio-gender-male');
    const female = page.getByTestId('radio-gender-female');
    const other = page.getByTestId('radio-gender-other');

    await male.check();
    await expect(male).toBeChecked();
    await expect(female).not.toBeChecked();
    await expect(other).not.toBeChecked();

    /*
      Test case asked to check only female radio button and assert others are not checked
      But ai went out the way and added this too.
    */
    await other.check();
    await expect(other).toBeChecked();
    await expect(male).not.toBeChecked();
  });

  test('reflects the selected country in the dropdown', async ({ page }) => {
    await page.getByTestId('select-country').selectOption('CA');
    await expect(page.getByTestId('select-country')).toHaveValue('CA');
  });

  test('allows multiple interest checkboxes to be selected independently', async ({ page }) => {
    const selenium = page.getByTestId('checkbox-interest-selenium');
    const playwright = page.getByTestId('checkbox-interest-playwright');
    const cypress = page.getByTestId('checkbox-interest-cypress');

    await selenium.check();
    await playwright.check();
    await expect(selenium).toBeChecked();
    await expect(playwright).toBeChecked();
    await expect(cypress).not.toBeChecked();

    /*
      ai mistakes again. The test case states to check only selenium, playwright and verify cypress is not checked
      but it also writes this for no reason.
    */
    await cypress.check();
    await expect(cypress).toBeChecked();
  });

  test('retains entered personal values after validation fails', async ({ page }) => {
    await fillValidPersonalDetails(page, '123');
    await page.getByTestId('btn-personal-submit').click();

    await expect(page.getByTestId('error-phone')).toBeVisible();
    await expect(page.getByTestId('input-first-name')).toHaveValue('John');
    await expect(page.getByTestId('input-last-name')).toHaveValue('Doe');
    await expect(page.getByTestId('input-phone')).toHaveValue('123');
    await expect(page.getByTestId('input-dob')).toHaveValue('1995-06-15');
    await expect(page.getByTestId('radio-gender-male')).toBeChecked();
  });

  test('Fill Again returns the successful account flow to an empty form', async ({ page }) => {
    await fillAccountCredentials(page, 'StrongPass123');
    await page.getByTestId('checkbox-terms').check();
    await page.getByTestId('submit-form-btn').click();

    await expect(page.getByTestId('form-success-msg')).toContainText('Account Setup Complete!');
    await page.getByRole('button', { name: 'Fill Again' }).click();

    await expect(page.getByTestId('input-password')).toBeVisible();
    await expect(page.getByTestId('input-password')).toHaveValue('');
    await expect(page.getByTestId('input-confirm-password')).toHaveValue('');
    await expect(page.getByTestId('checkbox-terms')).not.toBeChecked();
  });

  test('loads all forms without uncaught JavaScript errors', async ({ page }) => {
    /*
      Test asked to check console for errors but it went for page errors instead
      Instead of checking the [data-testid='registration-form'] it went out it's way
      to validate different fields.
    */
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      if (!error.message.includes('/cdn-cgi/rum?')) {
        pageErrors.push(error.message);
      }
    });
    await page.reload();

    const controls = [
      page.getByTestId('input-login-email'),
      page.locator('#login-password'),
      page.getByTestId('input-first-name'),
      page.getByTestId('input-last-name'),
      page.getByTestId('input-phone'),
      page.getByTestId('input-dob'),
      page.getByTestId('select-country'),
      page.getByTestId('input-city'),
      page.getByTestId('checkbox-interest-selenium'),
      page.getByTestId('input-password'),
      page.getByTestId('input-confirm-password'),
      page.getByTestId('checkbox-terms'),
    ];

    for (const control of controls) {
      await expect(control).toBeVisible();
      await expect(control).toBeEnabled();
    }

    expect(pageErrors).toEqual([]);
  });
});
