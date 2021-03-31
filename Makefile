ifneq (,$(wildcard ./.env))
    include .env
    export $(cat .env | sed 's/\"//g')
endif

all: build run

install:
	npm install
	npm run build:extensions

initial-setup:
	docker-compose up -d database
	cat ./directus/seed.sql | docker exec -i prodeko-seminar-database psql -U ${DB_USER} ${DB_DATABASE}
	docker-compose up -d directus

initial-setup-cleanup:
	docker-compose kill database directus

build:
	docker-compose up -d database directus
	docker-compose build --no-cache web
	docker-compose kill database directus

setup: install initial-setup apply-migrations build initial-setup-cleanup

dev:
	docker-compose -f docker-compose.dev.yml up --build

diff-migrations:
	npm run migrate:generate
	npm run migrate:diff

save-migrations:
	npm run migrate:generate
	npm run migrate:save

apply-migrations:
	npm run migrate:generate
	npm run migrate:apply

run:
	docker-compose up
