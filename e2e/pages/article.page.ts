import { expect, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ArticlePage extends BasePage {
  readonly url = '/#/editor';

  readonly titleInput: Locator = this.page.getByPlaceholder('Article Title');
  readonly descriptionInput: Locator = this.page.getByPlaceholder("What's this article about?");
  readonly bodyInput: Locator = this.page.getByPlaceholder('Write your article (in markdown)');
  readonly tagInput: Locator = this.page.getByPlaceholder('Enter tags');
  readonly submitButton: Locator = this.page.getByRole('button', { name: 'Publish Article' });
  readonly commentInput: Locator = this.page.getByPlaceholder('Write a comment...');
  readonly commentSubmitButton: Locator = this.page.getByRole('button', { name: 'Post Comment' });
  readonly commentBody: Locator = this.page.locator('.card-text');
  readonly commentCard: Locator = this.page.locator('.card');
  readonly successMessage: Locator = this.page.locator('.success-messages');
  readonly editArticleButton: Locator = this.page.getByRole('button', { name: 'Edit Article' }).first();
  readonly deleteArticleButton: Locator = this.page.getByRole('button', { name: 'Delete Article' }).first();

  async navigateTo(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitUntilPageIsLoaded(timeout?: number): Promise<void> {
    await this.waitForVisible(this.submitButton, timeout);
  }

  async createArticle(title: string, description: string, body: string, tags: string[]): Promise<void> {
    await this.navigateTo();
    await this.waitUntilPageIsLoaded();
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.bodyInput.fill(body);
    for (const tag of tags) {
      await this.tagInput.fill(tag);
      await this.tagInput.dispatchEvent('change');
    }
    await this.waitForVisible(this.submitButton);
    await this.submitButton.click();
    await this.waitForVisible(this.successMessage);
  }

  async openArticleBySlug(slug: string): Promise<void> {
    await this.page.goto(`#/article/${slug}`);
    await this.waitForVisible(this.commentInput);
  }

  async addComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
    await expect(this.commentInput).toHaveValue(comment);
    const responsePromise = this.page.waitForResponse(
      (resp) => resp.url().includes('/comments') && resp.request().method() === 'POST',
    );
    await this.commentSubmitButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    await this.waitForVisible(this.commentBody.filter({ hasText: comment }), 30000);
  }

  async deleteComment(comment: string): Promise<void> {
    const targetCommentCard = this.commentCard.filter({ hasText: comment });
    await this.waitForVisible(targetCommentCard);
    await targetCommentCard.locator('.mod-options .ion-trash-a').click({ force: true });
    await this.waitForDetached(targetCommentCard);
  }

  async clickEditArticle(): Promise<void> {
    await this.editArticleButton.click();
    await this.waitForVisible(this.titleInput);
    await expect(this.titleInput).not.toHaveValue('');
  }

  async updateArticle(title: string, description: string, body: string): Promise<void> {
    await this.titleInput.fill(title);
    await expect(this.titleInput).toHaveValue(title);
    await this.descriptionInput.fill(description);
    await expect(this.descriptionInput).toHaveValue(description);
    await this.bodyInput.fill(body);
    await expect(this.bodyInput).toHaveValue(body);
    await this.submitButton.click({ force: true });
    await this.waitForVisible(this.successMessage);
  }

  async deleteArticle(): Promise<void> {
    await this.deleteArticleButton.click();
    await this.page.waitForURL(/#\/$|#\/$/);
  }
}
