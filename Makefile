
all: build run

dev:
	docker-compose -f docker-compose.dev.yml up --build

build:
	docker-compose up -d database directus
	docker-compose build --no-cache web
	docker-compose kill database directus

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
