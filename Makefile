
all: build run

build:
	docker-compose up -d database directus
	docker-compose build web
	docker-compose kill database directus

run:
	docker-compose up
