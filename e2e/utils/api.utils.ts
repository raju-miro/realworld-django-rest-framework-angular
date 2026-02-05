import { Article, User } from './types.utils';

export class ApiUtils {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.API_URL || 'http://localhost:8000/api/';
  }

  /**
   * Makes API requests with retry logic for 5xx errors.
   * @param method - The HTTP method.
   * @param url - The URL of the request.
   * @param body - The body of the request.
   * @param token - The auth token.
   * @param retries - The number of retries.
   * @returns The response body.
   */
  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    token?: string,
    retries: number = 5,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (response.ok) {
        const text = await response.text();
        return text ? JSON.parse(text) : ({} as T);
      }

      if (response.status >= 500 && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        continue;
      }

      const responseBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${responseBody}`);
    }

    throw new Error('Unreachable');
  }

  /**
   * Registers a user through the API.
   * @param user - The user to register.
   * @returns The registered user.
   */
  async registerUser(user: User): Promise<User> {
    const response = await this.request<{ user: User }>('POST', 'users', {
      user,
    });
    return response.user;
  }

  /**
   * Gets the auth token for a user through the API.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns The auth token.
   */
  async getAuthToken(email: string, password: string): Promise<string> {
    const response = await this.request<{ user: { token: string } }>('POST', 'users/login', {
      user: {
        email,
        password,
      },
    });
    return response.user.token;
  }

  /**
   * Creates an article through the API.
   * @param article - The article to create.
   * @param token - The auth token.
   * @returns The created article.
   */
  async createArticle(article: Article, token: string): Promise<Article> {
    const response = await this.request<{ article: Article }>(
      'POST',
      'articles',
      {
        article: {
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tags,
        },
      },
      token,
    );
    return response.article;
  }
}
