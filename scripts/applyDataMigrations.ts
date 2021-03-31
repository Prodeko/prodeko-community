/// <reference types="./types" />

import DirectusSDK from '@directus/sdk-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import diff from 'diff-arrays-of-objects';

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const email = process.env.ADMIN_EMAIL as string;
const password = process.env.ADMIN_PASSWORD as string;

/** Ensures that `field` updates go to the right endpoint */
const getPostEndpoint = (collection: string, itemCollection: any) =>
  collection === 'fields' ? `fields/${itemCollection}` : collection;

const directus = new DirectusSDK(API_URL);

(async () => {
  await directus.auth.login({ email, password });
  console.log('Applying data migrations...\n');

  const newDataString = fs.readFileSync('./directus/schema.json', 'utf-8');
  const newData = JSON.parse(newDataString);

  const oldDataString = fs.readFileSync('./directus/schema.current.json', 'utf-8');
  const oldData = JSON.parse(oldDataString);

  for (const [collection, data] of Object.entries(newData)) {
    console.log(`Diffing ${collection}...`);
    const diffResult = diff(oldData[collection], data as any, 'pk');

    if (diffResult.added.length) {
      console.log(`Found ${diffResult.added.length} new items in ${collection}`);
      console.log('Applying changes...');
      for (const item of diffResult.added as any[]) {
        const itemCollection = item.collection;
        delete item.pk;
        await directus.axios
          .post(`${API_URL}/${getPostEndpoint(collection, itemCollection)}`, item)
          .catch((e: any) => console.log(e.response.data));
      }
      console.log('Done.');
    }
    if (diffResult.updated.length) {
      console.log(`Found ${diffResult.updated.length} updated items in ${collection}`);
      console.log('Applying changes...');
      for (const item of diffResult.updated as any[]) {
        const pk = item.pk;
        delete item.pk;
        await directus.axios
          .patch(`${API_URL}/${collection}/${pk}`, item)
          .catch((e: any) => console.log(e.response.data));
      }
      console.log('Done.');
    }
    if (diffResult.removed.length) {
      console.log(`Found ${diffResult.removed.length} deleted items in ${collection}`);
      console.log('Applying changes...');
      for (const item of diffResult.removed as any[]) {
        const pk = item.pk;
        delete item.pk;
        await directus.axios
          .delete(`${API_URL}/${collection}/${pk}`, item)
          .catch((e: any) => console.log(e.response.data));
      }
      console.log('Done.\n');
    }
    if (diffResult.same.length === (data as any).length) {
      console.log('No changes found.');
    }
    console.log('');
  }

  fs.renameSync('./directus/schema.current.json', './directus/schema.previous.json');

  console.log('Data migrations applied.');
})();
