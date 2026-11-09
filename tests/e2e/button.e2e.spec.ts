import { test, expect } from "@playwright/test";

test.describe('Button tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('buttons');
  });

  test('can navigate home', async ({ page }) => {
    await page.getByTestId('btn-navigate-home').click();
    await expect(page.getByTestId('result-s01')).toContainText('Home');
  });

  test('can find xy coordinates of a button', async ({ page }) => {
    var button = page.getByTestId('btn-get-coordinates');
    await button.click();
    const buttonBox = await button.boundingBox();
    if (!buttonBox) throw new Error('Button bounding box is unavailable');

    const x = Math.round(buttonBox.x);
    const y = Math.round(buttonBox.y);

    await expect(page.getByTestId('result-s02')).toHaveText(
      new RegExp(`^X: ${x}px, Y: ${y}px$`)
    );
  });

  test('can get a button color', async ({ page }) => {
    await expect(page.getByTestId('btn-get-color')).toHaveCSS('background-color', 'rgb(245, 243, 255)');
    await expect(page.getByTestId('btn-get-color')).toHaveCSS('color', 'rgb(109, 40, 217)');
  });

  test('gets h & w of the buuton', async ({ page }) => {
    var button = page.getByTestId('btn-get-size');
    await button.click()
    const buttonBox = await button.boundingBox();
    if (!buttonBox) throw new Error('Button bounding box is unavailable');
    const h = Math.floor(buttonBox.height);
    const w = Math.floor(buttonBox.width);

    await expect(page.getByTestId('result-s04')).toHaveText(new RegExp(`^W: ${w}px, H: ${h}px$`));
  });

  test('the button is disabled', async ({ page }) => {
    await expect(page.getByTestId('btn-disabled')).toBeDisabled();
  });

  test('can hold button for 1.5 sec', async ({ page }) => {
    await page.getByTestId('btn-click-hold').hover();
    await page.mouse.down();
    await page.waitForTimeout(1500);
    await page.mouse.up();
    await expect(page.getByTestId('result-s06')).toHaveText('Held for 1.5s');
  });

  test('can double click a button', async ({ page }) => {
    await page.getByTestId('btn-double-click').dblclick();
    await expect(page.getByTestId('result-s07')).toHaveText('Double clicked!');
  });

  test('can right click a button', async ({ page }) => {
    await page.getByTestId('btn-right-click').click({ button: 'right' });
    await expect(page.getByTestId('result-s08')).toHaveText('Context menu triggered!');
  })
});
