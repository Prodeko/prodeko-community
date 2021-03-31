/// <reference types="./types" />

import * as dotenv from 'dotenv';
import fs from 'fs';
import diff from 'diff-arrays-of-objects';

dotenv.config();

(async () => {
  console.log('Diffing data migrations...\n');

  const newDataString = fs.readFileSync('./directus/schema.json', 'utf-8');
  const newData = JSON.parse(newDataString);

  const oldDataString = fs.readFileSync('./directus/schema.current.json', 'utf-8');
  const oldData = JSON.parse(oldDataString);

  for (const [collection, data] of Object.entries(newData)) {
    console.log(`Diffing ${collection}...`);
    const diffResult = diff(oldData[collection], data as any, 'pk');

    if (diffResult.added.length) {
      console.log(`Found ${diffResult.added.length} new items in ${collection}:`);
      console.log(diffResult.added);
    }
    if (diffResult.updated.length) {
      console.log(`Found ${diffResult.updated.length} updated items in ${collection}:`);
      console.log(diffResult.updated);
    }
    if (diffResult.removed.length) {
      console.log(`Found ${diffResult.removed.length} deleted items in ${collection}:`);
      console.log(diffResult.removed);
    }
    if (diffResult.same.length === (data as any).length) {
      console.log('No changes found.');
    }
    console.log('');
  }

  console.log('Done.');
})();
