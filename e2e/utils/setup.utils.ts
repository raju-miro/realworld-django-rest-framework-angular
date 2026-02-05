/**
 * Wait until a service is ready.
 * @param url - The URL of the service.
 * @param retries - The number of retries.
 * @param retryDelay - The delay between retries.
 * @returns True if the service is ready, false otherwise.
 */
export const waitUntilServiceIsReady = async (
  url: string,
  retries: number = 30,
  retryDelay: number = 2000,
): Promise<boolean> => {
  let isReady = false;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`Service ${url} is ready`);
        isReady = true;
        break;
      }
    } catch (error) {
      console.error(`Error waiting for service ${url}: ${error}`);
    }
    if (i < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  return isReady;
};
