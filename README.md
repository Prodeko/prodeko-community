# Prodeko Seminar

TODO: docs

## Setup

TL;DR:

1. Make sure you have `docker-compose`, `make` and `npm` available in `$PATH`
2. Copy the sample `env` file:
   - `cp env.sample .env`
3. Set up and run the local development server:
   - `make setup run`

## Scripts

Project management is conducted mainly via `./Makefile`.

## Migrations

Directus doesn't yet support proper schema migrations ([relevant GH discussion](https://github.com/directus/directus/discussions/3891)), but we really want to be able to version our admin UI and data structures. The `./scripts` folder contains just that!

The beef, `./directus/schema.json`, is basically an API dump of selected directus system collections (i.e. database tables), which make up most of the configuration we want to be portable:

```typescript
[
  'directus_collections',
  'directus_fields',
  'directus_roles',
  'directus_permissions',
  'directus_relations',
];
```

The only difference is that we generate an extra field for each item named `pk` (for Primary Key), which we populate with each item's identifiers. This is needed to diff the arrays properly, and to apply the changes via Directus's API methods.

**CAUTION!** Using the `applyDataMigrations.ts` script (via `make apply-migrations`, `npm run migrate:apply` or just manually) manipulates the database tables and columns, and thus can cause destructive data loss. Diffing changes before applying them is strongly encouraged, and always take backups!

Most often we want to develop and test changes locally, for which we just use the admin UI. When it seems like we have made the desired changes, we can check whether the changes look good or not with `make diff-migrations`, and when they do we update our `./directus/schema.json` with `make apply-migrations`.

(TODO: implement) **CAUTION!** When pushing to `main` branch, we automatically run migrations against the production database. Be sure to test properly before deploying!

After applying a migration, the previous schema gets saved as `./directus/schema.previous.json`. In case of an unwanted migration, this can be of help, but it should not be relied upon. For a recovery attempt, rename `schema.previous.json` to `schema.json` (overwriting the version controlled file), check if `make diff-migrations` looks like it would help, and try applying it with `make apply-migrations`. If it did not help, use the database backup you saved before attempting to migrate ;)
