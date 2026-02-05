import { Page } from '@playwright/test';

export class AuthUtils {
  constructor(private page: Page) {}

  /**
   * Sets the auth token in the localStorage and reloads the page.
   * @param token - The auth token.
   */
  async setAuthToken(token: string): Promise<void> {
    await this.page.evaluate((token: string) => {
      localStorage.setItem('token', token);
    }, token);
    await this.page.reload();
  }
}
