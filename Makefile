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
	cat ./directus/seed.sql | docker-compose exec -T database psql -U ${DB_USER} -d ${DB_DATABASE}

build: run-backend
	docker-compose build --no-cache web

setup: install initial-setup apply-migrations build kill

dev:
	docker-compose -f docker-compose.dev.yml up --build

diff-migrations: run-backend
	npm run migrate:generate
	npm run migrate:diff

save-migrations: run-backend
	npm run migrate:generate
	npm run migrate:save

apply-migrations: run-backend
	npm run migrate:generate
	npm run migrate:apply

run:
	docker-compose up

run-backend:
	docker-compose up -d database directus

kill:
	docker-compose kill database directus web
