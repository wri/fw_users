.PHONY:

up-and-build:
	docker-compose up -d --build

up:
	docker-compose up -d

down:
	docker-compose down

lint:
	docker-compose run develop yarn run lint

logs:
	docker logs -f fw-users # TODO: Update name in final service

tests:
	docker logs -f fw-users-test # TODO: Update name in final service
