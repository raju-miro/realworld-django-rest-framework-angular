import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract navigateTo(url: string): Promise<void>;
  abstract waitUntilPageIsLoaded(timeout: number): Promise<void>;

  async refreshPage(): Promise<void> {
    await this.page.reload();
  }

  protected async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', ...(timeout && { timeout }) });
  }

  protected async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', ...(timeout && { timeout }) });
  }

  protected async waitForDetached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'detached', ...(timeout && { timeout }) });
  }

  protected async waitForAttached(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'attached', ...(timeout && { timeout }) });
  }
}
