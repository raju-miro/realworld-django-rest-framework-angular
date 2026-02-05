import { test, describe, expect, beforeAll } from '@fixtures';
import { getUser, User } from '@utils';

describe('Signin', () => {
  let user: User;

  beforeAll(async ({ apiUtils }) => {
    user = getUser('signIn');
    await apiUtils.registerUser(user);
  });

  test('Should NOT be able to sign in with invalid credentials', async ({ createBrowserBot }) => {
    const browserBot = await createBrowserBot();
    await browserBot.signinPage.navigateTo();
    await browserBot.signinPage.signin('invalid@example.com', 'invalidpassword');
    await expect(browserBot.signinPage.errorMessage).toBeVisible();
  });

  test('Should be able to sign in with valid credentials', async ({ createBrowserBot }) => {
    const browserBot = await createBrowserBot();
    await browserBot.signinPage.navigateTo();
    await browserBot.signinPage.signin(user.email, user.password);
    await expect(browserBot.feedPage.newArticleButton).toBeVisible();
  });
});
