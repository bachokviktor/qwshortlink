<p align="center"><img src="./frontend/public/logo.svg" height="256px" width="256px" alt="logo" /></p>

# QWShortLink

[![Unit tests](https://github.com/bachokviktor/qwshortlink/actions/workflows/tests.yml/badge.svg)](https://github.com/bachokviktor/qwshortlink/actions/workflows/tests.yml)

URL Shortener built with Django REST Framework and React

## Features

- JWT Authentication
- REST API backend
- Swagger docs
- Caching with Redis
- Containerization with Docker
- Responsive React frontend

## Tech Stack

**Backend:** Django, Django REST Framework, simplejwt, drf-spectacular, django-filter

**Frontend:** React, React Router, Axios

**Infrastructure:** PostgreSQL, Redis, Docker

**Testing:** pytest

## Quickstart

Clone the repository

``` bash
git clone https://github.com/bachokviktor/qwshortlink.git && cd qwshortlink
```

Set appropriate environmental variables in following files:

- `backend/.env`
- `frontend/.env`
- `db/.env`

Add Redis configuration at `redis/redis.conf`

Build container images

``` bash
docker compose build
```

Run the containers with Docker Compose

``` bash
docker compose up
```

**Note:** You may need to restart when running for the first time

Apply migrations

``` bash
docker exec -t qwshortlink-backend python3 manage.py migrate
```

Create a superuser

``` bash
docker exec -it qwshortlink-backend python3 manage.py createsuperuser
```

## Testing

Run unit tests

``` bash
pytest -v
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
