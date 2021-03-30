
all: build run

dev:
	docker-compose -f docker-compose.dev.yml up --build

build:
	docker-compose up -d database directus
	docker-compose build --no-cache web
	docker-compose kill database directus

run:
	docker-compose up
