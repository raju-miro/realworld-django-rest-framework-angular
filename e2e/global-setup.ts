import * as dotenv from 'dotenv';
import { waitUntilServiceIsReady } from '@utils';

dotenv.config({ quiet: true });

/**
 * Global setup for the e2e tests.
 * It waits for the frontend and backend to be ready.
 * It throws an error if the frontend or backend is not ready.
 */

async function globalSetup(): Promise<void> {
  const baseUrl = process.env.BASE_URL || 'http://localhost:4200';
  const apiUrl = process.env.API_URL || 'http://localhost:8000/api/';

  const frontendReady = await waitUntilServiceIsReady(baseUrl, 30, 2000);
  if (!frontendReady) {
    console.error(`Frontend is not available. Expected URL: ${baseUrl}`);
    throw new Error('Frontend is not available');
  }

  const backendReady = await waitUntilServiceIsReady(apiUrl, 30, 2000);
  if (!backendReady) {
    console.error(`Backend is not available. Expected URL: ${apiUrl}`);
    throw new Error('Backend is not available');
  }
}

export default globalSetup;
