# Prodeko Community

Web portal for the Prodeko Community, hosting various talks, podcasts, blog posts and discussions.

## Table of Contents

1. [Setup](#setup)
1. [Scripts](#scripts)
1. [Migrations](#migrations)
1. [Project Architecture](#project-architecture)
   1. [Database](#database)
   1. [CMS](#cms)
   1. [Cache](#cache)
   1. [Website](#website)
   1. [Search](#search)
1. [Implementation details](#implementation-details)
   1. [CSS](#css)

## Setup

### TL;DR:

1. Make sure you have `docker-compose`, `make` and `npm` available in `$PATH`
1. Copy the sample `env` file:
   - `cp env.sample .env`
1. Set up and run the local development server:
   - `make setup run`
1. Access website at `http://localhost:3000` and admin UI at `http://localhost:8055`
1. Start developing!

## Scripts

Project management is conducted mainly via `./Makefile`, and the scripts included therein contain sufficient [inline documentations](./Makefile) explaining their usages. Make was chosen as the management interface as it is readily available on practically all Unix-y operating systems, and it can easily interface with all the external command line tools we need to use in our project (`npm`, `docker-compose`, anything else that might come up). Command chaining also allows us to command the project descriptively and neatly, and build up more complex scripts from smaller primitives.

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

**CAUTION!** When pushing to `main` branch, we automatically run migrations against the production database. Be sure to test properly before deploying!

After applying a migration, the previous schema gets saved as `./directus/schema.previous.json`. In case of an unwanted migration, this can be of help, but it should not be relied upon. For a recovery attempt, run `make restore-migrations` (overwriting the version controlled file), check if the printed diff looks like it would help, and try applying it with `make apply-migrations`. This procedure cannot bring back any data lost via removing tables or columns, but the tables or columns themselves might be restorable. If the restoration did not help, use the database backup you saved before attempting to migrate ;)

## Project architecture

The project consists of a few pieces, each running in a separate `docker` container, in order of criticality:

### Database

The project is configured to run a `postgresql` database, using a local docker container during development and the main Prodeko database in production. The main reason for this is simplicity, but in theory the database could be swapped out for any of the [relational databases supported by Directus](https://docs.directus.io/guides/installation/cli/#_1-confirm-minimum-requirements).

One of the main selling points of `directus` is that it's not coupled to the data at all, so if for some reason the project would rather adopt another CMS, the only data tightly coupled with `directus` at the moment are the API permissions and users in comments and likes.

### CMS

The CMS for this project is provided by [Directus](https://directus.io/). It wraps the database, providing a graphical user interface for managing all the tables and rows, including users and permissions for said data. It also creates a RESTful API for all the data (GraphQL too, even though it's a bit more experimental and not currently used), with support for fetching relational data in a single request for nice DX and performance. Directus also helps manage assets, automagically resizing and optimizing images used by the website.

Directus was chosen (as opposed to alternatives like [Strapi](https://strapi.io/) as it can be self-hosted, is easily extensible, has good development velocity, supports internationalization and due to author's personal preferences. Directus also has top notch documentation, which can be useful for learning more: https://docs.directus.io/

To make do with all the functionalities we need, we employ a couple of custom [Directus extensions](https://docs.directus.io/concepts/extensions/):

#### 1. `prodeko-auth`

Directus supports OAuth2 out of the box, at least in theory. Adding third party OAuth providers is documented and seems to work, but not with Prodeko's OAuth for some mysterious reason. It seems that the `django-oauth-toolkit` used by Prodeko's OAuth somehow requires an additional round trip in the authentication flow that's not required by most other providers, so Directus chokes and fails to retrieve the data properly.

To fix the issue, we created a custom endpoint extension to handle the authentication flow as required. The authentication redirects the user to the Prodeko login page, where the user has to log in with existing Prodeko credentials. Then the Prodeko service redirects the user back to our custom endpoint, where the authenticated session is used to retrieve the user's details from the Prodeko API. This data is used to instantiate a new Directus user (identified by the user's email), and the user is granted appropriate permissions to Directus as approximated from the Prodeko user data's flags `is_superuser` and `is_staff`.

After the custom endpoint receives a successful authentication response from the Prodeko API, the authentication management is passed over to Directus' built in user management and authentication token system.

#### 2. `conditional-fields`

In the admin UI when authoring articles (hypernym for blog posts, podcasts, talks) we would like to conditionally show or hide certain fields (embed URLs) based on the content type. This isn't supported by Directus out-of-the-box, but a custom extension exists to provide us with this functionality.

#### 3. `search-sync`

Full text search applications most often require a separate index of optimized data for searching. As we would rather not worry about new articles, edits or deletions, this extension hooks into events emitted by Directus to handle that for us. The extension builds two separate search indices, one for finnish content of articles and one for english, stripping the WYSIGYW text contents from HTML and storing clean JSON blobs of plain text.

### Cache

Even though we utilize static pre-rendering for the website, we still want to hydrate the client's version with the freshest data as soon as possible after then initial load. This can cause multiple separate requests to the api per each visitor, so an easy optimization (that [Directus supports out-of-the-box](https://docs.directus.io/guides/api-config/#cache)) is to use Redis for caching outgoing requests, so that data can be efficiently served without hitting the database and performing the same calculations constantly.

### Website

The website is powered by TypeScript, React, and Next.js. This stack was deemed suitable for a website of mostly static content (articles) but with some dynamic elements (commenting & liking). Smaller dependencies were chosen based on bundle sizes, DX, open source activity and of course familiarity (and other biased metrics).

As is true with most anglocentric and popular software, internationalization (i18n) is rarely a first class citizen. This forces some compromises, as is evident from the code structure discussed below.

As the usage of the website requires little to no statefulness, we simply omit any state management libraries and focus on consuming data straight from the API, as the few stateful needs we have are easily fulfilled with React's build in `useState` hook. In the archive pages we also use the most OG state manager of all web, the URL.

The website gets statically pre-rendered with data from the CMS on each restart, and with Next.js' [incremental static generation](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) the static files also get updated with fresh data between requests. This isn't always enough on the client though, as the last missing piece we use [SWR](https://swr.vercel.app/) for the freshest data available after the client has hydrated a functional React application from the static HTML.

### Search

For the full-text-search layer of the app we have an optimized but simple [MeiliSearch](https://www.meilisearch.com/). As we won't likely need such heavy clusterization as one would when setting up ElasticSearch, this fulfills our needs with a simple to use container that can easily be integrated with our CMS and website. MeiliSearch operates through an HTTP API, and stores our data as JSON blobs in highly optimized search indices.

When setting up the search service, one needs to [generate a public key with read-only privileges](https://docs.meilisearch.com/reference/features/authentication.html) for our website to use. For this you need to have a `.env` file set up with the variable `MEILI_MASTER_KEY`. After this the MeiliSearch container should be started with `make run-backend`, and the keys fetched with, for example, curl:

```sh
curl -i -H "x-Meili-API-Key: <MEILI_MASTER_KEY>" <MEILI_HOST>:<MEILI_PORT>/keys
```

After that we can set the environment variable `NEXT_PUBLIC_SEARCH_KEY` with the response's `public` key.

## Implementation details

### CSS

For styling we use `styled-components`, as it provides great ergonomics, allows the writing of (almost) pure CSS, helps to convey the meaning behind individual `<div>`s and has support for static rendering with `next.js`.

Most interactive styles are applied not via custom properties, but actually useful `aria`-attributes, which also help screen readers interpret the interactivities.

Layout uses CSS grid for the most part, as it is widely supported by now. The main layout consists of three columns, of which the centermost has the page's contents and two oters serve as responsive margins.

Quite often one can find a css rule akin to `* + *`, which is commonly(?) known as the _Lobotomized Owl_ selector, which basically helps space the children of the element. A nice article explaining the mechanics and intentions can be found here: https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/
