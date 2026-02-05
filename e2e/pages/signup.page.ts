import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class SignupPage extends BasePage {
  readonly url = '/register';

  readonly usernameInput: Locator = this.page.getByPlaceholder('Username');
  readonly emailInput: Locator = this.page.getByPlaceholder('Email');
  readonly passwordInput: Locator = this.page.getByPlaceholder('Password');
  readonly submitButton: Locator = this.page.getByRole('button', { name: 'Sign up' });
  readonly successMessage: Locator = this.page.locator('.success-messages');

  async navigateTo(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitUntilPageIsLoaded(timeout?: number): Promise<void> {
    await this.waitForVisible(this.submitButton, timeout);
  }

  async signup(username: string, email: string, password: string): Promise<void> {
    await this.waitUntilPageIsLoaded();
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click({ force: true });
    await this.waitForVisible(this.successMessage);
  }
}
