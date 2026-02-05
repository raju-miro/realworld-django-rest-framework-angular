import { test, describe, expect, beforeAll } from '@fixtures';
import { getArticle, getUser, Article, User } from '@utils';

describe('Update Article', () => {
  let user: User;
  let article: Article;
  let updatedArticle: Article;
  let token: string;
  let articleSlug: string;

  beforeAll(async ({ apiUtils }) => {
    user = getUser('modifyArticleUser');
    article = getArticle('modifyArticleOriginal');
    updatedArticle = getArticle('modifyArticleUpdated');
    await apiUtils.registerUser(user);
    token = await apiUtils.getAuthToken(user.email, user.password);
    const createdArticle = await apiUtils.createArticle(article, token);
    articleSlug = createdArticle.slug!;
  });

  test('Should be able to update an article', async ({ createBrowserBot }) => {
    const browserBot = await createBrowserBot(token);

    await browserBot.articlePage.openArticleBySlug(articleSlug);
    await browserBot.articlePage.clickEditArticle();

    await browserBot.articlePage.updateArticle(updatedArticle.title, updatedArticle.description, updatedArticle.body);

    await browserBot.profilePage.navigateToUser(user.username);
    await browserBot.profilePage.waitForArticleWithTitle(updatedArticle.title);
    const articles = await browserBot.profilePage.getArticles();

    expect(articles).toContainEqual({
      title: updatedArticle.title,
      description: updatedArticle.description,
      author: user.username,
      favoritesCount: 0,
    });

    const oldArticleTitles = articles.map((a) => a.title);
    expect(oldArticleTitles).not.toContain(article.title);
  });
});

describe('Delete Article', () => {
  let user: User;
  let deleteArticle: Article;
  let token: string;
  let articleSlug: string;

  beforeAll(async ({ apiUtils }) => {
    user = getUser('modifyArticleUser');
    deleteArticle = getArticle('deleteArticle');
    await apiUtils.registerUser(user);
    token = await apiUtils.getAuthToken(user.email, user.password);
    const createdArticle = await apiUtils.createArticle(deleteArticle, token);
    articleSlug = createdArticle.slug!;
  });

  test('Should be able to delete an article', async ({ createBrowserBot }) => {
    const browserBot = await createBrowserBot(token);

    await browserBot.articlePage.openArticleBySlug(articleSlug);
    await browserBot.articlePage.commentInput.waitFor({ state: 'visible' });

    await browserBot.articlePage.deleteArticle();

    await browserBot.profilePage.navigateToUser(user.username);
    const articlesAfter = await browserBot.profilePage.getArticles();

    const articleTitles = articlesAfter.map((a) => a.title);
    expect(articleTitles).not.toContain(deleteArticle.title);
  });
});
