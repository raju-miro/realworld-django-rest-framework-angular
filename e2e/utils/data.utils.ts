import yaml from 'yaml';
import fs from 'fs';
import crypto from 'crypto';

/**
 * Read the test data from the YAML file.
 */
const dataFile = yaml.parse(fs.readFileSync('utils/test-data.yml', 'utf8'));

const uniqueId = () => crypto.randomUUID().slice(0, 12);

/**
 * Get a user from the test data yaml file.
 * @param key - The key of the user.
 * @returns The user with a unique ID added to the username, email, and password.
 */
export const getUser = (key: string) => {
  const id = uniqueId();
  return {
    ...dataFile.users[key],
    username: `${dataFile.users[key].username}_${id}`,
    email: `${dataFile.users[key].email.replace('@example.com', `_${id}@example.com`)}`,
    password: `${dataFile.users[key].password}_${id}`,
  };
};

/**
 * Get an article from the test data yaml file.
 * @param key - The key of the article.
 * @returns The article with a unique ID added to the title, description, body, and tags.
 */
export const getArticle = (key: string) => {
  const id = uniqueId();
  return {
    ...dataFile.articles[key],
    title: `${dataFile.articles[key].title}_${id}`,
    description: `${dataFile.articles[key].description}_${id}`,
    body: `${dataFile.articles[key].body}_${id}`,
    tags: [...dataFile.articles[key].tags],
  };
};
