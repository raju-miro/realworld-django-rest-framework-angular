import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class SignInPage extends BasePage {
  readonly url = '/#/login';

  readonly emailInput: Locator = this.page.getByPlaceholder('Email');
  readonly passwordInput: Locator = this.page.getByPlaceholder('Password');
  readonly submitButton: Locator = this.page.getByRole('button', { name: 'Sign in' });
  readonly errorMessage: Locator = this.page.locator('.error-messages').first();

  async navigateTo(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitUntilPageIsLoaded(timeout?: number): Promise<void> {
    await this.waitForVisible(this.submitButton, timeout);
  }

  async signin(email: string, password: string): Promise<void> {
    await this.waitUntilPageIsLoaded();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click({ force: true });
  }
}
