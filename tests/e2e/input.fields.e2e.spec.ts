import { test, expect } from "@playwright/test";
test.describe('Input field tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('input-fields');
  });

  test('can type a movie name', async ({ page }) => {
    const movieName = 'Lord Of The Rings';
    await page.getByTestId('input-movie-name').fill(movieName);
    await page.getByTestId('btn-submit-movie').click();
    await expect(page.getByTestId('result-s01')).toContainText(movieName);
  });

  test('can append text', async ({ page }) => {
    const appendText = 'Ultron';
    const appendInput = page.getByTestId('input-append');
    await appendInput.click();
    await page.keyboard.type(appendText);
    await appendInput.press('Tab');
    await expect(page.getByTestId('result-s02')).toContainText(appendText);
  });

  test('can read the field value', async ({ page }) => {
    const value = await page.getByTestId('input-read-value').inputValue();
    await page.getByTestId('btn-read-value').click();
    await expect(page.getByTestId('result-s03')).toContainText(value);
  });

  test('can clear the field', async ({ page }) => {
    await page.getByTestId('input-clear').clear();
    await expect(page.getByTestId('input-clear')).toHaveValue('');
  });

  test('input field is disabled', async ({ page }) => {
    await expect(page.getByTestId('input-disabled')).toBeDisabled();
  });

  test('input field is read-only', async ({ page }) => {
    await expect(page.getByTestId('input-readonly')).toHaveAttribute('readonly');
  });

});
