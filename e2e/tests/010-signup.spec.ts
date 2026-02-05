import { test, describe, expect } from '@fixtures';
import { getUser } from '@utils';

describe('Signup', () => {
  test('Should be able to sign up successfully', async ({ createBrowserBot }) => {
    const user = getUser('signUp');
    const browserBot = await createBrowserBot();
    await browserBot.homePage.clickSignUpLink();
    await browserBot.signupPage.signup(user.username, user.email, user.password);
    await expect(browserBot.signupPage.successMessage).toBeVisible();
  });
});
