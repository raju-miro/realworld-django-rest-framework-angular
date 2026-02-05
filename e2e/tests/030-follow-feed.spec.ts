import { beforeAll, describe, expect, test } from '@fixtures';
import { getArticle, getUser, Article, User } from '@utils';

describe('Follow Feed', () => {
  let userA: User;
  let userB: User;
  let article: Article;
  let tokenA: string;
  let tokenB: string;

  beforeAll(async ({ apiUtils }) => {
    userA = getUser('followerUser');
    userB = getUser('followedUser');
    article = getArticle('followFeedArticle');
    await apiUtils.registerUser(userA);
    await apiUtils.registerUser(userB);

    tokenA = await apiUtils.getAuthToken(userA.email, userA.password);
    tokenB = await apiUtils.getAuthToken(userB.email, userB.password);
  });

  test('User A should see User B article in feed after following', async ({ createBrowserBot, apiUtils }) => {
    const browserBotA = await createBrowserBot(tokenA);

    await browserBotA.profilePage.navigateToUser(userB.username);
    await browserBotA.profilePage.followUser();

    await apiUtils.createArticle(article, tokenB);

    await browserBotA.feedPage.navigateTo();
    await browserBotA.feedPage.clickMyFeedTab();

    const feedArticles = await browserBotA.feedPage.getArticles();

    expect(feedArticles).toContainEqual(
      expect.objectContaining({
        title: article.title,
        description: article.description,
        author: userB.username,
      }),
    );
  });
});
