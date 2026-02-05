import { test, describe, expect, beforeAll } from '@fixtures';
import { getArticle, getUser, Article, User } from '@utils';

describe('Create Article', () => {
  let user: User;
  let article: Article;
  let token: string;

  beforeAll(async ({ apiUtils }) => {
    user = getUser('createArticle');
    article = getArticle('createArticle');
    await apiUtils.registerUser(user);
    token = await apiUtils.getAuthToken(user.email, user.password);
  });

  test('Should be able to create an article', async ({ createBrowserBot }) => {
    const browserBot = await createBrowserBot(token);
    await browserBot.articlePage.createArticle(article.title, article.description, article.body, article.tags);
    await browserBot.profilePage.navigateTo();
    await expect(browserBot.profilePage.getArticles()).resolves.toContainEqual({
      title: article.title,
      description: article.description,
      author: user.username,
      favoritesCount: 0,
    });
  });
});
