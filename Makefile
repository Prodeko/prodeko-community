ifneq (,$(wildcard ./.env))
    include .env
	export $(shell sed 's/=.*//' .env)
endif

COMPOSE = docker-compose -f docker-compose.yml -f docker-compose.${ENV}.yml

ifeq ($(ENV),"dev")
	RUN = $(COMPOSE) up --build
else
	RUN = $(COMPOSE) up
endif

all: build run

envtest:
	echo ${COMPOSE}

install:
	npm install
	npm run build:extensions

initial-setup:
	$(COMPOSE) up -d database
	$(COMPOSE) run wait -c ${DB_HOST}:${DB_PORT}
	cat ./directus/seed.sql | docker-compose exec -T database psql -U ${DB_USER} -d ${DB_DATABASE}

setup: install initial-setup run-backend apply-migrations kill

build: run-backend
	$(COMPOSE) build --no-cache web

diff-migrations:
	npm run migrate:generate
	npm run migrate:diff

save-migrations:
	npm run migrate:generate
	npm run migrate:save

apply-migrations:
	npm run migrate:generate
	npm run migrate:apply

dev:
	$(COMPOSE) up --build

run:
	$(RUN)

run-backend:
	$(COMPOSE) up -d database directus
	$(COMPOSE) run wait -c ${DB_HOST}:${DB_PORT},${SERVER_API_URL}

kill:
	docker-compose kill database directus web

deploy:	kill run-backend apply-migrations build run
