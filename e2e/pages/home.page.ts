import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly url = '/';

  readonly signUpLink: Locator = this.page.getByRole('link', { name: 'Sign up' });

  async navigateTo(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitUntilPageIsLoaded(timeout?: number): Promise<void> {
    await this.waitForVisible(this.signUpLink, timeout);
  }

  async clickSignUpLink(): Promise<void> {
    await this.navigateTo();
    await this.waitUntilPageIsLoaded();
    await this.signUpLink.click();
  }
}
