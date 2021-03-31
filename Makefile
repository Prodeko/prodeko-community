ifneq (,$(wildcard ./.env))
    include .env
    export $(cat .env | sed 's/\"//g')
endif

COMPOSE_PROD := docker-compose -f docker-compose.yml -f docker-compose.prod.yml
COMPOSE_DEV := docker-compose -f docker-compose.yml -f docker-compose.dev.yml

all: build run

install:
	npm install
	npm run build:extensions

initial-setup:
	$(COMPOSE_PROD) up -d database
	$(COMPOSE_PROD) run wait -c database:5432
	cat ./directus/seed.sql | docker-compose exec -T database psql -U ${DB_USER} -d ${DB_DATABASE}

build: run-backend
	$(COMPOSE_PROD) build --no-cache web

setup: install initial-setup apply-migrations build kill

dev:
	$(COMPOSE_DEV) up --build

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
	$(COMPOSE_PROD) up

run-backend:
	$(COMPOSE_PROD) up -d database directus
	$(COMPOSE_PROD) run wait -c database:5432,directus:8055

kill:
	docker-compose kill database directus web
