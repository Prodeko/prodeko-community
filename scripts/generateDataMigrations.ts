import DirectusSDK from '@directus/sdk-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { groupBy } from '../src/utils/groupBy';

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const email = process.env.ADMIN_EMAIL as string;
const password = process.env.ADMIN_PASSWORD as string;

const directus = new DirectusSDK(API_URL);

const getCollectionPk = (collection: any) => collection.collection;
const getRelationPk = (relation: any) => relation.id;
const getFieldPk = (field: any) => `${field.collection}/${field.field}`;
const getPermissionPk = (permission: any) => permission.id;
const getRolePk = (role: any) => role.id;

const addPk = (func: any) => (item: any) => ({ ...item, pk: func(item) });

/**
 * Directus doesn't support schema migrations yet :(
 */
(async () => {
  await directus.auth.login({ email, password });
  console.log('Generating data migrations...');

  const [collections, fields, roles, permissions, relations] = (
    await Promise.all([
      directus.collections.read(),
      directus.fields.read(),
      directus.roles.read(),
      directus.permissions.read(),
      directus.relations.read(),
    ])
  ).map((r) => r.data);

  // Filter out directus system relations that get generated automatically on install
  const filteredCollections = collections
    ?.filter((c: any) => !c.collection.startsWith('directus'))
    .map(addPk(getCollectionPk));
  const filteredFields = fields
    ?.filter((f: any) => f.meta && !f.meta.system)
    .map(addPk(getFieldPk));
  const filteredRoles = roles
    ?.filter((r: any) => r.name !== 'Admin')
    .map(addPk(getRolePk))
    .map((role: any) => ({ ...role, users: [] }));
  const filteredPermissions = permissions?.filter((p: any) => p.id).map(addPk(getPermissionPk));
  const filteredRelations = relations?.filter((r: any) => !r.system).map(addPk(getRelationPk));

  const groupedFields = groupBy(filteredFields, (field: any) => field.collection);

  const dangerousTypes = ['translations', 'alias', 'o2m', 'm2m', 'm2a'];
  const dangerousFilter = (field: any) =>
    dangerousTypes.includes(field.type) || field.collection === 'languages';

  const dangerousFields = filteredFields?.filter(dangerousFilter);

  const collectionsWithFields = filteredCollections?.map((collection: any) => ({
    ...collection,
    fields: groupedFields[collection.collection]?.filter((field: any) => !dangerousFilter(field)),
  }));

  const sortedCollections = collectionsWithFields
    .sort((a: any, b: any) => (b.collection.includes('translations') ? 1 : -1))
    .sort((a: any, b: any) => (b.collection === 'languages' ? 1 : -1));

  const systemExtensionFields = Object.entries(groupedFields)
    ?.filter(([key]) => key.startsWith('directus'))
    .flatMap(([key, fields]) => fields);

  const data = {
    collections: collectionsWithFields,
    roles: filteredRoles,
    permissions: filteredPermissions,
    fields: [...systemExtensionFields, ...dangerousFields],
    relations: filteredRelations,
  };

  const dataString = JSON.stringify(data, null, 2);

  fs.writeFileSync('./directus/schema.current.json', dataString);

  console.log('Data migrations generated.');
})();
