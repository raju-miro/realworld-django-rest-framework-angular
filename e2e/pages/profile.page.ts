import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export interface ArticlePreview {
  title: string;
  description: string;
  author: string;
  favoritesCount: number;
}

export class ProfilePage extends BasePage {
  readonly url = '/#/my-profile';

  readonly articlesPreview: Locator = this.page.locator('.article-preview');
  readonly articleTitle: Locator = this.page.locator('.preview-link h1');
  readonly articlesLoaded: Locator = this.page.locator('.article-preview:not(:has-text("Loading"))');
  readonly followButton: Locator = this.page.getByRole('button', { name: 'Follow' });
  readonly unfollowButton: Locator = this.page.getByRole('button', { name: 'Unfollow' });
  readonly userInfo: Locator = this.page.locator('.user-info');

  async navigateTo(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitUntilPageIsLoaded();
  }

  async navigateToUser(username: string): Promise<void> {
    await this.page.goto(`/#/profile/${username}`);
    await this.waitUntilPageIsLoaded();
  }

  async waitUntilPageIsLoaded(timeout?: number): Promise<void> {
    await this.waitForVisible(this.userInfo, timeout);
  }

  async followUser(): Promise<void> {
    await this.waitUntilPageIsLoaded();
    await this.followButton.click();
    await this.waitForVisible(this.unfollowButton);
  }

  async waitForArticleWithTitle(title: string, timeout?: number): Promise<void> {
    await this.waitForVisible(this.articleTitle.filter({ hasText: title }), timeout);
  }

  async getArticles(): Promise<ArticlePreview[]> {
    await this.waitUntilPageIsLoaded();
    await this.waitForVisible(this.articlesLoaded);

    const articles = await this.articlesPreview.all();
    const articlePreviews: ArticlePreview[] = [];
    for (const article of articles) {
      const text = await article.textContent();
      if (text?.includes('No articles are here')) {
        continue;
      }
      const favButtonText = (await article.locator('.btn-outline-primary').textContent()) || '0';
      const favCount = parseInt(favButtonText.trim()) || 0;
      articlePreviews.push({
        title: (await article.locator('.preview-link h1').textContent()) || '',
        description: (await article.locator('.preview-link p').textContent()) || '',
        author: (await article.locator('.info .author').textContent()) || '',
        favoritesCount: favCount,
      });
    }
    return articlePreviews;
  }
}
