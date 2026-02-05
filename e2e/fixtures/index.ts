import { test as base, BrowserContext, expect, Page } from '@playwright/test';
import { HomePage, SignupPage, SignInPage, FeedPage, ArticlePage, ProfilePage } from '@pages';
import { AuthUtils, ApiUtils } from '@utils';

export interface BrowserBot {
  browserContext: BrowserContext;
  page: Page;
  homePage: HomePage;
  signupPage: SignupPage;
  signinPage: SignInPage;
  feedPage: FeedPage;
  articlePage: ArticlePage;
  profilePage: ProfilePage;
  authUtils: AuthUtils;
}

export type BrowserBotFactory = (token?: string) => Promise<BrowserBot>;

export const test = base.extend<{
  createBrowserBot: BrowserBotFactory;
  apiUtils: ApiUtils;
}>({
  // eslint-disable-next-line no-empty-pattern
  apiUtils: async ({}, use) => {
    await use(new ApiUtils());
  },

  createBrowserBot: async ({ browser }, use) => {
    const bots: BrowserBot[] = [];

    const factory: BrowserBotFactory = async (token?: string) => {
      const browserContext = await browser.newContext();
      const page = await browserContext.newPage();

      const bot: BrowserBot = {
        browserContext,
        page,
        homePage: new HomePage(page),
        signupPage: new SignupPage(page),
        signinPage: new SignInPage(page),
        feedPage: new FeedPage(page),
        articlePage: new ArticlePage(page),
        profilePage: new ProfilePage(page),
        authUtils: new AuthUtils(page),
      };

      if (token) {
        await bot.homePage.navigateTo();
        await bot.authUtils.setAuthToken(token);
      }

      bots.push(bot);
      return bot;
    };

    await use(factory);

    for (const bot of bots) {
      await bot.browserContext.close();
    }
  },
});

// For better readability
export { expect };
export const describe = test.describe;
export const beforeAll = test.beforeAll;
export const beforeEach = test.beforeEach;
export const afterAll = test.afterAll;
export const afterEach = test.afterEach;
