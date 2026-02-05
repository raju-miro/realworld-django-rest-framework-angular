import { test, describe, beforeAll, expect } from '@fixtures';
import { getArticle, getUser, Article, User } from '@utils';

describe('Comments', () => {
  let user: User;
  let article: Article;
  let token: string;
  let articleSlug: string;

  beforeAll(async ({ apiUtils }) => {
    user = getUser('commentUser');
    article = getArticle('commentArticle');
    await apiUtils.registerUser(user);
    token = await apiUtils.getAuthToken(user.email, user.password);
    const createdArticle = await apiUtils.createArticle(article, token);
    articleSlug = createdArticle.slug!;
  });

  test('Should be able to add and delete a comment to an article', async ({ createBrowserBot }) => {
    const browserBot = await createBrowserBot(token);
    await browserBot.articlePage.openArticleBySlug(articleSlug);
    await browserBot.articlePage.addComment(article.title, 'Test Comment');
    await browserBot.articlePage.deleteComment('Test Comment');
    await expect(browserBot.articlePage.commentBody).toHaveCount(0);
  });
});
