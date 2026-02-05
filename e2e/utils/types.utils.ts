/**
 * Common types for the e2e tests.
 */
export interface User {
  username: string;
  email: string;
  password: string;
}

export interface Article {
  title: string;
  description: string;
  body: string;
  tags: string[];
  slug?: string;
}
