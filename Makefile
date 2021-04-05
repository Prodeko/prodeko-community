# The main file for running project management scripts. This should be used
# most often instead of straight NPM scripts to make sure all the pieces
# play along nicely.

ifneq (,$(wildcard ./.env))
	include .env
	export $(shell sed 's/=.*//' .env)
endif

COMPOSE = docker-compose -f docker-compose.yml -f docker-compose.${ENV}.yml

# Depending on the env, customize the commands being run
ifeq ($(ENV),prod)
	RUN = $(COMPOSE) up -d
else
	# stag, dev
	ifeq ($(ENV), dev)
		RUN = $(COMPOSE) up --build
	else
		RUN = $(COMPOSE) up
	endif
	SEED = cat ./directus/seed.sql | docker-compose exec -T talks-database psql -U ${DB_USER} -d ${DB_DATABASE}
	WAIT = $(COMPOSE) run wait -c ${DB_HOST}:${DB_PORT}
	DATABASE = $(COMPOSE) up -d talks-database
endif

# Default for `make` without any args
all: run

env-test:
	echo $(NEXT_PUBLIC_API_URL)

# We want to build custom Directus extensions on install too
# The removal of `sharp` is a hack to work around dockerignore issues and will
# get removed anyways when Next.js 10.0.3 lands and brings us webassembly
# image optimization
install:
	npm install
	npm run build:extensions

# This shouldn't be ran manually, instead `setup` should be used.
# Seeds the database with initial Directus data so that we don't have to start
# the CMS from scratch every time.
initial-setup:
	$(DATABASE)
	$(WAIT)
	$(SEED)

# Run a bunch of other scripts to complete setup. Should only be run on initial
# setup of the local codebase.
setup: install initial-setup run-backend apply-migrations kill

# Builds the production version of frontend (assuming .env vars set correctly)
build: run-backend
	$(COMPOSE) build talks-web

# Helper for being sure CMS migrations contain only wanted changes
diff-migrations:
	npm run migrate:generate
	npm run migrate:diff

# Saves the current CMS state to the versioned schema file so that the changes
# can be committed to git
save-migrations:
	npm run migrate:generate
	npm run migrate:save

# Applies the version controlled migrations to current CMS instance. Use this
# if you need upstream changes locally.
apply-migrations:
	npm run migrate:generate
	npm run migrate:apply

# Used for migration restoration
swap-migrations:
	mv ./directus/schema.json ./directus/schema.swap.json && \
	mv ./directus/schema.previous.json ./directus/schema.json && \
	mv ./directus/schema.swap.json ./directus/schema.previous.json

# An attempt to undo changes caused by a migration. This should not be relied
# upon, as changing database fields is often destructive
restore-migrations: swap-migrations diff-migrations

# Runs the project in either dev or prod mode, depending on .env variables
run:
	$(RUN)

# Helper for making sure CMS (API) and database are up for static frontend
# builds et cetera
run-backend:
	$(DATABASE)
	$(COMPOSE) up -d talks-cms
	$(WAIT)

# Shut down all project containers
kill:
	docker-compose kill

# This should be run on production server on each new push to the deployed
# branch. Kills the old instance, applies migrations, builds and then runs
deploy:	install run-backend apply-migrations build run
