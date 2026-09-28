# Django Menu

Each branch contains a different menu design, while the runtime structure is shared.

## Local development

```sh
cp .env.example .env
docker compose up --build
```

The application listens on the host port configured by `HOST_PORT`.

## Tests

```sh
docker compose run --rm web python manage.py test
```

Generated `staticfiles/`, SQLite databases, virtual environments, and `.env` files are deployment-only and must not be committed.
