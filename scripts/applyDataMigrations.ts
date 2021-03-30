/// <reference types="./types" />

import DirectusSDK from '@directus/sdk-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import diff from 'diff-arrays-of-objects';

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Ensures that `field` updates go to the right endpoint */
const getPostEndpoint = (collection: string, item: any) =>
  collection === 'fields' ? `fields/${item.collection}` : collection;

const directus = new DirectusSDK(API_URL as string);
directus.auth.token = process.env.ADMIN_TOKEN as string;

(async () => {
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
      await Promise.all(
        diffResult.added.map((item: any) => {
          delete item.pk;
          directus.axios.post(`${API_URL}/${getPostEndpoint(collection, item)}`, item);
        })
      );
      console.log('Done.');
    }
    if (diffResult.updated.length) {
      console.log(`Found ${diffResult.updated.length} updated items in ${collection}`);
      console.log('Applying changes...');
      await Promise.all(
        diffResult.updated.map((item: any) => {
          const pk = item.pk;
          delete item.pk;
          directus.axios.patch(`${API_URL}/${collection}/${pk}`, item);
        })
      );
      console.log('Done.');
    }
    if (diffResult.removed.length) {
      console.log(`Found ${diffResult.removed.length} deleted items in ${collection}`);
      console.log('Applying changes...');
      await Promise.all(
        diffResult.removed.map((item: any) => {
          const pk = item.pk;
          delete item.pk;
          directus.axios.delete(`${API_URL}/${collection}/${pk}`, item);
        })
      );
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
