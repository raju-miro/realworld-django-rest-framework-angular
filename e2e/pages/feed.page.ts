import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ArticlePreview } from './profile.page';

export class FeedPage extends BasePage {
  readonly url = '/#/';

  readonly newArticleButton: Locator = this.page.getByRole('link', { name: 'New Article' });
  readonly feedToggle: Locator = this.page.locator('.feed-toggle');
  readonly myFeedTab: Locator = this.page.locator('.nav-link', { hasText: 'My Feed' });
  readonly articlesPreview: Locator = this.page.locator('.article-preview');
  readonly loadingIndicator: Locator = this.page.getByText('Loading articles...');
  readonly noArticlesMessage: Locator = this.page.getByText('No articles are here... yet.');

  async navigateTo(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitUntilPageIsLoaded(timeout?: number): Promise<void> {
    await this.waitForVisible(this.feedToggle, timeout);
  }

  async clickMyFeedTab(): Promise<void> {
    await this.waitUntilPageIsLoaded();
    await this.myFeedTab.click();
    await expect(this.myFeedTab).toHaveClass(/active/);
  }

  async waitForArticlesLoaded(timeout?: number): Promise<void> {
    await expect(this.loadingIndicator).not.toBeVisible(timeout ? { timeout } : undefined);
  }

  async getArticles(): Promise<ArticlePreview[]> {
    await this.waitForArticlesLoaded();

    const noArticles = await this.noArticlesMessage.isVisible();
    if (noArticles) {
      return [];
    }

    const articles = await this.articlesPreview.all();
    const articlePreviews: ArticlePreview[] = [];

    for (const article of articles) {
      const text = await article.textContent();
      if (text?.includes('Loading') || text?.includes('No articles')) {
        continue;
      }

      const favButtonText = (await article.locator('.btn-outline-primary').textContent()) || '0';
      const favCount = parseInt(favButtonText.trim()) || 0;
      articlePreviews.push({
        title: (await article.locator('.preview-link h1').textContent()) || '',
        description: (await article.locator('.preview-link p').textContent()) || '',
        author: (await article.locator('.author').textContent()) || '',
        favoritesCount: favCount,
      });
    }
    return articlePreviews;
  }
}
